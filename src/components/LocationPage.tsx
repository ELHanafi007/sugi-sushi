'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function LocationPage() {
  const { t, lang } = useLanguage();

  return (
    <div className="min-h-screen bg-bg pt-32 pb-40 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-full md:w-2/3 h-[60vh] md:h-screen pointer-events-none z-0">
        <Image
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80"
          alt="Sugi Location Exterior"
          fill
          className="object-cover opacity-10 contrast-125 [mask-image:linear-gradient(to_left,black,transparent)] md:[mask-image:linear-gradient(to_left,black_20%,transparent)]"
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(212,175,55,0.03),transparent_50%)] pointer-events-none" />

      <div className="container-luxury relative z-10 h-full flex flex-col justify-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          className="max-w-2xl mb-20"
        >
          <span className="section-label mb-6 tracking-[0.8em]">{t('nav.contact')}</span>
          <h1 className="text-display text-white mb-8">
            {t('loc.hero1')}<span className="text-gold italic">{t('loc.hero2')}</span>
          </h1>
          <p className="text-white/50 text-xl font-serif italic leading-relaxed">
            {t('loc.desc')}
          </p>
        </motion.div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="card-glass rounded-3xl p-10 flex flex-col justify-between min-h-[280px] group"
          >
            <div>
              <span className="w-10 h-10 rounded-full bg-gold/[0.08] flex items-center justify-center text-gold mb-8 group-hover:scale-110 transition-transform duration-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </span>
              <h3 className="text-gold/40 text-[10px] uppercase tracking-[0.4em] font-mono font-bold mb-4">{t('loc.label')}</h3>
              <p className="text-white/90 text-2xl font-serif font-light leading-tight mb-2 whitespace-pre-wrap">
                {t('loc.address')}
              </p>
              <p className="text-white/30 text-sm font-mono">{t('loc.city')}</p>
            </div>
            
            <button className="text-left text-white/50 hover:text-gold text-[9px] uppercase font-mono tracking-widest mt-8 transition-colors flex items-center gap-2">
              {t('loc.directions')} <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </button>
          </motion.div>

          {/* Card 2: Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="card-glass rounded-3xl p-10 flex flex-col justify-between min-h-[280px] group"
          >
            <div>
              <span className="w-10 h-10 rounded-full bg-gold/[0.08] flex items-center justify-center text-gold mb-8 group-hover:scale-110 transition-transform duration-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </span>
              <h3 className="text-gold/40 text-[10px] uppercase tracking-[0.4em] font-mono font-bold mb-4">{t('contact.opening')}</h3>
              <ul className="space-y-3">
                <li className="flex justify-between items-baseline border-b border-white/[0.04] pb-2">
                  <span className="text-white/70 font-serif text-lg">{t('loc.mon_thu')}</span>
                  <span className="text-gold/70 font-mono text-sm">{t('loc.t1')}</span>
                </li>
                <li className="flex justify-between items-baseline border-b border-white/[0.04] pb-2">
                  <span className="text-white/70 font-serif text-lg">{t('loc.fri_sat')}</span>
                  <span className="text-gold/70 font-mono text-sm">{t('loc.t2')}</span>
                </li>
                <li className="flex justify-between items-baseline pt-1">
                  <span className="text-white/70 font-serif text-lg">{t('loc.sun')}</span>
                  <span className="text-gold/70 font-mono text-sm">{t('loc.closed')}</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Card 3: Reservations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="card-glass rounded-3xl p-10 flex flex-col justify-between min-h-[280px] group bg-gradient-to-br from-white/[0.03] to-gold/[0.02]"
          >
            <div>
              <span className="w-10 h-10 rounded-full bg-gold/[0.1] flex items-center justify-center text-gold mb-8 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
              </span>
              <h3 className="text-gold/40 text-[10px] uppercase tracking-[0.4em] font-mono font-bold mb-4">{t('contact.reservation')}</h3>
              <p className="text-white/60 font-serif italic mb-6">
                {t('loc.res_desc')}
              </p>
              <p className="text-white text-3xl font-serif font-light">+966 55 000 0000</p>
            </div>
            
            <a href="tel:+966550000000" className="cta-btn mt-8 px-6 py-4 rounded-xl text-[10px] uppercase tracking-widest font-mono text-white/80 hover:text-gold w-full text-center">
              {t('loc.call')}
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
