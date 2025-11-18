'use client'
import { ChevronRight, Cpu } from 'lucide-react'
import { motion } from 'motion/react'

const Footer = () => {
    return (
        <main>
            <footer className="border-t border-neutral-200 dark:border-neutral-800 py-16 px-6 bg-neutral-50 dark:bg-neutral-900/30">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <motion.div
                                className="flex items-center gap-2 mb-4"
                                whileHover={{ scale: 1.05 }}
                            >
                                <Cpu className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                <span className="text-xl font-bold text-neutral-900 dark:text-white">TechLux</span>
                            </motion.div>
                            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                                Premium electronics for the modern lifestyle.
                            </p>
                        </div>

                        {[
                            { title: 'Shop', links: ['New Arrivals', 'Best Sellers', 'Deals'] },
                            { title: 'Support', links: ['Contact Us', 'Shipping Info', 'Returns'] },
                            { title: 'Company', links: ['About Us', 'Careers', 'Privacy Policy'] }
                        ].map((section, i) => (
                            <div key={i}>
                                <h4 className="font-semibold mb-4 text-neutral-900 dark:text-white">{section.title}</h4>
                                <ul className="space-y-3">
                                    {section.links.map((link, j) => (
                                        <li key={j}>
                                            <motion.a
                                                href="#"
                                                className="text-neutral-600 dark:text-neutral-400 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-2 group"
                                                whileHover={{ x: 5 }}
                                            >
                                                <span>{link}</span>
                                                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </motion.a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 text-center">
                        <p className="text-neutral-500 dark:text-neutral-500 text-sm">
                            © 2024 TechLux. All rights reserved. Crafted with excellence.
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    )
}

export default Footer