'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const items = [
    { label: t('nav.menu'), href: '#menu', kanji: '膳' },
    { label: t('nav.story'), href: '#story', kanji: '物語' },
    { label: t('nav.contact'), href: '#contact', kanji: '予約' },
  ];

  return (
    <>
      {/* ─── Header Bar ─── */}
      <header
        className="fixed top-0 inset-x-0 z-50 transition-all duration-700 ease-in-out"
        style={{
          background: scrolled ? 'rgba(5,5,5,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(25px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(25px)' : 'none',
          paddingTop: scrolled ? '0.75rem' : '1.25rem',
          paddingBottom: scrolled ? '0.75rem' : '1.25rem',
          borderBottom: scrolled ? '1px solid rgba(201,168,76,0.1)' : '1px solid transparent',
        }}
      >
        <div className="flex items-center justify-between px-6 max-w-xl mx-auto">
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full
                       border border-gold/15 bg-white/[0.03]
                       text-gold/80 text-[10px] tracking-[0.15em] uppercase font-semibold
                       hover:bg-gold/[0.05] hover:border-gold/30
                       active:scale-95 transition-all duration-300"
          >
            <span className="text-[14px] leading-none mb-0.5">{lang === 'en' ? '🇸🇦' : '🇬🇧'}</span>
            <span className="font-serif">{lang === 'en' ? 'عربي' : 'EN'}</span>
          </button>

          {/* Brand */}
          <div className="flex flex-col items-center">
            <span className="text-gold text-2xl font-serif leading-none tracking-tighter">杉</span>
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: scrolled ? 1 : 0 }}
              className="h-[1px] w-4 bg-gold/30 mt-1"
            />
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 flex items-center justify-center group active:scale-90 transition-transform"
            aria-label="Menu"
          >
            <div className="flex flex-col gap-[6px] items-center">
              <motion.span
                animate={open ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="block w-[20px] h-[1.2px] bg-gold rounded-full origin-center"
              />
              <motion.span
                animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className="block w-3.5 h-[1.2px] bg-gold/50 rounded-full"
              />
              <motion.span
                animate={open ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="block w-[20px] h-[1.2px] bg-gold rounded-full origin-center"
              />
            </div>
          </button>
        </div>
      </header>

      {/* ─── Overlay Menu ─── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] bg-bg-overlay/98 backdrop-blur-3xl"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #c9a84c 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-gold/[0.04] blur-[120px] rounded-full" />

            <div className="relative z-10 flex flex-col h-full">
              {/* Close Button Area (Optional - hamburger stays visible) */}
              <div className="h-20 shrink-0" />

              {/* Nav Items */}
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8">
                {items.map((item, i) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.1 + i * 0.1,
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="group flex flex-col items-center py-6 relative"
                  >
                    <span className="text-[20px] text-gold/10 mb-4 font-serif transition-colors group-hover:text-gold/20">
                      {item.kanji}
                    </span>
                    <span className="text-text text-3xl font-serif uppercase tracking-[0.3em] group-hover:text-gold transition-all duration-500">
                      {item.label}
                    </span>
                    <motion.div
                      className="w-0 h-px bg-gold/30 mt-6 group-hover:w-16 transition-all duration-500"
                    />
                  </motion.a>
                ))}
              </div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="pb-16 text-center"
              >
                <div className="w-8 h-px bg-gold/20 mx-auto mb-6" />
                <p className="text-[10px] text-text-muted/40 uppercase tracking-[0.5em] font-serif">
                  {t('contact.location')}
                </p>
                <p className="text-[8px] text-text-muted/20 uppercase tracking-[0.3em] font-serif mt-3">
                  Experience the perfection
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
