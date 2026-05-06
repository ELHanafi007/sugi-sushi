'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { useLanguage, NavTab } from '@/context/LanguageContext';

interface HeroProps {
  onTabChange: (tab: NavTab) => void;
}

export default function Hero({ onTabChange }: HeroProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section 
      ref={containerRef} 
      className="relative h-[100vh] w-full flex items-center justify-center overflow-hidden bg-bg"
    >
      {/* ─── Cinematic Background ─── */}
      <motion.div 
        style={{ opacity }}
        className="absolute inset-0 z-0"
      >
        <motion.div
          style={{ y: imageY }}
          className="absolute inset-0 w-full h-[120%] -top-[10%]"
        >
          <Image
            src="/media/optimized/hero-wallpaper-alt-0.jpg"
            alt="Sugi Sushi"
            fill
            priority
            className="object-cover brightness-[0.35] saturate-[0.8] contrast-[1.1]"
          />
        </motion.div>
        
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-bg" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/30 via-transparent to-bg/30" />
      </motion.div>

      {/* ─── CTA Button at Bottom ─── */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1.2, ease: [0.19, 1, 0.22, 1] }}
        >
          <button 
            onClick={() => onTabChange('menu')}
            className="group relative px-14 py-5 overflow-hidden rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md transition-all duration-700 hover:bg-gold hover:border-gold shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
          >
            <span className="relative z-10 text-white text-[10px] md:text-xs uppercase tracking-[0.5em] font-black group-hover:text-bg transition-colors duration-500">
              {t('hero.cta')}
            </span>
            <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.19,1,0.22,1]" />
          </button>
        </motion.div>

        {/* Scroll Cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 2, duration: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-[1px] h-10 bg-gradient-to-b from-gold/50 to-transparent relative overflow-hidden">
            <motion.div 
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-white/40"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
