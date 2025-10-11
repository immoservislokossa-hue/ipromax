"use client"

import React from 'react'

interface ProductBadgeProps {
  type: 'new' | 'sale' | 'outOfStock' | 'bestseller' | 'limited' | 'eco'
  text?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const ProductBadge: React.FC<ProductBadgeProps> = ({
  type,
  text,
  size = 'sm',
  className = ''
}) => {
  // Configuration des tailles
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }

  // Configuration des icônes SVG
  const icons = {
    outOfStock: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    new: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    ),
    sale: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    ),
    bestseller: (
      <path fill="currentColor" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    ),
    limited: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    ),
    eco: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    )
  }

  // Configuration des badges
  const badgeConfigs = {
    outOfStock: {
      text: 'Épuisé',
      className: 'bg-gray-500 text-white',
      icon: icons.outOfStock,
      fill: 'none'
    },
    new: {
      text: 'Nouveau',
      className: 'bg-blue-500 text-white',
      icon: icons.new,
      fill: 'none'
    },
    sale: {
      text: 'Promo',
      className: 'bg-red-500 text-white',
      icon: icons.sale,
      fill: 'none'
    },
    bestseller: {
      text: 'Best-seller',
      className: 'bg-yellow-500 text-white',
      icon: icons.bestseller,
      fill: 'currentColor'
    },
    limited: {
      text: 'Édition limitée',
      className: 'bg-purple-500 text-white',
      icon: icons.limited,
      fill: 'none'
    },
    eco: {
      text: 'Éco-responsable',
      className: 'bg-green-500 text-white',
      icon: icons.eco,
      fill: 'none'
    }
  }

  const config = badgeConfigs[type] || {
    text: 'Badge',
    className: 'bg-gray-500 text-white',
    icon: null,
    fill: 'none'
  }

  return (
    <div
      className={`
        inline-flex items-center gap-1 font-semibold rounded-full
        ${sizeClasses[size]}
        ${config.className}
        ${className}
        shadow-sm backdrop-blur-sm
        animate-pulse hover:animate-none
        transition-all duration-300
      `}
    >
      {config.icon && (
        <svg 
          className="w-3 h-3" 
          fill={config.fill} 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {config.icon}
        </svg>
      )}
      <span>{text || config.text}</span>
    </div>
  )
}