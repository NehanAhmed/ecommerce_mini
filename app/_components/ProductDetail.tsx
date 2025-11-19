'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw, Star, ChevronLeft, ChevronRight, Check, Info } from 'lucide-react';
import AddToCartButton from './AddToCartButton';

interface ProductDetailsProps {
  product: {
    _id: string
    name: string;
    slug: string
    description: string;
    price: number;
    compareAtPrice?: number;
    category: string;
    brand?: string;
    images: string[];
    stock: number;
    sku: string;
    specifications?: Record<string, string>;
    tags?: string[];
  };
}

export const ProductDetailPage: React.FC<ProductDetailsProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedTab, setSelectedTab] = useState('description');

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const imageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30 dark:from-blue-950/20 dark:via-neutral-950 dark:to-purple-950/20"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-8"
        >
          <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">Home</span>
          <span>/</span>
          <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">{product.category}</span>
          <span>/</span>
          <span className="text-neutral-900 dark:text-white font-medium">{product.name}</span>
        </motion.div>

        {/* Main Product Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <AnimatePresence initial={false} custom={selectedImage}>
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  custom={selectedImage}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1, x: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 shadow-lg flex items-center justify-center text-neutral-900 dark:text-white hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, x: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 shadow-lg flex items-center justify-center text-neutral-900 dark:text-white hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </motion.button>
                </>
              )}

              {/* Discount Badge */}
              {discount > 0 && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', delay: 0.5 }}
                  className="absolute top-4 right-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg"
                >
                  -{discount}%
                </motion.div>
              )}

              {/* Stock Badge */}
              {product.stock < 10 && product.stock > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.7 }}
                  className="absolute bottom-4 left-4 bg-amber-400 text-neutral-900 px-4 py-2 rounded-full font-semibold text-sm shadow-lg"
                >
                  Only {product.stock} left!
                </motion.div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <motion.div
                className="grid grid-cols-5 gap-3"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {product.images.map((image, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${selectedImage === index
                      ? 'border-blue-600 dark:border-blue-500 shadow-lg shadow-blue-600/20'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-blue-400 dark:hover:border-blue-600'
                      }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Brand & Category */}
            <motion.div variants={fadeInUp} className="flex items-center gap-3">
              {product.brand && (
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {product.brand}
                </span>
              )}
              <span className="text-sm text-neutral-500 dark:text-neutral-500">•</span>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">{product.category}</span>
            </motion.div>

            {/* Product Name */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white leading-tight tracking-tight"
            >
              {product.name}
            </motion.h1>

            {/* Rating */}
            <motion.div variants={fadeInUp} className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.8 + i * 0.1, type: 'spring' }}
                  >
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  </motion.div>
                ))}
              </div>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">(4.8) • 234 reviews</span>
            </motion.div>

            {/* Price */}
            <motion.div variants={fadeInUp} className="flex items-baseline gap-4">
              <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-2xl text-neutral-400 dark:text-neutral-600 line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </motion.div>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400"
            >
              {product.description}
            </motion.p>

            {/* SKU */}
            <motion.div variants={fadeInUp} className="text-sm text-neutral-500 dark:text-neutral-500">
              SKU: {product.sku}
            </motion.div>

            {/* Quantity & Add to Cart */}
            <motion.div variants={fadeInUp} className="flex gap-4 pt-4">
              {/* Quantity Selector */}
              <div className="flex items-center border border-neutral-300 dark:border-neutral-800 rounded-full overflow-hidden">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-6 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                >
                  -
                </motion.button>
                <span className="px-6 py-3 font-semibold min-w-[60px] text-center">{quantity}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-6 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                >
                  +
                </motion.button>
              </div>

              {/* Add to Cart Button */}
              <AddToCartButton product={{ name: product.name, image: product.images[0], price: product.price, slug: product.slug, id: product._id }} />
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={fadeInUp} className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`flex-1 border-2 ${isWishlisted
                  ? 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-500'
                  : 'border-neutral-300 dark:border-neutral-800 hover:border-red-400'
                  } font-semibold px-8 py-4 rounded-full flex items-center justify-center gap-3 transition-all`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
                {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, rotate: 15 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-neutral-300 dark:border-neutral-800 font-semibold px-6 py-4 rounded-full flex items-center justify-center hover:border-blue-400 dark:hover:border-blue-600 transition-all"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </motion.div>

            {/* Features */}
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-800"
            >
              {[
                { icon: Truck, label: 'Free Delivery', sublabel: 'On orders $50+' },
                { icon: Shield, label: 'Secure Payment', sublabel: '100% Protected' },
                { icon: RotateCcw, label: 'Easy Returns', sublabel: '30-day policy' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                  className="flex flex-col items-center text-center p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-3">
                    <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-semibold text-sm text-neutral-900 dark:text-white">{feature.label}</span>
                  <span className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">{feature.sublabel}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm"
        >
          {/* Tab Headers */}
          <div className="flex gap-8 border-b border-neutral-200 dark:border-neutral-800 mb-8">
            {['description', 'specifications'].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`pb-4 font-semibold capitalize relative ${selectedTab === tab
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab}
                {selectedTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {selectedTab === 'description' && (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Product Description</h3>
                <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {product.description}
                </p>
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4">
                    {product.tags.map((tag, index) => (
                      <motion.span
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.1, y: -2 }}
                        className="px-4 py-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium"
                      >
                        #{tag}
                      </motion.span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {selectedTab === 'specifications' && (
              <motion.div
                key="specifications"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">Technical Specifications</h3>
                {product.specifications ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value], index) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 5, backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                        className="flex justify-between items-center p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 transition-all"
                      >
                        <span className="font-semibold text-neutral-900 dark:text-white">{key}</span>
                        <span className="text-neutral-600 dark:text-neutral-400">{value}</span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-12 text-neutral-500 dark:text-neutral-500">
                    <Info className="w-5 h-5 mr-2" />
                    No specifications available
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

