'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

const sushiPhotos = [
  { id: 1, src: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&q=80', title: 'Omakase Selection', desc: 'Chef\'s tasting menu' },
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

export default function ImmersiveGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sushiPhotos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goTo = (index: number) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const goNext = () => goTo((activeIndex + 1) % sushiPhotos.length);
  const goPrev = () => goTo((activeIndex - 1 + sushiPhotos.length) % sushiPhotos.length);

  const currentPhoto = sushiPhotos[activeIndex];

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden">
      <div ref={containerRef} className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhoto.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <Image
              src={currentPhoto.src}
              alt={currentPhoto.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute bottom-0 left-0 right-0 p-8 md:p-16"
        >
          <div className="max-w-4xl">
            <motion.span
              key={`tag-${activeIndex}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-yellow-400 text-xs tracking-[0.5em] uppercase font-bold"
            >
              Gallery
            </motion.span>
            <motion.h2
              key={`title-${activeIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl text-white font-serif italic mt-2"
            >
              {currentPhoto.title}
            </motion.h2>
            <motion.p
              key={`desc-${activeIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/60 text-lg mt-2"
            >
              {currentPhoto.desc}
            </motion.p>
          </div>
        </motion.div>

        <div className="absolute bottom-8 right-8 flex items-center gap-4">
          <button
            onClick={goPrev}
            className="w-12 h-12 rounded-full border border-white/20 bg-black/30 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {sushiPhotos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`transition-all duration-300 ${
                  idx === activeIndex
                    ? 'w-8 bg-yellow-400'
                    : 'w-2 bg-white/30 hover:bg-white/50'
                } h-2 rounded-full`}
              />
            ))}
          </div>
          <button
            onClick={goNext}
            className="w-12 h-12 rounded-full border border-white/20 bg-black/30 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            key={`progress-${activeIndex}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 4, ease: 'linear' }}
            className="w-32 h-1 bg-yellow-400/30 rounded-full overflow-hidden"
          >
            <div className="w-full h-full bg-yellow-400" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}