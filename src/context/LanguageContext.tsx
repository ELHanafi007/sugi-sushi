'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

type Lang = 'en' | 'ar';
export type NavTab = 'home' | 'menu';

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
    'menu.exp_title': "The Connoisseur's",
    'menu.discovery_title': 'Selection',
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
    'menu.label': 'Menu',
    'menu.exp_span': ' Mastery',
    'menu.cat_label': 'Category',

    // Footer
    'footer.brand': 'Sugi Sushi',
    'footer.perfection': 'Curating Perfection',
    'footer.legal': '© 2024 Sugi Sushi. All Rights Reserved.',
    'footer.crafted': 'Crafted by Karim Graphic',

    // Reveal
    'reveal.sub': 'Kinetic Experience',

    // Filters
    'filter.vegetarian': 'Vegetarian',
    'filter.spicy': 'Spicy',
    'filter.bestseller': 'Best Seller',

    // Landing
    'landing.badge': 'Sugi Sushi',
    'landing.location': 'Fresh sushi, crafted for your evening',
    'landing.hero_title': 'Sushi that looks sharp and tastes even better.',
    'landing.hero_copy': 'Fresh rolls, sashimi, hot starters, drinks, and sharing boxes prepared with clean flavors and proper details.',
    'landing.view_menu': 'View Menu',
    'landing.reserve': 'Reserve',
    'landing.stat1': '20+',
    'landing.stat1_label': 'menu sections',
    'landing.stat2': 'Fresh',
    'landing.stat2_label': 'prepared daily',
    'landing.stat3': 'Dine in',
    'landing.stat3_label': 'or reserve your table',
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
    'landing.flow_label': 'Reservation flow',
    'landing.flow_title': 'Built for calm, easy planning.',
    'landing.flow_copy': 'Move from planning your visit to securing your table without friction. The landing page now behaves like a guided reservation experience.',
    'landing.step1': 'Choose your moment',
    'landing.step1_copy': 'Pick your date and preferred dining window with ease.',
    'landing.step2': 'Share the details',
    'landing.step2_copy': 'Tell us about your party so we can prepare the perfect table for you.',
    'landing.step3': 'Confirm your visit',
    'landing.step3_copy': 'We will welcome you with a calm, curated experience designed around your evening.',
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
    'signature.label': 'الروائع',
    'signature.title1': 'توقيع',
    'signature.title2': 'سوجي',
    'signature.collection': 'مختارات النخبة',
    'signature.badge': 'حصري',
    'signature.sig': 'إبداع الشيف',
    'signature.curated': 'منتقاة بعناية',
    'signature.climax': 'ذروة التذوق',

    // Artistry
    'artistry.label': 'الفن والابتكار',
    'artistry.title1': 'دقة',
    'artistry.title2': 'وشغف',
    'artistry.quote': 'السوشي الأصيل لا يطلب التكلف؛ بل يعتمد على دقة الأرز، نقاء المكونات، وتناغم النكهات.',
    'artistry.side1': 'عراقة',
    'artistry.side2': 'ابتكار',

    // Story
    'story.label': 'حكايتنا',
    'story.hero1': 'الجوهر',
    'story.hero2': 'خلف',
    'story.hero3': 'سوجي',
    'story.title': 'تجربة لا تُنسى',
    'story.p1': 'نضع الجودة فوق كل اعتبار: أسماك طازجة، توازن دقيق، وتقديم يرتقي لذائقتكم.',
    'story.p2': 'من قلب التقاليد اليابانية إلى طاولتكم، كل طبق يُحضر ليكون تحفة فنية.',
    'story.sig': 'بصمة سوجي',
    'story.quote': 'الكمال ليس صدفة، بل هو فن التفاصيل.',
    'story.exec_chef': 'مختارات الشيف التنفيذي',
    'story.phil': 'فلسفتنا',

    // Menu
    'menu.archive': 'المجموعة',
    'menu.exp_title': 'مختارات',
    'menu.discovery_title': 'الذواق',
    'menu.selected_count': 'أصناف',
    'menu.search': 'ابحث عن طبقك المفضل...',
    'menu.selections': 'مختارات',
    'menu.no_results': 'لم نتمكن من العثور على طلبك.',
    'menu.featured': 'تحفة اليوم',
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
    'chapter.beginnings': 'المقدمات',
    'chapter.mainworks': 'الأطباق الساخنة',
    'chapter.rawart': 'فن النيء',
    'chapter.rolls': 'اللفائف المتقنة',
    'chapter.collections': 'مجموعات التذوق',
    'chapter.finale': 'الختام والمشروبات',

    // Contact Section
    'contact.label': 'تواصل معنا',
    'contact.art_title': 'عش تجربة ',
    'contact.art_span': 'الاستثناء',
    'contact.visit': 'زيارتكم',
    'contact.location': 'الرياض، المملكة العربية السعودية',
    'contact.visit_sub': 'الملاذ',
    'contact.hours': '١:٠٠ م - ١٢:٠٠ ص',
    'contact.opening_sub': 'الزمن',
    'contact.reservation_sub': 'العناية الشخصية',
    'contact.cta': 'احجز تجربتك',

    // Menu Section Specifics
    'menu.label': 'القائمة',
    'menu.exp_span': ' الأصيلة',
    'menu.cat_label': 'التصنيف',

    // Footer
    'footer.brand': 'سوجي سوشي',
    'footer.perfection': 'رعاية الكمال',
    'footer.legal': '© ٢٠٢٤ سوجي سوشي. جميع الحقوق محفوظة.',
    'footer.crafted': 'صُنع بكل فخر بواسطة كريم غرافيك',

    // Reveal
    'reveal.sub': 'تجربة حركية',

    // Filters
    'filter.vegetarian': 'نباتي',
    'filter.spicy': 'حار',
    'filter.bestseller': 'الأكثر مبيعاً',

    // Landing
    'landing.badge': 'سوجي سوشي',
    'landing.location': 'حيث يلتقي الشغف بالكمال',
    'landing.hero_title': 'جماليات بصرية، ونكهات تأسر الحواس.',
    'landing.hero_copy': 'من اللفائف الراقية إلى الساشيمي الفاخر والمقبلات الساخنة؛ إبداع يتجلى في كل تفصيلة ليقدم لكم أنقى النكهات.',
    'landing.view_menu': 'استكشف القائمة',
    'landing.reserve': 'احجز طاولتك',
    'landing.stat1': '+٢٠',
    'landing.stat1_label': 'صنفاً فاخراً',
    'landing.stat2': 'يومياً',
    'landing.stat2_label': 'من البحر لمائدتك',
    'landing.stat3': 'ضيافة',
    'landing.stat3_label': 'ترتقي لتطلعاتكم',
    'landing.categories_label': 'المقدمة',
    'landing.categories_title': 'انتقِ ذائقتك',
    'landing.all_menu': 'الاطلاع على القائمة الكاملة',
    'landing.open': 'دخول',
    'landing.signatures_label': 'الروائع',
    'landing.signatures_title': 'أطباق حُفرت في الذاكرة.',
    'landing.signatures_copy': 'مختارات تعكس هوية سوجي الحقيقية: أرز مثالي التكوين، صلصات متناغمة، وإضافات لا تقبل المساومة.',
    'landing.craft_label': 'وراء الكواليس',
    'landing.craft_title': 'نقاء التحضير. دقة القطع. استثنائية المذاق.',
    'landing.craft_copy': 'نجرد التجربة من التعقيد ليبقى الجوهر: مكونات النخبة، إتقان في اللف، وتقديم ينبض بالأناقة.',
    'landing.detail1': 'طزاجة مطلقة',
    'landing.detail1_copy': 'تُحضّر لفائفنا وأطباقنا الساخنة فور طلبكم لضمان أعلى درجات الجودة.',
    'landing.detail2': 'تجارب مشتركة',
    'landing.detail2_copy': 'مجموعات وقوارب صُممت لتشاركوا بها من تحبون في لحظات لا تُنسى.',
    'landing.flow_label': 'مسار الحجز',
    'landing.flow_title': 'سلاسة في التخطيط والانتظار.',
    'landing.flow_copy': 'من تخطيط زيارتكم إلى تأكيد طاولتكم، تظل التجربة سلسة ومميزة.',
    'landing.step1': 'اختر وقتك',
    'landing.step1_copy': 'اختر التاريخ والوقت المناسبين لزيارتكم بكل سهولة.',
    'landing.step2': 'شارك التفاصيل',
    'landing.step2_copy': 'أخبرنا عن عدد الضيوف والتفضيلات حتى نستعد لطاولتكم بشكل مثالي.',
    'landing.step3': 'أكد زيارتك',
    'landing.step3_copy': 'سنرحب بكم بتجربة هادئة ومصممة خصيصًا لليلة لكم.',
    'landing.visit_label': 'بانتظاركم',
    'landing.visit_title': 'تفضلوا بالزيارة، ودعوا الباقي علينا.',
    'landing.visit_copy': 'تصفح القائمة، أو احجز طاولتك، واستعد لتجربة استثنائية تفوق التوقعات.',

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
