'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, t } = useLanguage();

  // Passive scroll listener — zero jank
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const toggleLang = () => setLang(lang === 'en' ? 'ar' : 'en');

  const links = [
    { label: t('nav.menu'), href: '#menu', kanji: '膳' },
    { label: t('nav.about'), href: '#story', kanji: '物語' },
    { label: t('nav.contact'), href: '#contact', kanji: '連絡' },
  ];

  return (
    <>
      {/* ─── Top Bar ─── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? 'rgba(10, 10, 10, 0.95)'
            : 'rgba(10, 10, 10, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                       border border-border-subtle bg-bg-tertiary/50
                       text-text-muted text-[10px] tracking-wider uppercase
                       active:scale-95 transition-transform"
            aria-label="Toggle language"
          >
            <span className="text-sm leading-none">{lang === 'en' ? '🇸🇦' : '🇬🇧'}</span>
            <span>{lang === 'en' ? 'AR' : 'EN'}</span>
          </button>

          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="text-gold text-lg font-serif leading-none">杉</span>
            <span
              className="text-text-primary/80 text-[10px] uppercase tracking-[0.3em]
                         font-serif"
            >
              Sugi
            </span>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="relative w-10 h-10 flex items-center justify-center
                       active:scale-90 transition-transform"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <div className="flex flex-col gap-[5px]">
              <motion.span
                animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className="block w-5 h-[1px] bg-gold rounded-full origin-center"
              />
              <motion.span
                animate={open ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="block w-3 h-[1px] bg-gold/60 rounded-full"
              />
              <motion.span
                animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className="block w-5 h-[1px] bg-gold rounded-full origin-center"
              />
            </div>
          </button>
        </div>

        {/* Bottom hairline */}
        <div
          className="h-[1px] bg-gradient-to-r from-transparent via-border-subtle to-transparent"
          style={{ opacity: scrolled ? 0.6 : 0.2 }}
        />
      </header>

      {/* ─── Full-Screen Overlay Menu ─── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-[60] bg-bg-primary flex flex-col"
          >
            {/* Ambient background */}
            <div className="absolute inset-0 grain" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-48 h-48 bg-gold-glow blur-[100px] rounded-full" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                  className="group flex flex-col items-center py-6 active:scale-95 transition-transform"
                >
                  {/* Kanji watermark */}
                  <span className="text-[20px] text-gold/10 font-jp mb-2">
                    {link.kanji}
                  </span>
                  {/* Label */}
                  <span
                    className="text-text-primary text-2xl font-serif uppercase
                               tracking-[0.3em] group-active:text-gold transition-colors"
                  >
                    {link.label}
                  </span>
                  {/* Divider */}
                  <div className="w-8 h-[1px] bg-border-subtle mt-3 group-active:w-12 transition-all" />
                </motion.a>
              ))}
            </div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative z-10 pb-12 text-center"
            >
              <div className="w-6 h-[1px] bg-border-subtle mx-auto mb-4" />
              <p className="text-[9px] text-text-dim uppercase tracking-[0.4em] font-serif">
                {t('contact.location')}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
