'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { menuData, CATEGORIES, Dish } from '@/data/menuData';

/* ─── Category Icons (Japanese Kanji) ─── */
const CAT_ICON: Record<string, string> = {
  'Salads': '菜',
  'Soups': '汁',
  'Starters': '前',
  'Wok, Noodles & Rice': '炒',
  'Tempura': '天',
  'Sugi Dishes': '主',
  'Sashimi': '刺',
  'Tataki': '叩',
  'Ceviche': '酢',
  'Nigiri': '握',
  'Gunkan': '軍',
  'Temaki': '手',
  'Maki Rolls': '巻',
  'Aromaki Rolls': '香',
  'Aromaki Fried': '揚',
  'California Rolls': '加',
  'Special Rolls': '特',
  'Fried Rolls': '衣',
  'Boxes': '箱',
  'Sugi Boat': '舟',
  'Cold Drinks': '冷',
  'Fresh Juices': '搾',
  'Hot Drinks': '温',
  'Desserts': '甘',
  'Extra Sauces': '醤',
};

/* ─── Tag Style Mapper ─── */
function tagStyle(tag: string): string {
  const t = tag.toLowerCase();
  if (t === 'signature' || t === "chef's choice")
    return 'bg-gold/10 text-gold border border-gold/20';
  if (t === 'best seller')
    return 'bg-gold/15 text-gold-bright border border-gold/30';
  if (t === 'spicy' || t === 'hot')
    return 'bg-vermilion-soft text-vermilion border border-vermilion/20';
  if (t === 'premium')
    return 'bg-gold/10 text-gold-soft border border-gold/15';
  if (t === 'new')
    return 'bg-bg-elevated text-text-muted border border-border-subtle';
  if (t === 'vegetarian')
    return 'bg-bg-tertiary text-text-muted border border-border-subtle';
  return 'bg-bg-tertiary text-text-dim border border-border-subtle';
}

/* ═══════════════════════════════════════════════════════════
   DISH CARD — Minimal, fast, no framer-motion per-card
   ═══════════════════════════════════════════════════════════ */
function DishCard({ dish, lang, index }: { dish: Dish; lang: 'en' | 'ar'; index: number }) {
  const name = lang === 'ar' ? dish.nameAr || dish.name : dish.name;
  const desc = lang === 'ar' ? dish.descriptionAr || dish.description : dish.description;
  const price = dish.price.replace(' SR', '').trim();

  return (
    <article
      className="card p-4 animate-stagger"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
    >
      {/* Top gold hairline */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gold/10 to-transparent" />

      <div className="flex items-start justify-between gap-3">
        {/* Left: Name + Description */}
        <div className="flex-1 min-w-0">
          <h4 className="text-text-primary text-[13px] font-serif uppercase tracking-[0.1em] leading-tight">
            {name}
          </h4>

          {/* Tags */}
          {dish.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {dish.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className={`text-[7px] px-2 py-0.5 rounded-full uppercase tracking-[0.15em]
                             font-medium ${tagStyle(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Description (only if exists) */}
          {desc && (
            <>
              <div className="divider-gold my-2.5" />
              <p className="text-text-muted/50 text-[10px] leading-relaxed font-light
                           tracking-wide border-l-2 border-gold/10 pl-2.5 line-clamp-2">
                {desc}
              </p>
            </>
          )}
        </div>

        {/* Right: Price + Calories */}
        <div className="flex flex-col items-end flex-shrink-0">
          {price ? (
            <>
              <span className="text-gold font-serif text-base font-medium leading-none">
                {price}
              </span>
              <span className="text-[7px] text-gold/40 uppercase tracking-wider mt-0.5">
                SR
              </span>
            </>
          ) : (
            <span className="text-text-dim text-[8px] uppercase tracking-wider">—</span>
          )}

          {dish.calories && (
            <span className="text-[7px] text-text-dim/40 mt-1.5 tracking-wider">
              {dish.calories}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION: Story / About
   ═══════════════════════════════════════════════════════════ */
function StorySection() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="story"
      ref={ref}
      className="w-full py-20 px-4 flex flex-col items-center text-center"
    >
      {/* Label */}
      <span className="text-gold text-[8px] tracking-[0.6em] uppercase font-serif mb-4">
        {t('story.label')}
      </span>

      {/* Title */}
      <h2 className="text-text-primary text-xl font-serif uppercase tracking-[0.2em] leading-tight whitespace-pre-line mb-6">
        {t('story.title')}
      </h2>

      {/* Body */}
      <p
        className={`text-text-secondary/60 text-[12px] leading-relaxed max-w-xs
                    mx-auto transition-all duration-700
                    ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        {t('story.body')}
      </p>

      {/* Signature */}
      <div className="mt-6 flex flex-col items-center">
        <div className="w-6 h-[1px] bg-border-subtle mb-3" />
        <p className="text-text-dim text-[9px] italic tracking-wider font-serif">
          {t('story.signature')}
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION: Contact
   ═══════════════════════════════════════════════════════════ */
function ContactSection() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="contact"
      ref={ref}
      className="w-full py-20 px-4 flex flex-col items-center text-center"
    >
      <span className="text-gold text-[8px] tracking-[0.6em] uppercase font-serif mb-4">
        {t('contact.label')}
      </span>

      <h2 className="text-text-primary text-xl font-serif uppercase tracking-[0.2em] leading-tight whitespace-pre-line mb-6">
        {t('contact.title')}
      </h2>

      {/* Info */}
      <div
        className={`flex flex-col items-center gap-3 transition-all duration-700
                    ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <p className="text-text-secondary/60 text-[11px] tracking-wider">
          {t('contact.location')}
        </p>
        <p className="text-text-muted/50 text-[10px] tracking-wider">
          {t('contact.hours')}
        </p>

        {/* CTA Button */}
        <a
          href={`tel:${t('contact.phone')}`}
          className="mt-4 inline-flex items-center gap-2 px-8 py-3
                     rounded-full border border-gold/20 bg-gold-glow
                     text-gold text-[10px] uppercase tracking-[0.2em] font-serif
                     active:scale-95 transition-transform"
        >
          {t('contact.cta')}
        </a>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION: Menu (with category tabs + dish cards)
   ═══════════════════════════════════════════════════════════ */
function MenuSectionContent() {
  const { t, lang } = useLanguage();
  const [active, setActive] = useState(CATEGORIES[0]);
  const tabBarRef = useRef<HTMLDivElement>(null);

  // Filter dishes for active category (only show categories with items)
  const dishes = menuData.filter((d) => d.category === active);

  // Build list of categories that actually have items
  const availableCats = CATEGORIES.filter((cat) =>
    menuData.some((d) => d.category === cat)
  );

  // Scroll active tab into view
  useEffect(() => {
    const bar = tabBarRef.current;
    if (!bar) return;
    const tab = bar.querySelector('[data-active="true"]') as HTMLElement;
    if (tab) {
      tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [active]);

  return (
    <section id="menu" className="w-full min-h-dvh flex flex-col items-center">
      {/* ─── Section Header ─── */}
      <div className="w-full max-w-lg pt-20 pb-4 px-4 text-center">
        <span className="text-gold text-[8px] tracking-[0.8em] uppercase font-serif">
          {t('menu.label')}
        </span>
        <h2 className="text-text-primary text-2xl font-serif uppercase tracking-[0.25em] mt-3">
          {t('menu.title')}
        </h2>
        <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent mx-auto mt-4" />
      </div>

      {/* ─── Sticky Category Bar ─── */}
      <div className="sticky top-[52px] z-40 w-full bg-bg-primary/90 backdrop-blur-xl
                      border-b border-border-subtle py-2.5">
        <div
          ref={tabBarRef}
          className="flex gap-1.5 px-4 overflow-x-auto no-scrollbar max-w-lg mx-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {availableCats.map((cat) => {
            const isActive = cat === active;
            const count = menuData.filter((d) => d.category === cat).length;
            return (
              <button
                key={cat}
                data-active={isActive}
                onClick={() => setActive(cat)}
                className={`pill flex-shrink-0 transition-all ${isActive ? 'active' : ''}`}
              >
                <span className="text-[11px] font-jp">
                  {CAT_ICON[cat] || '•'}
                </span>
                <span>{t(`menu.cat.${cat}`)}</span>
                <span className={`text-[8px] ${isActive ? 'text-gold/50' : 'text-text-dim/30'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Dish Cards ─── */}
      <div className="w-full max-w-lg px-4 pb-32">
        <div className="flex flex-col gap-3 mt-4">
          {dishes.map((dish, i) => (
            <DishCard key={dish.id} dish={dish} lang={lang} index={i} />
          ))}

          {/* Empty state */}
          {dishes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-text-dim/40">
              <span className="text-3xl mb-3 font-jp">
                {CAT_ICON[active] || '•'}
              </span>
              <p className="text-[9px] uppercase tracking-[0.3em] font-serif">
                {t('common.coming-soon')}
              </p>
            </div>
          )}

          {/* End marker */}
          {dishes.length > 0 && (
            <div className="flex flex-col items-center gap-3 mt-8 mb-4">
              <div className="w-10 h-[1px] bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
              <span className="text-[7px] text-text-dim/30 uppercase tracking-[0.3em] font-serif">
                {t('common.end-of')} {t(`menu.cat.${active}`)}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CSS STAGGER ANIMATION (defined here for the component)
   ═══════════════════════════════════════════════════════════ */
const StaggerStyle = () => (
  <style>{`
    @keyframes stagger-in {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-stagger {
      animation: stagger-in 0.4s ease-out;
    }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════
   MAIN EXPORT — Combines Story + Menu + Contact
   ═══════════════════════════════════════════════════════════ */
export default function MenuSection() {
  return (
    <>
      <StaggerStyle />
      <StorySection />
      <MenuSectionContent />
      <ContactSection />
    </>
  );
}
