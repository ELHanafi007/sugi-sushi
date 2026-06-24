'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * CINEMATIC REVEAL — Obsidian Kinetic Entry
 *
 * - 2.2s total time (down from 4s)
 * - Only plays once per session (sessionStorage flag)
 * - Sharper exit with scale + blur
 * - Kanji background with depth
 */
export default function CinematicReveal({ children }: { children: React.ReactNode }) {
  const [isExited, setIsExited] = useState(false);
  const [shouldSkip, setShouldSkip] = useState(false);

  useEffect(() => {
    // Skip on return visits within session
    const hasPlayed = sessionStorage.getItem('sugi_reveal_played');
    if (hasPlayed) {
      setShouldSkip(true);
      setIsExited(true);
      return;
    }

    // Mark as played
    sessionStorage.setItem('sugi_reveal_played', '1');

    // Exit after 2.2s
    const timer = setTimeout(() => setIsExited(true), 2200);
    return () => clearTimeout(timer);
  }, []);

  // Instant render if skipping
  if (shouldSkip) {
    return <>{children}</>;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {!isExited && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 1.02,
              filter: 'blur(8px)',
              transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] },
            }}
            className="fixed inset-0 z-[10000] bg-void flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Noise */}
            <div className="absolute inset-0 noise-overlay" />

            <div className="relative flex flex-col items-center gap-12">
              {/* Kanji */}
              <motion.span
                initial={{ opacity: 0, scale: 0.85, filter: 'blur(20px)' }}
                animate={{ opacity: 0.035, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
                className="absolute text-[40vh] font-serif leading-none select-none pointer-events-none text-white"
              >
                杉
              </motion.span>

              {/* Central Brand */}
              <div className="flex flex-col items-center gap-5 relative z-10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 80 }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  className="h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent"
                />

                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1.2, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
                >
                  <Image
                    src="/brand-logo-removebg-preview.png"
                    alt="Sugi Sushi logo"
                    width={320}
                    height={160}
                    priority
                    className="w-[180px] md:w-[300px] h-auto object-contain"
                  />
                </motion.div>

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 80 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: 'easeInOut' }}
                  className="h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent"
                />
              </div>

              {/* Progress: Exponential sweep */}
              <div className="absolute bottom-[-80px] w-[200px] h-[1px] bg-white/5 overflow-hidden rounded-full">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '0%' }}
                  transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0 bg-gradient-to-r from-gold/60 to-gold/20"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{
          opacity: isExited ? 1 : 0,
          scale: isExited ? 1 : 0.99,
        }}
        transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
