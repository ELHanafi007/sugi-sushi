'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { NavTab } from './BottomNav';
import { useLanguage } from '@/context/LanguageContext';

/**
 * SUGI SUSHI — Cinematic Hero
 * 
 * Video background with parallax depth shift, staggered text reveal,
 * and custom cursor interaction.
 */

interface HeroProps {
  onTabChange: (tab: NavTab) => void;
}

export default function Hero({ onTabChange }: HeroProps) {
  const { t, lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Cinematic Parallax & Focus Shift
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 0.8]);

  return (
    <section ref={containerRef} className="relative h-[110vh] w-full flex items-center justify-center overflow-hidden bg-bg">
      {/* ─── Cinematic Video / Image Background ─── */}
      <motion.div 
        style={{ scale: heroScale }}
        className="absolute inset-0 z-0"
      >
        <motion.div
          animate={{ scale: [1, 1.08] }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src="https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1600&q=80"
            alt="Sugi Sushi — Japanese Dining Experience"
            fill
            priority
            className="object-cover brightness-[0.35] contrast-125 saturate-110"
          />
        </motion.div>
        
        {/* Gradient overlays for depth */}
        <motion.div 
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-black" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-bg" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
      </motion.div>

      {/* ─── Ambient Gold Light ─── */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.04),transparent_70%)]" />
      </div>

      {/* ─── Hero Content ─── */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-20 flex flex-col items-center text-center px-6"
      >
        {/* Micro-label */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="mb-10"
        >
          <span className="text-mono text-gold/70 tracking-[0.6em] text-[9px] uppercase">
            {t('hero.micro')}
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.92, filter: 'blur(30px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 2.5, delay: 1.1, ease: [0.19, 1, 0.22, 1] }}
          className="text-display liquid-gold mb-10 drop-shadow-2xl select-none"
        >
          {t('hero.title')}
        </motion.h1>

        {/* Subtitle with decorative lines */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.8 }}
          className="flex items-center gap-6 md:gap-10 mb-6"
        >
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: '3rem' }} 
            transition={{ duration: 1.5, delay: 2.2 }}
            className="h-px bg-gradient-to-r from-transparent to-gold/40" 
          />
          <p className="text-white/50 text-lg md:text-xl font-serif italic tracking-wide">
            {t('hero.subtitle')}
          </p>
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: '3rem' }} 
            transition={{ duration: 1.5, delay: 2.2 }}
            className="h-px bg-gradient-to-l from-transparent to-gold/40" 
          />
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 2.4, ease: [0.19, 1, 0.22, 1] }}
          className="mt-12"
        >
          <button 
            onClick={() => onTabChange('menu')}
            className="group relative px-10 py-4 md:px-14 md:py-5 overflow-hidden rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all duration-700 hover:border-gold/40 hover:shadow-[0_0_40px_rgba(212,175,55,0.1)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <span className="relative text-white/80 text-[11px] uppercase tracking-[0.5em] font-bold group-hover:text-gold transition-colors duration-500">
              {t('hero.cta')}
            </span>
          </button>
        </motion.div>
      </motion.div>

      {/* ─── Scroll Prompt ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4"
      >
        <span className="text-mono text-[7px] text-white/20 tracking-[0.3em] uppercase">{t('hero.scroll')}</span>
        <motion.div 
          animate={{ height: ['16px', '32px', '16px'], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px bg-gradient-to-b from-gold/40 to-transparent"
        />
      </motion.div>

      {/* ─── Decorative Corner Accents ─── */}
      <div className="absolute top-8 left-8 w-12 h-12 border-l border-t border-white/[0.04] z-20 pointer-events-none hidden md:block" />
      <div className="absolute top-8 right-8 w-12 h-12 border-r border-t border-white/[0.04] z-20 pointer-events-none hidden md:block" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-l border-b border-white/[0.04] z-20 pointer-events-none hidden md:block" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-r border-b border-white/[0.04] z-20 pointer-events-none hidden md:block" />
    </section>
  );
}
