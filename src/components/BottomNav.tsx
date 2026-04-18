'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export type NavTab = 'home' | 'menu' | 'reservations' | 'gallery' | 'location';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const TABS: { id: NavTab; labelEn: string; labelAr: string; icon: (isActive: boolean) => React.ReactNode }[] = [
  {
    id: 'home',
    labelEn: 'Home',
    labelAr: 'الرئيسية',
    icon: (isActive) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={isActive ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    )
  },
  {
    id: 'menu',
    labelEn: 'Menu',
    labelAr: 'المنيو',
    icon: (isActive) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h12"/></svg>
    )
  },
  {
    id: 'reservations',
    labelEn: 'Reservation',
    labelAr: 'الحجز',
    icon: (isActive) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={isActive ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    )
  },
  {
    id: 'location',
    labelEn: 'Contact',
    labelAr: 'تواصل',
    icon: (isActive) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={isActive ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    )
  }
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { lang } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] px-4 pb-6 pt-2 pointer-events-none md:hidden">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
        className="max-w-md mx-auto bg-black/40 backdrop-blur-3xl border border-white/[0.08] rounded-3xl h-20 pointer-events-auto shadow-[0_40px_80px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.03)_inset] flex items-center justify-around px-2 relative overflow-hidden"
      >
        {/* Floating Indicator */}
        <motion.div
          layoutId="bottomNavIndicator"
          className="absolute h-14 bg-gold/[0.1] border border-gold/20 rounded-[1.25rem] shadow-[0_0_30px_rgba(212,175,55,0.1)]"
          initial={false}
          animate={{
            width: `calc(${100 / TABS.length}% - 12px)`,
            x: `calc(${TABS.findIndex(t => t.id === activeTab) * 100}% + 6px)`,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          style={{ width: `calc(100% / ${TABS.length} - 12px)`, left: 0 }}
        />

        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                if (tab.id === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-700 outline-none z-10 ${
                isActive ? 'text-gold' : 'text-white/20 active:text-white/40'
              }`}
            >
              <motion.div 
                animate={isActive ? { scale: 1.1, y: -4 } : { scale: 0.9, y: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="relative"
              >
                {tab.icon(isActive)}
                {isActive && (
                  <motion.div 
                    layoutId="iconGlow"
                    className="absolute inset-0 bg-gold/20 blur-lg rounded-full" 
                  />
                )}
              </motion.div>
              
              <AnimatePresence>
                {isActive && (
                  <motion.span 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className={`text-[9px] mt-1 font-black tracking-[0.2em] uppercase ${
                      lang === 'ar' ? 'text-[10px] tracking-normal' : ''
                    }`}
                  >
                    {lang === 'ar' ? tab.labelAr : tab.labelEn}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}
