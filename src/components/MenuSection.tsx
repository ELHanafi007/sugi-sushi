'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { menuData, CATEGORIES, Dish } from '@/data/menuData';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Intersection Observer Hook ─── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ─── Kanji per category ─── */
const KANJI: Record<string, string> = {
  'Salads': '菜', 'Soups': '汁', 'Starters': '前',
  'Wok, Noodles & Rice': '炒', 'Tempura': '天', 'Sugi Dishes': '主',
  'Sashimi': '刺', 'Tataki': '叩', 'Ceviche': '酢',
  'Nigiri': '握', 'Gunkan': '軍', 'Temaki': '手',
  'Maki Rolls': '巻', 'Aromaki Rolls': '香', 'Aromaki Fried': '揚',
  'California Rolls': '加', 'Special Rolls': '特', 'Fried Rolls': '衣',
  'Boxes': '箱', 'Sugi Boat': '舟',
  'Cold Drinks': '冷', 'Fresh Juices': '搾', 'Hot Drinks': '温',
  'Desserts': '甘', 'Extra Sauces': '醤',
};

/* ─── Tag style mapper ─── */
function tagCls(tag: string): string {
  const t = tag.toLowerCase();
  if (t === 'signature' || t === "chef's choice" || t === 'premium' || t === 'best seller') return 'tag tag--gold';
  if (t === 'spicy' || t === 'hot') return 'tag tag--red';
  return 'tag tag--muted';
}

/* ═══════════════════════════════════════════════════════
   DISH CARD
   ═══════════════════════════════════════════════════════ */
function DishCard({ dish, lang, idx }: { dish: Dish; lang: 'en' | 'ar'; idx: number }) {
  const name = lang === 'ar' ? dish.nameAr || dish.name : dish.name;
  const desc = lang === 'ar' ? dish.descriptionAr || dish.description : dish.description;
  const price = dish.price.replace(' SR', '').trim();
  const isSignature = dish.tags.some(t => ['signature', "chef's choice", "premium"].includes(t.toLowerCase()));

  // Use a default luxury placeholder if no image exists
  const imageUrl = dish.image || "/media/optimized/hero-wallpaper-2.jpg";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 1.2,
        delay: idx % 2 === 0 ? 0.1 : 0.3,
        ease: [0.19, 1, 0.22, 1]
      }}
      className={`relative group overflow-hidden rounded-[2.5rem] aspect-[4/5] md:aspect-[3/4] transition-all duration-1000 ${
        idx % 3 === 1 ? 'md:mt-24' : '' // Create asymmetric rhythm
      }`}
    >
      {/* ─── Background Image ─── */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] ease-expo group-hover:scale-110"
          style={{ backgroundImage: `url("${imageUrl}")` }}
        />
        {/* Editorial Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-40" />
      </div>

      {/* ─── Card Content ─── */}
      <div className="absolute inset-0 z-10 p-8 md:p-10 flex flex-col justify-end">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-expo">
          {/* Top Metadata */}
          <div className="flex items-center gap-3 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            {isSignature && (
              <span className="mono-tag !text-[8px] !text-gold border border-gold/30 px-2 py-0.5 rounded-full">
                Signature
              </span>
            )}
            {dish.calories && (
              <span className="text-[9px] text-white/40 tracking-widest font-mono uppercase">{dish.calories}</span>
            )}
          </div>

          {/* Dish Identity */}
          <div className="flex items-end justify-between gap-6 mb-6">
            <h4 className="text-white text-3xl md:text-4xl font-serif font-light tracking-tight leading-[0.9] text-balance">
              {name}
            </h4>
            <div className="flex flex-col items-end shrink-0">
              <span className="text-gold font-serif text-xl md:text-2xl font-light leading-none">
                {price}
              </span>
              <span className="text-[8px] text-gold/40 uppercase tracking-widest font-bold mt-1">
                {lang === 'ar' ? 'ر.س' : 'SR'}
              </span>
            </div>
          </div>

          {/* Description - Revealed on Hover */}
          <p className="text-white/60 text-[13px] md:text-[14px] leading-relaxed max-w-[90%] font-serif italic font-light opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200 line-clamp-2 mb-6">
            {desc}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-300">
            {dish.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[8px] uppercase tracking-[0.2em] text-white/30 border border-white/10 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Hover Interaction Frame ─── */}
      <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 rounded-[2.5rem] transition-all duration-1000 pointer-events-none" />
      <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none blur-3xl" />
    </motion.article>
  );
}

/* ═══════════════════════════════════════════════════════
   STORY SECTION
   ═══════════════════════════════════════════════════════ */
function StorySection() {
  const { t } = useLanguage();
  const { ref, visible } = useReveal();

  return (
    <section id="story" ref={ref} className="w-full py-40 md:py-64 px-6 relative overflow-hidden">
      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-40 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={visible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.8, ease: [0.19, 1, 0.22, 1] }}
            className="relative order-2 lg:order-1"
          >
            <div className="aspect-[4/5] relative rounded-[3rem] overflow-hidden group shadow-2xl">
               <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[3s] ease-expo group-hover:scale-110"
                style={{ backgroundImage: 'url("/media/optimized/hero-wallpaper-2.jpg")' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-80" />
              
              {/* Floating Badge */}
              <div className="absolute bottom-10 left-10 p-8 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] max-w-[240px]">
                <span className="text-gold text-5xl font-serif block mb-4">杉</span>
                <p className="text-[11px] text-white/60 uppercase tracking-[0.3em] font-medium leading-relaxed">
                  {t('story.badge')}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-1 lg:order-2">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              className="mono-tag mb-8"
            >
              {t('story.label')}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
              className="text-white text-4xl md:text-6xl font-serif font-light mb-12 tracking-wide leading-tight"
            >
              {t('story.title')}
            </motion.h2>

            <div className="space-y-10 max-w-xl">
              <motion.p
                initial={{ opacity: 0 }}
                animate={visible ? { opacity: 1 } : {}}
                transition={{ delay: 0.4 }}
                className="text-white/70 text-[16px] md:text-[18px] leading-[1.8] font-serif italic font-light"
              >
                {t('story.p1')}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={visible ? { opacity: 1 } : {}}
                transition={{ delay: 0.6 }}
                className="text-white/50 text-[15px] md:text-[16px] leading-[1.8] font-serif font-light"
              >
                {t('story.p2')}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={visible ? { opacity: 1, width: '4rem' } : {}}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-20 h-px bg-gold/50"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   MENU CONTENT
   ═══════════════════════════════════════════════════════ */
function MenuContent() {
  const { t, lang } = useLanguage();
  const [active, setActive] = useState(CATEGORIES[0]);
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const tabBarRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const availCats = useMemo(() => CATEGORIES.filter((cat) => menuData.some((d) => d.category === cat)), []);

  const filteredDishes = useMemo(() => {
    if (!search.trim()) return menuData;
    const q = search.toLowerCase().trim();
    return menuData.filter(d => 
      d.name.toLowerCase().includes(q) || 
      d.nameAr?.includes(q) || 
      d.description.toLowerCase().includes(q) ||
      d.descriptionAr?.includes(q) ||
      d.category.toLowerCase().includes(q)
    );
  }, [search]);

  const groupedDishes = useMemo(() => {
    const groups: Record<string, Dish[]> = {};
    filteredDishes.forEach(d => {
      if (!groups[d.category]) groups[d.category] = [];
      groups[d.category].push(d);
    });
    return groups;
  }, [filteredDishes]);

  // Scroll Spy
  useEffect(() => {
    if (isSearching) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 250; 
      
      for (const cat of availCats) {
        const el = sectionRefs.current[cat];
        if (el) {
          const { top, bottom } = el.getBoundingClientRect();
          const absoluteTop = top + window.scrollY;
          const absoluteBottom = bottom + window.scrollY;
          
          if (scrollPos >= absoluteTop && scrollPos < absoluteBottom) {
            setActive(cat);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [availCats, isSearching]);

  const scrollToActiveTab = useCallback(() => {
    const bar = tabBarRef.current;
    if (bar) {
      const tab = bar.querySelector('[data-active="true"]') as HTMLElement | null;
      if (tab) {
        const barRect = bar.getBoundingClientRect();
        const tabRect = tab.getBoundingClientRect();
        const scrollLeft = tab.offsetLeft - barRect.width / 2 + tabRect.width / 2;
        bar.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, []);

  useEffect(() => {
    scrollToActiveTab();
  }, [active, scrollToActiveTab]);

  const handleCatClick = (cat: string) => {
    setIsSearching(false);
    setSearch('');
    setActive(cat);
    const el = sectionRefs.current[cat];
    if (el) {
      const yOffset = -140; 
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section id="menu" className="w-full min-h-screen flex flex-col items-center pb-32">
      {/* ─── Section Header ─── */}
      <div className="container-wide pt-32 pb-16 text-center lg:text-left">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-label">{t('menu.label')}</span>
          <h2 className="section-title mt-6">{t('menu.title')}</h2>
        </motion.div>
        
        {/* Search Bar & Categories with consistent spacing */}
        <div className="mt-16 flex flex-col gap-12">
           <div className="relative w-full max-w-xl mx-auto lg:mx-0">
            <input
              type="text"
              placeholder={t('menu.search')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setIsSearching(!!e.target.value);
              }}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 px-12
                         text-[14px] text-text placeholder:text-text-muted/40 focus:outline-none focus:border-gold/40
                         focus:bg-white/[0.05] transition-all duration-300 font-serif shadow-inner"
            />
            <svg 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/50"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            {search && (
              <button 
                onClick={() => { setSearch(''); setIsSearching(false); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-text-muted/40 hover:text-gold transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
             {/* Mobile Horizontal Bar */}
             <div
              ref={tabBarRef}
              className="w-full lg:hidden flex gap-3 overflow-x-auto no-scrollbar py-2"
            >
              {availCats.map((cat) => {
                const on = !isSearching && cat === active;
                return (
                  <button
                    key={cat}
                    data-active={on}
                    onClick={() => handleCatClick(cat)}
                    className={`cat-pill ${on ? 'cat-pill--active' : 'active:scale-95'}`}
                  >
                    <span className={`text-[14px] font-serif transition-colors duration-200 ${on ? 'text-gold' : 'text-gold/30'}`}>
                      {KANJI[cat]}
                    </span>
                    <span className="font-medium text-[11px]">{t(`menu.cat.${cat}`)}</span>
                  </button>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center gap-4 text-gold/40 font-serif text-[11px] tracking-widest uppercase ml-auto">
              <span>{t('menu.scroll')}</span>
              <div className="w-8 h-px bg-gold/20" />
              <span className="text-gold">膳</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide flex flex-col lg:flex-row gap-20 relative">
        {/* ─── Sticky Sidebar (Desktop Only) ─── */}
        <div className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-32 space-y-8">
            <div className="flex flex-col gap-2 p-2 bg-white/[0.02] border border-white/[0.05] rounded-3xl backdrop-blur-md">
              {availCats.map((cat) => {
                const on = !isSearching && cat === active;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCatClick(cat)}
                    className={`group flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 ${
                      on ? 'bg-gold/10 text-gold shadow-lg shadow-black/20' : 'text-text-secondary/40 hover:text-text-secondary hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-[18px] font-serif transition-colors duration-300 ${on ? 'text-gold' : 'text-gold/20'}`}>
                        {KANJI[cat]}
                      </span>
                      <span className="font-medium text-[12px] uppercase tracking-wider">{t(`menu.cat.${cat}`)}</span>
                    </div>
                    {on && (
                      <motion.div layoutId="activeCat" className="w-1.5 h-1.5 rounded-full bg-gold" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── Menu Grid ─── */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {isSearching ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-24"
              >
                {Object.entries(groupedDishes).map(([cat, dishes]) => (
                  <div key={cat} className="flex flex-col gap-12 md:gap-20">
                    <div className="flex items-center gap-8">
                      <span className="text-gold/20 font-serif text-5xl md:text-6xl">{KANJI[cat]}</span>
                      <h3 className="text-[18px] md:text-[22px] text-gold uppercase tracking-[0.5em] font-serif font-light">
                        {t(`menu.cat.${cat}`)}
                      </h3>
                      <div className="flex-1 h-px bg-white/[0.05]" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 md:gap-y-32">
                      {dishes.map((dish, i) => (
                        <DishCard key={dish.id} dish={dish} lang={lang} idx={i} />
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col gap-40 md:gap-64">
                {availCats.map((cat) => {
                  const dishes = menuData.filter(d => d.category === cat);
                  return (
                    <div 
                      key={cat} 
                      id={`cat-${cat}`}
                      ref={el => { sectionRefs.current[cat] = el; }}
                      className="flex flex-col gap-16 md:gap-24 scroll-mt-40"
                    >
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="flex flex-col lg:flex-row lg:items-end justify-between gap-10"
                      >
                        <div className="flex items-center gap-8">
                          <span className="text-[60px] md:text-[80px] text-gold/10 font-serif leading-none">{KANJI[cat]}</span>
                          <div>
                            <h3 className="text-[24px] md:text-[32px] text-gold uppercase tracking-[0.4em] font-serif font-light leading-none">
                              {t(`menu.cat.${cat}`)}
                            </h3>
                            <div className="w-16 h-px bg-gold/20 mt-6" />
                          </div>
                        </div>
                        <span className="text-[11px] text-white/30 uppercase tracking-[0.3em] font-serif italic">
                          {dishes.length} {t('menu.items')}
                        </span>
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 md:gap-y-32">
                        {dishes.map((dish, i) => (
                          <DishCard key={dish.id} dish={dish} lang={lang} idx={i} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Floating Reservation Button (Mobile Only) ─── */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] md:hidden"
      >
        <a
          href="tel:+966"
          className="cta-btn px-10 py-5 shadow-2xl shadow-gold/20 flex items-center gap-4 border-gold/40 bg-bg/95 backdrop-blur-2xl"
        >
          <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
          </svg>
          <span className="text-[13px] font-bold tracking-[0.2em]">{t('contact.cta')}</span>
        </a>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   CONTACT SECTION
   ═══════════════════════════════════════════════════════ */
function ContactSection() {
  const { t } = useLanguage();
  const { ref, visible } = useReveal();

  return (
    <section id="contact" ref={ref} className="w-full py-48 px-6 relative bg-bg overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container-wide relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            className="section-label"
          >
            {t('contact.label')}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 1 }}
            className="section-title mt-6 mb-20"
          >
            {t('contact.title')}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                icon: (
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                ),
                circle: <circle cx="12" cy="9" r="2.5" />,
                label: t('contact.visit'),
                content: t('contact.location')
              },
              {
                icon: (
                  <path d="M12 6v6l4 2" />
                ),
                circle: <circle cx="12" cy="12" r="10" />,
                label: t('contact.opening'),
                content: t('contact.hours')
              },
              {
                icon: (
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                ),
                label: t('contact.reservation'),
                content: "+966 55 000 0000"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex flex-col items-center gap-8 p-10 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-gold/5 transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-gold/5 border border-gold/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    {item.icon}
                    {item.circle}
                  </svg>
                </div>
                <div>
                  <h4 className="text-gold/40 text-[10px] tracking-[0.3em] uppercase font-serif font-bold mb-3">{item.label}</h4>
                  <p className="text-text-secondary text-[16px] md:text-[18px] tracking-wide font-serif leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={visible ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="mt-24"
          >
            <a
              href="tel:+966"
              className="cta-btn px-16 py-6 group text-[14px] tracking-[0.4em]"
            >
              <span className="relative z-10">{t('contact.cta')}</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════ */
function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="w-full pt-32 pb-48 px-6 border-t border-white/[0.03] bg-bg-overlay relative overflow-hidden">
      <div className="container-wide flex flex-col items-center gap-16 text-center">
        <div className="flex flex-col items-center gap-6">
          <span className="text-gold text-5xl font-serif">杉</span>
          <div className="flex flex-col items-center gap-2">
            <span className="text-text text-[16px] font-serif font-bold tracking-[0.6em]">SUGI SUSHI</span>
            <span className="text-gold/40 text-[10px] uppercase tracking-[0.2em]">{t('footer.perfection')}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full max-w-3xl pt-16 border-t border-white/[0.05]">
          <a href="#menu" className="text-[11px] text-text-secondary/40 uppercase tracking-widest hover:text-gold transition-colors">
            {t('nav.menu')}
          </a>
          <a href="#story" className="text-[11px] text-text-secondary/40 uppercase tracking-widest hover:text-gold transition-colors">
            {t('nav.story')}
          </a>
          <a href="#contact" className="text-[11px] text-text-secondary/40 uppercase tracking-widest hover:text-gold transition-colors">
            {t('nav.contact')}
          </a>
          <a href="#" className="text-[11px] text-text-secondary/40 uppercase tracking-widest hover:text-gold transition-colors">
            {t('footer.privacy')}
          </a>
        </div>

        <div className="flex flex-col gap-6 mt-12">
          <p className="text-text-muted/40 text-[10px] uppercase tracking-[0.5em] font-serif font-bold">
            {t('footer.copy')}
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-gold/10" />
            <p className="text-text-muted/20 text-[10px] tracking-[0.3em] font-serif uppercase">
              {t('footer.heart')}
            </p>
            <div className="w-12 h-px bg-gold/10" />
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════ */
export default function MenuSection() {
  return (
    <div className="bg-bg relative">
      <StorySection />
      <MenuContent />
      <ContactSection />
      <Footer />
    </div>
  );
}
