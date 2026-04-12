'use client';

import LandingExperience from '@/components/LandingExperience';
import Navbar from '@/components/Navbar';
import MenuSection from '@/components/MenuSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-gold/30 selection:text-gold">
      <Navbar />
      <LandingExperience />
      <MenuSection />
    </main>
  );
}
