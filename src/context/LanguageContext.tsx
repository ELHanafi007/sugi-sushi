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
    'menu.cat.Starters': 'Starters',
    'menu.cat.Sushi & Sashimi': 'Sushi & Sashimi',
    'menu.cat.Specialty Rolls': 'Specialty Rolls',
    'menu.cat.Main Dishes': 'Main Dishes',
    'menu.cat.Desserts': 'Desserts',
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
    'menu.cat.Starters': 'المقبلات',
    'menu.cat.Sushi & Sashimi': 'سوشي وساشيمي',
    'menu.cat.Specialty Rolls': 'لفائف خاصة',
    'menu.cat.Main Dishes': 'الأطباق الرئيسية',
    'menu.cat.Desserts': 'الحلويات',
    'menu.back': 'العودة للتصنيفات',
    'location': 'المملكة العربية السعودية',
    'established': 'تأسس عام ٢٠٢٦',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    // Check for saved preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sugi-lang');
      if (saved === 'ar' || saved === 'en') return saved;
      // Detect Arabic locale
      const browserLang = navigator.language;
      if (browserLang.startsWith('ar')) return 'ar';
    }
    return 'en';
  });

  // Handle RTL and persist preference
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    // Update body class for RTL-specific styling
    if (lang === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }

    // Persist preference
    try {
      localStorage.setItem('sugi-lang', lang);
    } catch {
      // localStorage may not be available
    }
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
