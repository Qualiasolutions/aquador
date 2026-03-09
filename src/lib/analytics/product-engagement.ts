import { useEffect } from 'react';
import { track } from '@vercel/analytics';

/**
 * Returns the current device type based on viewport width.
 * Mirrors the implementation in engagement-tracker.ts (plan 16-01).
 * Falls back to 'desktop' in SSR environments where window is unavailable.
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * React hook that tracks time spent on a product page.
 * Fires a 'product_view_time' analytics event on unmount
 * only if the user spent more than 3 seconds (meaningful engagement).
 *
 * Must be called inside a 'use client' component.
 *
 * @param productSlug - URL slug for the product
 * @param productName - Human-readable product name for reports
 */
export function useProductViewTracking(productSlug: string, productName: string): void {
  useEffect(() => {
    const entryTime = Date.now();

    return () => {
      const duration = Math.round((Date.now() - entryTime) / 1000);

      // Only track meaningful engagement (>3 seconds), ignoring bounces
      if (duration <= 3) return;

      try {
        track('product_view_time', {
          productSlug,
          productName,
          duration,
          deviceType: getDeviceType(),
        });
      } catch {
        // Fail silently if analytics unavailable
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productSlug, productName]);
}

/**
 * Tracks a filter interaction in the shop discovery flow.
 * Call this when a user actively changes a filter — NOT on initial URL param load.
 * Enables funnel analysis: which filter combinations lead to purchases.
 *
 * @param filterType - 'category' | 'type' | 'search'
 * @param value - The selected filter value (e.g., 'women', 'perfume', search term)
 * @param resultCount - Number of products visible after filter applied
 */
export function trackFilterChange(
  filterType: 'category' | 'type' | 'search',
  value: string,
  resultCount: number
): void {
  try {
    track('filter_change', {
      filterType,
      value,
      resultCount,
      deviceType: getDeviceType(),
    });
  } catch {
    // Fail silently if analytics unavailable
  }
}

/**
 * Tracks a user navigating between product categories.
 * Maps discovery flow patterns for UX analysis.
 *
 * @param fromCategory - Previous category slug, or 'shop' for the main shop page
 * @param toCategory - Destination category slug
 * @param method - How the user navigated: 'click' | 'filter' | 'direct'
 */
export function trackCategoryTransition(
  fromCategory: string,
  toCategory: string,
  method: 'click' | 'filter' | 'direct'
): void {
  try {
    track('category_transition', {
      fromCategory,
      toCategory,
      method,
      deviceType: getDeviceType(),
    });
  } catch {
    // Fail silently if analytics unavailable
  }
}

/**
 * Tracks a quick view interaction (modal/overlay product preview).
 * Distinguishes casual browsing behavior from deep product engagement.
 *
 * @param productSlug - Product identifier
 * @param productName - Human-readable name for reports
 * @param duration - Milliseconds the quick view was open
 */
export function trackQuickView(
  productSlug: string,
  productName: string,
  duration: number
): void {
  try {
    track('quick_view', {
      productSlug,
      productName,
      duration,
      deviceType: getDeviceType(),
    });
  } catch {
    // Fail silently if analytics unavailable
  }
}
