'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

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
        {/* Subtle overlay only to ensure text contrast */}
        <div className="absolute inset-0 bg-black/20 z-10" />
      </div>
      
      {/* Centered Brand Moment */}
      <div className="relative z-30 flex flex-col items-center gap-6 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="flex flex-col items-center"
        >
          {/* THE REAL LOGO */}
          <div className="relative w-64 h-32 md:w-96 md:h-48 drop-shadow-2xl">
            <Image 
              src="/media/optimized/brand-logo.png" 
              alt="Sugi Logo" 
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="text-foreground text-[10px] md:text-xs tracking-[0.5em] md:tracking-[0.8em] uppercase font-light drop-shadow-lg pl-[0.5em] md:pl-[0.8em] opacity-80"
        >
          Artistry in every slice
        </motion.p>
      </div>

      {/* Background Kanji - Subtler */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vh] md:text-[50vh] text-white/[0.04] font-serif pointer-events-none z-10">
        杉
      </div>
    </section>
  );
}
