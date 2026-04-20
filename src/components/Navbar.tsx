'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import { useLanguage, NavTab } from '@/context/LanguageContext';

interface NavbarProps {
  onTabChange: (tab: NavTab) => void;
  activeTab: NavTab;
}

/**
 * MASTERPIECE NAVIGATION — The Floating Horizon (Morphing Edition)
 * 
 * Features:
 * - Scroll-linked Logo Transformation (Hero -> Nav)
 * - Page-Aware State Management (Morphs only on Home)
 * - Dynamic Opacity Orchestration
 */

export default function Navbar({ onTabChange, activeTab }: NavbarProps) {
  const { lang, setLang, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const isHomePage = activeTab === 'home';

  // Scroll tracking for morphing
  const { scrollY } = useScroll();
  
  // Logic: Between 0 and 150px, we morph the logo
  const morphProgress = useTransform(scrollY, [0, 150], [0, 1]);
  const smoothProgress = useSpring(morphProgress, { stiffness: 120, damping: 24 });

  // Logo Transformations
  const logoY = useTransform(smoothProgress, [0, 1], ["32vh", "0vh"]);
  const logoScale = useTransform(smoothProgress, [0, 1], [3.2, 1]);
  
  // Nav Items & Background Opacity
  const navItemsOpacity = useTransform(smoothProgress, [0.7, 1], [0, 1]);
  const navBgOpacity = useTransform(smoothProgress, [0.8, 1], [0, 1]);
  const navHeight = useTransform(smoothProgress, [0, 1], ["200px", "100px"]);

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsScrolled(latest > 100);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const navItems: { id: NavTab; labelKey: string }[] = [
    { id: 'home', labelKey: 'nav.home' },
    { id: 'menu', labelKey: 'nav.menu' },
    { id: 'reservations', labelKey: 'nav.reservations' },
  ];

  // Dynamic Styles based on Page
  const headerBg = useTransform(navBgOpacity, (v) => `rgba(6, 6, 8, ${isHomePage ? v * 0.85 : 0.85})`);
  const headerBlur = useTransform(navBgOpacity, (v) => `blur(${isHomePage ? v * 24 : 24}px)`);
  const headerBorder = useTransform(navBgOpacity, (v) => `1px solid rgba(255,255,255,${isHomePage ? v * 0.1 : 0.1})`);

  return (
    <motion.header
      style={{ 
        backgroundColor: headerBg,
        backdropFilter: headerBlur,
        WebkitBackdropFilter: headerBlur,
        borderBottom: headerBorder,
        height: isHomePage ? navHeight : "100px",
      }}
      className="fixed top-0 left-0 right-0 z-[1200] flex items-center"
    >
      <div className="max-w-[1800px] mx-auto w-full flex items-center justify-between px-8 md:px-16 relative">
        
        {/* LEFT SECTION: Links */}
        <motion.div 
          style={{ opacity: isHomePage ? navItemsOpacity : 1 }}
          className="flex-1 flex justify-start items-center gap-8"
        >
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button 
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`relative px-6 py-2 text-[10px] transition-all duration-700 font-black rounded-full uppercase tracking-[0.3em] ${
                    isActive ? 'text-gold' : 'text-white/40 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navPillTop"
                      className="absolute inset-0 rounded-full bg-gold/10 border border-gold/20"
                    />
                  )}
                  <span className="relative z-10">{t(item.labelKey)}</span>
                </button>
              );
            })}
          </nav>
        </motion.div>

        {/* CENTER SECTION: The Morphing Logo */}
        <div className="flex-1 flex justify-center items-center pointer-events-none">
          <motion.div 
            style={{ 
              y: isHomePage ? logoY : "0vh",
              scale: isHomePage ? logoScale : 1,
              pointerEvents: 'auto'
            }}
            className="relative"
          >
            <button 
              onClick={() => { onTabChange('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="relative transition-transform duration-500 hover:scale-105 active:scale-95"
            >
              <div className="relative w-[220px] h-[50px] xs:w-[280px] xs:h-[60px] md:w-[600px] md:h-[140px]">
                <Image 
                  src="/media/logo.png" 
                  alt="Sugi Sushi Logo" 
                  fill 
                  className="object-contain brightness-150 contrast-125 drop-shadow-[0_0_50px_rgba(212,175,55,0.6)]" 
                  priority 
                />
              </div>
            </button>
          </motion.div>
        </div>

        {/* RIGHT SECTION: Language & Status */}
        <motion.div 
          style={{ opacity: isHomePage ? navItemsOpacity : 1 }}
          className="flex-1 flex items-center justify-end gap-8"
        >
           <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold/40 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
            </span>
            <span className="text-[8px] font-mono tracking-widest text-white/30 uppercase font-black">Open</span>
          </div>

          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-[10px] font-black text-white/40 hover:border-gold/30 hover:text-gold transition-all duration-500"
          >
            {lang === 'en' ? 'AR' : 'EN'}
          </button>
        </motion.div>
      </div>
    </motion.header>
  );
}
