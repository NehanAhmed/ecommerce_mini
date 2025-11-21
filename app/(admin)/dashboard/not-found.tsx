'use client'

import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';
import { Home, Search, ShoppingBag, ArrowRight, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const controls = useAnimation();
    const router = useRouter();

    useEffect(() => {
        controls.start({
            rotate: [0, 5, -5, 0],
            transition: { duration: 4, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }
        });
    }, [controls]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth - 0.5) * 20;
        const y = (clientY / innerHeight - 0.5) * 20;
        setMousePosition({ x, y });
    };

    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: any = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    const floatingVariants: any = {
        animate: {
            y: [-10, 10, -10],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: [0.42, 0, 0.58, 1],
            }
        }
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4 overflow-hidden relative"
            onMouseMove={handleMouseMove}
        >
            {/* Animated background elements */}
            <motion.div
                className="absolute top-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-20 right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.5, 0.3, 0.5],
                }}
                transition={{ duration: 8, repeat: Infinity }}
            />

            <motion.div
                className="max-w-4xl w-full relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Floating icons */}
                <div className="absolute -top-10 -left-10 hidden md:block">
                    <motion.div variants={floatingVariants} animate="animate">
                        <Package className="w-16 h-16 text-muted-foreground/20" />
                    </motion.div>
                </div>
                <div className="absolute -bottom-10 -right-10 hidden md:block">
                    <motion.div
                        variants={floatingVariants}
                        animate="animate"
                        transition={{ delay: 1.5 }}
                    >
                        <ShoppingBag className="w-20 h-20 text-muted-foreground/20" />
                    </motion.div>
                </div>

                <div className="text-center">
                    {/* 404 Number with parallax effect */}
                    <motion.div
                        variants={itemVariants}
                        style={{
                            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
                        }}
                        className="relative mb-8"
                    >
                        <motion.h1
                            className="text-[12rem] md:text-[16rem] font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/60 to-muted-foreground/40 leading-none select-none"
                            animate={controls}
                        >
                            404
                        </motion.h1>
                        <motion.div
                            className="absolute inset-0 text-[12rem] md:text-[16rem] font-bold text-border/30 leading-none select-none blur-sm"
                            animate={{
                                scale: [1, 1.02, 1],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            404
                        </motion.div>
                    </motion.div>

                    {/* Main content */}
                    <motion.div variants={itemVariants} className="space-y-4 mb-12">
                        <motion.h2
                            className="text-3xl md:text-5xl font-bold text-foreground"
                            whileHover={{ scale: 1.02 }}
                        >
                            Page Not Found
                        </motion.h2>
                        <motion.p
                            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
                            variants={itemVariants}
                        >
                            Oops! Looks like this product has been sold out from our catalog.
                            Let's get you back to shopping.
                        </motion.p>
                    </motion.div>

                    {/* Action buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <motion.button
                            className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/dashboard')}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: "100%" }}
                                transition={{ duration: 0.5 }}
                            />
                            <span className="relative flex items-center gap-2">
                                <Home className="w-5 h-5" />
                                Back to Home
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </motion.div>
                            </span>
                        </motion.button>

                        <motion.button
                            className="group px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/products')}
                        >
                            <span className="flex items-center gap-2">
                                <Search className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                Search Products
                            </span>
                        </motion.button>
                    </motion.div>

                    {/* Decorative elements */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-16 flex justify-center gap-2"
                    >
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-2 h-2 rounded-full bg-primary/40"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.4, 1, 0.4],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </motion.div>
                </div>

                {/* Bottom suggestion cards */}
                <motion.div
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16"
                >
                    {[
                        { icon: ShoppingBag, title: "Continue Shopping", desc: "Browse our collection" },
                        { icon: Package, title: "Track Order", desc: "Check your orders" },
                        { icon: Search, title: "Need Help?", desc: "Contact support" }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="bg-card border border-border rounded-xl p-6 cursor-pointer group hover:shadow-lg transition-all"
                        >
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                                className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
                            >
                                <item.icon className="w-6 h-6 text-primary" />
                            </motion.div>
                            <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
}