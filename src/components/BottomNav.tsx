'use client';

import { motion } from 'framer-motion';
import { useLanguage, NavTab } from '@/context/LanguageContext';

const TABS: { id: NavTab; labelKey: string; kanji: string }[] = [
  { id: 'home', labelKey: 'nav.home', kanji: '家' },
  { id: 'menu', labelKey: 'nav.menu', kanji: '菜' },
  { id: 'reservations', labelKey: 'nav.reservations', kanji: '席' },
  { id: 'gallery', labelKey: 'nav.gallery', kanji: '画' },
  { id: 'location', labelKey: 'nav.contact', kanji: '位' },
];

export default function BottomNav() {
  const { t, activeTab, setActiveTab } = useLanguage();

  return (
    <div className="fixed bottom-10 left-0 right-0 z-[10000] px-6 pointer-events-none flex justify-center">
      <div className="w-full max-w-2xl bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] h-20 md:h-24 pointer-events-auto shadow-[0_50px_100px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.05)_inset] flex items-center justify-around px-4 relative overflow-hidden">
        {/* Floating Masterpiece Indicator */}
        <motion.div
          layoutId="bottomNavIndicator"
          className="absolute h-14 md:h-16 bg-gold/[0.08] border border-gold/20 rounded-3xl shadow-[0_0_40px_rgba(212,175,55,0.15)]"
          initial={false}
          animate={{
            width: `calc(${100 / TABS.length}% - 16px)`,
            x: `calc(${TABS.findIndex(t => t.id === activeTab) * 100}% + 8px)`,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          style={{ width: `calc(100% / ${TABS.length} - 16px)`, left: 0 }}
        />

        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-700 outline-none z-10 group`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className={`font-serif text-xl md:text-2xl transition-all duration-700 ${isActive ? 'text-gold' : 'text-white/20 group-hover:text-white/40'}`}>
                  {tab.kanji}
                </span>
                <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-700 font-mono ${isActive ? 'text-gold' : 'text-white/10 group-hover:text-white/30'}`}>
                  {t(tab.labelKey)}
                </span>
              </div>
              
              {isActive && (
                <motion.div 
                  layoutId="bottomNavGlow"
                  className="absolute inset-0 bg-gold/5 blur-xl -z-10" 
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
