import ProductsPage from '@/app/_components/ProductsSection'
import React from 'react'
export const dynamic = 'force-dynamic'

const page = async () => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    const response = await fetch(`${BASE_URL}/api/list-products`)
    if (!response) throw new Error("Error fetching products")
    const data = await response.json()

    const products = data.products || []

    
    return (
        <main>
            <ProductsPage products={products}/>
        </main>
    )
}

export default page