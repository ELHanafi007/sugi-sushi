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
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  const items = [
    { label: t('nav.menu'), href: '#menu', kanji: '膳' },
    { label: t('nav.story'), href: '#story', kanji: '物語' },
    { label: t('nav.contact'), href: '#contact', kanji: '予約' },
  ];

  return (
    <>
      {/* ─── Header Bar ─── */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 inset-x-0 z-[60] py-4 transition-all duration-700"
      >
        <div 
          className={`container-wide flex items-center justify-between transition-all duration-500 ${
            scrolled ? 'py-3 mt-2 rounded-full bg-bg/60 backdrop-blur-xl border border-white/[0.05] shadow-2xl' : 'py-4'
          }`}
        >
          {/* Brand Mark */}
          <a href="#" className="flex items-center gap-4 group">
            <span className="text-gold font-serif text-3xl leading-none transition-transform duration-500 group-hover:scale-110">
              杉
            </span>
            <div className="flex flex-col">
              <span className="text-[12px] text-text font-serif font-bold tracking-[0.4em] leading-none">SUGI</span>
              <span className="text-[8px] text-gold uppercase tracking-[0.2em] mt-1">{t('nav.cuisine')}</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-12">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3"
              >
                <span className="text-[10px] text-gold/40 font-serif transition-colors duration-300 group-hover:text-gold">
                  {item.kanji}
                </span>
                <span className="text-[11px] text-text-secondary uppercase tracking-[0.2em] font-medium transition-colors duration-300 group-hover:text-gold">
                  {item.label}
                </span>
              </a>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-4 md:gap-8">
            {/* Desktop Language Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full
                         border border-white/[0.06] bg-white/[0.02]
                         text-text-secondary text-[10px] tracking-[0.1em] uppercase font-medium
                         hover:bg-gold/5 hover:border-gold/20 transition-all duration-300"
            >
              <span>{lang === 'en' ? '🇸🇦' : '🇬🇧'}</span>
              <span className="font-serif">{lang === 'en' ? 'عربي' : 'EN'}</span>
            </button>

            {/* Hamburger (Always visible on mobile) */}
            <button
              onClick={() => setOpen(!open)}
              className="w-10 h-10 flex items-center justify-center active:scale-90 transition-transform relative"
              aria-label="Menu"
            >
              <div className="flex flex-col gap-[6px] items-end">
                <motion.span
                  animate={open ? { rotate: 45, y: 7, width: 20 } : { rotate: 0, y: 0, width: 20 }}
                  className="block h-[1px] bg-gold/80 rounded-full origin-center"
                />
                <motion.span
                  animate={open ? { opacity: 0, x: 10 } : { opacity: 0.4, x: 0 }}
                  className="block w-3 h-[1px] bg-gold rounded-full"
                />
                <motion.span
                  animate={open ? { rotate: -45, y: -7, width: 20 } : { rotate: 0, y: 0, width: 14 }}
                  className="block h-[1px] bg-gold/80 rounded-full origin-center"
                />
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* ─── Fullscreen Overlay Menu ─── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-bg/[0.98] backdrop-blur-3xl overflow-hidden"
          >
            {/* Decorative Kanji background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <span className="text-[400px] font-serif text-gold leading-none" style={{ animation: 'kanji-breathe 8s ease-in-out infinite' }}>
                杉
              </span>
            </div>

            <div className="relative z-10 flex flex-col h-full pt-32 pb-12">
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8">
                {items.map((item, i) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center py-4 group"
                  >
                    <span className="text-[12px] text-gold/20 mb-2 font-serif tracking-widest">
                      {item.kanji}
                    </span>
                    <span className="text-text text-3xl font-serif uppercase tracking-[0.3em] group-active:text-gold transition-colors duration-300">
                      {item.label}
                    </span>
                  </motion.a>
                ))}
              </div>

              {/* Language Switch inside Mobile Menu */}
              <div className="flex flex-col items-center gap-8 mb-16">
                 <div className="flex items-center gap-6">
                    <button 
                      onClick={() => { setLang('en'); setOpen(false); }}
                      className={`text-[12px] tracking-widest font-serif ${lang === 'en' ? 'text-gold' : 'text-text-muted/40'}`}
                    >
                      ENGLISH
                    </button>
                    <div className="w-px h-4 bg-white/10" />
                    <button 
                      onClick={() => { setLang('ar'); setOpen(false); }}
                      className={`text-[12px] tracking-widest font-serif ${lang === 'ar' ? 'text-gold' : 'text-text-muted/40'}`}
                    >
                      العربية
                    </button>
                 </div>
              </div>

              <div className="text-center px-10">
                <div className="w-8 h-px bg-gold/20 mx-auto mb-6" />
                <p className="text-[10px] text-text-muted/60 uppercase tracking-[0.5em] font-serif max-w-[240px] mx-auto leading-relaxed">
                  {t('contact.location')}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
