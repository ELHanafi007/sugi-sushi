'use client';

import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import CurrencyPrice from '@/components/CurrencyPrice';

export default function StickyCartBar() {
  const { cart, cartTotal, itemCount, activeOrders, setIsCartOpen } = useCart();

  const activeCount = activeOrders.filter(o => o.status !== 'served').length;
  
  // Show if there are items in cart OR if there's an active order that's not served
  const isVisible = itemCount > 0 || activeCount > 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0c]/90 backdrop-blur-xl border-t border-white/[0.05] p-4 pb-safe flex justify-center"
        >
          <div className="w-full max-w-md">
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full py-4 px-6 rounded-2xl bg-gold text-black shadow-[0_10px_40px_rgba(212,175,55,0.2)] flex items-center justify-between transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingBag size={20} />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-black text-gold text-[10px] font-black flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                  {itemCount > 0 ? 'View Cart' : 'Order Status'}
                </span>
              </div>
              {itemCount > 0 && (
                <CurrencyPrice price={`${cartTotal} SR`} className="font-serif italic font-bold" />
              )}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
