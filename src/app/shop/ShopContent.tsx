'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { trackFilterChange } from '@/lib/analytics/product-engagement';
import { SearchBar } from '@/components/search';
import { PageHero } from '@/components/ui/Section';
import { ProductCard } from '@/components/ui/ProductCard';
import { AnimatedFilterBar } from '@/components/shop/AnimatedFilterBar';
import {
  gridLayoutTransition,
  gridItemVariants,
  FILTER_TIMING,
} from '@/lib/animations/filter-transitions';
import { DiscoveryGrid } from '@/components/shop/DiscoveryGrid';
import type { Product } from '@/lib/supabase/types';
import type { Category } from '@/types';

interface ShopContentProps {
  products: Product[];
  categories: Category[];
}

export default function ShopContent({ products, categories }: ShopContentProps) {
  const searchParams = useSearchParams();
  const urlSearchQuery = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);

  // Prevents tracking on initial URL param load — only track user-initiated changes
  const isInitializedRef = useRef(false);
  useEffect(() => {
    isInitializedRef.current = true;
  }, []);

  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCategoryChange = useCallback((category: string | null) => {
    setSelectedCategory(category);
    if (!isInitializedRef.current || category === null) return;
    // Deferred to next tick so filteredProducts reflects the new filter value
    // We'll track via useEffect on filteredProducts instead
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategory(null);
    setSearchQuery('');
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchQuery.trim().length >= 2) {
      const lowercaseQuery = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowercaseQuery) ||
          p.description.toLowerCase().includes(lowercaseQuery) ||
          p.brand?.toLowerCase().includes(lowercaseQuery)
      );
    }

    return result.filter((product) => {
      if (selectedCategory && product.category !== selectedCategory) return false;
      return true;
    });
  }, [products, searchQuery, selectedCategory]);

  // Track filter changes after state updates — guards against initial URL param load
  useEffect(() => {
    if (!isInitializedRef.current || selectedCategory === null) return;
    trackFilterChange('category', selectedCategory, filteredProducts.length);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  useEffect(() => {
    if (!isInitializedRef.current || searchQuery.trim().length < 2) return;
    trackFilterChange('search', searchQuery, filteredProducts.length);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const hasActiveFilters = selectedCategory || searchQuery.length >= 2;

  return (
    <div className="min-h-screen bg-gold-ambient">
      {/* Hero */}
      <PageHero
        title="Dubai Shop"
        subtitle="Curated luxury fragrances from Dubai's finest houses"
        titleVariant="white"
      />

      {/* Search and Filters */}
      <section className="container-wide pb-8 md:pb-10">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-md mx-auto mb-8"
        >
          <SearchBar
            variant="shop"
            placeholder="Search fragrances..."
            onSearch={handleSearch}
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col items-center gap-[var(--spacing-md)]"
        >
          {/* Category filters */}
          <AnimatedFilterBar
            filters={categories.map((cat) => ({
              id: cat.id,
              label: cat.name.replace("'s Collection", ''),
            }))}
            activeFilter={selectedCategory}
            onFilterChange={handleCategoryChange}
          />

        </motion.div>

        {/* Results count */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-3 mt-6"
          >
            <p className="text-xs text-gray-500">
              {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
              {searchQuery.length >= 2 && <span> for &quot;{searchQuery}&quot;</span>}
            </p>
            <button
              onClick={clearFilters}
              className="text-xs text-gold/70 hover:text-gold transition-colors"
            >
              Clear
            </button>
          </motion.div>
        )}
      </section>

      {/* Products Grid */}
      <section className="container-wide pb-16 md:pb-20">
        {hasActiveFilters ? (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`${selectedCategory}-${searchQuery}`}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ staggerChildren: FILTER_TIMING.stagger, delayChildren: 0.1 }}
              className="card-grid"
            >
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  variants={gridItemVariants}
                  layout
                  transition={gridLayoutTransition}
                >
                  <ProductCard product={product} priority={i < 4} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <DiscoveryGrid products={filteredProducts} priority={4} />
        )}

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="w-16 h-16 mx-auto mb-6 border border-gold/20 bg-gold/5 flex items-center justify-center">
              <svg className="w-6 h-6 text-gold/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="font-playfair text-lg text-gray-400 mb-2">No fragrances found</p>
            <p className="text-gray-400 text-sm mb-6">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="text-[11px] uppercase tracking-[0.12em] text-gold border border-gold/30 px-6 py-3 hover:bg-gold hover:text-black transition-all duration-300"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </section>
    </div>
  );
}
