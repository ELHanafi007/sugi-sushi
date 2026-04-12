'use client';

import { motion } from 'framer-motion';

export default function LandingExperience() {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center bg-background washi overflow-hidden">
      {/* Background Image - Using the alt wallpaper with natural colors */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full w-full bg-[url('/media/optimized/hero-wallpaper-alt-0.jpg')] bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background z-10" />
      </div>

      {/* Elegant Animated Calligraphy (Replacing the logo) */}
      <div className="relative z-30 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="relative"
        >
          {/* Main Sugi Kanji - Luxury Animation */}
          <span className="text-[120px] md:text-[200px] font-serif text-gold drop-shadow-[0_0_30px_rgba(212,175,55,0.4)] select-none">
            杉
          </span>

          {/* Subtle gold particle/glow effect around kanji */}
          <motion.div 
            animate={{ 
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gold/10 blur-[60px] rounded-full"
          />
        </motion.div>

        {/* Elegant Subtitle */}
        <motion.div
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={{ opacity: 0.8, letterSpacing: "0.8em" }}
          transition={{ duration: 2, delay: 1.5 }}
          className="text-foreground text-[10px] md:text-xs uppercase font-light pl-[0.8em] mt-4"
        >
          Artistry in every slice
        </motion.div>
      </div>
    </section>
  );
}

