'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[100] flex flex-col pointer-events-none">
        {/* Full-width Luxury Header Stage - Using Exact Pixel Match #231F20 */}
        <div className="relative w-full h-28 md:h-36 bg-[#231F20] pointer-events-auto shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center justify-center">
          
          {/* Edge-to-Edge Content Container */}
          <div className="w-full h-full max-w-[1400px] relative flex items-center justify-center px-6">
            
            {/* 1. Left Control: Language Switcher */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute left-6 md:left-10 flex items-center gap-2 pointer-events-auto"
            >
              <button className="w-10 h-10 border border-gold/20 flex items-center justify-center rounded-full bg-background/40 backdrop-blur-md transition-all duration-500 hover:border-gold/50 group">
                <span className="text-lg grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500">🇬🇧</span>
              </button>
              <div className="w-[1px] h-4 bg-gold/20 mx-1" />
              <button className="w-10 h-10 border border-gold/20 flex items-center justify-center rounded-full bg-background/40 backdrop-blur-md transition-all duration-500 hover:border-gold/50 group">
                <span className="text-lg grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500">🇸🇦</span>
              </button>
            </motion.div>


            {/* 2. CENTER PIECE: The Enseigne Artwork (SLIGHTLY BIGGER) */}
            <div className="relative w-[85%] h-[85%] md:h-[90%]">
              <Image 
                src="/media/optimized/enseigne-1.jpg"
                alt="Sugi Sign"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* 3. Right Control: Complex Animated Hamburger */}
            <motion.button 
              onClick={() => setIsOpen(!isOpen)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute right-6 md:right-10 w-12 h-12 flex items-center justify-center rounded-full border border-gold/10 hover:border-gold/30 transition-colors duration-500 z-[110]"
            >
              <div className="flex flex-col gap-[6px] items-end">
                <motion.div 
                  animate={isOpen ? { rotate: 45, y: 8, width: "28px" } : { rotate: 0, y: 0, width: "22px" }}
                  className="h-[1px] bg-gold rounded-full origin-center" 
                />
                <motion.div 
                  animate={isOpen ? { opacity: 0, x: 5 } : { opacity: 1, x: 0 }}
                  className="w-4 h-[1px] bg-gold rounded-full" 
                />
                <motion.div 
                  animate={isOpen ? { rotate: -45, y: -8, width: "28px" } : { rotate: 0, y: 0, width: "22px" }}
                  className="h-[1px] bg-gold rounded-full origin-center" 
                />
              </div>
            </motion.button>
          </div>

          {/* Bottom Luxury Line */}
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
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
