'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { NavTab } from './BottomNav';

interface NavbarProps {
  onTabChange: (tab: NavTab) => void;
  activeTab: NavTab;
}

export default function Navbar({ onTabChange, activeTab }: NavbarProps) {
  const { lang, setLang, t } = useLanguage();
  const { scrollY } = useScroll();
  
  const width = useTransform(scrollY, [0, 100], ['100%', '94%']);
  const y = useTransform(scrollY, [0, 100], [0, 24]);
  const backgroundColor = useTransform(scrollY, [0, 100], ['rgba(5, 5, 5, 0)', 'rgba(5, 5, 5, 0.6)']);
  const backdropBlur = useTransform(scrollY, [0, 100], [0, 20]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.1]);

  const navItems: { id: NavTab; labelKey: string }[] = [
    { id: 'menu', labelKey: 'nav.menu' },
    { id: 'reservations', labelKey: 'nav.story' }, // Reusing keys or using fixed labels
    { id: 'location', labelKey: 'nav.contact' },
  ];

  return (
    <motion.header
      style={{ width, y }}
      className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] h-20 md:h-24 flex items-center justify-center pointer-events-none"
    >
      <motion.div 
        style={{ 
          backgroundColor, 
          backdropFilter: `blur(${backdropBlur}px)`,
          borderColor: `rgba(255, 255, 255, ${borderOpacity})`
        }}
        className="w-full max-w-7xl h-14 md:h-16 rounded-full border border-transparent flex items-center justify-between px-8 md:px-12 pointer-events-auto transition-all duration-1000 ease-expo"
      >
        {/* Brand */}
        <button onClick={() => onTabChange('home')} className="flex items-center gap-4 group">
          <span className="text-2xl font-serif text-gold transition-transform duration-700 group-hover:scale-110">杉</span>
          <span className="text-white text-[10px] md:text-[12px] font-serif tracking-[0.6em] ml-2 hidden sm:block">SUGI SUSHI</span>
        </button>

        {/* Navigation */}
        <nav className="hidden md:flex items-center bg-white/[0.03] border border-white/5 rounded-full px-1 py-1 relative">
          {/* Active Pill Indicator */}
          <motion.div
            className="absolute h-[80%] rounded-full bg-gold/10 border border-gold/20"
            initial={false}
            animate={{
              width: activeTab === 'home' || activeTab === 'gallery' ? 0 : 'calc(33.33% - 4px)',
              x: activeTab === 'menu' ? 0 : activeTab === 'reservations' ? '100%' : activeTab === 'location' ? '200%' : 0,
              opacity: (activeTab === 'home' || activeTab === 'gallery') ? 0 : 1
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ 
              width: 'calc(33.33% - 4px)',
              left: '4px'
            }}
          />

          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative z-10 px-6 py-2 text-[9px] uppercase transition-all duration-700 font-bold flex items-center gap-2 group ${
                lang === 'ar' ? 'tracking-normal text-[11px]' : 'tracking-[0.3em]'
              } ${
                activeTab === item.id ? 'text-gold' : 'text-white/40 hover:text-white/80'
              }`}
            >
              <span className="relative">
                {t(item.labelKey)}
              </span>
            </button>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-4">
           <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="relative group flex items-center justify-center w-10 h-10 rounded-full border border-white/5 bg-white/[0.02] overflow-hidden transition-all duration-700 hover:border-gold/50"
          >
            <div className="absolute inset-0 bg-gold/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative text-[9px] font-mono font-bold text-white/40 group-hover:text-gold transition-colors">
              {lang === 'en' ? 'AR' : 'EN'}
            </span>
          </button>
          
          <div className="hidden sm:flex flex-col items-end gap-0.5">
            <div className="flex gap-1">
              <div className={`w-1 h-1 rounded-full transition-colors duration-1000 ${activeTab === 'home' ? 'bg-gold' : 'bg-white/10'}`} />
              <div className={`w-1 h-1 rounded-full transition-colors duration-1000 ${activeTab === 'menu' ? 'bg-gold' : 'bg-white/10'}`} />
              <div className={`w-1 h-1 rounded-full transition-colors duration-1000 ${activeTab === 'reservations' ? 'bg-gold' : 'bg-white/10'}`} />
            </div>
            <span className="text-[6px] text-white/20 uppercase tracking-[0.3em]">Status: Live</span>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}
