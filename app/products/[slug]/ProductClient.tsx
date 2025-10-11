'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'lucide-react';

export default function ProductClient({ product }: { product: any }) {
  const router = useRouter();
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [isSticky, setIsSticky] = useState(false);

  // 👀 Gestion du sticky CTA quand le bouton sort de l’écran
  useEffect(() => {
    const handleScroll = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      setIsSticky(rect.bottom < 100); // Active le sticky quand le bouton quitte l’écran
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOrderNow = () => {
    if (product?.order_link) window.open(product.order_link, '_blank');
    else router.push('/cart');
  };


  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
      {/* 🧭 Sticky mini bar (mobile) */}
      <AnimatePresence>
        {isSticky && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] sm:w-[70%] md:hidden bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg rounded-2xl flex items-center justify-between px-4 py-3"
          >
            <div className="flex flex-col w-[70%]">
              <span className="text-xs font-medium text-gray-600 truncate">
                {product.name}
              </span>
              <span className="font-bold text-lg text-blue-700">
                {parseInt(product.price).toLocaleString()} FCFA
              </span>
            </div>
            <button
              onClick={handleOrderNow}
              className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-md"
            >
              Acheter
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SECTION HERO --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* 🎨 Image principale + Galerie */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 relative group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {product.promo && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1">
                <BadgePercent size={14} /> Promo
              </span>
            )}
            {product.is_new && (
              <span className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1">
                <Sparkles size={14} /> Nouveau
              </span>
            )}
          </div>

          
        </motion.div>

        {/* --- SECTION DÉTAILS --- */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight"
          >
            {product.name}
          </motion.h1>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-sm font-medium text-gray-500 capitalize">
              {product.category}
            </span>
            {product.brand && (
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                {product.brand}
              </span>
            )}
          </div>

          {/* ⭐ Note & Achats */}
          <div className="flex items-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={`${
                  i < Math.round(product.rating || 0)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
            {product.purchase_count > 0 && (
              <span className="text-sm text-gray-500">
                ({product.purchase_count} ventes)
              </span>
            )}
          </div>

          {/* 💰 Prix + CTA principal */}
          <div ref={buttonRef}>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-blue-700">
                {parseInt(product.price).toLocaleString()} FCFA
              </span>
              {product.original_price && (
                <span className="text-lg text-gray-400 line-through">
                  {parseInt(product.original_price).toLocaleString()} FCFA
                </span>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOrderNow}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} /> Acheter maintenant
            </motion.button>
          </div>

          {/* 🧾 Description courte */}
          <p className="mt-6 text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* 📖 Description détaillée */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-10 space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">
              À propos du produit
            </h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {product.detailed_description}
            </p>
          </motion.section>

          {/* ⚙️ Caractéristiques */}
          {product.features && (
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="text-green-600" /> Caractéristiques
              </h3>
              <p className="text-gray-700 leading-relaxed">{product.features}</p>
            </div>
          )}

          {/* 🎯 Bénéfices */}
          {product.benefits && (
            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="text-blue-600" /> Bénéfices
              </h3>
              <p className="text-gray-700 leading-relaxed">{product.benefits}</p>
            </div>
          )}

          {/* 🚚 Livraison */}
          {product.delivery_info && (
            <div className="mt-6 flex items-start gap-3 text-gray-700">
              <Truck className="text-blue-600 mt-1" />
              <p>{product.delivery_info}</p>
            </div>
          )}

          {/* 📁 Format & Accès */}
          <div className="mt-6 flex flex-col gap-3 text-gray-700">
            {product.file_format && (
              <p className="flex items-center gap-2">
                <FileText className="text-purple-600" />
                <span>Format : {product.file_format}</span>
              </p>
            )}
            {product.access_type && (
              <p className="flex items-center gap-2">
                <Key className="text-orange-600" />
                <span>Accès : {product.access_type}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
