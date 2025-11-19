'use client'

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Star, Filter, Search, ChevronDown, Sparkles, TrendingUp, Zap } from 'lucide-react';
import ProductCard from '@/app/_components/ProductCard';
import { IProduct } from '@/database';

const ProductsPage = ({ products: initialData }: { products: IProduct }) => {
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [scrollY, setScrollY] = useState(0);
    const [likedProducts, setLikedProducts] = useState(new Set());
    const dataArray = Array.isArray(initialData) ? initialData : []

    const sanitizedData = (dataArray || []).map((item) => ({
        name: item.name || "Unknown Product",
        slug: item.slug || "",
        description: item.description || "Premium product with excellent quality",
        price: item.price ?? 0,
        compareAtPrice: item.compareAtPrice,
        category: item.category || "Uncategorized",
        brand: item.brand,
        images: item.images || ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
        stock: item.stock ?? 0,
        sku: item.sku || "N/A",
        isActive: item.isActive ?? false,
        isFeatured: item.isFeatured ?? false,
        specifications: item.specifications || {},
        tags: item.tags || ['Popular', 'Quality'],
        createdAt: item.createdAt || new Date().toISOString(),
    }))
    const [data, setdata] = useState(() => sanitizedData)

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const categories = [
        { id: 'all', name: 'All Products', icon: Sparkles },
        { id: 'trending', name: 'Trending', icon: TrendingUp },
        { id: 'new', name: 'New Arrivals', icon: Zap },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-blue-950/20">
            {/* Animated Background Pattern */}
            <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgb(59 130 246 / 0.15) 2px, transparent 0)`,
                        backgroundSize: '64px 64px',
                        transform: `translateY(${scrollY * 0.2}px)`
                    }}
                />
            </div>

            {/* Hero Section */}
            <div className="relative z-10 overflow-hidden pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-24 pb-12 sm:pb-16">
                    <div className="text-center space-y-4 sm:space-y-6">
                        <div
                            className="inline-block"
                            style={{
                                animation: 'fadeInUp 0.8s ease-out',
                            }}
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm font-semibold">
                                <Sparkles className="w-4 h-4" />
                                Discover Our Collection
                            </span>
                        </div>

                        <h1
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-none"
                            style={{
                                animation: 'fadeInUp 0.8s ease-out 0.1s backwards',
                                background: 'linear-gradient(to right, #171717, #525252, #171717)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                        >
                            Premium
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Products
                            </span>
                        </h1>

                        <p
                            className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed px-4"
                            style={{
                                animation: 'fadeInUp 0.8s ease-out 0.2s backwards',
                            }}
                        >
                            Curated selection of the finest items, crafted with precision and designed for excellence
                        </p>

                        {/* Search Bar */}
                        <div
                            className="max-w-2xl mx-auto mt-6 sm:mt-8 px-4"
                            style={{
                                animation: 'fadeInUp 0.8s ease-out 0.3s backwards',
                            }}
                        >
                            <div className="relative group">
                                <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 transition-colors group-hover:text-blue-600" />
                                <input
                                    type="text"
                                    placeholder="Search for products..."
                                    className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none transition-all shadow-sm hover:shadow-lg text-sm sm:text-base"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
                    {categories.map((category, index) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`group flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base ${selectedCategory === category.id
                                    ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-lg scale-105'
                                    : 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800 hover:border-blue-600 dark:hover:border-blue-500 hover:shadow-lg hover:scale-105'
                                    }`}
                                style={{
                                    animation: `fadeInUp 0.6s ease-out ${0.4 + index * 0.1}s backwards`,
                                }}
                            >
                                <Icon className="w-4 h-4" />
                                {category.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Products Grid */}
            <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-30 py-8 sm:py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8 lg:gap-10">
                    {data.map((product) => (
                        <div key={product.sku} className="flex justify-center w-md">
                            <ProductCard product={product}/>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
                <div
                    className="relative rounded-2xl sm:rounded-3xl overflow-hidden"
                    style={{
                        animation: 'fadeInUp 0.8s ease-out',
                    }}
                >
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600">
                        <div
                            className="absolute inset-0 opacity-30"
                            style={{
                                backgroundImage: `radial-gradient(circle at 2px 2px, white 2px, transparent 0)`,
                                backgroundSize: '32px 32px',
                            }}
                        />
                    </div>

                    <div className="relative z-10 px-6 sm:px-12 md:px-20 py-12 sm:py-16 md:py-24 text-center">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
                            Get Exclusive Offers
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                            Subscribe to our newsletter and receive special discounts on premium products
                        </p>

                        <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3 sm:gap-4 px-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm sm:text-base"
                            />
                            <button className="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-white text-blue-600 font-semibold hover:scale-105 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base whitespace-nowrap">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
};

export default ProductsPage;