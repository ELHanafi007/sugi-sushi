'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useRef } from 'react';

export default function LandingExperience() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scaleHero = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <section ref={containerRef} className="relative h-screen w-full flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Background Image - With Parallax */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="h-full w-full bg-[url('/media/optimized/hero-wallpaper-alt-0.jpg')] bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-20" />
      </motion.div>

      {/* Elegant Animated Calligraphy */}
      <motion.div 
        style={{ opacity: opacityHero, scale: scaleHero }}
        className="relative z-30 flex flex-col items-center"
      >
        <motion.div
          initial={{ opacity: 0, filter: "blur(20px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="relative"
        >
          <span className="text-[140px] md:text-[240px] font-serif text-gold select-none drop-shadow-[0_10px_50px_rgba(0,0,0,0.9)] gold-glow leading-none">
            杉
          </span>
          
          <motion.div 
            animate={{ 
              opacity: [0.05, 0.15, 0.05],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gold/20 blur-[100px] rounded-full -z-10"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1.8 }}
          className="text-foreground text-[10px] md:text-[12px] uppercase font-medium tracking-[1em] pl-[1em] mt-8 text-center"
        >
          {t('hero.subtitle')}
        </motion.div>
      </motion.div>

      {/* Luxury Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-4"
      >
        <span className="text-[8px] uppercase tracking-[0.6em] text-gold/60 pl-[0.6em]">Scroll</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-gold/40 to-transparent relative overflow-hidden">
          <motion.div 
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-full h-1/2 bg-gold"
          />
        </div>
      </motion.div>
    </section>
  );
}
