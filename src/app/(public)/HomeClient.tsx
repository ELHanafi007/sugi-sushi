'use client';

import { useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, ChevronRight, Images, Sparkles, UtensilsCrossed } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CurrencyPrice from '@/components/CurrencyPrice';
import { useLanguage } from '@/context/LanguageContext';
import { Dish } from '@/data/menuData';

const StrictMenu = dynamic(() => import('@/components/StrictMenu'), { ssr: false });
const VerticalImageStack = dynamic(() => import('@/components/ui/vertical-image-stack').then(m => m.VerticalImageStack), { ssr: false });

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=80';
const LOCAL_LANDING_IMAGES = [
  '/media/landing/sushi-counter.jpg',
  '/media/landing/sushi-closeup.jpg',
  '/media/landing/dining-room.jpg',
  '/media/landing/sushi-selection.jpg',
  '/media/landing/chef-roll.jpg',
  '/media/landing/sushi-rolls.jpg'
];
const sectionReveal = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0 }
};
const staggerChildren = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } }
};
const itemReveal = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 }
};

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
    const preferred = ['Special Rolls', 'Sashimi', 'Boxes', 'Wok, Noodles & Rice', 'Starters', 'California Rolls', 'Desserts', 'Cold Drinks'];
    const ordered = [
      ...preferred.filter((cat) => initialCategories.includes(cat)),
      ...initialCategories.filter((cat) => !preferred.includes(cat))
    ];
    return ordered.slice(0, 9);
  }, [initialCategories]);

  const galleryPreview = useMemo(() => [
    '/media/landing/sushi-counter.jpg',
    '/media/landing/dining-room.jpg',
    '/media/landing/sushi-closeup.jpg'
  ], []);

  const orderSteps = useMemo(() => [
    { value: '01', title: t('landing.step1'), copy: t('landing.step1_copy') },
    { value: '02', title: t('landing.step2'), copy: t('landing.step2_copy') },
    { value: '03', title: t('landing.step3'), copy: t('landing.step3_copy') }
  ], [t]);

  const landingImage = (src: string | undefined, index: number) => {
    if (src?.startsWith('/')) return src;
    return LOCAL_LANDING_IMAGES[index % LOCAL_LANDING_IMAGES.length] || FALLBACK_IMAGE;
  };

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

            <section className="relative bg-[#07080a] pt-10 pb-16 md:pt-14 md:pb-20 border-y border-white/[0.06]">
              <div className="container-luxury">
                <motion.div
                  variants={sectionReveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                  className="flex items-end justify-between gap-5"
                >
                  <div>
                    <span className="section-label">{t('landing.categories_label')}</span>
                    <h2 className="mt-3 text-white text-3xl md:text-5xl font-serif leading-tight">{t('landing.categories_title')}</h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('menu')}
                    className="hidden md:inline-flex items-center gap-2 text-gold/85 text-[11px] font-mono uppercase tracking-[0.28em] hover:text-gold-bright transition-colors"
                  >
                    {t('landing.all_menu')}
                    <ChevronRight size={14} />
                  </button>
                </motion.div>

                <motion.div
                  variants={staggerChildren}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  className="-mx-[var(--container-px)] mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--container-px)] pb-5 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-4"
                >
                  {featuredCategories.map((category, index) => {
                    const image = landingImage(categoryImages.get(category), index);
                    return (
                      <motion.button
                        key={category}
                        variants={itemReveal}
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
                        onClick={() => openCategory(category)}
                        className="group relative h-[330px] w-[76vw] min-w-[76vw] snap-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] text-left sm:w-[42vw] sm:min-w-[42vw] md:h-[360px] md:w-auto md:min-w-0"
                      >
                        <Image
                          src={image}
                          alt={t(`menu.cat.${category}`)}
                          fill
                          sizes="(max-width: 768px) 76vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover brightness-[0.62] saturate-[1.08] transition-all duration-700 group-hover:scale-105 group-hover:brightness-[0.78]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/5" />
                        <div className="absolute inset-x-4 bottom-4">
                          <div className="mb-4 inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-gold/25 bg-black/35 px-3 text-gold text-[10px] font-mono tracking-[0.18em]">
                            {String(index + 1).padStart(2, '0')}
                          </div>
                          <h3 className="text-white text-2xl md:text-3xl font-serif leading-none">{t(`menu.cat.${category}`)}</h3>
                          <p className="mt-3 flex items-center gap-2 text-gold/80 text-[10px] font-mono uppercase tracking-[0.24em]">
                            {t('landing.open')}
                            <ArrowRight size={13} className={lang === 'ar' ? 'rotate-180' : ''} />
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </div>
            </section>

            <section className="relative overflow-hidden bg-bg py-16 md:py-24">
              <div className="container-luxury">
                <motion.div
                  variants={sectionReveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                  className="max-w-2xl"
                >
                  <span className="section-label">{t('landing.signatures_label')}</span>
                  <h2 className="mt-4 text-white text-4xl md:text-6xl font-serif leading-tight">{t('landing.signatures_title')}</h2>
                  <p className="mt-5 text-white/58 text-base md:text-lg leading-8">{t('landing.signatures_copy')}</p>
                </motion.div>

                <motion.div
                  variants={staggerChildren}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.18 }}
                  className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5"
                >
                  {signatureDishes.map((dish, index) => {
                    const image = landingImage(dish.image, index + 3);
                    return (
                      <motion.button
                        key={dish.id}
                        variants={itemReveal}
                        whileTap={{ scale: 0.985 }}
                        whileHover={{ y: -6 }}
                        transition={{ duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
                        onClick={() => {
                          setActiveCategory(dish.category);
                          setActiveTab('menu');
                        }}
                        className="group overflow-hidden rounded-lg border border-white/10 bg-[#0c0d10] text-left transition-colors hover:border-gold/30"
                      >
                        <div className="relative aspect-[16/11] overflow-hidden bg-white/[0.04]">
                          <Image
                            src={image}
                            alt={lang === 'ar' ? dish.nameAr || dish.name : dish.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-white/70 text-[10px] font-mono tracking-[0.2em]">
                            {String(index + 1).padStart(2, '0')}
                          </div>
                        </div>
                        <div className="p-5 md:p-6">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="text-white text-2xl md:text-3xl font-serif leading-tight">{lang === 'ar' ? dish.nameAr || dish.name : dish.name}</h3>
                            <CurrencyPrice price={dish.price} className="shrink-0 text-gold/85 text-sm font-mono" />
                          </div>
                          <p className="mt-3 min-h-[48px] text-white/48 text-sm leading-6 line-clamp-2">{lang === 'ar' ? dish.descriptionAr || dish.description : dish.description}</p>
                          <div className="mt-5 flex items-center justify-between border-t border-white/[0.08] pt-4">
                            <span className="text-white/38 text-[10px] font-mono uppercase tracking-[0.22em]">{t(`menu.cat.${dish.category}`)}</span>
                            <ArrowRight size={16} className={`text-gold/80 transition-transform group-hover:translate-x-1 ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </div>
            </section>

            <section className="bg-[#101114] py-14 md:py-20 border-y border-white/[0.06]">
              <div className="container-luxury grid grid-cols-1 gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
                <motion.div
                  variants={sectionReveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                >
                  <span className="section-label">{t('landing.flow_label')}</span>
                  <h2 className="mt-4 text-white text-4xl md:text-5xl font-serif leading-tight">{t('landing.flow_title')}</h2>
                  <p className="mt-5 text-white/55 text-base leading-8">{t('landing.flow_copy')}</p>
                </motion.div>

                <motion.div
                  variants={staggerChildren}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.25 }}
                  className="grid grid-cols-1 gap-3 sm:grid-cols-3"
                >
                  {orderSteps.map((step) => (
                    <motion.div
                      key={step.value}
                      variants={itemReveal}
                      transition={{ duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
                      className="rounded-lg border border-white/10 bg-black/25 p-5"
                    >
                      <p className="text-gold text-xl font-serif">{step.value}</p>
                      <h3 className="mt-5 text-white text-xl font-serif">{step.title}</h3>
                      <p className="mt-3 text-white/48 text-sm leading-6">{step.copy}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>

            <section className="bg-bg py-16 md:py-24">
              <div className="container-luxury grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <motion.div
                  initial={{ opacity: 0, x: lang === 'ar' ? 34 : -34 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.28 }}
                  transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                  className="relative min-h-[470px] md:min-h-[620px]"
                >
                  {galleryPreview.map((src, index) => (
                    <motion.div
                      key={src}
                      initial={{ opacity: 0, y: 24, rotate: index === 1 ? 4 : index === 2 ? -3 : 0 }}
                      whileInView={{ opacity: 1, y: 0, rotate: index === 1 ? 2 : index === 2 ? -2 : 0 }}
                      viewport={{ once: true, amount: 0.25 }}
                      transition={{ delay: index * 0.12, duration: 0.75, ease: [0.19, 1, 0.22, 1] }}
                      className={[
                        'absolute overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] shadow-2xl',
                        index === 0 ? 'left-0 top-0 h-[58%] w-[68%]' : '',
                        index === 1 ? 'right-0 top-[18%] h-[54%] w-[56%]' : '',
                        index === 2 ? 'bottom-0 left-[16%] h-[38%] w-[62%]' : ''
                      ].join(' ')}
                    >
                      <Image src={src} alt="Sugi Sushi" fill sizes="(max-width: 1024px) 70vw, 40vw" className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  variants={sectionReveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                  className="lg:pl-8"
                >
                  <span className="section-label">{t('landing.craft_label')}</span>
                  <h2 className="mt-4 text-white text-4xl md:text-6xl font-serif leading-tight">{t('landing.craft_title')}</h2>
                  <p className="mt-6 text-white/58 text-base md:text-lg leading-8">{t('landing.craft_copy')}</p>
                  <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-white/10 bg-white/[0.025] p-5">
                      <Sparkles className="text-gold/80" size={20} />
                      <p className="mt-5 text-white text-xl font-serif">{t('landing.detail1')}</p>
                      <p className="mt-2 text-white/45 text-sm leading-6">{t('landing.detail1_copy')}</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/[0.025] p-5">
                      <UtensilsCrossed className="text-gold/80" size={20} />
                      <p className="mt-5 text-white text-xl font-serif">{t('landing.detail2')}</p>
                      <p className="mt-2 text-white/45 text-sm leading-6">{t('landing.detail2_copy')}</p>
                    </div>
                  </div>
                  <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                    <Link href="/reserve" className="inline-flex h-13 min-h-13 items-center justify-center gap-2 rounded-full bg-white px-7 text-black text-[11px] font-black uppercase tracking-[0.22em]">
                      <Calendar size={16} />
                      {t('landing.reserve')}
                    </Link>
                    <button onClick={() => setActiveTab('gallery')} className="inline-flex h-13 min-h-13 items-center justify-center gap-2 rounded-full border border-white/15 px-7 text-white text-[11px] font-black uppercase tracking-[0.22em]">
                      <Images size={16} />
                      {t('landing.gallery')}
                    </button>
                  </div>
                </motion.div>
              </div>
            </section>

            <section className="bg-[#08090b] py-14 md:py-20">
              <motion.div
                variants={sectionReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                className="container-luxury"
              >
                <div className="overflow-hidden rounded-lg border border-gold/20 bg-[linear-gradient(135deg,rgba(212,175,55,0.14),rgba(255,255,255,0.025)_45%,rgba(16,17,20,1))] p-6 md:p-10">
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                      <p className="text-gold/80 text-[11px] font-mono uppercase tracking-[0.32em]">{t('landing.visit_label')}</p>
                      <h2 className="mt-4 max-w-3xl text-white text-4xl md:text-6xl font-serif leading-tight">{t('landing.visit_title')}</h2>
                      <p className="mt-5 max-w-2xl text-white/58 text-base leading-8">{t('landing.visit_copy')}</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                      <button onClick={() => setActiveTab('menu')} className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-gold px-8 text-black text-[12px] font-black uppercase tracking-[0.22em]">
                        {t('landing.view_menu')}
                        <ArrowRight size={16} className={lang === 'ar' ? 'rotate-180' : ''} />
                      </button>
                      <Link href="/reserve" className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/15 px-8 text-white text-[12px] font-black uppercase tracking-[0.22em]">
                        {t('landing.reserve')}
                        <Calendar size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
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
