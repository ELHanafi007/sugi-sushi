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
    'menu.cat.Sushi': 'Sushi',
    'menu.cat.Ramen': 'Ramen',
    'menu.cat.Grill': 'Grill',
    'menu.cat.Sake': 'Sake',
    'location': 'Washington D.C.',
    'established': 'Established 2026',
  },
  ar: {
    'nav.menu': 'القائمة',
    'nav.story': 'قصتنا',
    'nav.reserve': 'حجز',
    'nav.contact': 'اتصل بنا',
    'hero.subtitle': 'الفن في كل شريحة',
    'menu.title': 'القائمة',
    'menu.collection': 'المجموعة المختارة',
    'menu.cat.Sushi': 'سوشي',
    'menu.cat.Ramen': 'رامن',
    'menu.cat.Grill': 'مشويات',
    'menu.cat.Sake': 'ساكي',
    'location': 'واشنطن دي سي',
    'established': 'تأسس عام ٢٠٢٦',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  // Handle RTL
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
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
