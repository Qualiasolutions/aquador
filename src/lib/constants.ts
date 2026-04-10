/**
 * Shared constants used across the application
 */

import type { ProductType } from '@/types/product';

/**
 * Human-readable labels for product types
 */
export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  'perfume': 'Perfume',
  'essence-oil': 'Essence Oil',
  'body-lotion': 'Body Lotion',
} as const;

/**
 * Get the label for a product type
 */
export function getProductTypeLabel(type: string): string {
  return PRODUCT_TYPE_LABELS[type as ProductType] || type;
}

/**
 * Allowed shipping countries for Stripe checkout
 */
export const SHIPPING_COUNTRIES = [
  'CY', 'GR', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT',
] as const;

/**
 * Shipping configuration
 */
export const FREE_SHIPPING_THRESHOLD = 35; // EUR — orders at or above this get free shipping
export const DELIVERY_FEE = 3; // EUR — flat fee for orders below threshold

/**
 * Cart configuration constants
 */
export const CART_DEBOUNCE_MS = 500;
export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 99;
export const MAX_CART_ITEMS = 50;
