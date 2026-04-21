'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

type Lang = 'en' | 'ar';
export type NavTab = 'home' | 'menu' | 'reservations' | 'location' | 'gallery';

interface ContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  pendingDish: any;
  setPendingDish: (dish: any) => void;
  t: (k: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.menu': 'Menu',
    'nav.reservations': 'Reservations',
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact',

    // Hero
    'hero.est': 'Established 2024',
    'hero.cta': 'Explore the Menu',
    'hero.scroll': 'Scroll to Explore',

    // Atmosphere
    'atmosphere.label': 'The Vibe',
    'atmosphere.quote': 'A cinematic journey through the <span class="text-gold">art of sushi</span>.',
    'atmosphere.silence': 'Silence',
    'atmosphere.motion': 'Motion',

    // Signature
    'signature.label': 'Signature',
    'signature.title1': 'The Master\'s',
    'signature.title2': 'Collection',
    'signature.collection': 'Curated Excellence',
    'signature.badge': 'Signature',
    'signature.sig': 'Chef\'s Signature',
    'signature.curated': 'Curated',
    'signature.climax': 'The Emotional Peak',

    // Artistry
    'artistry.label': 'Craftsmanship',
    'artistry.title1': 'Precision',
    'artistry.title2': 'Passion',
    'artistry.quote': 'Culinary art is not just about taste; it is about the <span class="text-gold">soul</span> of the ingredients.',
    'artistry.side1': 'Tradition',
    'artistry.side2': 'Innovation',

    // Story
    'story.label': 'Our Story',
    'story.hero1': 'The Soul',
    'story.hero2': 'behind the',
    'story.hero3': 'Craft',
    'story.title': 'A Legacy of Excellence',
    'story.p1': 'Every dish tells a story of tradition and innovation.',
    'story.p2': 'From the heart of Kyoto to your table.',
    'story.sig': 'The Sugi Signature',
    'story.quote': 'Excellence is not an act, but a habit.',
    'story.exec_chef': 'Executive Chef Selection',
    'story.phil': 'Our Philosophy',

    // Menu
    'menu.archive': 'The Collection',
    'menu.exp_title': 'Culinary',
    'menu.discovery_title': 'Discovery',
    'menu.selected_count': 'Items',
    'menu.search': 'Search for your favorite...',
    'menu.selections': 'Selections',
    'menu.no_results': 'No masterpieces found.',
    'menu.featured': 'Featured Masterpiece',
    
    // Strict Menu / Details
    'strict.clear': 'Clear Search',
    'strict.allergens': 'Allergen Information',
    'strict.no_allergens': 'No known allergens.',
    'strict.details': 'Dish Details',
    'strict.sourced': 'Sourced from the finest ingredients.',
    'strict.recommendations': 'Chef\'s Recommendations',
    'strict.pairs_vibe': 'Pairs with the Vibe',
    'strict.results': 'Search Results',
    'strict.more_from': 'More from',

    // Location
    'loc.hero1': 'Find our',
    'loc.hero2': 'Sanctuary',
    'loc.desc': 'A hidden gem in the heart of the city.',
    'loc.label': 'Location',
    'loc.address': '123 Luxury Ave, Riyadh',
    'loc.city': 'Riyadh, Saudi Arabia',
    'loc.mon_thu': 'Monday - Thursday',
    'loc.fri_sat': 'Friday - Saturday',
    'loc.weekdays': 'Weekdays',
    'loc.weekend': 'Weekend Excellence',
    'loc.concierge': 'Direct Concierge',
    'loc.sun': 'Sunday',
    'loc.t1': '1:00 PM - 12:00 AM',
    'loc.t2': '1:00 PM - 1:00 AM',
    'loc.closed': 'Closed',
    'loc.res_desc': 'Book your table for an unforgettable experience.',
    'loc.call': 'Call Now',
    'loc.map': 'Explore Map',

    // Reservations
    'res.success': 'Reservation received',
    'res.next': 'Next',
    'res.prev': 'Back',
    'res.review': 'Review',
    'res.confirm_btn': 'Confirm Reservation',
    'res.confirm_title': 'Ready for the',
    'res.confirm_span': 'Experience?',
    'res.title_title': 'The ',
    'res.title_span': 'Experience',
    'res.placeholder_name': 'Your Name',
    'res.contact_number': 'Phone',
    'res.guest_name': 'Name',
    'res.date': 'Date',
    'res.time': 'Time',
    'res.edit': 'Edit',
    'res.details': 'Details',
    'res.timing': 'Timing',
    'res.finalize': 'Finalize',
    'res.guests': 'Number of Guests',
    'res.policy': 'Cancellations are accepted up to 24 hours before your reservation.',
    'res.info': 'Information',
    'res.address': 'Address',
    'res.hours': 'Opening Hours',
    'res.contact': 'Contact',
    // Chapters
    'chapter.beginnings': 'The Beginnings',
    'chapter.mainworks': 'Main Works',
    'chapter.rawart': 'The Art of Raw',
    'chapter.rolls': 'Signature Rolls',
    'chapter.collections': 'The Collections',
    'chapter.finale': 'The Finale',

    // Contact Section
    'contact.label': 'Reach Out',
    'contact.art_title': 'Experience ',
    'contact.art_span': 'Excellence',
    'contact.visit': 'Visit Us',
    'contact.location': '123 Luxury Ave, Riyadh',
    'contact.visit_sub': 'The Sanctuary',
    'contact.hours': '1:00 PM - 12:00 AM',
    'contact.opening_sub': 'Temporal Grace',
    'contact.reservation_sub': 'Personal Concierge',
    'contact.cta': 'Book Your Experience',

    // Menu Section Specifics
    'menu.label': 'The Menu',
    'menu.exp_span': ' Mastery',
    'menu.cat_label': 'Category',

    // Footer
    'footer.brand': 'Sugi Sushi',
    'footer.perfection': 'Curating Perfection',
    'footer.legal': '© 2024 Sugi Sushi. All Rights Reserved.',
    'footer.crafted': 'Crafted by Karim Graphic',

    // Reveal
    'reveal.sub': 'Kinetic Experience',

    // Gallery
    'gallery.label': 'Gallery',
    'gallery.description': '"In every grain of rice and every cut of fish, we find the poetry of nature. This archive captures the fleeting beauty of our craft."',
    'gallery.item1.title': 'The Preparation',
    'gallery.item1.tag': 'CRAFT',
    'gallery.item2.title': 'Sanctuary of Senses',
    'gallery.item2.tag': 'ATMOSPHERE',
    'gallery.item3.title': 'Master\'s Focus',
    'gallery.item3.tag': 'ARTISTRY',
    'gallery.item4.title': 'Umami Symphony',
    'gallery.item4.tag': 'CUISINE',
    'gallery.item5.title': 'Hidden Details',
    'gallery.item5.tag': 'TEXTURE',
    'gallery.item6.title': 'Liquid Gold',
    'gallery.item6.tag': 'ELIXIR',

    // Filters
    'filter.vegetarian': 'Vegetarian',
    'filter.spicy': 'Spicy',
    'filter.bestseller': 'Best Seller',

    // Categories
    'menu.cat.Salads': 'Salads',
    'menu.cat.Soups': 'Soups',
    'menu.cat.Starters': 'Starters',
    'menu.cat.Wok, Noodles & Rice': 'Wok & Noodles',
    'menu.cat.Tempura': 'Tempura',
    'menu.cat.Sugi Dishes': 'Sugi Dishes',
    'menu.cat.Sashimi': 'Sashimi',
    'menu.cat.Tataki': 'Tataki',
    'menu.cat.Ceviche': 'Ceviche',
    'menu.cat.Nigiri': 'Nigiri',
    'menu.cat.Gunkan': 'Gunkan',
    'menu.cat.Temaki': 'Temaki',
    'menu.cat.Maki Rolls': 'Maki Rolls',
    'menu.cat.Aromaki Rolls': 'Aromaki Rolls',
    'menu.cat.Aromaki Fried': 'Fried Aromaki',
    'menu.cat.California Rolls': 'California Rolls',
    'menu.cat.Special Rolls': 'Special Rolls',
    'menu.cat.Fried Rolls': 'Fried Rolls',
    'menu.cat.Boxes': 'Boxes',
    'menu.cat.Sugi Boat': 'Sugi Boat',
    'menu.cat.Cold Drinks': 'Cold Drinks',
    'menu.cat.Fresh Juices': 'Fresh Juices',
    'menu.cat.Hot Drinks': 'Hot Drinks',
    'menu.cat.Desserts': 'Desserts',
    'menu.cat.Extra Sauces': 'Sauces',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.menu': 'القائمة',
    'nav.reservations': 'الحجوزات',
    'nav.gallery': 'المعرض',
    'nav.contact': 'اتصل بنا',

    // Hero
    'hero.est': 'تأسست عام ٢٠٢٤',
    'hero.cta': 'استكشف القائمة',
    'hero.scroll': 'مرر للاستكشاف',

    // Atmosphere
    'atmosphere.label': 'الأجواء',
    'atmosphere.quote': 'رحلة سينمائية عبر <span class="text-gold">فن السوشي</span>.',
    'atmosphere.silence': 'صمت',
    'atmosphere.motion': 'حركة',

    // Signature
    'signature.label': 'التوقيع',
    'signature.title1': 'لمسة',
    'signature.title2': 'المعلم',
    'signature.collection': 'تميز منسق',
    'signature.badge': 'توقيع',
    'signature.sig': 'توقيع الشيف',
    'signature.curated': 'منسق',
    'signature.climax': 'ذروة الأحاسيس',

    // Artistry
    'artistry.label': 'الحرفة',
    'artistry.title1': 'الدقة',
    'artistry.title2': 'الشغف',
    'artistry.quote': 'فن الطهي ليس مجرد مذاق؛ بل هو <span class="text-gold">روح</span> المكونات.',
    'artistry.side1': 'تقاليد',
    'artistry.side2': 'ابتكار',

    // Story
    'story.label': 'قصتنا',
    'story.hero1': 'روح',
    'story.hero2': 'خلف',
    'story.hero3': 'الحرفة',
    'story.title': 'إرث من التميز',
    'story.p1': 'كل طبق يحكي قصة من التقاليد والابتكار.',
    'story.p2': 'من قلب كيوتو إلى طاولتك.',
    'story.sig': 'توقيع سوجي',
    'story.quote': 'التميز ليس عملاً، بل عادة.',
    'story.exec_chef': 'اختيارات الشيف التنفيذي',
    'story.phil': 'فلسفتنا',

    // Menu
    'menu.archive': 'المجموعة',
    'menu.exp_title': 'رحلة',
    'menu.discovery_title': 'استكشاف',
    'menu.selected_count': 'أصناف',
    'menu.search': 'ابحث عن مفضلتك...',
    'menu.selections': 'اختيارات',
    'menu.no_results': 'لم يتم العثور على نتائج.',
    'menu.featured': 'تحفة مختارة',
    
    // Strict Menu / Details
    'strict.clear': 'مسح البحث',
    'strict.allergens': 'معلومات الحساسية',
    'strict.no_allergens': 'لا توجد مسببات حساسية معروفة.',
    'strict.details': 'تفاصيل الطبق',
    'strict.sourced': 'مصدرها أجود المكونات.',
    'strict.recommendations': 'توصيات الشيف',
    'strict.pairs_vibe': 'يتناسب مع الأجواء',
    'strict.results': 'نتائج البحث',
    'strict.more_from': 'المزيد من',

    // Location
    'loc.hero1': 'ابحث عن',
    'loc.hero2': 'ملاذنا',
    'loc.desc': 'جوهرة خفية في قلب المدينة.',
    'loc.label': 'الموقع',
    'loc.address': '١٢٣ شارع الفخامة، الرياض',
    'loc.city': 'الرياض، المملكة العربية السعودية',
    'loc.mon_thu': 'الاثنين - الخميس',
    'loc.fri_sat': 'الجمعة - السبت',
    'loc.weekdays': 'أيام الأسبوع',
    'loc.weekend': 'عطلة نهاية الأسبوع',
    'loc.concierge': 'الكونسيرج المباشر',
    'loc.sun': 'الأحد',
    'loc.t1': '١:٠٠ م - ١٢:٠٠ ص',
    'loc.t2': '١:٠٠ م - ١:٠٠ ص',
    'loc.closed': 'مغلق',
    'loc.res_desc': 'احجز طاولتك لتجربة لا تُنسى.',
    'loc.call': 'اتصل الآن',
    'loc.map': 'استكشف الخريطة',

    // Reservations
    'res.success': 'تم استلام الحجز',
    'res.next': 'التالي',
    'res.prev': 'رجوع',
    'res.review': 'مراجعة',
    'res.confirm_btn': 'تأكيد الحجز',
    'res.confirm_title': 'هل أنت مستعد',
    'res.confirm_span': 'للتجربة؟',
    'res.title_title': 'تجربة ',
    'res.title_span': 'سوجي',
    'res.placeholder_name': 'اسمك',
    'res.contact_number': 'رقم الهاتف',
    'res.guest_name': 'الاسم',
    'res.date': 'التاريخ',
    'res.time': 'الوقت',
    'res.edit': 'تعديل',
    'res.details': 'التفاصيل',
    'res.timing': 'التوقيت',
    'res.finalize': 'التأكيد',
    'res.guests': 'عدد الضيوف',
    'res.policy': 'يتم قبول الإلغاء قبل ٢٤ ساعة من موعد الحجز.',
    'res.info': 'معلومات',
    'res.address': 'العنوان',
    'res.hours': 'ساعات العمل',
    'res.contact': 'الاتصال',
    // Chapters
    'chapter.beginnings': 'البدايات',
    'chapter.mainworks': 'الأعمال الرئيسية',
    'chapter.rawart': 'فن السوشي',
    'chapter.rolls': 'لفائف التوقيع',
    'chapter.collections': 'المجموعات',
    'chapter.finale': 'الخاتمة',

    // Contact Section
    'contact.label': 'تواصل معنا',
    'contact.art_title': 'اختبر ',
    'contact.art_span': 'التميز',
    'contact.visit': 'زرنا',
    'contact.location': '١٢٣ شارع الفخامة، الرياض',
    'contact.visit_sub': 'الملاذ',
    'contact.hours': '١:٠٠ م - ١٢:٠٠ ص',
    'contact.opening_sub': 'النعمة الزمنية',
    'contact.reservation_sub': 'الكونسيرج الشخصي',
    'contact.cta': 'احجز تجربتك',

    // Menu Section Specifics
    'menu.label': 'القائمة',
    'menu.exp_span': ' الإتقان',
    'menu.cat_label': 'الفئة',

    // Footer
    'footer.brand': 'سوجي سوشي',
    'footer.perfection': 'تنسيق الكمال',
    'footer.legal': '© ٢٠٢٤ سوجي سوشي. جميع الحقوق محفوظة.',
    'footer.crafted': 'صُمم بواسطة كريم غرافيك',

    // Reveal
    'reveal.sub': 'تجربة حركية',

    // Gallery
    'gallery.label': 'المعرض',
    'gallery.description': '"في كل حبة أرز وكل قطعة سمك، نجد شعر الطبيعة. يجسد هذا الأرشيف الجمال العابر لحرفتنا."',
    'gallery.item1.title': 'التحضير',
    'gallery.item1.tag': 'الحرفة',
    'gallery.item2.title': 'ملاذ الحواس',
    'gallery.item2.tag': 'الأجواء',
    'gallery.item3.title': 'تركيز المعلم',
    'gallery.item3.tag': 'الفن',
    'gallery.item4.title': 'سيمفونية أومامي',
    'gallery.item4.tag': 'المطبخ',
    'gallery.item5.title': 'تفاصيل خفية',
    'gallery.item5.tag': 'الملمس',
    'gallery.item6.title': 'الذهب السائل',
    'gallery.item6.tag': 'الإكسير',

    // Filters
    'filter.vegetarian': 'نباتي',
    'filter.spicy': 'حار',
    'filter.bestseller': 'الأكثر مبيعاً',

    // Categories
    'menu.cat.Salads': 'سلطات',
    'menu.cat.Soups': 'شوربات',
    'menu.cat.Starters': 'مقبلات',
    'menu.cat.Wok, Noodles & Rice': 'ووك ونودلز',
    'menu.cat.Tempura': 'تمبورا',
    'menu.cat.Sugi Dishes': 'أطباق سوجي',
    'menu.cat.Sashimi': 'ساشيمي',
    'menu.cat.Tataki': 'تاتاكي',
    'menu.cat.Ceviche': 'سيفيتشي',
    'menu.cat.Nigiri': 'نيجيري',
    'menu.cat.Gunkan': 'غونكان',
    'menu.cat.Temaki': 'تيماكي',
    'menu.cat.Maki Rolls': 'ماكي رولز',
    'menu.cat.Aromaki Rolls': 'أروماكي رولز',
    'menu.cat.Aromaki Fried': 'أروماكي مقلي',
    'menu.cat.California Rolls': 'كاليفورنيا رولز',
    'menu.cat.Special Rolls': 'سبيشال رولز',
    'menu.cat.Fried Rolls': 'فرايد رولز',
    'menu.cat.Boxes': 'بوكسات',
    'menu.cat.Sugi Boat': 'سوجي بوت',
    'menu.cat.Cold Drinks': 'مشروبات باردة',
    'menu.cat.Fresh Juices': 'عصائر طازجة',
    'menu.cat.Hot Drinks': 'مشروبات ساخنة',
    'menu.cat.Desserts': 'حلويات',
    'menu.cat.Extra Sauces': 'صوصات',
  }
};

const LanguageContext = createContext<ContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [pendingDish, setPendingDish] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lang');
    if (saved === 'ar' || saved === 'en') {
      setLang(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
  }, [lang]);

  const t = useCallback((key: string) => {
    return translations[lang][key as keyof typeof translations['en']] || key;
  }, [lang]);

  const value = useMemo(() => ({
    lang,
    setLang,
    activeTab,
    setActiveTab,
    pendingDish,
    setPendingDish,
    t
  }), [lang, activeTab, pendingDish, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}