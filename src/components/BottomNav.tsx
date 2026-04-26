'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { InteractiveMenu } from "./ui/modern-mobile-menu";
import { Home, UtensilsCrossed, Image as ImageIcon, Calendar } from 'lucide-react';

export default function BottomNav() {
  const { activeTab, setActiveTab, t } = useLanguage();
  const [isReservePage, setIsReservePage] = useState(false);

  useEffect(() => {
    setIsReservePage(window.location.pathname === '/reserve');
  }, []);

  const tabs = ['home', 'menu', 'gallery'] as const;
  const activeIndex = isReservePage ? 3 : tabs.indexOf(activeTab);

  const menuItems = [
    { label: t('nav.home'), icon: Home },
    { label: t('nav.menu'), icon: UtensilsCrossed },
    { label: t('nav.gallery'), icon: ImageIcon },
    { label: t('nav.reservations'), icon: Calendar },
  ];

  const handleItemClick = (index: number) => {
    if (index === 3) {
      window.location.href = '/reserve';
    } else {
      setActiveTab(tabs[index]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bottom-nav-root !pointer-events-auto">
      <InteractiveMenu 
        items={menuItems} 
        activeIndex={activeIndex >= 0 ? activeIndex : 0}
        onItemClick={handleItemClick}
        accentColor="#d4af37"
        forceActiveIndex={isReservePage ? 3 : undefined}
      />
    </div>
  );
}