'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Atmosphere from '@/components/Atmosphere';
import ChefArtistry from '@/components/ChefArtistry';
import Signature from '@/components/Signature';
import MenuSection from '@/components/MenuSection';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

/**
 * SUGI SUSHI - Luxury Cinematic Experience Orchestrator
 * 
 * EMOTIONAL FLOW (THE FILM):
 * 1. Opening: Cinematic Hero (Aspiration)
 * 2. Transition: Atmosphere (Emotional Pause)
 * 3. Curation: Signature Selection (The Best of Sugi)
 * 4. CLIMAX: Chef Artistry (Emotional Peak)
 * 5. Discovery: The Holistic Experience (Full Menu)
 */

export default function Home() {
  const [isLetterbox, setIsLetterbox] = useState(false);
  const { scrollYProgress } = useScroll();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Letterbox trigger based on scroll depth (The Cinematic Frame)
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight;
      // Activate letterbox during transitions or climax
      setIsLetterbox(scrollPos > windowHeight * 0.5);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className={`relative min-h-screen bg-bg selection:bg-gold/30 selection:text-white overflow-x-hidden ${isLetterbox ? 'letterbox-active' : ''}`}>
      {/* Cinematic Letterbox System (Film Cut) */}
      <div className="letterbox-bar top" />
      <div className="letterbox-bar bottom" />

      {/* Editorial Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[1px] bg-gold/40 z-[110] origin-left"
        style={{ scaleX }}
      />

      {/* Global Navigation HUD */}
      <Navbar />

      <div className="flex flex-col">
        {/* Scene 1: Cinematic Opening */}
        <Hero />

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
      </div>

      {/* Film Grain & Noise (Identity Layer) */}
      <div className="noise-overlay" />
      
      {/* Global Interactive Spotlight */}
      <div className="spotlight" />
    </main>
  );
}
