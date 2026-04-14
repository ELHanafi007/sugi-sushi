'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Hero() {
  const { t, lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.05]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[92dvh] w-full flex flex-col items-center justify-center overflow-hidden bg-bg"
    >
      {/* ─── Background Layers ─── */}
      <motion.div 
        style={{ y: y1, scale }}
        className="absolute inset-0 z-0"
      >
        {/* Subtle Image Overlay (if available) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.15] mix-blend-luminosity"
          style={{ backgroundImage: 'url("/media/optimized/hero-wallpaper-2.jpg")' }}
        />
        
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-bg/60 to-bg" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
        
        {/* Ambient Glows */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </motion.div>

      {/* ─── Decorative Elements ─── */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.03, scale: 1 }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full border border-gold"
        />
        <motion.div
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 0.02, scale: 1 }}
          transition={{ duration: 3, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute w-[95vw] h-[95vw] max-w-[800px] max-h-[800px] rounded-full border border-gold"
        />
      </div>

      {/* ─── Content ─── */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 flex flex-col items-center px-6 text-center"
      >
        {/* Top Decorative Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-8 flex items-center gap-3"
        >
          <div className="w-8 h-px bg-gold/20" />
          <span className="text-[9px] uppercase tracking-[0.4em] text-gold/60 font-serif font-medium">
            Est. 2024
          </span>
          <div className="w-8 h-px bg-gold/20" />
        </motion.div>

        {/* Main Kanji */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6"
        >
          <span
            className="text-[120px] sm:text-[140px] font-serif text-gold select-none leading-none block"
            style={{
              textShadow: '0 0 40px rgba(201, 168, 76, 0.2), 0 0 80px rgba(201, 168, 76, 0.1)',
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))'
            }}
          >
            杉
          </span>
          {/* Sugi Arabic translation if needed, but Kanji is more artistic */}
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-text text-[14px] sm:text-[16px] uppercase tracking-[0.6em] font-serif font-semibold"
        >
          {t('hero.brand')}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-text-secondary/60 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-serif mt-5 max-w-[280px]"
        >
          {t('hero.tagline')}
        </motion.p>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14"
        >
          <a
            href="#menu"
            className="group relative inline-flex flex-col items-center"
          >
            <div className="relative px-10 py-4 rounded-full border border-gold/20 bg-gold/[0.02] 
                          overflow-hidden transition-all duration-500 group-active:scale-95 group-hover:border-gold/40">
              {/* Shimmer Effect */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/[0.08] to-transparent"
                style={{ animation: 'shimmer 3s ease-in-out infinite' }}
              />
              <span className="relative text-gold text-[11px] uppercase tracking-[0.4em] font-serif font-bold">
                {t('hero.explore')}
              </span>
            </div>
            
            {/* Scroll Indicator Dot */}
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mt-6 w-1 h-1 rounded-full bg-gold/40"
            />
          </a>
        </motion.div>
      </motion.div>

      {/* ─── Bottom Info Bar ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 inset-x-0 px-8 flex justify-between items-end z-10"
      >
        <div className="flex flex-col gap-1">
          <span className="text-[7px] text-gold/30 uppercase tracking-[0.2em] font-serif">Location</span>
          <span className="text-[9px] text-text-secondary/50 uppercase tracking-[0.1em]">{t('contact.location')}</span>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <span className="text-[7px] text-gold/30 uppercase tracking-[0.2em] font-serif">Language</span>
          <div className="flex gap-2 text-[9px] text-text-secondary/50 uppercase tracking-[0.1em]">
            <span className={lang === 'en' ? 'text-gold' : ''}>EN</span>
            <span className="text-gold/10">/</span>
            <span className={lang === 'ar' ? 'text-gold' : ''}>AR</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
