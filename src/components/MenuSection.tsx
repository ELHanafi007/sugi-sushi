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
  const isSignature = dish.tags.some(t => ['signature', "chef's choice"].includes(t.toLowerCase()));

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        duration: 0.4,
        delay: Math.min(idx * 0.04, 0.3),
        ease: [0.16, 1, 0.3, 1]
      }}
      className={`menu-card ${isSignature ? 'menu-card--signature' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Name + Tags + Description */}
        <div className="flex-1 min-w-0">
          {/* Name row */}
          <div className="flex items-center gap-2">
            <h4 className="text-text text-[14px] font-serif uppercase tracking-[0.05em] leading-snug">
              {name}
            </h4>
            {isSignature && (
              <span
                className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 shadow-[0_0_8px_rgba(201,168,76,0.5)]"
                style={{ animation: 'pulse-dot 2s ease-in-out infinite' }}
              />
            )}
          </div>

          {/* Description */}
          {desc && (
            <p className="text-text-secondary/50 text-[10px] leading-[1.6] mt-2 line-clamp-2">
              {desc}
            </p>
          )}

          {/* Tags */}
          {dish.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {dish.tags.slice(0, 3).map((tag) => (
                <span key={tag} className={tagCls(tag)}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: Price */}
        <div className="flex flex-col items-end shrink-0">
          {price ? (
            <div className="flex items-baseline gap-1 bg-white/[0.03] px-2 py-1 rounded-lg border border-white/[0.05]">
              <span className="text-gold font-serif text-[16px] font-medium leading-none">
                {price}
              </span>
              <span className="text-[7px] text-gold/40 uppercase tracking-tighter">
                {lang === 'ar' ? 'ر.س' : 'SR'}
              </span>
            </div>
          ) : (
            <span className="text-[10px] text-text-muted/30">—</span>
          )}
          {dish.calories && (
            <span className="text-[7px] text-text-muted/30 mt-2 tracking-[0.1em] uppercase">
              {dish.calories}
            </span>
          )}
        </div>
      </div>
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
    <section id="story" ref={ref} className="w-full py-32 px-6 relative overflow-hidden bg-bg-warm/30">
      {/* Background Kanji */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
        <span
          className="text-[280px] text-gold/[0.012] font-serif leading-none"
          style={{ animation: 'kanji-breathe 10s ease-in-out infinite' }}
        >
          杉
        </span>
      </div>

      <div className="max-w-md mx-auto text-center relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          className="section-label"
        >
          {t('story.label')}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="section-title mt-4 mb-8"
        >
          {t('story.title')}
        </motion.h2>

        <div className="space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-text-secondary/60 text-[13px] leading-[1.8] font-serif italic"
          >
            {t('story.p1')}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-text-secondary/60 text-[13px] leading-[1.8] font-serif"
          >
            {t('story.p2')}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-col items-center"
        >
          <div className="w-8 h-px bg-gold/20 mb-4" />
          <p className="text-gold/40 text-[9px] tracking-[0.3em] font-serif uppercase">
            {t('story.sig')}
          </p>
        </motion.div>
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
      const scrollPos = window.scrollY + 220; 
      
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
    if (!bar) return;
    const tab = bar.querySelector('[data-active="true"]') as HTMLElement | null;
    if (tab) {
      const barRect = bar.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();
      const scrollLeft = tab.offsetLeft - barRect.width / 2 + tabRect.width / 2;
      bar.scrollTo({ left: scrollLeft, behavior: 'smooth' });
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
      const yOffset = -160; 
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section id="menu" className="w-full min-h-dvh flex flex-col items-center">
      {/* ─── Section Header ─── */}
      <div className="w-full max-w-lg pt-24 pb-10 px-6 text-center">
        <span className="section-label">{t('menu.label')}</span>
        <h2 className="section-title mt-4">{t('menu.title')}</h2>
      </div>

      {/* ─── Sticky Category Bar ─── */}
      <div className="sticky top-0 z-40 w-full bg-bg/80 backdrop-blur-2xl border-y border-white/[0.04]">
        <div className="max-w-lg mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder={t('menu.search')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setIsSearching(!!e.target.value);
              }}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl py-3 px-11
                         text-[13px] text-text placeholder:text-text-muted/40 focus:outline-none focus:border-gold/40
                         transition-all duration-300 font-serif"
            />
            <svg 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/50"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            {search && (
              <button 
                onClick={() => { setSearch(''); setIsSearching(false); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-text-muted/40 hover:text-gold"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Scrollable pills */}
          <div
            ref={tabBarRef}
            className="flex gap-2 overflow-x-auto no-scrollbar"
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
                  <span className={`text-[12px] transition-colors duration-200 ${on ? 'text-gold' : 'text-text-muted/30'}`}>
                    {KANJI[cat] || '•'}
                  </span>
                  <span className="font-medium text-[10px]">{t(`menu.cat.${cat}`)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Menu Items ─── */}
      <div className="w-full max-w-lg px-5 pb-32">
        {isSearching ? (
          <div className="flex flex-col gap-10 mt-10">
            {Object.entries(groupedDishes).map(([cat, dishes]) => (
              <div key={cat} className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <span className="text-gold/30 font-serif text-lg">{KANJI[cat]}</span>
                  <h3 className="text-[11px] text-gold/50 uppercase tracking-[0.3em] font-serif font-bold">
                    {t(`menu.cat.${cat}`)}
                  </h3>
                  <div className="flex-1 h-px bg-white/[0.05]" />
                </div>
                <div className="flex flex-col gap-4">
                  {dishes.map((dish, i) => (
                    <DishCard key={dish.id} dish={dish} lang={lang} idx={i} />
                  ))}
                </div>
              </div>
            ))}
            {filteredDishes.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <p className="text-text-muted/40 text-[14px] font-serif italic">
                  {t('menu.no_results')}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-16 mt-12">
            {availCats.map((cat) => {
              const dishes = menuData.filter(d => d.category === cat);
              return (
                <div 
                  key={cat} 
                  id={`cat-${cat}`}
                  ref={el => { sectionRefs.current[cat] = el; }}
                  className="flex flex-col gap-5"
                >
                  <div className="flex flex-col items-center gap-3 mb-4">
                    <span className="text-[24px] text-gold/15 font-serif">{KANJI[cat]}</span>
                    <h3 className="text-[13px] text-gold uppercase tracking-[0.4em] font-serif font-bold">
                      {t(`menu.cat.${cat}`)}
                    </h3>
                    <div className="w-8 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
                  </div>

                  <div className="flex flex-col gap-4">
                    {dishes.map((dish, i) => (
                      <DishCard key={dish.id} dish={dish} lang={lang} idx={i} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Floating Reservation Button (Mobile Only) ─── */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] sm:hidden"
      >
        <a
          href="tel:+966"
          className="cta-btn px-10 py-4 shadow-2xl shadow-gold/20 flex items-center gap-3 border-gold/40 bg-bg/90 backdrop-blur-xl"
        >
          <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
          </svg>
          <span className="text-[12px] font-bold tracking-widest">{t('contact.cta')}</span>
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
    <section id="contact" ref={ref} className="w-full py-32 px-6 relative bg-bg">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-md mx-auto text-center relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          className="section-label"
        >
          {t('contact.label')}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="section-title mt-4 mb-10"
        >
          {t('contact.title')}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-gold/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
            </div>
            <p className="text-text-secondary text-[14px] tracking-wide font-serif">
              {t('contact.location')}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-gold/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <p className="text-text-muted/60 text-[12px] tracking-widest uppercase font-serif">
              {t('contact.hours')}
            </p>
          </div>

          <a
            href="tel:+966"
            className="cta-btn mt-10 px-12 py-4 group"
          >
            <span className="relative z-10">{t('contact.cta')}</span>
          </a>
        </motion.div>
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
    <footer className="w-full py-20 px-6 border-t border-white/[0.03] bg-bg-overlay">
      <div className="max-w-md mx-auto text-center flex flex-col items-center gap-6">
        <span className="text-gold/30 text-2xl font-serif">杉</span>

        <div className="flex flex-col gap-2">
          <p className="text-text-muted/40 text-[9px] uppercase tracking-[0.4em] font-serif font-bold">
            {t('footer.copy')}
          </p>
          <p className="text-text-muted/20 text-[9px] tracking-[0.2em] font-serif uppercase">
            {t('footer.heart')}
          </p>
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
