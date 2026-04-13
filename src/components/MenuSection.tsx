'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { menuData, CATEGORIES, Dish } from '@/data/menuData';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Intersection Observer Hook ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

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
  const isSignature = dish.tags.some(t => t.toLowerCase() === 'signature');

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        duration: 0.5, 
        delay: Math.min(idx * 0.05, 0.4),
        ease: [0.16, 1, 0.3, 1]
      }}
      className={`card group ${isSignature ? 'border-gold/20' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Name + Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-text text-[14px] font-serif uppercase tracking-[0.1em] leading-snug group-hover:text-gold transition-colors duration-300">
              {name}
            </h4>
            {isSignature && (
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse shrink-0" />
            )}
          </div>

          {/* Tags */}
          {dish.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {dish.tags.slice(0, 3).map((tag) => (
                <span key={tag} className={tagCls(tag)}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {desc && (
            <div className="mt-3 relative">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-gold/30 via-gold/10 to-transparent" />
              <p className="text-text-muted/50 text-[10.5px] leading-[1.6] font-light tracking-wide ps-3 line-clamp-2 italic">
                {desc}
              </p>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex flex-col items-end flex-shrink-0 pt-0.5">
          {price ? (
            <div className="flex flex-col items-end">
              <span className="text-gold font-serif text-[18px] font-medium leading-none tracking-tight">
                {price}
              </span>
              <span className="text-[8px] text-gold/40 uppercase tracking-[0.2em] mt-1.5 font-medium">
                {lang === 'ar' ? 'ر.س' : 'SR'}
              </span>
            </div>
          ) : (
            <div className="w-6 h-px bg-stroke mt-2" />
          )}
          {dish.calories && (
            <span className="text-[7px] text-text-muted/30 mt-3 tracking-[0.15em] uppercase font-medium">
              {dish.calories}
            </span>
          )}
        </div>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-radial-gradient from-gold/[0.03] to-transparent" />
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
    <section id="story" ref={ref} className="w-full py-32 px-5 relative overflow-hidden">
      {/* Background Decorative Kanji */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
        <span className="text-[280px] text-gold/[0.02] font-serif leading-none">
          杉
        </span>
      </div>

      <div className="max-w-md mx-auto text-center relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="section-label"
        >
          {t('story.label')}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="section-title mt-5 mb-8"
        >
          {t('story.title')}
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={visible ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="deco-line deco-line-center mb-10"
        />

        <div className="space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-text-secondary/60 text-[13px] leading-[1.9] tracking-wide"
          >
            {t('story.p1')}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-text-secondary/60 text-[13px] leading-[1.9] tracking-wide"
          >
            {t('story.p2')}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-14 flex flex-col items-center"
        >
          <div className="w-6 h-px bg-gold/20 mb-4" />
          <p className="text-gold/40 text-[10px] italic tracking-[0.2em] font-serif uppercase">
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
  const tabBarRef = useRef<HTMLDivElement>(null);
  
  const dishes = useMemo(() => menuData.filter((d) => d.category === active), [active]);
  const availCats = useMemo(() => CATEGORIES.filter((cat) => menuData.some((d) => d.category === cat)), []);

  useEffect(() => {
    const bar = tabBarRef.current;
    if (!bar) return;
    const tab = bar.querySelector('[data-active="true"]') as HTMLElement | null;
    if (tab) tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [active]);

  return (
    <section id="menu" className="w-full min-h-dvh flex flex-col items-center">
      {/* ─── Section Header ─── */}
      <div className="w-full max-w-xl pt-28 pb-10 px-6 text-center">
        <span className="section-label">{t('menu.label')}</span>
        <h2 className="section-title mt-5">{t('menu.title')}</h2>
        <div className="deco-line deco-line-center mt-8" />
      </div>

      {/* ─── Sticky Category Bar ─── */}
      <div className="sticky top-[60px] z-40 w-full bg-bg/80 backdrop-blur-2xl border-y border-stroke/50">
        <div
          ref={tabBarRef}
          className="flex gap-2 px-4 py-4 overflow-x-auto no-scrollbar max-w-xl mx-auto"
        >
          {availCats.map((cat) => {
            const on = cat === active;
            const count = menuData.filter((d) => d.category === cat).length;
            return (
              <button
                key={cat}
                data-active={on}
                onClick={() => setActive(cat)}
                className={`pill shrink-0 ${on ? 'pill--active' : 'hover:bg-white/[0.03]'}`}
              >
                <span className={`text-[12px] transition-colors duration-300 ${on ? 'text-gold' : 'text-text-muted/60'}`}>
                  {KANJI[cat] || '•'}
                </span>
                <span className="font-medium tracking-wide">{t(`menu.cat.${cat}`)}</span>
                <span className={`text-[8px] transition-opacity duration-300 ${on ? 'opacity-60' : 'opacity-20'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Dish Cards ─── */}
      <div className="w-full max-w-xl px-5 pb-32">
        <div className="flex flex-col gap-4 mt-8">
          <AnimatePresence mode="popLayout">
            {dishes.map((dish, i) => (
              <DishCard key={dish.id} dish={dish} lang={lang} idx={i} />
            ))}
          </AnimatePresence>

          {dishes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-text-muted/20"
            >
              <span className="text-4xl mb-4 opacity-50">{KANJI[active] || '•'}</span>
              <p className="text-[10px] uppercase tracking-[0.4em] font-serif font-medium">
                {t('common.coming')}
              </p>
            </motion.div>
          )}

          {dishes.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center gap-4 mt-16 mb-8"
            >
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
              <span className="text-[8px] text-text-muted/30 uppercase tracking-[0.5em] font-serif">
                {t('common.end')} {t(`menu.cat.${active}`)}
              </span>
            </motion.div>
          )}
        </div>
      </div>
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
    <section id="contact" ref={ref} className="w-full py-32 px-5 relative">
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
          className="section-title mt-5 mb-8"
        >
          {t('contact.title')}
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={visible ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="deco-line deco-line-center mb-10"
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <p className="text-text-secondary/70 text-[14px] tracking-[0.05em] font-serif">
            {t('contact.location')}
          </p>
          <p className="text-text-muted/50 text-[12px] tracking-wide">
            {t('contact.hours')}
          </p>

          <a
            href="tel:+966"
            className="cta-btn mt-10 px-10 py-4 group"
          >
            <span className="relative z-10">{t('contact.cta')}</span>
            <div className="absolute inset-0 bg-gold/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
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
    <footer className="w-full py-20 px-5 border-t border-stroke/30 bg-bg-card/30">
      <div className="max-w-md mx-auto text-center flex flex-col items-center gap-6">
        <div className="w-6 h-px bg-gold/20" />
        <div className="flex flex-col gap-2">
          <p className="text-text-muted/40 text-[9px] uppercase tracking-[0.5em] font-serif font-medium">
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
