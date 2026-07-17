'use client';

import { useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, ChevronRight, Sparkles, UtensilsCrossed, Star, MousePointerClick, CheckCircle, Utensils } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import CurrencyPrice from '@/components/CurrencyPrice';
import { useLanguage, NavTab } from '@/context/LanguageContext';
import { Dish } from '@/data/menuData';

import StrictMenu from '@/components/StrictMenu';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=80';
const LOCAL_LANDING_IMAGES = [
  '/media/landing/sushi-counter.jpg',
  '/media/landing/sushi-closeup.jpg',
  '/media/landing/dining-room.jpg',
  '/media/landing/sushi-selection.jpg',
  '/media/landing/chef-roll.jpg',
  '/media/landing/sushi-rolls.jpg'
];

const CAT_IMAGES: Record<string, string> = {
  'Special Rolls': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=75',
  'Sashimi': 'https://images.unsplash.com/photo-1534256958597-7feec80116e7?auto=format&fit=crop&w=800&q=75',
  'Boxes': 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?auto=format&fit=crop&w=800&q=75',
  'Wok & Noodles': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=75',
  'Starters': 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=75',
  'California Rolls': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=75',
  'Dessert': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=75',
  'Cold Drinks': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=75',
  'Salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=75',
  'Soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=75',
  'Tempura & Fried': 'https://images.unsplash.com/photo-1569050278883-d5c58c39bb7a?auto=format&fit=crop&w=800&q=75',
  'Sugi Dishes': 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=75',
  'Tataki': 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&w=800&q=75',
  'Ceviche': 'https://images.unsplash.com/photo-1534604973900-c41ab4c5e636?auto=format&fit=crop&w=800&q=75',
  'Nigiri': 'https://images.unsplash.com/photo-1611712142469-e39736310f21?auto=format&fit=crop&w=800&q=75',
  'Maki Rolls': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=75',
  'Aromaki Rolls': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=75',
  'Boats': 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?auto=format&fit=crop&w=800&q=75',
  'Hot Drinks': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=75',
  'Fresh Juices': 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=800&q=75',
  'Fry Rolls': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=75',
};

const EASE = [0.19, 1, 0.22, 1] as const;

const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } }
};
const fadeSlideLeft: any = {
  hidden: { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } }
};
const slideFromRightRotate: any = {
  hidden: { opacity: 0, x: '12%', rotate: 2 },
  visible: { opacity: 1, x: 0, rotate: 0, transition: { duration: 0.5, ease: EASE } }
};
const slideFromLeftRotate: any = {
  hidden: { opacity: 0, x: '-12%', rotate: -2 },
  visible: { opacity: 1, x: 0, rotate: 0, transition: { duration: 0.5, ease: EASE } }
};
const fadeSlideRight: any = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } }
};
const scaleReveal: any = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: EASE } }
};
const staggerChildren: any = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } }
};
const itemReveal: any = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } }
};

const VIEWPORT = { once: true, amount: 0.15, margin: '0px 0px -40px 0px' };

const SIGNATURE_CATEGORY_ORDER = [
  'Special Rolls', 'California Rolls', 'Aromaki Rolls', 'Aromaki Fried',
  'Fry Rolls', 'Maki Rolls', 'Sashimi', 'Nigiri', 'Boxes', 'Boats'
];

export default function HomeClient({
  initialMenuData,
  initialCategories,
  initialCategoryData,
  initialTab
}: {
  initialMenuData: Dish[];
  initialCategories: string[];
  initialCategoryData: { name: string, image: string }[];
  initialTab?: NavTab;
}) {
  const menuDataWithPrototype = initialMenuData;
  const { activeTab, setActiveTab, setActiveCategory, t, lang } = useLanguage();

  const categoryImages = useMemo(() => {
    const map = new Map<string, string>();
    initialCategoryData.forEach((cat) => {
      if (cat.image) map.set(cat.name, cat.image);
    });
    return map;
  }, [initialCategoryData]);

  const signatureDishes = useMemo(() => {
    const categoryScore = (category: string) => {
      const index = SIGNATURE_CATEGORY_ORDER.findIndex((name) => category.toLowerCase().includes(name.toLowerCase()));
      return index === -1 ? SIGNATURE_CATEGORY_ORDER.length : index;
    };
    const showcasePool = menuDataWithPrototype.filter((dish) => {
      const category = dish.category.toLowerCase();
      const isShowcase = /roll|sashimi|nigiri|box|boat/.test(category);
      const isSideCategory = /drink|juice|salad|soup|sauce|dessert/.test(category);
      return isShowcase && !isSideCategory;
    });
    const tagged = showcasePool
      .filter((dish) => dish.tags?.some((tag) => ['Signature', 'Best Seller'].includes(tag)))
      .sort((a, b) => categoryScore(a.category) - categoryScore(b.category));
    const taggedIds = new Set(tagged.map((dish) => dish.id));
    const supplemental = showcasePool
      .filter((dish) => !taggedIds.has(dish.id))
      .sort((a, b) => categoryScore(a.category) - categoryScore(b.category));
    return [...tagged, ...supplemental].slice(0, 3);
  }, [menuDataWithPrototype]);

  const featuredCategories = useMemo(() => {
    const preferred = ['Special Rolls', 'Sashimi', 'Boxes', 'Wok & Noodles', 'Starters', 'California Rolls', 'Dessert', 'Cold Drinks'];
    const ordered = [
      ...preferred.filter((cat) => initialCategories.includes(cat)),
      ...initialCategories.filter((cat) => !preferred.includes(cat))
    ];
    return ordered.slice(0, 8);
  }, [initialCategories]);

  const orderSteps = useMemo(() => [
    { value: '01', title: t('landing.step1'), copy: t('landing.step1_copy'), icon: '🍱' },
    { value: '02', title: t('landing.step2'), copy: t('landing.step2_copy'), icon: '⭐' },
    { value: '03', title: t('landing.step3'), copy: t('landing.step3_copy'), icon: '🥢' }
  ], [t]);

  const landingImage = (src: string | undefined, category: string, index: number) => {
    if (src && (src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://'))) return src;
    if (CAT_IMAGES[category]) return CAT_IMAGES[category];
    return LOCAL_LANDING_IMAGES[index % LOCAL_LANDING_IMAGES.length] || FALLBACK_IMAGE;
  };

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, setActiveTab]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.body.style.overflow = '';
    document.body.style.pointerEvents = 'auto';
  }, [activeTab]);

  const openCategory = (category: string) => {
    setActiveCategory(category);
    setActiveTab('menu');
  };

  return (
    <main className="relative min-h-screen bg-bg overflow-x-hidden pb-[104px]">
      <Navbar onTabChange={setActiveTab} activeTab={activeTab} />

      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Hero onTabChange={setActiveTab} />

            {/* ═══════════════════════════════════════════════════
                 SECTION 1: CATEGORIES — Horizontal Discovery
            ═══════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-onyx py-16 md:py-24 border-y border-white/[0.04]">
              {/* Ambient glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.03),transparent_70%)] pointer-events-none" />

              <div className="container-luxury relative z-10">
                <motion.div
                  variants={fadeSlideLeft}
                  initial="hidden"
                  whileInView="visible"
                  viewport={VIEWPORT}
                  className="flex items-end justify-between gap-5 mb-10"
                >
                  <div>
                    <span className="section-label">{t('landing.categories_label')}</span>
                    <h2 className="mt-4 text-white text-3xl md:text-5xl leading-tight" style={{ fontFamily: 'var(--font-brand-serif)', fontStyle: 'italic' }}>
                      {t('landing.categories_title')}
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('menu')}
                    className="hidden md:inline-flex items-center gap-2 text-gold/70 text-[10px] font-mono uppercase tracking-[0.28em] hover:text-gold transition-colors duration-500"
                  >
                    {t('landing.all_menu')}
                    <ChevronRight size={14} />
                  </button>
                </motion.div>

                <motion.div
                  variants={staggerChildren}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15, margin: '0px 0px -40px 0px' }}
                  className="-mx-[var(--container-px)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--container-px)] pb-6 md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0 no-scrollbar"
                >
                  {featuredCategories.map((category, index) => {
                    const image = landingImage(categoryImages.get(category), category, index);
                    return (
                      <motion.button
                        key={category}
                        variants={itemReveal}
                        onClick={() => openCategory(category)}
                        className="group relative h-[340px] w-[72vw] min-w-[72vw] snap-center overflow-hidden rounded-2xl text-left sm:w-[42vw] sm:min-w-[42vw] md:h-[380px] md:w-auto md:min-w-0 active:scale-[0.98] transition-transform duration-300"
                        style={{
                          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.06)',
                        }}
                      >
                        <Image
                          src={image}
                          alt={t(`menu.cat.${category}`)}
                          fill
                          sizes="(max-width: 768px) 72vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover brightness-[0.5] saturate-[1.1] transition-all duration-700 group-hover:scale-110 group-hover:brightness-[0.6]"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent" />

                        {/* Gold border glow on hover */}
                        <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-gold/20 transition-colors duration-700" />

                        {/* Content */}
                        <div className="absolute inset-x-5 bottom-5 md:inset-x-6 md:bottom-6">
                          <div className="mb-3 inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-gold/20 bg-void/60 backdrop-blur-sm px-3 text-gold text-[9px] font-mono tracking-[0.2em]">
                            {String(index + 1).padStart(2, '0')}
                          </div>
                          <h3 className="text-white text-xl md:text-2xl leading-tight" style={{ fontFamily: 'var(--font-brand-serif)', fontStyle: 'italic' }}>
                            {t(`menu.cat.${category}`)}
                          </h3>
                          <p className="mt-2 flex items-center gap-2 text-gold/60 text-[9px] font-mono uppercase tracking-[0.3em] group-hover:text-gold transition-colors duration-500">
                            {t('landing.open')}
                            <ArrowRight size={12} className={`transition-transform duration-500 group-hover:translate-x-1 ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                 SECTION 2: SIGNATURE DISHES — Asymmetric Grid
            ═══════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-bg py-20 md:py-32">
              <div className="container-luxury">
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={VIEWPORT}
                  className="max-w-2xl mb-12 md:mb-16"
                >
                  <span className="section-label">{t('landing.signatures_label')}</span>
                  <h2 className="mt-4 text-white text-3xl md:text-5xl lg:text-6xl leading-tight" style={{ fontFamily: 'var(--font-brand-serif)', fontStyle: 'italic' }}>
                    {t('landing.signatures_title')}
                  </h2>
                  <p className="mt-5 text-white/45 text-base md:text-lg leading-8">{t('landing.signatures_copy')}</p>
                </motion.div>

                {/* Asymmetric: 1 large + 2 stacked */}
                <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-5">
                  {signatureDishes.length > 0 && (
                    <motion.button
                      variants={slideFromRightRotate}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.4 }}
                      onClick={() => { setActiveCategory(signatureDishes[0].category); setActiveTab('menu'); }}
                      className="group overflow-hidden rounded-2xl text-left md:row-span-2 transition-all duration-700 active:scale-[0.985]"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.06)',
                      }}
                    >
                      <div className="relative aspect-[4/5] md:aspect-auto md:h-full overflow-hidden">
                        <Image
                          src={landingImage(signatureDishes[0].image, signatureDishes[0].category, 3)}
                          alt={lang === 'ar' ? signatureDishes[0].nameAr || signatureDishes[0].name : signatureDishes[0].name}
                          fill
                          sizes="(max-width: 768px) 100vw, 55vw"
                          className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />

                        {/* Badge */}
                        <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-gold/20 bg-void/60 backdrop-blur-sm px-3 py-1.5">
                          <Star size={10} className="text-gold fill-gold" />
                          <span className="text-gold text-[8px] font-mono font-bold uppercase tracking-[0.3em]">
                            {t('landing.chefs_pick')}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="absolute inset-x-6 bottom-6 md:inset-x-8 md:bottom-8">
                          <h3 className="text-white text-2xl md:text-4xl leading-tight mb-2" style={{ fontFamily: 'var(--font-brand-serif)', fontStyle: 'italic' }}>
                            {lang === 'ar' ? signatureDishes[0].nameAr || signatureDishes[0].name : signatureDishes[0].name}
                          </h3>
                          <div className="flex items-center gap-4">
                            <CurrencyPrice price={signatureDishes[0].price} className="text-gold text-lg font-mono" />
                            <span className="text-white/25 text-[9px] font-mono uppercase tracking-[0.2em]">{t(`menu.cat.${signatureDishes[0].category}`)}</span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  )}

                  {/* Right column: 2 smaller cards */}
                  <div className="flex flex-col gap-5">
                    {signatureDishes.slice(1, 3).map((dish, index) => {
                      const image = landingImage(dish.image, dish.category, index + 4);
                      return (
                        <motion.button
                          key={dish.id}
                          variants={index === 0 ? slideFromLeftRotate : slideFromRightRotate}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, amount: 0.4 }}
                          onClick={() => { setActiveCategory(dish.category); setActiveTab('menu'); }}
                          className="group overflow-hidden rounded-2xl text-left transition-all duration-700 hover:border-gold/20 active:scale-[0.985]"
                          style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.06)',
                          }}
                        >
                          <div className="relative aspect-[16/10] overflow-hidden">
                            <Image
                              src={image}
                              alt={lang === 'ar' ? dish.nameAr || dish.name : dish.name}
                              fill
                              sizes="(max-width: 768px) 100vw, 40vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/20 to-transparent" />
                          </div>
                          <div className="p-5 md:p-6">
                            <div className="flex items-start justify-between gap-4">
                              <h3 className="text-white text-lg md:text-xl leading-tight" style={{ fontFamily: 'var(--font-brand-serif)', fontStyle: 'italic' }}>
                                {lang === 'ar' ? dish.nameAr || dish.name : dish.name}
                              </h3>
                              <CurrencyPrice price={dish.price} className="shrink-0 text-gold/80 text-sm font-mono" />
                            </div>
                            <p className="mt-2 text-white/35 text-sm leading-6 line-clamp-2">{lang === 'ar' ? dish.descriptionAr || dish.description : dish.description}</p>
                            <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-3">
                              <span className="text-white/25 text-[9px] font-mono uppercase tracking-[0.2em]">{t(`menu.cat.${dish.category}`)}</span>
                              <ArrowRight size={14} className={`text-gold/50 transition-transform duration-500 group-hover:translate-x-1 ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                 SECTION 3: BRAND / STORY — Split Layout
            ═══════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-graphite py-20 md:py-32 border-y border-white/[0.04]">
              <div className="container-luxury">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                  {/* Vertical Carousel Images */}
                  <motion.div
                    variants={scaleReveal}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="relative h-[500px] lg:h-[600px] rounded-2xl overflow-hidden bg-void flex gap-4 p-4"
                    style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
                  >
                    {/* Gradient Masks */}
                    <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-void to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-void to-transparent z-10 pointer-events-none" />

                    {/* Column 1 - Scrolling Down */}
                    <div className="flex-1 overflow-hidden relative rounded-xl">
                      <motion.div
                        animate={{ y: ['-50%', '0%'] }}
                        transition={{ repeat: Infinity, ease: 'linear', duration: 30 }}
                        className="flex flex-col gap-4 absolute top-0 inset-x-0"
                      >
                        {[
                          '/images/carousel/IMG_4154.JPG',
                          '/images/carousel/IMG_4158.JPG',
                          '/images/carousel/IMG_4159.JPG',
                          '/images/carousel/IMG_4154.JPG',
                          '/images/carousel/IMG_4158.JPG',
                          '/images/carousel/IMG_4159.JPG'
                        ].map((src, idx) => (
                          <div key={idx} className="relative w-full pb-[133%] rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                            <Image src={src} alt="Kitchen Image" fill className="object-cover" />
                          </div>
                        ))}
                      </motion.div>
                    </div>

                    {/* Column 2 - Scrolling Up */}
                    <div className="flex-1 overflow-hidden relative rounded-xl">
                      <motion.div
                        animate={{ y: ['0%', '-50%'] }}
                        transition={{ repeat: Infinity, ease: 'linear', duration: 25 }}
                        className="flex flex-col gap-4 absolute top-0 inset-x-0"
                      >
                        {[
                          '/images/carousel/IMG_4160.JPG',
                          '/images/carousel/r.PNG',
                          '/images/carousel/IMG_4154.JPG',
                          '/images/carousel/IMG_4160.JPG',
                          '/images/carousel/r.PNG',
                          '/images/carousel/IMG_4154.JPG'
                        ].map((src, idx) => (
                          <div key={idx} className="relative w-full pb-[125%] rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                            <Image src={src} alt="Kitchen Image" fill className="object-cover" />
                          </div>
                        ))}
                      </motion.div>
                    </div>
                    
                    {/* Floating badge */}
                    <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 z-20">
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-gold/30 to-transparent" />
                      <span className="text-gold/60 text-[8px] font-mono uppercase tracking-[0.5em] bg-void/50 px-2 py-1 rounded backdrop-blur-md">Est. 2024</span>
                      <div className="h-[1px] flex-1 bg-gradient-to-l from-gold/30 to-transparent" />
                    </div>
                  </motion.div>

                  {/* Text */}
                  <motion.div
                    variants={fadeSlideRight}
                    initial="hidden"
                    whileInView="visible"
                    viewport={VIEWPORT}
                    className="flex flex-col gap-8"
                  >
                    <span className="section-label">{t('landing.craft_label')}</span>
                    <h2 className="text-white text-3xl md:text-5xl leading-tight" style={{ fontFamily: 'var(--font-brand-serif)', fontStyle: 'italic' }}>
                      {t('landing.craft_title')}
                    </h2>
                    <p className="text-white/45 text-base md:text-lg leading-8">{t('landing.craft_copy')}</p>

                    {/* Detail cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div className="rounded-xl p-5 border border-white/[0.05] bg-white/[0.02]">
                        <Sparkles className="text-gold/50 mb-4" size={20} />
                        <p className="text-white text-lg mb-1" style={{ fontFamily: 'var(--font-brand-serif)', fontStyle: 'italic' }}>{t('landing.detail1')}</p>
                        <p className="text-white/30 text-sm leading-6">{t('landing.detail1_copy')}</p>
                      </div>
                      <div className="rounded-xl p-5 border border-white/[0.05] bg-white/[0.02]">
                        <UtensilsCrossed className="text-gold/50 mb-4" size={20} />
                        <p className="text-white text-lg mb-1" style={{ fontFamily: 'var(--font-brand-serif)', fontStyle: 'italic' }}>{t('landing.detail2')}</p>
                        <p className="text-white/30 text-sm leading-6">{t('landing.detail2_copy')}</p>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                      <Link href="/reserve" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gold px-7 text-void text-[10px] font-black uppercase tracking-[0.2em] hover:shadow-[0_16px_40px_rgba(212,175,55,0.2)] transition-shadow duration-500">
                        <Calendar size={14} />
                        {t('landing.reserve')}
                      </Link>
                      <Link href="/menu" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 px-7 text-white/70 text-[10px] font-black uppercase tracking-[0.2em] hover:border-gold/20 hover:text-gold transition-all duration-500">
                        <ArrowRight size={14} />
                        {t('landing.view_menu')}
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                 SECTION 4: HOW TO ORDER — Connected Flow
            ═══════════════════════════════════════════════════ */}
            <section className="bg-bg py-20 md:py-28">
              <div className="container-luxury">
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={VIEWPORT}
                  className="text-center max-w-2xl mx-auto mb-12 md:mb-16"
                >
                  <span className="section-label">{t('landing.flow_label')}</span>
                  <h2 className="mt-4 text-white text-3xl md:text-5xl leading-tight" style={{ fontFamily: 'var(--font-brand-serif)', fontStyle: 'italic' }}>
                    {t('landing.flow_title')}
                  </h2>
                  <p className="mt-4 text-white/40 text-base leading-7">{t('landing.flow_copy')}</p>
                </motion.div>

                <motion.div
                  variants={staggerChildren}
                  initial="hidden"
                  whileInView="visible"
                  viewport={VIEWPORT}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative mt-8 md:mt-12"
                >
                  <div className="hidden md:block absolute top-[45%] left-[10%] right-[10%] h-[2px] bg-white/[0.03] -translate-y-1/2 rounded-full" />

                  {orderSteps.map((step, i) => {
                    const Icon = i === 0 ? MousePointerClick : i === 1 ? CheckCircle : Utensils;
                    return (
                      <motion.div
                        key={step.value}
                        variants={itemReveal}
                        className="group relative rounded-3xl p-8 md:p-10 text-left bg-void border border-white/[0.05] overflow-hidden transition-all duration-300 hover:border-gold/30 hover:bg-white/[0.02] hover:-translate-y-1"
                        style={{ boxShadow: '0 16px 40px rgba(0,0,0,0.45)' }}
                      >
                        <div
                          className="absolute -bottom-8 -right-4 text-[160px] font-bold text-white/[0.02] transition-colors duration-300 group-hover:text-gold/[0.05] select-none"
                          style={{ fontFamily: 'var(--font-brand-serif)', lineHeight: 1 }}
                        >
                          {step.value}
                        </div>

                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 transition-all duration-300" />

                        <div className="relative z-10">
                          <div className="w-14 h-14 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center mb-8 transition-colors duration-300 group-hover:border-gold/30 group-hover:bg-gold/[0.05]">
                            <Icon className="text-white/40 group-hover:text-gold transition-colors duration-300" size={24} strokeWidth={1} />
                          </div>

                          <div className="flex items-baseline gap-4 mb-4">
                            <span className="text-gold text-sm font-mono tracking-[0.2em]">{step.value}.</span>
                            <h3 className="text-white text-2xl" style={{ fontFamily: 'var(--font-brand-serif)', fontStyle: 'italic' }}>{step.title}</h3>
                          </div>

                          <p className="text-white/40 text-sm leading-relaxed max-w-[90%]">{step.copy}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                 SECTION 5: FINAL CTA — Cinematic Call
            ═══════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden py-24 md:py-36">
              {/* Background Video */}
              <div className="absolute inset-0">
                <video
                  src="/media/real/cta-bg.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover brightness-[0.3] saturate-[0.7]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/40 z-10" />
              </div>

              <motion.div
                variants={scaleReveal}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                className="container-luxury relative z-10 text-center"
              >
                <div className="max-w-3xl mx-auto">
                  <span className="section-label">{t('landing.visit_label')}</span>
                  <h2 className="mt-6 text-white text-4xl md:text-6xl lg:text-7xl leading-[0.95]" style={{ fontFamily: 'var(--font-brand-serif)', fontStyle: 'italic' }}>
                    {t('landing.visit_title')}
                  </h2>
                  <p className="mt-6 text-white/40 text-base md:text-lg leading-8 max-w-xl mx-auto">{t('landing.visit_copy')}</p>

                  <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/menu"
                      className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-gold px-10 text-void text-[11px] font-black uppercase tracking-[0.2em] hover:shadow-[0_20px_50px_rgba(212,175,55,0.25)] transition-shadow duration-700 active:scale-95"
                    >
                      {t('landing.view_menu')}
                      <ArrowRight size={16} className={lang === 'ar' ? 'rotate-180' : ''} />
                    </Link>
                    <Link
                      href="/reserve"
                      className="inline-flex h-14 items-center justify-center gap-3 rounded-full border border-white/15 bg-white/[0.03] backdrop-blur-lg px-10 text-white/80 text-[11px] font-black uppercase tracking-[0.2em] hover:border-gold/25 hover:text-gold transition-all duration-700 active:scale-95"
                    >
                      {t('landing.reserve')}
                      <Calendar size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* ═══ FOOTER ═══ */}
            <Footer />
          </motion.div>
        )}

        {activeTab === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <StrictMenu
              onTabChange={setActiveTab}
              initialMenuData={menuDataWithPrototype}
              initialCategories={initialCategories}
              initialCategoryData={initialCategoryData}
            />
          </motion.div>
        )}

      </AnimatePresence>

      <div className="ambient-spotlight" />
    </main>
  );
}
