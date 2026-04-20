'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { NavTab } from './BottomNav';
import { useLanguage } from '@/context/LanguageContext';

interface HeroProps {
  onTabChange: (tab: NavTab) => void;
}

/**
 * SUGI SUSHI — Cinematic Hero (Transition Edition)
 * 
 * This version is optimized for the Logo-to-Nav morphing transition.
 * The central text is removed to let the brand mark take center stage.
 */

export default function Hero({ onTabChange }: HeroProps) {
  const { t, lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-300, 300], [5, -5]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-300, 300], [-5, 5]), { stiffness: 100, damping: 30 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

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
            src="/media/optimized/hero-wallpaper-alt-0.jpg"
            alt="Sugi Sushi"
            fill
            priority
            className="object-cover brightness-[0.3] contrast-[1.1] saturate-[1.3]"
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-bg" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
      </motion.div>

      {/* ─── Content Stage ─── */}
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
        {/* Placeholder for the Morphing Logo (Calculated in Navbar) */}
        <div className="h-[25vh] mb-12 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-12 h-px bg-gold/30" />
            <span className="text-mono text-gold/40 text-[10px] tracking-[1.5em] uppercase font-black">
              {lang === 'ar' ? 'سوجي سوشي' : 'Sugi Sushi'}
            </span>
            <div className="w-12 h-px bg-gold/30" />
          </motion.div>
        </div>

        {/* High-End CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1, ease: [0.19, 1, 0.22, 1] }}
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

      {/* ─── Scroll Indicator ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-6"
      >
        <span className="text-mono text-[8px] text-white/45 tracking-[0.4em] uppercase">{t('hero.scroll')}</span>
        <div className="relative w-[1px] h-20 bg-white/5 overflow-hidden">
          <motion.div 
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-gold/50 to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}
