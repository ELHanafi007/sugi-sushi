'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Hero() {
  const { t, lang, setLang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-bg"
    >
      {/* ─── Background Layers ─── */}
      <motion.div 
        style={{ y: y1, scale }}
        className="absolute inset-0 z-0"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.2] mix-blend-luminosity"
          style={{ backgroundImage: 'url("/media/optimized/hero-wallpaper-2.jpg")' }}
        />
        
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-bg/40 to-bg" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
        
        {/* Ambient Glows */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full pointer-events-none opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </motion.div>

      {/* ─── Decorative Elements ─── */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-[120vh] h-[120vh] rounded-full border border-gold"
        />
        <motion.div
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 0.03, scale: 1 }}
          transition={{ duration: 3, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute w-[140vh] h-[140vh] rounded-full border border-gold"
        />
      </div>

      {/* ─── Content ─── */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 container-wide flex flex-col items-center text-center"
      >
        {/* Top Decorative Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-12 flex items-center gap-4"
        >
          <div className="w-12 h-px bg-gold/30" />
          <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-serif font-medium">
            Est. 2024
          </span>
          <div className="w-12 h-px bg-gold/30" />
        </motion.div>

        {/* Main Brand Presentation */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
           {/* Kanji */}
           <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <span
              className="text-[160px] md:text-[240px] font-serif text-gold select-none leading-none block"
              style={{
                textShadow: '0 0 60px rgba(201, 168, 76, 0.3)',
                filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))'
              }}
            >
              杉
            </span>
          </motion.div>

          {/* Text Content */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <motion.h1
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-text text-[20px] md:text-[28px] uppercase tracking-[0.8em] font-serif font-bold"
            >
              {t('hero.brand')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-text-secondary/70 text-[13px] md:text-[15px] uppercase tracking-[0.4em] font-serif mt-8 max-w-[440px] leading-relaxed"
            >
              {t('hero.tagline')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-16"
            >
              <a
                href="#menu"
                className="group relative inline-flex items-center gap-6 px-12 py-6 rounded-full border border-gold/20 bg-gold/[0.03] 
                            overflow-hidden transition-all duration-500 hover:border-gold/50 hover:bg-gold/5 active:scale-95"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/[0.1] to-transparent"
                  style={{ animation: 'shimmer 3s ease-in-out infinite' }}
                />
                <span className="relative text-gold text-[12px] uppercase tracking-[0.4em] font-bold">
                  {t('hero.explore')}
                </span>
                <svg className="w-5 h-5 text-gold transition-transform duration-500 group-hover:translate-x-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ─── Bottom Status Bar ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 inset-x-0 z-10"
      >
        <div className="container-wide flex justify-between items-end">
          <div className="flex flex-col gap-3">
            <span className="text-[8px] text-gold/40 uppercase tracking-[0.3em] font-serif font-bold">Location</span>
            <span className="text-[10px] text-text-secondary/60 uppercase tracking-[0.1em]">{t('contact.location')}</span>
          </div>
          
          <div className="hidden md:flex flex-col items-center gap-6">
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-gold/40 shadow-[0_0_12px_rgba(201,168,76,0.3)]"
            />
          </div>

          <div className="flex flex-col items-end gap-3">
            <span className="text-[8px] text-gold/40 uppercase tracking-[0.3em] font-serif font-bold">Language</span>
            <div className="flex gap-6 text-[11px] text-text-secondary/60 uppercase tracking-[0.2em]">
              <button onClick={() => setLang('en')} className={`transition-colors ${lang === 'en' ? 'text-gold font-bold' : 'hover:text-gold'}`}>EN</button>
              <span className="text-gold/10">|</span>
              <button onClick={() => setLang('ar')} className={`transition-colors ${lang === 'ar' ? 'text-gold font-bold' : 'hover:text-gold'}`}>AR</button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
