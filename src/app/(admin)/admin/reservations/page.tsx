'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, XCircle, Clock, Users, Phone, Mail, Calendar, MessageSquare, Sparkles, ChevronLeft } from 'lucide-react';
import { Reservation } from '@/types/reservation';

function ReservationCard({ reservation, onClose, onStatusChange }: {
  reservation: Reservation;
  onClose: () => void;
  onStatusChange: (id: string, status: 'pending' | 'confirmed' | 'cancelled') => void;
}) {
  const [showActions, setShowActions] = useState(false);

  const handleConfirm = () => {
    onStatusChange(reservation.id, 'confirmed');
    onClose();
  };

  const handleCancel = () => {
    onStatusChange(reservation.id, 'cancelled');
    onClose();
  };

  const statusColors = {
    pending: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    confirmed: 'bg-green-500/20 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const statusLabels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0a0a0c] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden"
      >
        <div className={`${reservation.is_seen ? 'bg-white/[0.02]' : 'bg-gold/10'} p-6 border-b border-white/5`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Reservation Code</p>
              <p className="text-gold font-mono text-3xl font-bold">{reservation.code}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border ${statusColors[reservation.status]}`}>
              {statusLabels[reservation.status]}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
              <Users size={20} className="text-gold" />
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest">Guest</p>
              <p className="text-white text-lg font-medium">{reservation.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-white/[0.02] rounded-xl p-4">
              <Calendar size={18} className="text-white/40" />
              <div>
                <p className="text-white/40 text-xs">Date</p>
                <p className="text-white font-medium">{new Date(reservation.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/[0.02] rounded-xl p-4">
              <Clock size={18} className="text-white/40" />
              <div>
                <p className="text-white/40 text-xs">Time</p>
                <p className="text-white font-medium">{reservation.time}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-white/[0.02] rounded-xl p-4">
              <Phone size={18} className="text-white/40" />
              <div>
                <p className="text-white/40 text-xs">Phone</p>
                <p className="text-white font-medium">{reservation.phone}</p>
              </div>
            </div>
            {reservation.email && (
              <div className="flex items-center gap-3 bg-white/[0.02] rounded-xl p-4">
                <Mail size={18} className="text-white/40" />
                <div>
                  <p className="text-white/40 text-xs">Email</p>
                  <p className="text-white font-medium text-sm truncate">{reservation.email}</p>
                </div>
              </div>
            )}
          </div>

          {reservation.occasion && (
            <div className="flex items-center gap-3 bg-white/[0.02] rounded-xl p-4">
              <Sparkles size={18} className="text-gold" />
              <div>
                <p className="text-white/40 text-xs">Occasion</p>
                <p className="text-white font-medium">{reservation.occasion}</p>
              </div>
            </div>
          )}

          {reservation.notes && (
            <div className="flex items-start gap-3 bg-white/[0.02] rounded-xl p-4">
              <MessageSquare size={18} className="text-white/40 mt-1" />
              <div>
                <p className="text-white/40 text-xs mb-1">Notes</p>
                <p className="text-white text-sm">{reservation.notes}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white/[0.02] border-t border-white/5 flex gap-3">
          {reservation.status === 'pending' && (
            <>
              <button
                onClick={handleConfirm}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Check size={18} />
                Confirm
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-4 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors border border-red-500/30"
              >
                <XCircle size={18} />
                Cancel
              </button>
            </>
          )}
          {reservation.status === 'confirmed' && (
            <button
              onClick={handleCancel}
              className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 py-4 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors border border-red-500/30"
            >
              <XCircle size={18} />
              Cancel Reservation
            </button>
          )}
          {reservation.status === 'cancelled' && (
            <button
              onClick={handleConfirm}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Check size={18} />
              Re-confirm
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ReservationItem({ reservation, onClick, onStatusChange }: {
  reservation: Reservation;
  onClick: () => void;
  onStatusChange: (id: string, status: 'pending' | 'confirmed' | 'cancelled') => void;
}) {
  const statusColors = {
    pending: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
    confirmed: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
    cancelled: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${reservation.is_seen ? 'bg-white/[0.03] opacity-60' : 'bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20'} rounded-2xl p-5 cursor-pointer hover:scale-[1.01] transition-all`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-gold font-mono text-xl font-bold">{reservation.code}</p>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColors[reservation.status].bg} ${statusColors[reservation.status].text} border ${statusColors[reservation.status].border}`}>
          {reservation.status}
        </span>
      </div>
      
      <div className="flex items-center gap-2 text-white mb-2">
        <Users size={16} className="text-white/40" />
        <span className="font-medium">{reservation.name}</span>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-white/60">
        <span className="flex items-center gap-1">
          <Calendar size={14} />
          {new Date(reservation.date).toLocaleDateString()}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={14} />
          {reservation.time}
        </span>
        <span className="flex items-center gap-1">
          <Users size={14} />
          {reservation.guests}
        </span>
      </div>
    </motion.div>
  );
}

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

  const unseenCount = reservations.filter(r => !r.is_seen && r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#060608] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <a href="/admin" className="text-white/40 hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </a>
          <div>
            <h1 className="text-gold font-serif text-4xl italic tracking-tighter">Reservations</h1>
            <p className="text-white/40 text-sm">Manage incoming reservations</p>
          </div>
        </div>

        {unseenCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gold/20 border border-gold/30 rounded-2xl p-4 mb-6 flex items-center justify-between"
          >
            <span className="text-gold font-medium">
              {unseenCount} new reservation{unseenCount > 1 ? 's' : ''} waiting
            </span>
            <span className="text-white/60 text-sm">Click to view</span>
          </motion.div>
        )}

        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {(['all', 'pending', 'confirmed', 'cancelled'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                filter === f
                  ? 'bg-gold text-black'
                  : 'bg-white/[0.05] text-white/60 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All' : f} ({reservations.filter(r => f === 'all' || r.status === f).length})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white/[0.03] rounded-2xl h-40 animate-pulse" />
            ))}
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/40 text-lg">No reservations found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReservations.map(reservation => (
              <ReservationItem
                key={reservation.id}
                reservation={reservation}
                onClick={() => {
                  setSelectedReservation(reservation);
                  if (!reservation.is_seen) {
                    handleMarkSeen(reservation.id);
                  }
                }}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

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