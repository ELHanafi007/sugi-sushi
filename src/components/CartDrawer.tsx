'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Trash2, CheckCircle2, Clock, Utensils, MessageSquarePlus, Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import CurrencyPrice from '@/components/CurrencyPrice';

export default function CartDrawer({ isOrderFlow = false }: { isOrderFlow?: boolean }) {
  const { 
    cart, 
    removeFromCart, 
    updateItemQuantity, 
    updateItemNote,
    cartTotal, 
    itemCount, 
    submitOrder, 
    activeOrder, 
    notification, 
    clearNotification, 
    tableNumber, 
    setTableNumber,
    isCartOpen,
    setIsCartOpen,
    generalNote,
    setGeneralNote
  } = useCart();
  
  const { t, lang } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedNoteItemId, setExpandedNoteItemId] = useState<string | null>(null);

  // Automatically open drawer when items are added (handled locally if not order flow, or rely on StickyCartBar)
  useEffect(() => {
    if (itemCount > 0 && !activeOrder && !isOrderFlow) {
      setIsCartOpen(true);
    }
  }, [itemCount, activeOrder, isOrderFlow, setIsCartOpen]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let finalTable = tableNumber;
    let finalSessionId = null;

    if (isOrderFlow) {
      finalTable = sessionStorage.getItem('sugi_table_id') || tableNumber;
      finalSessionId = sessionStorage.getItem('sugi_session_id');
    }

    const orderId = await submitOrder(finalTable, finalSessionId);
    setIsSubmitting(false);
    if (orderId) {
      // Order submitted successfully
    }
  };

  const statusIcons: Record<string, any> = {
    pending: Clock,
    preparing: Utensils,
    ready: CheckCircle2,
    served: CheckCircle2,
  };

  const statusColors: Record<string, string> = {
    pending: 'text-amber-400',
    preparing: 'text-blue-400',
    ready: 'text-emerald-400',
    served: 'text-emerald-600',
  };

  if (itemCount === 0 && !activeOrder && !isCartOpen) return null;

  return (
    <>
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[20000] w-[90%] max-w-sm bg-gold text-black p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center">
                <Utensils size={20} />
              </div>
              <p className="text-[11px] font-black uppercase tracking-wider">{notification}</p>
            </div>
            <button onClick={clearNotification} className="p-2 hover:bg-black/5 rounded-lg transition-colors">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button (Hidden in Order Flow since StickyCartBar handles it) */}
      {!isOrderFlow && (
        <motion.button
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-32 right-6 z-[1000] w-16 h-16 rounded-full bg-gold text-black shadow-[0_20px_40px_rgba(212,175,55,0.3)] flex items-center justify-center group"
        >
          <ShoppingBag size={24} />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-black text-gold text-[10px] font-black flex items-center justify-center border-2 border-gold">
              {itemCount}
            </span>
          )}
          {activeOrder && activeOrder.status !== 'served' && (
            <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 animate-pulse border-2 border-black" />
          )}
        </motion.button>
      )}

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[10000]"
          />
        )}
      </AnimatePresence>

      {/* Drawer Content */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#0a0a0c] border-l border-white/5 z-[10001] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif italic text-white">{t('cart.title')}</h2>
                <p className="text-white/20 text-[10px] uppercase tracking-widest mt-1">Sugi Sushi Experience</p>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
              {activeOrder ? (
                /* Active Order Status */
                <div className="space-y-8">
                  <div className="p-6 rounded-[2rem] bg-gold/[0.03] border border-gold/10 text-center">
                    <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                      {React.createElement(statusIcons[activeOrder.status] || Clock, { 
                        size: 32, 
                        className: `${statusColors[activeOrder.status]} ${activeOrder.status === 'preparing' ? 'animate-bounce' : ''}` 
                      })}
                    </div>
                    <h3 className={`text-xl font-serif italic mb-1 ${statusColors[activeOrder.status]}`}>
                      {t(`cart.status.${activeOrder.status}`)}
                    </h3>
                    <p className="text-white/20 text-[10px] uppercase tracking-widest">
                      {t('cart.table')} {activeOrder.table_number}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-black">{t('res.details')}</p>
                    {activeOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-4 border-b border-white/[0.03]">
                        <div>
                          <p className="text-white/80 text-sm font-medium">{item.quantity}x {lang === 'ar' ? item.nameAr || item.name : item.name}</p>
                          {item.portion && <p className="text-gold/40 text-[9px] uppercase tracking-widest">{item.portion.name}</p>}
                          {item.note && <p className="text-white/40 text-[10px] italic mt-1">Note: {item.note}</p>}
                        </div>
                        <CurrencyPrice price={item.price} className="text-white/40 text-xs" />
                      </div>
                    ))}
                    {activeOrder.general_note && (
                       <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                         <p className="text-white/40 text-[9px] uppercase tracking-widest mb-1">General Note</p>
                         <p className="text-white/80 text-sm italic">{activeOrder.general_note}</p>
                       </div>
                    )}
                  </div>
                </div>
              ) : cart.length > 0 ? (
                /* Cart Items */
                <div className="space-y-6">
                  {/* Table Number Input - Only show if not in Order Flow */}
                  {!isOrderFlow && (
                    <div className="flex items-center gap-4 mb-8">
                      <label className="text-white/40 text-[10px] uppercase tracking-widest font-black">{t('cart.table')}</label>
                      <input 
                        type="text" 
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-white font-mono w-16 text-center focus:border-gold/30 outline-none"
                      />
                    </div>
                  )}

                  <div className="space-y-4">
                    {cart.map((item, idx) => {
                      const itemKey = `${item.id}-${item.portion?.name || 'std'}`;
                      const isNoteExpanded = expandedNoteItemId === itemKey;

                      return (
                        <motion.div 
                          key={itemKey}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex flex-col gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] group transition-all"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center gap-2 bg-black/20 rounded-xl p-1">
                              <button onClick={() => updateItemQuantity(item.id, item.portion?.name, item.quantity + 1)} className="p-1 hover:text-gold text-white/40 transition-colors">
                                <Plus size={14} />
                              </button>
                              <span className="text-white font-mono font-bold text-sm w-6 text-center">{item.quantity}</span>
                              <button onClick={() => updateItemQuantity(item.id, item.portion?.name, item.quantity - 1)} className="p-1 hover:text-gold text-white/40 transition-colors">
                                <Minus size={14} />
                              </button>
                            </div>
                            
                            <div className="flex-1 min-w-0 pt-1">
                              <p className="text-white/90 text-sm font-medium truncate">{lang === 'ar' ? item.nameAr || item.name : item.name}</p>
                              {item.portion && <p className="text-gold/40 text-[9px] uppercase tracking-widest">{item.portion.name}</p>}
                              
                              <button 
                                onClick={() => setExpandedNoteItemId(isNoteExpanded ? null : itemKey)}
                                className={`text-[10px] mt-2 flex items-center gap-1 transition-colors ${item.note ? 'text-gold' : 'text-white/30 hover:text-white/60'}`}
                              >
                                <MessageSquarePlus size={12} />
                                {item.note ? 'Edit note' : 'Add note'}
                              </button>
                            </div>
                            
                            <div className="text-right pt-1 flex flex-col items-end gap-3">
                              <CurrencyPrice price={item.price} className="text-white/60 text-xs block" />
                              <button 
                                onClick={() => removeFromCart(item.id, item.portion?.name)}
                                className="text-red-500/40 hover:text-red-500 transition-colors p-1"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Per-item note input area */}
                          <AnimatePresence>
                            {(isNoteExpanded || item.note) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <input
                                  type="text"
                                  placeholder="E.g. No spicy mayo, extra ginger..."
                                  value={item.note || ''}
                                  onChange={(e) => updateItemNote(item.id, item.portion?.name, e.target.value)}
                                  className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-[11px] text-white/80 placeholder:text-white/20 focus:border-gold/30 outline-none transition-colors"
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  {/* General Order Note */}
                  <div className="pt-4 mt-4 border-t border-white/[0.05]">
                    <label className="text-white/40 text-[10px] uppercase tracking-widest font-black mb-2 block flex items-center gap-2">
                      <MessageSquarePlus size={14} /> General Note
                    </label>
                    <textarea
                      value={generalNote}
                      onChange={(e) => setGeneralNote(e.target.value)}
                      placeholder="Any special requests for the entire order?"
                      className="w-full h-20 bg-white/[0.02] border border-white/10 rounded-xl p-3 text-xs text-white/80 placeholder:text-white/20 focus:border-gold/30 outline-none resize-none transition-colors"
                    />
                  </div>
                </div>
              ) : (
                /* Empty Cart */
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                  <ShoppingBag size={64} className="mb-6" />
                  <p className="text-xl font-serif italic">{t('cart.empty')}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {!activeOrder && cart.length > 0 && (
              <div className="p-8 border-t border-white/5 bg-white/[0.01] space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black">{t('cart.total')}</span>
                  <CurrencyPrice price={`${cartTotal} SR`} className="text-4xl text-gold font-serif italic" />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="w-full py-5 rounded-2xl bg-gold text-black text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(212,175,55,0.15)] flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? '...' : t('cart.submit')}
                </motion.button>
              </div>
            )}
            
            {activeOrder && activeOrder.status === 'served' && (
               <div className="p-8 border-t border-white/5 bg-white/[0.01]">
                 <p className="text-center text-emerald-400/60 text-[10px] uppercase tracking-widest font-black">
                   Enjoy your meal!
                 </p>
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
