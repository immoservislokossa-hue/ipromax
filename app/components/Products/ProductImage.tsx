import React, { useState } from 'react';
import { ProductBadge } from './ProductBadge';

interface ProductImageProps {
  src: string;
  alt: string;
  isNew?: boolean;
  isOnSale?: boolean;
  inStock: boolean;
  className?: string;
  onImageError?: (error: string) => void;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  isNew,
  isOnSale,
  inStock,
  className = '',
  onImageError
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // ✅ Une seule image de secours par défaut
  const fallbackImage =
    "https://images.pexels.com/photos/34123134/pexels-photo-34123134.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1";

  // Vérifie si une URL est valide
  const isValidImageUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleImageLoad = () => setIsLoading(false);
  const handleImageError = () => {
    console.warn(`Erreur de chargement de l'image: ${src}`);
    setIsLoading(false);
    setHasError(true);
    onImageError?.(src);
  };

  return (
    <div className={`relative w-full h-full group ${className}`}>
      {/* Squelette de chargement */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}

      {/* Image principale ou fallback */}
      {!hasError ? (
        <img
          src={isValidImageUrl(src) ? src : fallbackImage}
          alt={alt}
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`
            w-full h-full object-cover transition-all duration-500
            ${isLoading ? 'opacity-0' : 'opacity-100'}
            ${!inStock ? 'grayscale opacity-60' : ''}
            group-hover:scale-105 group-hover:rotate-1
          `}
        />
      ) : (
        <div className="relative w-full h-full">
          <img
            src={fallbackImage}
            alt={`Image de remplacement pour ${alt}`}
            className={`
              w-full h-full object-cover rounded-lg
              ${!inStock ? 'grayscale opacity-60' : ''}
              transition-all duration-500
            `}
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
            <div className="text-center text-white bg-black/40 p-4 rounded-lg backdrop-blur-sm">
              <svg
                className="w-12 h-12 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm font-medium">Image indisponible</p>
              <p className="text-xs mt-1 opacity-80">Veuillez réessayer ultérieurement</p>
            </div>
          </div>
        </div>
      )}

      {/* Badges */}
      <div className="absolute top-3 left-3 space-y-2">
        {isNew && <ProductBadge type="new" />}
        {isOnSale && <ProductBadge type="sale" />}
        {!inStock && <ProductBadge type="outOfStock" />}
      </div>

      {/* Bouton de wishlist */}
      <button
        className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Ajouter à la liste de souhaits"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {/* Effet de survol */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};
