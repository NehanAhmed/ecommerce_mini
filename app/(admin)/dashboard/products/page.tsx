'use client';
import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, MoreVertical, Edit2, Trash2, Eye, Download, ChevronDown, Package, Grid3x3, List, ArrowUpDown, SlidersHorizontal, ArrowUpRightIcon, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
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
import { IconTag } from '@tabler/icons-react';
import { MetricCard } from '../../_components/MetricCard';
const product = [
  { id: 1, name: "Product A", status: "active", stock: 50 },
  { id: 2, name: "Product B", status: "inactive", stock: 10 },
  { id: 3, name: "Product C", status: "active", stock: 5 },
  { id: 4, name: "Product D", status: "active", stock: 0 },
  { id: 5, name: "Product E", status: "active", stock: 25 },
  { id: 6, name: "Product F", status: "inactive", stock: 0 },
  { id: 7, name: "Product G", status: "active", stock: 15 },
];
const ProductsDashboard = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewMode, setViewMode] = useState('table');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [has, sethas] = useState(false)
     const totalProducts = product.length;
  const activeProducts = product.filter((p) => p.status === "active").length;
  const lowStockProducts = product.filter((p) => p.stock < 20 && p.stock > 0).length;
  const outOfStockProducts = product.filter((p) => p.stock === 0).length;
    // Sample product data
    const products = [
        {
            id: 1,
            name: 'Premium Wireless Headphones',
            sku: 'WHP-2024-001',
            category: 'Electronics',
            price: 299.99,
            stock: 45,
            status: 'active',
            sales: 234,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
            lastUpdated: '2024-11-10'
        },
        {
            id: 2,
            name: 'Smart Fitness Watch',
            sku: 'SFW-2024-002',
            category: 'Wearables',
            price: 199.99,
            stock: 12,
            status: 'active',
            sales: 456,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
            lastUpdated: '2024-11-11'
        },
        {
            id: 3,
            name: 'Leather Laptop Bag',
            sku: 'LLB-2024-003',
            category: 'Accessories',
            price: 89.99,
            stock: 0,
            status: 'out_of_stock',
            sales: 123,
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop',
            lastUpdated: '2024-11-09'
        },
        {
            id: 4,
            name: 'Mechanical Keyboard RGB',
            sku: 'MKR-2024-004',
            category: 'Electronics',
            price: 149.99,
            stock: 67,
            status: 'active',
            sales: 890,
            image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100&h=100&fit=crop',
            lastUpdated: '2024-11-12'
        },
        {
            id: 5,
            name: 'Ultra HD Webcam',
            sku: 'UHW-2024-005',
            category: 'Electronics',
            price: 129.99,
            stock: 8,
            status: 'low_stock',
            sales: 345,
            image: 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=100&h=100&fit=crop',
            lastUpdated: '2024-11-13'
        },
        {
            id: 6,
            name: 'Minimalist Desk Lamp',
            sku: 'MDL-2024-006',
            category: 'Home & Office',
            price: 59.99,
            stock: 156,
            status: 'active',
            sales: 678,
            image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=100&h=100&fit=crop',
            lastUpdated: '2024-11-12'
        },
        {
            id: 7,
            name: 'Wireless Mouse Pro',
            sku: 'WMP-2024-007',
            category: 'Electronics',
            price: 79.99,
            stock: 203,
            status: 'active',
            sales: 1234,
            image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop',
            lastUpdated: '2024-11-13'
        },
        {
            id: 8,
            name: 'Portable Charger 20000mAh',
            sku: 'PCH-2024-008',
            category: 'Accessories',
            price: 49.99,
            stock: 0,
            status: 'draft',
            sales: 0,
            image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=100&h=100&fit=crop',
            lastUpdated: '2024-11-08'
        }
    ];

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
            const matchesStatus = statusFilter === 'all' || product.status === statusFilter;

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [searchQuery, categoryFilter, statusFilter]);

    // Get unique categories
    const categories = ['all', ...new Set(products.map(p => p.category))];

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: string; label: string; className: string }> = {
            active: { variant: 'default', label: 'Active', className: 'bg-accent text-accent-foreground' },
            out_of_stock: { variant: 'destructive', label: 'Out of Stock', className: 'bg-destructive text-destructive-foreground' },
            low_stock: { variant: 'secondary', label: 'Low Stock', className: 'bg-yellow-500 text-primary-foreground' },
            draft: { variant: 'outline', label: 'Draft', className: 'bg-muted text-muted-foreground' }
        };

        const config = variants[status] || variants.draft;
        return <Badge className={config.className}>{config.label}</Badge>;
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) return <span className="text-destructive font-medium">Out of stock</span>;
        if (stock < 20) return <span className="text-yellow-600 font-medium">{stock} units</span>;
        return <span className="text-foreground font-medium">{stock} units</span>;
    };

    return (

        <div className="w-[1600px] m-auto min-h-screen bg-background p-10 ">
            {/* Header Section */}
            <div className=" border-b border-border">
                <div className="max-w-full mx-auto px-6 py-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <div className='flex items-center justify-start gap-4'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-tag"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592 -5.592a2.41 2.41 0 0 0 0 -3.408l-7.71 -7.71a2 2 0 0 0 -1.414 -.586h-5.172a3 3 0 0 0 -3 3z" /></svg>
                                <h1 className="text-3xl font-bold text-foreground mb-2">Products</h1>
                            </div>
                            <p className="text-muted-foreground">Manage your product inventory and catalog</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="default" className="gap-2">
                                <Download className="w-4 h-4" />
                                Export
                            </Button>
                            <Button size="default" className="gap-2 bg-primary hover:bg-primary/90">
                                <Plus className="w-4 h-4" />
                                Add Product
                            </Button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
                        <MetricCard
                            title="Total Products"
                            value={totalProducts}
                            icon={<Package />}
                            borderColorClass="border-l-primary"
                            iconBgClass="bg-primary/10"
                            iconColorClass="text-primary"
                        />
                        <MetricCard
                            title="Active Products"
                            value={activeProducts}
                            icon={<CheckCircle />} // More illustrative icon for "Active"
                            borderColorClass="border-l-accent"
                            iconBgClass="bg-accent/10"
                            iconColorClass="text-accent"
                        />
                        <MetricCard
                            title="Low Stock"
                            value={lowStockProducts}
                            icon={<AlertTriangle />} // Icon for "Low Stock"
                            borderColorClass="border-l-yellow-500"
                            iconBgClass="bg-yellow-500/10"
                            iconColorClass="text-yellow-500"
                        />
                        <MetricCard
                            title="Out of Stock"
                            value={outOfStockProducts}
                            icon={<XCircle />} // Icon for "Out of Stock"
                            borderColorClass="border-l-destructive"
                            iconBgClass="bg-destructive/10"
                            iconColorClass="text-destructive"
                        />
                    </section>

                    {/* Filters and Search */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <Input
                                placeholder="Search products by name or SKU..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-11 border-border focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full md:w-[200px] h-11">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(cat => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat === 'all' ? 'All Categories' : cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[180px] h-11">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
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
                                className="h-11 w-11"
                            >
                                <List className="w-5 h-5" />
                            </Button>
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'outline'}
                                size="icon"
                                onClick={() => setViewMode('grid')}
                                className="h-11 w-11"
                            >
                                <Grid3x3 className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}

            {has ? (
                <div className="max-w-[1400px] mx-auto px-6 py-8">
                    <Card className="border border-border shadow-sm">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted hover:bg-muted">
                                        <TableHead className="w-[50px]">
                                            <input type="checkbox" className="rounded border-border" />
                                        </TableHead>
                                        <TableHead className="font-semibold text-foreground">Product</TableHead>
                                        <TableHead className="font-semibold text-foreground">SKU</TableHead>
                                        <TableHead className="font-semibold text-foreground">Category</TableHead>
                                        <TableHead className="font-semibold text-foreground">Price</TableHead>
                                        <TableHead className="font-semibold text-foreground">Stock</TableHead>
                                        <TableHead className="font-semibold text-foreground">Status</TableHead>
                                        <TableHead className="font-semibold text-foreground">Sales</TableHead>
                                        <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center py-12">
                                                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                                <p className="text-foreground text-lg font-medium">No products found</p>
                                                <p className="text-muted-foreground text-sm mt-1">Try adjusting your filters or search query</p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredProducts.map((product) => (
                                            <TableRow key={product.id} className="hover:bg-muted/50 transition-colors">
                                                <TableCell>
                                                    <input type="checkbox" className="rounded border-border" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-12 h-12 rounded-lg object-cover border border-border"
                                                        />
                                                        <div>
                                                            <p className="font-medium text-foreground">{product.name}</p>
                                                            <p className="text-sm text-muted-foreground">Updated {product.lastUpdated}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-mono text-sm text-muted-foreground">{product.sku}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="bg-muted text-foreground border-border">
                                                        {product.category}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-semibold text-foreground">${product.price.toFixed(2)}</span>
                                                </TableCell>
                                                <TableCell>{getStockStatus(product.stock)}</TableCell>
                                                <TableCell>{getStatusBadge(product.status)}</TableCell>
                                                <TableCell>
                                                    <span className="text-foreground font-medium">{product.sales}</span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuItem className="gap-2 cursor-pointer">
                                                                <Eye className="w-4 h-4" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2 cursor-pointer">
                                                                <Edit2 className="w-4 h-4" />
                                                                Edit Product
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="gap-2 cursor-pointer text-red-600 focus:text-red-600">
                                                                <Trash2 className="w-4 h-4" />
                                                                Delete Product
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {filteredProducts.length > 0 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                                <p className="text-sm text-muted-foreground">
                                    Showing <span className="font-medium">{filteredProducts.length}</span> of{' '}
                                    <span className="font-medium">{products.length}</span> products
                                </p>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" disabled>
                                        Previous
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            ) : (
                <div className='mt-10'>
                    <Empty className='border border-dashed'>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <IconTag />
                            </EmptyMedia>
                            <EmptyTitle>No Products Yet</EmptyTitle>
                            <EmptyDescription>
                                You haven&apos;t created any projects yet. Get started by creating
                                your first project.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <div className="flex gap-2">
                                <Button>Create Product</Button>
                                <Button variant="outline">Import Products</Button>
                            </div>
                        </EmptyContent>
                        <Button
                            variant="link"
                            asChild
                            className="text-muted-foreground"
                            size="sm"
                        >
                            <a href="#">
                                Learn More <ArrowUpRightIcon />
                            </a>
                        </Button>
                    </Empty>
                </div>
            )}

        </div>
    );

};

export default ProductsDashboard;