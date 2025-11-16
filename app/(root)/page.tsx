'use client'

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ShoppingCart, Shield, Truck, RotateCcw, Star, ChevronRight, Zap, Cpu, ArrowRight, Sparkles } from 'lucide-react';

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

export default function EcommerceLanding() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const products = [
    { name: 'Pro Wireless Earbuds', spec: 'ANC | 30hr Battery', price: '$299', image: '🎧' },
    { name: 'Ultra 4K Monitor', spec: '32" | 144Hz HDR', price: '$799', image: '🖥️' },
    { name: 'Gaming Laptop Pro', spec: 'RTX 4080 | 32GB RAM', price: '$2,499', image: '💻' },
    { name: 'Smart Watch Elite', spec: 'GPS | Health Tracking', price: '$449', image: '⌚' },
  ];

  const testimonials = [
    { name: 'Sarah Chen', role: 'Tech Enthusiast', quote: 'Best shopping experience! Fast delivery and premium quality products that exceed expectations.', rating: 5 },
    { name: 'Michael Roberts', role: 'Developer', quote: 'The customer service is exceptional. They helped me choose the perfect setup for my home office.', rating: 5 },
    { name: 'Emma Thompson', role: 'Designer', quote: 'Love the quality and attention to detail. Every product feels premium and well-crafted.', rating: 5 },
  ];

  const features = [
    { icon: <Truck className="w-6 h-6" />, title: 'Free Shipping', desc: 'On all orders over $100' },
    { icon: <Shield className="w-6 h-6" />, title: '2-Year Warranty', desc: 'Extended protection plan' },
    { icon: <RotateCcw className="w-6 h-6" />, title: 'Easy Returns', desc: '30-day return policy' },
    { icon: <Zap className="w-6 h-6" />, title: 'Fast Delivery', desc: '2-3 business days' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white overflow-hidden">
      {/* Hero Section */}
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

      {/* Features Section */}
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

      {/* Featured Products */}
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

      {/* Testimonials */}
      <section className="py-32 px-6 bg-neutral-50 dark:bg-neutral-900/30">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900 dark:text-white">Loved by Customers</h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">Join thousands of satisfied tech enthusiasts</p>
          </AnimatedSection>

          <AnimatedSection>
            <div className="relative">
              <motion.div 
                className="bg-white dark:bg-neutral-900 rounded-3xl p-12 md:p-16 border border-neutral-200 dark:border-neutral-800 shadow-lg"
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-center mb-8">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1, duration: 0.3 }}
                    >
                      <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                    </motion.div>
                  ))}
                </div>
                
                <p className="text-xl md:text-2xl text-center mb-10 leading-relaxed text-neutral-700 dark:text-neutral-300 font-light">
                  "{testimonials[activeTestimonial].quote}"
                </p>
                
                <div className="text-center">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {testimonials[activeTestimonial].name.charAt(0)}
                  </motion.div>
                  <p className="font-semibold text-lg text-neutral-900 dark:text-white">{testimonials[activeTestimonial].name}</p>
                  <p className="text-neutral-500 dark:text-neutral-500">{testimonials[activeTestimonial].role}</p>
                </div>
              </motion.div>

              <div className="flex justify-center gap-3 mt-10">
                {testimonials.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === activeTestimonial 
                        ? 'w-10 bg-blue-600 dark:bg-blue-500' 
                        : 'w-2 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <motion.div 
              className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 md:p-20 text-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="absolute inset-0 opacity-20"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'linear'
                }}
                style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.3) 1px, transparent 0)',
                  backgroundSize: '48px 48px',
                }}
              />
              
              <div className="relative z-10">
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold mb-4 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  Stay Updated
                </motion.h2>
                <motion.p 
                  className="text-blue-50 text-lg md:text-xl mb-10 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Subscribe to our newsletter for exclusive deals, new product launches, and tech insights.
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-white/50 text-white transition-all duration-300"
                  />
                  <motion.button 
                    className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(255, 255, 255, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Subscribe
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
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
    </div>
  );
}