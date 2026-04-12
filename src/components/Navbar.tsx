'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[100] flex flex-col pointer-events-none">
        {/* Enseigne Header Artwork - Acts as the bar background */}
        <div className="relative w-full h-24 md:h-32 overflow-hidden pointer-events-auto">
          <Image 
            src="/media/optimized/enseigne-1.jpg"
            alt="Sugi Header"
            fill
            className="object-contain object-top brightness-110 contrast-110 mix-blend-screen"
            priority
          />
          {/* Subtle gold line below the artwork */}
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </div>

        {/* Floating Controls Row */}
        <div className="flex justify-between items-center px-6 py-4 -mt-4">
          {/* Brand Monogram */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="pointer-events-auto cursor-pointer"
          >
            <div className="w-10 h-10 border border-gold/40 flex items-center justify-center rounded-sm bg-background/60 backdrop-blur-md gold-glow">
              <span className="text-gold font-serif text-xl pl-0.5 pt-0.5">杉</span>
            </div>
          </motion.div>

          {/* Complex Animated Hamburger */}
          <motion.button 
            onClick={() => setIsOpen(!isOpen)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="pointer-events-auto relative w-12 h-12 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-xl border border-gold/30 shadow-lg z-[110]"
          >
            <div className="flex flex-col gap-[6px] items-end">
              <motion.div 
                animate={isOpen ? { rotate: 45, y: 8, width: "32px" } : { rotate: 0, y: 0, width: "24px" }}
                className="h-[1.5px] bg-gold rounded-full origin-center" 
              />
              <motion.div 
                animate={isOpen ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }}
                className="w-5 h-[1.5px] bg-gold rounded-full" 
              />
              <motion.div 
                animate={isOpen ? { rotate: -45, y: -8, width: "32px" } : { rotate: 0, y: 0, width: "24px" }}
                className="h-[1.5px] bg-gold rounded-full origin-center" 
              />
            </div>
          </motion.button>
        </div>
      </nav>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-background washi z-[105] flex flex-col items-center justify-center p-12 pointer-events-auto"
          >
            <div className="absolute inset-0 vignette opacity-60 pointer-events-none" />
            
            <div className="flex flex-col items-center gap-12 relative z-10">
              {['Menu', 'Story', 'Reserve', 'Contact'].map((item, idx) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 + 0.3 }}
                  className="group relative"
                >
                  <span className="text-gold/20 absolute -left-10 top-1/2 -translate-y-1/2 text-[10px] tracking-[0.4em] font-serif">0{idx + 1}</span>
                  <span className="text-foreground text-4xl font-serif uppercase tracking-[0.5em] group-hover:text-gold transition-all duration-700 pl-[0.5em] block">
                    {item}
                  </span>
                  <motion.div 
                    whileHover={{ width: "100%" }}
                    className="h-[1px] w-0 bg-gold/50 mx-auto mt-4 transition-all duration-700" 
                  />
                </motion.a>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-16 flex flex-col items-center gap-4 text-[10px] tracking-[0.6em] text-gold/40 uppercase pl-[0.6em]"
            >
              <div className="w-12 h-[1px] bg-gold/20 mb-2" />
              <span>Washington D.C.</span>
              <span>Established 2026</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
