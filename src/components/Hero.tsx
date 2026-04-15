'use client';

import { motion, Variants } from 'framer-motion';
import { useEffect, useRef } from 'react';

/**
 * SUGI SUSHI - Cinematic Hero Component
 * 
 * DESIGN PRINCIPLES:
 * 1. Absolute Centering: Mathematical focus on all viewports.
 * 2. Visual Hierarchy: Dominant Serif Title -> Spaced Subtitle -> Elegant HUD CTA.
 * 3. Cinematic Depth: Vertical gradient overlay for text legibility.
 * 4. Liquid Motion: Staggered, eased animations for a luxury feel.
 */

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.warn("Autoplay was prevented. User interaction may be required.", error);
      });
    }
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.8,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 1.4,
        ease: [0.19, 1, 0.22, 1], // Expo Out
      },
    },
  };

  return (
    <section className="relative h-[100svh] w-full flex items-center justify-center overflow-hidden bg-bg">
      {/* ─── Cinematic Background Layer ─── */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/media/optimized/hero-wallpaper-2.jpg"
          className="w-full h-full object-cover object-center scale-[1.02]"
        >
          <source src="/videos/sushi-hero.mp4" type="video/mp4" />
        </video>
        
        {/* Dynamic Multi-Stage Overlay for Maximum Legibility */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/80 via-black/30 to-black/80 pointer-events-none" />
        <div className="absolute inset-0 z-10 bg-black/20 backdrop-blur-[1px] pointer-events-none" />
      </div>

      {/* ─── Luxury Brand Presentation ─── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 flex flex-col items-center text-center px-6 max-w-5xl"
      >
        {/* Decorative Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <span className="mono-tag text-gold opacity-80">Riyadh • Est. 2024</span>
        </motion.div>

        {/* Primary Focus: Dominant Branding */}
        <motion.h1
          variants={itemVariants}
          className="heading-huge liquid-gold mb-8 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
        >
          SUGI SUSHI
        </motion.h1>

        {/* Secondary Focus: Elegant Tagline */}
        <motion.p
          variants={itemVariants}
          className="text-white/70 text-[12px] md:text-[16px] uppercase tracking-[0.6em] font-serif max-w-[80%] md:max-w-2xl mb-16 leading-relaxed text-balance"
        >
          A Luxury Japanese Dining Experience in Saudi Arabia
        </motion.p>

        {/* CTA Section: Isolated HUD Button */}
        <motion.div variants={itemVariants}>
          <a
            href="#menu"
            className="group relative inline-flex items-center gap-8 px-12 py-6 rounded-full 
                       hud-border bg-white/[0.03] overflow-hidden transition-all duration-700 
                       hover:bg-gold/10 hover:border-gold/40 active:scale-95 shadow-2xl"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <span className="relative text-white text-[11px] uppercase tracking-[0.5em] font-bold group-hover:text-gold-bright transition-colors">
              Enter Menu
            </span>
            
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg 
                className="w-5 h-5 text-gold transition-all duration-500 group-hover:scale-110" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1"
              >
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="square" />
              </svg>
            </motion.div>
          </a>
        </motion.div>
      </motion.div>

      {/* ─── Scroll Narrator ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-6"
      >
        <span className="mono-tag text-[8px] opacity-40">Discovery</span>
        <div className="relative w-px h-16 bg-gradient-to-b from-white/0 via-gold/30 to-white/0 overflow-hidden">
          <motion.div 
            animate={{ y: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent to-gold"
          />
        </div>
      </motion.div>
    </section>
  );
}
