'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { InteractiveMenu } from "./ui/modern-mobile-menu";
import { Home, UtensilsCrossed, Image as ImageIcon } from 'lucide-react';

export default function BottomNav() {
  const { activeTab, setActiveTab, t } = useLanguage();

  const tabs = ['home', 'menu', 'gallery'] as const;
  const activeIndex = tabs.indexOf(activeTab);

  const menuItems = [
    { label: t('nav.home'), icon: Home },
    { label: t('nav.menu'), icon: UtensilsCrossed },
    { label: t('nav.gallery'), icon: ImageIcon },
  ];

  const handleItemClick = (index: number) => {
    setActiveTab(tabs[index]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bottom-nav-root !pointer-events-auto">
      <InteractiveMenu 
        items={menuItems} 
        activeIndex={activeIndex >= 0 ? activeIndex : 0}
        onItemClick={handleItemClick}
        accentColor="#d4af37"
      />
      <a
        href="/reserve"
        className="fixed bottom-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-gold text-black font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform z-50"
      >
        {t('nav.reservations')}
      </a>
    </div>
  );
}