'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { NavTab } from './BottomNav';
import { useLanguage } from '@/context/LanguageContext';

/**
 * SUGI SUSHI — Cinematic Hero (Masterpiece Edition)
 * 
 * Enhanced with:
 * - Split-text letter-by-letter reveal
 * - Mouse-driven 3D tilt interaction
 * - Multi-layered parallax depth shift
 */

interface HeroProps {
  onTabChange: (tab: NavTab) => void;
}

export default function Hero({ onTabChange }: HeroProps) {
  const { t, lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse position for tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for tilt
  const rotateX = useSpring(useTransform(y, [-300, 300], [5, -5]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-300, 300], [-5, 5]), { stiffness: 100, damping: 30 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax & Cinematic Scales
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const blurValue = useTransform(scrollYProgress, [0, 0.5], ['blur(0px)', 'blur(20px)']);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const titleText = t('hero.title') || "SUGI";
  const letters = titleText.split("");

  return (
    <section 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className="relative h-[115vh] w-full flex items-center justify-center overflow-hidden bg-bg"
    >
      {/* ─── Parallax Background ─── */}
      <motion.div 
        style={{ scale: heroScale, opacity: heroOpacity, filter: blurValue }}
        className="absolute inset-0 z-0"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 0.5, 0] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src="https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?auto=format&fit=crop&w=1600&q=80"
            alt="Sugi Sushi"
            fill
            priority
            className="object-cover brightness-[0.4] contrast-[1.1] saturate-[1.3]"
          />
        </motion.div>
        
        {/* Deep Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-bg" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
      </motion.div>

      {/* ─── Content Stage with 3D Tilt ─── */}
      <motion.div
        style={{ 
          y: contentY, 
          rotateX, 
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform"
        }}
        className="relative z-20 flex flex-col items-center text-center px-6"
      >
        {/* Micro-label with character tracking animation */}
        <motion.div
          initial={{ opacity: 0, letterSpacing: '2em', y: 20 }}
          animate={{ opacity: 1, letterSpacing: '0.8em', y: 0 }}
          transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
          className="mb-8"
        >
          <span className="text-mono text-gold/60 text-[8px] uppercase font-bold">
            {t('hero.micro')}
          </span>
        </motion.div>

        {/* Main Title - Split Text Reveal */}
        <h1 className="text-display liquid-gold mb-8 drop-shadow-[0_20px_50px_rgba(212,175,55,0.2)] select-none flex overflow-hidden">
          {letters.map((char, i) => (
            <motion.span
              key={i}
              initial={{ y: "100%", opacity: 0, filter: 'blur(20px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{ 
                duration: 1.5, 
                delay: 0.5 + (i * 0.08), 
                ease: [0.19, 1, 0.22, 1] 
              }}
              className="inline-block"
              style={{ willChange: "transform, opacity, filter" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle with focal point line */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.5, delay: 1.8 }}
          className="flex flex-col items-center gap-8 mb-12"
          style={{ willChange: "transform, opacity" }}
        >
          <p className="text-white/40 text-lg md:text-2xl font-serif italic tracking-wider max-w-2xl">
            {t('hero.subtitle')}
          </p>
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: '120px' }} 
            transition={{ duration: 2, delay: 2.2, ease: "circOut" }}
            className="h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" 
          />
        </motion.div>

        {/* High-End CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 2.5, ease: [0.19, 1, 0.22, 1] }}
          style={{ willChange: "transform, opacity" }}
        >
          <button 
            onClick={() => onTabChange('menu')}
            className="cta-btn group px-16 py-6"
          >
            <span className="relative text-white/90 text-[10px] uppercase tracking-[0.6em] font-black group-hover:text-gold group-hover:tracking-[0.8em] transition-all duration-700">
              {t('hero.cta')}
            </span>
            <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </button>
        </motion.div>
      </motion.div>

      {/* ─── Scroll Orchestrator ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-6"
      >
        <span className="text-mono text-[8px] text-white/20 tracking-[0.4em] uppercase">{t('hero.scroll')}</span>
        <div className="relative w-[1px] h-20 bg-white/5 overflow-hidden">
          <motion.div 
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-gold/50 to-transparent"
            style={{ willChange: "transform" }}
          />
        </div>
      </motion.div>

      {/* ─── Ambient Particles — Reduced for Performance ─── */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-40">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: Math.random() * 100 + "%", y: "100%" }}
            animate={{ 
              opacity: [0, 0.5, 0], 
              y: ["100%", "0%"],
              x: (Math.random() * 100) + (Math.random() * 10 - 5) + "%"
            }}
            transition={{ 
              duration: 12 + Math.random() * 8, 
              delay: Math.random() * 5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute w-1 h-1 bg-gold/30 rounded-full blur-[1px]"
            style={{ willChange: "transform, opacity" }}
          />
        ))}
      </div>
    </section>
  );
}
