'use client'
import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, Eye, Share2, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AddToCartButton from './AddToCartButton';

interface ProductCardProps {
  product: {
    _id:string
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
  };
  onQuickView?: () => void;
  onAddToCart?: () => void;
}

export default function ProductCard({ product, onQuickView, onAddToCart }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  // Calculate discount percentage
  const discountPercentage = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  // Calculate rating deterministically based on product SKU to avoid hydration mismatch
  const skuHash = product.sku.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rating = 4.5 + ((skuHash % 5) / 10);
  const reviews = ((skuHash % 450) + 50);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    if (onAddToCart) onAddToCart();
    setIsAddingToCart(false);
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleShare = () => {
    setShowShareTooltip(true);
    setTimeout(() => setShowShareTooltip(false), 2000);
  };

  return (
    <Card
      className="w-full max-w-md mx-auto overflow-hidden transition-all duration-500 hover:shadow-2xl border-0 bg-card rounded-3xl relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
      }}
    >
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-muted aspect-square">
          {/* Main Image */}
          <div className="relative w-full h-full">
            <img
              src={product.images?.[currentImageIndex] || product.images?.[0] || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-700"
              style={{
                transform: isHovered ? 'scale(1.1) rotate(2deg)' : 'scale(1) rotate(0deg)',
              }}
            />

            {/* Gradient Overlay on Hover */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-500 pointer-events-none"
              style={{ opacity: isHovered ? 1 : 0 }}
            />
          </div>

          {/* Image Navigation Dots */}
          {product.images && product.images.length > 1 && (
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className="group/dot relative"
                >
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${currentImageIndex === index
                      ? 'bg-white w-6'
                      : 'bg-white/50 hover:bg-white/75 w-2'
                      }`}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Top Badges */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col gap-2 z-10">
            {product.isFeatured && (
              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-destructive text-white text-xs font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                -{discountPercentage}% OFF
              </span>
            )}
            {product.stock < 10 && product.stock > 0 && (
              <span className="bg-orange-500 text-white text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg">
                Only {product.stock} left
              </span>
            )}
          </div>

          {/* Action Buttons - Top Right */}
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col gap-2 z-10">
            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className="relative p-2 sm:p-2.5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <Heart
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${isWishlisted
                  ? 'fill-red-500 text-red-500 scale-110'
                  : 'text-foreground'
                  }`}
              />
              {isWishlisted && (
                <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
              )}
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="relative p-2 sm:p-2.5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
              {showShareTooltip && (
                <div className="absolute top-0 right-full mr-2 px-3 py-1 bg-foreground text-background text-xs font-medium rounded-lg whitespace-nowrap">
                  Link Copied!
                </div>
              )}
            </button>
          </div>

          {/* Quick Actions - Bottom (Visible on Hover) */}
          <div
            className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex gap-2 transition-all duration-500 z-10"
            style={{
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            <Link href={`products/${product.slug}`} className='flex-1 w-full'>
              <Button
                onClick={onQuickView}
                size="sm"
                variant="secondary"
                className="flex-1 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md hover:bg-white dark:hover:bg-neutral-800 shadow-lg border-0 font-semibold transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Quick View
              </Button>
            </Link>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4 sm:p-5 space-y-2.5 sm:space-y-3">
          {/* Category & Brand */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {product.category}
            </span>
            {product.brand && (
              <span className="text-xs font-semibold text-primary">
                {product.brand}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-foreground leading-tight line-clamp-2 min-h-[2.5rem] sm:min-h-[3.5rem] hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 ${i < Math.floor(rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-muted-foreground/30'
                    }`}
                />
              ))}
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground font-medium">
              {rating.toFixed(1)} <span className="text-muted-foreground/60">({reviews})</span>
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-2 sm:gap-3 pt-1 sm:pt-2">
            <span className="text-2xl sm:text-3xl font-bold text-foreground">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-base sm:text-lg text-muted-foreground line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {product.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-muted text-muted-foreground font-medium hover:bg-muted/80 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Stock Status */}
          <div className="flex items-center gap-2 py-1.5 sm:py-2">
            <div
              className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' :
                product.stock > 0 ? 'bg-orange-500' :
                  'bg-red-500'
                } animate-pulse`}
            />
            <span className={`text-xs sm:text-sm font-semibold ${product.stock > 10 ? 'text-green-600 dark:text-green-400' :
              product.stock > 0 ? 'text-orange-600 dark:text-orange-400' :
                'text-red-600 dark:text-red-400'
              }`}>
              {product.stock > 10 ? 'In Stock' :
                product.stock > 0 ? `Low Stock (${product.stock})` :
                  'Out of Stock'}
            </span>
          </div>

          {/* Add to Cart Button */}
          <AddToCartButton product={{ name: product.name, image: product.images[0], price: product.price, slug: product.slug, id: product._id }} />

        </div>
      </CardContent>

      {/* Hover Glow Effect */}
      <div
        className="absolute inset-0 rounded-3xl transition-opacity duration-500 pointer-events-none"
        style={{
          opacity: isHovered ? 1 : 0,
          boxShadow: '0 0 40px rgba(59, 130, 246, 0.3)',
        }}
      />
    </Card>
  );
}