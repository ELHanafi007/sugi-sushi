'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const EASE = [0.19, 1, 0.22, 1] as const;

export default function CinematicReveal({ children }: { children: React.ReactNode }) {
  const [isExited, setIsExited] = useState(false);
  const [shouldSkip, setShouldSkip] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      setShouldSkip(true);
      setIsExited(true);
      return;
    }

    const hasPlayed = sessionStorage.getItem('sugi_reveal_played');
    if (hasPlayed) {
      setShouldSkip(true);
      setIsExited(true);
      return;
    }

    sessionStorage.setItem('sugi_reveal_played', '1');
    const timer = setTimeout(() => setIsExited(true), 1100);
    return () => clearTimeout(timer);
  }, [reduceMotion]);

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
            exit={{ opacity: 0, scale: 1.01, transition: { duration: 0.35, ease: EASE } }}
            className="fixed inset-0 z-[10000] bg-void flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="relative flex flex-col items-center gap-8">
              <motion.span
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 0.035, scale: 1 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="absolute text-[40vh] font-serif leading-none select-none pointer-events-none text-white"
              >
                杉
              </motion.span>

              <div className="flex flex-col items-center gap-4 relative z-10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 64 }}
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                  className="h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent"
                />

                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
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
                  animate={{ width: 64 }}
                  transition={{ duration: 0.45, delay: 0.15, ease: 'easeInOut' }}
                  className="h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent"
                />
              </div>

              <div className="absolute bottom-[-60px] w-[160px] h-[1px] bg-white/5 overflow-hidden rounded-full">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '0%' }}
                  transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0 bg-gradient-to-r from-gold/60 to-gold/20"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isExited ? 1 : 0 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        {children}
      </motion.div>
    </>
  );
}
