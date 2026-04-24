'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

const photos = [
  { id: 1, src: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&q=80', title: 'Omakase', desc: 'Chef\'s tasting menu' },
  { id: 2, src: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1200&q=80', title: 'Fresh Sashimi', desc: 'Premium cuts' },
  { id: 3, src: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=1200&q=80', title: 'Ocean Treasures', desc: 'Daily selection' },
  { id: 4, src: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=1200&q=80', title: 'Wagyu Beef', desc: 'A5 grade' },
  { id: 5, src: 'https://images.unsplash.com/photo-1580828369019-2238b909ca8c?w=1200&q=80', title: 'Signature Roll', desc: 'House specialty' },
  { id: 6, src: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db76?w=1200&q=80', title: 'Tempura', desc: 'Crispy perfection' },
  { id: 7, src: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&q=80', title: 'Sashimi Platter', desc: 'Artisan presentation' },
  { id: 8, src: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80', title: 'Zen Interior', desc: 'Minimalist space' },
  { id: 9, src: 'https://images.unsplash.com/photo-1590377435160-c335805f639a?w=1200&q=80', title: 'Sake Collection', desc: 'Premium drinks' },
  { id: 10, src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80', title: 'The Experience', desc: 'Dining at SUGI' },
];

export default function ForcedScrollGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const springProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
  
  const totalSlides = photos.length;
  const currentSlide = useTransform(springProgress, [0, 1], [0, totalSlides - 1]);
  const currentIndex = useMotionValue(0);
  
  useEffect(() => {
    const unsubscribe = springProgress.on('change', (v) => {
      currentIndex.set(Math.floor(v * (totalSlides - 1)));
    });
    return unsubscribe;
  }, [totalSlides]);

  const opacity = useTransform(springProgress, [0, 0.05], [0, 1]);
  const exitOpacity = useTransform(springProgress, [0.95, 1], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-[1000vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ opacity }} className="absolute inset-0 z-50 bg-black" />
        
        <div className="absolute inset-0">
          {photos.map((photo, idx) => (
            <SlideItem 
              key={photo.id} 
              photo={photo} 
              index={idx} 
              progress={springProgress} 
              totalSlides={totalSlides}
            />
          ))}
        </div>

        <motion.div style={{ opacity: exitOpacity }} className="absolute bottom-8 left-0 right-0 z-40 flex justify-center">
          <div className="flex gap-2">
            {photos.map((_, idx) => (
              <Dot key={idx} index={idx} progress={springProgress} total={totalSlides} />
            ))}
          </div>
        </motion.div>

        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
          <motion.div 
            style={{ scaleX: springProgress }}
            className="w-48 h-1 bg-yellow-400/20 rounded-full overflow-hidden"
          >
            <div className="w-full h-full bg-yellow-400" />
          </motion.div>
        </motion.div>

        <div className="absolute bottom-24 left-0 right-0 flex justify-center z-40">
          <motion.span 
            style={{ opacity: useTransform(springProgress, [0, 0.1], [0, 1]) }}
            className="text-white/40 text-xs tracking-[0.3em] uppercase"
          >
            Scroll to explore
          </motion.span>
        </div>
      </div>
    </section>
  );
}

function SlideItem({ photo, index, progress, totalSlides }: { photo: any; index: number; progress: any; totalSlides: number }) {
  const start = index / totalSlides;
  const end = (index + 1) / totalSlides;
  
  const opacity = useTransform(progress, [start - 0.05, start + 0.02, end - 0.02, end + 0.05], [0, 1, 1, 0]);
  const scale = useTransform(progress, [start, end], [1.1, 1]);
  const x = useTransform(progress, [start, end], ['10%', '0%']);
  
  return (
    <motion.div 
      style={{ opacity, scale, x }}
      className="absolute inset-0"
    >
      <Image
        src={photo.src}
        alt={photo.title}
        fill
        className="object-cover"
        sizes="100vw"
        priority={index === 0}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />
      
      <div className="absolute bottom-0 left-0 right-0 p-12 md:p-24">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.span
            style={{ opacity }}
            className="text-yellow-400 text-xs tracking-[0.5em] uppercase font-bold"
          >
            {index + 1} / {totalSlides}
          </motion.span>
          <motion.h2 style={{ opacity }} className="text-4xl md:text-6xl text-white font-serif italic mt-2">
            {photo.title}
          </motion.h2>
          <motion.p style={{ opacity }} className="text-white/60 text-lg mt-2">
            {photo.desc}
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Dot({ index, progress, total }: { index: number; progress: any; total: number }) {
  const isActive = useTransform(progress, (v) => {
    const currentIdx = Math.floor(v * (total - 1));
    return currentIdx === index;
  });
  
  const width = useTransform(progress, (v) => {
    const currentIdx = Math.floor(v * (total - 1));
    return currentIdx === index ? 32 : 8;
  });
  
  return (
    <motion.div
      style={{ width, backgroundColor: isActive ? '#d4af37' : 'rgba(255,255,255,0.3)' }}
      className="h-1 rounded-full transition-all"
    />
  );
}