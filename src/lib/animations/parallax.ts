/**
 * Parallax animation configurations and utilities
 *
 * Performance-optimized parallax scrolling with mobile detection
 * and reduced motion support.
 *
 * Mobile strategy: Parallax disabled on viewports < 768px to prevent
 * Safari jank and improve battery performance.
 */

// Easing from scroll-animations.ts
const EXPO_EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Parallax speed multipliers
 *
 * - slow: 0.3 - Gentle background movement
 * - base: 0.5 - Default parallax speed
 * - fast: 0.8 - Dramatic foreground movement
 */
export const PARALLAX_CONFIG = {
  slow: 0.3,
  base: 0.5,
  fast: 0.8,
  easing: EXPO_EASE,
} as const;

/**
 * Preset parallax transform ranges
 *
 * Defines input/output ranges for different parallax intensities.
 * All ranges use viewport-based scroll positions.
 */
export const parallaxVariants = {
  subtle: {
    inputRange: [0, 1000],
    outputRange: [0, -30],
  },
  medium: {
    inputRange: [0, 1000],
    outputRange: [0, -80],
  },
  dramatic: {
    inputRange: [0, 1000],
    outputRange: [0, -150],
  },
} as const;

/**
 * Create a parallax transform function
 *
 * Maps scroll position to transform value with optional clamping.
 * Use this with Framer Motion's useTransform() hook.
 *
 * @param scrollY - MotionValue from useScroll()
 * @param inputRange - Scroll positions [start, end]
 * @param outputRange - Transform values [start, end]
 * @param clamp - Whether to clamp values outside range (default: true)
 *
 * @example
 * ```tsx
 * const { scrollY } = useScroll();
 * const y = useTransform(
 *   scrollY,
 *   createParallaxTransform([0, 1000], [0, -100])
 * );
 * ```
 */
export function createParallaxTransform(
  inputRange: [number, number],
  outputRange: [number, number],
  clamp: boolean = true
) {
  return {
    inputRange,
    outputRange,
    clamp,
  };
}

/**
 * Mobile-disabled pattern helper
 *
 * Returns true if parallax should be disabled based on viewport width.
 * Mobile threshold: 768px (md breakpoint in Tailwind)
 *
 * @returns {boolean} true if mobile viewport detected
 */
export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Get parallax speed based on viewport
 *
 * Returns zero speed on mobile to disable parallax effects.
 * This prevents jank on mobile Safari and improves performance.
 *
 * @param speed - Desired speed multiplier
 * @param disableOnMobile - Whether to disable on mobile (default: true)
 * @returns Effective speed (0 on mobile if disabled)
 */
export function getEffectiveSpeed(
  speed: number,
  disableOnMobile: boolean = true
): number {
  if (disableOnMobile && isMobileViewport()) {
    return 0;
  }
  return speed;
}
