'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { menuData, CATEGORIES, Dish } from '@/data/menuData';

/* ─── Intersection Observer Hook ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
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
  if (t === 'signature' || t === "chef's choice") return 'tag tag--gold';
  if (t === 'best seller') return 'tag tag--gold';
  if (t === 'spicy' || t === 'hot') return 'tag tag--red';
  if (t === 'premium') return 'tag tag--gold';
  return 'tag tag--muted';
}

/* ═══════════════════════════════════════════════════════
   DISH CARD
   ═══════════════════════════════════════════════════════ */
function DishCard({ dish, lang, idx }: { dish: Dish; lang: 'en' | 'ar'; idx: number }) {
  const name = lang === 'ar' ? dish.nameAr || dish.name : dish.name;
  const desc = lang === 'ar' ? dish.descriptionAr || dish.description : dish.description;
  const price = dish.price.replace(' SR', '').trim();

  return (
    <article
      className="card animate-[fade-up_0.45s_ease_both]"
      style={{ animationDelay: `${Math.min(idx * 50, 400)}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Name + Description */}
        <div className="flex-1 min-w-0">
          <h4 className="text-text text-[13px] font-serif uppercase tracking-[0.08em] leading-snug">
            {name}
          </h4>

          {/* Tags */}
          {dish.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {dish.tags.slice(0, 3).map((tag) => (
                <span key={tag} className={tagCls(tag)}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {desc && (
            <>
              <div className="divider-gold my-2.5" />
              <p className="text-text-muted/40 text-[10px] leading-relaxed font-light tracking-wide
                           border-s border-gold/10 ps-2.5 line-clamp-2">
                {desc}
              </p>
            </>
          )}
        </div>

        {/* Price */}
        <div className="flex flex-col items-end flex-shrink-0 pt-0.5">
          {price ? (
            <>
              <span className="text-gold font-serif text-[17px] font-medium leading-none">
                {price}
              </span>
              <span className="text-[7px] text-gold/35 uppercase tracking-wider mt-0.5">
                {lang === 'ar' ? 'ر.س' : 'SR'}
              </span>
            </>
          ) : (
            <div className="w-4 h-px bg-stroke mt-1" />
          )}
          {dish.calories && (
            <span className="text-[7px] text-text-dim/30 mt-2 tracking-wider">
              {dish.calories}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════
   STORY SECTION
   ═══════════════════════════════════════════════════════ */
function StorySection() {
  const { t } = useLanguage();
  const { ref, visible } = useReveal();

  return (
    <section id="story" ref={ref} className="w-full py-24 px-5">
      <div className="max-w-md mx-auto text-center">
        {/* Label */}
        <span
          className="section-label reveal"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(12px)', transition: 'all 0.6s ease' }}
        >
          {t('story.label')}
        </span>

        {/* Title */}
        <h2
          className="section-title mt-4 mb-6"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)', transition: 'all 0.7s ease 0.08s' }}
        >
          {t('story.title')}
        </h2>

        {/* Deco line */}
        <div
          className="deco-line deco-line-center mb-8"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'scaleX(1)' : 'scaleX(0)', transition: 'all 0.8s ease 0.15s', transformOrigin: 'center' }}
        />

        {/* Paragraphs */}
        <p
          className="text-text-secondary/50 text-[12px] leading-[1.8] mb-5"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(12px)', transition: 'all 0.6s ease 0.2s' }}
        >
          {t('story.p1')}
        </p>
        <p
          className="text-text-secondary/50 text-[12px] leading-[1.8]"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(12px)', transition: 'all 0.6s ease 0.28s' }}
        >
          {t('story.p2')}
        </p>

        {/* Signature */}
        <div
          className="mt-10 flex flex-col items-center"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.4s' }}
        >
          <div className="w-5 h-px bg-stroke mb-3" />
          <p className="text-text-muted/30 text-[9px] italic tracking-wider font-serif">
            {t('story.sig')}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   MENU SECTION (with category tabs + dish cards)
   ═══════════════════════════════════════════════════════ */
function MenuContent() {
  const { t, lang } = useLanguage();
  const [active, setActive] = useState(CATEGORIES[0]);
  const tabBarRef = useRef<HTMLDivElement>(null);
  const dishes = menuData.filter((d) => d.category === active);
  const availCats = CATEGORIES.filter((cat) => menuData.some((d) => d.category === cat));

  // Scroll active tab into view
  useEffect(() => {
    const bar = tabBarRef.current;
    if (!bar) return;
    const tab = bar.querySelector('[data-active="true"]') as HTMLElement | null;
    if (tab) tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [active]);

  return (
    <section id="menu" className="w-full min-h-dvh flex flex-col items-center">
      {/* ─── Section Header ─── */}
      <div className="w-full max-w-xl pt-20 pb-6 px-5 text-center">
        <span className="section-label">{t('menu.label')}</span>
        <h2 className="section-title mt-4">{t('menu.title')}</h2>
        <div className="deco-line deco-line-center mt-6" />
      </div>

      {/* ─── Sticky Category Bar ─── */}
      <div className="sticky top-[52px] z-40 w-full bg-bg/90 backdrop-blur-xl border-b border-stroke">
        <div
          ref={tabBarRef}
          className="flex gap-1.5 px-4 py-3 overflow-x-auto no-scrollbar max-w-xl mx-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {availCats.map((cat) => {
            const on = cat === active;
            const count = menuData.filter((d) => d.category === cat).length;
            return (
              <button
                key={cat}
                data-active={on}
                onClick={() => setActive(cat)}
                className={`pill ${on ? 'pill--active' : ''}`}
              >
                <span className="text-[11px]">{KANJI[cat] || '•'}</span>
                <span>{t(`menu.cat.${cat}`)}</span>
                <span className={`text-[7px] ${on ? 'text-gold/40' : 'text-text-dim/20'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Dish Cards ─── */}
      <div className="w-full max-w-xl px-4 pb-32">
        <div className="flex flex-col gap-3 mt-5">
          {dishes.map((dish, i) => (
            <DishCard key={dish.id} dish={dish} lang={lang} idx={i} />
          ))}

          {dishes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-text-dim/30">
              <span className="text-3xl mb-3">{KANJI[active] || '•'}</span>
              <p className="text-[9px] uppercase tracking-[0.3em] font-serif">
                {t('common.coming')}
              </p>
            </div>
          )}

          {dishes.length > 0 && (
            <div className="flex flex-col items-center gap-3 mt-8 mb-4">
              <div className="w-10 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
              <span className="text-[7px] text-text-dim/20 uppercase tracking-[0.3em] font-serif">
                {t('common.end')} {t(`menu.cat.${active}`)}
              </span>
            </div>
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
    <section id="contact" ref={ref} className="w-full py-24 px-5">
      <div className="max-w-md mx-auto text-center">
        <span
          className="section-label"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(12px)', transition: 'all 0.6s ease' }}
        >
          {t('contact.label')}
        </span>

        <h2
          className="section-title mt-4 mb-6"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)', transition: 'all 0.7s ease 0.08s' }}
        >
          {t('contact.title')}
        </h2>

        <div
          className="deco-line deco-line-center mb-8"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'scaleX(1)' : 'scaleX(0)', transition: 'all 0.8s ease 0.15s', transformOrigin: 'center' }}
        />

        <div
          className="flex flex-col items-center gap-3"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(12px)', transition: 'all 0.6s ease 0.2s' }}
        >
          <p className="text-text-secondary/50 text-[12px] tracking-wider">
            {t('contact.location')}
          </p>
          <p className="text-text-muted/40 text-[11px] tracking-wider">
            {t('contact.hours')}
          </p>

          <a
            href="tel:+966"
            className="cta-btn mt-6"
          >
            {t('contact.cta')}
          </a>
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
    <footer className="w-full py-12 px-5 border-t border-stroke">
      <div className="max-w-md mx-auto text-center flex flex-col items-center gap-4">
        <div className="w-5 h-px bg-stroke" />
        <p className="text-text-dim/30 text-[8px] uppercase tracking-[0.3em] font-serif">
          {t('footer.copy')}
        </p>
        <p className="text-text-dim/20 text-[8px] tracking-wider font-serif">
          {t('footer.heart')}
        </p>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════ */
export default function MenuSection() {
  return (
    <>
      <StorySection />
      <MenuContent />
      <ContactSection />
      <Footer />
    </>
  );
}
