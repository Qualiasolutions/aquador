/**
 * ProductCard Component
 * Reusable luxury product card for consistent presentation across the site
 * Handles both LegacyProduct (camelCase) and Supabase Product (snake_case) formats
 */

'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/currency';
import { ProductImage } from './ProductImage';
import { ProductQuickView } from '@/components/shop/ProductQuickView';
import { hoverVariants, tapVariants } from '@/lib/animations/micro-interactions';
import { imageZoomVariants } from '@/lib/animations/discovery-animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { preloadProduct } from '@/lib/preload/strategy';
import type { LegacyProduct } from '@/types';
import type { Product } from '@/lib/supabase/types';

interface ProductCardProps {
  product: LegacyProduct | Product;
  priority?: boolean;
  variant?: 'default' | 'compact';
}

export function ProductCard({ product, priority = false, variant = 'default' }: ProductCardProps) {
  const reducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [isTapRevealed, setIsTapRevealed] = useState(false);
  const cancelPreloadRef = useRef<(() => void) | null>(null);

  // Normalize property names to handle both LegacyProduct (camelCase) and Supabase Product (snake_case)
  const inStock = 'in_stock' in product ? product.in_stock : product.inStock;
  const salePrice = 'sale_price' in product ? product.sale_price : product.salePrice;

  // Determine if product is on sale (has sale price and is in stock)
  const isOnSale = !!salePrice && !!inStock;

  // Calculate final price to display
  const displayPrice = salePrice || product.price;

  // Variant-specific styles
  const isCompact = variant === 'compact';
  const padding = isCompact ? 'p-3 md:p-4' : 'p-4 md:p-5';
  const brandSize = isCompact ? 'text-[0.5625rem]' : 'text-[clamp(0.625rem,0.5625rem+0.3125vw,0.75rem)]';
  const nameSize = isCompact ? 'text-[0.875rem] md:text-[1rem]' : 'text-[clamp(1rem,0.875rem+0.625vw,1.25rem)]';
  const priceSize = isCompact ? 'text-[1rem] md:text-[1.125rem]' : 'text-[clamp(1.125rem,1rem+0.625vw,1.5rem)]';

  // Animation variants based on reduced motion preference
  const cardHover = reducedMotion ? { scale: 1.01 } : hoverVariants.lift;
  const cardTap = reducedMotion ? { scale: 0.98 } : tapVariants.shrink;

  return (
    <motion.div
      whileHover={cardHover}
      whileTap={cardTap}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`relative ${!inStock ? 'opacity-75' : ''}`}
    >
      {/* Premium glow effect on hover */}
      <motion.div
        className="absolute -inset-px rounded-sm pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, transparent 50%, rgba(212,175,55,0.05) 100%)',
          boxShadow: 'var(--shadow-gold-subtle)',
        }}
      />
      <Link
        href={`/products/${product.id}`}
        className={`group relative block bg-white border border-black/[0.05] hover:border-gold/25 ${padding} transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2`}
        aria-label={`View ${product.name}`}
        onMouseEnter={() => {
          setIsHovered(true);
          cancelPreloadRef.current = preloadProduct(String(product.id));
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsTapRevealed(false);
          cancelPreloadRef.current?.();
          cancelPreloadRef.current = null;
        }}
        onClick={(e) => {
          // Mobile tap-to-reveal pattern: first tap shows overlay, second tap navigates
          // Only apply on touch devices (check if we have touch capability)
          if (window.matchMedia('(pointer: coarse)').matches) {
            if (!isTapRevealed) {
              e.preventDefault();
              setIsTapRevealed(true);
              setIsHovered(true);
            }
            // Second tap: allow default navigation
          }
        }}
      >
      {/* Product Image */}
      <div className="relative mb-4 md:mb-5 overflow-hidden aspect-[4/5]">
        <motion.div
          variants={reducedMotion ? {} : imageZoomVariants}
          initial="rest"
          animate={isHovered ? 'hover' : 'rest'}
          className="h-full"
        >
          <ProductImage
            src={product.image}
            alt={product.name}
            variant="card"
            priority={priority}
            className="w-full h-full object-cover transition-all duration-700"
          />
        </motion.div>

        {/* ProductQuickView Overlay - only show for Supabase Product type */}
        {'tags' in product && (
          <ProductQuickView
            product={product as Product}
            isVisible={isHovered}
            onClose={() => {
              setIsHovered(false);
              setIsTapRevealed(false);
            }}
          />
        )}

        {/* Multi-layer hover overlay for depth */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />
        </motion.div>

        {/* Decorative corner accent on hover */}
        <motion.div
          className="absolute top-0 left-0 w-12 h-12 pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute top-3 left-0 w-6 h-px bg-gradient-to-r from-gold/60 to-transparent" />
          <div className="absolute top-0 left-3 w-px h-6 bg-gradient-to-b from-gold/60 to-transparent" />
        </motion.div>

        {/* Sale Badge - Enhanced */}
        {isOnSale && (
          <motion.div 
            className="absolute top-3 right-3 bg-black text-gold text-[8px] uppercase tracking-[0.18em] px-3 py-1.5 font-medium"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
          >
            Sale
          </motion.div>
        )}

        {/* Out of Stock Overlay - Enhanced */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[3px] flex items-center justify-center">
            <div className="bg-white/95 backdrop-blur-sm border border-gold/20 text-black text-[9px] uppercase tracking-[0.2em] px-5 py-2.5 font-medium">
              Coming Soon
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2.5 min-h-[7rem]">
        {/* Brand with decorative line */}
        <div className="flex items-center gap-2">
          <span className={`${brandSize} tracking-[0.18em] uppercase text-gold/50 font-medium ${!product.brand ? 'invisible' : ''}`}>
            {product.brand || '\u00A0'}
          </span>
          <motion.span 
            className="flex-1 h-px bg-gradient-to-r from-gold/20 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'left' }}
          />
        </div>

        {/* Product Name */}
        <h3 className={`${nameSize} font-playfair font-medium tracking-tight text-black line-clamp-2 group-hover:text-gold/90 transition-colors duration-500`}>
          {product.name}
        </h3>

        {/* Price with enhanced styling */}
        <div className="flex items-baseline gap-2.5 pt-1">
          <span className={`${priceSize} font-playfair font-medium text-gold`}>
            {formatPrice(displayPrice)}
          </span>
          {isOnSale && (
            <span className="text-sm text-gray-400 line-through decoration-gray-300">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Size with subtle styling */}
        {product.size && (
          <p className="text-[9px] text-gray-400/80 uppercase tracking-[0.15em]">
            {product.size}
          </p>
        )}
      </div>

      {/* Gold underline reveal on hover - Enhanced */}
      <div className="mt-4 h-[1.5px] bg-gold/10 relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-gold/60 via-gold to-gold/60"
          initial={{ x: '-100%' }}
          animate={{ x: isHovered ? '0%' : '-100%' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      </Link>
    </motion.div>
  );
}
