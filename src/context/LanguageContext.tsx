'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'nav.menu': 'Menu',
    'nav.story': 'Story',
    'nav.reserve': 'Reserve',
    'nav.contact': 'Contact',
    'hero.subtitle': 'Artistry in every slice',
    'menu.title': 'Menu',
    'menu.collection': 'The Collection',
    'menu.cat.Salads': 'Salads',
    'menu.cat.Soups': 'Soups',
    'menu.cat.Starters': 'Starters',
    'menu.cat.Wok, Noodles & Rice': 'Wok & Rice',
    'menu.cat.Tempura': 'Tempura',
    'menu.cat.Sugi Dishes': 'Sugi Dishes',
    'menu.cat.Sashimi': 'Sashimi',
    'menu.cat.Tataki': 'Tataki',
    'menu.cat.Ceviche': 'Ceviche',
    'menu.cat.Nigiri': 'Nigiri',
    'menu.cat.Gunkan': 'Gunkan',
    'menu.cat.Temaki': 'Temaki',
    'menu.cat.Maki Rolls': 'Maki Rolls',
    'menu.cat.Aromaki Rolls': 'Aromaki',
    'menu.cat.Aromaki Fried': 'Fried Aromaki',
    'menu.cat.California Rolls': 'California',
    'menu.cat.Special Rolls': 'Special Rolls',
    'menu.cat.Fried Rolls': 'Fried Rolls',
    'menu.cat.Boxes': 'Boxes',
    'menu.cat.Sugi Boat': 'Sugi Boat',
    'menu.cat.Cold Drinks': 'Drinks',
    'menu.cat.Fresh Juices': 'Fresh Juices',
    'menu.cat.Hot Drinks': 'Hot Drinks',
    'menu.cat.Desserts': 'Desserts',
    'menu.cat.Extra Sauces': 'Sauces',
    'menu.back': 'Back to Categories',
    'location': 'Saudi Arabia',
    'established': 'Established 2026',
  },
  ar: {
    'nav.menu': 'القائمة',
    'nav.story': 'قصتنا',
    'nav.reserve': 'حجز طاولة',
    'nav.contact': 'تواصل معنا',
    'hero.subtitle': 'الفن في كل شريحة',
    'menu.title': 'القائمة',
    'menu.collection': 'التشكيلة المختارة',
    'menu.cat.Salads': 'السلطات',
    'menu.cat.Soups': 'الشوربات',
    'menu.cat.Starters': 'المقبلات',
    'menu.cat.Wok, Noodles & Rice': 'ووك وأرز',
    'menu.cat.Tempura': 'تمبورا',
    'menu.cat.Sugi Dishes': 'أطباق سوجي',
    'menu.cat.Sashimi': 'ساشيمي',
    'menu.cat.Tataki': 'تاتاكي',
    'menu.cat.Ceviche': 'سيفيتشي',
    'menu.cat.Nigiri': 'نيجيري',
    'menu.cat.Gunkan': 'جانكن',
    'menu.cat.Temaki': 'تيماكي',
    'menu.cat.Maki Rolls': 'ماكي رولز',
    'menu.cat.Aromaki Rolls': 'أروماكي',
    'menu.cat.Aromaki Fried': 'أروماكي مقرمش',
    'menu.cat.California Rolls': 'كاليفورنيا',
    'menu.cat.Special Rolls': 'لفائف خاصة',
    'menu.cat.Fried Rolls': 'لفائف مقرمشة',
    'menu.cat.Boxes': 'بوكس',
    'menu.cat.Sugi Boat': 'سفينة سوجي',
    'menu.cat.Cold Drinks': 'مشروبات باردة',
    'menu.cat.Fresh Juices': 'عصائر طازجة',
    'menu.cat.Hot Drinks': 'مشروبات ساخنة',
    'menu.cat.Desserts': 'الحلويات',
    'menu.cat.Extra Sauces': 'صلصات إضافية',
    'menu.back': 'العودة للتصنيفات',
    'location': 'المملكة العربية السعودية',
    'established': 'تأسس عام ٢٠٢٦',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sugi-lang');
      if (saved === 'ar' || saved === 'en') return saved;
      const browserLang = navigator.language;
      if (browserLang.startsWith('ar')) return 'ar';
    }
    return 'en';
  });

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    if (lang === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
    try {
      localStorage.setItem('sugi-lang', lang);
    } catch { /* ignore */ }
  }, [lang]);

  const t = (key: string) => {
    return translations[lang][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
