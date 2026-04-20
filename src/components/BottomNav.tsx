'use client';

import React from 'react';
import { useLanguage, NavTab } from '@/context/LanguageContext';
import { InteractiveMenu, InteractiveMenuItem } from "./ui/modern-mobile-menu";
import { Home, UtensilsCrossed, Calendar, Image as ImageIcon } from 'lucide-react';

/**
 * FINAL INTEGRATION — The Modern Sugi Navigation
 * 
 * Bridging the custom InteractiveMenu with the Sugi Sushi state system.
 */

export default function BottomNav() {
  const { activeTab, setActiveTab, t } = useLanguage();

  const navItems: (InteractiveMenuItem & { id: NavTab })[] = [
    { id: 'home',         label: t('nav.home'),         icon: Home },
    { id: 'menu',         label: t('nav.menu'),         icon: UtensilsCrossed },
    { id: 'reservations', label: t('nav.reservations'), icon: Calendar },
    { id: 'gallery',      label: t('nav.gallery'),      icon: ImageIcon },
  ];

  const activeIndex = navItems.findIndex(item => item.id === activeTab);

  const handleTabChange = (index: number) => {
    const selectedTab = navItems[index].id;
    setActiveTab(selectedTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bottom-nav-root !pointer-events-auto">
      <InteractiveMenu 
        items={navItems} 
        activeIndex={activeIndex}
        onItemClick={handleTabChange}
        accentColor="#d4af37"
      />
    </div>
  );
}
