'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Check, Utensils, AlertCircle, ShoppingBag } from 'lucide-react';
import CurrencyPrice from '@/components/CurrencyPrice';

interface Order {
  id: string;
  table_number: string;
  items: any[];
  total_price: number;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  created_at: string;
  general_note?: string;
}

export default function CuisinePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState(false);
  
  // Use ref to keep track of known IDs to avoid triggering sound on initial load
  const knownIdsRef = useRef<Set<string>>(new Set());
  const initialLoadDone = useRef(false);

  const playAlert = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.log('Audio playback failed', e);
    }
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .in('status', ['pending', 'preparing', 'ready'])
      .order('created_at', { ascending: true });

    if (data && !error) {
      if (initialLoadDone.current) {
        const hasNewPending = data.some(o => o.status === 'pending' && !knownIdsRef.current.has(o.id));
        if (hasNewPending) {
          playAlert();
          setFlash(true);
          setTimeout(() => setFlash(false), 100);
        }
      }
      
      setOrders(data);
      knownIdsRef.current = new Set(data.map(o => o.id));
      initialLoadDone.current = true;
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('cuisine-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');

  useEffect(() => {
    document.title = pendingOrders.length > 0 
      ? `(${pendingOrders.length}) Kitchen Display` 
      : 'Kitchen Display';
  }, [pendingOrders.length]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <>
      <AnimatePresence>
        {flash && (
          <motion.div 
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[9999] pointer-events-none"
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
      
      <div className="min-h-screen bg-[#060608] p-6 md:p-10 relative">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif italic text-gold shimmer-gold">Cuisine</h1>
            <p className="text-white/30 text-[10px] uppercase tracking-[0.4em] font-black mt-2">Kitchen Display System</p>
          </div>
          
          <div className="flex gap-4">
            <StatCard label="Pending" count={pendingOrders.length} color="text-amber-400" />
            <StatCard label="Preparing" count={preparingOrders.length} color="text-blue-400" />
            <StatCard label="Ready" count={readyOrders.length} color="text-emerald-400" />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending Section */}
          <OrderColumn 
            title="New Orders" 
            orders={pendingOrders} 
            status="pending" 
            onAction={(id: string) => updateStatus(id, 'preparing')}
            actionLabel="Start Preparing"
            actionIcon={Clock}
            accentColor="border-amber-500/20"
          />

          {/* Preparing Section */}
          <OrderColumn 
            title="Preparing" 
            orders={preparingOrders} 
            status="preparing" 
            onAction={(id: string) => updateStatus(id, 'ready')}
            actionLabel="Ready to Serve"
            actionIcon={Check}
            accentColor="border-blue-500/20"
          />

          {/* Ready Section */}
          <OrderColumn 
            title="Ready to Serve (Tell Waiter to Deliver)" 
            orders={readyOrders} 
            status="ready" 
            onAction={(id: string) => updateStatus(id, 'served')}
            actionLabel="Mark Served & Delivered"
            actionIcon={Utensils}
            accentColor="border-emerald-500/20"
            isReadyColumn={true}
          />
        </div>
      </div>
    </>
  );
}

function StatCard({ label, count, color }: { label: string, count: number, color: string }) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl px-6 py-3 flex flex-col items-center">
      <span className="text-white/20 text-[8px] uppercase tracking-widest mb-1">{label}</span>
      <span className={`text-2xl font-mono font-bold ${color}`}>{count}</span>
    </div>
  );
}

function OrderColumn({ title, orders, status, onAction, actionLabel, actionIcon: ActionIcon, accentColor, isReadyColumn }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 px-2">
        <h2 className="text-white/60 text-lg font-serif italic">{title}</h2>
        <div className="h-px flex-1 bg-white/5" />
        <span className="text-white/20 text-xs font-mono">{orders.length}</span>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {orders.map((order: Order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`bg-white/[0.02] border ${accentColor} rounded-3xl p-6 luxury-card`}
            >
              {isReadyColumn && (
                <div className="mb-4 bg-emerald-500/10 border-l-4 border-emerald-500 p-3 rounded-r-xl">
                  <span className="text-emerald-400 text-[9px] uppercase tracking-widest font-mono font-bold block">Deliver Immediately</span>
                  <p className="text-white text-xs font-mono mt-1">Take order to Table {order.table_number}</p>
                </div>
              )}

              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-gold/60 text-[10px] font-mono uppercase tracking-[0.2em] block mb-1">Table</span>
                  <span className="text-4xl font-serif italic text-white font-bold">{order.table_number}</span>
                </div>
                <div className="text-right">
                  <span className="text-white/20 text-[10px] font-mono uppercase tracking-[0.2em] block mb-1">Received</span>
                  <span className="text-white/40 text-xs font-mono">
                    {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {order.general_note && (
                <div className="mb-6 bg-red-500/10 border-l-4 border-red-500 p-3 rounded-r-xl">
                  <span className="text-red-400 text-[10px] uppercase tracking-widest font-bold block mb-1">General Note</span>
                  <p className="text-red-300 text-sm font-medium">{order.general_note}</p>
                </div>
              )}

              <div className="space-y-3 mb-8">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col bg-white/[0.01] p-3 rounded-xl border border-white/[0.03]">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold text-xs font-bold">
                          {item.quantity}
                        </span>
                        <div>
                          <p className="text-white/80 text-sm font-medium">{item.name}</p>
                          {item.portion && (
                            <p className="text-gold/40 text-[9px] uppercase tracking-widest">{item.portion.name}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    {item.note && (
                      <div className="mt-3 bg-[#FFF3CD] border-l-4 border-[#F59E0B] p-2 rounded-r-md text-black text-xs font-medium">
                        Note: {item.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => onAction(order.id)}
                className="w-full py-4 rounded-xl bg-white/[0.04] border border-white/5 hover:bg-gold hover:text-black hover:border-gold transition-all duration-500 group flex items-center justify-center gap-3"
              >
                <ActionIcon size={16} className="text-gold group-hover:text-black transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{actionLabel}</span>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {orders.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-white/[0.02] rounded-[3rem]">
            <ShoppingBag className="w-8 h-8 text-white/5 mx-auto mb-4" />
            <p className="text-white/10 font-serif italic">No {title.toLowerCase()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
