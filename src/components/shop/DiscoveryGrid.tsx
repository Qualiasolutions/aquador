/**
 * DiscoveryGrid Component
 *
 * Enhanced product grid with progressive disclosure and immersive browsing.
 * Products appear in rows with staggered animation as user scrolls.
 *
 * Performance Strategy:
 * - First 2 rows (8 products) visible immediately
 * - Additional rows load progressively as user approaches viewport
 * - IntersectionObserver with 200px threshold for smooth reveals
 * - Each group of 4 products treated as one "row" for animation
 *
 * Design: Matches existing grid layout, adds entrance animations
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from '@/components/ui/ProductCard';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animations/discovery-animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { Product } from '@/lib/supabase/types';

export interface DiscoveryGridProps {
  products: Product[];
  /** Number of cards to load with priority (default: 4) */
  priority?: number;
  className?: string;
}

/**
 * Group products into rows of 4 for progressive reveal
 */
function groupIntoRows(products: Product[], rowSize: number = 4): Product[][] {
  const rows: Product[][] = [];
  for (let i = 0; i < products.length; i += rowSize) {
    rows.push(products.slice(i, i + rowSize));
  }
  return rows;
}

/**
 * DiscoveryGrid
 *
 * Progressive disclosure grid that reveals product rows on scroll.
 * First 2 rows visible immediately, additional rows fade in as user scrolls.
 */
export function DiscoveryGrid({ products, priority = 4, className = '' }: DiscoveryGridProps) {
  const reducedMotion = useReducedMotion();
  const [visibleRows, setVisibleRows] = useState(2); // Start with 2 rows visible (8 products)
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Group products into rows of 4
  const rows = groupIntoRows(products, 4);

  // Set up IntersectionObserver to reveal more rows as user scrolls
  useEffect(() => {
    if (reducedMotion || visibleRows >= rows.length) {
      // If reduced motion or all rows visible, show everything
      if (visibleRows < rows.length) {
        setVisibleRows(rows.length);
      }
      return;
    }

    // Create observer that triggers when sentinel enters viewport (with 200px threshold)
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && visibleRows < rows.length) {
            // Reveal next row
            setVisibleRows((prev) => Math.min(prev + 1, rows.length));
          }
        });
      },
      {
        rootMargin: '200px', // Start loading 200px before sentinel enters viewport
        threshold: 0,
      }
    );

    // Observe the sentinel element
    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [visibleRows, rows.length, reducedMotion]);

  // Animation variants (disabled if reduced motion)
  const containerVariants = reducedMotion ? {} : staggerContainerVariants;
  const itemVariants = reducedMotion ? {} : staggerItemVariants;

  return (
    <div className={className}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {rows.slice(0, visibleRows).map((row, rowIndex) => (
          <motion.div
            key={`row-${rowIndex}`}
            variants={containerVariants}
            initial={rowIndex >= 2 ? 'hidden' : 'visible'} // First 2 rows start visible
            animate="visible"
            className="col-span-2 md:col-span-3 lg:col-span-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5"
          >
            {row.map((product, productIndex) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard
                  product={product}
                  priority={rowIndex === 0 && productIndex < priority}
                />
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Sentinel element for IntersectionObserver */}
      {visibleRows < rows.length && (
        <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" />
      )}
    </div>
  );
}
