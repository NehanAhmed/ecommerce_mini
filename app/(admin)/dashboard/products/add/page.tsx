"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Plus, Minus, Tag, Package, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

interface SpecificationField {
    key: string;
    value: string;
}

interface CreateProductFormState {
    name: string;
    slug: string;
    description: string;
    price: string;
    compareAtPrice: string;
    category: string;
    brand: string;
    stock: string;
    sku: string;
    isActive: boolean;
    isFeatured: boolean;
    specifications: SpecificationField[];
    tags: string[];
}

// TODO: replace with real admin user id from auth/session when available
const DEMO_ADMIN_ID = '6740a1111111111111111111';

export default function CreateProductPage() {
    const router = useRouter();

    const [formData, setFormData] = useState<CreateProductFormState>({
        name: '',
        slug: '',
        description: '',
        price: '',
        compareAtPrice: '',
        category: '',
        brand: '',
        stock: '',
        sku: '',
        isActive: true,
        isFeatured: false,
        specifications: [{ key: '', value: '' }],
        tags: [],
    });

    // Store actual File objects instead of blob URLs
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreview, setImagePreview] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState<string>('');
    const [errors, setErrors] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        const target = e.target as HTMLInputElement;
        const checked = target.type === 'checkbox' ? target.checked : undefined;
        
        setFormData(prev => ({
            ...prev,
            [name]: target.type === 'checkbox' ? checked : value
        }));

        // Auto-generate slug from name
        if (name === 'name') {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleSpecChange = (
        index: number,
        field: keyof SpecificationField,
        value: string,
    ) => {
        const newSpecs = [...formData.specifications];
        newSpecs[index][field] = value;
        setFormData(prev => ({ ...prev, specifications: newSpecs }));
    };

    const addSpecification = () => {
        setFormData(prev => ({
            ...prev,
            specifications: [...prev.specifications, { key: '', value: '' }]
        }));
    };

    const removeSpecification = (index: number) => {
        setFormData(prev => ({
            ...prev,
            specifications: prev.specifications.filter((_, i) => i !== index)
        }));
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        
        // Store the actual File objects
        setImageFiles((prev) => [...prev, ...files]);
        
        // Create preview URLs for display only
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setImagePreview((prev) => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        // Revoke the blob URL to free memory
        URL.revokeObjectURL(imagePreview[index]);
        
        setImagePreview((prev) => prev.filter((_, i) => i !== index));
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setErrors([]);
        setSuccessMessage(null);

        const clientErrors: string[] = [];

        if (!formData.name.trim()) clientErrors.push('Name is required.');
        if (!formData.description.trim()) clientErrors.push('Description is required.');
        if (!formData.category.trim()) clientErrors.push('Category is required.');
        if (!formData.sku.trim()) clientErrors.push('SKU is required.');

        const price = Number(formData.price);
        if (!formData.price || Number.isNaN(price) || price <= 0) {
            clientErrors.push('Price must be a positive number.');
        }

        const stock = Number(formData.stock);
        if (formData.stock === '' || Number.isNaN(stock) || stock < 0) {
            clientErrors.push('Stock must be a non-negative number.');
        }

        if (imageFiles.length === 0) {
            clientErrors.push('At least one product image is required.');
        }

        const compareAtPrice = formData.compareAtPrice.trim() !== ''
            ? Number(formData.compareAtPrice)
            : undefined;

        if (
            compareAtPrice !== undefined &&
            (!Number.isFinite(compareAtPrice) || compareAtPrice <= price)
        ) {
            clientErrors.push('Compare at price must be a valid number greater than the selling price.');
        }

        if (clientErrors.length > 0) {
            setErrors(clientErrors);
            return;
        }

        // Create FormData instead of JSON
        const formDataToSend = new FormData();

        // Add all form fields
        formDataToSend.append('name', formData.name.trim());
        formDataToSend.append('description', formData.description.trim());
        formDataToSend.append('price', formData.price);
        formDataToSend.append('category', formData.category.trim());
        formDataToSend.append('stock', formData.stock);
        formDataToSend.append('sku', formData.sku.trim());
        formDataToSend.append('isActive', String(formData.isActive));
        formDataToSend.append('isFeatured', String(formData.isFeatured));
        formDataToSend.append('addedBy', DEMO_ADMIN_ID);

        // Add optional fields
        if (formData.compareAtPrice.trim()) {
            formDataToSend.append('compareAtPrice', formData.compareAtPrice);
        }
        if (formData.brand.trim()) {
            formDataToSend.append('brand', formData.brand.trim());
        }

        // Add specifications as JSON string
        const specsEntries = formData.specifications
            .filter((spec) => spec.key.trim() && spec.value.trim())
            .map<[string, string]>((spec) => [spec.key.trim(), spec.value.trim()]);

        if (specsEntries.length > 0) {
            formDataToSend.append('specifications', JSON.stringify(Object.fromEntries(specsEntries)));
        }

        // Add tags as JSON string
        if (formData.tags.length > 0) {
            formDataToSend.append('tags', JSON.stringify(formData.tags));
        }

        // Add image files
        imageFiles.forEach((file) => {
            formDataToSend.append('images', file);
        });

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/create-product', {
                method: 'POST',
                body: formDataToSend, // Send FormData, not JSON
                // Don't set Content-Type header - browser will set it automatically with boundary
            });

            const data = await response.json();

            if (!response.ok) {
                const serverErrors: string[] | undefined = data.errors;
                setErrors(
                    serverErrors && serverErrors.length
                        ? serverErrors
                        : [data.message ?? 'Failed to create product'],
                );
                return;
            }

            setSuccessMessage('Product created successfully.');
            
            // Clean up blob URLs
            imagePreview.forEach(url => URL.revokeObjectURL(url));
            
            router.push('/dashboard/products');
        } catch (error) {
            console.error('Error creating product:', error);
            setErrors(['Unexpected error while creating product.']);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className='absolute left-30 rounded-full '>
                    <Link href='/dashboard/products'>
                        <Button variant={'link'}>
                            <ArrowLeft />
                        </Button>
                    </Link>
                </div>
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Package className="h-5 w-5 text-primary" />
                        </div>
                        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                            Create Product
                        </h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Add a new product to your inventory with detailed information
                    </p>
                </div>

                {errors.length > 0 && (
                    <div className="mb-6 rounded-md border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                        <ul className="list-disc space-y-1 pl-4">
                            {errors.map((error) => (
                                <li key={error}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {successMessage && (
                    <div className="mb-6 rounded-md border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-600">
                        {successMessage}
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content - Left Side */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <div className="rounded-lg border border-border bg-card p-6">
                            <h2 className="text-lg font-semibold text-card-foreground mb-4">
                                Basic Information
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <Label className="block text-sm font-medium text-foreground mb-1.5">
                                        Product Name
                                    </Label>
                                    <Input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                                        placeholder="Enter product name"
                                    />
                                </div>

                                <div>
                                    <Label className="block text-sm font-medium text-foreground mb-1.5">
                                        Slug
                                    </Label>
                                    <Input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                        className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                                        placeholder="product-slug"
                                    />
                                </div>

                                <div>
                                    <Label className="block text-sm font-medium text-foreground mb-1.5">
                                        Description
                                    </Label>
                                    <Textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Enter the Product Description"
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label className="block text-sm font-medium text-foreground mb-1.5">
                                            Category
                                        </Label>
                                        <Input
                                            type="text"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                                            placeholder="e.g., Electronics"
                                        />
                                    </div>

                                    <div>
                                        <Label className="block text-sm font-medium text-foreground mb-1.5">
                                            Brand
                                        </Label>
                                        <Input
                                            type="text"
                                            name="brand"
                                            value={formData.brand}
                                            onChange={handleInputChange}
                                            className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                                            placeholder="Brand name"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pricing & Inventory */}
                        <div className="rounded-lg border border-border bg-card p-6">
                            <h2 className="text-lg font-semibold text-card-foreground mb-4">
                                Pricing & Inventory
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <Label className="block text-sm font-medium text-foreground mb-1.5">
                                        Price
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                            $
                                        </span>
                                        <Input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className="w-full rounded-md border border-input bg-background pl-8 pr-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                                            placeholder="0.00"
                                            step="0.01"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="block text-sm font-medium text-foreground mb-1.5">
                                        Compare at Price
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                            $
                                        </span>
                                        <Input
                                            type="number"
                                            name="compareAtPrice"
                                            value={formData.compareAtPrice}
                                            onChange={handleInputChange}
                                            className="w-full rounded-md border border-input bg-background pl-8 pr-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                                            placeholder="0.00"
                                            step="0.01"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="block text-sm font-medium text-foreground mb-1.5">
                                        Stock Quantity
                                    </Label>
                                    <Input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                                        placeholder="0"
                                    />
                                </div>

                                <div>
                                    <Label className="block text-sm font-medium text-foreground mb-1.5">
                                        SKU
                                    </Label>
                                    <Input
                                        type="text"
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleInputChange}
                                        className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                                        placeholder="PROD-001"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Product Images */}
                        <div className="rounded-lg border border-border bg-card p-6">
                            <h2 className="text-lg font-semibold text-card-foreground mb-4">
                                Product Images
                            </h2>

                            <div className="space-y-4">
                                <Label className="flex flex-col items-center justify-center w-full h-40 rounded-lg border-2 border-dashed border-input bg-background hover:bg-accent/50 transition-colors cursor-pointer">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Upload className="h-8 w-8 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            Click to upload or drag and drop
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            PNG, JPG or WEBP (max. 10MB per file)
                                        </p>
                                    </div>
                                    <Input
                                        type="file"
                                        className="hidden"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </Label>

                                {imagePreview.length > 0 && (
                                    <div className="grid grid-cols-4 gap-4">
                                        {imagePreview.map((preview, index) => (
                                            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 p-1 rounded-md bg-destructive/90 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Specifications */}
                        <div className="rounded-lg border border-border bg-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-card-foreground">
                                    Specifications
                                </h2>
                                <Button
                                    type="button"
                                    onClick={addSpecification}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {formData.specifications.map((spec, index) => (
                                    <div key={index} className="flex gap-3">
                                        <Input
                                            type="text"
                                            value={spec.key}
                                            onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                                            className="flex-1 rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                                            placeholder="Property"
                                        />
                                        <Input
                                            type="text"
                                            value={spec.value}
                                            onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                                            className="flex-1 rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                                            placeholder="Value"
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => removeSpecification(index)}
                                            className="p-2.5 rounded-md border border-input bg-background text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-colors"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Right Side */}
                    <div className="space-y-6">
                        {/* Status */}
                        <div className="rounded-lg border border-border bg-card p-6">
                            <h2 className="text-lg font-semibold text-card-foreground mb-4">
                                Status
                            </h2>

                            <div className="space-y-4">
                                <Label className="flex items-center justify-between cursor-pointer group">
                                    <span className="text-sm font-medium text-foreground">Active</span>
                                    <div className="relative">
                                        <Input
                                            type="checkbox"
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleInputChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-input rounded-full peer peer-focus:ring-2 peer-focus:ring-ring/20 peer-checked:bg-primary transition-colors"></div>
                                        <div className="absolute left-1 top-1 bg-background w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                                    </div>
                                </Label>

                                <Label className="flex items-center justify-between cursor-pointer group">
                                    <span className="text-sm font-medium text-foreground">Featured</span>
                                    <div className="relative">
                                        <Input
                                            type="checkbox"
                                            name="isFeatured"
                                            checked={formData.isFeatured}
                                            onChange={handleInputChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-input rounded-full peer peer-focus:ring-2 peer-focus:ring-ring/20 peer-checked:bg-primary transition-colors"></div>
                                        <div className="absolute left-1 top-1 bg-background w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                                    </div>
                                </Label>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="rounded-lg border border-border bg-card p-6">
                            <h2 className="text-lg font-semibold text-card-foreground mb-4">
                                Tags
                            </h2>

                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                        className="flex-1 rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                                        placeholder="Add tag"
                                    />
                                    <Button
                                        type="button"
                                        onClick={addTag}
                                        className="px-4 py-2.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                                    >
                                        <Tag className="h-4 w-4" />
                                    </Button>
                                </div>

                                {formData.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground text-sm"
                                            >
                                                {tag}
                                                <Button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="hover:text-destructive transition-colors"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="rounded-lg border border-border bg-card p-6">
                            <div className="space-y-3">
                                <Button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-2.5 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Product'}
                                </Button>
                                <Button
                                    type="button"
                                    className="w-full px-4 py-2.5 rounded-md border border-input bg-background text-foreground font-medium hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
                                >
                                    Save as Draft
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}