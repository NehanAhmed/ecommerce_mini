'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Search, ShoppingBag, Menu, X } from 'lucide-react'

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { scrollY } = useScroll()
    const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95])
    const headerBlur = useTransform(scrollY, [0, 100], [0, 10])

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <motion.nav 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl shadow-lg border-b border-neutral-200 dark:border-neutral-800' 
                    : 'bg-white dark:bg-neutral-950'
            }`}
            style={{ 
                opacity: headerOpacity,
            }}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center py-4 lg:py-6'>
                    {/* Logo */}
                    <motion.div 
                        className='flex items-center gap-3'
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        <motion.div
                            className='w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                        >
                            <ShoppingBag className='w-6 h-6 text-white' />
                        </motion.div>
                        <h1 className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                            Shoppit
                        </h1>
                    </motion.div>

                    {/* Desktop Search */}
                    <motion.div 
                        className='hidden lg:flex items-center gap-3 flex-1 max-w-2xl mx-8'
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className='relative flex-1'>
                            <Input 
                                type='search' 
                                className='w-full h-12 rounded-full pl-12 pr-4 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 text-neutral-900 dark:text-white placeholder:text-neutral-500' 
                                placeholder='Search for products...'
                            />
                            <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400' />
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button 
                                variant='default' 
                                className='h-12 px-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300'
                            >
                                <Search className='w-5 h-5' />
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Desktop Auth Buttons */}
                    <motion.div 
                        className='hidden lg:flex items-center gap-3'
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <SignedOut>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <SignInButton>
                                    <button className="px-6 py-2.5 rounded-full font-semibold text-sm border-2 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white hover:border-blue-600 dark:hover:border-blue-400 transition-all duration-300">
                                        Sign In
                                    </button>
                                </SignInButton>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <SignUpButton>
                                    <button className="relative px-6 py-2.5 rounded-full font-semibold text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                                        <span className="relative z-10">Sign Up</span>
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700"
                                            initial={{ x: '100%' }}
                                            whileHover={{ x: 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </button>
                                </SignUpButton>
                            </motion.div>
                        </SignedOut>
                        <SignedIn>
                            <motion.div 
                                className='flex items-center gap-2'
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                <UserButton 
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-10 h-10 rounded-full border-2 border-blue-600 dark:border-blue-400 shadow-lg"
                                        }
                                    }}
                                />
                            </motion.div>
                        </SignedIn>
                    </motion.div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        className='lg:hidden p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white'
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isMobileMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
                    </motion.button>
                </div>

                {/* Mobile Menu */}
                <motion.div
                    className='lg:hidden overflow-hidden'
                    initial={false}
                    animate={{ 
                        height: isMobileMenuOpen ? 'auto' : 0,
                        opacity: isMobileMenuOpen ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    <div className='py-4 space-y-4 border-t border-neutral-200 dark:border-neutral-800'>
                        {/* Mobile Search */}
                        <div className='relative'>
                            <Input 
                                type='search' 
                                className='w-full h-12 rounded-full pl-12 pr-4 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 text-neutral-900 dark:text-white placeholder:text-neutral-500' 
                                placeholder='Search for products...'
                            />
                            <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400' />
                        </div>

                        {/* Mobile Auth Buttons */}
                        <div className='flex flex-col gap-3'>
                            <SignedOut>
                                <SignInButton>
                                    <button className="w-full px-6 py-3 rounded-full font-semibold text-sm border-2 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white hover:border-blue-600 dark:hover:border-blue-400 transition-all duration-300">
                                        Sign In
                                    </button>
                                </SignInButton>
                                <SignUpButton>
                                    <button className="w-full px-6 py-3 rounded-full font-semibold text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transition-all duration-300">
                                        Sign Up
                                    </button>
                                </SignUpButton>
                            </SignedOut>
                            <SignedIn>
                                <div className='flex items-center justify-center py-2'>
                                    <UserButton 
                                        appearance={{
                                            elements: {
                                                avatarBox: "w-12 h-12 rounded-full border-2 border-blue-600 dark:border-blue-400 shadow-lg"
                                            }
                                        }}
                                    />
                                </div>
                            </SignedIn>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Animated border bottom */}
            <motion.div
                className='absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent'
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isScrolled ? 1 : 0 }}
                transition={{ duration: 0.6 }}
            />
        </motion.nav>
    )
}

export default Header