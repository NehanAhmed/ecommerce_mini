import mongoose, { Schema, Document, Model } from 'mongoose';

// TypeScript interface for Product document
export interface IProduct extends Document {
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
  addedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
    },
    compareAtPrice: {
      type: Number,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      required: [true, 'At least one product image is required'],
      validate: {
        validator: (v: string[]) => v.length >= 1,
        message: 'Product must have at least one image',
      },
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      default: 0,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    specifications: {
      type: Map,
      of: String,
    },
    tags: {
      type: [String],
      default: [],
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Admin user reference is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for optimized queries
ProductSchema.index({ slug: 1 });
ProductSchema.index({ sku: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ isActive: 1, isFeatured: 1 });

/**
 * Pre-save hook to auto-generate slug and validate business rules
 * - Generates URL-friendly slug from product name
 * - Validates price is positive
 * - Validates stock is non-negative
 * - Ensures compareAtPrice (if provided) is greater than price
 */
ProductSchema.pre('save', function (next) {
  // Generate slug only if name is new or modified
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  // Validate price is positive
  if (this.price <= 0) {
    return next(new Error('Price must be greater than 0'));
  }

  // Validate stock is non-negative
  if (this.stock < 0) {
    return next(new Error('Stock cannot be negative'));
  }

  // Validate compareAtPrice if provided
  if (this.compareAtPrice !== undefined && this.compareAtPrice !== null) {
    if (this.compareAtPrice <= this.price) {
      return next(
        new Error('Compare at price must be greater than the selling price')
      );
    }
  }

  next();
});

// Create and export the Product model
const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
