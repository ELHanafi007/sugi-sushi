'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import {
  User,
  Clock,
  BellRing,
  CheckCircle2,
  Receipt,
  Utensils
} from 'lucide-react';

type TableStatus = 'empty' | 'seated' | 'ordering' | 'waiting' | 'ready' | 'delivered' | 'billing';
type TableZone = 'Reception' | 'Main Hall' | 'Window Booths' | 'Sushi Bar' | 'Side Wall';

type FloorTable = {
  id: string;
  label: string;
  seats: number;
  x: number;
  y: number;
  w: number;
  h: number;
  zone: TableZone;
};

const FLOOR_PLAN_IMAGE = '/media/cashier-floor-plan.png';

const floorTables: FloorTable[] = [
  { id: 'l01', label: 'L01', seats: 2, x: 9.2, y: 17.5, w: 4.7, h: 7.5, zone: 'Side Wall' },
  { id: 'l02', label: 'L02', seats: 2, x: 9.2, y: 26.7, w: 4.7, h: 7.5, zone: 'Side Wall' },
  { id: 'l03', label: 'L03', seats: 2, x: 9.2, y: 41, w: 4.7, h: 7.5, zone: 'Side Wall' },
  { id: 'l04', label: 'L04', seats: 2, x: 9.2, y: 49.9, w: 4.7, h: 7.5, zone: 'Side Wall' },
  { id: 'l05', label: 'L05', seats: 2, x: 9.2, y: 63.9, w: 4.7, h: 7.5, zone: 'Side Wall' },
  { id: 'l06', label: 'L06', seats: 2, x: 9.2, y: 72.8, w: 4.7, h: 7.5, zone: 'Side Wall' },
  { id: 'l07', label: 'L07', seats: 2, x: 9.2, y: 84.7, w: 4.7, h: 7.5, zone: 'Side Wall' },
  { id: 'm01', label: 'M01', seats: 4, x: 42.1, y: 8.8, w: 9, h: 13.8, zone: 'Main Hall' },
  { id: 'm02', label: 'M02', seats: 4, x: 56.4, y: 8.8, w: 9, h: 13.8, zone: 'Main Hall' },
  { id: 'm03', label: 'M03', seats: 4, x: 56.4, y: 35.8, w: 9, h: 13.8, zone: 'Main Hall' },
  { id: 'm04', label: 'M04', seats: 4, x: 29.3, y: 56.3, w: 13.6, h: 10.5, zone: 'Main Hall' },
  { id: 'm05', label: 'M05', seats: 4, x: 57.1, y: 56.3, w: 13.6, h: 10.5, zone: 'Main Hall' },
  { id: 'w01', label: 'W01', seats: 6, x: 82.9, y: 12.6, w: 12.2, h: 22.2, zone: 'Window Booths' },
  { id: 'w02', label: 'W02', seats: 6, x: 82.9, y: 37.3, w: 12.2, h: 22.2, zone: 'Window Booths' },
  { id: 'w03', label: 'W03', seats: 6, x: 82.9, y: 61.8, w: 12.2, h: 22.2, zone: 'Window Booths' },
  { id: 'b01', label: 'B01', seats: 6, x: 35.2, y: 76.6, w: 14.2, h: 9.7, zone: 'Sushi Bar' },
  { id: 'b02', label: 'B02', seats: 6, x: 51.8, y: 76.6, w: 14.2, h: 9.7, zone: 'Sushi Bar' },
  { id: 'r01', label: 'R01', seats: 2, x: 23.3, y: 13.6, w: 10.4, h: 12.2, zone: 'Reception' },
];

export default function CashierTablesPage() {
  const [dbTables, setDbTables] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [tableOrders, setTableOrders] = useState<any[]>([]);

  const [dbError, setDbError] = useState<string | null>(null);

  // Refs for audio to avoid playing on initial load
  const knownAlertsRef = useRef<Set<string>>(new Set());
  const initialLoadDone = useRef(false);

  const playAlert = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      // Cashier alert sound (slightly higher pitch than kitchen)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(660, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.log('Audio playback failed', e);
    }
  };

  const fetchTables = async () => {
    const { data, error } = await supabase
      .from('restaurant_tables')
      .select('*');

    if (error) {
      console.error('Error fetching tables:', error);
      if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
        setDbError('Supabase tables are missing. Please run the SQL schema migration in your Supabase Dashboard.');
      } else {
        setDbError(error.message);
      }
      return;
    }

    if (data) {
      setDbError(null);
      if (initialLoadDone.current) {
        // Check for new call_waiter or billing flags
        const hasNewAlert = data.some(t => {
          const isAlerting = t.call_waiter || t.status === 'billing';
          const alreadyKnown = knownAlertsRef.current.has(t.id);
          if (isAlerting && !alreadyKnown) {
            knownAlertsRef.current.add(t.id);
            return true;
          }
          if (!isAlerting && alreadyKnown) {
            knownAlertsRef.current.delete(t.id);
          }
          return false;
        });
        
        if (hasNewAlert) {
          playAlert();
        }
      } else {
        // Initial load: populate known alerts
        data.forEach(t => {
          if (t.call_waiter || t.status === 'billing') {
            knownAlertsRef.current.add(t.id);
          }
        });
        initialLoadDone.current = true;
      }

      setDbTables(data);
    }
  };

  const fetchTableOrders = async (tableId: string) => {
    const { data: session } = await supabase
      .from('sessions')
      .select('id')
      .eq('table_id', tableId)
      .eq('status', 'active')
      .single();

    if (session) {
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('session_id', session.id);
      
      setTableOrders(orders || []);
    } else {
      setTableOrders([]);
    }
  };

  useEffect(() => {
    if (selectedId) {
      fetchTableOrders(selectedId);
    } else {
      setTableOrders([]);
    }
  }, [selectedId, dbTables]); // Refresh orders when tables update (might mean a status changed)


  useEffect(() => {
    fetchTables();

    // Use a unique channel name on each mount to prevent "cannot add postgres_changes callbacks after subscribe" error
    const uniqueChannelName = `cashier-tables-db-${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase.channel(uniqueChannelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'restaurant_tables' }, fetchTables)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleToggleSeated = async (tableId: string, currentStatus: string) => {
    setIsUpdating(true);
    const nextStatus = currentStatus === 'empty' ? 'seated' : 'empty';

    const updatePayload: any = { status: nextStatus };
    if (nextStatus === 'empty') {
      updatePayload.call_waiter = false;
      const { data: activeSessions } = await supabase
        .from('sessions')
        .select('id')
        .eq('table_id', tableId)
        .eq('status', 'active');
      
      if (activeSessions && activeSessions.length > 0) {
        for (const sess of activeSessions) {
          await supabase
            .from('sessions')
            .update({ status: 'closed', closed_at: new Date().toISOString() })
            .eq('id', sess.id);
        }
      }
    } else {
      await supabase
        .from('sessions')
        .insert({ table_id: tableId, status: 'active' });
    }

    await supabase
      .from('restaurant_tables')
      .update(updatePayload)
      .eq('id', tableId);

    await fetchTables();
    setIsUpdating(false);
  };

  const handleClearWaiterFlag = async (tableId: string) => {
    setIsUpdating(true);
    await supabase
      .from('restaurant_tables')
      .update({ call_waiter: false })
      .eq('id', tableId);
    await fetchTables();
    setIsUpdating(false);
  };

  const getTableMeta = (table: FloorTable) => {
    const dbTable = dbTables.find((t) => t.id === table.id);
    const status: TableStatus = dbTable?.status || 'empty';
    const callWaiter = dbTable?.call_waiter || false;

    if (callWaiter) {
      return {
        label: 'Call Waiter',
        dot: 'bg-red-500 animate-pulse border-red-300 shadow-[0_0_15px_rgba(239,68,68,0.8)]',
        badge: 'border-red-500 text-red-950 bg-red-100 ring-2 ring-red-500/50',
        icon: BellRing,
        iconClass: 'text-red-500 animate-bounce',
      };
    }

    switch (status) {
      case 'billing':
        return {
          label: 'Bill Requested',
          dot: 'bg-purple-500 animate-pulse shadow-[0_0_12px_rgba(168,85,247,0.6)]',
          badge: 'border-purple-500 text-purple-950 bg-purple-100 ring-2 ring-purple-500/50',
          icon: Receipt,
          iconClass: 'text-purple-500 animate-bounce',
        };
      case 'seated':
      case 'ordering':
        return {
          label: 'Seated',
          dot: 'bg-sky-500',
          badge: 'border-sky-500 text-sky-950 bg-white/90',
          icon: User,
          iconClass: 'text-sky-500',
        };
      case 'waiting':
        return {
          label: 'Waiting Order',
          dot: 'bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]',
          badge: 'border-amber-500 text-amber-950 bg-amber-50',
          icon: Clock,
          iconClass: 'text-amber-500',
        };
      case 'ready':
        return {
          label: 'Order Ready',
          dot: 'bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.6)]',
          badge: 'border-emerald-500 text-emerald-950 bg-emerald-50',
          icon: CheckCircle2,
          iconClass: 'text-emerald-500',
        };
      case 'delivered':
        return {
          label: 'Delivered',
          dot: 'bg-teal-500',
          badge: 'border-teal-500 text-teal-950 bg-white/90',
          icon: CheckCircle2,
          iconClass: 'text-teal-500',
        };
      case 'empty':
      default:
        return {
          label: 'Free',
          dot: 'bg-zinc-400',
          badge: 'border-zinc-300 text-zinc-800 bg-white/90',
          icon: CheckCircle2,
          iconClass: 'text-zinc-400',
        };
    }
  };

  const selectedTable = floorTables.find((t) => t.id === selectedId);
  const selectedDbTable = dbTables.find((t) => t.id === selectedId);
  const selectedMeta = selectedTable ? getTableMeta(selectedTable) : null;

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#060608] flex relative">
      {/* Sidebar Info Panel */}
      <div className="w-[320px] border-r border-white/[0.06] bg-[#08080a] h-full flex flex-col z-20">
        <div className="p-6 border-b border-white/[0.04]">
          <h2 className="text-xl font-serif italic text-gold shimmer-gold">Tables Overview</h2>
          <p className="text-white/25 text-[10px] font-mono uppercase tracking-widest mt-1">Live floor management</p>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {selectedTable && selectedDbTable && selectedMeta ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-serif italic text-white">{selectedTable.label}</h3>
                <p className="text-white/30 text-xs font-mono uppercase tracking-widest mt-1">{selectedTable.zone} • {selectedTable.seats} Seats</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/40 text-[10px] uppercase tracking-widest font-mono">Current Status</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${selectedMeta.badge}`}>
                    {selectedMeta.label}
                  </span>
                </div>

                {selectedDbTable.call_waiter && (
                  <button
                    onClick={() => handleClearWaiterFlag(selectedDbTable.id)}
                    className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <BellRing size={14} className="animate-bounce" /> Clear Waiter Call
                  </button>
                )}

                {/* Orders Summary */}
                {selectedDbTable.status !== 'empty' && tableOrders.length > 0 && (
                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <span className="text-white/40 text-[10px] uppercase tracking-widest font-mono mb-2 block">Active Session Bill</span>
                    <div className="max-h-32 overflow-y-auto pr-1 space-y-1">
                      {tableOrders.map(order => (
                        <div key={order.id} className="text-xs text-white/70 flex justify-between">
                          <span className="truncate">{order.items.reduce((s: number, i: any) => s + i.quantity, 0)} Items</span>
                          <span className="text-gold">{order.total_price.toFixed(2)} MAD</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/5 font-bold">
                      <span className="text-sm text-white">Total</span>
                      <span className="text-lg text-gold">
                        {tableOrders.reduce((sum, o) => sum + (o.total_price || 0), 0).toFixed(2)} MAD
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleToggleSeated(selectedDbTable.id, selectedDbTable.status)}
                  disabled={isUpdating}
                  className={`w-full py-3 rounded-xl transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 ${
                    selectedDbTable.status === 'empty'
                      ? 'bg-gold text-black hover:scale-[1.02]'
                      : 'bg-white/[0.04] text-white/60 border border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20'
                  }`}
                >
                  {selectedDbTable.status === 'empty' ? 'Seat Table' : (
                    <>
                      <Receipt size={14} /> Clear / Checkout Table
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-35 py-12">
              <User size={36} className="text-white/20 mb-3" />
              <p className="text-sm font-serif italic text-white/50">Select a table on the floor plan to view details</p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="p-6 border-t border-white/[0.04] bg-black/20 space-y-3">
          <p className="text-white/25 text-[9px] font-mono uppercase tracking-widest">Legend</p>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-white/50">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-zinc-400" /> Free</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-sky-500" /> Seated</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Ordered</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Ready</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-teal-500" /> Served</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Call Waiter</div>
            <div className="flex items-center gap-2 col-span-2"><div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" /> Bill Requested</div>
          </div>
        </div>
      </div>

      {/* Main Floor Plan Area */}
      <div className="flex-1 relative bg-black flex items-center justify-center p-4">
        {dbError ? (
          <div className="max-w-md p-8 rounded-2xl bg-[#09090c] border border-red-500/20 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto text-red-400">
              <BellRing size={24} className="animate-pulse" />
            </div>
            <h3 className="text-lg font-serif italic text-white">Database Setup Required</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              {dbError}
            </p>
            <div className="bg-black/30 p-4 rounded-xl border border-white/[0.04] text-left space-y-2">
              <p className="text-[10px] font-mono text-gold uppercase tracking-widest font-bold">Quick Instructions:</p>
              <ol className="text-[11px] text-white/50 space-y-1 list-decimal pl-4">
                <li>Go to your <strong>Supabase Dashboard</strong></li>
                <li>Navigate to the <strong>SQL Editor</strong></li>
                <li>Paste and run the contents of <code className="text-white/80 font-mono bg-white/5 px-1 py-0.5 rounded">supabase_setup.sql</code> (located in the root of your project)</li>
                <li>Refresh this page</li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="relative aspect-[16/9] w-full max-w-[1100px] bg-white shadow-2xl rounded-2xl overflow-hidden">
            <img
              src={FLOOR_PLAN_IMAGE}
              alt="SUGI floor plan"
              className="absolute inset-0 h-full w-full object-fill opacity-95"
              draggable={false}
            />

            {floorTables.map((table) => {
              const dbTable = dbTables.find((t) => t.id === table.id);
              if (!dbTable) return null;
              
              const meta = getTableMeta(table);
              const active = selectedId === table.id;
              const Icon = meta.icon;

              return (
                <motion.button
                  key={table.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedId(table.id);
                  }}
                  title={`${table.label} - ${meta.label}`}
                  className={`absolute cursor-pointer rounded-md border-2 transition duration-200 ${
                    active ? 'border-gold bg-gold/10' : 'border-transparent bg-transparent hover:border-zinc-950/20 hover:bg-black/10'
                  }`}
                  style={{
                    left: `${table.x}%`,
                    top: `${table.y}%`,
                    width: `${table.w}%`,
                    height: `${table.h}%`,
                  }}
                >
                  <span
                    className={`absolute left-1/2 top-1/2 flex h-8 min-w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border px-2 text-[10px] font-black leading-none shadow-[0_5px_14px_rgba(0,0,0,0.3)] backdrop-blur-sm transition duration-200 md:h-10 md:min-w-10 md:text-[12px] ${meta.badge}`}
                  >
                    {table.label}
                    <span className={`absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${meta.dot}`} />
                    <Icon className={`absolute -bottom-1.5 -right-1.5 rounded-full bg-white p-0.5 shadow-sm ${meta.iconClass}`} size={16} />
                  </span>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
