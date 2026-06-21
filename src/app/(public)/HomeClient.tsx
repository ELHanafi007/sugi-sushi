'use client';

import { useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import CurrencyPrice from '@/components/CurrencyPrice';
import { useLanguage } from '@/context/LanguageContext';
import { Dish } from '@/data/menuData';

const StrictMenu = dynamic(() => import('@/components/StrictMenu'), { ssr: false });
const VerticalImageStack = dynamic(() => import('@/components/ui/vertical-image-stack').then(m => m.VerticalImageStack), { ssr: false });

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=80';

export default function HomeClient({
  initialMenuData,
  initialCategories,
  initialCategoryData
}: {
  initialMenuData: Dish[];
  initialCategories: string[];
  initialCategoryData: { name: string, image: string }[];
}) {
  const menuDataWithPrototype = initialMenuData;
  const { activeTab, setActiveTab, setActiveCategory, t, lang } = useLanguage();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const categoryImages = useMemo(() => {
    const map = new Map<string, string>();
    initialCategoryData.forEach((cat) => {
      if (cat.image) map.set(cat.name, cat.image);
    });
    return map;
  }, [initialCategoryData]);

  const signatureDishes = useMemo(() => {
    const withImages = menuDataWithPrototype.filter((dish) => dish.image);
    const tagged = withImages.filter((dish) => dish.tags?.some((tag) => ['Signature', 'Best Seller'].includes(tag)));
    const taggedIds = new Set(tagged.map((dish) => dish.id));
    const supplemental = withImages.filter((dish) => !taggedIds.has(dish.id));
    return [...tagged, ...supplemental].slice(0, 3);
  }, [menuDataWithPrototype]);

  const featuredCategories = useMemo(() => {
    const preferred = ['Special Rolls', 'Sashimi', 'Boxes', 'Wok, Noodles & Rice', 'Desserts'];
    const ordered = [
      ...preferred.filter((cat) => initialCategories.includes(cat)),
      ...initialCategories.filter((cat) => !preferred.includes(cat))
    ];
    return ordered.slice(0, 6);
  }, [initialCategories]);

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
      <AnimatePresence>
        <motion.div
          key={`${activeTab}-shutter`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          className="fixed inset-0 z-[500] bg-black pointer-events-none"
        />
      </AnimatePresence>

      {activeTab === 'home' && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-gold/20 via-gold/50 to-gold/20 z-[110] origin-left"
          style={{ scaleX }}
        />
      )}

      <Navbar onTabChange={setActiveTab} activeTab={activeTab} />

      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            <section className="relative min-h-[92vh] overflow-hidden bg-black">
              <Image
                src="/media/optimized/hero-wallpaper-alt-0.jpg"
                alt="Sugi Sushi"
                fill
                priority
                className="object-cover opacity-70 brightness-[0.55] contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-bg" />
              <div className="absolute inset-0 bg-gradient-to-r from-bg/85 via-bg/25 to-transparent" />

              <div className="relative z-10 min-h-[92vh] container-luxury flex items-end pb-10 md:pb-16 pt-32">
                <div className={`w-full grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-10 lg:gap-16 items-end ${lang === 'ar' ? 'lg:text-right' : ''}`}>
                  <div className="max-w-5xl">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <span className="mono-tag !text-gold/80 !border-gold/20 !bg-gold/5">{t('landing.badge')}</span>
                      <span className="text-white/45 text-[11px] font-mono uppercase tracking-[0.35em]">{t('landing.location')}</span>
                    </div>
                    <h1 className="text-white font-serif text-5xl sm:text-6xl md:text-8xl lg:text-[7.5rem] leading-[0.9] tracking-normal max-w-5xl">
                      {t('landing.hero_title')}
                    </h1>
                    <p className="mt-7 max-w-2xl text-white/70 text-base md:text-xl leading-8 font-light">
                      {t('landing.hero_copy')}
                    </p>
                    <div className="mt-9 flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <button
                        onClick={() => setActiveTab('menu')}
                        className="h-14 px-8 rounded-full bg-gold text-black text-[12px] font-black uppercase tracking-[0.25em] hover:bg-gold-bright transition-colors"
                      >
                        {t('landing.view_menu')}
                      </button>
                      <Link
                        href="/reserve"
                        className="h-14 px-8 rounded-full border border-white/15 bg-white/[0.04] text-white text-[12px] font-black uppercase tracking-[0.25em] flex items-center justify-center hover:border-white/35 hover:bg-white/[0.08] transition-colors"
                      >
                        {t('landing.reserve')}
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
                    {[
                      [t('landing.stat1'), t('landing.stat1_label')],
                      [t('landing.stat2'), t('landing.stat2_label')],
                      [t('landing.stat3'), t('landing.stat3_label')]
                    ].map(([value, label]) => (
                      <div key={label} className="border border-white/10 bg-black/35 backdrop-blur-xl rounded-lg p-4 md:p-5">
                        <p className="text-gold text-xl md:text-3xl font-serif">{value}</p>
                        <p className="mt-2 text-white/45 text-[9px] md:text-[10px] font-mono uppercase tracking-[0.25em] leading-5">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-bg py-16 md:py-24">
              <div className="container-luxury">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                  <div>
                    <span className="section-label">{t('landing.categories_label')}</span>
                    <h2 className="mt-4 text-white text-3xl md:text-5xl font-serif">{t('landing.categories_title')}</h2>
                  </div>
                  <button onClick={() => setActiveTab('menu')} className="text-gold/80 text-[11px] font-mono uppercase tracking-[0.35em] text-left md:text-right">
                    {t('landing.all_menu')}
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
                  {featuredCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => openCategory(category)}
                      className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] text-left"
                    >
                      <Image
                        src={categoryImages.get(category) || FALLBACK_IMAGE}
                        alt={t(`menu.cat.${category}`)}
                        fill
                        className="object-cover brightness-[0.58] group-hover:brightness-[0.78] group-hover:scale-105 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                      <div className="absolute left-4 right-4 bottom-4">
                        <p className="text-white text-lg md:text-xl font-serif leading-tight">{t(`menu.cat.${category}`)}</p>
                        <p className="mt-2 text-gold/70 text-[9px] font-mono uppercase tracking-[0.25em]">{t('landing.open')}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-[#09090b] py-16 md:py-24 border-y border-white/[0.06]">
              <div className="container-luxury grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-start">
                <div className="lg:sticky lg:top-28">
                  <span className="section-label">{t('landing.signatures_label')}</span>
                  <h2 className="mt-4 text-white text-4xl md:text-6xl font-serif leading-tight">{t('landing.signatures_title')}</h2>
                  <p className="mt-6 text-white/55 text-base md:text-lg leading-8 max-w-xl">{t('landing.signatures_copy')}</p>
                </div>

                <div className="space-y-4">
                  {signatureDishes.map((dish, index) => (
                    <button
                      key={dish.id}
                      onClick={() => {
                        setActiveCategory(dish.category);
                        setActiveTab('menu');
                      }}
                      className="w-full grid grid-cols-[96px_1fr] md:grid-cols-[150px_1fr_auto] gap-4 md:gap-6 items-center p-3 md:p-4 rounded-lg border border-white/10 bg-white/[0.025] hover:border-gold/25 hover:bg-gold/[0.04] transition-colors text-left"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-md bg-white/[0.04]">
                        <Image
                          src={dish.image || FALLBACK_IMAGE}
                          alt={lang === 'ar' ? dish.nameAr || dish.name : dish.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-gold/60 text-[10px] font-mono uppercase tracking-[0.25em]">{String(index + 1).padStart(2, '0')}</p>
                        <h3 className="mt-2 text-white text-xl md:text-3xl font-serif truncate">{lang === 'ar' ? dish.nameAr || dish.name : dish.name}</h3>
                        <p className="mt-2 text-white/45 text-sm md:text-base line-clamp-2">{lang === 'ar' ? dish.descriptionAr || dish.description : dish.description}</p>
                      </div>
                      <CurrencyPrice price={dish.price} className="hidden md:flex text-gold/80 text-sm font-mono" />
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-bg py-16 md:py-28">
              <div className="container-luxury grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-stretch">
                <div className="relative min-h-[420px] rounded-lg overflow-hidden border border-white/10">
                  <Image
                    src="/media/optimized/brochure-preview.jpg"
                    alt="Sugi Sushi interior and dishes"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                <div className="flex flex-col justify-center py-4">
                  <span className="section-label">{t('landing.craft_label')}</span>
                  <h2 className="mt-4 text-white text-4xl md:text-6xl font-serif leading-tight">{t('landing.craft_title')}</h2>
                  <p className="mt-6 text-white/60 text-base md:text-lg leading-8">{t('landing.craft_copy')}</p>
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border-l border-gold/30 pl-5">
                      <p className="text-white text-xl font-serif">{t('landing.detail1')}</p>
                      <p className="mt-2 text-white/45 text-sm leading-6">{t('landing.detail1_copy')}</p>
                    </div>
                    <div className="border-l border-gold/30 pl-5">
                      <p className="text-white text-xl font-serif">{t('landing.detail2')}</p>
                      <p className="mt-2 text-white/45 text-sm leading-6">{t('landing.detail2_copy')}</p>
                    </div>
                  </div>
                  <div className="mt-10 flex flex-col sm:flex-row gap-3">
                    <Link href="/reserve" className="h-13 px-7 rounded-full bg-white text-black text-[11px] font-black uppercase tracking-[0.25em] flex items-center justify-center">
                      {t('landing.reserve')}
                    </Link>
                    <button onClick={() => setActiveTab('gallery')} className="h-13 px-7 rounded-full border border-white/15 text-white text-[11px] font-black uppercase tracking-[0.25em]">
                      {t('landing.gallery')}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-[#0a0a0d] py-14 md:py-18 border-t border-white/[0.06]">
              <div className="container-luxury flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                  <p className="text-gold/70 text-[11px] font-mono uppercase tracking-[0.35em]">{t('landing.visit_label')}</p>
                  <h2 className="mt-3 text-white text-3xl md:text-5xl font-serif">{t('landing.visit_title')}</h2>
                  <p className="mt-4 text-white/50 text-base">{t('landing.visit_copy')}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={() => setActiveTab('menu')} className="h-14 px-8 rounded-full bg-gold text-black text-[12px] font-black uppercase tracking-[0.25em]">
                    {t('landing.view_menu')}
                  </button>
                  <Link href="/reserve" className="h-14 px-8 rounded-full border border-white/15 text-white text-[12px] font-black uppercase tracking-[0.25em] flex items-center justify-center">
                    {t('landing.reserve')}
                  </Link>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          >
            <StrictMenu
              onTabChange={setActiveTab}
              initialMenuData={menuDataWithPrototype}
              initialCategories={initialCategories}
              initialCategoryData={initialCategoryData}
            />
          </motion.div>
        )}

        {activeTab === 'gallery' && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <VerticalImageStack onComplete={() => setActiveTab('menu')} completeTab="menu" />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
