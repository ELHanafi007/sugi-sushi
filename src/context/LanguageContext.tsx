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
    'nav.home': 'Home',
    'nav.menu': 'Menu',
    'nav.reservations': 'Reservation',
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact',
    'nav.cuisine': 'Japanese Cuisine',
    'hero.brand': 'SUGI SUSHI',
    'hero.tagline': 'Artistry in every slice',
    'hero.explore': 'Explore',
    'story.label': 'Our Story',
    'story.title': 'Crafted with Devotion',
    'story.p1': 'Every piece of sushi at Sugi is a testament to the Japanese pursuit of perfection. We source the finest ingredients — fresh fish from Tsukiji Market, premium wagyu, organic vegetables from local farms.',
    'story.p2': 'Our chefs bring decades of traditional training to every dish, honoring techniques passed down through generations while embracing the subtle innovation that defines modern Japanese cuisine.',
    'story.sig': '— The Sugi Kitchen',
    'story.badge': 'Authentic taste of Japan in every bite.',
    'menu.label': 'The Collection',
    'menu.title': 'Menu',
    'menu.search': 'Search for a dish...',
    'menu.no_results': 'No dishes found matching your search',
    'menu.scroll': 'Scroll to browse',
    'menu.items': 'Items Available',
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
    'contact.visit': 'Visit Us',
    'contact.opening': 'Opening Hours',
    'contact.reservation': 'Reservation',
    'footer.copy': '© 2026 Sugi Sushi',
    'footer.heart': 'Crafted with 心 (kokoro)',
    'footer.perfection': 'Crafted Perfection',
    'footer.privacy': 'Privacy',
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
    
    // Phase 3 Comprehensive Translations
    'hero.micro': 'Perfection in Motion',
    'hero.title': 'SUGI',
    'hero.subtitle': 'Traditional Soul, Modern Vision',
    'hero.cta': 'Explore the Menu',
    'hero.scroll': 'Scroll',
    
    'atmosphere.label': 'The Atmosphere',
    'atmosphere.quote': '"A sanctuary where time slows, and every flavor tells a story of tradition."',
    'atmosphere.silence': 'Silence',
    'atmosphere.motion': 'Motion',
    
    'artistry.label': 'The Hand of the Master',
    'artistry.title1': 'PRECISION',
    'artistry.title2': 'SOUL',
    'artistry.quote': '"In the silence of the kitchen, every cut is a conversation between the ocean and the blade."',
    'artistry.side1': 'ARTISTRY',
    'artistry.side2': 'CRAFTSMANSHIP',
    
    'signature.label': 'The Selection',
    'signature.title1': 'Signature',
    'signature.title2': 'Art.',
    'signature.collection': 'Collection',
    'signature.climax': 'THE CLIMAX',
    'signature.badge': 'Masterpiece 01',
    'signature.sig': 'Signature',
    'signature.curated': 'Curated',
    
    'strict.categories': 'Categories',
    'strict.clear': 'Clear Filters',
    'strict.flavor': 'Flavor',
    'strict.note': 'Chef Note',
    'strict.details': 'Details',
    'strict.vat': 'VAT Incl.',
    'strict.spicy': 'Spicy & Vibrant',
    'strict.umami': 'Balanced & Umami',
    'strict.special': 'House Special',
    'strict.seasonal': 'Seasonal Pick',
    'strict.recommendations': "Chef's Recommendations",
    'strict.pairs_vibe': 'Dynamic Pairs',
    'strict.sourced': 'Sourced with respect for the ocean and the season. Prepared with the precision of a master\'s blade.',
    'strict.pairs': 'Pairs beautifully with...',
    'strict.allergens': 'Allergens',
    'strict.no_allergens': 'No common allergens',
    
    'gallery.label': 'Visual Journey',
    'gallery.title1': 'The',
    'gallery.title2': 'Gallery',
    'gallery.tag1': 'Atmosphere',
    'gallery.tag2': 'Cuisine',
    'gallery.view': 'View',
    
    'loc.label': 'FIND US',
    'loc.desc': 'Located in the heart of Riyadh, a sanctuary of culinary precision awaits your arrival.',
    'loc.address': '123 Luxury Avenue,\nOlaya District',
    'loc.city': 'Riyadh, Saudi Arabia',
    'loc.directions': 'Get Directions',
    'loc.mon_thu': 'Mon - Thu',
    'loc.fri_sat': 'Fri - Sat',
    'loc.sun': 'Sunday',
    'loc.closed': 'Closed',
    'loc.t1': '1:00 PM - 12:00 AM',
    'loc.t2': '1:00 PM - 1:00 AM',
    'loc.res_desc': 'For priority seating and private dining inquiries, please connect with our concierge.',
    'loc.call': 'Call Concierge',
    
    'page.story': 'Our Story',
    'page.refining': 'This experience is being refined for your arrival. Perfection takes time.',
    'page.home': 'Return Home',
    
    // Additional Missing Keys
    'story.quote': '"True luxury is not found in excess, but in the masterful execution of the essential."',
    'story.phil': 'The Sugi Philosophy',
    'story.hero1': 'THE ',
    'story.hero2': 'SOUL',
    'story.hero3': ' OF SUGI',
    'loc.hero1': 'FIND',
    'loc.hero2': ' US',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.menu': 'القائمة',
    'nav.reservations': 'الحجز',
    'nav.gallery': 'المعرض',
    'nav.contact': 'تواصل',
    'nav.cuisine': 'المطبخ الياباني',
    'hero.brand': 'سوجي سوشي',
    'hero.tagline': 'الفن في كل شريحة',
    'hero.explore': 'استكشف',
    'story.label': 'قصتنا',
    'story.title': 'صُنع بإتقان وشغف',
    'story.p1': 'كل قطعة سوشي في سوجي هي شهادة على السعي الياباني وراء الكمال. نحضر أجود المكونات — الأسماك الطازجة من سوق تسوكيجي، والواغيو الممتاز، والخضروات العضوية من المزارع المحلية.',
    'story.p2': 'يحمل طهاتنا عقوداً من التدريب التقليدي إلى كل طبق، مع تقنيات توارثتها الأجيال مع لمسة من الابتكار الذي يميز المطبخ الياباني الحديث.',
    'story.sig': '— مطبخ سوجي',
    'story.badge': 'طعم اليابان الأصيل في كل لقمة.',
    'menu.label': 'التشكيلة المختارة',
    'menu.title': 'القائمة',
    'menu.search': 'ابحث عن طبق...',
    'menu.no_results': 'لم يتم العثور على نتائج تطابق بحثك',
    'menu.scroll': 'مرر للتصفح',
    'menu.items': 'أطباق متاحة',
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
    'contact.visit': 'زورونا',
    'contact.opening': 'ساعات العمل',
    'contact.reservation': 'الحجز',
    'footer.copy': '© ٢٠٢٦ سوجي سوشي',
    'footer.heart': 'صُنع بـ 心 (كوكورو)',
    'footer.perfection': 'إتقان تام',
    'footer.privacy': 'الخصوصية',
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
    
    // Phase 3 Comprehensive Translations
    'hero.micro': 'الكمال في كل حركة',
    'hero.title': 'سوجي',
    'hero.subtitle': 'روح تقليدية، ورؤية حديثة',
    'hero.cta': 'استكشف القائمة',
    'hero.scroll': 'مرر',
    
    'atmosphere.label': 'الأجواء',
    'atmosphere.quote': '"ملاذ يتباطأ فيه الزمن، وكل نكهة تروي قصة من التقاليد."',
    'atmosphere.silence': 'سكون',
    'atmosphere.motion': 'حركة',
    
    'artistry.label': 'لمسة الحرفي الماهر',
    'artistry.title1': 'دقة',
    'artistry.title2': 'شغف',
    'artistry.quote': '"في سكون المطبخ، كل قطيعة هي حوار بين المحيط والنصل."',
    'artistry.side1': 'فـن',
    'artistry.side2': 'حـرفـة',
    
    'signature.label': 'المختارات',
    'signature.title1': 'إبداعات',
    'signature.title2': 'فنية.',
    'signature.collection': 'التشكيلة',
    'signature.climax': 'الذروة',
    'signature.badge': 'تحفة فنية ٠١',
    'signature.sig': 'مميز',
    'signature.curated': 'منتقى بعناية',
    
    'strict.categories': 'الفئات',
    'strict.clear': 'مسح الفلاتر',
    'strict.flavor': 'النكهة',
    'strict.note': 'ملاحظة الشيف',
    'strict.details': 'التفاصيل',
    'strict.vat': 'شامل الضريبة',
    'strict.spicy': 'حار ونابض بالحياة',
    'strict.umami': 'متوازن بنكهة الأومامي',
    'strict.special': 'طبق مميز',
    'strict.seasonal': 'اختيار موسمي',
    'strict.recommendations': 'توصيات الشيف',
    'strict.pairs_vibe': 'تناغم النكهات',
    'strict.sourced': 'مستورد باحترام للمحيط والموسم. مُعد بدقة نصل الحرفي الماهر.',
    'strict.pairs': 'يتناغم بشكل رائع مع...',
    'strict.allergens': 'مسببات الحساسية',
    'strict.no_allergens': 'لا توجد مسببات حساسية شائعة',
    
    'gallery.label': 'رحلة بصرية',
    'gallery.title1': 'المعرض',
    'gallery.title2': 'البصري',
    'gallery.tag1': 'الأجواء',
    'gallery.tag2': 'المطبخ',
    'gallery.view': 'عرض',
    
    'loc.label': 'موقعنا',
    'loc.desc': 'يقع في قلب الرياض، حيث ينتظرك ملاذ من الدقة في فنون الطهي.',
    'loc.address': '١٢٣ شارع الفخامة،\nحي العليا',
    'loc.city': 'الرياض، المملكة العربية السعودية',
    'loc.directions': 'احصل على الاتجاهات',
    'loc.mon_thu': 'الإثنين - الخميس',
    'loc.fri_sat': 'الجمعة - السبت',
    'loc.sun': 'الأحد',
    'loc.closed': 'مغلق',
    'loc.t1': '١:٠٠ م - ١٢:٠٠ ص',
    'loc.t2': '١:٠٠ م - ١:٠٠ ص',
    'loc.res_desc': 'لأولوية الجلوس واستفسارات العشاء الخاص، يرجى التواصل مع فريق الكونسيرج.',
    'loc.call': 'تواصل مع الكونسيرج',
    
    'page.story': 'قصتنا',
    'page.refining': 'هذه التجربة قيد التحسين من أجلك. الكمال يحتاج إلى وقت.',
    'page.home': 'العودة للرئيسية',
    
    // Additional Missing Keys
    'story.quote': '"الفخامة الحقيقية لا تكمن في المبالغة، بل في التنفيذ المتقن للجوهر."',
    'story.phil': 'فلسفة سوجي',
    'story.hero1': 'روح ',
    'story.hero2': 'سوجي',
    'story.hero3': ' الخالدة',
    'loc.hero1': 'موقعنا',
    'loc.hero2': '',
  },
};

const Ctx = createContext<Ctx | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem('sugi-lang');
    if (s === 'ar' || s === 'en') {
      setLang(s as Lang);
    } else if (navigator.language?.startsWith('ar')) {
      setLang('ar');
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    try { localStorage.setItem('sugi-lang', lang); } catch {}
  }, [lang, isInitialized]);

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
