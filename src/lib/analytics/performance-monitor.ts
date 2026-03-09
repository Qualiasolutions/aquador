'use client';

/**
 * Performance Monitoring Utilities
 *
 * RAF-based FPS measurement, frame drop detection, and cinematic engagement
 * tracking for the v2.0 Immersive Luxury Experience. Integrates with Vercel
 * Analytics to surface performance regressions without blocking rendering.
 *
 * @module analytics/performance-monitor
 */

import { useRef, useEffect } from 'react';
import { track } from '@vercel/analytics';

// ---------------------------------------------------------------------------
// Device detection (inlined — engagement-tracker.ts may not exist yet)
// ---------------------------------------------------------------------------

/**
 * Classify the current device type for analytics metadata.
 */
function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

// ---------------------------------------------------------------------------
// Thresholds
// ---------------------------------------------------------------------------

/** Frame time that marks a "dropped" frame: >33ms ≈ below 30fps */
const FRAME_DROP_THRESHOLD_MS = 33;

/** Minimum frame drop count before analytics event is fired */
const MIN_DROP_COUNT_TO_TRACK = 10;

/** Maximum FPS average before analytics event is fired */
const POOR_FPS_THRESHOLD = 45;

// ---------------------------------------------------------------------------
// Standalone helpers
// ---------------------------------------------------------------------------

/**
 * Track animation performance issues via Vercel Analytics.
 *
 * Only fires when performance is genuinely degraded — either avgFPS <45 or
 * frameDropCount >10 — to avoid flooding the analytics pipeline.
 *
 * @param componentName - Identifier of the component being measured (e.g. 'animation_budget_global')
 * @param frameDropCount - Number of frames that exceeded the drop threshold during the window
 * @param avgFPS - Average frames-per-second over the measurement window
 */
export function trackAnimationPerformance(
  componentName: string,
  frameDropCount: number,
  avgFPS: number
): void {
  // Guard: only track genuine performance issues
  if (avgFPS >= POOR_FPS_THRESHOLD && frameDropCount <= MIN_DROP_COUNT_TO_TRACK) return;

  try {
    track('animation_performance_issue', {
      component: componentName,
      avg_fps: Math.round(avgFPS),
      frame_drops: frameDropCount,
      device_type: getDeviceType(),
      timestamp: Date.now(),
    });
  } catch {
    // Fail silently — analytics should never break the app
  }
}

/**
 * Track engagement with cinematic UI elements.
 *
 * Call on view (start), interact (user interaction), and complete (end).
 * The duration parameter is only meaningful for the 'complete' action.
 *
 * @param elementType - Which cinematic element is being tracked
 * @param action - Lifecycle stage of the interaction
 * @param duration - Elapsed milliseconds from start to complete (0 for view/interact)
 */
export function trackCinematicEngagement(
  elementType: 'page_transition' | 'parallax_section' | 'filter_animation' | 'category_transition',
  action: 'view' | 'interact' | 'complete',
  duration: number
): void {
  try {
    track('cinematic_engagement', {
      element_type: elementType,
      action,
      duration_ms: Math.round(duration),
      device_type: getDeviceType(),
    });
  } catch {
    // Fail silently
  }
}

/**
 * Measure FPS over an async time window using requestAnimationFrame.
 *
 * @param durationMs - How long to measure in milliseconds (default 1000ms)
 * @returns Promise resolving to average FPS and total frame count
 */
export function measureFPS(durationMs = 1000): Promise<{ avgFPS: number; frameCount: number }> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve({ avgFPS: 60, frameCount: 60 });
      return;
    }

    let frameCount = 0;
    const start = performance.now();
    let rafId: number;

    const tick = () => {
      frameCount++;
      const elapsed = performance.now() - start;
      if (elapsed >= durationMs) {
        const avgFPS = (frameCount / elapsed) * 1000;
        resolve({ avgFPS, frameCount });
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);

    // Safety: resolve after durationMs + 200ms buffer to avoid hanging promise
    setTimeout(() => {
      cancelAnimationFrame(rafId);
      const elapsed = performance.now() - start;
      const avgFPS = elapsed > 0 ? (frameCount / elapsed) * 1000 : 60;
      resolve({ avgFPS, frameCount });
    }, durationMs + 200);
  });
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * usePerformanceMonitor
 *
 * RAF-based FPS and frame-drop monitor. Runs continuously while the component
 * is mounted. On unmount, if significant degradation is detected (>10 frame
 * drops), fires a Vercel Analytics event via trackAnimationPerformance.
 *
 * All refs are declared at hook top-level — none are inside useEffect.
 *
 * @param componentName - Label used in analytics events (e.g. 'animation_budget_global')
 *
 * @example
 * ```tsx
 * export function AnimationBudgetProvider({ children }) {
 *   usePerformanceMonitor('animation_budget_global');
 *   // ...
 * }
 * ```
 */
export function usePerformanceMonitor(componentName: string): void {
  const frameTimesRef = useRef<number[]>([]);
  const rafIdRef = useRef<number | undefined>(undefined);
  const lastFrameTimeRef = useRef<number>(
    typeof performance !== 'undefined' ? performance.now() : 0
  );
  const frameDropCountRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Reset state on mount / component name change
    frameTimesRef.current = [];
    frameDropCountRef.current = 0;
    lastFrameTimeRef.current = performance.now();

    const measureFrame = (currentTime: number) => {
      const frameTime = currentTime - lastFrameTimeRef.current;
      lastFrameTimeRef.current = currentTime;

      if (frameTime > FRAME_DROP_THRESHOLD_MS) {
        frameDropCountRef.current++;
      }

      frameTimesRef.current.push(frameTime);
      // Keep a rolling window of the last 60 frames
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift();
      }

      rafIdRef.current = requestAnimationFrame(measureFrame);
    };

    rafIdRef.current = requestAnimationFrame(measureFrame);

    return () => {
      if (rafIdRef.current !== undefined) {
        cancelAnimationFrame(rafIdRef.current);
      }

      // Track on unmount only if significant performance degradation occurred
      if (frameDropCountRef.current > MIN_DROP_COUNT_TO_TRACK && frameTimesRef.current.length > 0) {
        const sumFrameTimes = frameTimesRef.current.reduce((a, b) => a + b, 0);
        const avgFrameTime = sumFrameTimes / frameTimesRef.current.length;
        const avgFPS = avgFrameTime > 0 ? 1000 / avgFrameTime : 60;
        trackAnimationPerformance(componentName, frameDropCountRef.current, avgFPS);
      }
    };
  }, [componentName]);
}
