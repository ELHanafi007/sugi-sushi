'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { menuData, CATEGORIES, Dish } from '@/data/menuData';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

/* ─── Kanji per category (enhanced) ─── */
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

/* ─── Chapter Grouping for Editorial Flow ─── */
const CHAPTERS = [
  { 
    id: 'beginnings', 
    title: 'The Beginnings', 
    titleAr: 'البدايات',
    cats: ['Salads', 'Soups', 'Starters'],
    kanji: '初'
  },
  { 
    id: 'main-works', 
    title: 'Main Works', 
    titleAr: 'الأطباق الرئيسية',
    cats: ['Wok, Noodles & Rice', 'Tempura', 'Sugi Dishes'],
    kanji: '主'
  },
  { 
    id: 'raw-art', 
    title: 'The Art of Raw', 
    titleAr: 'فن السوشي',
    cats: ['Sashimi', 'Tataki', 'Ceviche', 'Nigiri', 'Gunkan', 'Temaki'],
    kanji: '生'
  },
  { 
    id: 'rolls', 
    title: 'Signature Rolls', 
    titleAr: 'رولز التوقيع',
    cats: ['Maki Rolls', 'Aromaki Rolls', 'Aromaki Fried', 'California Rolls', 'Special Rolls', 'Fried Rolls'],
    kanji: '巻'
  },
  { 
    id: 'collections', 
    title: 'The Collections', 
    titleAr: 'المجموعات',
    cats: ['Boxes', 'Sugi Boat'],
    kanji: '集'
  },
  { 
    id: 'finale', 
    title: 'The Finale', 
    titleAr: 'الخاتمة',
    cats: ['Desserts', 'Cold Drinks', 'Fresh Juices', 'Hot Drinks'],
    kanji: '終'
  }
];

/* ═══════════════════════════════════════════════════════
   EDITORIAL DISH COMPONENTS
   ═══════════════════════════════════════════════════════ */

const FeaturedDishCard = ({ dish, lang }: { dish: Dish; lang: 'en' | 'ar' }) => {
  const name = lang === 'ar' ? dish.nameAr || dish.name : dish.name;
  const desc = lang === 'ar' ? dish.descriptionAr || dish.description : dish.description;
  const imageUrl = dish.image || "/media/optimized/hero-wallpaper-1.jpg";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
      className="relative w-full h-[60vh] md:h-[70vh] rounded-[2.5rem] overflow-hidden group shadow-2xl"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[6s] group-hover:scale-105"
        style={{ backgroundImage: `url("${imageUrl}")` }} 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      
      <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-end">
        <div className="max-w-2xl">
          <span className="mono-tag !text-gold mb-4 !bg-gold/10 !border-gold/20">Featured Selection</span>
          <h3 className="text-white text-4xl md:text-6xl font-serif font-light mb-6 tracking-tight">{name}</h3>
          <p className="text-white/60 text-lg font-serif italic mb-8 line-clamp-2">&quot;{desc}&quot;</p>
          <div className="flex items-center gap-6">
            <span className="text-gold text-2xl font-serif">{dish.price}</span>
            <div className="h-px w-12 bg-white/10" />
            <span className="text-white/20 text-[10px] uppercase tracking-widest">{dish.category}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SecondaryDishCard = ({ dish, lang, idx }: { dish: Dish; lang: 'en' | 'ar'; idx: number }) => {
  const name = lang === 'ar' ? dish.nameAr || dish.name : dish.name;
  const imageUrl = dish.image || "/media/optimized/hero-wallpaper-2.jpg";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 * idx, duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
      className={`relative rounded-[2rem] overflow-hidden group shadow-xl ${
        idx === 0 ? 'aspect-[4/5]' : 'aspect-square mt-12'
      }`}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[4s] group-hover:scale-110"
        style={{ backgroundImage: `url("${imageUrl}")` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
      
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <h4 className="text-white text-2xl font-serif font-light mb-2">{name}</h4>
        <div className="flex justify-between items-center">
          <span className="text-gold/60 text-sm font-serif">{dish.price}</span>
          <span className="w-1 h-1 rounded-full bg-gold/20 group-hover:bg-gold transition-colors duration-500" />
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════
   STORY / PHILOSOPHY SECTION
   ═══════════════════════════════════════════════════════ */
function PhilosophySection() {
  const { t } = useLanguage();
  return (
    <section className="w-full section-padding relative bg-bg overflow-hidden border-t border-white/[0.03]">
      <div className="container-luxury">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mono-tag text-gold/40 mb-12 tracking-[0.5em]"
          >
            {t('story.label')}
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1.5 }}
            className="text-white text-4xl md:text-7xl font-serif font-light mb-16 tracking-tight leading-tight italic"
          >
            {t('story.title')}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-left">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/60 text-lg font-serif italic leading-relaxed"
            >
              {t('story.p1')}
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-white/40 text-base leading-relaxed"
            >
              {t('story.p2')}
            </motion.p>
          </div>
          
          <div className="mt-24 w-px h-32 bg-gradient-to-b from-gold/30 to-transparent" />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   MENU EXPERIENCE
   ═══════════════════════════════════════════════════════ */
function MenuExperience() {
  const { t, lang } = useLanguage();
  const [activeChapter, setActiveChapter] = useState(CHAPTERS[0].id);

  return (
    <section id="menu" className="w-full py-32 bg-bg relative">
      <div className="container-luxury">
        {/* Cinematic Header */}
        <div className="mb-40 text-center lg:text-left">
          <span className="section-label">{t('menu.label')}</span>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mt-8">
            <h2 className="text-white text-6xl md:text-9xl font-serif font-light tracking-tighter leading-none italic">
              The <span className="text-gold">Experience.</span>
            </h2>
            <div className="flex gap-8 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6 lg:mx-0 lg:px-0">
              {CHAPTERS.map((chap) => (
                <button
                  key={chap.id}
                  onClick={() => setActiveChapter(chap.id)}
                  className={`relative group flex flex-col items-center gap-2 min-w-fit px-4 transition-all duration-500 ${
                    activeChapter === chap.id ? 'opacity-100 scale-110' : 'opacity-30 hover:opacity-50'
                  }`}
                >
                  <span className="text-gold font-serif text-2xl">{chap.kanji}</span>
                  <span className="text-white text-[10px] uppercase tracking-[0.2em] font-medium whitespace-nowrap">
                    {lang === 'ar' ? chap.titleAr : chap.title}
                  </span>
                  {activeChapter === chap.id && (
                    <motion.div layoutId="chapUnderline" className="absolute -bottom-2 w-1 h-1 rounded-full bg-gold" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Gallery Content */}
        <AnimatePresence mode="wait">
          {CHAPTERS.map((chap) => chap.id === activeChapter && (
            <motion.div
              key={chap.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
              className="space-y-40"
            >
              {chap.cats.map((catName) => {
                const dishes = menuData.filter(d => d.category === catName);
                if (dishes.length === 0) return null;
                
                // Signature Selection Hierarchy
                const featured = dishes.find(d => d.tags.includes('Signature')) || dishes[0];
                const secondary = dishes.filter(d => d.id !== featured.id).slice(0, 2);
                const others = dishes.filter(d => d.id !== featured.id && !secondary.find(s => s.id === d.id));

                return (
                  <div key={catName} className="relative">
                    {/* Category Intro */}
                    <div className="flex items-center gap-8 mb-20 opacity-40 group">
                      <span className="text-gold font-serif text-5xl md:text-7xl">{KANJI[catName]}</span>
                      <h3 className="text-white text-2xl md:text-4xl font-serif font-light tracking-widest uppercase">
                        {t(`menu.cat.${catName}`)}
                      </h3>
                      <div className="flex-1 h-px bg-white/5" />
                    </div>

                    {/* Signature Selection System */}
                    <div className="flex flex-col gap-12 md:gap-32">
                      <FeaturedDishCard dish={featured} lang={lang} />
                      
                      {secondary.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32 items-start">
                          {secondary.map((s, i) => (
                            <SecondaryDishCard key={s.id} dish={s} lang={lang} idx={i} />
                          ))}
                        </div>
                      )}

                      {/* Remaining items in an editorial list format */}
                      {others.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-20 gap-y-12 pt-20 border-t border-white/[0.03]">
                          {others.map((dish) => (
                            <motion.div 
                              key={dish.id} 
                              className="flex justify-between items-baseline group"
                              whileHover={{ x: 10 }}
                              transition={{ duration: 0.5 }}
                            >
                              <div className="flex flex-col gap-1">
                                <span className="text-white/80 font-serif text-lg group-hover:text-gold transition-colors">
                                  {lang === 'ar' ? dish.nameAr || dish.name : dish.name}
                                </span>
                                <span className="text-white/30 text-[11px] italic font-serif truncate max-w-[200px]">
                                  {lang === 'ar' ? dish.descriptionAr || dish.description : dish.description}
                                </span>
                              </div>
                              <div className="flex-1 border-b border-white/[0.05] mx-4 mb-1.5 border-dotted" />
                              <span className="text-gold/50 font-serif group-hover:text-gold transition-colors">{dish.price}</span>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   CONTACT SECTION
   ═══════════════════════════════════════════════════════ */
function ContactSection() {
  const { t } = useLanguage();
  return (
    <section id="contact" className="w-full section-padding relative bg-bg overflow-hidden border-t border-white/[0.03]">
      <div className="container-luxury relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
            <span className="mono-tag mb-8 block text-gold/40 tracking-[0.5em]">{t('contact.label')}</span>
            <h2 className="text-white text-5xl md:text-8xl font-serif font-light mb-32 tracking-tighter leading-none italic">
              Experience the <span className="text-gold">Art of Motion.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
            {[
              { label: t('contact.visit'), content: t('contact.location'), sub: "Riyadh, KSA" },
              { label: t('contact.opening'), content: t('contact.hours'), sub: "7 Days a Week" },
              { label: t('contact.reservation'), content: "+966 55 000 0000", sub: "Digital Booking" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * i }}
                className="flex flex-col items-center gap-8"
              >
                <div className="w-px h-12 bg-gold/30" />
                <div>
                  <h4 className="mono-tag !text-gold/40 mb-4">{item.label}</h4>
                  <p className="text-white text-xl font-serif font-light mb-2">{item.content}</p>
                  <span className="text-[10px] mono-tag opacity-20">{item.sub}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div className="mt-40" whileInView={{ opacity: 1 }}>
            <a href="tel:+966" className="cta-btn group px-20 py-8 rounded-full border-white/10 bg-white/[0.02] hover:bg-gold/10 hover:border-gold/40 transition-all duration-700">
              <span className="text-white text-[12px] uppercase tracking-[0.5em] font-bold group-hover:text-gold transition-colors">
                {t('contact.cta')}
              </span>
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
    <footer className="w-full pt-40 pb-16 bg-bg relative overflow-hidden">
      <div className="container-luxury flex flex-col items-center">
        <div className="flex flex-col items-center gap-12 mb-40">
          <span className="text-gold text-8xl font-serif">杉</span>
          <div className="flex flex-col items-center gap-4">
            <span className="text-white text-3xl font-serif font-light tracking-[0.8em]">SUGI SUSHI</span>
            <span className="mono-tag text-gold/40 uppercase tracking-[0.5em]">{t('footer.perfection')}</span>
          </div>
        </div>
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-12 pt-16 border-t border-white/[0.05]">
          <div className="flex gap-12">
            {['menu', 'story', 'contact'].map(item => (
              <a key={item} href={`#${item}`} className="text-[10px] text-white/30 hover:text-gold transition-colors uppercase tracking-widest">{t(`nav.${item}`)}</a>
            ))}
          </div>
          <p className="text-[10px] text-white/10 uppercase tracking-widest">© 2026 SUGI • Riyadh</p>
        </div>
      </div>
    </footer>
  );
}

export default function MenuSection() {
  return (
    <div className="bg-bg relative">
      <PhilosophySection />
      <MenuExperience />
      <ContactSection />
      <Footer />
    </div>
  );
}
