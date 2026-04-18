'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { NavTab } from './BottomNav';

interface NavbarProps {
  onTabChange: (tab: NavTab) => void;
  activeTab: NavTab;
}

/**
 * MASTERPIECE NAVIGATION — The Floating Horizon
 * 
 * Features:
 * - Adaptive glassmorphism depth
 * - Magnetic interaction feedback
 * - Cinematic branding transition
 */

export default function Navbar({ onTabChange, activeTab }: NavbarProps) {
  const { lang, setLang, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  
  const navWidth = useTransform(scrollY, [0, 150], ['100%', '90%']);
  const navY = useTransform(scrollY, [0, 150], [0, 24]);
  const containerOpacity = useTransform(scrollY, [0, 100], [0.8, 1]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: NavTab; labelKey: string }[] = [
    { id: 'menu', labelKey: 'nav.menu' },
    { id: 'reservations', labelKey: 'nav.reservations' },
    { id: 'location', labelKey: 'nav.contact' },
  ];

  return (
    <motion.header
      style={{ width: navWidth, y: navY, opacity: containerOpacity }}
      className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] h-24 md:h-32 flex items-center justify-center pointer-events-none"
    >
      <motion.div 
        className={`w-full max-w-7xl h-16 md:h-20 rounded-[2rem] flex items-center justify-between px-8 md:px-12 pointer-events-auto transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] ${
          isScrolled 
            ? 'bg-black/60 backdrop-blur-3xl border border-white/[0.08] shadow-[0_30px_60px_rgba(0,0,0,0.6)]' 
            : 'bg-transparent border border-transparent'
        }`}
      >
        {/* Cinematic Branding */}
        <button 
          onClick={() => { onTabChange('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-4 group"
        >
          <motion.div 
            className="relative w-8 h-8 md:w-10 md:h-10 opacity-90 mix-blend-screen"
            whileHover={{ scale: 1.15, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
          >
            <Image src="/media/optimized/brand-logo.png" alt="Sugi Logo" fill className="object-contain" priority />
            <motion.div 
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-gold blur-xl -z-10" 
            />
          </motion.div>
          <div className="hidden sm:flex flex-col">
            <span className="text-white text-[11px] md:text-[13px] font-serif tracking-[0.6em] leading-none font-light">SUGI</span>
            <span className="text-gold/30 text-[8px] tracking-[0.4em] font-mono uppercase leading-none mt-1.5 font-black">Experience</span>
          </div>
        </button>

        {/* The Navigation Hub */}
        <nav className="hidden md:flex items-center bg-white/[0.02] border border-white/[0.05] rounded-full p-1.5 gap-1 shadow-inner">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`relative px-6 lg:px-10 py-3 text-[10px] transition-all duration-700 font-black rounded-full overflow-hidden group ${
                  lang === 'ar' ? 'tracking-normal text-[12px]' : 'tracking-[0.4em]'
                } ${
                  isActive ? 'text-gold' : 'text-white/20 hover:text-white/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navPill"
                    className="absolute inset-0 rounded-full bg-gold/[0.08] border border-gold/20 shadow-[0_0_20px_rgba(212,175,55,0.1)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 uppercase">{t(item.labelKey)}</span>
                
                {/* Magnetic Glow Reveal */}
                <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/[0.03] to-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </button>
            );
          })}
        </nav>

        {/* Interaction Group */}
        <div className="flex items-center gap-6">
          {/* Status Indicator: Open State */}
          <div className="hidden lg:flex items-center gap-3 bg-white/[0.03] border border-white/5 px-4 py-2 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold/40 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
            </span>
            <span className="text-mono text-white/20 text-[8px] tracking-widest uppercase font-black">Open Now</span>
          </div>

          <div className="h-6 w-px bg-white/5 hidden md:block" />

          {/* Language Toggle: The Orb */}
          <motion.button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative group flex items-center justify-center w-11 h-11 rounded-full border border-white/[0.1] bg-white/[0.03] overflow-hidden transition-all duration-1000 hover:border-gold/40 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <AnimatePresence mode="wait">
              <motion.span 
                key={lang}
                initial={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                className="relative text-[10px] font-mono font-black text-white/50 group-hover:text-gold transition-colors"
              >
                {lang === 'en' ? 'AR' : 'EN'}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>
    </motion.header>
  );
}
