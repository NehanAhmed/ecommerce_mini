import { Product, type IProduct } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

// Shape of dynamic route parameters for this route
interface RouteParams {
  slug: string;
}

// Standardized error response payload
interface ErrorResponse {
  message: string;
  errors?: string[];
}

// Successful product response payload
interface ProductResponse {
  message: string;
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    category: string;
    brand?: string;
    images: string[];
    stock: number;
    sku: string;
    isActive: boolean;
    isFeatured: boolean;
    specifications?: Record<string, string>;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
  };
}

// GET /api/[slug] - fetch a single active product by its slug
export async function GET(
  _req: NextRequest,
  context: { params: Promise<RouteParams> }
): Promise<NextResponse<ErrorResponse | ProductResponse>> {
  try {
    // Await params before accessing properties
    const { slug } = await context.params;

    // Basic validation for slug param
    if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
      return NextResponse.json<ErrorResponse>(
        {
          message: "Invalid slug parameter",
          errors: ["Slug is required and must be a non-empty string"],
        },
        { status: 400 }
      );
    }

    // Enforce a safe slug format (mirrors how slugs are generated)
    const normalizedSlug = slug.toLowerCase().trim();
    const slugPattern = /^[a-z0-9-]+$/;

    if (!slugPattern.test(normalizedSlug)) {
      return NextResponse.json<ErrorResponse>(
        {
          message: "Invalid slug format",
          errors: [
            "Slug may only contain lowercase letters, numbers, and hyphens",
          ],
        },
        { status: 400 }
      );
    }

    // Ensure database connection is established
    await connectDB();

    // Find a single active product by slug
    const productDoc = await Product.findOne({
      slug: normalizedSlug,
      isActive: true,
    });

    if (!productDoc) {
      return NextResponse.json<ErrorResponse>(
        {
          message: "Product not found",
          errors: [
            `No active product found for slug '${normalizedSlug}'`,
          ],
        },
        { status: 404 }
      );
    }

    // Convert Mongoose document to a plain JS object for safe serialization
    const product = productDoc.toObject() as IProduct;

    const responseBody: ProductResponse = {
      message: "Product fetched successfully",
      product: {
        id: product._id.toString(),
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        category: product.category,
        brand: product.brand,
        images: product.images,
        stock: product.stock,
        sku: product.sku,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        specifications: product.specifications as Record<string, string> | undefined,
        tags: product.tags,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      },
    };

    return NextResponse.json<ProductResponse>(responseBody, { status: 200 });
  } catch (error: unknown) {
    // Log detailed error for observability, but keep response generic in production
    console.error("Error fetching product by slug:", error);

    const isDev = process.env.NODE_ENV === "development";

    return NextResponse.json<ErrorResponse>(
      {
        message: "Internal server error",
        errors: [
          isDev && error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        ],
      },
      { status: 500 }
    );
  }
}
