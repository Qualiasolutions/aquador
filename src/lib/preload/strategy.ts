/**
 * Intelligent preloading strategies for luxury e-commerce navigation
 *
 * Uses <link rel="prefetch"> to preload likely next pages before the user navigates.
 *
 * Strategies:
 * - Hover: Preload product page when user hovers product card (300ms debounce)
 * - Scroll: Preload next category page when user scrolls to bottom 30% of current category
 */

import React from 'react';

let prefetchTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Preload a product page on hover with debounce.
 * Call from onMouseEnter on product cards.
 * Returns a cancel function — call it from onMouseLeave.
 *
 * @param slug - Product slug (matches /products/[slug] route)
 * @param delayMs - Debounce delay before prefetch fires (default 300ms)
 */
export function preloadProduct(slug: string, delayMs = 300): () => void {
  if (prefetchTimeout) clearTimeout(prefetchTimeout);

  prefetchTimeout = setTimeout(() => {
    if (typeof window === 'undefined') return;

    const url = `/products/${slug}`;
    const existing = document.querySelector(`link[rel="prefetch"][href="${url}"]`);
    if (existing) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'document';
    document.head.appendChild(link);
  }, delayMs);

  return () => {
    if (prefetchTimeout) {
      clearTimeout(prefetchTimeout);
      prefetchTimeout = null;
    }
  };
}

/**
 * Preload a category page.
 * Call when user is likely to navigate to a category.
 *
 * @param categorySlug - Category slug (matches /shop/[category] route)
 */
export function preloadCategoryPage(categorySlug: string): void {
  if (typeof window === 'undefined') return;

  const url = `/shop/${categorySlug}`;
  const existing = document.querySelector(`link[rel="prefetch"][href="${url}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  link.as = 'document';
  document.head.appendChild(link);
}

/**
 * Set up scroll-based category preloading via IntersectionObserver.
 * Attach a sentinel element near the bottom of the page.
 *
 * @param sentinelRef - Ref to a DOM element near the bottom of the page
 * @param nextCategorySlug - Category to preload when sentinel becomes visible
 * @returns Cleanup function to disconnect the observer
 */
export function setupScrollPreload(
  sentinelRef: React.RefObject<HTMLElement | null>,
  nextCategorySlug: string
): () => void {
  if (typeof window === 'undefined' || !sentinelRef.current) return () => {};

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        preloadCategoryPage(nextCategorySlug);
        observer.disconnect();
      }
    },
    { threshold: 0.3 }
  );

  observer.observe(sentinelRef.current);
  return () => observer.disconnect();
}
