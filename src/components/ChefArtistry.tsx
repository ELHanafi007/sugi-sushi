'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

/**
 * CHEF ARTISTRY — Emotional Peak (Masterpiece Edition)
 * 
 * Full-screen cinematic immersion. High contrast, dramatic parallax.
 * Features:
 * - Dynamic light streaks (Lens flare)
 * - Staggered text orchestration
 * - Ultra-subtle gold dust particles
 */

export default function ChefArtistry() {
  const { t, lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Smooth springs for high-end feel
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.1]), { stiffness: 50, damping: 20 });
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0.1, 0.9], [120, -120]);
  const lightStreakX = useTransform(scrollYProgress, [0, 1], ['-100%', '200%']);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[120vh] bg-black overflow-hidden flex items-center justify-center"
    >
      {/* ─── Cinematic Background Layer ─── */}
      <motion.div 
        style={{ scale, opacity }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1600&q=80"
          alt="Chef Artistry"
          fill
          className="object-cover opacity-60 contrast-[1.2] saturate-[0.8] brightness-[0.4]"
          priority
        />
        
        {/* Multi-layered Grading */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-bg" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,black_100%)] opacity-60" />
      </motion.div>

      {/* ─── Cinematic Lens Streak ─── */}
      <motion.div 
        style={{ x: lightStreakX }}
        className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent blur-[2px] opacity-20 pointer-events-none z-10 skew-y-[-5deg]"
      />
      <motion.div 
        style={{ x: lightStreakX, transitionDelay: '0.2s' }}
        className="absolute bottom-1/3 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent blur-[4px] opacity-15 pointer-events-none z-10 skew-y-[10deg]"
      />

      {/* ─── Main Orchestration ─── */}
      <div className="container-luxury relative z-20">
        <div className="flex flex-col items-center text-center">
          <motion.div style={{ y: textY }}>
            {/* Editorial Metadata */}
            <motion.div
              initial={{ opacity: 0, letterSpacing: '2em' }}
              whileInView={{ opacity: 1, letterSpacing: '1.2em' }}
              viewport={{ once: true }}
              transition={{ duration: 2 }}
              className="mb-12"
            >
              <span className="text-mono text-gold/40 text-[10px] font-black uppercase">
                {t('artistry.label')}
              </span>
            </motion.div>

            {/* Display Title */}
            <motion.h2 
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(30px)' }}
              whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 2.5, ease: [0.19, 1, 0.22, 1] }}
              className="text-display liquid-gold mb-16 drop-shadow-[0_20px_60px_rgba(212,175,55,0.3)] !leading-[0.8] !text-5xl md:!text-9xl"
            >
              {t('artistry.title1')} <br className="hidden md:block" /> 
              <span className="shimmer-gold italic font-thin !text-[0.55em] lowercase opacity-60">&</span>{' '}
              <span className="text-gold shimmer-gold">{t('artistry.title2')}</span>
            </motion.h2>
            
            {/* The Climax Quote */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 3, delay: 0.8 }}
              className="flex flex-col items-center gap-12"
            >
              <div className="relative w-px h-32 bg-white/5 overflow-hidden">
                <motion.div 
                  animate={{ y: ['-100%', '300%'] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-gold/40 to-transparent"
                />
              </div>
              <p className="text-2xl md:text-4xl text-white/65 max-w-4xl font-serif italic leading-[1.5] font-light" dangerouslySetInnerHTML={{ __html: t('artistry.quote') }} />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ─── Ambient Particles ─── */}
      <div className="absolute inset-0 pointer-events-none z-[1] opacity-20">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: Math.random() * 100 + "%", y: "100%" }}
            animate={{ 
              opacity: [0, 0.4, 0], 
              y: ["100%", "0%"],
              x: (Math.random() * 100) + (Math.random() * 10 - 5) + "%"
            }}
            transition={{ 
              duration: 15 + Math.random() * 10, 
              delay: Math.random() * 5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute w-[2px] h-[2px] bg-gold/50 rounded-full blur-[2px]"
          />
        ))}
      </div>

      {/* ─── Perimeter Accents ─── */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 0.1, x: 0 }}
        transition={{ duration: 2 }}
        className="absolute top-1/2 left-12 -translate-y-1/2 hidden lg:block"
      >
        <span className="text-mono vertical-text text-white tracking-[1.5em] text-[10px] uppercase font-black">{t('artistry.side1')}</span>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 0.1, x: 0 }}
        transition={{ duration: 2, delay: 0.3 }}
        className="absolute top-1/2 right-12 -translate-y-1/2 hidden lg:block"
      >
        <span className="text-mono vertical-text text-white tracking-[1.5em] text-[10px] uppercase font-black">{t('artistry.side2')}</span>
      </motion.div>
      
      {/* High-End Border Frame */}
      <div className="absolute inset-8 md:inset-16 border border-white/[0.03] pointer-events-none rounded-[2rem]" />
    </section>
  );
}
