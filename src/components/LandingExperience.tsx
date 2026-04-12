'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LandingExperience() {
  const [isVisible, setIsVisible] = useState(true);

  // The "Sugi" Expo Out Curve
  const transition = { duration: 1.2, ease: [0.16, 1, 0.3, 1] };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={transition}
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background"
    >
      {/* Background Living Canvas - Placeholder for TIFF Artwork */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="h-full w-full bg-[url('/media/source/placeholder-bg.jpg')] bg-cover bg-center opacity-40 grayscale-[20%]"
        />
        {/* Sumi-e Mist Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
      </div>

      {/* Brand Moment */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.5 }}
        >
          {/* Logo Placeholder - Will be SVG or PNG from the assets */}
          <div className="text-gold text-4xl md:text-6xl font-serif tracking-widest uppercase">
            Sugi
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.2 }}
          className="text-foreground/60 text-sm md:text-base font-light tracking-[0.4em] uppercase"
        >
          Artistry in every slice
        </motion.div>
      </div>

      {/* Navigation Anchor Suggestion (Nature Anchors Phase 2) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transition, delay: 1.8 }}
        className="absolute bottom-12 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => setIsVisible(false)}
      >
        <span className="text-[10px] tracking-[0.5em] text-gold uppercase">Begin Ritual</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-gold to-transparent" />
      </motion.div>
    </motion.div>
  );
}
