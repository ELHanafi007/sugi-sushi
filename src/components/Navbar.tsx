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
  
  const navWidth = useTransform(scrollY, [0, 150], ['100%', '94%']);
  const navY = useTransform(scrollY, [0, 150], [0, 20]);
  const containerOpacity = useTransform(scrollY, [0, 100], [1, 1]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
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
      className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] h-32 md:h-48 flex items-center justify-center pointer-events-none"
    >
      <motion.div 
        className={`w-full max-w-7xl h-24 md:h-36 rounded-[2.5rem] flex items-center justify-between px-6 md:px-10 pointer-events-auto transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] ${
          isScrolled 
            ? 'bg-black/40 backdrop-blur-3xl border border-white/[0.08] shadow-[0_30px_60px_rgba(0,0,0,0.4)]' 
            : 'bg-transparent border border-transparent'
        }`}
      >
        {/* LEFT SECTION: Navigation Hub (Desktop only) or Spacer (Mobile) */}
        <div className="flex-1 flex justify-start">
          <nav className="hidden md:flex items-center bg-white/[0.02] border border-white/[0.05] rounded-full p-1 gap-1 shadow-inner">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button 
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`relative px-5 lg:px-8 py-2.5 text-[9px] transition-all duration-700 font-black rounded-full overflow-hidden group ${
                    lang === 'ar' ? 'tracking-normal text-[11px]' : 'tracking-[0.3em]'
                  } ${
                    isActive ? 'text-gold' : 'text-white/30 hover:text-white/60'
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
                </button>
              );
            })}
          </nav>
        </div>

        {/* CENTER SECTION: The Masterpiece Logo */}
        <div className="flex-1 flex justify-center">
          <button 
            onClick={() => { onTabChange('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="relative group transition-transform duration-500 hover:scale-105 active:scale-95"
          >
            <div className="relative w-80 h-20 md:w-[28rem] md:h-28">
              <Image 
                src="/media/logo.png" 
                alt="Sugi Sushi Logo" 
                fill 
                className="object-contain brightness-125 contrast-110 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]" 
                priority 
              />
            </div>
            {/* Ambient Glow */}
            <motion.div 
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gold/10 blur-3xl -z-10" 
            />
          </button>
        </div>

        {/* RIGHT SECTION: Interaction Group */}
        <div className="flex-1 flex items-center justify-end gap-3 md:gap-6">
          {/* Status Indicator */}
          <div className="hidden lg:flex items-center gap-2.5 bg-white/[0.03] border border-white/5 px-3.5 py-1.5 rounded-full">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold/40 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gold"></span>
            </span>
            <span className="text-mono text-white/30 text-[7px] tracking-widest uppercase font-black">Open</span>
          </div>

          <div className="h-5 w-px bg-white/10 hidden md:block" />

          {/* Language Toggle */}
          <motion.button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group flex items-center justify-center w-10 h-10 rounded-full border border-white/[0.1] bg-white/[0.03] overflow-hidden transition-all duration-700 hover:border-gold/30"
          >
            <AnimatePresence mode="wait">
              <motion.span 
                key={lang}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="relative text-[9px] font-mono font-black text-white/40 group-hover:text-gold transition-colors"
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
