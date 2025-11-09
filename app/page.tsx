import React from 'react'
import Hero from './_components/Hero'
import ProductSection from './_components/ProductSection'

const page = () => {
  return (
    <main className='w-full min-h-screen bg-zinc-50'>
      <Hero />
      <ProductSection />
    </main>
  )
}

export default page