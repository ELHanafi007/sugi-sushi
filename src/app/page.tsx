'use client';

import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import LandingExperience from '@/components/LandingExperience';

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {!showMenu ? (
          <div key="landing" onClick={() => setShowMenu(true)}>
            <LandingExperience />
          </div>
        ) : (
          <div key="menu" className="p-8 flex flex-col items-center justify-center h-screen animate-in fade-in duration-1000">
             {/* This is the Phase 5 placeholder for the MenuContainer */}
            <h1 className="text-gold text-2xl font-serif tracking-widest uppercase">
              Sugi Menu
            </h1>
            <p className="mt-4 text-foreground/40 font-light tracking-[0.2em] uppercase text-xs">
              Scroll to unfold the journey
            </p>
            <button 
              onClick={() => setShowMenu(false)}
              className="mt-12 text-[10px] text-gold/60 border border-gold/20 px-6 py-2 rounded-full uppercase tracking-widest hover:bg-gold/10 transition-colors"
            >
              Return Home
            </button>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
