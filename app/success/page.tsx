'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, Mail, Download, ArrowRight, Sparkles, CreditCard, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [confettiComplete, setConfettiComplete] = useState(false);
    const { clearCart } = useCart();
    const router = useRouter()
    useEffect(() => {
        if (sessionId) {
            localStorage.removeItem('cart');
            console.log('Payment successful! Session:', sessionId);
        }

        // Trigger confetti animation completion
        setTimeout(() => setConfettiComplete(true), 2000);
    }, [sessionId]);

    // Animation variants
    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    const iconVariants: any = {
        hidden: { scale: 0, rotate: -180 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: {
                type: 'spring',
                stiffness: 200,
                damping: 15,
                duration: 0.8,
            },
        },
    };

    const cardVariants: any = {
        hidden: { opacity: 0, y: 30 },
        visible: (custom: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: custom * 0.1,
            },
        }),
    };

    

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-blue-950/30 relative overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    animate={{
                        backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: 'reverse',
                    }}
                    className="absolute inset-0 opacity-30 dark:opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(59 130 246 / 0.3) 2px, transparent 0)',
                        backgroundSize: '64px 64px',
                    }}
                />
            </div>

            {/* Floating Particles */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-400/40 rounded-full"
                    animate={{
                        y: [0, -100, 0],
                        x: [0, Math.random() * 100 - 50, 0],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                    }}
                    style={{
                        left: `${20 + i * 15}%`,
                        top: `${30 + (i % 3) * 20}%`,
                    }}
                />
            ))}

            <div className="relative z-10 container mx-auto px-6 py-32 max-w-5xl">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-12"
                >
                    {/* Success Icon */}
                    <motion.div variants={itemVariants} className="flex justify-center">
                        <motion.div
                            variants={iconVariants}
                            className="relative"
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 0.8, 0.5],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                }}
                                className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-2xl"
                            />
                            <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-8 rounded-full">
                                <CheckCircle2 className="w-24 h-24 text-white" strokeWidth={2.5} />
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Heading */}
                    <motion.div variants={itemVariants} className="text-center space-y-6">
                        <motion.div
                            animate={{
                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                            }}
                            className="inline-block"
                        >
                            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none bg-gradient-to-r from-neutral-900 via-blue-800 to-neutral-900 dark:from-white dark:via-blue-300 dark:to-white bg-clip-text text-transparent bg-[length:200%_auto]">
                                Payment Successful!
                            </h1>
                        </motion.div>

                        <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl mx-auto">
                            Your order has been confirmed. We're preparing your items and you'll receive a confirmation email shortly.
                        </p>
                    </motion.div>

                    {/* Order Details Card */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 md:p-12 shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300"
                    >
                        <div className="flex items-start gap-6">
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                                className="w-14 h-14 bg-blue-50 dark:bg-blue-950/30 rounded-2xl flex items-center justify-center flex-shrink-0"
                            >
                                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </motion.div>

                            <div className="flex-1 space-y-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                                        Order Confirmation
                                    </h3>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Your order has been successfully placed and is being processed.
                                    </p>
                                </div>

                                {sessionId && (
                                    <div className="bg-neutral-50 dark:bg-neutral-950 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                                                Order ID
                                            </span>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => navigator.clipboard.writeText(sessionId)}
                                                className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-full font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                                            >
                                                Copy
                                            </motion.button>
                                        </div>
                                        <p className="text-neutral-900 dark:text-white font-mono text-sm mt-2 break-all">
                                            {sessionId}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Info Cards Grid */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Mail,
                                title: 'Email Confirmation',
                                description: 'Check your inbox for order details',
                                color: 'blue',
                            },
                            {
                                icon: CreditCard,
                                title: 'Payment Verified',
                                description: 'Your payment was processed securely',
                                color: 'purple',
                            },
                            {
                                icon: ShoppingBag,
                                title: 'Ready to Ship',
                                description: 'Your items are being prepared',
                                color: 'blue',
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                custom={index + 3}
                                variants={cardVariants}
                                whileHover={{ y: -8, scale: 1.05 }}
                                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 group"
                            >
                                <motion.div
                                    whileHover={{ rotate: [0, -10, 10, 0] }}
                                    transition={{ duration: 0.5 }}
                                    className={`w-12 h-12 bg-${item.color}-50 dark:bg-${item.color}-950/30 rounded-2xl flex items-center justify-center mb-4`}
                                >
                                    <item.icon className={`w-6 h-6 text-${item.color}-600 dark:text-${item.color}-400`} />
                                </motion.div>

                                <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                                    {item.title}
                                </h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
                    >

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                                onClick={() => {
                                clearCart();
                                router.push("/");
                            }}
                        >
                            Continue Shopping
                            <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.div>
                        </motion.button>


                        <Link href="/orders" className="w-full sm:w-auto">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto px-8 py-4 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-semibold rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <Package className="w-5 h-5" />
                                View Orders
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Thank You Message */}
                    <motion.div
                        variants={itemVariants}
                        className="text-center pt-12"
                    >
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="inline-block"
                        >
                            <Sparkles className="w-6 h-6 text-yellow-500 mx-auto mb-4" />
                        </motion.div>
                        <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                            Thank you for shopping with us!
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}