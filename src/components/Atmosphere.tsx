'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

/**
 * ATMOSPHERE — Cinematic Pause
 * 
 * A breathing space that shifts focus from branding to the dining essence.
 * Features floating particles and a slow-reveal quote.
 */

const FloatingParticle = ({ delay, x, size }: { delay: number; x: string; size: number }) => (
  <motion.div
    className="absolute rounded-full bg-gold/20"
    style={{ left: x, bottom: '-10px', width: size, height: size }}
    animate={{
      y: [0, -800],
      opacity: [0, 0.6, 0.6, 0],
      scale: [1, 0.5],
    }}
    transition={{
      duration: 12 + Math.random() * 8,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
  />
);

export default function Atmosphere() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 1.04]);
  const lineWidth = useTransform(scrollYProgress, [0.2, 0.5], ['0%', '100%']);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[85vh] flex items-center justify-center bg-bg overflow-hidden"
    >
      {/* Background Kanji — Ultra-subtle */}
      <motion.div 
        style={{ scale }}
        className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.015] select-none pointer-events-none"
      >
        <span className="text-[45vw] font-serif leading-none">粋</span>
      </motion.div>

      {/* Ambient Light Rays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70vw] h-[50vh] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.03),transparent_60%)]" />
        <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingParticle delay={0} x="15%" size={2} />
        <FloatingParticle delay={2} x="30%" size={1.5} />
        <FloatingParticle delay={4} x="55%" size={2} />
        <FloatingParticle delay={1} x="70%" size={1} />
        <FloatingParticle delay={6} x="85%" size={1.5} />
        <FloatingParticle delay={3} x="42%" size={1} />
        <FloatingParticle delay={5} x="8%" size={2} />
        <FloatingParticle delay={7} x="92%" size={1.5} />
      </div>

      {/* Content */}
      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 container-luxury text-center"
      >
        <div className="flex flex-col items-center gap-12 md:gap-16">
          {/* Expanding line */}
          <motion.div
            style={{ width: lineWidth }}
            className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent max-w-[6rem]"
          />
          
          {/* Label */}
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-gold/30 text-[9px] uppercase tracking-[1.2em] font-bold font-mono block"
          >
            The Atmosphere
          </motion.span>
          
          {/* Quote */}
          <div className="max-w-4xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
              className="text-white/90 text-3xl md:text-6xl lg:text-7xl font-serif font-light leading-[1.15] tracking-tight italic"
            >
              &quot;A sanctuary where{' '}
              <span className="text-gold">time slows</span>,{' '}
              and every flavor tells a story of{' '}
              <span className="text-gold/80">tradition</span>.&quot;
            </motion.h2>
          </div>

          {/* Breathing dot separator */}
          <motion.div 
            className="flex flex-col items-center gap-4 mt-8"
          >
            <motion.div 
              animate={{ 
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.3, 1],
                boxShadow: [
                  '0 0 4px rgba(212,175,55,0.1)',
                  '0 0 16px rgba(212,175,55,0.4)',
                  '0 0 4px rgba(212,175,55,0.1)',
                ]
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-gold/30"
            />
            <div className="w-px h-16 bg-gradient-to-b from-gold/20 to-transparent" />
          </motion.div>
        </div>
      </motion.div>

      {/* Side Text Accents */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.06 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute bottom-16 left-8 hidden lg:block"
      >
        <span className="text-white font-mono text-[9px] tracking-[0.6em] vertical-text uppercase">Silence</span>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.06 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 0.8 }}
        className="absolute top-16 right-8 hidden lg:block"
      >
        <span className="text-white font-mono text-[9px] tracking-[0.6em] vertical-text uppercase">Motion</span>
      </motion.div>
    </section>
  );
}
