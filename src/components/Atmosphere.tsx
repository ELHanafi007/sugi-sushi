'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

/**
 * ATMOSPHERE — Cinematic Pause (Masterpiece Edition)
 * 
 * A breathing space that shifts focus from branding to the dining essence.
 * Features:
 * - Mouse-driven ambient spotlight
 * - Enhanced floating particle field
 * - Parallax Kanji depth shift
 */

const FloatingParticle = ({ delay, x, size }: { delay: number; x: string; size: number }) => (
  <motion.div
    className="absolute rounded-full bg-gold/30"
    style={{ left: x, bottom: '-10px', width: size, height: size }}
    animate={{
      y: [0, -1000],
      opacity: [0, 0.8, 0.8, 0],
      scale: [1, 0.4],
      x: [0, Math.random() * 100 - 50, 0],
    }}
    transition={{
      duration: 15 + Math.random() * 10,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

export default function Atmosphere() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the spotlight
  const spotlightX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const spotlightY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const kanjiScale = useTransform(scrollYProgress, [0, 1], [0.9, 1.1]);
  const lineWidth = useTransform(scrollYProgress, [0.15, 0.45], ['0px', '180px']);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[80vh] md:h-[100vh] flex items-center justify-center bg-bg overflow-hidden py-20 md:py-0"
    >
      {/* ─── Mouse-Reactive Spotlight ─── */}
      <motion.div 
        style={{ 
          left: spotlightX, 
          top: spotlightY,
          transform: 'translate(-50%, -50%)'
        }}
        className="absolute w-[120vw] h-[120vw] md:w-[80vw] md:h-[80vw] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06),transparent_70%)] pointer-events-none z-0"
      />

      {/* Background Kanji — Ultra-subtle Parallax */}
      <motion.div 
        style={{ scale: kanjiScale }}
        className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.025] select-none pointer-events-none"
      >
        <span className="text-[30vw] md:text-[50vw] font-serif leading-none tracking-tighter">粋</span>
      </motion.div>

      {/* Floating Particle Field */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {[...Array(6)].map((_, i) => (
          <FloatingParticle 
            key={i} 
            delay={i * 1.2} 
            x={(i * 17) + "%"} // Stable position for initial render
            size={2} // Stable size for initial render
          />
        ))}
      </div>

      {/* Content Orchestration */}
      <motion.div 
        style={{ y, opacity }}
        className="relative z-20 container-luxury text-center"
      >
        <div className="flex flex-col items-center gap-16">
          {/* Animated Focal Line */}
          <motion.div
            style={{ width: lineWidth }}
            className="h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent"
          />
          
          {/* Section Metadata */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="flex flex-col items-center gap-4"
          >
            <span className="text-gold/40 text-[10px] uppercase tracking-[1.5em] font-black font-mono">
              {t('atmosphere.label')}
            </span>
          </motion.div>
          
          {/* The Core Quote */}
          <div className="max-w-5xl mx-auto px-4 md:px-8">
            <motion.h2 
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 2.5, ease: [0.19, 1, 0.22, 1] }}
              className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl text-white/95 font-serif font-light leading-[1.2] md:leading-[1.15] tracking-tight italic"
              dangerouslySetInnerHTML={{ __html: t('atmosphere.quote') }}
            />
          </div>

          {/* Infinity Pulse Separator */}
          <motion.div 
            className="flex flex-col items-center gap-6 mt-12"
          >
            <motion.div 
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.7, 0.3],
                boxShadow: [
                  '0 0 10px rgba(212,175,55,0.2)',
                  '0 0 30px rgba(212,175,55,0.6)',
                  '0 0 10px rgba(212,175,55,0.2)',
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-2 h-2 rounded-full bg-gold/50"
            />
            <div className="w-[1px] h-24 bg-gradient-to-b from-gold/30 to-transparent" />
          </motion.div>
        </div>
      </motion.div>

      {/* Perimeter Vertical Accents */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 0.25, x: 0 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute bottom-24 left-12 hidden lg:block"
      >
        <span className="text-white font-mono text-[10px] tracking-[1em] vertical-text uppercase">{t('atmosphere.silence')}</span>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 0.25, x: 0 }}
        transition={{ duration: 2, delay: 0.8 }}
        className="absolute top-24 right-12 hidden lg:block"
      >
        <span className="text-white font-mono text-[10px] tracking-[1em] vertical-text uppercase">{t('atmosphere.motion')}</span>
      </motion.div>
    </section>
  );
}
