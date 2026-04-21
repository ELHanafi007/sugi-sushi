'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

/**
 * CINEMATIC REVEAL — The Masterpiece Entry
 * 
 * Orchestrates the initial brand entry with high-end motion and depth.
 */
export default function CinematicReveal({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const [isRevealed, setIsRevealed] = useState(false);
  const [isExited, setIsExited] = useState(false);

  useEffect(() => {
    // Stage 1: The Brand Mark appear
    const timer1 = setTimeout(() => setIsRevealed(true), 2500);
    // Stage 2: The Exit
    const timer2 = setTimeout(() => setIsExited(true), 4000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {!isExited && (
          <motion.div 
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              transition: { duration: 1.5, ease: [0.19, 1, 0.22, 1] }
            }}
            className="fixed inset-0 z-[10000] bg-bg flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay">
               <div className="noise-overlay" />
            </div>

            <div className="relative flex flex-col items-center gap-12">
              {/* Brand Kanji */}
              <motion.span 
                initial={{ opacity: 0, scale: 0.8, filter: 'blur(30px)' }}
                animate={{ opacity: 0.05, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 3, ease: [0.19, 1, 0.22, 1] }}
                className="absolute text-[40vh] font-serif leading-none select-none pointer-events-none"
              >
                杉
              </motion.span>

              {/* Central Mark */}
              <div className="flex flex-col items-center gap-6 relative z-10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: 120 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent"
                />
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 2, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
                  className="flex flex-col items-center"
                >
                  <h1 className="text-white text-3xl md:text-5xl font-serif font-light tracking-[1em] uppercase leading-none shimmer-gold">
                    SUGI
                  </h1>
                  <span className="text-gold/40 text-[9px] font-mono tracking-[0.8em] uppercase mt-4">{t('reveal.sub')}</span>
                </motion.div>

                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: 120 }}
                  transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
                  className="h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent"
                />
              </div>

              {/* Progress Bar (Cinematic) */}
              <div className="absolute bottom-[-100px] w-[300px] h-[1px] bg-white/5 overflow-hidden">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gold/40"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
        animate={{ 
          opacity: isExited ? 1 : 0, 
          filter: isExited ? 'none' : 'blur(10px)',
          scale: isExited ? 1 : 0.98,
        }}
        transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
