'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

/**
 * KINETIC GALLERY — Cinematic Visual Archive (Forced Horizontal Edition)
 * 
 * This version uses a sticky container pattern to force the user to experience 
 * the horizontal scroll before moving to the next section.
 */

interface GalleryItemProps {
  item: {
    id: number;
    src: string;
    title: string;
    tag: string;
    aspect: string;
    parallax: number;
  };
  index: number;
  scrollProgress: any;
  totalItems: number;
}

function GalleryItem({ item, index, scrollProgress, totalItems }: GalleryItemProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  // Subtle parallax effect for individual items
  const itemParallax = useTransform(scrollProgress, [0, 1], [50 * item.parallax, -50 * item.parallax]);
  
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
        y: itemParallax,
        rotateX: springY,
        rotateY: springX,
        perspective: 1000
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative flex-shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] ${item.aspect} rounded-[2.5rem] overflow-hidden group luxury-card shadow-2xl transition-shadow duration-500 hover:shadow-gold/10`}
    >
      <Image
        src={item.src}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-[8s] ease-out group-hover:scale-110 brightness-[0.7] group-hover:brightness-[0.9]"
      />
      
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

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-tr from-white/5 via-transparent to-white/5 pointer-events-none" />
      <div className="absolute inset-px border border-white/10 rounded-[2.5rem] pointer-events-none" />
    </motion.div>
  );
}

export default function KineticGallery() {
  const { t } = useLanguage();
  const targetRef = useRef<HTMLDivElement>(null);

  const galleryItems = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
      title: 'The Sanctuary',
      tag: 'INTERIOR',
      aspect: 'aspect-[16/9]',
      parallax: 0.15,
      z: 50,
      scale: 1.1
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1600&q=80',
      title: 'Master\'s Focus',
      tag: 'CRAFT',
      aspect: 'aspect-[4/5]',
      parallax: -0.2,
      z: 20,
      scale: 0.9
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1600&q=80',
      title: 'Umami Symphony',
      tag: 'NIGIRI',
      aspect: 'aspect-square',
      parallax: 0.3,
      z: 80,
      scale: 1.2
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=1600&q=80',
      title: 'The Steam',
      tag: 'NOODLES',
      aspect: 'aspect-[3/4]',
      parallax: -0.1,
      z: 30,
      scale: 0.95
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db76?auto=format&fit=crop&w=1600&q=80',
      title: 'Temporal Grace',
      tag: 'SETTING',
      aspect: 'aspect-[16/9]',
      parallax: 0.25,
      z: 60,
      scale: 1.05
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1600&q=80',
      title: 'Raw Artistry',
      tag: 'SASHIMI',
      aspect: 'aspect-square',
      parallax: -0.3,
      z: 10,
      scale: 0.85
    },
    {
      id: 7,
      src: 'https://images.unsplash.com/photo-1580828369019-2238b909ca8c?auto=format&fit=crop&w=1600&q=80',
      title: 'Shadow & Light',
      tag: 'ATMOSPHERE',
      aspect: 'aspect-[4/5]',
      parallax: 0.4,
      z: 100,
      scale: 1.3
    },
    {
      id: 8,
      src: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&w=1600&q=80',
      title: 'Ocean\'s Gift',
      tag: 'COLLECTION',
      aspect: 'aspect-[3/4]',
      parallax: -0.15,
      z: 40,
      scale: 0.9
    },
    {
      id: 9,
      src: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80',
      title: 'Zen Passage',
      tag: 'GARDEN',
      aspect: 'aspect-[16/9]',
      parallax: 0.2,
      z: 70,
      scale: 1.1
    },
    {
      id: 10,
      src: 'https://images.unsplash.com/photo-1590377435160-c335805f639a?auto=format&fit=crop&w=1600&q=80',
      title: 'Liquid Gold',
      tag: 'ELIXIR',
      aspect: 'aspect-square',
      parallax: -0.05,
      z: 25,
      scale: 0.95
    }
  ];

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0.1, 0.95], ["0%", "-350%"]);
  const xSpring = useSpring(x, { stiffness: 45, damping: 25, mass: 0.5 });

  const mX = useMotionValue(0);
  const mY = useMotionValue(0);
  const spotlightX = useSpring(mX, { stiffness: 50, damping: 20 });
  const spotlightY = useSpring(mY, { stiffness: 50, damping: 20 });

  const handleGlobalMouseMove = (e: React.MouseEvent) => {
    const rect = targetRef.current?.getBoundingClientRect();
    if (!rect) return;
    mX.set(e.clientX - rect.left);
    mY.set(e.clientY - rect.top);
  };

  return (
    <section ref={targetRef} className="relative h-[800vh] bg-bg z-[50]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden" onMouseMove={handleGlobalMouseMove}>
        
        <motion.div 
          style={{ 
            left: spotlightX, 
            top: spotlightY,
            transform: 'translate(-50%, -50%)'
          }}
          className="absolute w-[100vw] h-[100vw] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06),transparent_70%)] pointer-events-none z-0"
        />

        <motion.div 
          style={{ 
            opacity: useTransform(scrollYProgress, [0, 0.1, 0.95, 1], [0, 1, 1, 0]) 
          }}
          className="absolute inset-0 z-[5] pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,0.8)]"
        />

        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-gold/10 to-transparent" />
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-gold/10 to-transparent" />
        </div>

        <div className="flex flex-col h-full w-full justify-center">
          
          <motion.div 
            style={{ 
              opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]),
              y: useTransform(scrollYProgress, [0, 0.05], [0, -50])
            }}
            className="container-luxury mb-12 absolute top-24 left-0 right-0 z-20"
          >
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.5 }}
              >
                <div className="flex items-center gap-4 mb-4 justify-center md:justify-start">
                  <div className="w-12 h-[1px] bg-gold/40" />
                  <span className="text-mono text-gold text-[10px] tracking-[1em] uppercase font-black">{t('gallery.label')}</span>
                </div>
                <h2 className="text-4xl md:text-8xl text-white font-serif font-light italic leading-none">
                  Visual <br />
                  <span className="text-gold shimmer-gold ml-[0.5em]">Archive.</span>
                </h2>
              </motion.div>
            </div>
          </motion.div>

          <div className="relative flex items-center">
            <motion.div 
              style={{ x: xSpring }} 
              className="flex gap-[10vw] px-[30vw] items-center"
            >
              {galleryItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  style={{
                    y: useTransform(scrollYProgress, [0, 1], [100 * item.parallax, -100 * item.parallax]),
                    // @ts-ignore
                    z: item.z,
                    // @ts-ignore
                    scale: item.scale,
                    marginLeft: idx % 2 === 0 ? '0' : '-5vw',
                    // @ts-ignore
                    zIndex: item.z
                  }}
                  className="flex-shrink-0"
                >
                  <GalleryItem 
                    item={item} 
                    index={idx} 
                    scrollProgress={scrollYProgress}
                    totalItems={galleryItems.length}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="container-luxury absolute bottom-12 left-0 right-0 z-20 flex justify-between items-end">
            <motion.div 
              style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [0.3, 1]) }}
              className="hidden xl:flex flex-col gap-4"
            >
              <span className="text-mono text-gold text-[10px] tracking-[1.5em] uppercase">DEPTH ARCHIVE</span>
              <div className="w-px h-16 bg-gradient-to-t from-gold/50 to-transparent" />
            </motion.div>

            <div className="flex flex-col items-center gap-4">
              <motion.span 
                style={{ opacity: useTransform(scrollYProgress, [0.1, 0.9], [0.5, 1]) }}
                className="text-white/40 text-[8px] uppercase tracking-[0.5em] font-mono"
              >
                {scrollYProgress.get() > 0.95 ? 'Exploration Complete' : 'Traversing the Sensory Archive'}
              </motion.span>
              <div className="w-80 h-[1px] bg-white/5 relative overflow-hidden">
                <motion.div 
                  style={{ scaleX: scrollYProgress }}
                  className="absolute inset-0 bg-gold origin-left"
                />
              </div>
            </div>

            <div className="text-right">
               <span className="text-mono text-white/10 text-[10px] tracking-[1em] uppercase">Archive No. 24-02</span>
            </div>
          </div>
        </div>

        <motion.div 
          style={{ 
            x: useTransform(scrollYProgress, [0, 1], ["40%", "-80%"]),
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.01, 0.03, 0.01]) 
          }}
          className="absolute bottom-0 left-0 text-[35vw] font-serif text-white pointer-events-none select-none z-0 leading-none"
        >
          SUGI SUSHI 魂
        </motion.div>
      </div>
    </section>
  );
}
