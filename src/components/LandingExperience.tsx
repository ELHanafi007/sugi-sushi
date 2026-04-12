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
        {/* Advanced Readability Layer: Radial darkening in the center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(13,13,13,0.4)_0%,rgba(13,13,13,0.1)_100%)] z-10" />
        {/* Bottom fade to transition into menu */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10" />
      </div>

      {/* Elegant Animated Calligraphy (Replacing the logo) */}
      <div className="relative z-30 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="relative"
        >
          {/* Main Sugi Kanji - Enhanced with heavy luxury drop shadow for readability */}
          <span className="text-[120px] md:text-[200px] font-serif text-gold select-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)] filter gold-glow">
            杉
          </span>

          {/* Subtle gold particle/glow effect around kanji */}
          <motion.div 
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gold/5 blur-[60px] rounded-full -z-10"
          />
        </motion.div>

        {/* Elegant Subtitle - Enhanced font weight and shadow */}
        <motion.div
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={{ opacity: 1, letterSpacing: "0.8em" }}
          transition={{ duration: 2, delay: 1.5 }}
          className="text-foreground text-[11px] md:text-sm uppercase font-medium pl-[0.8em] mt-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
        >
          Artistry in every slice
        </motion.div>
      </div>
    </section>
  );
}
