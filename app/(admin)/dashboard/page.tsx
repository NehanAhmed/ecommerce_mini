import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"

export const dynamic = 'force-dynamic'

export default async function Page() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const response = await fetch(`${BASE_URL}/api/list-products`)

  if (!response.ok) throw new Error("Error fetching Products")

  const data = await response.json()
  const products = await data.products || []
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <DataTable data={products} />
        </div>
      </div>
    </div>
  )
}
