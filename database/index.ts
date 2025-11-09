// Central export point for all database models
export { default as Product } from './product.model';
export { default as Order } from './order.model';

// Export TypeScript interfaces for use throughout the application
export type { IProduct } from './product.model';
export type { IOrder, IOrderItem, IShippingAddress } from './order.model';
