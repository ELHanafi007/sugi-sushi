'use client';

import { motion, Variants } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Autoplay failed:", error);
      });
    }
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* ─── Background Video ─── */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-100"
      >
        <source src="/videos/sushi-hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* ─── Dark Overlay ─── */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] z-10 pointer-events-none" />

      {/* ─── Content ─── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 flex flex-col items-center text-center px-4"
      >
        <motion.h1
          variants={itemVariants}
          className="text-white text-5xl md:text-8xl font-serif tracking-[0.3em] font-light mb-6"
        >
          SUGI SUSHI
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-white/80 text-sm md:text-lg uppercase tracking-[0.4em] font-serif max-w-2xl mb-12"
        >
          A Luxury Japanese Dining Experience in Saudi Arabia
        </motion.p>

        <motion.div variants={itemVariants}>
          <a
            href="#menu"
            className="group relative inline-flex items-center gap-6 px-10 py-5 rounded-full border border-white/20 bg-white/5 
                       backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-gold/50 hover:bg-gold/10 active:scale-95"
          >
            <span className="relative text-white text-[12px] uppercase tracking-[0.4em] font-bold group-hover:text-gold transition-colors">
              Enter Menu
            </span>
            <svg 
              className="w-5 h-5 text-white group-hover:text-gold group-hover:translate-x-2 transition-all duration-500" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </motion.div>

      {/* ─── Decorative Status Line ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4"
      >
        <div className="w-px h-12 bg-gradient-to-b from-white/0 via-white/30 to-white/0" />
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-1.5 h-1.5 rounded-full bg-gold/60 shadow-[0_0_12px_rgba(201,168,76,0.3)]"
        />
      </motion.div>
    </section>
  );
}
