'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

/**
 * THE LOCATION — Cinematic Sanctuary (Masterpiece Edition)
 * 
 * Features:
 * - Adaptive glassmorphism cards with high-end elevation
 * - Cinematic focus-blurred exterior visual
 * - Refined typographic orchestration
 */

export default function LocationPage() {
  const { t, lang } = useLanguage();

  return (
    <div className="min-h-screen bg-bg pt-64 pb-[120px] relative overflow-hidden">
      {/* ─── Cinematic Background Canvas ─── */}
      <div className="absolute top-0 right-0 w-full md:w-2/3 h-[70vh] md:h-screen pointer-events-none z-0">
        <Image
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80"
          alt="Sugi Sanctuary"
          fill
          className="object-cover opacity-[0.08] contrast-125 brightness-[0.4] [mask-image:linear-gradient(to_left,black,transparent)] md:[mask-image:linear-gradient(to_left,black_20%,transparent)]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg opacity-100" />
      </div>
      
      {/* Ambient Depth Grains */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(212,175,55,0.04),transparent_60%)] pointer-events-none" />

      <div className="container-luxury relative z-10">
        {/* ─── Header Orchestration ─── */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
          className="max-w-3xl mb-32"
        >
          <div className="flex items-center gap-6 mb-10">
             <div className="w-16 h-[1px] bg-gold/30" />
             <span className="text-mono text-gold/40 text-[10px] tracking-[1em] uppercase font-black">{t('nav.contact')}</span>
          </div>
          
          <h1 className="text-7xl md:text-9xl text-white mb-12 !leading-[0.8] tracking-tightest">
            {t('loc.hero1')}<br />
            <span className="text-gold shimmer-gold italic font-light">{t('loc.hero2')}</span>
          </h1>
          
          <p className="text-white/65 text-xl md:text-2xl font-serif italic leading-relaxed font-light max-w-2xl">
            {t('loc.desc')}
          </p>
        </motion.div>

        {/* ─── Interaction Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Sanctuary Address — Masterpiece Edition */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
            className="luxury-card rounded-[4rem] p-12 flex flex-col justify-between min-h-[420px] group transition-all duration-1000 shadow-2xl"
          >
            <div>
              <div className="w-16 h-16 rounded-3xl bg-gold/[0.08] border border-gold/15 flex items-center justify-center text-gold mb-12 group-hover:scale-110 group-hover:bg-gold/15 transition-all duration-1000 shadow-[0_10px_30px_rgba(212,175,55,0.1)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <h3 className="text-gold/50 text-[10px] uppercase tracking-[0.6em] font-black font-mono mb-8">{t('loc.label')}</h3>
              <p className="text-white text-4xl font-serif font-light leading-tight mb-6 italic tracking-tight">
                {t('loc.address')}
              </p>
              <div className="flex items-center gap-4">
                 <div className="w-8 h-[1px] bg-gold/20" />
                 <p className="text-gold/40 text-[10px] font-mono tracking-[0.4em] uppercase font-black">{t('loc.city')}</p>
              </div>
            </div>
            
            <motion.button 
              whileHover={{ x: 12, color: '#d4af37' }}
              className="text-left text-gold/30 text-[10px] uppercase font-black font-mono tracking-[0.5em] mt-12 transition-all flex items-center gap-6 group/btn"
            >
              {t('loc.map')} <div className="w-12 h-[1px] bg-gold/20 group-hover/btn:w-20 transition-all duration-700" />
            </motion.button>
          </motion.div>

          {/* Temporal Grace — Masterpiece Edition */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className="luxury-card rounded-[4rem] p-12 flex flex-col justify-between min-h-[420px] group shadow-2xl"
          >
            <div>
              <div className="w-16 h-16 rounded-3xl bg-gold/[0.08] border border-gold/15 flex items-center justify-center text-gold mb-12 group-hover:scale-110 transition-all duration-1000">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <h3 className="text-gold/50 text-[10px] uppercase tracking-[0.6em] font-black font-mono mb-10">{t('contact.opening')}</h3>
              <div className="space-y-8">
                <div className="flex justify-between items-end border-b border-white/5 pb-6 group-hover:border-gold/20 transition-all duration-700">
                  <div className="flex flex-col gap-1">
                    <span className="text-white text-2xl font-serif italic">{t('loc.mon_thu')}</span>
                    <span className="text-white/10 text-[8px] uppercase tracking-widest font-mono">{t('loc.weekdays')}</span>
                  </div>
                  <span className="text-gold shimmer-gold font-mono text-sm font-black">{t('loc.t1')}</span>
                </div>
                <div className="flex justify-between items-end border-b border-white/5 pb-6 group-hover:border-gold/20 transition-all duration-700">
                  <div className="flex flex-col gap-1">
                    <span className="text-white text-2xl font-serif italic">{t('loc.fri_sat')}</span>
                    <span className="text-white/10 text-[8px] uppercase tracking-widest font-mono">{t('loc.weekend')}</span>
                  </div>
                  <span className="text-gold shimmer-gold font-mono text-sm font-black">{t('loc.t2')}</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <span className="text-white/15 font-serif text-2xl italic">{t('loc.sun')}</span>
                  <span className="text-gold/15 font-mono text-[9px] uppercase tracking-[0.4em] font-black">{t('loc.closed')}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Personal Reservation — Masterpiece Edition */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="luxury-card rounded-[4rem] p-12 flex flex-col justify-between min-h-[420px] group relative overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-3xl bg-gold/[0.08] border border-gold/15 flex items-center justify-center text-gold mb-12 group-hover:scale-110 transition-all duration-1000 shadow-[0_15px_40px_rgba(212,175,55,0.15)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
              </div>
              <h3 className="text-gold/50 text-[10px] uppercase tracking-[0.6em] font-black font-mono mb-8">{t('contact.reservation')}</h3>
              <p className="text-white/70 font-serif text-xl italic mb-10 leading-relaxed font-light">
                {t('loc.res_desc')}
              </p>
              <div className="space-y-2">
                <p className="text-white/20 text-[9px] font-mono tracking-[0.4em] uppercase font-black">{t('loc.concierge')}</p>
                <p className="text-white text-5xl md:text-6xl font-serif font-light tracking-tightest group-hover:text-gold transition-colors duration-1000">
                  +966 <span className="text-[0.7em] shimmer-gold">55 000 0000</span>
                </p>
              </div>
            </div>
            
            <motion.a 
              whileHover={{ scale: 1.02, backgroundColor: '#fff' }}
              whileTap={{ scale: 0.98 }}
              href="tel:+966550000000" 
              className="relative z-10 mt-14 px-10 py-6 rounded-2xl bg-gold text-black text-[11px] uppercase tracking-[0.7em] font-black font-mono text-center transition-all duration-700 shadow-[0_25px_50px_rgba(212,175,55,0.25)]"
            >
              {t('loc.call')}
            </motion.a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
