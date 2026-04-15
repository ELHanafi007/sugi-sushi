'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Atmosphere from '@/components/Atmosphere';
import ChefArtistry from '@/components/ChefArtistry';
import Signature from '@/components/Signature';
import MenuSection from '@/components/MenuSection';
import BottomNav, { NavTab } from '@/components/BottomNav';
import StrictMenu from '@/components/StrictMenu';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';

/**
 * SUGI SUSHI - Luxury Cinematic Experience Orchestrator
 */

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isLetterbox, setIsLetterbox] = useState(false);
  const { scrollYProgress } = useScroll();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Letterbox trigger based on scroll depth
  useEffect(() => {
    if (activeTab !== 'home') {
      setIsLetterbox(false);
      return;
    }
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight;
      setIsLetterbox(scrollPos > windowHeight * 0.5);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  return (
    <main className={`relative min-h-screen bg-bg selection:bg-gold/30 selection:text-white overflow-x-hidden ${isLetterbox ? 'letterbox-active' : ''}`}>
      {/* Cinematic Letterbox System */}
      <div className="letterbox-bar top" />
      <div className="letterbox-bar bottom" />

      {/* Editorial Progress Bar */}
      {activeTab === 'home' && (
        <motion.div 
          className="fixed top-0 left-0 right-0 h-[1px] bg-gold/40 z-[110] origin-left"
          style={{ scaleX }}
        />
      )}

      {/* Global Navigation HUD */}
      <Navbar onTabChange={setActiveTab} activeTab={activeTab} />

      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col"
          >
            {/* Scene 1: Cinematic Opening */}
            <Hero onTabChange={setActiveTab} />

            {/* Cinematic Cut 01 */}
            <div className="h-60 flex items-center justify-center opacity-20">
              <div className="w-px h-full bg-gradient-to-b from-white via-gold/50 to-transparent" />
            </div>

            {/* Scene 2: Atmospheric Pause */}
            <Atmosphere />

            {/* Scene 3: Curated Selection */}
            <Signature />

            {/* Scene 4: THE CLIMAX (Emotional Peak) */}
            <ChefArtistry />

            {/* Scene 5: The Holistic Experience */}
            <div className="relative z-10 bg-bg">
              <MenuSection />
            </div>
          </motion.div>
        )}

        {activeTab === 'menu' && (
          <motion.div 
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <StrictMenu />
          </motion.div>
        )}

        {(activeTab === 'reservations' || activeTab === 'gallery' || activeTab === 'location') && (
          <motion.div 
            key="placeholders"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
          >
            <span className="text-gold text-8xl font-serif mb-8">杉</span>
            <h2 className="text-white text-4xl font-serif mb-4 uppercase tracking-widest">{activeTab}</h2>
            <p className="text-white/40 max-w-md">The {activeTab} experience is being refined for your arrival. Perfection takes time.</p>
            <button 
              onClick={() => setActiveTab('home')}
              className="mt-12 px-8 py-3 border border-gold/30 text-gold text-xs uppercase tracking-widest rounded-full hover:bg-gold/10 transition-colors"
            >
              Return to Journey
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Film Grain & Noise */}
      <div className="noise-overlay" />
      
      {/* Global Interactive Spotlight */}
      <div className="spotlight" />
    </main>
  );
}
