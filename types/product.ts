export interface ProductInput {
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
