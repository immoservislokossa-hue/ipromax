"use client"

import React, { useState } from 'react';

interface ProductDescriptionProps {
  description: string;
  maxLength?: number;
  showTooltip?: boolean;
  className?: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  description,
  maxLength = 80,
  showTooltip = true,
  className = ''
}) => {
  const [showTooltipState, setShowTooltipState] = useState(false);

  const isLongDescription = description.length > maxLength;
  const truncatedDescription = isLongDescription
    ? description.slice(0, maxLength).trim() + '...'
    : description;

  return (
    <div className={`relative ${className}`}>
      <p
        className={`
          text-sm text-gray-600 leading-relaxed line-clamp-2
          ${isLongDescription && showTooltip ? 'cursor-help' : ''}
        `}
        onMouseEnter={() => isLongDescription && showTooltip && setShowTooltipState(true)}
        onMouseLeave={() => setShowTooltipState(false)}
        title={isLongDescription ? description : undefined}
      >
        {truncatedDescription}
      </p>

      {/* Tooltip with full description */}
      {showTooltipState && isLongDescription && showTooltip && (
        <div className="absolute z-50 bottom-full left-0 right-0 mb-2 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="relative">
            {description}
            {/* Tooltip Arrow */}
            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}

      {/* Read More Indicator */}
      {isLongDescription && (
        <div className="flex items-center mt-1">
          <span className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
            Voir plus
          </span>
          <svg className="w-3 h-3 ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default ProductDescription;