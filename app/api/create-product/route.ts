import { IProduct, Product } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// Type for the validated product data
interface ProductInput {
    name: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    category: string;
    brand?: string;
    images: string[];
    stock: number;
    sku: string;
    isActive?: boolean;
    isFeatured?: boolean;
    specifications?: Record<string, string>;
    tags?: string[];
    addedBy: string;
}

// Validation helper
function validateProductInput(data: Record<string, unknown>): {
    isValid: boolean;
    errors: string[];
    product?: ProductInput;
} {
    const errors: string[] = [];

    // Required fields validation
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
        errors.push('Product name is required and must be a non-empty string');
    }

    if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
        errors.push('Product description is required and must be a non-empty string');
    }

    if (!data.category || typeof data.category !== 'string' || data.category.trim().length === 0) {
        errors.push('Product category is required and must be a non-empty string');
    }

    if (!data.sku || typeof data.sku !== 'string' || data.sku.trim().length === 0) {
        errors.push('SKU is required and must be a non-empty string');
    }

    if (!data.addedBy || typeof data.addedBy !== 'string' || !mongoose.Types.ObjectId.isValid(data.addedBy)) {
        errors.push('Valid addedBy user ID is required');
    }

    // Price validation
    const price = Number(data.price);
    if (isNaN(price) || price <= 0) {
        errors.push('Price must be a positive number');
    }

    // Stock validation
    const stock = Number(data.stock);
    if (isNaN(stock) || stock < 0) {
        errors.push('Stock must be a non-negative number');
    }

    // Images validation
    let images: string[] = [];
    if (typeof data.images === 'string') {
        try {
            images = JSON.parse(data.images);
        } catch {
            errors.push('Images must be a valid JSON array of strings');
        }
    } else if (Array.isArray(data.images)) {
        images = data.images;
    } else {
        errors.push('Images must be an array of strings');
    }

    if (images.length === 0) {
        errors.push('At least one product image is required');
    }

    if (!images.every(img => typeof img === 'string' && img.trim().length > 0)) {
        errors.push('All images must be valid non-empty strings');
    }

    // Optional compareAtPrice validation
    let compareAtPrice: number | undefined;
    if (data.compareAtPrice !== undefined && data.compareAtPrice !== null && data.compareAtPrice !== '') {
        compareAtPrice = Number(data.compareAtPrice);
        if (isNaN(compareAtPrice)) {
            errors.push('Compare at price must be a valid number');
        } else if (compareAtPrice <= price) {
            errors.push('Compare at price must be greater than the selling price');
        }
    }

    // Optional fields with type checking
    let brand: string | undefined;
    if (data.brand && typeof data.brand === 'string') {
        brand = data.brand.trim();
    }

    let isActive: boolean = true;
    if (data.isActive !== undefined && data.isActive !== null && data.isActive !== '') {
        isActive = data.isActive === 'true' || data.isActive === true;
    }

    let isFeatured: boolean = false;
    if (data.isFeatured !== undefined && data.isFeatured !== null && data.isFeatured !== '') {
        isFeatured = data.isFeatured === 'true' || data.isFeatured === true;
    }

    // Parse specifications if provided
    let specifications: Record<string, string> | undefined;
    if (data.specifications) {
        if (typeof data.specifications === 'string') {
            try {
                specifications = JSON.parse(data.specifications);
                if (typeof specifications !== 'object' || specifications === null) {
                    errors.push('Specifications must be a valid JSON object');
                }
            } catch {
                errors.push('Specifications must be valid JSON');
            }
        } else if (typeof data.specifications === 'object') {
            specifications = data.specifications as Record<string, string>;
        }
    }

    // Parse tags if provided
    let tags: string[] | undefined;
    if (data.tags) {
        if (typeof data.tags === 'string') {
            try {
                tags = JSON.parse(data.tags);
                if (!Array.isArray(tags) || !tags.every(tag => typeof tag === 'string')) {
                    errors.push('Tags must be an array of strings');
                }
            } catch {
                errors.push('Tags must be valid JSON array');
            }
        } else if (Array.isArray(data.tags)) {
            tags = data.tags;
        }
    }

    if (errors.length > 0) {
        return { isValid: false, errors };
    }

    const product: ProductInput = {
        name: (data.name as string).trim(),
        description: (data.description as string).trim(),
        price,
        category: (data.category as string).trim(),
        images,
        stock,
        sku: (data.sku as string).trim(),
        isActive,
        isFeatured,
        addedBy: data.addedBy as string,
    };

    if (compareAtPrice !== undefined) {
        product.compareAtPrice = compareAtPrice;
    }
    if (brand) {
        product.brand = brand;
    }
    if (specifications) {
        product.specifications = specifications;
    }
    if (tags && tags.length > 0) {
        product.tags = tags;
    }

    return { isValid: true, errors: [], product };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        // Connect to database
        await connectDB();

        // Parse form data
        const formData = await req.formData();
        const rawData = Object.fromEntries(formData.entries());

        // Validate input
        const validation = validateProductInput(rawData);

        if (!validation.isValid) {
            return NextResponse.json(
                {
                    message: 'Validation failed',
                    errors: validation.errors
                },
                { status: 400 }
            );
        }

        // Create product with validated data
        const createdProduct = await Product.create(validation.product);

        // Return sanitized response (exclude sensitive fields if any)
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
                }
            },
            { status: 201 }
        );

    } catch (error: unknown) {
        console.error('Error creating product:', error);

        // Handle MongoDB duplicate key errors
        if (error instanceof Error && 'code' in error && error.code === 11000) {
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