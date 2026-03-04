'use client';

import { motion, type Variants } from 'framer-motion';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import {
  fadeInUp,
  fadeInDown,
  fadeInScale,
  staggerChildren,
} from '@/lib/animations/scroll-animations';

/**
 * Available animation variants for AnimatedSection
 */
export type AnimationVariant = 'fadeInUp' | 'fadeInDown' | 'fadeInScale' | 'stagger';

/**
 * Props for AnimatedSection component
 */
export interface AnimatedSectionProps {
  /** Content to animate */
  children: ReactNode;
  /** Animation variant to use */
  variant?: AnimationVariant;
  /** Delay before animation starts (in seconds) */
  delay?: number;
  /** Additional CSS classes */
  className?: string;
  /** Stagger delay for children (only used with 'stagger' variant, in seconds) */
  staggerDelay?: number;
  /** Intersection threshold (0-1, how much of element must be visible) */
  threshold?: number;
  /** Completely disable animations on mobile viewports (<768px) */
  disableOnMobile?: boolean;
  /** Custom intersection margin (e.g., "-50px" triggers 50px before viewport) */
  margin?: string;
}

/**
 * Get the appropriate Framer Motion variant for the animation type
 */
function getVariant(
  type: AnimationVariant,
  staggerDelay?: number
): Variants {
  switch (type) {
    case 'fadeInUp':
      return fadeInUp;
    case 'fadeInDown':
      return fadeInDown;
    case 'fadeInScale':
      return fadeInScale;
    case 'stagger':
      // Use staggerChildren with custom delay if provided
      return staggerChildren(0.2, staggerDelay);
    default:
      return fadeInUp;
  }
}

/**
 * Detect if viewport is mobile (<768px)
 */
function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * AnimatedSection - Drop-in wrapper for scroll-triggered section animations
 *
 * Provides smooth scroll-triggered animations that respect user accessibility
 * preferences. Automatically detects prefers-reduced-motion and mobile viewports.
 *
 * Features:
 * - Respects prefers-reduced-motion (instant appearance instead of animation)
 * - Mobile optimization (reduced distance, faster timing)
 * - Optional mobile disable for complex layouts
 * - Configurable intersection threshold and margin
 * - Multiple animation variants (fadeInUp, fadeInDown, fadeInScale, stagger)
 *
 * @example Basic usage
 * ```tsx
 * <AnimatedSection>
 *   <h2>This fades in from below</h2>
 * </AnimatedSection>
 * ```
 *
 * @example With custom variant and delay
 * ```tsx
 * <AnimatedSection variant="fadeInScale" delay={0.3}>
 *   <ProductCard />
 * </AnimatedSection>
 * ```
 *
 * @example Stagger children (for grids)
 * ```tsx
 * <AnimatedSection variant="stagger" staggerDelay={0.1}>
 *   {products.map(product => (
 *     <motion.div
 *       key={product.id}
 *       variants={fadeInUp}
 *     >
 *       <ProductCard product={product} />
 *     </motion.div>
 *   ))}
 * </AnimatedSection>
 * ```
 *
 * @example Disable on mobile for performance
 * ```tsx
 * <AnimatedSection variant="fadeInUp" disableOnMobile>
 *   <ComplexHeroSection />
 * </AnimatedSection>
 * ```
 */
export function AnimatedSection({
  children,
  variant = 'fadeInUp',
  delay = 0,
  className,
  staggerDelay = 0.1,
  threshold = 0.2,
  disableOnMobile = false,
  margin = '-50px',
}: AnimatedSectionProps) {
  // Use scroll animation hook with custom options
  const { ref, shouldAnimate } = useScrollAnimation({
    once: true,
    amount: threshold,
    margin: margin as any, // margin accepts string in Framer Motion
  });

  // Check if we should disable animations on mobile
  const isMobile = isMobileViewport();
  const disableAnimation = disableOnMobile && isMobile;

  // If animations disabled (mobile override or reduced motion), render children instantly
  if (disableAnimation || !shouldAnimate) {
    return (
      <div ref={ref as any} className={cn(className)}>
        {children}
      </div>
    );
  }

  // Get the appropriate animation variant
  const animationVariant = getVariant(variant, staggerDelay);

  // Mobile optimizations: reduce distance and speed up timing
  const mobileOptimizedVariant: Variants = isMobile
    ? {
        initial: animationVariant.initial,
        animate: {
          ...animationVariant.animate,
          transition: {
            ...(animationVariant.animate as any)?.transition,
            duration: 0.4, // Faster on mobile
          },
        },
      }
    : animationVariant;

  // Apply mobile distance reduction for movement-based animations
  if (isMobile && mobileOptimizedVariant.initial) {
    const initial = mobileOptimizedVariant.initial as Record<string, unknown>;

    // Reduce y-axis movement by 50% on mobile
    if (typeof initial.y === 'number') {
      initial.y = initial.y * 0.5;
    }

    // Reduce x-axis movement by 50% on mobile
    if (typeof initial.x === 'number') {
      initial.x = initial.x * 0.5;
    }
  }

  // Render animated section
  return (
    <motion.div
      ref={ref as any}
      className={cn(className)}
      initial="initial"
      animate={shouldAnimate ? 'animate' : 'initial'}
      variants={mobileOptimizedVariant}
      transition={{
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * AnimatedSectionItem - Use inside AnimatedSection with variant="stagger"
 *
 * This is a convenience wrapper for individual items in a staggered grid.
 * It uses the parent's stagger timing automatically.
 *
 * @example
 * ```tsx
 * <AnimatedSection variant="stagger">
 *   {items.map(item => (
 *     <AnimatedSectionItem key={item.id}>
 *       <Card>{item.name}</Card>
 *     </AnimatedSectionItem>
 *   ))}
 * </AnimatedSection>
 * ```
 */
export function AnimatedSectionItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={cn(className)}
      variants={fadeInUp}
    >
      {children}
    </motion.div>
  );
}
