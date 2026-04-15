'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MenuSection from '@/components/MenuSection';

/**
 * SUGI SUSHI - Luxury Experience Orchestrator
 */

export default function Home() {
  useEffect(() => {
    // Dynamic Spotlight Logic
    const handleMouse = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <main className="relative min-h-screen bg-bg selection:bg-gold/30 selection:text-white">
      {/* Global Navigation is handled inside components or here */}
      <Navbar />

      <div className="flex flex-col">
        {/* Cinematic Opening */}
        <Hero />

        {/* Discovery, Menu, Story, Contact, and Footer are unified in MenuSection for story-driven scroll flow */}
        <div className="relative z-10 bg-bg shadow-[0_-50px_100px_rgba(0,0,0,0.8)]">
          <MenuSection />
        </div>
      </div>
    </main>
  );
}
