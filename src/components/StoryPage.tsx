'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import KineticGallery from './KineticGallery';

/**
 * THE STORY — Editorial Brand Narrative (Masterpiece Edition)
 * 
 * Features:
 * - Fluid narrative flow with parallax orchestration
 * - Vertical Kanji watermarks
 * - Editorial-grade typography pairings
 */

export default function StoryPage() {
  const { t, lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  const yParallax = useTransform(springScroll, [0, 1], [0, 200]);
  const scaleImage = useTransform(springScroll, [0, 1], [1, 1.2]);
  const textBlur = useTransform(springScroll, [0, 0.2, 0.8, 1], [0, 0, 0, 10]);

  return (
    <div ref={containerRef} className="min-h-screen bg-bg relative pt-56 pb-[120px] overflow-hidden">
      {/* ─── Cinematic Background Canvas ─── */}
      <motion.div 
        style={{ scale: scaleImage, opacity: 0.1 }} 
        className="absolute inset-0 pointer-events-none z-0"
      >
        <Image
          src="https://images.unsplash.com/photo-1580828369019-2238b909ca8c?auto=format&fit=crop&w=1600&q=80"
          alt="Story Background"
          fill
          sizes="100vw"
          className="object-cover grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg" />
      </motion.div>

      {/* ─── Floating Editorial Elements ─── */}
      <motion.div 
        style={{ y: yParallax }}
        className="absolute top-40 right-10 md:right-32 text-[25vw] font-serif text-white/[0.015] pointer-events-none select-none leading-none z-0 mix-blend-plus-lighter"
      >
        魂
      </motion.div>

      <div className="container-luxury relative z-10">
        {/* ─── Hero Orchestration ─── */}
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto pt-24 mb-48">
          <motion.div
            initial={{ opacity: 0, y: 50, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className="flex items-center justify-center gap-6 mb-12">
               <div className="w-12 h-px bg-gold/30" />
               <span className="text-mono text-gold/65 text-[10px] tracking-[1em] uppercase font-black">{t('story.label')}</span>
               <div className="w-12 h-px bg-gold/30" />
            </div>
            
            <h1 className="text-display text-white mb-16 !leading-[0.85] drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
              {t('story.hero1')} <br />
              <span className="text-gold shimmer-gold italic font-light !text-[0.7em] leading-normal">{t('story.hero2')}</span> <br />
              <span className="opacity-80">{t('story.hero3')}</span>
            </h1>
            
            <motion.div 
              animate={{ height: [0, 120] }}
              transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
              className="w-[1px] h-32 bg-gradient-to-b from-gold/50 via-gold/10 to-transparent mx-auto" 
            />
          </motion.div>
        </div>

        {/* ─── Narrative Triptych ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-40 items-center mb-60">
          <motion.div 
            initial={{ opacity: 0, x: -60, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
            className="relative aspect-[3/4] rounded-[3rem] overflow-hidden luxury-card group"
          >
            <Image
              src="/media/optimized/brochure-6.jpg"
              alt="The Craft"
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover transition-transform duration-[4s] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent" />
            
            {/* Overlay Accents */}
            <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end border-t border-white/10 pt-8">
               <span className="text-mono text-white/40 text-[9px] tracking-widest uppercase font-black">Kyoto Heritage</span>
               <span className="text-serif text-gold/60 italic text-sm">Est. 2024</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 2, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className={`space-y-12 ${lang === 'ar' ? 'text-right' : 'text-left'}`}
          >
            <div className="inline-block px-6 py-2 rounded-full border border-gold/20 bg-gold/[0.03]">
               <span className="text-mono text-gold text-[8px] tracking-[0.4em] font-black uppercase">{t('story.phil')}</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl text-white font-serif font-light leading-tight italic">
              {t('story.title')}
            </h2>
            
            <div className="space-y-10 border-l border-white/5 pl-10">
              <p className="text-white/75 text-xl font-serif italic leading-relaxed">
                {t('story.p1')}
              </p>
              <p className="text-white/45 text-lg leading-relaxed font-light">
                {t('story.p2')}
              </p>
            </div>

            <div className="pt-12 flex items-center gap-10">
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="relative w-48 h-48 opacity-90 mix-blend-screen"
              >
              <Image src="/media/optimized/brand-logo.png" alt="Sugi" fill sizes="64px" className="object-contain" />
              </motion.div>
              <div className="h-[1px] w-24 bg-white/5" />
              <div className="flex flex-col">
                <span className="text-white/40 text-[10px] uppercase tracking-[0.5em] font-black font-mono">
                  {t('story.sig')}
                </span>
                <span className="text-gold/30 text-[8px] uppercase tracking-widest font-mono mt-2">{t('story.exec_chef')}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── Cinematic Climax ─── */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 2.5, ease: [0.19, 1, 0.22, 1] }}
          className="text-center max-w-5xl mx-auto py-32 border-y border-white/[0.04] relative rounded-[4rem] overflow-hidden bg-white/[0.01] mb-48"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.04),transparent_70%)] pointer-events-none" />
          
          {/* Accent Brackets */}
          <div className="absolute top-12 left-12 w-12 h-12 border-t border-l border-gold/20 rounded-tl-3xl" />
          <div className="absolute bottom-12 right-12 w-12 h-12 border-b border-r border-gold/20 rounded-br-3xl" />
          
          <h3 className="text-3xl md:text-5xl text-white/90 font-serif font-light italic leading-tight max-w-3xl mx-auto mb-16">
            {t('story.quote')}
          </h3>
          <div className="flex flex-col items-center gap-4">
            <span className="text-gold text-[11px] uppercase tracking-[0.8em] font-black font-mono">{t('story.phil')}</span>
            <div className="w-8 h-[1px] bg-gold/40" />
          </div>
        </motion.div>

        {/* ─── Merged Gallery Section ─── */}
        <KineticGallery />
      </div>
    </div>
  );
}
