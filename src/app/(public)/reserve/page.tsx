'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Phone, Mail, MessageSquare, Sparkles, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import { OCCASIONS, TIME_SLOTS } from '@/types/reservation';
import { useLanguage } from '@/context/LanguageContext';

export default function ReservePage() {
  const { lang } = useLanguage();
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
      <div className="min-h-screen bg-[#060608] flex items-center justify-center p-6 pb-32">
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

          <Link
            href="/"
            className="inline-block bg-gold text-black px-8 py-4 rounded-full font-bold uppercase tracking-wider text-xs hover:scale-105 active:scale-95 transition-transform"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#060608] py-8 md:py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-white/40 hover:text-gold transition-colors mb-8 group"
        >
          <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:border-gold/20">
            <ChevronLeft size={20} />
          </div>
          <span className="text-[10px] uppercase tracking-widest font-black">Back</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-gold font-serif text-5xl md:text-6xl italic tracking-tighter mb-4 shimmer-gold">
            {lang === 'ar' ? 'حجز' : 'Reserve'}
          </h1>
          <p className="text-white/40 text-xs uppercase tracking-[0.4em]">
            {lang === 'ar' ? 'احجز تحفتك الفنية' : 'Book Your Masterpiece'}
          </p>
        </motion.div>

        {/* Contact, Location & Hours Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 text-center sm:text-left"
        >
          {/* Location / Google Maps Link Card */}
          <a
            href="https://maps.app.goo.gl/yPVuU91kChmBAxip6?g_st=iw"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center sm:items-start justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-gold/30 hover:bg-white/[0.04] transition-all duration-500 group cursor-pointer relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-500 shrink-0">
                <MapPin size={18} />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-[9px] text-white/30 uppercase tracking-widest font-black mb-0.5">
                  {lang === 'ar' ? 'الموقع' : 'Location'}
                </p>
                <p className="text-white/80 text-xs font-serif italic">
                  {lang === 'ar' ? 'الرياض، السعودية' : 'Riyadh, Saudi Arabia'}
                </p>
              </div>
            </div>
            
            <div className="mt-5 flex items-center gap-1 text-[10px] text-gold uppercase tracking-widest font-bold group-hover:translate-x-1 transition-all duration-500">
              <span>{lang === 'ar' ? 'افتح الخريطة' : 'View Map'}</span>
              <ChevronRight size={10} className={lang === 'ar' ? 'rotate-180' : ''} />
            </div>

            {/* Subtle background glow on hover */}
            <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-gold/5 rounded-full blur-xl group-hover:bg-gold/10 transition-all duration-500" />
          </a>

          {/* Direct Calling Link Card */}
          <a
            href="tel:+966501335273"
            className="flex flex-col items-center sm:items-start justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-gold/30 hover:bg-white/[0.04] transition-all duration-500 group cursor-pointer relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-500 shrink-0">
                <Phone size={18} />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-[9px] text-white/30 uppercase tracking-widest font-black mb-0.5">
                  {lang === 'ar' ? 'اتصل بنا' : 'Call Us'}
                </p>
                <p className="text-white/80 text-xs font-mono">
                  +966 50 133 5273
                </p>
              </div>
            </div>
            
            <div className="mt-5 flex items-center gap-1 text-[10px] text-gold uppercase tracking-widest font-bold group-hover:translate-x-1 transition-all duration-500">
              <span>{lang === 'ar' ? 'اتصل الآن' : 'Call Now'}</span>
              <ChevronRight size={10} className={lang === 'ar' ? 'rotate-180' : ''} />
            </div>

            {/* Subtle background glow on hover */}
            <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-gold/5 rounded-full blur-xl group-hover:bg-gold/10 transition-all duration-500" />
          </a>

          {/* Opening Hours Display Card */}
          <div
            className="flex flex-col items-center sm:items-start justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">
                <Clock size={18} />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-[9px] text-white/30 uppercase tracking-widest font-black mb-0.5">
                  {lang === 'ar' ? 'أوقات العمل' : 'Opening Hours'}
                </p>
                <p className="text-white/80 text-xs font-mono">
                  {lang === 'ar' ? '١٢:٣٠ م - ١:٣٠ ص' : '12:30 PM - 1:30 AM'}
                </p>
              </div>
            </div>
            
            <div className="mt-5 text-[9px] text-white/30 uppercase tracking-widest font-black">
              {lang === 'ar' ? 'كل الأيام' : 'Daily'}
            </div>

            {/* Subtle background glow */}
            <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-white/[0.01] rounded-full blur-xl" />
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-6 pb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-white/30 text-[9px] uppercase tracking-[0.2em] font-black mb-3 pl-1">Name *</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors">
                  <Users size={16} />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 focus:bg-white/[0.05] transition-all"
                  placeholder="Your name"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-white/30 text-[9px] uppercase tracking-[0.2em] font-black mb-3 pl-1">Phone *</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors">
                  <Phone size={16} />
                </div>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 focus:bg-white/[0.05] transition-all"
                  placeholder="050 000 0000"
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <label className="block text-white/30 text-[9px] uppercase tracking-[0.2em] font-black mb-3 pl-1">Email</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors">
                <Mail size={16} />
              </div>
              <input
                type="email"
                name="email"
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 focus:bg-white/[0.05] transition-all"
                placeholder="luxury@experience.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-white/30 text-[9px] uppercase tracking-[0.2em] font-black mb-3 pl-1">Date *</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors">
                  <Calendar size={16} />
                </div>
                <input
                  type="date"
                  name="date"
                  required
                  min={minDate}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-gold/30 focus:bg-white/[0.05] transition-all [color-scheme:dark] appearance-none"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-white/30 text-[9px] uppercase tracking-[0.2em] font-black mb-3 pl-1">Time *</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors">
                  <Clock size={16} />
                </div>
                <select
                  name="time"
                  required
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-gold/30 focus:bg-white/[0.05] transition-all appearance-none cursor-pointer"
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
              <label className="block text-white/30 text-[9px] uppercase tracking-[0.2em] font-black mb-3 pl-1">Number of Guests *</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors">
                  <Users size={16} />
                </div>
                <select
                  name="guests"
                  required
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-gold/30 focus:bg-white/[0.05] transition-all appearance-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative">
              <label className="block text-white/30 text-[9px] uppercase tracking-[0.2em] font-black mb-3 pl-1">Occasion</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors">
                  <Sparkles size={16} />
                </div>
                <select
                  name="occasion"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-gold/30 focus:bg-white/[0.05] transition-all appearance-none cursor-pointer"
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
            <label className="block text-white/30 text-[9px] uppercase tracking-[0.2em] font-black mb-3 pl-1">Special Requests</label>
            <div className="relative group">
              <div className="absolute left-5 top-4 text-white/20 group-focus-within:text-gold transition-colors">
                <MessageSquare size={16} />
              </div>
              <textarea
                name="notes"
                rows={4}
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 focus:bg-white/[0.05] transition-all resize-none"
                placeholder="Any special requests or dietary requirements..."
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-[10px] text-center font-bold uppercase tracking-widest"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-black rounded-2xl py-5 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_20px_40px_rgba(212,175,55,0.15)]"
          >
            {loading ? 'Processing...' : 'Request Reservation'}
          </button>
        </motion.form>
      </div>
    </div>
  );
}