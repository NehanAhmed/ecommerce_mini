import ProductDetailPage from "@/app/(admin)/_components/ProductsDetail"

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {

    const { slug } = await params
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    const response = await fetch(`${BASE_URL}/api/${slug}`)
    if (!response) throw new Error("Error Fetching Products")
    const data = await response.json()
    const product = await data.product
    return (
        <main>
            <ProductDetailPage data={product} />
        </main>
    )
}

export default page