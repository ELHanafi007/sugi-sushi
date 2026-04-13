'use client';

import { Suspense, lazy } from 'react';
import Navbar from '@/components/Navbar';

const Hero = lazy(() => import('@/components/Hero'));
const MenuSection = lazy(() => import('@/components/MenuSection'));

export default function Home() {
  return (
    <main className="bg-bg text-text min-h-dvh">
      <Navbar />
      <Suspense
        fallback={
          <div className="h-dvh flex items-center justify-center bg-bg">
            <div className="w-5 h-5 border border-gold/15 border-t-gold/40 rounded-full animate-spin" />
          </div>
        }
      >
        <Hero />
        <MenuSection />
      </Suspense>
    </main>
  );
}
