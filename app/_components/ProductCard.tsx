'use client'
import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ProductCard() {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');

  const product = {
    name: 'Premium Wireless Headphones',
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    badge: 'Best Seller',
    discount: 25,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['var(--foreground)', 'var(--muted)', 'var(--primary)'],
    inStock: true
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-8">
      <Card 
        className="w-full max-w-sm overflow-hidden transition-all duration-300 hover:shadow-2xl border-0 bg-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0">
          {/* Image Container */}
          <div className="relative overflow-hidden bg-muted group">
            <img 
              src={product.image}
              alt={product.name}
              className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-destructive text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                -{product.discount}%
              </span>
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                {product.badge}
              </span>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="absolute top-4 right-4 p-2 bg-card/90 backdrop-blur-sm rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            >
              <Heart 
                className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-destructive text-destructive' : 'text-foreground'}`}
              />
            </button>

            {/* Quick Actions */}
            <div 
              className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 transition-all duration-300 ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Button 
                size="sm" 
                variant="secondary"
                className="bg-card/90 backdrop-blur-sm hover:bg-card shadow-lg"
              >
                <Eye className="w-4 h-4 mr-1" />
                Quick View
              </Button>
            </div>
          </div>

          {/* Product Details */}
          <div className="p-6 space-y-4">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews})
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-foreground leading-tight">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">
                ${product.price}
              </span>
              <span className="text-lg text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            </div>

            {/* Colors */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Colors</p>
              <div className="flex gap-2">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    className="w-8 h-8 rounded-full border-2 border-border hover:border-foreground transition-all hover:scale-110"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Size</p>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedSize === size
                        ? 'bg-foreground text-background'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              <span className="text-sm text-accent font-medium">In Stock</span>
            </div>

            {/* Add to Cart Button */}
            <Button 
              className="w-full bg-foreground hover:bg-foreground/90 text-background font-semibold py-6 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}