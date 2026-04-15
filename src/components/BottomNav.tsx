'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export type NavTab = 'home' | 'menu' | 'reservations' | 'gallery' | 'location';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const TABS: { id: NavTab; labelEn: string; labelAr: string; icon: React.ReactNode }[] = [
  {
    id: 'home',
    labelEn: 'Home',
    labelAr: 'الرئيسية',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    )
  },
  {
    id: 'menu',
    labelEn: 'Menu',
    labelAr: 'المنيو',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3z"/><path d="M7 8h10"/><path d="M7 12h10"/><path d="M7 16h10"/></svg>
    )
  },
  {
    id: 'reservations',
    labelEn: 'Booking',
    labelAr: 'الحجز',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
    )
  },
  {
    id: 'gallery',
    labelEn: 'Gallery',
    labelAr: 'المعرض',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
    )
  },
  {
    id: 'location',
    labelEn: 'Location',
    labelAr: 'الموقع',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    )
  }
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { lang } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] px-4 pb-6 pt-2 pointer-events-none">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        className="max-w-xl mx-auto bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full h-16 pointer-events-auto shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex items-center justify-around px-2 relative overflow-hidden"
      >
        {/* Animated Background Indicator */}
        <motion.div
          className="absolute h-12 rounded-full bg-gold/10 border border-gold/20"
          initial={false}
          animate={{
            width: `${100 / TABS.length}%`,
            x: `${TABS.findIndex(t => t.id === activeTab) * (100)}%`
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ width: `calc((100% - 16px) / ${TABS.length})`, left: '8px' }}
        />

        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-500 outline-none ${
              activeTab === tab.id ? 'text-gold' : 'text-white/30 hover:text-white/60'
            }`}
          >
            <motion.div 
              whileTap={{ scale: 0.8 }}
              className={`transition-transform duration-700 ${activeTab === tab.id ? 'scale-110 -translate-y-1' : 'scale-90'}`}
            >
              {tab.icon}
            </motion.div>
            <span className={`text-[10px] mt-1 font-medium tracking-tight uppercase transition-all duration-500 ${
              lang === 'ar' ? 'text-[12px] tracking-normal' : ''
            } ${activeTab === tab.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 h-0 overflow-hidden'}`}>
              {lang === 'ar' ? tab.labelAr : tab.labelEn}
            </span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="navDot"
                className="absolute -top-1 w-1 h-1 rounded-full bg-gold shadow-[0_0_10px_rgba(226,183,20,0.8)]"
              />
            )}
          </button>
        ))}
      </motion.div>
    </div>
  );
}
