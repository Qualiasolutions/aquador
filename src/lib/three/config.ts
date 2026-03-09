/**
 * Three.js and React Three Fiber configuration constants.
 * Centralized configuration for camera, lighting, and controls.
 */

export const CAMERA_CONFIG = {
  position: [0, 0, 5] as [number, number, number],
  fov: 50,
};

export const LIGHTING_CONFIG = {
  ambientIntensity: 0.5,
  directionalIntensity: 1,
  directionalPosition: [5, 5, 5] as [number, number, number],
};

export const ORBIT_CONFIG = {
  enableDamping: true,
  dampingFactor: 0.05,
  minDistance: 2,
  maxDistance: 10,
  minPolarAngle: Math.PI / 4,
  maxPolarAngle: Math.PI / 2,
};
