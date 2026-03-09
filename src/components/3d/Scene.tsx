'use client';

import { Suspense, useState, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerformanceMonitor } from '@react-three/drei';
import { CAMERA_CONFIG, ORBIT_CONFIG } from '@/lib/three/config';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';
import { track3DInteraction } from '@/lib/analytics/engagement-tracker';

type SceneProps = {
  children: React.ReactNode;
  className?: string;
  /** Product name passed to analytics events */
  productName?: string;
};

export function Scene({
  children,
  className = 'w-full h-[600px]',
  productName,
}: SceneProps) {
  const capabilities = useDeviceCapabilities();
  const [dpr, setDpr] = useState(capabilities.recommendedDPR);
  const rotateStartTimeRef = useRef<number | null>(null);

  const handleRotateStart = useCallback(() => {
    rotateStartTimeRef.current = performance.now();
    track3DInteraction('rotate_start', { productName });
  }, [productName]);

  const handleRotateEnd = useCallback(() => {
    const durationMs =
      rotateStartTimeRef.current !== null
        ? performance.now() - rotateStartTimeRef.current
        : undefined;
    rotateStartTimeRef.current = null;
    track3DInteraction('rotate_end', { productName, durationMs });
  }, [productName]);

  return (
    <div className={className}>
      <Canvas
        camera={CAMERA_CONFIG}
        gl={{ preserveDrawingBuffer: true }}
        dpr={dpr}
      >
        <PerformanceMonitor
          onIncline={() => setDpr(prev => Math.min(prev + 0.5, 2))}
          onDecline={() => setDpr(prev => Math.max(prev - 0.5, 1))}
        >
          <Suspense fallback={null}>
            {children}
            <OrbitControls
              {...ORBIT_CONFIG}
              onStart={handleRotateStart}
              onEnd={handleRotateEnd}
            />
          </Suspense>
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
