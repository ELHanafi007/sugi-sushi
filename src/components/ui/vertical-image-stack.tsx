'use client';

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, ArrowRight, MousePointerClick } from "lucide-react";

const GALLERY_IMAGES = [
  { id: 1, src: "/media/optimized/brochure-3.jpg", alt: "Sugi Sushi Exterior", titleKey: "gallery.item2.title", tagKey: "gallery.item2.tag" },
  { id: 2, src: "/media/optimized/brochure-1.jpg", alt: "Dining Room", titleKey: "gallery.item1.title", tagKey: "gallery.item1.tag" },
  { id: 3, src: "/media/optimized/brochure-4.jpg", alt: "Chef at work", titleKey: "gallery.item3.title", tagKey: "gallery.item3.tag" },
  { id: 4, src: "/media/optimized/brochure-2.jpg", alt: "Sushi Selection", titleKey: "gallery.item4.title", tagKey: "gallery.item4.tag" },
  { id: 5, src: "/media/optimized/brochure-5.jpg", alt: "Sugi Specialties", titleKey: "gallery.item5.title", tagKey: "gallery.item5.tag" },
  { id: 6, src: "/media/optimized/brochure-6.jpg", alt: "Fresh Ingredients", titleKey: "gallery.item6.title", tagKey: "gallery.item6.tag" },
  { id: 7, src: "/media/optimized/brochure-7.jpg", alt: "Culinary Details", titleKey: "gallery.item1.title", tagKey: "gallery.item1.tag" },
];

interface VerticalImageStackProps {
  onComplete?: () => void;
  completeTab?: string;
}

/**
 * IMMERSIVE GALLERY — Obsidian Kinetic
 *
 * Full-viewport horizontal scroll gallery using Framer Motion useScroll.
 * Features:
 * - 80vw images with internal parallax
 * - Cinematic typography & cursor
 * - Progress indicator
 */
export function VerticalImageStack({ onComplete, completeTab }: VerticalImageStackProps) {
  const { t, lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Horizontal scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });
  const x = useTransform(smoothProgress, [0, 1], ["0%", `-${100 * (GALLERY_IMAGES.length - 1)}vw`]);

  // Lock body scroll temporarily to prevent double scrollbars, 
  // actually since this is a horizontal scroll mapped to vertical, we need the page to scroll.
  // The container will be height: N * 100vh.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div ref={containerRef} className="relative bg-void w-full" style={{ height: `${GALLERY_IMAGES.length * 100}vh` }}>
      
      {/* ─── Sticky Viewport ─── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        
        {/* Background Noise & Vignette */}
        <div className="absolute inset-0 noise-overlay z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,3,4,0.8)_100%)] z-[2] pointer-events-none" />

        {/* ─── Header Info ─── */}
        <div className="absolute top-8 md:top-12 left-6 md:left-12 z-[10] flex items-center gap-4">
          <button 
            onClick={() => onComplete?.()}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center hover:bg-white/[0.08] hover:border-gold/30 transition-all duration-300"
          >
            <ArrowLeft className="text-white/60" size={18} />
          </button>
          <div className="flex flex-col">
            <span className="text-gold text-[9px] font-mono uppercase tracking-[0.4em]">{t('gallery.label')}</span>
            <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-medium">Sugi Sushi</span>
          </div>
        </div>

        {/* ─── Track ─── */}
        <motion.div style={{ x }} className="flex h-full items-center relative z-[5]">
          {GALLERY_IMAGES.map((image, index) => {
            // Calculate individual parallax based on scroll progress
            return (
              <GalleryItem 
                key={image.id} 
                image={image} 
                index={index} 
                progress={smoothProgress} 
                total={GALLERY_IMAGES.length} 
              />
            );
          })}
        </motion.div>

        {/* ─── Progress Bar ─── */}
        <div className="absolute bottom-12 md:bottom-16 left-6 right-6 md:left-24 md:right-24 z-[10] flex items-center gap-6">
          <span className="text-white/40 font-mono text-xs">01</span>
          <div className="flex-1 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
            <motion.div 
              style={{ scaleX: smoothProgress, transformOrigin: 'left' }}
              className="absolute inset-0 bg-gold rounded-full"
            />
          </div>
          <span className="text-white/40 font-mono text-xs">{String(GALLERY_IMAGES.length).padStart(2, '0')}</span>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-32 md:bottom-12 right-6 md:right-12 z-[10] flex items-center gap-3 opacity-50">
          <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-white">Scroll</span>
          <MousePointerClick size={14} className="text-white animate-bounce" />
        </div>

      </div>
    </div>
  );
}

function GalleryItem({ image, index, progress, total }: { image: any, index: number, progress: any, total: number }) {
  const { t } = useLanguage();
  
  // Calculate when this specific item is in view to trigger internal parallax
  const start = index / total;
  const end = (index + 1) / total;
  
  const innerScale = useTransform(progress, [start - 0.2, start, end], [1.2, 1, 1.1]);
  const opacity = useTransform(progress, [start - 0.1, start, start + 0.1], [0.3, 1, 1]);

  return (
    <motion.div 
      style={{ opacity }}
      className="w-[100vw] h-[100vh] flex-shrink-0 flex items-center justify-center p-6 md:p-24"
    >
      <div className="relative w-full max-w-[1400px] aspect-[4/5] md:aspect-[16/9] overflow-hidden rounded-2xl md:rounded-3xl border border-white/[0.05]" style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.6)' }}>
        
        <motion.div style={{ scale: innerScale }} className="absolute inset-0 w-full h-full">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-cover"
            priority={index < 2}
          />
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-transparent to-transparent" />
        
        {/* Caption */}
        <div className="absolute bottom-8 md:bottom-12 left-8 md:left-16 flex flex-col gap-2">
          <span className="text-gold text-[9px] font-mono font-bold uppercase tracking-[0.4em]">
            {t(image.tagKey)}
          </span>
          <h2 className="text-white text-3xl md:text-5xl lg:text-7xl" style={{ fontFamily: 'var(--font-brand-serif)', fontStyle: 'italic' }}>
            {t(image.titleKey)}
          </h2>
        </div>
        
      </div>
    </motion.div>
  );
}