"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Sparkles, Star } from "lucide-react";
import { ProductBadge } from "./ProductBadge";

export interface Product {
  slug: string;
  name: string;
  description?: string;
  detailed_description?: string;
  price?: number;
  original_price?: number;
  rating?: number;
  purchase_count?: number;
  image?: string;
  is_new?: boolean;
  promo?: boolean;
  category?: string;
  brand?: string;
  order_link?: string;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

// 🌄 Image par défaut
const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/34123134/pexels-photo-34123134.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1";

const ProductCard: React.FC<ProductCardProps> = ({ product, className = "" }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 🚀 Le bouton redirige TOUJOURS vers /produits/[slug]
  const handleAction = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    setIsLoading(false);
    router.push(`/produits/${product.slug}`);
  };

  const handleProductClick = () => router.push(`/produits/${product.slug}`);

  // 💸 Calcul de la réduction
  const discount =
    product.original_price && product.original_price > (product.price ?? 0)
      ? Math.round(
          ((product.original_price - (product.price ?? 0)) / product.original_price) *
            100
        )
      : null;

  // 🧩 Gestion des images
  const getImageSrc = () => {
    if (!product.image || product.image.trim() === "") return FALLBACK_IMAGE;
    if (product.image.startsWith("http")) return product.image;
    return FALLBACK_IMAGE; // à adapter si tu veux gérer des paths Supabase
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -5, scale: 1.01 }}
      onClick={handleProductClick}
      className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 cursor-pointer flex flex-col font-[Poppins] ${className}`}
    >
      {/* --- IMAGE --- */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <motion.img
          src={getImageSrc()}
          alt={product.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* ❤️ Favori */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-md rounded-full p-2 shadow text-gray-600 hover:text-blue-600 transition"
          aria-label="Ajouter aux favoris"
        >
          <Heart size={16} />
        </motion.button>

        {/* 🔖 Badges */}
        <div className="absolute top-3 left-3 space-y-2">
          {product.is_new && <ProductBadge type="new" />}
          {product.promo && <ProductBadge type="sale" />}
        </div>
      </div>

      {/* --- CONTENU --- */}
      <div className="flex flex-col flex-1 px-5 py-4 space-y-2 md:space-y-3">
        {/* 🏷️ Marque + Catégorie */}
        {(product.brand || product.category) && (
          <div className="text-[12px] text-blue-600 uppercase tracking-wider font-semibold">
            {product.brand} {product.brand && product.category && "•"} {product.category}
          </div>
        )}

        {/* 🧠 Nom */}
        <h3 className="font-semibold text-gray-900 text-[17px] md:text-[18px] leading-tight line-clamp-2 group-hover:text-blue-700 transition-colors duration-300">
          {product.name}
        </h3>

        {/* ✍️ Description */}
        {product.description && (
          <p className="text-[13px] text-gray-500 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* ⭐ Évaluation + Achats */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={15}
                fill={i < Math.round(product.rating ?? 0) ? "#facc15" : "none"}
                stroke="#facc15"
              />
            ))}
            <span className="text-[12px] text-gray-700 ml-1 font-medium">
              {(product.rating ?? 0).toFixed(1)}
            </span>
          </div>

          {product.purchase_count && (
            <span className="text-[12px] font-semibold text-white bg-black px-3 py-1 rounded-full shadow-sm">
              {product.purchase_count} achats
            </span>
          )}
        </div>

        {/* 💰 Prix + Ancien prix + Réduction */}
        <div className="flex items-center justify-between mt-1">
          {(product.price ?? 0) === 0 ? (
            <span className="text-green-600 font-semibold text-[14px] flex items-center gap-1">
              <Sparkles size={14} /> Gratuit
            </span>
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-blue-700 font-bold text-[18px]">
                  {(product.price ?? 0).toLocaleString()} FCFA
                </span>
                {product.original_price && (
                  <span className="text-gray-400 text-[13px] line-through">
                    {product.original_price.toLocaleString()} FCFA
                  </span>
                )}
              </div>
              {discount && (
                <span className="bg-blue-50 text-blue-600 text-[12px] font-semibold px-2 py-0.5 rounded-full">
                  -{discount}%
                </span>
              )}
            </>
          )}
        </div>

        {/* 🛒 Bouton principal */}
        <motion.button
          onClick={handleAction}
          disabled={isLoading}
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.03 }}
          className={`btn-primary w-full py-3 px-5 rounded-full font-semibold text-[15px] mt-2 shadow-sm ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isLoading
            ? "Chargement..."
            : (product.price ?? 0) === 0
            ? "Obtenir gratuitement"
            : "Ça m’intéresse"}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
