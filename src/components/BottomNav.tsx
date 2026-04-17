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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    )
  },
  {
    id: 'menu',
    labelEn: 'Menu',
    labelAr: 'المنيو',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h12"/></svg>
    )
  },
  {
    id: 'reservations',
    labelEn: 'Story',
    labelAr: 'قصتنا',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
    )
  },
  {
    id: 'gallery',
    labelEn: 'Gallery',
    labelAr: 'المعرض',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
    )
  },
  {
    id: 'location',
    labelEn: 'Contact',
    labelAr: 'تواصل',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    )
  }
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { lang } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] px-4 pb-5 pt-2 pointer-events-none">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
        className="max-w-md mx-auto bg-black/60 backdrop-blur-3xl border border-white/[0.08] rounded-2xl h-[62px] pointer-events-auto shadow-[0_-4px_30px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.02)_inset] flex items-center justify-around px-1 relative overflow-hidden"
      >
        {/* Ambient glow behind active tab */}
        <motion.div
          className="absolute h-full rounded-2xl"
          initial={false}
          animate={{
            width: `${100 / TABS.length}%`,
            x: `${TABS.findIndex(t => t.id === activeTab) * 100}%`,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          style={{ width: `calc(100% / ${TABS.length})`, left: 0 }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-gold/[0.08] blur-xl" />
          </div>
        </motion.div>

        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                if (tab.id === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-500 outline-none ${
                isActive ? 'text-gold' : 'text-white/25 hover:text-white/50 active:text-white/60'
              }`}
            >
              <motion.div 
                animate={isActive ? { scale: 1, y: -2 } : { scale: 0.85, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {tab.icon}
              </motion.div>
              
              <motion.span 
                animate={isActive ? { opacity: 1, y: 0, height: 'auto' } : { opacity: 0, y: 4, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`text-[9px] mt-0.5 font-medium tracking-tight uppercase overflow-hidden ${
                  lang === 'ar' ? 'text-[10px] tracking-normal' : ''
                }`}
              >
                {lang === 'ar' ? tab.labelAr : tab.labelEn}
              </motion.span>

              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavDot"
                  className="absolute -top-0.5 w-4 h-[2px] rounded-full bg-gold"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}
