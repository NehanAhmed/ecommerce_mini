'use client'

import React from 'react';
import { ArrowLeft, Edit, Trash2, Eye, EyeOff, Star, Package, Tag, Calendar, User, BarChart3 } from 'lucide-react';
import { IProduct } from '@/database';
import { schema } from '@/components/data-table';
import z from 'zod';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductDetailPage({ data: initialData }: { data: z.infer<typeof schema>[] | any }) {
    const dataArray = Array.isArray(initialData)
        ? initialData.filter(Boolean)
        : initialData
            ? [initialData]
            : [];

    if (dataArray.length === 0) {
        throw new Error("ProductDetailPage: No valid data received");
    }

    const sanitizedData = dataArray.map((item) => ({
        name: item?.name || "Unknown Product",
        slug: item?.slug || "",
        description: item?.description || "Premium product with excellent quality",
        price: item?.price ?? 0,
        compareAtPrice: item?.compareAtPrice,
        category: item?.category || "Uncategorized",
        brand: item?.brand,
        images: item?.images || ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
        stock: item?.stock ?? 0,
        sku: item?.sku || "N/A",
        isActive: item?.isActive ?? false,
        isFeatured: item?.isFeatured ?? false,
        specifications: item?.specifications || {},
        tags: item?.tags || ['Product'],
        addedBy: item?.addedBy || "Admin",
        createdAt: item?.createdAt || new Date().toISOString(),
        updatedAt: item?.updatedAt || new Date().toISOString(),
    }));

    const [data, setData] = React.useState(() => sanitizedData)

    const [selectedImage, setSelectedImage] = React.useState(0);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border bg-card rounded">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href='/dashboard/products'>
                            <Button className="flex items-center gap-2 ">
                                <ArrowLeft className="w-5 h-5" />
                                <span className="text-sm font-medium">Back to Products</span>
                            </Button>
                            </Link>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button className="px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors flex items-center gap-2">
                                <Edit className="w-4 h-4" />
                                Edit Product
                            </Button>
                            <Button className="px-4 py-2 text-sm font-medium text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-lg transition-colors flex items-center gap-2">
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {data.map((product) => (
                        <React.Fragment key={product.sku}>
                            {/* Left Column - Images */}
                            <div className="lg:col-span-1">
                                <div className="bg-card rounded-xl border border-border overflow-hidden sticky top-8">
                                    <div className="aspect-square bg-muted relative">
                                        <Image
                                            src={product.images[selectedImage]}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                            width={100}
                                            height={100}

                                        />
                                    </div>
                                    <div className="p-4 grid grid-cols-3 gap-3">
                                        {product.images.map((img, idx) => (
                                            <Button
                                                key={idx}
                                                onClick={() => setSelectedImage(idx)}
                                                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx
                                                    ? 'border-primary ring-2 ring-primary/20'
                                                    : 'border-border hover:border-muted-foreground'
                                                    }`}
                                            >
                                                <Image  width={100}
                                                    height={100} src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Details */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Product Header */}
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
                                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Tag className="w-4 h-4" />
                                                    SKU: {product.sku}
                                                </span>
                                                <span>•</span>
                                                <span>{product.category}</span>
                                                {product.brand && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{product.brand}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {product.isActive ? (
                                                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium">
                                                    <Eye className="w-4 h-4" />
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium">
                                                    <EyeOff className="w-4 h-4" />
                                                    Inactive
                                                </span>
                                            )}
                                            {product.isFeatured && (
                                                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg text-sm font-medium">
                                                    <Star className="w-4 h-4 fill-current" />
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-baseline gap-3 mb-4">
                                        <span className="text-4xl font-bold text-foreground">${product.price}</span>
                                        {product.compareAtPrice && (
                                            <>
                                                <span className="text-xl text-muted-foreground line-through">${product.compareAtPrice}</span>
                                                <span className="px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded text-sm font-medium">
                                                    {Math.round((1 - product.price / product.compareAtPrice) * 100)}% OFF
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    <p className="text-foreground leading-relaxed">{product.description}</p>
                                </div>

                                {/* Stock & Inventory */}
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Package className="w-5 h-5 text-muted-foreground" />
                                        <h2 className="text-lg font-semibold text-foreground">Inventory</h2>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="p-4 bg-muted/50 rounded-lg">
                                            <div className="text-sm text-muted-foreground mb-1">Stock Level</div>
                                            <div className="text-2xl font-bold text-foreground">{product.stock} units</div>
                                            <div className="mt-2 h-2 bg-background rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full transition-all"
                                                    style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="p-4 bg-muted/50 rounded-lg">
                                            <div className="text-sm text-muted-foreground mb-1">Stock Status</div>
                                            <div className="text-2xl font-bold text-foreground">
                                                {product.stock > 20 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                                            </div>
                                            <div className="mt-2 text-sm text-muted-foreground">
                                                {product.stock > 20 ? 'Healthy inventory levels' : 'Consider restocking'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Specifications */}
                                {product.specifications && (
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <BarChart3 className="w-5 h-5 text-muted-foreground" />
                                            <h2 className="text-lg font-semibold text-foreground">Specifications</h2>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                                            {Object.entries(product.specifications).map(([key, value]) => (
                                                <div key={key} className="flex justify-between py-2 border-b border-border last:border-0">
                                                    <span className="text-sm text-muted-foreground">{key}</span>
                                                    <span className="text-sm font-medium text-foreground">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tags */}
                                {product.tags && product.tags.length > 0 && (
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Tag className="w-5 h-5 text-muted-foreground" />
                                            <h2 className="text-lg font-semibold text-foreground">Tags</h2>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {product.tags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Metadata */}
                                <div className="bg-card rounded-xl border border-border p-6">
                                    <h2 className="text-lg font-semibold text-foreground mb-4">Product Information</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                                <User className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-muted-foreground">Added By</div>
                                                <div className="text-sm font-medium text-foreground">{product.addedBy}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-muted-foreground">Created</div>
                                                <div className="text-sm font-medium text-foreground">
                                                    {new Date(product.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-muted-foreground">Last Updated</div>
                                                <div className="text-sm font-medium text-foreground">
                                                    {new Date(product.updatedAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                                <Tag className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-muted-foreground">Slug</div>
                                                <div className="text-sm font-medium text-foreground font-mono">{product.slug}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}