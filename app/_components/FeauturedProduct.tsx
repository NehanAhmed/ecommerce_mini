import { ShoppingCart } from 'lucide-react';
import { motion, useInView } from 'motion/react'
import React from 'react';

interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
}

const AnimatedSection = ({ children, className = "" }: AnimatedSectionProps) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

interface FloatingCardProps {
    children: React.ReactNode;
    delay?: number;
}

const FloatingCard = ({ children, delay = 0 }: FloatingCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
        >
            {children}
        </motion.div>
    );
};

const products = [
    { name: 'Pro Wireless Earbuds', spec: 'ANC | 30hr Battery', price: '$299', image: '🎧' },
    { name: 'Ultra 4K Monitor', spec: '32" | 144Hz HDR', price: '$799', image: '🖥️' },
    { name: 'Gaming Laptop Pro', spec: 'RTX 4080 | 32GB RAM', price: '$2,499', image: '💻' },
    { name: 'Smart Watch Elite', spec: 'GPS | Health Tracking', price: '$449', image: '⌚' },
];
const FeauturedProduct = () => {
    return (
        <section className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
                <AnimatedSection className="text-center mb-20">
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900 dark:text-white"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Featured Products
                    </motion.h2>
                    <motion.p
                        className="text-neutral-600 dark:text-neutral-400 text-lg"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Handpicked essentials for the modern lifestyle
                    </motion.p>
                </AnimatedSection>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product, i) => (
                        <FloatingCard key={i} delay={i * 0.15}>
                            <motion.div
                                className="group relative bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800"
                                whileHover={{
                                    borderColor: 'rgb(59, 130, 246)',
                                    boxShadow: '0 20px 40px rgba(59, 130, 246, 0.15)'
                                }}
                            >
                                <motion.div
                                    className="aspect-square bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 flex items-center justify-center text-7xl relative overflow-hidden"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <span className="relative z-10">{product.image}</span>
                                </motion.div>
                                <div className="p-6">
                                    <h3 className="font-semibold text-lg mb-2 text-neutral-900 dark:text-white">{product.name}</h3>
                                    <p className="text-neutral-500 dark:text-neutral-500 text-sm mb-4">{product.spec}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{product.price}</span>
                                        <motion.button
                                            className="px-5 py-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-full text-sm font-semibold flex items-center gap-2 shadow-sm"
                                            whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)' }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Add
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </FloatingCard>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeauturedProduct