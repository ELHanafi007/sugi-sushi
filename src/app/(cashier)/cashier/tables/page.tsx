'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import {
  User,
  Clock,
  BellRing,
  CheckCircle2,
  Receipt,
  Utensils,
  X,
  Users,
  CircleDot,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { Reservation } from '@/types/reservation';

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

/* ─── Status meta helper ─── */
const STATUS_META: Record<string, {
  label: string;
  bg: string;
  ring: string;
  text: string;
  dot: string;
  pulse: boolean;
  icon: typeof User;
}> = {
  call_waiter: {
    label: 'Call Waiter',
    bg: 'bg-red-500/15',
    ring: 'ring-red-500/60',
    text: 'text-red-400',
    dot: 'bg-red-500',
    pulse: true,
    icon: BellRing,
  },
  billing: {
    label: 'Bill Requested',
    bg: 'bg-purple-500/15',
    ring: 'ring-purple-500/60',
    text: 'text-purple-400',
    dot: 'bg-purple-500',
    pulse: true,
    icon: Receipt,
  },
  seated: {
    label: 'Seated',
    bg: 'bg-sky-500/12',
    ring: 'ring-sky-500/40',
    text: 'text-sky-400',
    dot: 'bg-sky-500',
    pulse: false,
    icon: User,
  },
  ordering: {
    label: 'Ordering',
    bg: 'bg-sky-500/12',
    ring: 'ring-sky-500/40',
    text: 'text-sky-400',
    dot: 'bg-sky-500',
    pulse: false,
    icon: User,
  },
  waiting: {
    label: 'Order Placed',
    bg: 'bg-amber-500/15',
    ring: 'ring-amber-500/50',
    text: 'text-amber-400',
    dot: 'bg-amber-500',
    pulse: true,
    icon: Clock,
  },
  ready: {
    label: 'Ready to Serve',
    bg: 'bg-emerald-500/15',
    ring: 'ring-emerald-500/50',
    text: 'text-emerald-400',
    dot: 'bg-emerald-500',
    pulse: true,
    icon: CheckCircle2,
  },
  delivered: {
    label: 'Delivered',
    bg: 'bg-teal-500/12',
    ring: 'ring-teal-500/40',
    text: 'text-teal-400',
    dot: 'bg-teal-400',
    pulse: false,
    icon: CheckCircle2,
  },
  empty: {
    label: 'Available',
    bg: 'bg-white/[0.04]',
    ring: 'ring-white/10',
    text: 'text-white/30',
    dot: 'bg-white/20',
    pulse: false,
    icon: CircleDot,
  },
};

function getTableMeta(dbTable: any) {
  if (dbTable?.call_waiter) return STATUS_META.call_waiter;
  return STATUS_META[dbTable?.status] ?? STATUS_META.empty;
}

/* ─── Legend items ─── */
const legendItems = [
  { label: 'Available', color: 'bg-white/20' },
  { label: 'Reserved', color: 'bg-gold' },
  { label: 'Seated', color: 'bg-sky-500' },
  { label: 'Ordered', color: 'bg-amber-500', pulse: true },
  { label: 'Ready', color: 'bg-emerald-500', pulse: true },
  { label: 'Served', color: 'bg-teal-400' },
  { label: 'Call Waiter', color: 'bg-red-500', pulse: true },
  { label: 'Bill', color: 'bg-purple-500', pulse: true },
];

/* ─── Summary stats ─── */
function useStats(dbTables: any[], tableReservations: Record<string, Reservation[]>) {
  const occupied = dbTables.filter(t => t.status !== 'empty').length;
  const alerts = dbTables.filter(t => t.call_waiter || t.status === 'billing').length;
  const total = dbTables.length;
  const reserved = Object.keys(tableReservations).length;
  return { occupied, alerts, total, available: total - occupied, reserved };
}

export default function CashierTablesPage() {
  const [dbTables, setDbTables] = useState<any[]>([]);
  const [tableReservations, setTableReservations] = useState<Record<string, Reservation[]>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [tableOrders, setTableOrders] = useState<any[]>([]);
  const [activeSessionsOrders, setActiveSessionsOrders] = useState<Record<string, { orders: any[], total: number }>>({});
  const [dbError, setDbError] = useState<string | null>(null);

  const knownAlertsRef = useRef<Set<string>>(new Set());
  const initialLoadDone = useRef(false);

  const stats = useStats(dbTables, tableReservations);

  /* ─── Audio ─── */
  const playAlert = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
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
  }, []);

  /* ─── Data fetching ─── */
  const fetchTables = useCallback(async () => {
    const { data, error } = await supabase
      .from('restaurant_tables')
      .select('*');

    if (error) {
      console.error('Error fetching tables:', error);
      if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
        setDbError('Database tables are not created yet. Run supabase_setup.sql in the Supabase SQL Editor.');
      } else {
        setDbError(error.message);
      }
      return;
    }

    if (data) {
      setDbError(null);
      if (initialLoadDone.current) {
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
        if (hasNewAlert) playAlert();
      } else {
        data.forEach(t => {
          if (t.call_waiter || t.status === 'billing') {
            knownAlertsRef.current.add(t.id);
          }
        });
        initialLoadDone.current = true;
      }
      setDbTables(data);

      // Fetch active sessions and orders
      try {
        const { data: activeSessions } = await supabase
          .from('sessions')
          .select('id, table_id')
          .eq('status', 'active');
          
        if (activeSessions && activeSessions.length > 0) {
          const sessionIds = activeSessions.map(s => s.id);
          const { data: orders } = await supabase
            .from('orders')
            .select('*')
            .in('session_id', sessionIds);
            
          const mapping: Record<string, { orders: any[], total: number }> = {};
          activeSessions.forEach(sess => {
            const sessOrders = (orders || []).filter(o => o.session_id === sess.id);
            const total = sessOrders.reduce((sum, o) => sum + (Number(o.total_price) || 0), 0);
            mapping[sess.table_id] = { orders: sessOrders, total };
          });
          setActiveSessionsOrders(mapping);
        } else {
          setActiveSessionsOrders({});
        }
      } catch (err) {
        console.error('Error fetching active sessions orders:', err);
      }

      try {
        const today = new Date().toISOString().split('T')[0];
        const { data: resData } = await supabase
          .from('reservations')
          .select('*')
          .eq('status', 'confirmed')
          .eq('date', today)
          .not('table_id', 'is', null);

        if (resData) {
          const mapping: Record<string, Reservation[]> = {};
          resData.forEach(r => {
            if (r.table_id) {
              if (!mapping[r.table_id]) mapping[r.table_id] = [];
              mapping[r.table_id].push(r as Reservation);
            }
          });
          setTableReservations(mapping);
        }
      } catch (err) {
        console.error('Error fetching reservations:', err);
      }
    }
  }, [playAlert]);

  const fetchTableOrders = useCallback(async (tableId: string) => {
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
  }, []);

  useEffect(() => {
    if (selectedId) fetchTableOrders(selectedId);
    else setTableOrders([]);
  }, [selectedId, dbTables, fetchTableOrders]);

  useEffect(() => {
    fetchTables();
    const channelName = `cashier-tables-${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'restaurant_tables' }, fetchTables)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchTables)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sessions' }, fetchTables)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, fetchTables)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchTables]);

  /* ─── Actions ─── */
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
    setSelectedId(null);
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

  /* ─── Selected table data ─── */
  const selectedTable = floorTables.find(t => t.id === selectedId);
  const selectedDbTable = dbTables.find(t => t.id === selectedId);
  const selectedMeta = selectedDbTable ? getTableMeta(selectedDbTable) : null;

  /* ─── Render ─── */
  return (
    <div className="-m-6 lg:-m-8 flex flex-col" style={{ height: 'calc(100vh - 73px)' }}>
      {/* ─── Top Stats Bar ─── */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/[0.04] bg-[#08080a]/60 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
              <Utensils size={16} className="text-gold" />
            </div>
            <div>
              <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest leading-none">Tables</p>
              <p className="text-sm text-white font-semibold">{stats.occupied}<span className="text-white/20">/{stats.total}</span></p>
            </div>
          </div>

          <div className="w-px h-6 bg-white/[0.06]" />

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stats.alerts > 0 ? 'bg-red-500/10' : 'bg-white/[0.03]'}`}>
              <BellRing size={16} className={stats.alerts > 0 ? 'text-red-400 animate-pulse' : 'text-white/20'} />
            </div>
            <div>
              <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest leading-none">Alerts</p>
              <p className={`text-sm font-semibold ${stats.alerts > 0 ? 'text-red-400' : 'text-white/40'}`}>{stats.alerts}</p>
            </div>
          </div>

          <div className="w-px h-6 bg-white/[0.06]" />

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stats.reserved > 0 ? 'bg-gold/10' : 'bg-white/[0.03]'}`}>
              <Calendar size={16} className={stats.reserved > 0 ? 'text-gold' : 'text-white/20'} />
            </div>
            <div>
              <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest leading-none">Reserved</p>
              <p className={`text-sm font-semibold ${stats.reserved > 0 ? 'text-gold' : 'text-white/40'}`}>{stats.reserved}</p>
            </div>
          </div>

          <div className="w-px h-6 bg-white/[0.06]" />

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest leading-none">Free</p>
              <p className="text-sm text-emerald-400 font-semibold">{stats.available}</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="hidden lg:flex items-center gap-3">
          {legendItems.map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${item.color} ${item.pulse ? 'animate-pulse' : ''}`} />
              <span className="text-[10px] text-white/35 font-mono">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Floor Plan ─── */}
      <div className="flex-1 relative overflow-hidden">
        {dbError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#060608]">
            <div className="max-w-sm p-8 rounded-2xl bg-[#0c0c10] border border-red-500/20 text-center space-y-4">
              <BellRing size={28} className="text-red-400 animate-pulse mx-auto" />
              <h3 className="text-base font-serif italic text-white">Database Setup Required</h3>
              <p className="text-xs text-white/50 leading-relaxed">{dbError}</p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-[#0a0a0d]">
            <div className="relative w-full h-full max-w-[1200px] max-h-[calc(100vh-160px)]" style={{ aspectRatio: '1350 / 1050' }}>
              {/* Floor plan image */}
              <img
                src={FLOOR_PLAN_IMAGE}
                alt="SUGI Floor Plan"
                className="absolute inset-0 w-full h-full object-contain rounded-xl select-none pointer-events-none"
                draggable={false}
                style={{ filter: 'brightness(0.92) contrast(1.05)' }}
              />

              {/* Table hotspots */}
              {floorTables.map((table) => {
                const dbTable = dbTables.find(t => t.id === table.id);
                const meta = getTableMeta(dbTable);
                const isSelected = selectedId === table.id;
                const isAlert = dbTable?.call_waiter || dbTable?.status === 'billing';
                const tableRes = tableReservations[table.id] || [];
                const hasReservation = tableRes.length > 0;

                return (
                  <button
                    key={table.id}
                    onClick={() => setSelectedId(isSelected ? null : table.id)}
                    className="absolute group focus:outline-none"
                    style={{
                      left: `${table.x}%`,
                      top: `${table.y}%`,
                      width: `${table.w}%`,
                      height: `${table.h}%`,
                    }}
                  >
                    {/* Selection highlight ring */}
                    {isSelected && (
                      <motion.div
                        layoutId="table-selection"
                        className="absolute -inset-1 rounded-xl border-2 border-gold/60 bg-gold/[0.06]"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    
                    {/* Reserved empty table glow */}
                    {hasReservation && dbTable?.status === 'empty' && !isSelected && (
                      <div className="absolute inset-0 rounded-xl border border-gold/40 shadow-[0_0_15px_rgba(212,175,55,0.15)] pointer-events-none" />
                    )}

                    {/* Status badge */}
                    <span
                      className={`
                        absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10
                        flex flex-col items-center justify-center
                        py-1 px-2 md:px-3 rounded-xl
                        text-[9px] font-black tracking-wider leading-none
                        ring-1 shadow-lg backdrop-blur-sm
                        transition-all duration-300
                        md:text-[11px]
                        ${meta.bg} ${meta.ring} ${meta.text}
                        ${isSelected ? 'scale-110 ring-2 ring-gold/60 shadow-gold/20' : 'group-hover:scale-105'}
                      `}
                    >
                      <span className="font-bold">{table.label}</span>
                      {activeSessionsOrders[table.id]?.total > 0 && (
                        <span className="text-[7.5px] md:text-[9.5px] font-mono text-gold mt-0.5 whitespace-nowrap opacity-90">
                          {activeSessionsOrders[table.id].total.toFixed(0)} MAD
                        </span>
                      )}
                    </span>

                    {/* Reservation indicator */}
                    {hasReservation && (
                      <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gold text-black px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider whitespace-nowrap shadow-lg">
                        {tableRes[0].time} • {tableRes[0].name.split(' ')[0]}
                      </span>
                    )}

                    {/* Pulsing alert dot */}
                    {dbTable && dbTable.status !== 'empty' && (
                      <span
                        className={`
                          absolute z-20 rounded-full
                          w-2.5 h-2.5 md:w-3 md:h-3
                          border border-[#0a0a0d]
                          ${meta.dot}
                          ${meta.pulse ? 'animate-pulse shadow-lg' : ''}
                        `}
                        style={{
                          top: 'calc(50% - 16px)',
                          left: 'calc(50% + 10px)',
                        }}
                      />
                    )}

                    {/* Alert glow */}
                    {isAlert && (
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full animate-ping opacity-20 bg-red-500 pointer-events-none" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Slide-over Detail Panel ─── */}
        <AnimatePresence>
          {selectedTable && selectedDbTable && selectedMeta && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="absolute top-3 right-3 bottom-3 w-[300px] z-30 bg-[#0c0c10]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
            >
              {/* Panel header */}
              <div className="p-5 pb-4 border-b border-white/[0.06]">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-2xl font-serif italic text-white tracking-tight">{selectedTable.label}</h3>
                    <p className="text-[10px] text-white/25 font-mono uppercase tracking-widest mt-0.5">
                      {selectedTable.zone} · {selectedTable.seats} seats
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/30 hover:text-white/60 transition-all"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Status badge */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ring-1 text-[10px] font-bold uppercase tracking-widest ${selectedMeta.bg} ${selectedMeta.ring} ${selectedMeta.text}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${selectedMeta.dot} ${selectedMeta.pulse ? 'animate-pulse' : ''}`} />
                  {selectedMeta.label}
                </div>
              </div>

              {/* Panel body */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                {/* Reservations for this table */}
                {tableReservations[selectedDbTable.id] && tableReservations[selectedDbTable.id].length > 0 && (
                  <div className="space-y-3">
                    {tableReservations[selectedDbTable.id].map(res => (
                      <div key={res.id} className="rounded-xl border border-gold/20 bg-gold/[0.04] p-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                          <Calendar size={40} />
                        </div>
                        <div className="relative z-10 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-gold font-serif italic text-lg">{res.name}</p>
                              <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest">{res.code}</p>
                            </div>
                            <div className="flex gap-2 text-gold/80">
                              <span className="flex items-center gap-1 text-[11px] font-bold"><Clock size={12}/> {res.time}</span>
                              <span className="flex items-center gap-1 text-[11px] font-bold"><Users size={12}/> {res.guests}</span>
                            </div>
                          </div>
                          
                          {(res.occasion || res.notes) && (
                            <div className="pt-3 border-t border-gold/10 space-y-2">
                              {res.occasion && <p className="text-[11px] text-gold/60"><span className="font-bold">Occasion:</span> {res.occasion}</p>}
                              {res.notes && <p className="text-[11px] text-white/50 italic">"{res.notes}"</p>}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Call waiter action */}
                {selectedDbTable.call_waiter && (
                  <button
                    onClick={() => handleClearWaiterFlag(selectedDbTable.id)}
                    disabled={isUpdating}
                    className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/15 text-red-400 border border-red-500/20 hover:border-red-500/30 transition-all text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <BellRing size={13} className="animate-bounce" />
                    Clear Waiter Call
                  </button>
                )}

                {/* Orders summary */}
                {selectedDbTable.status !== 'empty' && tableOrders.length > 0 && (
                  <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-white/[0.04] bg-white/[0.01]">
                      <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Meals & Orders</span>
                    </div>
                    <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                      {tableOrders.map((order, idx) => (
                        <div key={order.id} className="border-b border-white/[0.04] last:border-b-0 pb-3 last:pb-0">
                          <div className="flex items-center justify-between text-[9px] text-white/30 font-mono uppercase mb-2">
                            <span>Order #{idx + 1}</span>
                            <span className="text-white/40">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          
                          <div className="space-y-2 mb-2">
                            {order.items?.map((item: any, itemIdx: number) => (
                              <div key={itemIdx} className="flex justify-between text-xs leading-normal">
                                <span className="text-white/75 pr-2">
                                  {item.quantity}x {item.name} {item.portion ? `(${item.portion.name})` : ''}
                                </span>
                                <span className="text-gold/90 font-mono text-[11px] tabular-nums whitespace-nowrap">
                                  {(parseFloat(item.price.toString().replace(/[^0-9.]/g, '')) * item.quantity).toFixed(2)} MAD
                                </span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex justify-between text-[11px] font-semibold pt-1.5 border-t border-white/[0.02] mt-2">
                            <span className="text-white/40">Subtotal</span>
                            <span className="text-gold font-mono tabular-nums">{Number(order.total_price).toFixed(2)} MAD</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-3 border-t border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
                      <span className="text-xs text-white/70 font-semibold">Total Bill</span>
                      <span className="text-base text-gold font-bold font-mono tabular-nums">
                        {tableOrders.reduce((sum, o) => sum + (Number(o.total_price) || 0), 0).toFixed(2)} MAD
                      </span>
                    </div>
                  </div>
                )}

                {/* Empty state */}
                {selectedDbTable.status === 'empty' && (
                  <div className="py-8 text-center">
                    <div className="w-10 h-10 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto mb-3">
                      <Users size={18} className="text-white/15" />
                    </div>
                    <p className="text-xs text-white/25 font-serif italic">No active session</p>
                  </div>
                )}
              </div>

              {/* Panel footer */}
              <div className="p-4 border-t border-white/[0.06] bg-black/20">
                <button
                  onClick={() => handleToggleSeated(selectedDbTable.id, selectedDbTable.status)}
                  disabled={isUpdating}
                  className={`w-full py-3 rounded-xl transition-all text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 ${
                    selectedDbTable.status === 'empty'
                      ? 'bg-gold text-black hover:brightness-110 active:scale-[0.98]'
                      : 'bg-white/[0.04] text-white/50 border border-white/[0.08] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20'
                  }`}
                >
                  {selectedDbTable.status === 'empty' ? (
                    <>
                      <Users size={14} />
                      {tableReservations[selectedDbTable.id] ? `Seat ${tableReservations[selectedDbTable.id][0].name.split(' ')[0]}` : 'Seat Table'}
                      <ArrowRight size={14} className="ml-1 opacity-50" />
                    </>
                  ) : (
                    <>
                      <Receipt size={14} />
                      Checkout Table
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
