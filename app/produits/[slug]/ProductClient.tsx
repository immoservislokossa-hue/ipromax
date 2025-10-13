'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image'; 
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Truck,
  FileText,
  Key,
  Star,
  Sparkles,
  CheckCircle2,
  BadgePercent,
  Diamond,
  ShieldCheck,
  Package,
  Image as ImageIcon,
} from 'lucide-react';

export default function ProductClient({ product }: { product: any }) {
  const router = useRouter();
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const FALLBACK_IMAGE = 'https://images.pexels.com/photos/34123134/pexels-photo-34123134.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1';

  const currentImage = imageError ? FALLBACK_IMAGE : product.image || FALLBACK_IMAGE;

  // Gestion du sticky CTA
  useEffect(() => {
    const handleScroll = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      setIsSticky(rect.bottom < 100);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOrderNow = () => {
    if (product?.order_link) window.open(product.order_link, '_blank');
    else router.push('/cart');
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const formattedPrice = (product.price ?? 0).toLocaleString();
  const formattedOldPrice =
    product.original_price && product.original_price > 0
      ? product.original_price.toLocaleString()
      : null;

  // Animation variants corrigées pour TypeScript
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: {
      opacity: 1,
      scale: 1
    },
    hover: {
      scale: 1.05
    }
  };

  const stickyVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 100, opacity: 0 }
  };

  return (
    <div
      className={`relative min-h-screen text-gray-900 ${
        product.is_luxury
          ? 'bg-gradient-to-br from-white via-amber-50/30 to-orange-50/20'
          : 'bg-gradient-to-br from-white via-blue-50/20 to-gray-50'
      }`}
    >
     
      {/* --- SECTION HERO --- */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start"
      >
        {/* 🎨 Image principale avec format 4/3 fixe sur desktop */}
        <motion.div 
          variants={itemVariants} 
          className="space-y-6 lg:sticky lg:top-8 lg:h-fit"
        >
          <motion.div
            variants={imageVariants}
            whileHover="hover"
            className={`relative rounded-3xl overflow-hidden shadow-2xl ${
              product.is_luxury
                ? 'bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-200/50'
                : 'bg-gradient-to-br from-blue-50 to-gray-100 border-2 border-gray-100'
            } group aspect-[4/3] lg:aspect-[4/3]`} // Format 4/3 sur tous les écrans
          >
            {/* Skeleton loader amélioré */}
            <AnimatePresence>
              {!imageLoaded && !imageError && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center z-10"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Image optimisée avec Next.js Image en format 4/3 */}
            <div className="relative w-full h-full">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, (max-width: 1400px) 40vw, 35vw"
                className="object-cover"
                onLoad={handleImageLoad}
                onError={handleImageError}
                priority
                quality={85}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R"
              />
              
              {/* Fallback icon */}
              {imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
                  <div className="text-center">
                    <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Image non disponible</p>
                  </div>
                </div>
              )}
            </div>

            {/* --- BADGES DYNAMIQUES --- */}
            <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2 z-30">
              {product.promo && (
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs px-3 py-2 rounded-full font-semibold flex items-center gap-1 shadow-lg"
                >
                  <BadgePercent size={14} /> Promo
                </motion.span>
              )}

              {product.is_new && (
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-3 py-2 rounded-full font-semibold flex items-center gap-1 shadow-lg"
                >
                  <Sparkles size={14} /> Nouveau
                </motion.span>
              )}

              {product.is_luxury && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 text-gray-900 font-semibold text-xs px-4 py-2 rounded-full flex items-center gap-1 shadow-lg"
                >
                  <Diamond size={14} /> Édition Luxe
                </motion.span>
              )}
            </div>
          </motion.div>

          {/* 🖼️ Image supplémentaire en format 4/3 (optionnelle) */}
          {product.secondary_image && (
            <motion.div
              variants={itemVariants}
              className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3] bg-gray-100 lg:sticky lg:top-[calc(100vh-200px)] lg:mt-6"
            >
              <Image
                src={product.secondary_image}
                alt={`${product.name} - vue supplémentaire`}
                fill
                sizes="(max-width: 1024px) 100vw, (max-width: 1400px) 40vw, 35vw"
                className="object-cover"
                quality={75}
              />
            </motion.div>
          )}
        </motion.div>

        {/* --- SECTION DÉTAILS --- */}
        <motion.div variants={containerVariants} className="space-y-6">
          {/* Titre - TAILLE RÉDUITE */}
          <motion.div variants={itemVariants}>
            <motion.h1
              className={`text-2xl md:text-3xl font-black mb-4 leading-tight bg-gradient-to-r ${
                product.is_luxury 
                  ? 'from-amber-700 to-orange-600' 
                  : 'from-blue-600 to-blue-700' // Toujours en bleu maintenant
              } bg-clip-text text-transparent`}
            >
              {product.name}
            </motion.h1>

            {/* Catégorie / Marque */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-sm font-medium text-gray-500 capitalize bg-gray-100 px-3 py-1.5 rounded-full">
                {product.category}
              </span>
              {product.brand && (
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  {product.brand}
                </span>
              )}
            </div>
          </motion.div>

          {/* ⭐ Note & Achats */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.2 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Star
                    size={20}
                    className={`${
                      i < Math.round(product.rating || 0)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </motion.div>
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700 ml-1">
              ({product.rating?.toFixed(1) || '3.0'})
            </span>
            {product.purchase_count > 0 && (
              <span className="text-sm text-gray-500 ml-2 border-l border-gray-300 pl-2">
                {product.purchase_count}+ ventes
              </span>
            )}
          </motion.div>

          {/* 💰 Prix + CTA principal */}
          <motion.div variants={itemVariants} ref={buttonRef}>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl font-bold text-blue-700">
                {formattedPrice} FCFA
              </span>
              {formattedOldPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {formattedOldPrice} FCFA
                </span>
              )}
            </div>

            <motion.button
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOrderNow}
              className="w-full py-4 rounded-2xl font-bold text-lg shadow-2xl flex items-center justify-center gap-3 transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900"
            >
              <ShoppingCart size={24} />
              Acheter maintenant
            </motion.button>
          </motion.div>

          {/* 🧾 Description courte */}
          <motion.div variants={itemVariants}>
            <p className="text-gray-600 leading-relaxed text-lg font-medium">
              {product.description}
            </p>
          </motion.div>

          {/* 📖 Description détaillée */}
          <motion.section
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-gray-100"
          >
            <h2 className="text-2xl font-black text-gray-900 mb-6">
              À propos du produit
            </h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed text-lg">
              {product.detailed_description}
            </p>
          </motion.section>

          {/* ⚙️ Caractéristiques */}
          {product.features && (
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 rounded-3xl p-8 shadow-sm"
            >
              <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <CheckCircle2 className="text-green-600" size={24} /> 
                Caractéristiques principales
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {product.features}
              </p>
            </motion.div>
          )}

          {/* 🎯 Bénéfices */}
          {product.benefits && (
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-3xl p-8 shadow-sm"
            >
              <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <Sparkles className="text-blue-600" size={24} /> 
                Pourquoi choisir ce produit ?
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {product.benefits}
              </p>
            </motion.div>
          )}

          {/* 🚚 Informations pratiques */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Livraison */}
            {product.delivery_info && (
              <motion.div
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4"
              >
                <Truck className="text-blue-600 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Livraison</h4>
                  <p className="text-gray-700 text-sm">{product.delivery_info}</p>
                </div>
              </motion.div>
            )}

            {/* Format */}
            {product.file_format && (
              <motion.div
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4"
              >
                <FileText className="text-purple-600 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Format</h4>
                  <p className="text-gray-700 text-sm">{product.file_format}</p>
                </div>
              </motion.div>
            )}

            {/* Accès */}
            {product.access_type && (
              <motion.div
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4"
              >
                <Key className="text-orange-600 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Accès</h4>
                  <p className="text-gray-700 text-sm">{product.access_type}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}