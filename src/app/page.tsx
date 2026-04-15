'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MenuSection from '@/components/MenuSection';
import { useLanguage } from '@/context/LanguageContext';

/**
 * SUGI SUSHI - Luxury Experience Orchestrator
 * 
 * DESIGN PHILOSOPHY:
 * 1. Fluid Progression: Seamless transitions between sections.
 * 2. Visual Breathing Room: Expansive vertical spacing (py-32+).
 * 3. Consistent Materiality: Unified HUD and glass effects.
 */

export default function Home() {
  const { t } = useLanguage();

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
      {/* ─── Global Navigation ─── */}
      <Navbar />

      {/* ─── Storytelling Sequence ─── */}
      <div className="flex flex-col">
        {/* Cinematic Opening */}
        <Hero />

        {/* Discovery & Menu */}
        <div className="relative z-10 bg-bg shadow-[0_-50px_100px_rgba(0,0,0,0.8)]">
          <MenuSection />
        </div>

        {/* Closing / Contact Section */}
        <footer id="contact" className="relative py-48 border-t border-white/[0.03] overflow-hidden bg-bg">
          {/* Ghost Branding */}
          <span className="heading-huge opacity-[0.02] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none whitespace-nowrap">
            SUGI SUSHI
          </span>

          <div className="container-wide relative z-10 flex flex-col items-center text-center">
            <div className="mb-12">
               <span className="mono-tag !text-gold/40">Inquiries & Reservations</span>
               <h3 className="text-white text-3xl md:text-5xl font-serif mt-6 tracking-wide italic">
                  Join us for <span className="text-gold">perfection.</span>
               </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-32 mt-16 max-w-4xl">
              <div className="flex flex-col gap-4">
                <span className="mono-tag !text-[8px] opacity-30">Location</span>
                <p className="text-white/60 text-sm font-serif leading-relaxed">
                  Prince Muhammad Bin Abdulaziz Rd,<br />
                  As Sulimaniyah, Riyadh 12243
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <span className="mono-tag !text-[8px] opacity-30">Hours</span>
                <p className="text-white/60 text-sm font-serif leading-relaxed">
                  Daily: 1:00 PM — 1:00 AM<br />
                  Friday: 2:00 PM — 1:00 AM
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <span className="mono-tag !text-[8px] opacity-30">Contact</span>
                <p className="text-white/60 text-sm font-serif leading-relaxed">
                  +966 50 000 0000<br />
                  reservations@sugi.com
                </p>
              </div>
            </div>

            <div className="mt-32 pt-12 border-t border-white/[0.03] w-full flex justify-between items-center opacity-30">
               <span className="text-[10px] mono-tag">© 2024 SUGI</span>
               <div className="flex gap-8">
                  {['Instagram', 'Twitter', 'TikTok'].map(social => (
                    <a key={social} href="#" className="text-[10px] mono-tag hover:text-gold transition-colors">{social}</a>
                  ))}
               </div>
            </div>
          </div>
        </footer >
      </div>
    </main>
  );
}
