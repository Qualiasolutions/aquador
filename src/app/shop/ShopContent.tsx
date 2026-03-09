'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { trackFilterChange } from '@/lib/analytics/product-engagement';
import { SearchBar } from '@/components/search';
import { PageHero } from '@/components/ui/Section';
import { ProductCard } from '@/components/ui/ProductCard';
import { AnimatedFilterBar, AnimatedTypeFilter } from '@/components/shop/AnimatedFilterBar';
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
  const [selectedType, setSelectedType] = useState<string | null>(null);
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

  const handleTypeChange = useCallback((type: string | null) => {
    setSelectedType(type);
    if (!isInitializedRef.current || type === null) return;
    // Tracked via useEffect on filteredProducts after state update
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategory(null);
    setSelectedType(null);
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
      if (selectedType && product.product_type !== selectedType) return false;
      return true;
    });
  }, [products, searchQuery, selectedCategory, selectedType]);

  // Track filter changes after state updates — guards against initial URL param load
  useEffect(() => {
    if (!isInitializedRef.current || selectedCategory === null) return;
    trackFilterChange('category', selectedCategory, filteredProducts.length);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  useEffect(() => {
    if (!isInitializedRef.current || selectedType === null) return;
    trackFilterChange('type', selectedType, filteredProducts.length);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType]);

  useEffect(() => {
    if (!isInitializedRef.current || searchQuery.trim().length < 2) return;
    trackFilterChange('search', searchQuery, filteredProducts.length);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const hasActiveFilters = selectedCategory || selectedType || searchQuery.length >= 2;

  return (
    <div className="min-h-screen bg-gold-ambient">
      {/* Hero */}
      <PageHero
        title="Our Collections"
        subtitle="Discover our curated selection of premium fragrances"
        titleVariant="white"
      />

      {/* Search and Filters */}
      <section className="container-wide pb-10">
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

          {/* Type filters */}
          <AnimatedTypeFilter
            types={[
              { id: null, label: 'All Types' },
              { id: 'perfume', label: 'Perfume' },
              { id: 'essence-oil', label: 'Essence Oil' },
              { id: 'body-lotion', label: 'Body Lotion' },
            ]}
            activeType={selectedType}
            onTypeChange={handleTypeChange}
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
      <section className="container-wide pb-20">
        {hasActiveFilters ? (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`${selectedCategory}-${selectedType}-${searchQuery}`}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-500 text-sm mb-4">
              No products found.
            </p>
            <button
              onClick={clearFilters}
              className="text-gold text-sm hover:text-gold/80 transition-colors"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </section>
    </div>
  );
}
