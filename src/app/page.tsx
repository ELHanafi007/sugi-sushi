'use client';

import { Suspense, lazy } from 'react';
import Navbar from '@/components/Navbar';

const Hero = lazy(() => import('@/components/LandingExperience'));
const MenuSection = lazy(() => import('@/components/MenuSection'));

export default function Home() {
  return (
    <main className="min-h-dvh bg-bg-primary">
      <Navbar />
      <Suspense
        fallback={
          <div className="h-dvh flex items-center justify-center bg-bg-primary">
            <div className="w-6 h-6 border border-gold/15 border-t-gold/40 rounded-full animate-spin" />
          </div>
        }
      >
        <Hero />
        <MenuSection />
      </Suspense>
    </main>
  );
}
