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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: NavTab; labelKey: string }[] = [
    { id: 'home', labelKey: 'nav.home' },
    { id: 'menu', labelKey: 'nav.menu' },
    { id: 'reservations', labelKey: 'nav.reservations' },
    { id: 'location', labelKey: 'nav.contact' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      className={`fixed top-0 left-0 right-0 z-[1200] transition-all duration-700 ${
        isScrolled 
          ? 'h-24 bg-black/80 backdrop-blur-3xl border-b border-white/10 shadow-2xl' 
          : 'h-32 bg-gradient-to-b from-black/80 via-black/40 to-transparent'
      }`}
    >
      <div className="max-w-[1800px] mx-auto h-full flex items-center justify-between px-8 md:px-16">
        {/* LEFT SECTION: Interaction Hub */}
        <div className="flex-1 flex justify-start items-center gap-8">
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button 
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`relative px-6 py-2 text-[10px] transition-all duration-700 font-black rounded-full uppercase tracking-[0.3em] ${
                    isActive ? 'text-gold' : 'text-white/40 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navPillTop"
                      className="absolute inset-0 rounded-full bg-gold/10 border border-gold/20"
                    />
                  )}
                  <span className="relative z-10">{t(item.labelKey)}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* CENTER SECTION: Large Masterpiece Logo */}
        <div className="flex-1 flex justify-center">
          <button 
            onClick={() => { onTabChange('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="relative transition-transform duration-500 hover:scale-105 active:scale-95"
          >
            <div className="relative w-72 h-16 md:w-[32rem] md:h-24">
              <Image 
                src="/media/logo.png" 
                alt="Sugi Sushi Logo" 
                fill 
                className="object-contain brightness-125 contrast-110 drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]" 
                priority 
              />
            </div>
          </button>
        </div>

        {/* RIGHT SECTION: Language & Status */}
        <div className="flex-1 flex items-center justify-end gap-8">
           {/* Status Indicator */}
           <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold/40 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
            </span>
            <span className="text-[8px] font-mono tracking-widest text-white/30 uppercase font-black">Open</span>
          </div>

          <motion.button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-[10px] font-black text-white/40 hover:border-gold/30 hover:text-gold transition-all duration-500"
          >
            {lang === 'en' ? 'AR' : 'EN'}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
