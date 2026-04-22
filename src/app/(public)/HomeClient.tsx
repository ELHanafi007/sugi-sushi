'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Atmosphere from '@/components/Atmosphere';
import ChefArtistry from '@/components/ChefArtistry';
import Signature from '@/components/Signature';

const MenuSection = dynamic(() => import('@/components/MenuSection'), { ssr: false });
const StrictMenu = dynamic(() => import('@/components/StrictMenu'), { ssr: false });
const StoryPage = dynamic(() => import('@/components/StoryPage'), { ssr: false });
const ReservationPage = dynamic(() => import('@/components/ReservationPage'), { ssr: false });
const LocationPage = dynamic(() => import('@/components/LocationPage'), { ssr: false });
const KineticGallery = dynamic(() => import('@/components/KineticGallery'), { ssr: false });
const ZoomExperience = dynamic(() => import('@/components/ZoomExperience'), { ssr: false });

import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';

import { useLanguage } from '@/context/LanguageContext';
import { Dish } from '@/data/menuData';

/**
 * SUGI SUSHI — Luxury Cinematic Experience Orchestrator
 */

export default function HomeClient({ 
  initialMenuData, 
  initialCategories 
}: { 
  initialMenuData: Dish[], 
  initialCategories: string[] 
}) {
  const { activeTab, setActiveTab } = useLanguage();
  const [isLetterbox, setIsLetterbox] = useState(false);
  const { scrollYProgress } = useScroll();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Scroll to top on tab change and ensure body is unlocked
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = '';
    document.body.style.pointerEvents = 'auto';
  }, [activeTab]);

  // Letterbox trigger based on scroll depth
  useEffect(() => {
    if (activeTab !== 'home') {
      setIsLetterbox(false);
      return;
    }
    
    const checkScroll = () => {
      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight;
      setIsLetterbox(scrollPos > windowHeight * 0.5);
    };
    checkScroll();

    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, [activeTab]);

  return (
    <main className={`relative min-h-screen bg-bg overflow-x-hidden pb-[104px] ${isLetterbox ? 'letterbox-active' : ''}`}>
      {/* Cinematic Shutter — Appears on tab change */}
      <AnimatePresence>
        <motion.div 
          key={activeTab + "-shutter"}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="fixed inset-0 z-[500] bg-black pointer-events-none"
        />
      </AnimatePresence>

      {/* Letterbox Bars */}
      <div className="letterbox-bar top" />
      <div className="letterbox-bar bottom" />

      {/* Progress Bar */}
      {activeTab === 'home' && (
        <motion.div 
          className="fixed top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-gold/20 via-gold/50 to-gold/20 z-[110] origin-left"
          style={{ scaleX }}
        />
      )}

      {/* Navigation */}
      <Navbar onTabChange={setActiveTab} activeTab={activeTab} />

      {/* Page Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col"
          >
            {/* Scene 1: Cinematic Opening */}
            <Hero onTabChange={setActiveTab} />

            {/* Cinematic Divider */}
            <div className="h-40 md:h-56 flex items-center justify-center">
              <motion.div 
                initial={{ height: 0 }}
                whileInView={{ height: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
                className="w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent max-h-full" 
              />
            </div>

            {/* Scene 2: Atmospheric Pause */}
            <Atmosphere />

            {/* Scene 3: Curated Selection */}
            <Signature onTabChange={setActiveTab} initialMenuData={initialMenuData} />

            {/* Scene 4: Emotional Peak */}
            <ChefArtistry />

            {/* Scene 5: The Story */}
            <div className="relative z-10 bg-bg">
              <StoryPage />
            </div>

            {/* Scene 5.5: The Visual Archive (Forced Horizontal) */}
            <KineticGallery />

            {/* Scene 6: Full Experience */}
            <div className="relative z-10 bg-bg pt-20">
              <MenuSection initialMenuData={initialMenuData} />
            </div>
          </motion.div>
        )}

        {activeTab === 'menu' && (
          <motion.div 
            key="menu"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          >
            <StrictMenu 
              onTabChange={setActiveTab} 
              initialMenuData={initialMenuData}
              initialCategories={initialCategories}
            />
          </motion.div>
        )}

        {activeTab === 'reservations' && (
          <motion.div 
            key="reservations"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          >
            <ReservationPage />
          </motion.div>
        )}


        {activeTab === 'location' && (
          <motion.div 
            key="location"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          >
            <LocationPage />
          </motion.div>
        )}

        {activeTab === 'gallery' && (
          <motion.div 
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ZoomExperience />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient spotlight */}
      <div className="ambient-spotlight" />
    </main>
  );
}
