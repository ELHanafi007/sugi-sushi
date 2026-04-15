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
        <nav className="hidden md:flex items-center gap-12">
          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`text-[9px] uppercase tracking-[0.4em] transition-all duration-500 font-bold ${
                activeTab === item.id ? 'text-gold' : 'text-white/40 hover:text-white/60'
              }`}
            >
              {t(item.labelKey)}
            </button>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-6">
           <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 hover:border-gold/40 transition-all duration-700"
          >
            <span className="text-[9px] font-mono font-bold text-white/40 hover:text-gold">
              {lang === 'en' ? 'AR' : 'EN'}
            </span>
          </button>
          
          <div className="w-1.5 h-1.5 rounded-full bg-gold/40 animate-pulse" />
        </div>
      </motion.div>
    </motion.header>
  );
}
