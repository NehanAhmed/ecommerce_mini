import { Search, Plus, Download, Tag, Package, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import ProductsDisplay from '../../_components/ProductsDisplay';
import { MetricCard } from '../../_components/MetricCard';
import Link from 'next/link';


const ProductsDashboard = async () => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    const response = await fetch(`${BASE_URL}/api/list-products`)
    if (!response) throw new Error("Error fetching Products")

    const data = await response.json()
    // Extract the products array from the response object
    const products = data.products || []

    // Calculate metrics from products data
    const totalProducts = products.length
    const activeProducts = products.filter((p: any) => p.stock > 0).length
    const lowStockProducts = products.filter((p: any) => p.stock > 0 && p.stock <= 10).length
    const outOfStockProducts = products.filter((p: any) => p.stock === 0).length


    return (
        <div className="container mx-auto px-4 py-10 space-y-12 bg-background min-h-screen">
            {/* Header Section */}
            <header className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className='flex items-center gap-4'>
                        <Tag className="w-8 h-8 text-primary" />
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Products</h1>
                            <p className="text-muted-foreground text-lg">Manage your product inventory and catalog efficiently</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="gap-2">
                            <Download className="w-4 h-4" />
                            Export
                        </Button>
                        <Link href='products/add'>
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" />
                                Add Product
                            </Button>
                        </Link>
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
                            className="pl-12 h-11 w-full"
                        />
                    </div>

                    {/* <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full sm:w-[200px] h-11">
                                <SelectValue placeholder="All Categories" />
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
                            <SelectTrigger className="w-full sm:w-[180px] h-11">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="low_stock">Low Stock</SelectItem>
                                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                    </div> */}
                </div>
            </section>

            {/* Main Content Area */}
            <ProductsDisplay data={products} />
        </div>
    );
};

export default ProductsDashboard;