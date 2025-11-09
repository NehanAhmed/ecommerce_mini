import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

const Header = () => {
    return (
        <nav className='w-full flex justify-around items-center py-8 bg-zinc-50'>
            <div className='flex  gap-2 items-center justify-center'>
                <h1 className='text-4xl font-semibold'>Shoppit</h1>
                <div  className='px-10 flex gap-2 items-center justify-center'>
                    <Input type='search' className='w-90 h-14 rounded-lg px-5' placeholder='Search For any Products'/>
                    <Button variant={'default'} className='rounded-lg w-15 h-14 px-2 py5'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-search"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /></svg>
                    </Button>
                </div>
            </div>
            <div className='flex gap-2'>
                <Button variant={'outline'}>Login</Button>
                <Button>SignUp</Button>
            </div>

        </nav>
    )
}

export default Header