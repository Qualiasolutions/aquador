import { useState, useEffect } from 'react';

export interface DeviceCapabilities {
  isMobile: boolean;
  isLowEnd: boolean;
  canHandle3D: boolean;
  recommendedDPR: number;
  memoryGB: number | null;
  savesData: boolean;
  supports3D: boolean;
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    isMobile: false,
    isLowEnd: false,
    canHandle3D: true,
    recommendedDPR: 1.5,
    memoryGB: null,
    savesData: false,
    supports3D: true,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
                    window.matchMedia('(max-width: 768px)').matches;

    // @ts-expect-error - deviceMemory not in TypeScript DOM lib
    const memoryGB = (navigator.deviceMemory as number | undefined) || null;

    const isLowEnd = memoryGB !== null && memoryGB < 4;

    const recommendedDPR = isMobile
      ? (isLowEnd ? 1 : 1.5)
      : window.devicePixelRatio > 2 ? 2 : 1.5;

    const canHandle3D = !isLowEnd || memoryGB === null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const connection = (navigator as any).connection;
    const savesData = connection?.saveData === true ||
      connection?.effectiveType === 'slow-2g' ||
      connection?.effectiveType === '2g';

    // supports3D: desktop always gets 3D; mobile only if not low-end and not data-saving
    const supports3D = !isMobile || (!isLowEnd && !savesData);

    setCapabilities({
      isMobile,
      isLowEnd,
      canHandle3D,
      recommendedDPR,
      memoryGB,
      savesData,
      supports3D,
    });
  }, []);

  return capabilities;
}
