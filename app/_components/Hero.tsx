import { ChevronRight, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react"
import Link from "next/link";
const Hero = () => {

    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

    return (
        <section className="relative min-h-screen flex items-center justify-center">
            <motion.div
                className="absolute inset-0 overflow-hidden"
                style={{ y: backgroundY }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30 dark:from-blue-950/20 dark:via-neutral-950 dark:to-purple-950/20" />
                <motion.div
                    className="absolute inset-0 opacity-30"
                    animate={{
                        backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'linear'
                    }}
                    style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.15) 1px, transparent 0)',
                        backgroundSize: '64px 64px',
                    }}
                />
            </motion.div>

            <motion.div
                className="relative z-10 max-w-7xl mx-auto px-6 text-center"
                style={{ opacity }}
            >
                <motion.div
                    className="space-y-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 rounded-full border border-blue-200 dark:border-blue-800/50 backdrop-blur-sm"
                    >
                        <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">Premium Electronics • Curated Excellence</span>
                    </motion.div>

                    <motion.h1
                        className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <span className="block bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent">
                            Elevate Your
                        </span>
                        <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Digital Life
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        Discover premium electronics that blend cutting-edge technology with timeless design.
                        Curated for those who demand excellence.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                    >
                        <Link href='/products'>
                            <motion.button
                                className="group relative px-8 py-4 bg-blue-600 dark:bg-blue-500 text-white rounded-full font-semibold text-base shadow-lg overflow-hidden"
                                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Shop Collection
                                    <motion.div
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </motion.div>
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-600"
                                    initial={{ x: '100%' }}
                                    whileHover={{ x: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.button>
                        </Link>
                        <motion.button
                            className="px-8 py-4 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-full font-semibold text-base"
                            whileHover={{ scale: 1.05, borderColor: 'rgb(59, 130, 246)' }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            Explore Deals
                        </motion.button>
                    </motion.div>
                </motion.div>
            </motion.div>

            <motion.div
                className="absolute bottom-12 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
                <div className="w-6 h-10 border-2 border-neutral-400 dark:border-neutral-600 rounded-full flex items-start justify-center p-2">
                    <motion.div
                        className="w-1 h-3 bg-neutral-600 dark:bg-neutral-400 rounded-full"
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </div>
            </motion.div>
        </section>
    )
}

export default Hero