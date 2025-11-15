'use client';
import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, MoreVertical, Edit2, Trash2, Eye, Download, ChevronDown, Package, Grid3x3, List, ArrowUpDown, SlidersHorizontal, ArrowUpRightIcon, AlertTriangle, XCircle, CheckCircle, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import data from "../data.json"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { MetricCard } from '../../_components/MetricCard'; // Adjust path if necessary
import { cn } from '@/lib/utils'; // For conditional classNames
import { DataTable } from '@/components/data-table';

// Dummy Data
const initialProducts = [
    { id: 1, name: 'Premium Wireless Headphones', sku: 'WHP-2024-001', category: 'Electronics', price: 299.99, stock: 45, status: 'active', sales: 234, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop', lastUpdated: '2024-11-10' },
    { id: 2, name: 'Smart Fitness Watch', sku: 'SFW-2024-002', category: 'Wearables', price: 199.99, stock: 12, status: 'active', sales: 456, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop', lastUpdated: '2024-11-11' },
    { id: 3, name: 'Leather Laptop Bag', sku: 'LLB-2024-003', category: 'Accessories', price: 89.99, stock: 0, status: 'out_of_stock', sales: 123, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop', lastUpdated: '2024-11-09' },
    { id: 4, name: 'Mechanical Keyboard RGB', sku: 'MKR-2024-004', category: 'Electronics', price: 149.99, stock: 67, status: 'active', sales: 890, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100&h=100&fit=crop', lastUpdated: '2024-11-12' },
    { id: 5, name: 'Ultra HD Webcam', sku: 'UHW-2024-005', category: 'Electronics', price: 129.99, stock: 8, status: 'low_stock', sales: 345, image: 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=100&h=100&fit=crop', lastUpdated: '2024-11-13' },
    { id: 6, name: 'Minimalist Desk Lamp', sku: 'MDL-2024-006', category: 'Home & Office', price: 59.99, stock: 156, status: 'active', sales: 678, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=100&h=100&fit=crop', lastUpdated: '2024-11-12' },
    { id: 7, name: 'Wireless Mouse Pro', sku: 'WMP-2024-007', category: 'Electronics', price: 79.99, stock: 203, status: 'active', sales: 1234, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop', lastUpdated: '2024-11-13' },
    { id: 8, name: 'Portable Charger 20000mAh', sku: 'PCH-2024-008', category: 'Accessories', price: 49.99, stock: 0, status: 'draft', sales: 0, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=100&h=100&fit=crop', lastUpdated: '2024-11-08' }
];

const ProductsDashboard = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table'); // Explicit type for viewMode
    const [selectedProductIds, setSelectedProductIds] = useState<Set<number>>(new Set()); // Using Set for better performance

    // --- Derived State for Metric Cards ---
    const totalProducts = initialProducts.length;
    const activeProducts = initialProducts.filter((p) => p.status === "active").length;
    const lowStockProducts = initialProducts.filter((p) => p.stock < 20 && p.stock > 0).length;
    const outOfStockProducts = initialProducts.filter((p) => p.stock === 0).length;

    // --- Filter products ---
    const filteredProducts = useMemo(() => {
        return initialProducts.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
            const matchesStatus = statusFilter === 'all' || product.status === statusFilter;

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [searchQuery, categoryFilter, statusFilter]);

    // --- Get unique categories ---
    const categories = ['all', ...new Set(initialProducts.map(p => p.category))];

    // --- Helper for Status Badge ---
    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string; className: string }> = {
            active: { variant: 'default', label: 'Active', className: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30' },
            out_of_stock: { variant: 'destructive', label: 'Out of Stock', className: 'bg-destructive/15 text-destructive border-destructive/30' },
            low_stock: { variant: 'secondary', label: 'Low Stock', className: 'bg-amber-500/15 text-amber-500 border-amber-500/30' },
            draft: { variant: 'outline', label: 'Draft', className: 'bg-muted/30 text-muted-foreground border-border' }
        };

        const config = variants[status] || variants.draft;
        return <Badge variant={config.variant} className={cn("px-2 py-0.5 text-xs font-medium rounded-full", config.className)}>{config.label}</Badge>;
    };

    // --- Helper for Stock Status Text ---
    const getStockStatus = (stock: number) => {
        if (stock === 0) return <span className="text-destructive font-medium">Out of stock</span>;
        if (stock < 20) return <span className="text-yellow-500 font-medium">{stock} units</span>;
        return <span className="text-foreground font-medium">{stock} units</span>;
    };

    // --- Handle Select All Checkbox ---
    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const allProductIds = new Set(filteredProducts.map(p => p.id));
            setSelectedProductIds(allProductIds);
        } else {
            setSelectedProductIds(new Set());
        }
    };

    // --- Handle Individual Product Checkbox ---
    const handleSelectProduct = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedProductIds(prev => {
            const newSelection = new Set(prev);
            if (event.target.checked) {
                newSelection.add(id);
            } else {
                newSelection.delete(id);
            }
            return newSelection;
        });
    };

    const isAllSelected = filteredProducts.length > 0 && selectedProductIds.size === filteredProducts.length;
    const isIndeterminate = selectedProductIds.size > 0 && selectedProductIds.size < filteredProducts.length;

    const hasProducts = initialProducts.length > 0; // Check if there are any products at all

    return (
        <div className="container mx-auto px-4 py-10 space-y-12 bg-background min-h-screen">
            {/* Header Section */}
            <header className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className='flex items-center gap-4'>
                        <Tag className="w-8 h-8 text-primary" /> {/* Larger, primary-colored icon */}
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Products</h1>
                            <p className="text-muted-foreground text-lg">Manage your product inventory and catalog efficiently</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="gap-2 px-4 py-2 text-sm">
                            <Download className="w-4 h-4" />
                            Export
                        </Button>
                        <Button className="gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90">
                            <Plus className="w-4 h-4" />
                            Add Product
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                        title="Total Products"
                        value={totalProducts}
                        icon={<Package />}
                        iconBgClass="bg-primary/10"
                        iconColorClass="text-primary"
                    />
                    <MetricCard
                        title="Active Products"
                        value={activeProducts}
                        icon={<CheckCircle />}
                        iconBgClass="bg-accent/10"
                        iconColorClass="text-accent"
                    />
                    <MetricCard
                        title="Low Stock"
                        value={lowStockProducts}
                        icon={<AlertTriangle />}
                        iconBgClass="bg-yellow-500/10"
                        iconColorClass="text-yellow-500"
                    />
                    <MetricCard
                        title="Out of Stock"
                        value={outOfStockProducts}
                        icon={<XCircle />}
                        iconBgClass="bg-destructive/10"
                        iconColorClass="text-destructive"
                    />
                </section>
            </header>

            {/* Filters and Search */}
            <section className="space-y-6">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                            placeholder="Search products by name or SKU..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-11 w-full pr-4 rounded-lg border-border focus:ring-2 focus:ring-primary focus:ring-offset-background transition-shadow duration-200"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full sm:w-[200px] h-11 rounded-lg border-border focus:ring-2 focus:ring-primary focus:ring-offset-background transition-shadow duration-200">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg">
                                {categories.map(cat => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat === 'all' ? 'All Categories' : cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px] h-11 rounded-lg border-border focus:ring-2 focus:ring-primary focus:ring-offset-background transition-shadow duration-200">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg">
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="low_stock">Low Stock</SelectItem>
                                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="flex gap-2">
                            <Button
                                variant={viewMode === 'table' ? 'default' : 'outline'}
                                size="icon"
                                onClick={() => setViewMode('table')}
                                className="h-11 w-11 rounded-lg border-border focus:ring-2 focus:ring-primary focus:ring-offset-background transition-shadow duration-200"
                            >
                                <List className="w-5 h-5" />
                            </Button>
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'outline'}
                                size="icon"
                                onClick={() => setViewMode('grid')}
                                className="h-11 w-11 rounded-lg border-border focus:ring-2 focus:ring-primary focus:ring-offset-background transition-shadow duration-200"
                            >
                                <Grid3x3 className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
                {/* Potentially add bulk actions here if selectedProductIds.size > 0 */}
                {selectedProductIds.size > 0 && (
                    <div className="flex items-center gap-4 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2 duration-300">
                        <span>{selectedProductIds.size} selected</span>
                        <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary-foreground">
                            <Trash2 className="w-4 h-4" /> Delete
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary-foreground">
                            <SlidersHorizontal className="w-4 h-4" /> Bulk Edit
                        </Button>
                    </div>
                )}
            </section>

            {/* Main Content Area */}
            {hasProducts ? ( // Check if there are any products at all, not just filtered ones
                <>
                    {filteredProducts.length === 0 ? (
                        <Card className="p-12 text-center border-dashed border-2 border-border-foreground/30 shadow-none bg-card/50">
                            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-foreground mb-2">No Products Found</h2>
                            <p className="text-muted-foreground text-base max-w-md mx-auto">
                                We couldn't find any products matching your current filters or search query. Try adjusting them.
                            </p>
                            <Button onClick={() => { setSearchQuery(''); setCategoryFilter('all'); setStatusFilter('all'); }} variant="secondary" className="mt-6">
                                Clear Filters
                            </Button>
                        </Card>
                    ) : (
                        <>
                        { viewMode === 'table' ? (
                            <div className="overflow-x-auto">
                                <DataTable data={data} />
                            </div>
                        ) : (
                            // Grid View Implementation (basic placeholder for now)
                            <Card className="border border-border shadow-sm rounded-xl overflow-hidden bg-card">

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                                    {filteredProducts.map((product) => (
                                        <Card key={product.id} className="p-4 flex flex-col items-center text-center gap-3 border border-border shadow-sm hover:shadow-md transition-shadow rounded-lg">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-24 h-24 rounded-lg object-cover border border-border"
                                            />
                                            <h3 className="font-semibold text-lg text-foreground">{product.name}</h3>
                                            <p className="text-sm text-muted-foreground">{product.sku}</p>
                                            <div className="flex gap-2">
                                                {getStatusBadge(product.status)}
                                                <Badge variant="outline" className="text-xs px-2 py-0.5 border-border bg-card-foreground/5 text-foreground">
                                                    {product.category}
                                                </Badge>
                                            </div>
                                            <p className="text-xl font-bold text-foreground mt-2">${product.price.toFixed(2)}</p>
                                            <p className="text-sm">{getStockStatus(product.stock)}</p>
                                            <Button variant="outline" size="sm" className="mt-3">View Product</Button>
                                        </Card>
                                    ))}
                                </div>
                            </Card>

                        )}

                    {/* Pagination */}
                            
                    </>
                    )}
                </>
            ) : (
                <Empty className="border border-dashed border-border-foreground/30 shadow-none bg-card/50 rounded-xl p-12">
                    <EmptyHeader>
                        <EmptyMedia variant="icon" className="bg-primary/10 text-primary p-4 rounded-full">
                            <Tag className="w-12 h-12" /> {/* Larger icon for empty state */}
                        </EmptyMedia>
                        <EmptyTitle className="text-3xl font-bold text-foreground mt-6 mb-2">No Products Yet</EmptyTitle>
                        <EmptyDescription className="text-lg text-muted-foreground max-w-lg mx-auto">
                            It looks like you haven't added any products to your inventory. Get started by adding your first product.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="px-6 py-3 text-base">
                            <Plus className="w-4 h-4 mr-2" /> Create Product
                        </Button>
                        <Button variant="outline" className="px-6 py-3 text-base">
                            <Download className="w-4 h-4 mr-2 rotate-180" /> Import Products
                        </Button>
                    </EmptyContent>
                    <Button
                        variant="link"
                        asChild
                        className="text-primary hover:text-primary-foreground/80 mt-6 text-sm flex items-center gap-1"
                        size="sm"
                    >
                        <a href="#">
                            Learn More About Product Management <ArrowUpRightIcon className="w-4 h-4" />
                        </a>
                    </Button>
                </Empty>
            )}
        </div>
    );
};

export default ProductsDashboard;