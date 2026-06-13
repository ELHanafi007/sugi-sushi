'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrderSuccessScreen({ orderId, tableNumber, itemsCount }: { orderId: string, tableNumber: string, itemsCount: number }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/order/${orderId}`);
    }, 2500);
    return () => clearTimeout(timer);
  }, [orderId, router]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[30000] bg-emerald-500 flex flex-col items-center justify-center text-white"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mb-6"
      >
        <Check size={48} className="text-white" />
      </motion.div>
      <motion.h2 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-4xl font-serif italic mb-2"
      >
        Order received! 🎉
      </motion.h2>
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-white/80 font-mono text-sm uppercase tracking-widest"
      >
        Table {tableNumber} · {itemsCount} items
      </motion.p>
    </motion.div>
  );
}
