"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Sparkles, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "./ProductCard"; // ✅ on réutilise ton interface

const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/34123134/pexels-photo-34123134.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1";

export default function VerticalProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Récupération des produits récents
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("Propulser") // ta table produits
          .select("*")
          .order("created_at", { ascending: false }) // ✅ plus récents d'abord
          .limit(5);

        if (error) throw error;
        setProducts(data || []);
      } catch (err: any) {
        console.error("Erreur chargement produits :", err.message || err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <p className="text-center text-gray-500 py-6">
        Aucun produit disponible pour le moment.
      </p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col divide-y divide-gray-200"
    >
      {products.map((product, index) => (
        <Link
          key={product.slug}
          href={`/produits/${product.slug}`}
          className="group flex items-center gap-4 py-4 hover:bg-gray-50/60 transition-all rounded-xl px-2"
        >
          {/* IMAGE */}
          <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
            <Image
              src={
                product.image && product.image.trim() !== ""
                  ? product.image
                  : FALLBACK_IMAGE
              }
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* INFOS PRODUIT */}
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#0F23E8] transition-colors">
              {product.name}
            </h3>
            <p className="text-[12px] text-gray-500 line-clamp-1">
              {product.category || "Produit IA"}
            </p>

            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    fill={i < Math.round(product.rating ?? 0) ? "#facc15" : "none"}
                    stroke="#facc15"
                  />
                ))}
              </div>
              <div className="text-[13px] font-bold text-[#0F23E8]">
                {(product.price ?? 0) === 0 ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <Sparkles size={12} /> Gratuit
                  </span>
                ) : (
                  `${product.price?.toLocaleString()} FCFA`
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </motion.div>
  );
}
