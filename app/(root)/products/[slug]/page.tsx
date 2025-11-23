import { ProductDetailPage } from '@/app/_components/ProductDetail'
import React from 'react'
export const dynamic = 'force-dynamic'
const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

    const response = await fetch(`${BASE_URL}/api/${slug}`)
    const data = await response.json()
    const product = await data.product
    return (
        <main>
            <ProductDetailPage product={product} />
        </main>
    )
}

export default page