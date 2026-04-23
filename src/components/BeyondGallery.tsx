'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue, 
  AnimatePresence,
  useVelocity,
  MotionValue
} from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { X, Maximize2, Move } from 'lucide-react';

/**
 * BEYOND GALLERY — The Ultimate 3D Sensory Archive
 * 
 * Features:
 * - 3D Depth-Field Navigation (Z-Axis Flight)
 * - Kinetic Physics Displacement
 * - Holographic Glass Morphism
 * - Infinite Momentum Scroll
 * - Immersive Modal Transition
 */

const GALLERY_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&w=1600&q=80',
    titleEn: 'Chef\'s Precision',
    titleAr: 'دقة الشيف',
    tagEn: 'CRAFT',
    tagAr: 'حرفة',
    depth: 0,
    x: -25,
    y: -20,
    size: 'w-[30vw] h-[40vh] md:w-[25vw] md:h-[35vh]'
  },
  {
    src: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=1600&q=80',
    titleEn: 'Ocean Jewels',
    titleAr: 'جواهر المحيط',
    tagEn: 'FRESH',
    tagAr: 'طازج',
    depth: -600,
    x: 20,
    y: 15,
    size: 'w-[35vw] h-[45vh] md:w-[20vw] md:h-[30vh]'
  },
  {
    src: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1600&q=80',
    titleEn: 'Nigiri Artistry',
    titleAr: 'فن النيجيري',
    tagEn: 'SIGNATURE',
    tagAr: 'التوقيع',
    depth: -1200,
    x: -15,
    y: 35,
    size: 'w-[40vw] h-[50vh] md:w-[30vw] md:h-[40vh]'
  },
  {
    src: 'https://images.unsplash.com/photo-1562158070-57ad9956b86a?auto=format&fit=crop&w=1600&q=80',
    titleEn: 'The Sanctuary',
    titleAr: 'الملاذ',
    tagEn: 'AMBIENCE',
    tagAr: 'أجواء',
    depth: -1800,
    x: 30,
    y: -25,
    size: 'w-[45vw] h-[55vh] md:w-[35vw] md:h-[45vh]'
  },
  {
    src: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&w=1600&q=80',
    titleEn: 'Knife & Fire',
    titleAr: 'السكين والنار',
    tagEn: 'STAGECRAFT',
    tagAr: 'عرض',
    depth: -2400,
    x: -30,
    y: 0,
    size: 'w-[32vw] h-[42vh] md:w-[22vw] md:h-[32vh]'
  },
  {
    src: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?auto=format&fit=crop&w=1600&q=80',
    titleEn: 'Umami Soul',
    titleAr: 'روح الأومامي',
    tagEn: 'SENSATION',
    tagAr: 'إحساس',
    depth: -3000,
    x: 10,
    y: -35,
    size: 'w-[38vw] h-[48vh] md:w-[28vw] md:h-[38vh]'
  },
  {
    src: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=1600&q=80',
    titleEn: 'Midnight Glow',
    titleAr: 'توهج منتصف الليل',
    tagEn: 'EVENING',
    tagAr: 'مساء',
    depth: -3600,
    x: -10,
    y: 25,
    size: 'w-[32vw] h-[42vh] md:w-[22vw] md:h-[32vh]'
  },
  {
    src: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1600&q=80',
    titleEn: 'Symmetry',
    titleAr: 'تناسق',
    tagEn: 'FORM',
    tagAr: 'شكل',
    depth: -4200,
    x: 25,
    y: 5,
    size: 'w-[42vw] h-[52vh] md:w-[32vw] md:h-[42vh]'
  },
];

const Particles = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      z: Math.random() * -5000,
      size: Math.random() * 2 + 1,
    }));
  }, []);

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${50 + p.x}%`,
            top: `${50 + p.y}%`,
            translateZ: p.z,
            width: p.size,
            height: p.size,
            backgroundColor: '#d4af37',
            borderRadius: '50%',
            opacity: 0.3,
          }}
        />
      ))}
    </>
  );
};

interface GalleryItemProps {
  item: typeof GALLERY_IMAGES[0];
  index: number;
  scrollYProgress: MotionValue<number>;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  isRTL: boolean;
  onSelect: (item: any) => void;
}

const GalleryItem = ({ item, index, scrollYProgress, mouseX, mouseY, isRTL, onSelect }: GalleryItemProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Depth calculation: move along Z-axis as we scroll
  const z = useTransform(scrollYProgress, [0, 1], [item.depth, item.depth + 5500]);
  
  // Opacity: fade in as they approach, fade out as they fly past
  const opacity = useTransform(
    z,
    [item.depth - 200, item.depth + 300, item.depth + 4500, item.depth + 5000],
    [0, 1, 1, 0]
  );

  // Parallax based on mouse
  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });
  
  // Subtle rotation based on mouse
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

  return (
    <motion.div
      ref={containerRef}
      style={{
        position: 'absolute',
        left: `${50 + item.x}%`,
        top: `${50 + item.y}%`,
        z,
        opacity,
        rotateX,
        rotateY,
        x: '-50%',
        y: '-50%',
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.05, transition: { duration: 0.4 } }}
      onClick={() => onSelect(item)}
      className={`${item.size} cursor-none group z-10`}
    >
      <div className="relative w-full h-full rounded-[1.5rem] md:rounded-[2rem] overflow-hidden luxury-card border-white/5 bg-black/40 backdrop-blur-sm shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <Image
          src={item.src}
          alt={isRTL ? item.titleAr : item.titleEn}
          fill
          className="object-cover transition-transform duration-[2s] group-hover:scale-110 brightness-[0.7] group-hover:brightness-100"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        
        {/* Holographic Scanline */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(212,175,55,0.05)_50%,transparent_100%)] bg-[length:100%_4px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700 bg-gradient-to-t from-black/90 to-transparent">
          <p className="text-gold text-[8px] md:text-[10px] tracking-[0.4em] font-mono mb-2 uppercase">
            {isRTL ? item.tagAr : item.tagEn}
          </p>
          <h3 className="text-white text-xl md:text-2xl font-serif italic leading-tight">
            {isRTL ? item.titleAr : item.titleEn}
          </h3>
        </div>

        {/* Ambient Glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(212,175,55,0.1),transparent_70%)] pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default function BeyondGallery() {
  const { isRTL, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<typeof GALLERY_IMAGES[0] | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [isRevealing, setIsRevealing] = useState(true);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Lock scroll during intro
  useEffect(() => {
    if (isRevealing) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        setIsRevealing(false);
        document.body.style.overflow = '';
      }, 3000);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    }
  }, [isRevealing]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 50, damping: 30 });
  const skew = useTransform(smoothVelocity, [-1, 1], [-10, 10]);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth) - 0.5);
    mouseY.set((clientY / innerHeight) - 0.5);
  };

  // Custom cursor position
  const cursorX = useSpring(useMotionValue(0), { stiffness: 400, damping: 40 });
  const cursorY = useSpring(useMotionValue(0), { stiffness: 400, damping: 40 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <section 
      ref={containerRef} 
      className={`relative h-[700vh] bg-[#020203] overflow-hidden ${isTouch ? 'cursor-auto' : 'cursor-none'}`}
      onMouseMove={handleMouseMove}
    >
      {/* Intro Reveal Overlay */}
      <AnimatePresence>
        {isRevealing && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="fixed inset-0 z-[1000] bg-black flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-6">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 200 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-[1px] bg-gold"
              />
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gold text-[10px] tracking-[1em] font-mono uppercase"
              >
                Initializing Archive
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Stage Container */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden perspective-[1500px]">
        
        {/* Dynamic Background Grid */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05),transparent_80%)]" />
          <motion.div 
            style={{ 
              rotateX: useTransform(mouseY, [-0.5, 0.5], [10, -10]),
              rotateY: useTransform(mouseX, [-0.5, 0.5], [-10, 10]),
              opacity: useTransform(scrollYProgress, [0, 0.1], [0.3, 0.1])
            }}
            className="absolute inset-0"
          >
             <div className="w-full h-full opacity-20" 
                  style={{ backgroundImage: 'linear-gradient(rgba(212,175,55,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.1) 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
          </motion.div>
        </div>

        {/* HUD Elements */}
        <div className="absolute inset-0 pointer-events-none z-50">
          {/* Top Info */}
          <div className="absolute top-12 left-12 right-12 flex justify-between items-start">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-px bg-gold" />
                <span className="text-gold text-[10px] tracking-[1.2em] font-mono uppercase">Archive v.02</span>
              </div>
              <h2 className="text-white text-3xl md:text-5xl font-serif italic font-light">The Sensory Tunnel</h2>
            </motion.div>
            
            <div className="hidden md:flex flex-col items-end gap-1 font-mono text-[8px] text-white/40 tracking-[0.5em] uppercase">
              <span>System.Core: Active</span>
              <span>Coordinate.Z: {Math.round(scrollYProgress.get() * 10000)}m</span>
              <span>Vector.Stability: Nominal</span>
            </div>
          </div>

          {/* Bottom Indicators */}
          <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
             <div className="flex flex-col gap-4">
               <div className="flex items-center gap-6">
                 {[1,2,3].map(i => (
                   <motion.div 
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                    className="w-1.5 h-1.5 bg-gold rounded-full" 
                   />
                 ))}
               </div>
               <span className="text-[10px] text-white/30 font-mono tracking-[0.8em] uppercase">Kinetic Stream</span>
             </div>

             <div className="flex flex-col items-center gap-4">
                <div className="w-48 h-[2px] bg-white/5 relative overflow-hidden">
                  <motion.div 
                    style={{ scaleX: scrollYProgress }}
                    className="absolute inset-0 bg-gold origin-left"
                  />
                </div>
                <span className="text-[10px] text-gold font-mono tracking-widest">{Math.round(scrollYProgress.get() * 100)}% EXPLORED</span>
             </div>
          </div>
        </div>

        {/* 3D World */}
        <motion.div 
          style={{ 
            transformStyle: 'preserve-3d',
            skewY: skew 
          }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <Particles />
          {GALLERY_IMAGES.map((item, idx) => (
            <GalleryItem 
              key={idx} 
              item={item} 
              index={idx} 
              scrollYProgress={scrollYProgress}
              mouseX={mouseX}
              mouseY={mouseY}
              isRTL={isRTL}
              onSelect={setSelectedItem}
            />
          ))}
        </motion.div>

        {/* Immersive Text Layers */}
        <motion.div
          style={{
            z: useTransform(scrollYProgress, [0, 1], [-1000, 3000]),
            opacity: useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 0.03, 0])
          }}
          className="absolute pointer-events-none text-[25vw] font-serif italic text-white select-none whitespace-nowrap"
        >
          MASTERY IN MOTION
        </motion.div>
      </div>

      {/* Custom Cursor */}
      {!isTouch && (
        <motion.div
          style={{
            x: cursorX,
            y: cursorY,
            translateX: '-50%',
            translateY: '-50%',
          }}
          className="fixed top-0 left-0 w-16 h-16 border border-gold/30 rounded-full z-[9999] pointer-events-none flex items-center justify-center backdrop-blur-[1px]"
        >
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1 h-1 bg-gold rounded-full shadow-[0_0_10px_#d4af37]" 
          />
          
          <div className="absolute inset-0 border-[0.5px] border-gold/10 rounded-full animate-spin-slow" />
          
          <div className="absolute -top-8 text-[8px] font-mono text-gold tracking-widest opacity-40 uppercase">
             Discover
          </div>
        </motion.div>
      )}

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-12 modal-glass"
          >
            <motion.div
              layoutId={`img-${selectedItem.src}`}
              className="relative w-full max-w-6xl aspect-[16/10] rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10"
            >
              <Image
                src={selectedItem.src}
                alt={isRTL ? selectedItem.titleAr : selectedItem.titleEn}
                fill
                className="object-cover"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-16">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-gold text-xs md:text-sm tracking-[0.5em] font-mono mb-4 uppercase">
                    {isRTL ? selectedItem.tagAr : selectedItem.tagEn}
                  </p>
                  <h2 className="text-white text-3xl md:text-7xl font-serif italic mb-8 leading-tight">
                    {isRTL ? selectedItem.titleAr : selectedItem.titleEn}
                  </h2>
                  <div className="w-24 h-[1px] bg-gold/50" />
                </motion.div>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-gold transition-all duration-500 group border border-white/10"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </motion.div>
            
            <div 
              className="absolute inset-0 -z-10 cursor-zoom-out" 
              onClick={() => setSelectedItem(null)} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </section>
  );
}
