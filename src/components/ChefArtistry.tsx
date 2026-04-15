'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

/**
 * CHEF ARTISTRY - Emotional Peak Moment
 * 
 * DESIGN: Full-screen cinematic immersion. High contrast, slow motion.
 * FOCUS: The human element and the precision of the craft.
 */

export default function ChefArtistry() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[120vh] bg-black overflow-hidden flex items-center justify-center"
    >
      {/* Cinematic Background (Climax) */}
      <motion.div 
        style={{ scale, opacity }}
        className="absolute inset-0 z-0"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60 grayscale-[0.5] contrast-125"
        >
          <source src="/videos/sushi-hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {/* Narrative Overlay */}
      <div className="container-luxury relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-start-2 lg:col-span-10 text-center">
            <motion.div style={{ y: textY }}>
              <span className="text-mono text-gold/60 mb-12 block">The Hand of the Master</span>
              <h2 className="text-display text-white mb-16 drop-shadow-2xl">
                PRECISION <br /> 
                <span className="text-gold italic">&</span> SOUL
              </h2>
              
              <div className="flex flex-col items-center gap-12">
                <div className="w-px h-32 bg-gradient-to-b from-gold/40 to-transparent" />
                <p className="text-h3 text-white/40 max-w-3xl font-serif italic">
                  "In the silence of the kitchen, every cut is a conversation between the ocean and the blade."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative Accents */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 opacity-20 hidden lg:block">
        <span className="text-mono vertical-text text-white tracking-[1em]">ARTISTRY</span>
      </div>
      <div className="absolute top-1/2 right-10 -translate-y-1/2 opacity-20 hidden lg:block">
        <span className="text-mono vertical-text text-white tracking-[1em]">CRAFTSMANSHIP</span>
      </div>
      
      {/* Climax Visual Break */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 border-[20px] border-black/40 pointer-events-none" 
      />
    </section>
  );
}
