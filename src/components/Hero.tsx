'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { useLanguage, NavTab } from '@/context/LanguageContext';

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
        {/* Masterpiece Morphing Logo Stage */}
        <div className="h-[45vh] mb-20 flex flex-col items-center justify-center relative">
          {/* Ambient Glow behind logo */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15),transparent_70%)] blur-3xl pointer-events-none"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 2.5, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex items-center gap-10">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold/30" />
              <span className="text-mono text-gold/50 text-[10px] tracking-[1.5em] uppercase font-black">
                {t('hero.est')}
              </span>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold/30" />
            </div>
            
            {/* Japanese Subtext */}
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ delay: 2, duration: 2 }}
              className="text-white text-[15vw] md:text-[12vh] font-serif absolute -z-10 select-none pointer-events-none tracking-[0.2em] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 whitespace-nowrap opacity-5"
            >
              杉寿司
            </motion.span>
          </motion.div>
        </div>

        {/* Masterpiece CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 1.2, ease: [0.19, 1, 0.22, 1] }}
          style={{ willChange: "transform, opacity" }}
        >
          <button 
            onClick={() => onTabChange('menu')}
            className="cta-btn group px-20 py-8 shadow-2xl"
          >
            <div className="relative flex flex-col items-center">
              <span className="text-white/90 text-[11px] uppercase tracking-[0.8em] font-black group-hover:text-gold group-hover:tracking-[1em] transition-all duration-1000">
                {t('hero.cta')}
              </span>
              <motion.div 
                className="h-px w-0 bg-gold mt-4 group-hover:w-full transition-all duration-1000" 
                layoutId="ctaUnderline"
              />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
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
