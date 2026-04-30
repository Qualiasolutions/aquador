'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCart } from './CartProvider';
import CartItem from './CartItem';
import CheckoutButton from './CheckoutButton';
import { formatPrice } from '@/lib/currency';
import { FREE_SHIPPING_THRESHOLD, DELIVERY_FEE } from '@/lib/constants';

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, subtotal, clearCart } = useCart();
  const isEmpty = cart.items.length === 0;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const deliveryFee = isFreeShipping ? 0 : DELIVERY_FEE;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop - Enhanced */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />

          {/* Drawer - Premium Edition */}
          <motion.div
            initial={{ x: '100%', opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.8 }}
            transition={{ type: 'spring', damping: 35, stiffness: 280 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#FAFAF8] border-l border-gold/15 z-50 flex flex-col overflow-hidden"
          >
            {/* Ambient gold glow */}
            <div 
              className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at top right, rgba(212,175,55,0.06) 0%, transparent 60%)',
                filter: 'blur(40px)',
              }}
            />
            
            {/* Header - Enhanced */}
            <div className="relative flex items-center justify-between px-6 py-5 border-b border-gold/10">
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-gold" />
                  {!isEmpty && (
                    <motion.span 
                      className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 }}
                    />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-playfair text-black">Your Cart</h2>
                  {!isEmpty && (
                    <p className="text-[9px] uppercase tracking-[0.15em] text-gray-400 mt-0.5">
                      {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
                    </p>
                  )}
                </div>
              </motion.div>
              <motion.button
                onClick={closeCart}
                className="group p-2.5 text-gray-400 hover:text-black transition-colors duration-300"
                aria-label="Close cart"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
              </motion.button>
            </div>

            {/* Cart Content - Enhanced */}
            <div className="relative flex-1 overflow-y-auto px-6 py-5 scrollbar-hide">
              {isEmpty ? (
                <motion.div 
                  className="flex flex-col items-center justify-center h-full text-center px-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  {/* Decorative empty state */}
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-radial-gold opacity-30 blur-xl" />
                    <ShoppingBag className="relative w-20 h-20 text-gold/25" strokeWidth={1} />
                  </div>
                  <h3 className="text-xl font-playfair text-black mb-3">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-400 text-sm mb-8 max-w-[260px] leading-relaxed">
                    Discover our luxury fragrances and find your signature scent.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="group relative px-8 py-3.5 bg-black text-gold text-[10px] uppercase tracking-[0.15em] font-medium overflow-hidden transition-all duration-500 hover:text-black"
                  >
                    <span className="relative z-10">Browse Collection</span>
                    <div className="absolute inset-0 bg-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  </Link>
                </motion.div>
              ) : (
                <div className="relative space-y-4">
                  <AnimatePresence mode="popLayout">
                    {cart.items.map((item, index) => (
                      <motion.div
                        key={item.variantId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                        transition={{ delay: index * 0.05, duration: 0.4 }}
                      >
                        <CartItem item={item} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer - Premium Edition */}
            {!isEmpty && (
              <motion.div 
                className="relative border-t border-gold/10 px-6 py-5 space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {/* Subtle gradient overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to top, rgba(212,175,55,0.02) 0%, transparent 100%)',
                  }}
                />
                
                {/* Subtotal */}
                <div className="relative flex items-center justify-between">
                  <span className="text-sm text-gray-400 tracking-wide">Subtotal</span>
                  <span className="text-lg font-playfair text-black">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {/* Delivery fee */}
                <div className="relative flex items-center justify-between">
                  <span className="text-sm text-gray-400 tracking-wide">Delivery</span>
                  {isFreeShipping ? (
                    <span className="text-xs font-medium text-gold uppercase tracking-wider">Complimentary</span>
                  ) : (
                    <span className="text-sm text-black">{formatPrice(deliveryFee)}</span>
                  )}
                </div>

                {/* Total */}
                <div className="relative flex items-center justify-between pt-3 border-t border-gold/10">
                  <span className="text-black font-medium tracking-wide">Total</span>
                  <span className="text-2xl font-playfair text-gold">
                    {formatPrice(subtotal + deliveryFee)}
                  </span>
                </div>

                {/* Shipping Note - Enhanced */}
                <div className="relative text-center py-2">
                  <p className="text-[10px] text-gray-400 uppercase tracking-[0.1em]">
                    {isFreeShipping
                      ? 'Complimentary shipping included'
                      : `Add ${formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping`}
                  </p>
                  {!isFreeShipping && (
                    <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-gold/60 to-gold rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(subtotal / FREE_SHIPPING_THRESHOLD) * 100}%` }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  )}
                </div>

                {/* Checkout Button */}
                <CheckoutButton />

                {/* Continue Shopping - Enhanced */}
                <div className="relative flex items-center justify-center gap-6 pt-2">
                  <button
                    onClick={clearCart}
                    className="text-[10px] uppercase tracking-[0.1em] text-gray-400 hover:text-red-400 transition-colors duration-300"
                  >
                    Clear Cart
                  </button>
                  <span className="w-px h-3 bg-gold/20" />
                  <button
                    onClick={closeCart}
                    className="text-[10px] uppercase tracking-[0.1em] text-gold hover:text-gold-light transition-colors duration-300"
                  >
                    Continue Shopping
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
