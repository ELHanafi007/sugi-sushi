'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const toggleLang = () => setLang(lang === 'en' ? 'ar' : 'en');

  const menuItems = [
    { label: t('nav.menu'), href: '#menu', icon: '膳' },
    { label: t('nav.story'), href: '#story', icon: '物語' },
    { label: t('nav.reserve'), href: '#reserve', icon: '予約' },
    { label: t('nav.contact'), href: '#contact', icon: '連絡' },
  ];

  return (
    <>
      {/* ===== MOBILE LUXURY HEADER ===== */}
      <nav className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
        <motion.div
          animate={{
            height: scrolled ? 64 : 88,
            backgroundColor: scrolled ? 'rgba(5, 5, 5, 0.92)' : 'rgba(5, 5, 5, 0.85)',
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full pointer-events-auto backdrop-blur-xl"
        >
          {/* Content Row */}
          <div className="h-full flex items-center justify-between px-4 max-w-lg mx-auto">
            
            {/* Language Toggle — Left */}
            <motion.button
              onClick={toggleLang}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              whileTap={{ scale: 0.92 }}
              className="relative w-10 h-10 rounded-full flex items-center justify-center
                         border border-gold/10 bg-white/[0.03] backdrop-blur-md
                         active:border-gold/30 transition-colors duration-300"
              aria-label="Toggle language"
            >
              <motion.span
                animate={{ rotate: lang === 'ar' ? 360 : 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-base select-none"
              >
                {lang === 'en' ? '🇬🇧' : '🇸🇦'}
              </motion.span>
              {/* Active indicator */}
              <motion.div
                animate={{ opacity: lang === 'en' ? 0 : 1 }}
                className="absolute inset-0 rounded-full bg-gold/5"
              />
            </motion.button>

            {/* Center Logo */}
            <motion.div
              animate={{
                scale: scrolled ? 0.75 : 1,
                y: scrolled ? -2 : 0,
              }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-[120px] h-[40px] flex-shrink-0"
            >
              <Image
                src="/media/optimized/enseigne-1.jpg"
                alt="Sugi Sushi"
                fill
                className="object-contain"
                priority
                quality={80}
              />
            </motion.div>

            {/* Hamburger — Right */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              className="relative w-10 h-10 rounded-full flex items-center justify-center
                         border border-gold/10 bg-white/[0.03] backdrop-blur-md
                         active:border-gold/30 transition-colors duration-300"
            >
              <div className="flex flex-col gap-[6px] items-center">
                <motion.div
                  animate={isOpen
                    ? { rotate: 45, y: 6, width: 20 }
                    : { rotate: 0, y: 0, width: 16 }
                  }
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="h-[1px] bg-gold rounded-full"
                />
                <motion.div
                  animate={isOpen
                    ? { opacity: 0, scaleX: 0 }
                    : { opacity: 1, scaleX: 1 }
                  }
                  transition={{ duration: 0.3 }}
                  className="w-3 h-[1px] bg-gold/70 rounded-full"
                />
                <motion.div
                  animate={isOpen
                    ? { rotate: -45, y: -6, width: 20 }
                    : { rotate: 0, y: 0, width: 16 }
                  }
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="h-[1px] bg-gold rounded-full"
                />
              </div>
            </motion.button>
          </div>

          {/* Bottom Gold Line */}
          <motion.div
            animate={{ opacity: scrolled ? 0.4 : 0.15 }}
            className="absolute bottom-0 left-0 right-0 h-[1px] 
                       bg-gradient-to-r from-transparent via-gold/50 to-transparent"
          />
        </motion.div>
      </nav>

      {/* ===== FULL-SCREEN MENU OVERLAY ===== */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[105] bg-background"
          >
            {/* Ambient Background */}
            <div className="absolute inset-0 washi pointer-events-none" />
            <div className="absolute inset-0 vignette opacity-40 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                            w-[300px] h-[300px] bg-gold/[0.03] blur-[100px] rounded-full pointer-events-none" />

            {/* Menu Content */}
            <div className="relative z-10 h-full flex flex-col justify-between px-8 py-24">
              
              {/* Nav Items */}
              <div className="flex flex-col items-center justify-center flex-1 gap-0">
                {menuItems.map((item, idx) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: idx * 0.08 + 0.2,
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="group relative py-6 text-center"
                  >
                    {/* Kanji Icon */}
                    <span className="absolute -left-12 top-1/2 -translate-y-1/2 text-[10px] 
                                     text-gold/15 font-serif opacity-0 group-hover:opacity-100 
                                     transition-opacity duration-500">
                      {item.icon}
                    </span>
                    
                    {/* Label */}
                    <span className="text-foreground text-3xl font-serif uppercase tracking-[0.4em] 
                                     group-hover:text-gold transition-colors duration-500">
                      {item.label}
                    </span>
                    
                    {/* Animated Underline */}
                    <motion.div
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 h-[1px] bg-gold/40"
                      initial={{ width: 0 }}
                      whileHover={{ width: '60%' }}
                      transition={{ duration: 0.4 }}
                    />
                    
                    {/* Number */}
                    <span className="absolute -right-8 top-1/2 -translate-y-1/2 text-[8px] 
                                     text-gold/20 font-serif tracking-widest">
                      0{idx + 1}
                    </span>
                  </motion.a>
                ))}
              </div>

              {/* Footer Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                <p className="text-[9px] text-foreground-dim uppercase tracking-[0.5em] font-serif">
                  {t('location')}
                </p>
                <p className="text-[8px] text-foreground-dim/60 uppercase tracking-[0.4em] font-serif">
                  {t('established')}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
