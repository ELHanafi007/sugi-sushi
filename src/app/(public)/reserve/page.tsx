'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Phone, Mail, MessageSquare, Sparkles } from 'lucide-react';
import { OCCASIONS, TIME_SLOTS } from '@/types/reservation';

export default function ReservePage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reservationCode, setReservationCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setReservationCode(data.reservation.code);
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to create reservation');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <Sparkles className="w-10 h-10 text-gold" />
          </div>
          <h1 className="text-gold font-serif text-4xl italic tracking-tighter mb-4">Reserved</h1>
          <p className="text-white/60 mb-8">Your reservation has been received</p>
          
          <div className="bg-white/[0.02] border border-gold/20 rounded-3xl p-8 mb-8">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Reservation Code</p>
            <p className="text-gold font-mono text-5xl font-bold">{reservationCode}</p>
          </div>

          <p className="text-white/40 text-sm mb-8">
            Please save this code. We will contact you shortly to confirm your reservation.
          </p>

          <a
            href="/"
            className="inline-block bg-gold text-black px-8 py-4 rounded-full font-bold uppercase tracking-wider text-xs hover:scale-105 transition-transform"
          >
            Back to Home
          </a>
        </motion.div>
      </div>
    );
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#060608] py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-gold font-serif text-5xl italic tracking-tighter mb-4 shimmer-gold">Reserve</h1>
          <p className="text-white/40 text-sm uppercase tracking-[0.3em]">Book Your Table</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-white/40 text-xs uppercase tracking-widest mb-3 pl-1">Name *</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors">
                  <Users size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 focus:bg-white/[0.04] transition-all"
                  placeholder="Your name"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-white/40 text-xs uppercase tracking-widest mb-3 pl-1">Phone *</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 focus:bg-white/[0.04] transition-all"
                  placeholder="0501234567"
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <label className="block text-white/40 text-xs uppercase tracking-widest mb-3 pl-1">Email</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                name="email"
                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 focus:bg-white/[0.04] transition-all"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-white/40 text-xs uppercase tracking-widest mb-3 pl-1">Date *</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors">
                  <Calendar size={18} />
                </div>
                <input
                  type="date"
                  name="date"
                  required
                  min={minDate}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-gold/30 focus:bg-white/[0.04] transition-all [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-white/40 text-xs uppercase tracking-widest mb-3 pl-1">Time *</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors">
                  <Clock size={18} />
                </div>
                <select
                  name="time"
                  required
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-gold/30 focus:bg-white/[0.04] transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select time</option>
                  {TIME_SLOTS.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-white/40 text-xs uppercase tracking-widest mb-3 pl-1">Number of Guests *</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors">
                  <Users size={18} />
                </div>
                <select
                  name="guests"
                  required
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-gold/30 focus:bg-white/[0.04] transition-all appearance-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative">
              <label className="block text-white/40 text-xs uppercase tracking-widest mb-3 pl-1">Occasion</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors">
                  <Sparkles size={18} />
                </div>
                <select
                  name="occasion"
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-gold/30 focus:bg-white/[0.04] transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select occasion (optional)</option>
                  {OCCASIONS.map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="relative">
            <label className="block text-white/40 text-xs uppercase tracking-widest mb-3 pl-1">Special Requests</label>
            <div className="relative group">
              <div className="absolute left-5 top-4 text-white/20 group-focus-within:text-gold transition-colors">
                <MessageSquare size={18} />
              </div>
              <textarea
                name="notes"
                rows={4}
                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 focus:bg-white/[0.04] transition-all resize-none"
                placeholder="Any special requests or dietary requirements..."
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-black rounded-2xl py-5 font-black uppercase tracking-wider text-xs flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Confirm Reservation'}
          </button>
        </motion.form>
      </div>
    </div>
  );
}