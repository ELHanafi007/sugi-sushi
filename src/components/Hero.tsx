'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { NavTab } from './BottomNav';

/**
 * SUGI SUSHI - Signature Brand Hero
 * 
 * SIGNATURE MOMENT: Cinematic Focus Shift & Depth-Scale Transition.
 */

interface HeroProps {
  onTabChange: (tab: NavTab) => void;
}

export default function Hero({ onTabChange }: HeroProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Cinematic Parallax & Focus Shift
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <section ref={containerRef} className="relative h-[110vh] w-full flex items-center justify-center overflow-hidden bg-bg">
      {/* ─── Cinematic Background (Depth Shift) ─── */}
      <motion.div 
        style={{ scale: heroScale, filter: `blur(0px)` }}
        className="absolute inset-0 z-0"
      >
        <motion.div style={{ filter: `blur(0px)` }} className="relative w-full h-full">
          <Image
            src="/media/optimized/hero-wallpaper-0.jpg"
            alt="Sugi Sushi Hero Wallpaper"
            fill
            priority
            className="object-cover brightness-[0.35] scale-[1.05] transition-opacity duration-1000"
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-bg" />
      </motion.div>

      {/* ─── Global Cursor Interaction (Identity Hook) ─── */}
      <motion.div 
        className="fixed w-12 h-12 border border-gold/40 rounded-full z-[150] pointer-events-none mix-blend-difference hidden lg:flex items-center justify-center"
        animate={{ x: mousePos.x - 24, y: mousePos.y - 24 }}
        transition={{ type: 'spring', damping: 20, stiffness: 250, mass: 0.5 }}
      >
        <div className="w-1 h-1 bg-gold rounded-full" />
      </motion.div>

      {/* ─── Luxury Presentation ─── */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-20 flex flex-col items-center text-center px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="mb-12"
        >
          <span className="text-mono text-gold tracking-[0.8em]">Perfection in Motion</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 2, delay: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="text-display liquid-gold mb-12 drop-shadow-2xl select-none"
        >
          SUGI SUSHI
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2, delay: 1.5 }}
          className="flex items-center gap-12"
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-white/40" />
          <p className="text-h3 text-white italic max-w-2xl font-serif">
            Traditional Soul, Modern Vision.
          </p>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-white/40" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="mt-16"
        >
          <button 
            onClick={() => onTabChange('menu')}
            className="group relative px-12 py-5 overflow-hidden rounded-full border border-gold/40 bg-black/20 backdrop-blur-md transition-all duration-700 hover:border-gold"
          >
            <div className="absolute inset-0 bg-gold/10 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
            <span className="relative text-white text-[12px] uppercase tracking-[0.5em] font-bold group-hover:text-gold transition-colors">
              Explore the Menu
            </span>
          </button>
        </motion.div>
      </motion.div>

      {/* ─── Discovery Prompt ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-6"
      >
        <span className="text-mono text-[8px] opacity-20">Scroll to Immersion</span>
        <div className="w-px h-24 bg-gradient-to-b from-gold/40 to-transparent" />
      </motion.div>
    </section>
  );
}
