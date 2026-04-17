'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { NavTab } from './BottomNav';

interface NavbarProps {
  onTabChange: (tab: NavTab) => void;
  activeTab: NavTab;
}

export default function Navbar({ onTabChange, activeTab }: NavbarProps) {
  const { lang, setLang, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  
  const navWidth = useTransform(scrollY, [0, 120], ['100%', '92%']);
  const navY = useTransform(scrollY, [0, 120], [0, 16]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: NavTab; labelKey: string }[] = [
    { id: 'menu', labelKey: 'nav.menu' },
    { id: 'reservations', labelKey: 'nav.story' },
    { id: 'location', labelKey: 'nav.contact' },
  ];

  return (
    <motion.header
      style={{ width: navWidth, y: navY }}
      className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] h-20 md:h-24 flex items-center justify-center pointer-events-none"
    >
      <motion.div 
        className={`w-full max-w-7xl h-14 md:h-16 rounded-full flex items-center justify-between px-6 md:px-10 pointer-events-auto transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] ${
          isScrolled 
            ? 'bg-black/50 backdrop-blur-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4)]' 
            : 'bg-transparent border border-transparent'
        }`}
      >
        {/* Brand */}
        <button 
          onClick={() => { onTabChange('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-3 group"
        >
          <motion.span 
            className="text-2xl font-serif text-gold"
            whileHover={{ scale: 1.15, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            杉
          </motion.span>
          <div className="hidden sm:flex flex-col">
            <span className="text-white text-[10px] md:text-[11px] font-serif tracking-[0.5em] leading-none">SUGI</span>
            <span className="text-white/20 text-[7px] tracking-[0.3em] font-mono uppercase leading-none mt-0.5">Sushi</span>
          </div>
        </button>

        {/* Navigation Pills */}
        <nav className="hidden md:flex items-center bg-white/[0.03] border border-white/[0.04] rounded-full px-1.5 py-1.5 relative gap-0.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`relative z-10 px-5 lg:px-7 py-2 text-[9px] uppercase transition-all duration-500 font-bold flex items-center gap-2 rounded-full ${
                  lang === 'ar' ? 'tracking-normal text-[11px]' : 'tracking-[0.25em]'
                } ${
                  isActive ? 'text-gold' : 'text-white/30 hover:text-white/60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navPill"
                    className="absolute inset-0 rounded-full bg-gold/[0.08] border border-gold/15"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{t(item.labelKey)}</span>
              </button>
            );
          })}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <motion.button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group flex items-center justify-center w-9 h-9 rounded-full border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-700 hover:border-gold/30"
          >
            <div className="absolute inset-0 bg-gold/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
            <AnimatePresence mode="wait">
              <motion.span 
                key={lang}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="relative text-[9px] font-mono font-bold text-white/40 group-hover:text-gold transition-colors"
              >
                {lang === 'en' ? 'AR' : 'EN'}
              </motion.span>
            </AnimatePresence>
          </motion.button>
          
          {/* Status Indicator */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex gap-1">
              {navItems.map((item) => (
                <motion.div 
                  key={item.id}
                  className={`w-1 h-1 rounded-full transition-all duration-700 ${
                    activeTab === item.id ? 'bg-gold shadow-[0_0_6px_rgba(212,175,55,0.8)]' : 'bg-white/10'
                  }`}
                  animate={activeTab === item.id ? { scale: [1, 1.4, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}
