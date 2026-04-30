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
    <div className="min-h-screen bg-gold-ambient-subtle">
      {/* Hero - Enhanced */}
      <PageHero
        title="Dubai Shop"
        subtitle="Curated luxury fragrances from Dubai's finest houses"
        titleVariant="white"
      />

      {/* Search and Filters - Premium Edition */}
      <section className="container-wide pb-10 md:pb-14">
        {/* Editorial intro text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold/40 mb-3">
            Explore Our Collection
          </p>
          <div className="flex items-center justify-center gap-4">
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-gold/20" />
            <span className="w-1 h-1 rounded-full bg-gold/30" />
            <span className="w-12 h-px bg-gradient-to-l from-transparent to-gold/20" />
          </div>
        </motion.div>

        {/* Search Bar - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="max-w-lg mx-auto mb-10"
        >
          <SearchBar
            variant="shop"
            placeholder="Search fragrances..."
            onSearch={handleSearch}
          />
        </motion.div>

        {/* Filters - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
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

        {/* Results count - Enhanced */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 mt-8"
          >
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-gold/20" />
            <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'fragrance' : 'fragrances'}
              {searchQuery.length >= 2 && <span className="text-gold/60"> matching &quot;{searchQuery}&quot;</span>}
            </p>
            <button
              onClick={clearFilters}
              className="text-[10px] uppercase tracking-[0.15em] text-gold/50 hover:text-gold transition-colors duration-300"
            >
              Clear
            </button>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-gold/20" />
          </motion.div>
        )}
      </section>

      {/* Products Grid - Enhanced */}
      <section className="container-wide pb-20 md:pb-28">
        {hasActiveFilters ? (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`${selectedCategory}-${searchQuery}`}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ staggerChildren: FILTER_TIMING.stagger, delayChildren: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
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

        {/* Empty State - Premium Edition */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-32"
          >
            {/* Decorative empty state */}
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-radial-gold opacity-20 blur-xl" />
              <div className="relative w-full h-full border border-gold/15 bg-white flex items-center justify-center">
                <svg className="w-10 h-10 text-gold/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <h3 className="font-playfair text-2xl text-black mb-3">No fragrances found</h3>
            <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
              We couldn&apos;t find any fragrances matching your criteria. Try adjusting your search or explore our full collection.
            </p>
            <button
              onClick={clearFilters}
              className="group relative text-[10px] uppercase tracking-[0.15em] text-gold border border-gold/30 px-8 py-4 overflow-hidden transition-all duration-500 hover:text-black"
            >
              <span className="relative z-10">View All Fragrances</span>
              <div className="absolute inset-0 bg-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            </button>
          </motion.div>
        )}
      </section>
    </div>
  );
}
