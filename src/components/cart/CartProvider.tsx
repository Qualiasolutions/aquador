'use client';

import { createContext, useContext, useReducer, useEffect, useState, useCallback, useRef, type ReactNode } from 'react';
import { z } from 'zod';
import * as Sentry from '@sentry/nextjs';
import type { Cart, CartItem, CartAction, CartContextType } from '@/types/cart';
import { calculateSubtotal } from '@/lib/currency';

const CART_STORAGE_KEY = 'aquador_cart';

const initialCart: Cart = {
  items: [],
};

// Zod schema for cart validation
const CartItemSchema = z.object({
  productId: z.string(),
  variantId: z.string(),
  quantity: z.number().int().positive(),
  name: z.string(),
  image: z.string(),
  price: z.number().nonnegative(),
  size: z.enum(['10ml', '50ml', '100ml', '150ml']),
  productType: z.enum(['perfume', 'essence-oil', 'body-lotion']),
});

const CartSchema = z.object({
  items: z.array(CartItemSchema),
});

function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) => item.variantId === action.payload.variantId
      );

      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + action.payload.quantity,
        };
        return { ...state, items: newItems };
      }

      return { ...state, items: [...state.items, action.payload] };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.variantId !== action.payload.variantId),
      };

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.variantId !== action.payload.variantId),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.variantId === action.payload.variantId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }

    case 'CLEAR_CART':
      return initialCart;

    case 'HYDRATE':
      return action.payload;

    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | null>(null);

const PERSIST_DEBOUNCE_MS = 500;

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const persistTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Hydrate cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);

        // Validate cart data with Zod schema
        const validation = CartSchema.safeParse(parsed);

        if (validation.success) {
          // Valid cart data - hydrate
          dispatch({ type: 'HYDRATE', payload: validation.data });
        } else {
          // Invalid cart data - log to Sentry and clear localStorage
          Sentry.captureException(new Error('Invalid cart data in localStorage'), {
            contexts: {
              cart: {
                validationErrors: validation.error.issues,
                rawData: parsed,
              },
            },
          });
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      }
    } catch (error) {
      // JSON parse error - log to Sentry and clear localStorage
      Sentry.captureException(error, {
        contexts: {
          cart: {
            message: 'Failed to parse cart from localStorage',
          },
        },
      });
      localStorage.removeItem(CART_STORAGE_KEY);
    }
    setIsHydrated(true);
  }, []);

  // Persist cart to localStorage on changes (debounced to avoid main thread blocking)
  useEffect(() => {
    if (!isHydrated) return;

    // Clear any pending persistence
    if (persistTimeoutRef.current) {
      clearTimeout(persistTimeoutRef.current);
    }

    // Debounce localStorage writes
    persistTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (error) {
        Sentry.addBreadcrumb({
          category: 'cart-provider',
          message: 'Failed to persist cart',
          level: 'error',
          data: { error }
        });
      }
    }, PERSIST_DEBOUNCE_MS);

    return () => {
      if (persistTimeoutRef.current) {
        clearTimeout(persistTimeoutRef.current);
      }
    };
  }, [cart, isHydrated]);

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    setIsCartOpen(true);
  }, []);

  const removeItem = useCallback((variantId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { variantId } });
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { variantId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = calculateSubtotal(cart.items);

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
