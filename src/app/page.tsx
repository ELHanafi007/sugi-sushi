'use client';

import { Suspense, lazy } from 'react';
import Navbar from '@/components/Navbar';

// Lazy load heavy components for better mobile performance
const LandingExperience = lazy(() => import('@/components/LandingExperience'));
const MenuSection = lazy(() => import('@/components/MenuSection'));

export default function Home() {
  return (
    <main className="min-h-dvh bg-background selection:bg-gold/30 selection:text-gold-lighter">
      <Navbar />
      <Suspense
        fallback={
          <div className="h-[100dvh] flex items-center justify-center bg-background">
            <div className="w-8 h-8 border border-gold/20 border-t-gold/60 rounded-full animate-spin" />
          </div>
        }
      >
        <LandingExperience />
        <MenuSection />
      </Suspense>
    </main>
  );
}
