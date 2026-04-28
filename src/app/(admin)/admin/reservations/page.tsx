'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, XCircle, Clock, Users, Phone, Mail, Calendar, MessageSquare, Sparkles, Eye, EyeOff } from 'lucide-react';
import { Reservation } from '@/types/reservation';

/* ─── Reservation Detail Modal ─── */
function ReservationCard({ reservation, onClose, onStatusChange }: {
  reservation: Reservation;
  onClose: () => void;
  onStatusChange: (id: string, status: 'pending' | 'confirmed' | 'cancelled') => void;
}) {
  const handleConfirm = () => {
    onStatusChange(reservation.id, 'confirmed');
    onClose();
  };

  const handleCancel = () => {
    onStatusChange(reservation.id, 'cancelled');
    onClose();
  };

  const statusConfig = {
    pending: { bg: 'bg-amber-400/15', text: 'text-amber-400', border: 'border-amber-400/20', label: 'Pending' },
    confirmed: { bg: 'bg-emerald-400/15', text: 'text-emerald-400', border: 'border-emerald-400/20', label: 'Confirmed' },
    cancelled: { bg: 'bg-red-400/15', text: 'text-red-400', border: 'border-red-400/20', label: 'Cancelled' }
  };
  const status = statusConfig[reservation.status];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0a0a0c] border border-white/[0.08] rounded-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/[0.05] flex items-center justify-between">
          <div>
            <p className="text-gold font-mono text-2xl font-bold">{reservation.code}</p>
            <p className="text-white/20 text-[10px] font-mono uppercase tracking-widest mt-0.5">
              {new Date(reservation.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${status.bg} ${status.text} ${status.border}`}>
              {status.label}
            </span>
            <button onClick={onClose} className="p-1.5 rounded-lg text-white/20 hover:text-white/50 hover:bg-white/[0.04] transition-all">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="p-5 space-y-3">
          <DetailRow icon={Users} label="Guest" value={reservation.name} />
          
          <div className="grid grid-cols-2 gap-3">
            <DetailRow icon={Calendar} label="Date" value={new Date(reservation.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} />
            <DetailRow icon={Clock} label="Time" value={reservation.time} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <DetailRow icon={Phone} label="Phone" value={reservation.phone} />
            <DetailRow icon={Users} label="Party Size" value={`${reservation.guests} guests`} />
          </div>

          {reservation.email && (
            <DetailRow icon={Mail} label="Email" value={reservation.email} />
          )}

          {reservation.occasion && (
            <DetailRow icon={Sparkles} label="Occasion" value={reservation.occasion} highlight />
          )}

          {reservation.notes && (
            <DetailRow icon={MessageSquare} label="Notes" value={reservation.notes} />
          )}
        </div>

        {/* Actions */}
        <div className="p-5 bg-white/[0.015] border-t border-white/[0.04] flex gap-2">
          {reservation.status === 'pending' && (
            <>
              <button
                onClick={handleConfirm}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-medium text-[12px] transition-colors"
              >
                <Check size={16} />
                Confirm
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500/15 hover:bg-red-500/25 text-red-400 py-3 rounded-xl font-medium text-[12px] transition-colors border border-red-500/20"
              >
                <XCircle size={16} />
                Decline
              </button>
            </>
          )}
          {reservation.status === 'confirmed' && (
            <button
              onClick={handleCancel}
              className="w-full flex items-center justify-center gap-2 bg-red-500/15 hover:bg-red-500/25 text-red-400 py-3 rounded-xl font-medium text-[12px] transition-colors border border-red-500/20"
            >
              <XCircle size={16} />
              Cancel Reservation
            </button>
          )}
          {reservation.status === 'cancelled' && (
            <button
              onClick={handleConfirm}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-medium text-[12px] transition-colors"
            >
              <Check size={16} />
              Re-confirm
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Detail Row Component ─── */
function DetailRow({ icon: Icon, label, value, highlight }: { icon: any; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
      <Icon size={16} className={highlight ? 'text-gold' : 'text-white/20'} />
      <div className="min-w-0">
        <p className="text-white/20 text-[9px] font-mono uppercase tracking-widest">{label}</p>
        <p className="text-white/80 text-[13px] font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await fetch('/api/reservations');
      const data = await res.json();
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      await fetch('/api/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      fetchReservations();
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  const handleMarkSeen = async (id: string) => {
    try {
      await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markSeen', id }),
      });
      fetchReservations();
    } catch (error) {
      console.error('Error marking reservation seen:', error);
    }
  };

  const filteredReservations = reservations.filter(r => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const counts = {
    all: reservations.length,
    pending: reservations.filter(r => r.status === 'pending').length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
  };

  const unseenCount = reservations.filter(r => !r.is_seen && r.status === 'pending').length;

  const filterTabs = [
    { id: 'all' as const, label: 'All' },
    { id: 'pending' as const, label: 'Pending' },
    { id: 'confirmed' as const, label: 'Confirmed' },
    { id: 'cancelled' as const, label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif italic text-white/90">Reservations</h1>
        <p className="text-white/25 text-[11px] font-mono uppercase tracking-widest mt-1">
          {reservations.length} total — {counts.pending} pending
        </p>
      </div>

      {/* New reservations alert */}
      {unseenCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 rounded-xl bg-gold/[0.06] border border-gold/15"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-gold/80 text-[13px] font-medium">
              {unseenCount} new reservation{unseenCount > 1 ? 's' : ''}
            </span>
          </div>
          <span className="text-white/25 text-[11px]">Click to review</span>
        </motion.div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-white/[0.015] border border-white/[0.06] rounded-xl p-1 overflow-x-auto no-scrollbar">
        {filterTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
              filter === tab.id
                ? 'bg-white/[0.06] text-white/80'
                : 'text-white/25 hover:text-white/45'
            }`}
          >
            {tab.label}
            <span className={`text-[10px] font-mono ${filter === tab.id ? 'text-gold/60' : 'text-white/15'}`}>
              {counts[tab.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Reservations List */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 rounded-xl bg-white/[0.02] animate-pulse" />
          ))}
        </div>
      ) : filteredReservations.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-white/20 text-[13px]">No reservations found</p>
        </div>
      ) : (
        <div className="bg-white/[0.015] border border-white/[0.06] rounded-2xl overflow-hidden divide-y divide-white/[0.03]">
          {filteredReservations.map(reservation => {
            const statusDot = {
              pending: 'bg-amber-400',
              confirmed: 'bg-emerald-400',
              cancelled: 'bg-red-400/50'
            };

            return (
              <motion.div
                key={reservation.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-white/[0.02] transition-colors ${
                  !reservation.is_seen ? 'bg-gold/[0.03]' : ''
                }`}
                onClick={() => {
                  setSelectedReservation(reservation);
                  if (!reservation.is_seen) {
                    handleMarkSeen(reservation.id);
                  }
                }}
              >
                {/* Status dot */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${statusDot[reservation.status]}`} />
                  {!reservation.is_seen && (
                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                  )}
                </div>

                {/* Code */}
                <span className="text-gold/70 font-mono text-[14px] font-bold w-16 flex-shrink-0">
                  {reservation.code}
                </span>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-white/70 font-medium truncate">{reservation.name}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-[11px] text-white/25">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(reservation.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {reservation.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={11} />
                      {reservation.guests}
                    </span>
                  </div>
                </div>

                {/* Status label */}
                <span className={`hidden sm:inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border flex-shrink-0 ${
                  reservation.status === 'pending' ? 'bg-amber-400/10 text-amber-400/70 border-amber-400/15' :
                  reservation.status === 'confirmed' ? 'bg-emerald-400/10 text-emerald-400/70 border-emerald-400/15' :
                  'bg-red-400/10 text-red-400/50 border-red-400/10'
                }`}>
                  {reservation.status}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedReservation && (
          <ReservationCard
            reservation={selectedReservation}
            onClose={() => setSelectedReservation(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
}