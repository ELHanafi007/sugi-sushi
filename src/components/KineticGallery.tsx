'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

/**
 * KINETIC GALLERY — Cinematic Visual Archive
 * 
 * Features:
 * - Horizontal Parallax Orchestration
 * - Perspective Tilt Interaction
 * - Floating Cinematic Typography
 * - Magnetic Hover Effects
 * - Ambient Spotlight Stage
 */

const GALLERY_ITEMS = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1600&q=80',
    title: 'The Preparation',
    tag: 'CRAFT',
    aspect: 'aspect-[4/5]',
    parallax: 0.2
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
    title: 'Sanctuary of Senses',
    tag: 'ATMOSPHERE',
    aspect: 'aspect-[16/9]',
    parallax: -0.1
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1600&q=80',
    title: 'Master\'s Focus',
    tag: 'ARTISTRY',
    aspect: 'aspect-square',
    parallax: 0.3
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1600&q=80',
    title: 'Umami Symphony',
    tag: 'CUISINE',
    aspect: 'aspect-[3/4]',
    parallax: 0.1
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&w=1600&q=80',
    title: 'Hidden Details',
    tag: 'TEXTURE',
    aspect: 'aspect-[4/5]',
    parallax: -0.2
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1558985250-27a406d64cb3?auto=format&fit=crop&w=1600&q=80',
    title: 'Liquid Gold',
    tag: 'ELIXIR',
    aspect: 'aspect-square',
    parallax: 0.4
  }
];

function GalleryItem({ item, index, scrollProgress, totalItems }: { item: typeof GALLERY_ITEMS[0], index: number, scrollProgress: any, totalItems: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  // Map scroll progress to horizontal movement with unique parallax factors
  const xOffset = useTransform(scrollProgress, [0, 1], [0, -200 * item.parallax + '%']);
  
  // Dynamic rotation based on position in the scroll
  const start = index / totalItems;
  const end = (index + 1) / totalItems;
  const rotate = useTransform(scrollProgress, [start, end], [5, -5]);
  const scale = useTransform(scrollProgress, [start - 0.1, start, end, end + 0.1], [0.9, 1, 1, 0.9]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 15;
    const y = (e.clientY - rect.top - rect.height / 2) / 15;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      style={{ 
        x: xOffset,
        rotateZ: rotate,
        scale,
        rotateX: springY,
        rotateY: springX,
        perspective: 1000
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative flex-shrink-0 w-[320px] md:w-[500px] lg:w-[700px] ${item.aspect} rounded-[2.5rem] overflow-hidden group luxury-card shadow-2xl transition-shadow duration-500 hover:shadow-gold/10`}
    >
      <Image
        src={item.src}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-[8s] ease-out group-hover:scale-110 brightness-[0.7] group-hover:brightness-[0.9]"
      />
      
      {/* Animated Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-10 md:p-16">
        <div className="overflow-hidden mb-4">
          <motion.span 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            className="block text-mono text-gold text-[10px] tracking-[0.6em] uppercase font-black"
          >
            {item.tag}
          </motion.span>
        </div>
        
        <div className="overflow-hidden">
          <motion.h3 
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-white text-3xl md:text-5xl font-serif italic"
          >
            {item.title}
          </motion.h3>
        </div>
        
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: '4rem' }}
          className="h-[1px] bg-gold/50 mt-8" 
        />
      </div>

      {/* Internal Glass Shine */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-tr from-white/5 via-transparent to-white/5 pointer-events-none" />
      
      {/* Edge Highlight */}
      <div className="absolute inset-px border border-white/10 rounded-[2.5rem] pointer-events-none" />
    </motion.div>
  );
}

export default function KineticGallery() {
  const { t, lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mX = useMotionValue(0);
  const mY = useMotionValue(0);
  const spotlightX = useSpring(mX, { stiffness: 50, damping: 20 });
  const spotlightY = useSpring(mY, { stiffness: 50, damping: 20 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const xTranslation = useTransform(scrollYProgress, [0, 1], ["30%", "-50%"]);
  const springTranslation = useSpring(xTranslation, { stiffness: 30, damping: 25 });

  const handleGlobalMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mX.set(e.clientX - rect.left);
    mY.set(e.clientY - rect.top);
  };

  return (
    <section 
      ref={containerRef} 
      onMouseMove={handleGlobalMouseMove}
      className="relative w-full py-40 overflow-hidden bg-bg"
    >
      {/* ─── Ambient Stage Spotlight ─── */}
      <motion.div 
        style={{ 
          left: spotlightX, 
          top: spotlightY,
          transform: 'translate(-50%, -50%)'
        }}
        className="absolute w-[100vw] h-[100vw] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05),transparent_70%)] pointer-events-none z-0"
      />

      {/* Cinematic Grid Lines */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-gold/10 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-gold/10 to-transparent" />
      </div>

      {/* Section Header */}
      <div className="container-luxury relative z-10 mb-32">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5 }}
          >
            <div className="flex items-center gap-4 mb-8 justify-center md:justify-start">
               <div className="w-12 h-[1px] bg-gold/40" />
               <span className="text-mono text-gold text-[10px] tracking-[1em] uppercase font-black">{t('gallery.label')}</span>
            </div>
            <h2 className="text-6xl md:text-9xl text-white font-serif font-light italic leading-none">
              Visual <br />
              <span className="text-gold shimmer-gold ml-[0.5em]">Archive.</span>
            </h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className={`max-w-md ${lang === 'ar' ? 'text-right' : 'text-left'} border-l border-gold/20 pl-8 py-2`}
          >
            <p className="text-white/50 text-base font-serif italic leading-relaxed">
              "In every grain of rice and every cut of fish, we find the poetry of nature. This archive captures the fleeting beauty of our craft."
            </p>
          </motion.div>
        </div>
      </div>

      {/* The Kinetic Strip Stage */}
      <div className="relative z-10 flex items-center h-[600px] md:h-[900px] overflow-visible">
        <motion.div 
          style={{ x: springTranslation }}
          className="flex gap-16 md:gap-32 px-[15vw]"
        >
          {GALLERY_ITEMS.map((item, idx) => (
            <GalleryItem 
              key={item.id} 
              item={item} 
              index={idx} 
              scrollProgress={scrollYProgress}
              totalItems={GALLERY_ITEMS.length}
            />
          ))}
        </motion.div>
      </div>

      {/* Floating Vertical Accent */}
      <div className="absolute top-1/2 left-12 -translate-y-1/2 hidden xl:flex flex-col items-center gap-12 opacity-30">
        <div className="w-px h-32 bg-gradient-to-b from-transparent to-gold/50" />
        <span className="text-mono text-gold text-[10px] tracking-[1.5em] vertical-text uppercase">KINETIC</span>
        <div className="w-px h-32 bg-gradient-to-t from-transparent to-gold/50" />
      </div>

      {/* Watermark Parallax */}
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], [200, -200]), x: '-10%' }}
        className="absolute bottom-0 left-0 text-[20vw] font-serif text-white/[0.015] pointer-events-none select-none z-0 leading-none"
      >
        SUGI
      </motion.div>
      
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], [-200, 200]), x: '10%' }}
        className="absolute top-0 right-0 text-[20vw] font-serif text-white/[0.015] pointer-events-none select-none z-0 leading-none"
      >
        魂
      </motion.div>

      {/* Interaction Hint */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <span className="text-white/20 text-[8px] uppercase tracking-[0.5em] font-mono">Scroll to Traverse</span>
        <motion.div 
          animate={{ x: [-20, 20, -20] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-12 h-[1px] bg-white/10"
        />
      </div>
    </section>
  );
}
