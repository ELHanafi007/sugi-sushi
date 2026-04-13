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
    // Nav
    'nav.menu': 'Menu',
    'nav.about': 'About',
    'nav.contact': 'Contact',

    // Hero
    'hero.brand': 'SUGI SUSHI',
    'hero.kanji': '杉',
    'hero.tagline': 'Artistry in every slice',
    'hero.scroll': 'Scroll',

    // Story / About
    'story.label': 'Our Story',
    'story.title': 'Crafted with\nDevotion',
    'story.body': 'Every piece of sushi at Sugi is a testament to the Japanese pursuit of perfection. We source the finest ingredients from Tsukiji Market and local farms, preparing each dish with decades of traditional technique.',
    'story.signature': '— The Sugi Kitchen',

    // Menu
    'menu.label': 'The Collection',
    'menu.title': 'Menu',

    // Category names
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
    'menu.cat.Cold Drinks': 'Cold Drinks',
    'menu.cat.Fresh Juices': 'Fresh Juices',
    'menu.cat.Hot Drinks': 'Hot Drinks',
    'menu.cat.Desserts': 'Desserts',
    'menu.cat.Extra Sauces': 'Sauces',

    // Dish tags
    'tag.signature': 'Signature',
    'tag.best seller': 'Best Seller',
    "tag.chef's choice": "Chef's Choice",
    'tag.spicy': 'Spicy',
    'tag.premium': 'Premium',
    'tag.new': 'New',
    'tag.classic': 'Classic',
    'tag.seafood': 'Seafood',
    'tag.vegetarian': 'Vegetarian',
    'tag.healthy': 'Healthy',

    // Contact
    'contact.label': 'Visit Us',
    'contact.title': 'Reserve\nYour Table',
    'contact.location': 'Saudi Arabia',
    'contact.hours': 'Daily 12 PM — 11 PM',
    'contact.cta': 'Call to Reserve',
    'contact.phone': '+966 XX XXX XXXX',

    // Footer
    'footer.copy': '© 2026 Sugi Sushi',
    'footer.made': 'Crafted with 心 (kokoro)',

    // Common
    'common.sr': 'SR',
    'common.cal': 'cal',
    'common.coming-soon': 'Coming Soon',
    'common.end-of': 'End of',
  },
  ar: {
    // Nav
    'nav.menu': 'القائمة',
    'nav.about': 'قصتنا',
    'nav.contact': 'تواصل',

    // Hero
    'hero.brand': 'سوجي سوشي',
    'hero.kanji': '杉',
    'hero.tagline': 'الفن في كل شريحة',
    'hero.scroll': 'اسحب',

    // Story / About
    'story.label': 'قصتنا',
    'story.title': 'صُنع بإتقان\nوشغف',
    'story.body': 'كل قطعة سوشي في سوجي هي شهادة على السعي الياباني وراء الكمال. نحضر أجود المكونات من سوق تسوكيجي والمزارع المحلية، ونعد كل طبق بعقود من التقنية التقليدية.',
    'story.signature': '— مطبخ سوجي',

    // Menu
    'menu.label': 'التشكيلة المختارة',
    'menu.title': 'القائمة',

    // Category names
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
    'menu.cat.Gunkan': 'قانكن',
    'menu.cat.Temaki': 'تيماكي',
    'menu.cat.Maki Rolls': 'ماكي',
    'menu.cat.Aromaki Rolls': 'أروماكي',
    'menu.cat.Aromaki Fried': 'أروماكي مقرمش',
    'menu.cat.California Rolls': 'كاليفورنيا',
    'menu.cat.Special Rolls': 'لفائف خاصة',
    'menu.cat.Fried Rolls': 'لفائف مقرمشة',
    'menu.cat.Boxes': 'بوكسات',
    'menu.cat.Sugi Boat': 'سفينة سوجي',
    'menu.cat.Cold Drinks': 'مشروبات باردة',
    'menu.cat.Fresh Juices': 'عصائر طازجة',
    'menu.cat.Hot Drinks': 'مشروبات ساخنة',
    'menu.cat.Desserts': 'الحلويات',
    'menu.cat.Extra Sauces': 'صلصات',

    // Dish tags
    'tag.signature': 'مميز',
    'tag.best seller': 'الأكثر طلباً',
    "tag.chef's choice": 'اختيار الشيف',
    'tag.spicy': 'حار',
    'tag.premium': 'ممتاز',
    'tag.new': 'جديد',
    'tag.classic': 'كلاسيكي',
    'tag.seafood': 'ثمار البحر',
    'tag.vegetarian': 'نباتي',
    'tag.healthy': 'صحي',

    // Contact
    'contact.label': 'زورونا',
    'contact.title': 'احجز\nطاولتك',
    'contact.location': 'المملكة العربية السعودية',
    'contact.hours': 'يومياً ١٢ ظهراً — ١١ مساءً',
    'contact.cta': 'اتصل للحجز',
    'contact.phone': '+966 XX XXX XXXX',

    // Footer
    'footer.copy': '© ٢٠٢٦ سوجي سوشي',
    'footer.made': 'صُنع بـ 心 (كوكورو)',

    // Common
    'common.sr': 'ر.س',
    'common.cal': 'سعرة',
    'common.coming-soon': 'قريباً',
    'common.end-of': 'نهاية',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sugi-lang');
      if (saved === 'ar' || saved === 'en') return saved;
      if (navigator.language?.startsWith('ar')) return 'ar';
    }
    return 'en';
  });

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    try { localStorage.setItem('sugi-lang', lang); } catch {}
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
