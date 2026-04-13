'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
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
        className="fixed top-0 inset-x-0 z-50 transition-[background,backdrop-filter] duration-500"
        style={{
          background: scrolled ? 'rgba(5,5,5,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        }}
      >
        <div className="flex items-center justify-between px-5 py-3 max-w-xl mx-auto">
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                       border border-stroke bg-white/[0.03]
                       text-text-muted text-[9px] tracking-wider uppercase
                       active:scale-95 transition-transform"
          >
            <span className="text-[13px] leading-none">{lang === 'en' ? '🇸🇦' : '🇬🇧'}</span>
            <span>{lang === 'en' ? 'عربي' : 'EN'}</span>
          </button>

          {/* Brand */}
          <div className="flex items-center gap-1.5">
            <span className="text-gold text-xl font-serif leading-none">杉</span>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 flex items-center justify-center active:scale-90 transition-transform"
            aria-label="Menu"
          >
            <div className="flex flex-col gap-[5px] items-center">
              <motion.span
                animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="block w-[18px] h-[1.5px] bg-gold rounded-full origin-center"
              />
              <motion.span
                animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className="block w-3 h-[1.5px] bg-gold/50 rounded-full"
              />
              <motion.span
                animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="block w-[18px] h-[1.5px] bg-gold rounded-full origin-center"
              />
            </div>
          </button>
        </div>

        {/* Bottom line */}
        <div
          className="h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent"
          style={{ opacity: scrolled ? 1 : 0.3 }}
        />
      </header>

      {/* ─── Overlay Menu ─── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-[60] bg-bg-overlay"
          >
            {/* Ambient glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-56 h-56 bg-gold/[0.03] blur-[120px] rounded-full" />

            <div className="relative z-10 flex flex-col h-full">
              {/* Nav Items */}
              <div className="flex-1 flex flex-col items-center justify-center gap-0 px-8">
                {items.map((item, i) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.08 + i * 0.07,
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="group flex flex-col items-center py-8 active:scale-[0.98] transition-transform"
                  >
                    <span className="text-[18px] text-gold/[0.08] mb-3 font-serif">
                      {item.kanji}
                    </span>
                    <span className="text-text text-2xl font-serif uppercase tracking-[0.25em] group-active:text-gold transition-colors">
                      {item.label}
                    </span>
                    <motion.div
                      className="w-8 h-px bg-stroke mt-4 group-active:w-12 transition-all"
                    />
                  </motion.a>
                ))}
              </div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="pb-12 text-center"
              >
                <div className="w-6 h-px bg-stroke mx-auto mb-4" />
                <p className="text-[8px] text-text-muted/40 uppercase tracking-[0.4em] font-serif">
                  {t('contact.location')}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
