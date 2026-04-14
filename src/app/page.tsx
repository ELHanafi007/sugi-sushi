'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MenuSection from '@/components/MenuSection';

export default function Home() {
  return (
    <main className="bg-bg text-text min-h-dvh relative">
      <Navbar />
      <Hero />
      <MenuSection />
    </main>
  );
}
