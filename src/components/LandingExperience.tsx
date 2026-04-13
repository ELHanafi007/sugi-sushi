'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useRef, useEffect, useState } from 'react';

// Floating particle component for ambient luxury
function FloatingParticle({
  delay,
  duration,
  x,
  y,
  size,
}: {
  delay: number;
  duration: number;
  x: string;
  y: string;
  size: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: '100%', scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0],
        y: ['-20%', '-120%'],
        x: [x, `${parseFloat(x) + 10}%`],
        scale: [0, 1, 0.5],
      }}
      transition={{
        delay,
        duration,
        repeat: Infinity,
        ease: 'easeOut',
      }}
      className="absolute rounded-full bg-gold/20 blur-[2px]"
      style={{ left: x, bottom: y, width: size, height: size }}
    />
  );
}

export default function LandingExperience() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Smooth spring physics for parallax
  const scrollYSmooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    mass: 0.8,
  });

  const yBg = useTransform(scrollYSmooth, [0, 1], ['0%', '40%']);
  const opacityHero = useTransform(scrollYSmooth, [0, 0.4], [1, 0]);
  const scaleHero = useTransform(scrollYSmooth, [0, 0.4], [1, 0.92]);
  const yKanji = useTransform(scrollYSmooth, [0, 0.5], [0, -60]);
  const blurKanji = useTransform(scrollYSmooth, [0, 0.3], ['0px', '15px']);

  // Mark as loaded for entrance animations
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const particles = [
    { delay: 0, duration: 8, x: '10%', y: '20%', size: 3 },
    { delay: 2, duration: 10, x: '70%', y: '10%', size: 2 },
    { delay: 4, duration: 9, x: '40%', y: '30%', size: 4 },
    { delay: 1, duration: 11, x: '85%', y: '15%', size: 2 },
    { delay: 3, duration: 7, x: '25%', y: '25%', size: 3 },
    { delay: 5, duration: 12, x: '60%', y: '5%', size: 2 },
  ];

  return (
    <section
      ref={containerRef}
      className="relative h-[100dvh] w-full flex flex-col items-center justify-center 
                 bg-background overflow-hidden"
    >
      {/* ===== PARALLAX BACKGROUND ===== */}
      <motion.div
        style={{ y: yBg }}
        className="absolute inset-0 z-0"
      >
        <motion.div
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full bg-[url('/media/optimized/hero-wallpaper-alt-0.jpg')] 
                     bg-cover bg-center"
        />
        {/* Multiple overlay layers for depth */}
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background z-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-background/30 z-20" />
      </motion.div>

      {/* ===== FLOATING GOLD PARTICLES ===== */}
      <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <FloatingParticle key={i} {...p} />
        ))}
      </div>

      {/* ===== AMBIENT GLOW ===== */}
      <motion.div
        animate={{
          opacity: [0.03, 0.08, 0.03],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 
                   w-[250px] h-[250px] bg-gold/20 blur-[120px] rounded-full z-[4] 
                   pointer-events-none"
      />

      {/* ===== MAIN HERO CONTENT ===== */}
      <motion.div
        style={{ opacity: opacityHero, scale: scaleHero }}
        className="relative z-30 flex flex-col items-center px-6"
      >
        {/* Decorative Top Line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isLoaded ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold/60 to-transparent mb-10"
        />

        {/* KANJI — Centerpiece */}
        <motion.div
          style={{ y: yKanji, filter: `blur(${blurKanji})` }}
          className="relative"
        >
          {/* Main Kanji Character */}
          <motion.span
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={isLoaded ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
              duration: 2,
              delay: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-[120px] font-serif text-gold select-none leading-none 
                       text-shadow-luxury block"
          >
            杉
          </motion.span>

          {/* Pulsing Gold Glow Behind Kanji */}
          <motion.div
            animate={{
              opacity: [0.1, 0.25, 0.1],
              scale: [0.9, 1.2, 0.9],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              repeatDelay: 1,
            }}
            className="absolute inset-0 bg-gold/30 blur-[80px] rounded-full -z-10"
          />

          {/* Subtle Gold Ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 2, delay: 1.5 }}
            className="absolute inset-[-20px] border border-gold/10 rounded-full -z-10"
          />
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-foreground/80 text-[11px] uppercase tracking-[0.8em] 
                     font-serif text-center"
        >
          Sugi Sushi
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 text-foreground-muted text-[9px] uppercase tracking-[0.6em] 
                     font-serif text-center max-w-[280px]"
        >
          {t('hero.subtitle')}
        </motion.div>

        {/* Decorative Bottom Line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isLoaded ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 2, ease: [0.22, 1, 0.36, 1] }}
          className="w-12 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent mt-10"
        />
      </motion.div>

      {/* ===== SCROLL INDICATOR ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 
                   flex flex-col items-center gap-3"
      >
        <span className="text-[7px] uppercase tracking-[0.5em] text-gold/40 font-serif">
          Scroll
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-gold/30 to-transparent 
                        relative overflow-hidden rounded-full">
          <motion.div
            animate={{ y: ['-100%', '100%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-1/2 bg-gold/60 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
