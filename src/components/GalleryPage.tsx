'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

/**
 * THE GALLERY — Cinematic Visual Archive (Masterpiece Edition)
 * 
 * Features:
 * - Adaptive masonry grid with staggered entry
 * - Mask-reveal interaction logic
 * - Editorial focus-blur transitions
 */

const IMAGES = [
  { src: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1600&q=80', aspect: 'aspect-[4/5]', delay: 0.1 },
  { src: 'https://images.unsplash.com/photo-1580828369019-2238b909ca8c?auto=format&fit=crop&w=1600&q=80', aspect: 'aspect-[16/9]', delay: 0.2 },
  { src: 'https://images.unsplash.com/photo-1558985250-27a406d64cb3?auto=format&fit=crop&w=1600&q=80', aspect: 'aspect-square', delay: 0.3 },
  { src: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&w=1600&q=80', aspect: 'aspect-[3/4]', delay: 0.15 },
  { src: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1600&q=80', aspect: 'aspect-[4/5]', delay: 0.25 },
  { src: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1600&q=80', aspect: 'aspect-square', delay: 0.35 },
  { src: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=1600&q=80', aspect: 'aspect-[16/9]', delay: 0.2 },
  { src: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?auto=format&fit=crop&w=1600&q=80', aspect: 'aspect-[4/5]', delay: 0.3 },
];

export default function GalleryPage() {
  const { t } = useLanguage();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-bg pt-40 pb-60">
      <div className="container-luxury">
        {/* ─── Header Orchestration ─── */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-32 border-b border-white/5 pb-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className="flex items-center gap-4 mb-8">
               <div className="w-10 h-[1px] bg-gold/30" />
               <span className="text-mono text-gold/40 text-[10px] tracking-[0.8em] uppercase font-black">{t('gallery.label')}</span>
            </div>
            <h1 className="text-6xl md:text-9xl text-white font-serif font-light leading-none tracking-tightest italic">
              {t('gallery.title1')} <span className="text-gold shimmer-gold">{t('gallery.title2')}</span>
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="flex items-center gap-8 text-white/20"
          >
            <div className="flex flex-col items-end">
               <span className="text-[10px] uppercase font-black font-mono tracking-[0.4em]">{t('gallery.tag1')}</span>
               <span className="text-[8px] font-mono mt-2">EST. 2024</span>
            </div>
            <div className="w-[1px] h-12 bg-white/10" />
            <div className="flex flex-col items-end">
               <span className="text-[10px] uppercase font-black font-mono tracking-[0.4em]">{t('gallery.tag2')}</span>
               <span className="text-[8px] font-mono mt-2">KYOTO SOUL</span>
            </div>
          </motion.div>
        </div>

        {/* ─── Masonry Grid Orchestration ─── */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {IMAGES.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.5, delay: img.delay, ease: [0.19, 1, 0.22, 1] }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`relative w-full rounded-[2.5rem] overflow-hidden luxury-card group break-inside-avoid shadow-[0_30px_60px_rgba(0,0,0,0.5)] ${img.aspect}`}
            >
              <Image
                src={img.src}
                alt={`Gallery image ${idx + 1}`}
                fill
                className={`object-cover transition-all duration-[2.5s] ease-[cubic-bezier(0.19,1,0.22,1)] ${
                  hoveredIdx === idx 
                    ? 'scale-110 brightness-[0.7] contrast-125' 
                    : hoveredIdx !== null 
                      ? 'scale-100 brightness-[0.15] blur-[8px]' 
                      : 'scale-100 brightness-[0.5]'
                }`}
              />
              
              {/* Inner Frame Overlay */}
              <div className="absolute inset-6 border border-white/5 rounded-[1.5rem] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              {/* Context Label */}
              <div className="absolute bottom-10 left-10 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                <span className="text-mono text-gold/60 text-[9px] uppercase tracking-[0.3em] font-black">{t('gallery.view')}</span>
                <div className="w-8 h-[1px] bg-gold/40 mt-2" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ─── Final Accent ─── */}
        <div className="mt-48 flex flex-col items-center">
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: 160 }}
            transition={{ duration: 2 }}
            className="w-[1px] bg-gradient-to-b from-gold/40 via-gold/10 to-transparent mb-12" 
          />
          <span className="text-[40px] text-gold/20 font-serif italic font-thin select-none">杉</span>
          <span className="text-mono text-white/5 text-[9px] tracking-[1em] uppercase font-black mt-8">Infinite Craft</span>
        </div>
      </div>
    </div>
  );
}
