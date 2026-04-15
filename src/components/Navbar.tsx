'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
    <div className="flex flex-col items-start gap-1">
      <span className="text-[7px] uppercase tracking-[0.4em] text-white/30 font-bold">{label}</span>
      <span className="font-mono text-[10px] text-gold/60 tabular-nums">{time}</span>
    </div>
  );
};

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const { scrollY } = useScroll();
  
  // Kinetic behavior: HUD shrinks and blurs more as you scroll
  const width = useTransform(scrollY, [0, 100], ['100%', '92%']);
  const y = useTransform(scrollY, [0, 100], [0, 32]);
  const borderRadius = useTransform(scrollY, [0, 100], [0, 100]);
  const backdropBlur = useTransform(scrollY, [0, 100], [0, 24]);
  const backgroundColor = useTransform(scrollY, [0, 100], ['rgba(5, 5, 5, 0)', 'rgba(5, 5, 5, 0.4)']);
  const borderColor = useTransform(scrollY, [0, 100], ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.08)']);

  return (
    <motion.header
      style={{ width, y }}
      className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] px-4 h-24 flex items-center justify-center pointer-events-none"
    >
      <motion.div 
        style={{ 
          borderRadius, 
          backgroundColor, 
          borderColor,
          backdropFilter: `blur(${backdropBlur}px)`
        }}
        className="w-full max-w-7xl h-14 md:h-16 border flex items-center justify-between px-6 md:px-10 pointer-events-auto transition-all duration-700 ease-expo shadow-2xl"
      >
        {/* Left: Brand + Time HUD */}
        <div className="flex items-center gap-6 md:gap-12">
          <a href="#" className="flex items-center gap-4 group">
            <span className="text-2xl font-serif text-gold transition-all duration-700 group-hover:scale-110">杉</span>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <div className="hidden sm:flex gap-8">
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
              className="mono-tag !text-[9px] hover:text-white transition-all duration-500 relative group flex flex-col items-center"
            >
              <span className="relative z-10">{t(`nav.${item}`)}</span>
              <motion.span 
                className="absolute -bottom-2 w-0 h-[1.5px] bg-gold transition-all duration-500 group-hover:w-full opacity-60" 
              />
            </a>
          ))}
        </nav>

        {/* Right: Controls */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Status Indicator */}
          <div className="hidden xs:flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05]">
            <span className="w-1 h-1 rounded-full bg-gold animate-pulse shadow-[0_0_8px_#e2b714]" />
            <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-white/40">Kitchen Live</span>
          </div>

          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold hover:border-gold transition-all duration-700 group"
          >
            <span className="text-[9px] font-mono font-bold group-hover:text-black transition-colors">
              {lang === 'en' ? 'AR' : 'EN'}
            </span>
          </button>
        </div>
      </motion.div>
    </motion.header>
  );
}
