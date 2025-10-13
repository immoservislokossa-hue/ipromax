"use client";

import React from "react";
import { motion } from "framer-motion";

interface ProductPriceProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ProductPrice: React.FC<ProductPriceProps> = ({
  price,
  originalPrice,
  currency = "FCFA",
  size = "md",
  className = "",
}) => {
  const isOnSale = !!originalPrice && originalPrice > price;
  const discountPercentage = isOnSale
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl md:text-2xl",
  };

  const formatPrice = (value: number): string =>
    new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col gap-1 ${className}`}
    >
      {/* Ligne principale : prix actuel + réduction */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* 💰 Prix actuel */}
        <span
          className={`${sizeClasses[size]} font-bold ${
            isOnSale ? "text-blue-700" : "text-blue-800"
          }`}
        >
          {price === 0 ? (
            <span className="text-green-600 font-semibold flex items-center gap-1">
              🎁 Gratuit
            </span>
          ) : (
            <>
              {formatPrice(price)}{" "}
              <span className="font-medium text-gray-500 text-sm">{currency}</span>
            </>
          )}
        </span>

        {/* 🔻 Pourcentage de réduction */}
        {isOnSale && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm"
          >
            -{discountPercentage}%
          </motion.span>
        )}
      </div>

      {/* 💸 Ancien prix barré */}
      {isOnSale && (
        <div className="flex items-center gap-2 text-gray-400 line-through text-xs font-medium">
          {formatPrice(originalPrice!)} {currency}
        </div>
      )}
    </motion.div>
  );
};
