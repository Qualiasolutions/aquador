'use client';

import { Suspense } from 'react';
import { Scene } from './Scene';
import { Lighting } from './Lighting';
import { PerfumeBottle } from './PerfumeBottle';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';

type ProductViewerProps = {
  productName?: string;
  className?: string;
};

function ProductViewer3DContent({ productName }: { productName: string }) {
  const { isMobile } = useDeviceCapabilities();

  return (
    <Scene productName={productName}>
      <PerfumeBottle position={[0, 0, 0]} />
      <Lighting simplified={isMobile} />
    </Scene>
  );
}

export function ProductViewer({
  productName = 'Product',
  className
}: ProductViewerProps) {
  return (
    <div className={className}>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full bg-dark-900/50 backdrop-blur-sm rounded-lg">
            <LoadingSpinner
              size="lg"
              text={`Loading 3D view of ${productName}...`}
            />
          </div>
        }
      >
        <ProductViewer3DContent productName={productName} />
      </Suspense>
    </div>
  );
}
