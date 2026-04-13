'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Lang = 'en' | 'ar';

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
}

const D: Record<Lang, Record<string, string>> = {
  en: {
    'nav.menu': 'Menu',
    'nav.story': 'Story',
    'nav.contact': 'Contact',
    'hero.brand': 'SUGI SUSHI',
    'hero.tagline': 'Artistry in every slice',
    'hero.explore': 'Explore',
    'story.label': 'Our Story',
    'story.title': 'Crafted with Devotion',
    'story.p1': 'Every piece of sushi at Sugi is a testament to the Japanese pursuit of perfection. We source the finest ingredients — fresh fish from Tsukiji Market, premium wagyu, organic vegetables from local farms.',
    'story.p2': 'Our chefs bring decades of traditional training to every dish, honoring techniques passed down through generations while embracing the subtle innovation that defines modern Japanese cuisine.',
    'story.sig': '— The Sugi Kitchen',
    'menu.label': 'The Collection',
    'menu.title': 'Menu',
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
    'contact.label': 'Visit Us',
    'contact.title': 'Reserve Your Table',
    'contact.location': 'Saudi Arabia',
    'contact.hours': 'Daily 12 PM — 11 PM',
    'contact.cta': 'Call to Reserve',
    'footer.copy': '© 2026 Sugi Sushi',
    'footer.heart': 'Crafted with 心 (kokoro)',
    'common.sr': 'SR',
    'common.cal': 'cal',
    'common.coming': 'Coming Soon',
    'common.end': 'End of',
    'tag.Signature': 'Signature',
    'tag.Best Seller': 'Best Seller',
    "tag.Chef's Choice": "Chef's Choice",
    'tag.Spicy': 'Spicy',
    'tag.Premium': 'Premium',
    'tag.New': 'New',
    'tag.Classic': 'Classic',
    'tag.Seafood': 'Seafood',
    'tag.Vegetarian': 'Vegetarian',
    'tag.Healthy': 'Healthy',
  },
  ar: {
    'nav.menu': 'القائمة',
    'nav.story': 'قصتنا',
    'nav.contact': 'تواصل',
    'hero.brand': 'سوجي سوشي',
    'hero.tagline': 'الفن في كل شريحة',
    'hero.explore': 'استكشف',
    'story.label': 'قصتنا',
    'story.title': 'صُنع بإتقان وشغف',
    'story.p1': 'كل قطعة سوشي في سوجي هي شهادة على السعي الياباني وراء الكمال. نحضر أجود المكونات — الأسماك الطازجة من سوق تسوكيجي، والواغيو الممتاز، والخضروات العضوية من المزارع المحلية.',
    'story.p2': 'يحمل طهاتنا عقوداً من التدريب التقليدي إلى كل طبق، مع تقنيات توارثتها الأجيال مع لمسة من الابتكار الذي يميز المطبخ الياباني الحديث.',
    'story.sig': '— مطبخ سوجي',
    'menu.label': 'التشكيلة المختارة',
    'menu.title': 'القائمة',
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
    'contact.label': 'زورونا',
    'contact.title': 'احجز طاولتك',
    'contact.location': 'المملكة العربية السعودية',
    'contact.hours': 'يومياً ١٢ ظهراً — ١١ مساءً',
    'contact.cta': 'اتصل للحجز',
    'footer.copy': '© ٢٠٢٦ سوجي سوشي',
    'footer.heart': 'صُنع بـ 心 (كوكورو)',
    'common.sr': 'ر.س',
    'common.cal': 'سعرة',
    'common.coming': 'قريباً',
    'common.end': 'نهاية',
    'tag.Signature': 'مميز',
    'tag.Best Seller': 'الأكثر طلباً',
    "tag.Chef's Choice": 'اختيار الشيف',
    'tag.Spicy': 'حار',
    'tag.Premium': 'ممتاز',
    'tag.New': 'جديد',
    'tag.Classic': 'كلاسيكي',
    'tag.Seafood': 'ثمار البحر',
    'tag.Vegetarian': 'نباتي',
    'tag.Healthy': 'صحي',
  },
};

const Ctx = createContext<Ctx | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      const s = localStorage.getItem('sugi-lang');
      if (s === 'ar' || s === 'en') return s;
      if (navigator.language?.startsWith('ar')) return 'ar';
    }
    return 'en';
  });

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    try { localStorage.setItem('sugi-lang', lang); } catch {}
  }, [lang]);

  const t = useCallback((k: string) => D[lang][k] || k, [lang]);

  return (
    <Ctx.Provider value={{ lang, setLang, t }}>
      {children}
    </Ctx.Provider>
  );
}

export const useLanguage = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useLanguage must be used within LanguageProvider');
  return c;
};
