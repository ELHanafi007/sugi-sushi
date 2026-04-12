'use client';

import { motion } from 'framer-motion';

export default function LandingExperience() {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center bg-background washi overflow-hidden">
      {/* Background Image - Using the converted Wallpaper */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="h-full w-full bg-[url('/media/optimized/hero-wallpaper-0.jpg')] bg-cover bg-center grayscale-[20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background z-10" />
        <div className="vignette absolute inset-0 z-20" />
      </div>
      
      {/* Centered Brand Moment */}
      <div className="relative z-30 flex flex-col items-center gap-8 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-4"
        >
          {/* Using text logo for now since PDF conversion is restricted */}
          <h1 className="text-gold text-6xl md:text-9xl font-serif tracking-[0.6em] md:tracking-[0.8em] uppercase pl-[0.6em] md:pl-[0.8em] select-none">
            Sugi
          </h1>
          <div className="h-[1px] w-20 md:w-32 bg-gold/30" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
          className="text-foreground/40 text-[10px] md:text-xs tracking-[0.4em] md:tracking-[0.6em] uppercase font-light"
        >
          Artistry in every slice
        </motion.p>
      </div>

      {/* Decorative Kanji for Depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vh] md:text-[50vh] text-white/[0.03] font-serif select-none pointer-events-none z-10">
        杉
      </div>
    </section>
  );
}
