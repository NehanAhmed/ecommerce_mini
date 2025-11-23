'use client'

import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Plus, Download, Tag, Package } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import React, { useEffect, useState } from 'react';
import { IProduct } from '@/database';



function ProductsDisplay({ products: initialData }: { products: IProduct }) {

  

  return (
    <main className=''>
      <DataTable data={data} />
    </main>
  )
}

export default ProductsDisplay