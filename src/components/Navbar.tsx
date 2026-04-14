'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const TimeDisplay = ({ label, timezone }: { label: string, timezone: string }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      setTime(new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(new Date()));
    };
    update();
    const i = setInterval(update, 60000);
    return () => clearInterval(i);
  }, [timezone]);

  return (
    <div className="flex flex-col items-start gap-0.5">
      <span className="text-[7px] uppercase tracking-[0.3em] text-white/30">{label}</span>
      <span className="font-mono text-[10px] text-gold/80">{time}</span>
    </div>
  );
};

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const { scrollY } = useScroll();
  
  // Kinetic behavior: HUD shrinks and blurs more as you scroll
  const width = useTransform(scrollY, [0, 100], ['100%', '95%']);
  const y = useTransform(scrollY, [0, 100], [0, 20]);
  const borderRadius = useTransform(scrollY, [0, 100], [0, 40]);
  const backgroundColor = useTransform(scrollY, [0, 100], ['rgba(5, 5, 5, 0)', 'rgba(255, 255, 255, 0.03)']);

  return (
    <motion.header
      style={{ width, y }}
      className="fixed top-0 left-1/2 -translate-x-1/2 z-[60] px-6 h-24 flex items-center justify-center pointer-events-none"
    >
      <motion.div 
        style={{ borderRadius, backgroundColor }}
        className="w-full max-w-7xl h-16 hud-border flex items-center justify-between px-8 pointer-events-auto transition-all duration-500"
      >
        {/* Left: Brand + Time HUD */}
        <div className="flex items-center gap-12">
          <a href="#" className="flex items-center gap-4 group">
            <span className="text-2xl font-serif text-gold transition-transform duration-500 group-hover:rotate-90">杉</span>
            <div className="h-4 w-px bg-white/10 hidden md:block" />
            <div className="hidden md:flex gap-8">
              <TimeDisplay label="Riyadh" timezone="Asia/Riyadh" />
              <TimeDisplay label="Tokyo" timezone="Asia/Tokyo" />
            </div>
          </a>
        </div>

        {/* Center: Interactive Nav */}
        <nav className="hidden lg:flex items-center gap-12">
          {['menu', 'story', 'contact'].map((item) => (
            <a 
              key={item}
              href={`#${item}`} 
              className="mono-tag !text-[9px] hover:text-white transition-all duration-300 relative group"
            >
              <span className="relative z-10">{t(`nav.${item}`)}</span>
              <motion.span 
                className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" 
              />
            </a>
          ))}
        </nav>

        {/* Right: Controls */}
        <div className="flex items-center gap-6">
          {/* Status Indicator */}
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05]">
            <span className="w-1 h-1 rounded-full bg-gold animate-pulse shadow-[0_0_8px_#e2b714]" />
            <span className="text-[8px] font-mono uppercase tracking-widest text-white/40">Kitchen Live</span>
          </div>

          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="w-10 h-10 rounded-full hud-border flex items-center justify-center hover:bg-gold transition-all duration-500 group"
          >
            <span className="text-[10px] font-mono group-hover:text-black transition-colors">
              {lang === 'en' ? 'AR' : 'EN'}
            </span>
          </button>
        </div>
      </motion.div>
    </motion.header>
  );
}
