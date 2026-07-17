'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useLanguage, NavTab } from '@/context/LanguageContext';

interface HeroProps {
  onTabChange: (tab: NavTab) => void;
}

const EASE = [0.19, 1, 0.22, 1] as const;

export default function Hero({ onTabChange }: HeroProps) {
  const { t, lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.45], ['0px', '-48px']);
  const kanjiY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const kanjiOpacity = useTransform(scrollYProgress, [0, 0.35], [0.04, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0.35, 0.75], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative h-[100svh] w-full flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#030304' }}
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0">
        <video
          src="/media/real/hero-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      </motion.div>

      <div className="absolute inset-0 z-[1] bg-black/40 pointer-events-none" />

      <motion.div
        style={{ y: kanjiY, opacity: kanjiOpacity }}
        className="absolute inset-0 z-[3] flex items-center justify-center pointer-events-none select-none"
      >
        <span className="text-[50vh] md:text-[70vh] leading-none text-white/[0.04]" style={{ fontFamily: 'serif' }}>
          杉
        </span>
      </motion.div>

      <motion.div style={{ opacity: contentOpacity, y: contentY }} className="relative z-[10] w-full h-full">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          className="absolute top-[28svh] left-1/2 -translate-x-1/2 flex items-center justify-center gap-4 w-full"
        >
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-gold/40" />
          <span className="text-gold/50 text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-[0.6em] whitespace-nowrap">
            {lang === 'ar' ? 'الرياض' : 'Riyadh, KSA'}
          </span>
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-gold/40" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35, ease: EASE }}
          className="absolute top-[68svh] left-1/2 -translate-x-1/2 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-[90%] sm:w-auto"
        >
          <Link
            href="/reserve"
            className="group relative w-full sm:w-auto flex items-center justify-center px-10 md:px-14 py-4 md:py-5 rounded-full overflow-hidden transition-transform duration-300 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #b8962e 100%)',
              boxShadow: '0 20px 50px rgba(212,175,55,0.25), 0 0 0 1px rgba(212,175,55,0.3)',
            }}
          >
            <span className="relative z-10 text-void text-[10px] md:text-[11px] uppercase tracking-[0.35em] font-black whitespace-nowrap">
              {t('hero.reserve')}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-gold-white/0 via-gold-white/30 to-gold-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
          </Link>

          <button
            onClick={() => onTabChange('menu')}
            className="group relative w-full sm:w-auto flex items-center justify-center px-10 md:px-14 py-4 md:py-5 rounded-full border border-white/10 bg-void transition-all duration-300 hover:bg-void/90 hover:border-gold/30 active:scale-95"
            style={{
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            <span className="relative z-10 text-white text-[10px] md:text-[11px] uppercase tracking-[0.35em] font-black whitespace-nowrap group-hover:text-gold-bright transition-colors duration-300">
              {t('hero.menu')}
            </span>
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        style={{ opacity: contentOpacity }}
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-[10] flex flex-col items-center gap-3"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-[1px] h-10 bg-gradient-to-b from-gold/40 to-transparent"
        />
        <span className="text-white/20 text-[8px] font-mono uppercase tracking-[0.5em]">
          {t('hero.scroll')}
        </span>
      </motion.div>

      <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 z-[5] bg-bg pointer-events-none" />
    </section>
  );
}
