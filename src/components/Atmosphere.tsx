'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

/**
 * ATMOSPHERE SECTION
 * 
 * PURPOSE: A cinematic pause that shifts the focus from branding to the essence of the dining experience.
 */

export default function Atmosphere() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 1.05]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[90vh] flex items-center justify-center bg-bg overflow-hidden"
    >
      {/* Background Zen Element - Large and Subtle */}
      <motion.div 
        style={{ scale }}
        className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.02]"
      >
        <span className="text-[50vw] font-serif select-none pointer-events-none leading-none">粋</span>
      </motion.div>

      {/* Cinematic Light Rays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-gold/[0.03] via-transparent to-transparent opacity-50" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(226,183,20,0.05),transparent_60%)]" />

      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 container-luxury text-center"
      >
        <div className="flex flex-col items-center gap-16">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '4rem' }}
            transition={{ duration: 1.5 }}
            className="h-px bg-gold/30"
          />
          
          <div className="max-w-5xl mx-auto">
            <span className="text-gold/30 text-[10px] uppercase tracking-[1em] mb-12 block font-bold">The Atmosphere</span>
            <h2 className="text-white text-4xl md:text-7xl lg:text-8xl font-serif font-light leading-[1.1] tracking-tight italic">
              "A sanctuary where <span className="text-gold">time slows down</span>, and every flavor tells a story of tradition."
            </h2>
          </div>

          <motion.div 
            animate={{ 
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-gold/20" />
            <div className="w-px h-24 bg-gradient-to-b from-gold/30 to-transparent" />
          </motion.div>
        </div>
      </motion.div>

      {/* Ambient Floating Elements */}
      <div className="absolute bottom-20 left-20 opacity-10">
        <span className="text-white font-serif text-sm tracking-[0.5em] vertical-text uppercase">Silence</span>
      </div>
      <div className="absolute top-20 right-20 opacity-10">
        <span className="text-white font-serif text-sm tracking-[0.5em] vertical-text uppercase">Motion</span>
      </div>
    </section>
  );
}
