'use client';

import { useScrollDepthTracking } from '@/lib/animations/scroll-animations';

/**
 * Zero-render client component that tracks scroll depth on every page.
 * Drop into layout.tsx to measure 25/50/75/100% scroll milestones.
 */
export function ScrollDepthTracker() {
  useScrollDepthTracking();
  return null;
}
