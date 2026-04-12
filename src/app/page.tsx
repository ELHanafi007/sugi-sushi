'use client';

import LandingExperience from '@/components/LandingExperience';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <LandingExperience />
      
      {/* Menu Section will follow naturally here */}
      <section id="menu" className="min-h-screen w-full bg-background washi flex items-center justify-center border-t border-gold/10">
        <p className="text-gold/20 text-[10px] tracking-[1em] uppercase">The Collection • Coming Soon</p>
      </section>
    </main>
  );
}
