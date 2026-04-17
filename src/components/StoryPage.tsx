'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function StoryPage() {
  const { t, lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  return (
    <div ref={containerRef} className="min-h-screen bg-bg relative pt-24 pb-40 overflow-hidden">
      {/* Cinematic Background Elements */}
      <motion.div style={{ scale, opacity }} className="absolute inset-0 pointer-events-none z-0">
        <Image
          src="/media/optimized/hero-wallpaper-alt-0.jpg"
          alt="Chef Background"
          fill
          className="object-cover opacity-[0.15] contrast-125 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg" />
      </motion.div>

      {/* Floating Kanji */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-20 right-10 md:right-20 text-[20vw] font-serif text-white/[0.02] pointer-events-none select-none leading-none z-0"
      >
        魂
      </motion.div>

      <div className="container-luxury relative z-10">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto pt-20 mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          >
            <span className="mono-tag text-gold mb-10 tracking-[0.8em]">Heritage</span>
            <h1 className="text-display text-white mb-10 drop-shadow-2xl">
              THE <span className="text-gold italic">SOUL</span> <br /> OF SUGI
            </h1>
            <div className="w-px h-24 bg-gradient-to-b from-gold/40 to-transparent mx-auto" />
          </motion.div>
        </div>

        {/* Narrative Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center mb-40">
          <motion.div 
            style={{ y: y2 }}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="relative aspect-[3/4] rounded-[2rem] overflow-hidden card-glass"
          >
            <Image
              src="/media/optimized/brochure-6.jpg"
              alt="Sugi Craftsmanship"
              fill
              className="object-cover p-2 rounded-[2rem]"
            />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
            className={`space-y-8 ${lang === 'ar' ? 'text-right' : 'text-left'}`}
          >
            <h2 className="text-3xl md:text-5xl text-white font-serif font-light leading-tight">
              {t('story.title')}
            </h2>
            <p className="text-white/60 text-lg font-serif italic leading-relaxed">
              {t('story.p1')}
            </p>
            <p className="text-white/40 text-base leading-relaxed">
              {t('story.p2')}
            </p>
            <div className="pt-8 flex items-center gap-6">
              <span className="text-gold/80 font-serif text-3xl italic">杉</span>
              <div className="h-px w-16 bg-gold/20" />
              <span className="text-white/30 text-[10px] uppercase tracking-widest font-mono">
                {t('story.sig')}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Cinematic Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
          className="text-center max-w-4xl mx-auto py-20 border-y border-white/[0.04] relative"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05),transparent_60%)] pointer-events-none" />
          <h3 className="text-2xl md:text-4xl text-white/90 font-serif font-light italic leading-relaxed">
            &quot;True luxury is not found in excess, but in the masterful execution of the essential.&quot;
          </h3>
          <span className="block mt-8 text-gold/50 text-[10px] uppercase tracking-[0.5em] font-mono">The Sugi Philosophy</span>
        </motion.div>
      </div>
    </div>
  );
}
