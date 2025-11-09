import { Button } from '@/components/ui/button'
import React from 'react'

const Hero = () => {
    return (
        <section className='w-full h-screen flex justify-center items-start py-20 px-10 gap-10 '>
            <div className='w-4/5 h-1/2 bg-black rounded-2xl text-white flex flex-col justify-center items-start gap-6 p-10 '>
                <h1 className='text-5xl font-semibold text-center'>Find the Perfect Product for every Ocassion.</h1>
                <p>Explore our wide range of high-quality products tailored just for you.</p>
                <Button variant={'secondary'}>Shop Now</Button>
            </div>
        </section>
    )
}

export default Hero