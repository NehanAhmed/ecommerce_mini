import { Product } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import type { ProductInput } from "@/types/product";
import { uploadFilesToCloudinary } from "@/lib/cloudinary-buffer";

// Validation helper for FormData
async function validateProductFormData(formData: FormData): Promise<{
    isValid: boolean;
    errors: string[];
    product?: Omit<ProductInput, 'images'>;
    files?: File[];
}> {
    const errors: string[] = [];

    // Extract form fields
    const name = formData.get('name');
    const description = formData.get('description');
    const priceStr = formData.get('price');
    const category = formData.get('category');
    const sku = formData.get('sku');
    const stockStr = formData.get('stock');
    const addedBy = formData.get('addedBy');
    const brand = formData.get('brand');
    const compareAtPriceStr = formData.get('compareAtPrice');
    const isActiveStr = formData.get('isActive');
    const isFeaturedStr = formData.get('isFeatured');
    const specificationsStr = formData.get('specifications');
    const tagsStr = formData.get('tags');

    // Required fields validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        errors.push('Product name is required and must be a non-empty string');
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
        errors.push('Product description is required and must be a non-empty string');
    }

    if (!category || typeof category !== 'string' || category.trim().length === 0) {
        errors.push('Product category is required and must be a non-empty string');
    }

    if (!sku || typeof sku !== 'string' || sku.trim().length === 0) {
        errors.push('SKU is required and must be a non-empty string');
    }

    if (!addedBy || typeof addedBy !== 'string' || !mongoose.Types.ObjectId.isValid(addedBy)) {
        errors.push('Valid addedBy user ID is required');
    }

    // Price validation
    const price = priceStr ? Number(priceStr) : NaN;
    if (isNaN(price) || price <= 0) {
        errors.push('Price must be a positive number');
    }

    // Stock validation
    const stock = stockStr ? Number(stockStr) : NaN;
    if (isNaN(stock) || stock < 0) {
        errors.push('Stock must be a non-negative number');
    }

    // Files validation
    const files: File[] = [];
    const imageFiles = formData.getAll('images');
    
    if (imageFiles.length === 0) {
        errors.push('At least one product image is required');
    } else {
        for (const file of imageFiles) {
            if (file instanceof File && file.size > 0) {
                files.push(file);
            } else {
                errors.push('Invalid image file format');
                break;
            }
        }
    }

    // Optional compareAtPrice validation
    let compareAtPrice: number | undefined;
    if (compareAtPriceStr && typeof compareAtPriceStr === 'string' && compareAtPriceStr.trim() !== '') {
        compareAtPrice = Number(compareAtPriceStr);
        if (isNaN(compareAtPrice)) {
            errors.push('Compare at price must be a valid number');
        } else if (compareAtPrice <= price) {
            errors.push('Compare at price must be greater than the selling price');
        }
    }

    // Optional fields
    const isActive = !isActiveStr || isActiveStr === 'true' || isActiveStr === '1';
    const isFeatured = isFeaturedStr === 'true' || isFeaturedStr === '1';

    // Parse specifications if provided
    let specifications: Record<string, string> | undefined;
    if (specificationsStr && typeof specificationsStr === 'string') {
        try {
            specifications = JSON.parse(specificationsStr);
            if (typeof specifications !== 'object' || specifications === null || Array.isArray(specifications)) {
                errors.push('Specifications must be a valid JSON object');
                specifications = undefined;
            }
        } catch {
            errors.push('Specifications must be valid JSON');
        }
    }

    // Parse tags if provided
    let tags: string[] | undefined;
    if (tagsStr && typeof tagsStr === 'string') {
        try {
            tags = JSON.parse(tagsStr);
            if (!Array.isArray(tags) || !tags.every(tag => typeof tag === 'string')) {
                errors.push('Tags must be an array of strings');
                tags = undefined;
            }
        } catch {
            errors.push('Tags must be valid JSON array');
        }
    }

    if (errors.length > 0) {
        return { isValid: false, errors };
    }

    const product: Omit<ProductInput, 'images'> = {
        name: (name as string).trim(),
        description: (description as string).trim(),
        price,
        category: (category as string).trim(),
        stock,
        sku: (sku as string).trim(),
        isActive,
        isFeatured,
        addedBy: addedBy as string,
        images: [], // Will be filled after upload
    };

    if (compareAtPrice !== undefined) {
        product.compareAtPrice = compareAtPrice;
    }
    if (brand && typeof brand === 'string' && brand.trim()) {
        product.brand = brand.trim();
    }
    if (specifications) {
        product.specifications = specifications;
    }
    if (tags && tags.length > 0) {
        product.tags = tags;
    }

    return { isValid: true, errors: [], product, files };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        // Connect to database
        await connectDB();

        // Parse FormData
        let formData: FormData;
        try {
            formData = await req.formData();
        } catch (error) {
            console.error('Error parsing FormData:', error);
            return NextResponse.json(
                {
                    message: "Invalid request body",
                    errors: ["Request body must be FormData"],
                },
                { status: 400 }
            );
        }

        const validation = await validateProductFormData(formData);

        if (!validation.isValid) {
            return NextResponse.json(
                {
                    message: 'Validation failed',
                    errors: validation.errors
                },
                { status: 400 }
            );
        }

        if (!validation.product || !validation.files) {
            return NextResponse.json(
                {
                    message: 'Validation failed',
                    errors: ['Product data or files are missing']
                },
                { status: 400 }
            );
        }

        // Upload images to Cloudinary
        const uploadResult = await uploadFilesToCloudinary(
            validation.files,
            'ecommerce_mini'
        );

        if (!uploadResult.success) {
            return NextResponse.json(
                {
                    message: 'Image upload failed',
                    error: uploadResult.error,
                    failedFile: uploadResult.failedFile,
                },
                { status: 400 }
            );
        }

        // Create product with uploaded image URLs
        const productData: ProductInput = {
            ...validation.product,
            images: uploadResult.uploadedUrls,
        };

        const createdProduct = await Product.create(productData);

        // Return sanitized response
        return NextResponse.json(
            {
                message: 'Product created successfully',
                product: {
                    id: createdProduct._id,
                    name: createdProduct.name,
                    slug: createdProduct.slug,
                    price: createdProduct.price,
                    category: createdProduct.category,
                    sku: createdProduct.sku,
                    stock: createdProduct.stock,
                    isActive: createdProduct.isActive,
                    images: createdProduct.images,
                }
            },
            { status: 201 }
        );

    } catch (error: unknown) {
        console.error('Error creating product:', error);

        // Handle MongoDB duplicate key errors
        if (error instanceof Error && 'code' in error && (error as { code: number }).code === 11000) {
            return NextResponse.json(
                {
                    message: 'Product with this SKU or slug already exists',
                    error: 'Duplicate key error'
                },
                { status: 409 }
            );
        }

        // Handle Mongoose validation errors
        if (error instanceof Error && error.name === 'ValidationError') {
            return NextResponse.json(
                {
                    message: 'Validation error',
                    error: error.message
                },
                { status: 400 }
            );
        }

        // Generic error response
        return NextResponse.json(
            {
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development'
                    ? (error instanceof Error ? error.message : 'Unknown error')
                    : 'An unexpected error occurred'
            },
            { status: 500 }
        );
    }
}