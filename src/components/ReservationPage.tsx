'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

/**
 * RESERVATION — High-End Booking Experience
 */

export default function ReservationPage() {
  const { t, lang } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '2',
    date: '',
    time: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(lang === 'ar' ? 'تم استلام طلب الحجز بنجاح!' : 'Reservation request received successfully!');
  };

  return (
    <div className="min-h-screen bg-bg relative pt-32 pb-60 overflow-hidden">
      {/* ─── Background Orchestration ─── */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <Image
          src="https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1600&q=80"
          alt="Atmosphere"
          fill
          className="object-cover grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg" />
      </div>

      <div className="container-luxury relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="flex items-center justify-center gap-6 mb-8"
            >
              <div className="w-12 h-px bg-gold/30" />
              <span className="text-mono text-gold/40 text-[10px] tracking-[1em] uppercase font-black">{t('contact.reservation')}</span>
              <div className="w-12 h-px bg-gold/30" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.2 }}
              className="text-white text-5xl md:text-8xl font-serif font-light mb-8 italic"
            >
              Secure Your <span className="text-gold shimmer-gold">Table.</span>
            </motion.h1>
            <p className="text-white/40 text-lg md:text-xl font-serif italic max-w-2xl mx-auto">
              Experience the perfect harmony of tradition and innovation. Join us for an unforgettable culinary journey.
            </p>
          </div>

          {/* Form */}
          <motion.form 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.4 }}
            onSubmit={handleSubmit}
            className="luxury-card rounded-[3rem] p-8 md:p-16 space-y-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Name */}
              <div className="space-y-4">
                <label className="text-mono text-gold/40 text-[10px] uppercase tracking-[0.4em] block">{lang === 'ar' ? 'الاسم' : 'Name'}</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-white font-serif italic outline-none focus:border-gold/40 focus:bg-white/[0.05] transition-all duration-500"
                    placeholder={lang === 'ar' ? 'اسمك الكريم' : 'Your Name'}
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold/40 group-focus-within:w-full transition-all duration-700" />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-4">
                <label className="text-mono text-gold/40 text-[10px] uppercase tracking-[0.4em] block">{lang === 'ar' ? 'الجوال' : 'Phone'}</label>
                <div className="relative group">
                  <input 
                    type="tel" 
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-white font-serif italic outline-none focus:border-gold/40 focus:bg-white/[0.05] transition-all duration-500"
                    placeholder="+966"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold/40 group-focus-within:w-full transition-all duration-700" />
                </div>
              </div>

              {/* Guests */}
              <div className="space-y-4">
                <label className="text-mono text-gold/40 text-[10px] uppercase tracking-[0.4em] block">{lang === 'ar' ? 'عدد الضيوف' : 'Guests'}</label>
                <div className="relative group">
                  <select 
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-white font-serif italic outline-none focus:border-gold/40 focus:bg-white/[0.05] transition-all duration-500 appearance-none cursor-pointer"
                    value={formData.guests}
                    onChange={e => setFormData({...formData, guests: e.target.value})}
                  >
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <option key={n} value={n} className="bg-bg text-white">
                        {n} {lang === 'ar' ? (n === 1 ? 'شخص' : (n === 2 ? 'شخصين' : 'أشخاص')) : (n === 1 ? 'Guest' : 'Guests')}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-gold/40">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              {/* Date Selection — Cinematic Upgrade */}
              <div className="space-y-4">
                <label className="text-mono text-gold/40 text-[10px] uppercase tracking-[0.4em] block">{lang === 'ar' ? 'تاريخ الحجز' : 'Date'}</label>
                <div className="relative group">
                  <input 
                    type="date" 
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-white font-serif italic outline-none focus:border-gold/40 focus:bg-white/[0.05] transition-all duration-500 [color-scheme:dark] cursor-pointer"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold/40 group-focus-within:w-full transition-all duration-700" />
                </div>
              </div>
            </div>

            {/* Time Slot Selection — New Feature */}
            <div className="space-y-8 pt-4">
              <div className="flex items-center gap-6">
                <label className="text-mono text-gold/40 text-[10px] uppercase tracking-[0.4em] block whitespace-nowrap">{lang === 'ar' ? 'وقت الحجز' : 'Preferred Time'}</label>
                <div className="h-px w-full bg-white/5" />
              </div>
              
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setFormData({...formData, time: slot})}
                    className={`py-4 rounded-xl border text-[10px] font-black font-mono transition-all duration-500 ${
                      formData.time === slot
                        ? 'bg-gold border-gold text-black shadow-[0_0_30px_rgba(212,175,55,0.2)]'
                        : 'bg-white/[0.02] border-white/5 text-white/40 hover:border-gold/20 hover:text-white/60'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-12 flex flex-col items-center gap-8 border-t border-white/5">
              <button 
                type="submit"
                disabled={!formData.time || !formData.date || !formData.name}
                className="cta-btn group px-20 py-8 w-full md:w-auto disabled:opacity-30 disabled:pointer-events-none"
              >
                <span className="relative text-white text-[11px] uppercase tracking-[0.6em] font-black group-hover:text-gold group-hover:tracking-[0.8em] transition-all duration-700">
                  {lang === 'ar' ? 'تأكيد الحجز' : 'Confirm Booking'}
                </span>
              </button>
              <div className="flex flex-col items-center gap-2">
                <span className="text-white/10 text-[9px] uppercase tracking-[0.4em] font-black font-mono">
                  {lang === 'ar' ? 'سيتصل بك مسؤول الخدمة لتأكيد الحجز' : 'Concierge will contact you for confirmation'}
                </span>
                <div className="flex items-center gap-4 mt-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,1)]" />
                   <span className="text-gold/30 text-[8px] uppercase tracking-widest font-mono">Priority Booking Active</span>
                </div>
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
