'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrderSession } from '@/context/OrderSessionContext';
import { ChefHat, CheckCircle2, Utensils, BellRing } from 'lucide-react';

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served';

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { tableId, sessionId } = useOrderSession();
  
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [estMinutes, setEstMinutes] = useState<number | null>(null);
  const [isCallingWaiter, setIsCallingWaiter] = useState(false);
  const [isRequestingBill, setIsRequestingBill] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/orders/${params.id}/status`);
        if (res.ok) {
          const data = await res.json();
          setStatus(data.status);
          setEstMinutes(data.estimatedMinutes);
        }
      } catch (e) {
        console.error('Failed to fetch status');
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 12000);
    return () => clearInterval(interval);
  }, [params.id]);

  const handleCallWaiter = async () => {
    setIsCallingWaiter(true);
    try {
      await fetch(`/api/orders/${params.id}/callwaiter`, { method: 'POST' });
      // Show some temporary feedback or just let it be silent success
      setTimeout(() => setIsCallingWaiter(false), 2000);
    } catch (e) {
      setIsCallingWaiter(false);
    }
  };

  const handleRequestBill = async () => {
    setIsRequestingBill(true);
    try {
      await fetch(`/api/orders/${params.id}/requestbill`, { method: 'POST' });
      setTimeout(() => setIsRequestingBill(false), 2000);
    } catch (e) {
      setIsRequestingBill(false);
    }
  };

  if (!status) {
    return <div className="min-h-screen bg-[#060608] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
    </div>;
  }

  if (status === 'served') {
    return (
      <div className="min-h-screen bg-[#060608] flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-6">
          <Utensils size={48} className="text-gold" />
        </motion.div>
        <h1 className="text-4xl font-serif italic text-white mb-4">Enjoy your meal!</h1>
        <p className="text-white/60 font-mono text-sm uppercase tracking-widest mb-12">Thank you for dining at SUGI</p>
        
        <button onClick={() => router.push(`/menu?table=${tableId}`)} className="text-gold/60 text-sm font-mono uppercase tracking-[0.2em] hover:text-gold transition-colors">
          View Menu Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060608] p-6 pt-12 max-w-lg mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-2xl font-serif italic text-white mb-2">Order Tracking</h1>
        <p className="text-white/40 font-mono text-xs uppercase tracking-widest">Table {tableId}</p>
      </div>

      {/* Dynamic Banner */}
      <AnimatePresence mode="wait">
        {status === 'pending' && (
          <motion.div key="pending" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-12 text-center">
             <div className="flex justify-center mb-4"><Utensils size={24} className="text-white/40" /></div>
             <h3 className="text-white text-lg font-serif italic mb-1">Order Placed</h3>
             <p className="text-white/40 text-sm">Waiting for the kitchen to accept...</p>
          </motion.div>
        )}
        
        {status === 'preparing' && (
          <motion.div key="preparing" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 mb-12 text-center">
             <div className="flex justify-center mb-4"><ChefHat size={24} className="text-amber-500" /></div>
             <h3 className="text-amber-500 text-lg font-serif italic mb-1">Being Prepared</h3>
             <p className="text-amber-500/60 text-sm">Estimated time: {estMinutes}–{estMinutes ? estMinutes + 5 : 20} min</p>
          </motion.div>
        )}

        {status === 'ready' && (
          <motion.div key="ready" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-12 text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
             <div className="flex justify-center mb-4 relative z-10"><CheckCircle2 size={24} className="text-emerald-500" /></div>
             <h3 className="text-emerald-500 text-lg font-serif italic mb-1 relative z-10">Order Ready!</h3>
             <p className="text-emerald-500/60 text-sm relative z-10">Your waiter is bringing it to you.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3-Stage Progress Bar */}
      <div className="mb-16">
         <div className="flex justify-between items-center relative">
            <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-white/10 -z-10" />
            <div className="absolute left-0 top-1/2 h-[2px] bg-gold transition-all duration-1000 -z-10" style={{ width: status === 'pending' ? '0%' : status === 'preparing' ? '50%' : '100%' }} />
            
            <div className={`flex flex-col items-center gap-2 ${status === 'pending' ? 'text-gold' : 'text-white'}`}>
              <div className={`w-4 h-4 rounded-full border-2 ${status === 'pending' ? 'bg-[#060608] border-gold' : 'bg-gold border-gold'}`} />
              <span className="text-[10px] uppercase tracking-widest font-mono">Placed</span>
            </div>

            <div className={`flex flex-col items-center gap-2 ${status === 'preparing' ? 'text-gold' : status === 'ready' ? 'text-white' : 'text-white/20'}`}>
              <div className={`w-4 h-4 rounded-full border-2 ${status === 'preparing' ? 'bg-[#060608] border-gold' : status === 'ready' ? 'bg-gold border-gold' : 'bg-[#060608] border-white/20'}`} />
              <span className="text-[10px] uppercase tracking-widest font-mono">Preparing</span>
            </div>

            <div className={`flex flex-col items-center gap-2 ${status === 'ready' ? 'text-gold' : 'text-white/20'}`}>
              <div className={`w-4 h-4 rounded-full border-2 ${status === 'ready' ? 'bg-gold border-gold' : 'bg-[#060608] border-white/20'}`} />
              <span className="text-[10px] uppercase tracking-widest font-mono">Ready</span>
            </div>
         </div>
      </div>

      <div className="space-y-4">
        <button onClick={() => router.push(`/menu?table=${tableId}`)} className="w-full py-4 rounded-2xl border border-white/10 text-white text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
          + Add more items
        </button>

        <div className="flex gap-4">
          <button onClick={handleCallWaiter} disabled={isCallingWaiter} className="flex-1 py-4 text-white/40 border border-white/5 rounded-2xl text-[10px] font-mono uppercase tracking-widest flex items-center justify-center gap-2 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50">
            <BellRing size={14} />
            {isCallingWaiter ? 'Calling...' : 'Call Waiter'}
          </button>
          
          <button onClick={handleRequestBill} disabled={isRequestingBill} className="flex-1 py-4 text-purple-400 border border-purple-500/20 rounded-2xl bg-purple-500/5 text-[10px] font-mono uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-purple-500/10 hover:border-purple-500/30 transition-colors disabled:opacity-50">
            <Utensils size={14} />
            {isRequestingBill ? 'Requesting...' : 'Request Bill'}
          </button>
        </div>
      </div>
    </div>
  );
}
