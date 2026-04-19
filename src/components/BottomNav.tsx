'use client';

import { motion } from 'framer-motion';
import { useLanguage, NavTab } from '@/context/LanguageContext';

const TABS: { id: NavTab; labelKey: string; kanji: string; icon: string }[] = [
  { id: 'home',         labelKey: 'nav.home',         kanji: '家', icon: '⌂' },
  { id: 'menu',         labelKey: 'nav.menu',         kanji: '菜', icon: '◈' },
  { id: 'reservations', labelKey: 'nav.reservations', kanji: '席', icon: '⊞' },
  { id: 'gallery',      labelKey: 'nav.gallery',      kanji: '画', icon: '⊟' },
  { id: 'location',     labelKey: 'nav.contact',      kanji: '位', icon: '⊕' },
];

export default function BottomNav() {
  const { t, activeTab, setActiveTab } = useLanguage();
  const activeIndex = TABS.findIndex(tab => tab.id === activeTab);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: 0,
        right: 0,
        zIndex: 99999,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 16px',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          height: '72px',
          background: 'rgba(5, 5, 5, 0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 8px',
          position: 'relative',
          overflow: 'hidden',
          pointerEvents: 'auto',
          boxShadow: '0 8px 32px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05) inset',
        }}
      >
        {/* Sliding active pill */}
        <motion.div
          animate={{
            x: `calc(${activeIndex * 100}% + ${activeIndex * 4}px)`,
            width: `calc(${100 / TABS.length}% - 8px)`,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          style={{
            position: 'absolute',
            left: '4px',
            top: '50%',
            transform: 'translateY(-50%)',
            height: '52px',
            background: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '28px',
            boxShadow: '0 0 20px rgba(212,175,55,0.1)',
          }}
        />

        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                flex: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                position: 'relative',
                zIndex: 10,
                outline: 'none',
                transition: 'opacity 0.3s ease',
              }}
            >
              <span
                style={{
                  fontFamily: '"Shippori Mincho", serif',
                  fontSize: '20px',
                  lineHeight: 1,
                  color: isActive ? '#d4af37' : 'rgba(255,255,255,0.3)',
                  transition: 'color 0.4s ease',
                }}
              >
                {tab.kanji}
              </span>
              <span
                style={{
                  fontFamily: '"Space Mono", monospace',
                  fontSize: '8px',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: isActive ? '#d4af37' : 'rgba(255,255,255,0.2)',
                  transition: 'color 0.4s ease',
                }}
              >
                {t(tab.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
