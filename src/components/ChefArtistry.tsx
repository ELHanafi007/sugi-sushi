'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

/**
 * CHEF ARTISTRY — Emotional Peak
 * 
 * Full-screen cinematic immersion. High contrast, dramatic parallax.
 * The human element — precision of the craft.
 */

export default function ChefArtistry() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.05]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0.1, 0.9], [80, -80]);
  const imageFilter = useTransform(scrollYProgress, [0, 0.3], [10, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[110vh] bg-black overflow-hidden flex items-center justify-center"
    >
      {/* Cinematic Background */}
      <motion.div 
        style={{ scale, opacity }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/media/optimized/hero-wallpaper-alt-0.jpg"
          alt="Chef crafting sushi with precision"
          fill
          className="object-cover opacity-50 contrast-110 saturate-[0.7]"
        />
        {/* Cinematic grading overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
        <div className="absolute inset-0 bg-black/10" />
        {/* Gold tint for warmth */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.03] via-transparent to-transparent" />
      </motion.div>

      {/* Main Content */}
      <div className="container-luxury relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-start-2 lg:col-span-10 text-center">
            <motion.div style={{ y: textY }}>
              {/* Label */}
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
                className="text-mono text-gold/50 mb-10 block tracking-[0.8em] text-[8px]"
              >
                The Hand of the Master
              </motion.span>

              {/* Title */}
              <motion.h2 
                initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
                className="text-display text-white mb-14 drop-shadow-2xl"
              >
                PRECISION <br className="hidden md:block" /> 
                <span className="shimmer-gold italic font-light text-[0.6em]">&</span>{' '}
                <span className="text-gold">SOUL</span>
              </motion.h2>
              
              {/* Quote */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 0.6 }}
                className="flex flex-col items-center gap-8"
              >
                <div className="w-px h-20 bg-gradient-to-b from-gold/30 via-gold/10 to-transparent" />
                <p className="text-lg md:text-xl lg:text-2xl text-white/35 max-w-2xl font-serif italic leading-relaxed">
                  &quot;In the silence of the kitchen, every cut is a conversation between the ocean and the blade.&quot;
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Side Labels */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.1 }}
        viewport={{ once: true }}
        transition={{ duration: 2 }}
        className="absolute top-1/2 left-8 -translate-y-1/2 hidden lg:block"
      >
        <span className="text-mono vertical-text text-white tracking-[1em] text-[8px]">ARTISTRY</span>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 0.3 }}
        className="absolute top-1/2 right-8 -translate-y-1/2 hidden lg:block"
      >
        <span className="text-mono vertical-text text-white tracking-[1em] text-[8px]">CRAFTSMANSHIP</span>
      </motion.div>
      
      {/* Cinematic Frame */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 2.5 }}
        className="absolute inset-4 md:inset-8 border border-white/[0.03] pointer-events-none rounded-lg" 
      />

      {/* Bottom edge fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent z-10" />
    </section>
  );
}
