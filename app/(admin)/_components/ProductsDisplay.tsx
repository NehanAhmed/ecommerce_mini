'use client'

import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Plus, Download, Tag, Package } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { useEffect, useState } from 'react';

interface ProductsDisplayProps {
  data?: any;
}

function ProductsDisplay({ data }: ProductsDisplayProps) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(!data)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If data is passed as prop, use it directly
    if (data && Array.isArray(data)) {
      setProducts(data)
      setLoading(false)
      return
    }

    // Otherwise fetch from API
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:3000/api/list-products")
        if (!response.ok) throw new Error("Failed to fetch products")
        const result = await response.json()

        // Ensure result is an array
        if (Array.isArray(result)) {
          setProducts(result)
        } else if (result.products && Array.isArray(result.products)) {
          setProducts(result.products)
        } else {
          setProducts([])
        }
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [data])

  if (loading) {
    return (
      <main>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-500"></div>
            </div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main>
        <Empty className="border border-dashed border-destructive/30 shadow-none bg-destructive/5 rounded-xl p-12">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-destructive/10 text-destructive p-4 rounded-full">
              <Package className="w-12 h-12" />
            </EmptyMedia>
            <EmptyTitle className="text-3xl font-bold text-foreground mt-6 mb-2">Error Loading Products</EmptyTitle>
            <EmptyDescription className="text-lg text-muted-foreground max-w-lg mx-auto">
              {error}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </main>
    )
  }

  if (!products || products.length === 0) {
    return (
      <main>
        <Empty className="border border-dashed border-border-foreground/30 shadow-none bg-card/50 rounded-xl p-12">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-primary/10 text-primary p-4 rounded-full">
              <Tag className="w-12 h-12" />
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
        </Empty>
      </main>
    )
  }

  return (
    <main className=''>
      <DataTable data={products} />
    </main>
  )
}

export default ProductsDisplay