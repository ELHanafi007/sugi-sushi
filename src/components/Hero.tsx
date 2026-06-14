'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

      {/* ─── CTA Buttons at Bottom ─── */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-16 md:bottom-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-8 md:gap-12 w-full px-6"
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full max-w-lg md:max-w-2xl">
          {/* Primary CTA: Reservation */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, delay: 1.2, ease: [0.19, 1, 0.22, 1] }}
            className="w-full sm:w-auto flex-1"
          >
            <Link 
              href="/reserve"
              className="group relative flex items-center justify-center w-full px-8 md:px-14 py-4 md:py-6 overflow-hidden rounded-full bg-gold shadow-[0_20px_50px_rgba(212,175,55,0.3)] transition-all duration-700 hover:scale-[1.05] active:scale-95"
            >
              <span className="relative z-10 text-bg text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] font-black whitespace-nowrap">
                {t('hero.reserve')}
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </Link>
          </motion.div>

          {/* Secondary CTA: Menu */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, delay: 1.4, ease: [0.19, 1, 0.22, 1] }}
            className="w-full sm:w-auto flex-1"
          >
            <button 
              onClick={() => onTabChange('menu')}
              className="group relative flex items-center justify-center w-full px-8 md:px-14 py-4 md:py-6 overflow-hidden rounded-full border border-white/20 bg-white/5 backdrop-blur-xl transition-all duration-700 hover:bg-white/10 hover:border-white/40 active:scale-95"
            >
              <span className="relative z-10 text-white text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] font-black whitespace-nowrap">
                {t('hero.menu')}
              </span>
            </button>
          </motion.div>
        </div>

        {/* Scroll Cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 2, duration: 1 }}
          className="hidden md:flex flex-col items-center gap-2"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-gold/50 to-transparent relative overflow-hidden">
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
