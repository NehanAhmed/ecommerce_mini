import React from 'react'
import { motion, useInView } from 'motion/react'
import { RotateCcw, Shield, Truck, Zap } from 'lucide-react';

const AnimatedSection = ({ children, className = "" }) => {
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

const FloatingCard = ({ children, delay = 0 }) => {
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

const features = [
    { icon: <Truck className="w-6 h-6" />, title: 'Free Shipping', desc: 'On all orders over $100' },
    { icon: <Shield className="w-6 h-6" />, title: '2-Year Warranty', desc: 'Extended protection plan' },
    { icon: <RotateCcw className="w-6 h-6" />, title: 'Easy Returns', desc: '30-day return policy' },
    { icon: <Zap className="w-6 h-6" />, title: 'Fast Delivery', desc: '2-3 business days' },
];


const Stats = () => {
    return (
        <section className="py-32 px-6 relative bg-neutral-50 dark:bg-neutral-900/30">
            <div className="max-w-7xl mx-auto">
                <AnimatedSection>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, i) => (
                            <FloatingCard key={i} delay={i * 0.1}>
                                <motion.div
                                    className="group p-8 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-shadow duration-300"
                                    whileHover={{
                                        borderColor: 'rgb(59, 130, 246)',
                                        boxShadow: '0 20px 40px rgba(59, 130, 246, 0.1)'
                                    }}
                                >
                                    <motion.div
                                        className="w-14 h-14 bg-blue-50 dark:bg-blue-950/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6"
                                        whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {feature.icon}
                                    </motion.div>
                                    <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-white">{feature.title}</h3>
                                    <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">{feature.desc}</p>
                                </motion.div>
                            </FloatingCard>
                        ))}
                    </div>
                </AnimatedSection>
            </div>
        </section>
    )
}

export default Stats