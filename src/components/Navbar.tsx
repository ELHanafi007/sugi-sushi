'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] px-6 py-8 flex justify-between items-center pointer-events-none">
      {/* Brand Monogram/Short Logo - Minimalist Luxury */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="pointer-events-auto cursor-pointer"
      >
        <div className="w-10 h-10 border border-gold/40 flex items-center justify-center rounded-sm bg-background/20 backdrop-blur-sm">
          <span className="text-gold font-serif text-xl pl-0.5 pt-0.5">杉</span>
        </div>
      </motion.div>

      {/* Samurai Menu Trigger - Two Sharp Parallel Lines */}
      <motion.button 
        onClick={() => setIsOpen(!isOpen)}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="pointer-events-auto flex flex-col gap-2 p-2 group"
      >
        <motion.div 
          animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
          className="w-8 h-[1px] bg-gold group-hover:bg-foreground transition-colors duration-500" 
        />
        <motion.div 
          animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
          className="w-8 h-[1px] bg-gold group-hover:bg-foreground transition-colors duration-500" 
        />
      </motion.button>

      {/* Full Screen Menu Overlay - "The Ritual" */}
      <motion.div
        initial={false}
        animate={isOpen ? { opacity: 1, visibility: 'visible' } : { opacity: 0, visibility: 'hidden' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 bg-background washi z-[90] flex flex-col items-center justify-center p-12 pointer-events-auto"
      >
        <div className="absolute inset-0 vignette opacity-40 pointer-events-none" />
        
        <div className="flex flex-col items-center gap-12 relative z-10">
          {['Menu', 'Story', 'Reserve', 'Contact'].map((item, idx) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0, y: 20 }}
              animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: idx * 0.1 + 0.3 }}
              className="group relative"
            >
              <span className="text-gold/20 absolute -left-8 top-1/2 -translate-y-1/2 text-[8px] tracking-[0.4em] font-serif pr-2">0{idx + 1}</span>
              <span className="text-foreground text-3xl md:text-5xl font-serif uppercase tracking-[0.4em] group-hover:text-gold transition-colors duration-700 pl-[0.4em]">
                {item}
              </span>
              <div className="h-[1px] w-0 bg-gold/50 group-hover:w-full transition-all duration-700 mt-2" />
            </motion.a>
          ))}
        </div>

        {/* Footer info in Menu */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-16 flex flex-col items-center gap-2 text-[8px] tracking-[0.5em] text-gold/40 uppercase pl-[0.5em]"
        >
          <span>Washington D.C.</span>
          <div className="w-8 h-[1px] bg-gold/10" />
          <span>Established 2026</span>
        </motion.div>
      </motion.div>
    </nav>
  );
}
