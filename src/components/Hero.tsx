'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage, NavTab } from '@/context/LanguageContext';

interface HeroProps {
  onTabChange: (tab: NavTab) => void;
}

/**
 * HERO — The Obsidian Kinetic Masterpiece
 *
 * A full-viewport cinematic entry with:
 * - Layered parallax background
 * - Massive Cinzel display headline with stagger reveal
 * - Floating kanji background element
 * - Glassmorphic CTAs with magnetic hover potential
 * - Cursor-following ambient gold gradient
 * - Cinematic scroll-away with depth
 */
export default function Hero({ onTabChange }: HeroProps) {
  const { t, lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax layers at different speeds
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], ['0px', '-80px']);
  const kanjiY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const kanjiOpacity = useTransform(scrollYProgress, [0, 0.4], [0.04, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0.3, 0.8], [0, 1]);

  // Cursor-following ambient light
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Letter stagger for headline
  const headlineLetters = "SUGI".split('');

  return (
    <section
      ref={containerRef}
      className="relative h-[100svh] w-full flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#030304' }}
    >
      {/* ─── Layer 0: Deep Background with Parallax ─── */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <Image
          src="/media/optimized/hero-wallpaper-alt-0.jpg"
          alt="Sugi Sushi"
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-[0.3] saturate-[0.7] contrast-[1.15]"
        />
      </motion.div>

      {/* ─── Layer 1: Cinematic Overlays ─── */}
      <div className="absolute inset-0 z-[1]">
        {/* Top vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-void/80 via-transparent to-transparent" />
        {/* Bottom fade to bg */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
        {/* Side vignettes */}
        <div className="absolute inset-0 bg-gradient-to-r from-void/50 via-transparent to-void/50" />
      </div>

      {/* ─── Layer 2: Cursor-Following Gold Ambient ─── */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none opacity-40 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(212,175,55,0.06), transparent 60%)`,
        }}
      />

      {/* ─── Layer 3: Floating Kanji (杉) ─── */}
      <motion.div
        style={{ y: kanjiY, opacity: kanjiOpacity }}
        className="absolute inset-0 z-[3] flex items-center justify-center pointer-events-none select-none"
      >
        <span
          className="text-[50vh] md:text-[70vh] leading-none text-white/[0.04]"
          style={{ fontFamily: 'serif' }}
        >
          杉
        </span>
      </motion.div>

      {/* ─── Layer 4: Main Content ─── */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-[10] w-full h-full"
      >
        {/* Mono label */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="absolute top-[28svh] left-1/2 -translate-x-1/2 flex items-center justify-center gap-4 w-full"
        >
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-gold/40" />
          <span className="text-gold/50 text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-[0.6em] whitespace-nowrap">
            {lang === 'ar' ? 'الرياض' : 'Riyadh, KSA'}
          </span>
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-gold/40" />
        </motion.div>

        {/* ─── CTAs ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.3, ease: [0.19, 1, 0.22, 1] }}
          className="absolute top-[68svh] left-1/2 -translate-x-1/2 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-[90%] sm:w-auto"
        >
          {/* Primary: Reserve */}
          <Link
            href="/reserve"
            className="group relative w-full sm:w-auto flex items-center justify-center px-10 md:px-14 py-4 md:py-5 rounded-full overflow-hidden transition-all duration-700 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #b8962e 100%)',
              boxShadow: '0 20px 50px rgba(212,175,55,0.25), 0 0 0 1px rgba(212,175,55,0.3)',
            }}
          >
            <span className="relative z-10 text-void text-[10px] md:text-[11px] uppercase tracking-[0.35em] font-black whitespace-nowrap">
              {t('hero.reserve')}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-gold-white/0 via-gold-white/30 to-gold-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </Link>

          {/* Secondary: Menu */}
          <button
            onClick={() => onTabChange('menu')}
            className="group relative w-full sm:w-auto flex items-center justify-center px-10 md:px-14 py-4 md:py-5 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-xl transition-all duration-700 hover:bg-white/[0.08] hover:border-gold/30 active:scale-95"
            style={{
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            <span className="relative z-10 text-white/90 text-[10px] md:text-[11px] uppercase tracking-[0.35em] font-black whitespace-nowrap group-hover:text-gold-bright transition-colors duration-500">
              {t('hero.menu')}
            </span>
          </button>
        </motion.div>
      </motion.div>

      {/* ─── Layer 5: Scroll Indicator ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        style={{ opacity: contentOpacity }}
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-[10] flex flex-col items-center gap-3"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-[1px] h-10 bg-gradient-to-b from-gold/40 to-transparent"
        />
        <span className="text-white/20 text-[8px] font-mono uppercase tracking-[0.5em]">
          {lang === 'ar' ? 'انزل' : 'Scroll'}
        </span>
      </motion.div>

      {/* ─── Layer 6: Bottom Fade (scroll-driven) ─── */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 z-[5] bg-bg pointer-events-none"
      />
    </section>
  );
}
