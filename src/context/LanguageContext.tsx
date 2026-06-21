'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

type Lang = 'en' | 'ar';
export type NavTab = 'home' | 'menu' | 'gallery';

interface ContextType {
  lang: Lang;
  isRTL: boolean;
  setLang: (l: Lang) => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  activeCategory: string | null;
  setActiveCategory: (cat: string | null) => void;
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
    'hero.reserve': 'Reserve a Place',
    'hero.menu': 'Our Menu',
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
    'menu.current_price': 'Price',
    'menu.from': 'From',
    
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

    // Landing
    'landing.badge': 'Sugi Sushi',
    'landing.location': 'Fresh sushi, made to order',
    'landing.hero_title': 'Sushi that looks sharp and tastes even better.',
    'landing.hero_copy': 'Fresh rolls, sashimi, hot starters, drinks, and sharing boxes prepared with clean flavors and proper details.',
    'landing.view_menu': 'View Menu',
    'landing.reserve': 'Reserve',
    'landing.stat1': '20+',
    'landing.stat1_label': 'menu sections',
    'landing.stat2': 'Fresh',
    'landing.stat2_label': 'prepared daily',
    'landing.stat3': 'Dine in',
    'landing.stat3_label': 'or order at table',
    'landing.categories_label': 'Start here',
    'landing.categories_title': 'Pick your mood',
    'landing.all_menu': 'Open full menu',
    'landing.open': 'Open',
    'landing.signatures_label': 'Popular picks',
    'landing.signatures_title': 'The dishes people come back for.',
    'landing.signatures_copy': 'A quick look at the plates that carry the Sugi style: clean rice, balanced sauces, and generous fillings.',
    'landing.craft_label': 'The kitchen',
    'landing.craft_title': 'Clean prep. Fresh cuts. No drama.',
    'landing.craft_copy': 'We keep the experience focused: good ingredients, careful rolling, quick service, and flavors that make sense from the first bite.',
    'landing.detail1': 'Made fresh',
    'landing.detail1_copy': 'Rolls and hot dishes are prepared close to serving time.',
    'landing.detail2': 'Easy to share',
    'landing.detail2_copy': 'Boxes, boats, rolls, and sides built for tables, friends, and family.',
    'landing.gallery': 'Gallery',
    'landing.visit_label': 'Ready?',
    'landing.visit_title': 'Come hungry. We’ll handle the rest.',
    'landing.visit_copy': 'Browse the menu, reserve a table, or jump straight into your favorite category.',

    // Categories
    'menu.cat.Salads': 'Salads',
    'menu.cat.Salad': 'Salad',
    'menu.cat.Soups': 'Soups',
    'menu.cat.Soup': 'Soup',
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
    'menu.cat.Specialty': 'Specialty',
    'menu.cat.Sugi Roll': 'Sugi Roll',
    'menu.cat.kani  CRUNCHY   roll': 'Kani Crunchy',
    'menu.cat.Fire Crunchy roll': 'Fire Crunchy',
    'menu.cat.TUNA ROLL': 'Tuna Roll',
    'menu.cat.Vegi roll': 'Vegi Roll',
    'menu.cat.Chicken Tempura Roll': 'Chicken Tempura',
    'menu.cat.Flame SALMON ROLL': 'Flame Salmon',
    'menu.cat.Flame crab  roll': 'Flame Crab',
    'menu.cat.LOBSTER ROLL': 'Lobster Roll',
    'menu.cat.TRUFFLE tanoki   ROLL': 'Truffle Roll',
    'menu.cat.WIN RollS': 'Win Rolls',
    'menu.cat.Dynamite Roll': 'Dynamite Roll',
    'menu.cat.Beef   Roll': 'Beef Roll',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.menu': 'القائمة',
    'nav.reservations': 'الحجز',
    'nav.gallery': 'الصور',
    'nav.contact': 'تواصل',

    // Hero
    'hero.est': 'من ٢٠٢٤',
    'hero.cta': 'شوف القائمة',
    'hero.reserve': 'احجز طاولة',
    'hero.menu': 'شوف القائمة',
    'hero.scroll': 'انزل وشوف أكثر',

    // Atmosphere
    'atmosphere.label': 'الأجواء',
    'atmosphere.quote': 'مكان هادئ، أكل مرتب، وسوشي معمول <span class="text-gold">بنَفَس طازج</span>.',
    'atmosphere.silence': 'هدوء',
    'atmosphere.motion': 'حيوية',

    // Signature
    'signature.label': 'اختياراتنا',
    'signature.title1': 'أطباق',
    'signature.title2': 'سوجي',
    'signature.collection': 'اختيارات جاهزة لك',
    'signature.badge': 'مميز',
    'signature.sig': 'اختيار الشيف',
    'signature.curated': 'مختار بعناية',
    'signature.climax': 'أكثر شيء ينطلب',

    // Artistry
    'artistry.label': 'من المطبخ',
    'artistry.title1': 'طازج',
    'artistry.title2': 'ومتوازن',
    'artistry.quote': 'السوشي الحلو ما يحتاج مبالغة؛ يحتاج رز مضبوط، مكونات نظيفة، وصوص في مكانه.',
    'artistry.side1': 'طازج',
    'artistry.side2': 'مرتب',

    // Story
    'story.label': 'قصتنا',
    'story.hero1': 'فكرة',
    'story.hero2': 'ورا',
    'story.hero3': 'سوجي',
    'story.title': 'سوشي واضح، نظيف، ولذيذ',
    'story.p1': 'نركز على الطعم قبل الكلام: مكونات طازجة، صوصات موزونة، وتقديم يفتح النفس.',
    'story.p2': 'من الرول الخفيف إلى البوكسات الكبيرة، كل شيء معمول عشان ينطلب مرة ثانية.',
    'story.sig': 'توقيع سوجي',
    'story.quote': 'البساطة إذا كانت مضبوطة تكفي.',
    'story.exec_chef': 'اختيارات الشيف',
    'story.phil': 'طريقتنا',

    // Menu
    'menu.archive': 'القائمة',
    'menu.exp_title': 'اختار',
    'menu.discovery_title': 'طلبك',
    'menu.selected_count': 'أصناف',
    'menu.search': 'ابحث عن طبقك...',
    'menu.selections': 'اختيارات',
    'menu.no_results': 'ما لقينا شيء بهذا الاسم.',
    'menu.featured': 'مميز',
    'menu.current_price': 'السعر',
    'menu.from': 'من',
    
    // Strict Menu / Details
    'strict.clear': 'مسح',
    'strict.allergens': 'الحساسية',
    'strict.no_allergens': 'ما فيه مسببات حساسية مذكورة.',
    'strict.details': 'التفاصيل',
    'strict.sourced': 'مكونات طازجة وتحضير يومي.',
    'strict.recommendations': 'اقتراحات الشيف',
    'strict.pairs_vibe': 'يناسب الطلب',
    'strict.results': 'النتائج',
    'strict.more_from': 'المزيد من',

    // Location
    'loc.hero1': 'زورنا',
    'loc.hero2': 'في سوجي',
    'loc.desc': 'سوشي طازج وأجواء مريحة في قلب المدينة.',
    'loc.label': 'الموقع',
    'loc.address': '١٢٣ شارع الفخامة، الرياض',
    'loc.city': 'الرياض، السعودية',
    'loc.mon_thu': 'الاثنين - الخميس',
    'loc.fri_sat': 'الجمعة - السبت',
    'loc.weekdays': 'أيام الأسبوع',
    'loc.weekend': 'نهاية الأسبوع',
    'loc.concierge': 'اتصال مباشر',
    'loc.sun': 'الأحد',
    'loc.t1': '١:٠٠ م - ١٢:٠٠ ص',
    'loc.t2': '١:٠٠ م - ١:٠٠ ص',
    'loc.closed': 'مغلق',
    'loc.res_desc': 'احجز طاولتك وخلي الباقي علينا.',
    'loc.call': 'اتصل الآن',
    'loc.map': 'افتح الخريطة',

    // Reservations
    'res.success': 'وصلنا طلب الحجز',
    'res.next': 'التالي',
    'res.prev': 'رجوع',
    'res.review': 'مراجعة',
    'res.confirm_btn': 'تأكيد الحجز',
    'res.confirm_title': 'جاهز',
    'res.confirm_span': 'نثبت الحجز؟',
    'res.title_title': 'حجز ',
    'res.title_span': 'سوجي',
    'res.placeholder_name': 'اكتب اسمك',
    'res.contact_number': 'رقم الهاتف',
    'res.guest_name': 'الاسم',
    'res.date': 'التاريخ',
    'res.time': 'الوقت',
    'res.edit': 'تعديل',
    'res.details': 'التفاصيل',
    'res.timing': 'التوقيت',
    'res.finalize': 'التأكيد',
    'res.guests': 'عدد الضيوف',
    'res.policy': 'تقدر تعدل أو تلغي قبل موعدك بـ ٢٤ ساعة.',
    'res.info': 'معلومات الحجز',
    'res.address': 'العنوان',
    'res.hours': 'ساعات العمل',
    'res.contact': 'الاتصال',
    // Chapters
    'chapter.beginnings': 'البدايات',
    'chapter.mainworks': 'الأطباق الساخنة',
    'chapter.rawart': 'السوشي النيء',
    'chapter.rolls': 'الرولات',
    'chapter.collections': 'البوكسات',
    'chapter.finale': 'المشروبات والحلى',

    // Contact Section
    'contact.label': 'تواصل معنا',
    'contact.art_title': 'تعال ',
    'contact.art_span': 'نجربك سوجي',
    'contact.visit': 'زرنا',
    'contact.location': '١٢٣ شارع الفخامة، الرياض',
    'contact.visit_sub': 'العنوان',
    'contact.hours': '١:٠٠ م - ١٢:٠٠ ص',
    'contact.opening_sub': 'ساعات العمل',
    'contact.reservation_sub': 'للحجز والاستفسار',
    'contact.cta': 'احجز طاولة',

    // Menu Section Specifics
    'menu.label': 'القائمة',
    'menu.exp_span': ' اللي يناسبك',
    'menu.cat_label': 'القسم',

    // Footer
    'footer.brand': 'سوجي سوشي',
    'footer.perfection': 'سوشي طازج كل يوم',
    'footer.legal': '© ٢٠٢٤ سوجي سوشي. جميع الحقوق محفوظة.',
    'footer.crafted': 'تصميم كريم غرافيك',

    // Reveal
    'reveal.sub': 'سوجي سوشي',

    // Gallery
    'gallery.label': 'الصور',
    'gallery.description': 'لقطات من الأطباق، المكان، والتفاصيل اللي تفرق في تجربة سوجي.',
    'gallery.item1.title': 'التحضير',
    'gallery.item1.tag': 'مطبخ',
    'gallery.item2.title': 'جلسة سوجي',
    'gallery.item2.tag': 'مكان',
    'gallery.item3.title': 'تركيز الشيف',
    'gallery.item3.tag': 'تحضير',
    'gallery.item4.title': 'نكهة أومامي',
    'gallery.item4.tag': 'أكل',
    'gallery.item5.title': 'تفاصيل الطبق',
    'gallery.item5.tag': 'تفاصيل',
    'gallery.item6.title': 'مشروبات',
    'gallery.item6.tag': 'بارد',

    // Filters
    'filter.vegetarian': 'نباتي',
    'filter.spicy': 'حار',
    'filter.bestseller': 'الأكثر مبيعاً',

    // Landing
    'landing.badge': 'سوجي سوشي',
    'landing.location': 'سوشي طازج يتحضر وقت الطلب',
    'landing.hero_title': 'سوشي شكله مرتب وطعمه أرتب.',
    'landing.hero_copy': 'رولات، ساشيمي، مقبلات ساخنة، مشروبات وبوكسات مشاركة. نكهات واضحة، مكونات طازجة، وتقديم يفتح النفس.',
    'landing.view_menu': 'شوف القائمة',
    'landing.reserve': 'احجز',
    'landing.stat1': '+٢٠',
    'landing.stat1_label': 'قسم في القائمة',
    'landing.stat2': 'طازج',
    'landing.stat2_label': 'تحضير يومي',
    'landing.stat3': 'جلسات',
    'landing.stat3_label': 'وطلب من الطاولة',
    'landing.categories_label': 'ابدأ من هنا',
    'landing.categories_title': 'اختار اللي تشتهيه',
    'landing.all_menu': 'افتح القائمة كاملة',
    'landing.open': 'افتح',
    'landing.signatures_label': 'الأكثر طلباً',
    'landing.signatures_title': 'أطباق يرجعون لها الزبائن.',
    'landing.signatures_copy': 'اختيارات تمثل طابع سوجي: رز مضبوط، صوص متوازن، وحشوات واضحة بدون مبالغة.',
    'landing.craft_label': 'المطبخ',
    'landing.craft_title': 'تحضير نظيف. قطع طازجة. بدون فلسفة زايدة.',
    'landing.craft_copy': 'نخلي التجربة بسيطة وواضحة: مكونات جيدة، لف مضبوط، خدمة سريعة، وطعم مفهوم من أول لقمة.',
    'landing.detail1': 'يتحضر طازج',
    'landing.detail1_copy': 'الرولات والأطباق الساخنة تتحضر قريب من وقت التقديم.',
    'landing.detail2': 'سهل للمشاركة',
    'landing.detail2_copy': 'بوكسات، قوارب، رولات وجوانب تناسب الطاولات والأصدقاء والعائلة.',
    'landing.gallery': 'الصور',
    'landing.visit_label': 'جاهز؟',
    'landing.visit_title': 'تعال جوعان والباقي علينا.',
    'landing.visit_copy': 'شوف القائمة، احجز طاولة، أو ادخل مباشرة على القسم اللي تفضله.',

    // Cart
    'cart.title': 'طلبك',
    'cart.add_to_order': 'إضافة للطلب',
    'cart.instant_delight': 'اطلب الآن',
    'cart.empty': 'ما أضفت شيء بعد',
    'cart.submit': 'أرسل الطلب',
    'cart.total': 'المجموع',
    'cart.table': 'طاولة',
    'cart.status.pending': 'بانتظار التأكيد',
    'cart.status.preparing': 'يتحضر الآن',
    'cart.status.ready': 'جاهز',
    'cart.status.served': 'تم التقديم',
    'cart.preparing_notif': 'طلبك بدأ يتحضر!',

    // Categories
    'menu.cat.Salads': 'السلطات',
    'menu.cat.Salad': 'سلطة',
    'menu.cat.Soups': 'الشوربات',
    'menu.cat.Soup': 'شوربة',
    'menu.cat.Starters': 'مقبلات',
    'menu.cat.Wok, Noodles & Rice': 'ووك ونودلز ورز',
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
    'menu.cat.Special Rolls': 'الرولات الخاصة',
    'menu.cat.Fried Rolls': 'الرولات المقلية',
    'menu.cat.Boxes': 'البوكسات',
    'menu.cat.Sugi Boat': 'قوارب سوجي',
    'menu.cat.Cold Drinks': 'المشروبات الباردة',
    'menu.cat.Fresh Juices': 'العصائر الطازجة',
    'menu.cat.Hot Drinks': 'المشروبات الساخنة',
    'menu.cat.Desserts': 'الحلى',
    'menu.cat.Extra Sauces': 'الصوصات',
    'menu.cat.Specialty': 'أطباق خاصة',
    'menu.cat.Sugi Roll': 'سوجي رول',
    'menu.cat.kani  CRUNCHY   roll': 'كاني كرانشي',
    'menu.cat.Fire Crunchy roll': 'فاير كرانشي',
    'menu.cat.TUNA ROLL': 'تونا رول',
    'menu.cat.Vegi roll': 'فيجي رول',
    'menu.cat.Chicken Tempura Roll': 'دجاج تمبورا رول',
    'menu.cat.Flame SALMON ROLL': 'فليم سلمون رول',
    'menu.cat.Flame crab  roll': 'فليم كراب رول',
    'menu.cat.LOBSTER ROLL': 'لوبستر رول',
    'menu.cat.TRUFFLE tanoki   ROLL': 'ترافل رول',
    'menu.cat.WIN RollS': 'وين رولز',
    'menu.cat.Dynamite Roll': 'داينمت رول',
    'menu.cat.Beef   Roll': 'بيف رول',
  }
};

const LanguageContext = createContext<ContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [pendingDish, setPendingDish] = useState<any>(null);
  const isRTL = lang === 'ar';

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
    const translation = translations[lang][key as keyof typeof translations['en']];
    if (translation) return translation;
    
    // Fallback for categories: "menu.cat.Salads" -> "Salads"
    if (key.startsWith('menu.cat.')) {
      return key.replace('menu.cat.', '');
    }
    
    return key;
  }, [lang]);

  const value = useMemo(() => ({
    lang,
    isRTL,
    setLang,
    activeTab,
    setActiveTab,
    activeCategory,
    setActiveCategory,
    pendingDish,
    setPendingDish,
    t
  }), [lang, isRTL, activeTab, activeCategory, pendingDish, t]);

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
