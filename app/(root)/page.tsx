'use client'

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ShoppingCart, Shield, Truck, RotateCcw, Star, ChevronRight, Zap, Cpu, ArrowRight, Sparkles } from 'lucide-react';
import Footer from '../_components/Footer';
import Hero from '../_components/Hero';
import Stats from '../_components/Stats';
import FeauturedProduct from '../_components/FeauturedProduct';

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

export default function EcommerceLanding() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { scrollYProgress } = useScroll();
  
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
      <Hero />

      {/* Features Section */}
     <Stats />

      {/* Featured Products */}
      <FeauturedProduct />

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
    </div>
  );
}