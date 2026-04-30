'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/currency';
import ProductVariantSelector, {
  getDefaultVariant,
  type SelectedVariant,
} from './ProductVariantSelector';
import AddToCartButton from './AddToCartButton';
import RichDescription from './RichDescription';
import type { LegacyProduct } from '@/types';

// Aquador's own fragrances support perfume / essence oil / body lotion variants
const AQUADOR_CATEGORIES = ['women', 'men', 'niche'];

const productTypeLabel = (type: string) => {
  if (type === 'essence-oil') return 'Essence Oil';
  if (type === 'body-lotion') return 'Body Lotion';
  return 'Perfume';
};

interface ProductDetailsProps {
  product: LegacyProduct;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const isAquador = AQUADOR_CATEGORIES.includes(product.category);
  const [variant, setVariant] = useState<SelectedVariant>(getDefaultVariant);

  // Aquador products: use selected variant price/type/size
  // Branded products: use exact DB price/type/size
  const displayProduct: LegacyProduct = isAquador
    ? { ...product, price: variant.price, salePrice: undefined, productType: variant.type, size: variant.size }
    : product;

  const displayPrice = isAquador
    ? variant.price
    : (product.salePrice && product.salePrice < product.price ? product.salePrice : product.price);

  return (
    <motion.div 
      className="flex flex-col gap-7"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Brand with decorative line */}
      {product.brand && (
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <span className="text-[9px] text-gold/50 uppercase tracking-[0.3em] font-light">
            {product.brand}
          </span>
          <span className="flex-1 h-px bg-gradient-to-r from-gold/20 to-transparent" />
        </motion.div>
      )}

      {/* Name - Enhanced */}
      <motion.h1 
        className="text-[clamp(2rem,1.5rem+2.5vw,3.25rem)] font-playfair font-normal text-black tracking-wide leading-[1.05]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
      >
        {product.name}
      </motion.h1>

      {/* Price - Enhanced */}
      <motion.div 
        className="flex items-baseline gap-4 transition-all duration-300"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <span className="text-[clamp(1.875rem,1.5rem+1.5vw,2.75rem)] font-playfair font-normal text-gold">
          {formatPrice(displayPrice)}
        </span>
        {isAquador ? (
          <span className="text-sm text-gray-400 tracking-wide">{variant.label} · {variant.size}</span>
        ) : (
          <span className="text-sm text-gray-400 tracking-wide">
            {productTypeLabel(product.productType)} · {product.size}
            {product.salePrice && product.salePrice < product.price && (
              <span className="ml-3 line-through text-gray-300">{formatPrice(product.price)}</span>
            )}
          </span>
        )}
      </motion.div>

      {/* Variant selector — Aquador products only */}
      {isAquador && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <ProductVariantSelector selected={variant} onChange={setVariant} />
        </motion.div>
      )}

      {/* Stock indicator - Enhanced */}
      <motion.div 
        className="flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <span className={`inline-flex items-center gap-2 px-4 py-1.5 text-[10px] uppercase tracking-[0.15em] ${
          product.inStock
            ? 'bg-emerald-50/80 text-emerald-600 border border-emerald-100'
            : 'bg-amber-50/80 text-amber-600 border border-amber-100'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-amber-400'}`} />
          {product.inStock ? 'In Stock' : 'Coming Soon'}
        </span>
      </motion.div>

      {/* Add to Cart - Animated */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
      >
        <AddToCartButton product={displayProduct} />
      </motion.div>

      {/* Premium info row - Enhanced */}
      <motion.div 
        className="flex flex-wrap gap-5 pt-5 border-t border-gold/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex items-center gap-2.5 text-[11px] text-gray-500 tracking-wide">
          <div className="w-8 h-8 rounded-full bg-gold/5 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          Free shipping over €35
        </div>
        <div className="flex items-center gap-2.5 text-[11px] text-gray-500 tracking-wide">
          <div className="w-8 h-8 rounded-full bg-gold/5 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          Secure checkout
        </div>
        <div className="flex items-center gap-2.5 text-[11px] text-gray-500 tracking-wide">
          <div className="w-8 h-8 rounded-full bg-gold/5 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          1-2 day delivery
        </div>
      </motion.div>

      {/* Description — below the fold - Enhanced */}
      <motion.div 
        className="pt-8 border-t border-gold/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-5">
          <h3 className="text-[9px] text-gold/50 uppercase tracking-[0.25em]">
            About this fragrance
          </h3>
          <span className="flex-1 h-px bg-gradient-to-r from-gold/15 to-transparent" />
        </div>
        <RichDescription description={product.description} />
      </motion.div>

      {/* Tags - Enhanced */}
      {product.tags && product.tags.length > 0 && (
        <motion.div 
          className="pt-6 border-t border-gold/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="flex flex-wrap gap-2.5">
            {product.tags.map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 + index * 0.05, duration: 0.3 }}
                className="px-4 py-2 text-[9px] uppercase tracking-[0.15em] text-gold/60 bg-gold/[0.03] border border-gold/10 hover:border-gold/25 hover:text-gold/80 transition-all duration-300"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
