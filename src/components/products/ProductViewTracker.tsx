'use client';

import { useProductViewTracking } from '@/lib/analytics/product-engagement';

interface ProductViewTrackerProps {
  productSlug: string;
  productName: string;
}

/**
 * Zero-render client component that tracks time spent on a product page.
 *
 * Renders null — exists purely for the side effect of calling useProductViewTracking.
 * This pattern allows Server Component pages to include client-side analytics
 * without converting the entire page to 'use client'.
 *
 * The hook fires a 'product_view_time' event on unmount (navigation away)
 * only if the user spent more than 3 seconds on the page.
 */
export function ProductViewTracker({ productSlug, productName }: ProductViewTrackerProps) {
  useProductViewTracking(productSlug, productName);
  return null;
}
