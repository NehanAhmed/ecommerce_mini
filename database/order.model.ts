import mongoose, { Schema, Document, Model } from 'mongoose';
import Product from './product.model';

// TypeScript interfaces for nested objects
export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface IShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

// TypeScript interface for Order document
export interface IOrder extends Document {
  orderNumber: string;
  customerId?: mongoose.Types.ObjectId;
  customerEmail: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  paymentMethod?: string;
  shippingAddress: IShippingAddress;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    total: {
      type: Number,
      required: [true, 'Item total is required'],
    },
  },
  { _id: false }
);

const ShippingAddressSchema = new Schema<IShippingAddress>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    addressLine1: {
      type: String,
      required: [true, 'Address line 1 is required'],
      trim: true,
    },
    addressLine2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      unique: true,
      uppercase: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    items: {
      type: [OrderItemSchema],
      required: [true, 'Order items are required'],
      validate: {
        validator: (v: IOrderItem[]) => v.length >= 1,
        message: 'Order must contain at least one item',
      },
    },
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal cannot be negative'],
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative'],
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: [0, 'Shipping cost cannot be negative'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
    paymentMethod: {
      type: String,
      trim: true,
    },
    shippingAddress: {
      type: ShippingAddressSchema,
      required: [true, 'Shipping address is required'],
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for optimized queries
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ customerId: 1 });
OrderSchema.index({ customerEmail: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });

/**
 * Pre-save hook for order validation and auto-generation
 * - Generates unique order number (ORD-YYYYMMDD-XXXX) on creation
 * - Verifies all referenced products exist in database
 * - Validates each item's total = quantity × price
 * - Validates totalAmount = subtotal + tax + shippingCost
 */
OrderSchema.pre('save', async function (next) {
  try {
    // Generate unique order number only on creation
    if (this.isNew && !this.orderNumber) {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number

      this.orderNumber = `ORD-${year}${month}${day}-${random}`;
    }

    // Verify all referenced products exist
    const productIds = this.items.map((item) => item.productId);
    const existingProducts = await Product.find({
      _id: { $in: productIds },
    }).select('_id');

    if (existingProducts.length !== productIds.length) {
      const existingIds = existingProducts.map((p) => String((p as { _id: unknown })._id));
      const missingIds = productIds.filter(
        (id) => !existingIds.includes(id.toString())
      );
      return next(
        new Error(
          `Product(s) not found: ${missingIds.join(', ')}`
        )
      );
    }

    // Validate each item's total = quantity × price
    for (const item of this.items) {
      const expectedTotal = item.quantity * item.price;
      if (Math.abs(item.total - expectedTotal) > 0.01) {
        return next(
          new Error(
            `Invalid item total for ${item.productName}. Expected ${expectedTotal.toFixed(
              2
            )}, got ${item.total.toFixed(2)}`
          )
        );
      }
    }

    // Validate totalAmount = subtotal + tax + shippingCost
    const expectedTotal = this.subtotal + this.tax + this.shippingCost;
    if (Math.abs(this.totalAmount - expectedTotal) > 0.01) {
      return next(
        new Error(
          `Invalid total amount. Expected ${expectedTotal.toFixed(
            2
          )}, got ${this.totalAmount.toFixed(2)}`
        )
      );
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

// Create and export the Order model
const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
