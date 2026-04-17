'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const IMAGES = [
  { src: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1600&q=80', aspect: 'aspect-[4/5]', delay: 0.1 },
  { src: 'https://images.unsplash.com/photo-1580828369019-2238b909ca8c?auto=format&fit=crop&w=1600&q=80', aspect: 'aspect-[16/9]', delay: 0.2 },
  { src: 'https://images.unsplash.com/photo-1558985250-27a406d64cb3?auto=format&fit=crop&w=1600&q=80', aspect: 'aspect-square', delay: 0.3 },
  { src: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&w=1600&q=80', aspect: 'aspect-[3/4]', delay: 0.15 },
  { src: '/media/optimized/brochure-1.jpg', aspect: 'aspect-[4/5]', delay: 0.25 },
  { src: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1600&q=80', aspect: 'aspect-square', delay: 0.35 },
  { src: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=1600&q=80', aspect: 'aspect-[16/9]', delay: 0.2 },
  { src: '/media/optimized/brochure-10.jpg', aspect: 'aspect-[4/5]', delay: 0.3 },
];

export default function GalleryPage() {
  const { t } = useLanguage();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-bg pt-32 pb-40">
      <div className="container-luxury">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          >
            <span className="section-label mb-4 tracking-[0.8em] uppercase">{t('gallery.label')}</span>
            <h1 className="text-5xl md:text-7xl text-white font-serif font-light leading-none">
              {t('gallery.title1')} <span className="text-gold italic">{t('gallery.title2')}</span>
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex items-center gap-4 text-white/30"
          >
            <span className="text-[10px] uppercase font-mono tracking-[0.4em]">{t('gallery.tag1')}</span>
            <div className="w-1 h-1 rounded-full bg-gold/50" />
            <span className="text-[10px] uppercase font-mono tracking-[0.4em]">{t('gallery.tag2')}</span>
          </motion.div>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {IMAGES.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, delay: img.delay, ease: [0.19, 1, 0.22, 1] }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`relative w-full rounded-2xl overflow-hidden card-glass group break-inside-avoid shadow-2xl ${img.aspect}`}
            >
              <Image
                src={img.src}
                alt={`Gallery image ${idx + 1}`}
                fill
                className={`object-cover transition-all duration-[2s] ease-[cubic-bezier(0.19,1,0.22,1)] ${
                  hoveredIdx === idx 
                    ? 'scale-110 brightness-[0.8]' 
                    : hoveredIdx !== null 
                      ? 'scale-100 brightness-[0.2]' 
                      : 'scale-100 brightness-[0.6]'
                }`}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              {/* Hover Cursor Hint */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <span className="mono-tag !bg-white/5 !border-white/10 !text-white/60">{t('gallery.view')}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing Element */}
        <div className="mt-32 flex flex-col items-center">
          <div className="w-px h-20 bg-gradient-to-b from-gold/30 to-transparent mb-8" />
          <span className="text-[24px] text-gold/40 font-serif">杉</span>
        </div>
      </div>
    </div>
  );
}
