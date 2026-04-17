'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { menuData, CATEGORIES, Dish } from '@/data/menuData';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

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

/* ─── Chapter Grouping ─── */
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

/* ─── Category Images (using existing brochure assets) ─── */
const CAT_IMAGES: Record<string, string> = {
  'Salads': '/media/optimized/brochure-1.jpg',
  'Soups': '/media/optimized/brochure-2.jpg',
  'Starters': '/media/optimized/brochure-3.jpg',
  'Wok, Noodles & Rice': '/media/optimized/brochure-4.jpg',
  'Tempura': '/media/optimized/brochure-5.jpg',
  'Sugi Dishes': '/media/optimized/brochure-6.jpg',
  'Sashimi': '/media/optimized/brochure-7.jpg',
  'Tataki': '/media/optimized/brochure-8.jpg',
  'Ceviche': '/media/optimized/brochure-9.jpg',
  'Nigiri': '/media/optimized/brochure-10.jpg',
};
const DEFAULT_IMAGE = '/media/optimized/hero-wallpaper-alt-0.jpg';

/* ═══════════════════════════════════════════════════════
   EDITORIAL DISH COMPONENTS
   ═══════════════════════════════════════════════════════ */

const FeaturedDishCard = ({ dish, lang }: { dish: Dish; lang: 'en' | 'ar' }) => {
  const name = lang === 'ar' ? dish.nameAr || dish.name : dish.name;
  const desc = lang === 'ar' ? dish.descriptionAr || dish.description : dish.description;
  const imageUrl = dish.image || CAT_IMAGES[dish.category] || DEFAULT_IMAGE;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
      className="relative w-full h-[55vh] md:h-[65vh] rounded-[2rem] overflow-hidden group shadow-2xl"
    >
      <Image
        src={imageUrl}
        alt={name}
        fill
        className="object-cover transition-transform duration-[6s] group-hover:scale-105 brightness-[0.6]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      
      <div className="absolute inset-0 p-6 md:p-12 lg:p-16 flex flex-col justify-end">
        <div className="max-w-2xl">
          <span className="mono-tag !text-gold mb-4 !bg-gold/10 !border-gold/20 inline-flex text-[8px]">Featured Selection</span>
          <h3 className="text-white text-3xl md:text-5xl font-serif font-light mb-4 tracking-tight group-hover:text-gold transition-colors duration-700">{name}</h3>
          <p className="text-white/50 text-sm md:text-base font-serif italic mb-6 line-clamp-2">&quot;{desc}&quot;</p>
          <div className="flex items-center gap-4">
            <span className="text-gold text-xl font-serif">{dish.price}</span>
            <div className="h-px w-8 bg-white/10" />
            <span className="text-white/20 text-[9px] uppercase tracking-widest font-mono">{dish.category}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SecondaryDishCard = ({ dish, lang, idx }: { dish: Dish; lang: 'en' | 'ar'; idx: number }) => {
  const name = lang === 'ar' ? dish.nameAr || dish.name : dish.name;
  const imageUrl = dish.image || CAT_IMAGES[dish.category] || DEFAULT_IMAGE;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.15 * idx, duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
      className={`relative rounded-[1.5rem] overflow-hidden group shadow-xl ${
        idx === 0 ? 'aspect-[4/5]' : 'aspect-square mt-8'
      }`}
    >
      <Image
        src={imageUrl}
        alt={name}
        fill
        className="object-cover transition-transform duration-[4s] group-hover:scale-110 brightness-[0.5]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
        <h4 className="text-white text-xl md:text-2xl font-serif font-light mb-2 group-hover:text-gold transition-colors duration-500">{name}</h4>
        <div className="flex justify-between items-center">
          <span className="text-gold/50 text-sm font-serif">{dish.price}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-gold/10 group-hover:bg-gold transition-colors duration-500" />
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
    <section className="w-full section-padding relative bg-bg overflow-hidden">
      {/* Subtle top border */}
      <div className="divider-gold mb-32" />
      
      <div className="container-luxury">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label mb-10 tracking-[0.8em]"
          >
            {t('story.label')}
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="text-white text-3xl md:text-6xl lg:text-7xl font-serif font-light mb-16 tracking-tight leading-tight italic"
          >
            {t('story.title')}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 text-left">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-white/50 text-base md:text-lg font-serif italic leading-relaxed"
            >
              {t('story.p1')}
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-white/30 text-sm md:text-base leading-relaxed"
            >
              {t('story.p2')}
            </motion.p>
          </div>
          
          <div className="mt-20 w-px h-20 bg-gradient-to-b from-gold/20 to-transparent" />
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
    <section id="menu" className="w-full py-24 md:py-32 bg-bg relative">
      <div className="container-luxury">
        {/* Header */}
        <div className="mb-24 md:mb-32 text-center lg:text-left">
          <span className="section-label">{t('menu.label')}</span>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mt-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-white text-5xl md:text-8xl lg:text-9xl font-serif font-light tracking-tighter leading-none italic"
            >
              The <span className="text-gold">Experience.</span>
            </motion.h2>
            
            {/* Chapter Navigation */}
            <div className="flex gap-3 md:gap-6 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6 lg:mx-0 lg:px-0">
              {CHAPTERS.map((chap) => (
                <button
                  key={chap.id}
                  onClick={() => setActiveChapter(chap.id)}
                  className={`relative group flex flex-col items-center gap-1.5 min-w-fit px-3 py-2 rounded-xl transition-all duration-500 ${
                    activeChapter === chap.id 
                      ? 'opacity-100 bg-gold/[0.06] border border-gold/15' 
                      : 'opacity-30 hover:opacity-50 border border-transparent'
                  }`}
                >
                  <span className={`font-serif text-xl transition-all duration-500 ${
                    activeChapter === chap.id ? 'text-gold' : 'text-white/60'
                  }`}>{chap.kanji}</span>
                  <span className={`text-[9px] uppercase tracking-[0.15em] font-medium whitespace-nowrap font-mono ${
                    activeChapter === chap.id ? 'text-gold/80' : 'text-white/40'
                  }`}>
                    {lang === 'ar' ? chap.titleAr : chap.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chapter Content */}
        <AnimatePresence mode="wait">
          {CHAPTERS.map((chap) => chap.id === activeChapter && (
            <motion.div
              key={chap.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
              className="space-y-24 md:space-y-32"
            >
              {chap.cats.map((catName) => {
                const dishes = menuData.filter(d => d.category === catName);
                if (dishes.length === 0) return null;
                
                const featured = dishes.find(d => d.tags.includes('Signature')) || dishes[0];
                const secondary = dishes.filter(d => d.id !== featured.id).slice(0, 2);
                const others = dishes.filter(d => d.id !== featured.id && !secondary.find(s => s.id === d.id));

                return (
                  <div key={catName} className="relative">
                    {/* Category Header */}
                    <div className="flex items-center gap-6 mb-12 md:mb-16">
                      <span className="text-gold/30 font-serif text-4xl md:text-5xl">{KANJI[catName]}</span>
                      <h3 className="text-white/50 text-xl md:text-2xl font-serif font-light tracking-widest uppercase">
                        {t(`menu.cat.${catName}`)}
                      </h3>
                      <div className="flex-1 h-px bg-white/[0.04]" />
                      <span className="text-white/15 text-[9px] font-mono uppercase tracking-widest hidden md:block">
                        {dishes.length} items
                      </span>
                    </div>

                    <div className="flex flex-col gap-10 md:gap-20">
                      <FeaturedDishCard dish={featured} lang={lang} />
                      
                      {secondary.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-start">
                          {secondary.map((s, i) => (
                            <SecondaryDishCard key={s.id} dish={s} lang={lang} idx={i} />
                          ))}
                        </div>
                      )}

                      {/* Remaining items — editorial list */}
                      {others.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-6 pt-12 border-t border-white/[0.04]">
                          {others.map((dish, idx) => (
                            <motion.div 
                              key={dish.id} 
                              className="flex justify-between items-baseline group py-2"
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: idx * 0.03 }}
                              whileHover={{ x: 6 }}
                            >
                              <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="text-white/70 font-serif text-base group-hover:text-gold transition-colors duration-500 truncate">
                                  {lang === 'ar' ? dish.nameAr || dish.name : dish.name}
                                </span>
                                <span className="text-white/20 text-[10px] italic font-serif truncate max-w-[180px]">
                                  {lang === 'ar' ? dish.descriptionAr || dish.description : dish.description}
                                </span>
                              </div>
                              <div className="flex-1 border-b border-dotted border-white/[0.04] mx-3 mb-1.5 min-w-[20px]" />
                              <span className="text-gold/40 font-serif text-sm group-hover:text-gold transition-colors duration-500 flex-shrink-0">{dish.price}</span>
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
    <section id="contact" className="w-full section-padding relative bg-bg overflow-hidden">
      <div className="divider-gold mb-32" />
      
      <div className="container-luxury relative z-10">
        {/* Ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[40vh] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.02),transparent_60%)] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-label mb-6 block tracking-[0.8em]">{t('contact.label')}</span>
            <h2 className="text-white text-4xl md:text-7xl lg:text-8xl font-serif font-light mb-24 md:mb-32 tracking-tighter leading-none italic">
              Experience the <span className="text-gold">Art of Motion.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {[
              { label: t('contact.visit'), content: t('contact.location'), sub: "Riyadh, KSA", icon: "📍" },
              { label: t('contact.opening'), content: t('contact.hours'), sub: "7 Days a Week", icon: "🕐" },
              { label: t('contact.reservation'), content: "+966 55 000 0000", sub: "Digital Booking", icon: "📞" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 * i, duration: 1 }}
                className="card-glass rounded-2xl p-8 flex flex-col items-center gap-5"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h4 className="text-gold/40 text-[9px] uppercase tracking-[0.4em] font-mono font-bold mb-3">{item.label}</h4>
                  <p className="text-white text-lg font-serif font-light mb-1">{item.content}</p>
                  <span className="text-white/15 text-[9px] uppercase tracking-widest font-mono">{item.sub}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="mt-24 md:mt-32" 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <a 
              href="tel:+966" 
              className="group relative inline-flex items-center gap-4 px-12 md:px-16 py-5 md:py-6 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden transition-all duration-700 hover:border-gold/30 hover:shadow-[0_0_40px_rgba(212,175,55,0.08)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative text-white text-[11px] uppercase tracking-[0.5em] font-bold group-hover:text-gold transition-colors duration-500">
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
    <footer className="w-full pt-32 pb-28 bg-bg relative overflow-hidden">
      <div className="container-luxury flex flex-col items-center">
        {/* Brand Mark */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-8 mb-24"
        >
          <motion.div 
            className="relative w-24 h-24 opacity-80 mix-blend-screen"
            animate={{ filter: ['drop-shadow(0 0 8px rgba(212,175,55,0.1))', 'drop-shadow(0 0 20px rgba(212,175,55,0.3))', 'drop-shadow(0 0 8px rgba(212,175,55,0.1))'] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Image src="/media/optimized/brand-logo.png" alt="Sugi Logo" fill className="object-contain" />
          </motion.div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/80 text-2xl font-serif font-light tracking-[0.7em]">SUGI SUSHI</span>
            <span className="text-gold/25 text-[8px] font-mono uppercase tracking-[0.5em]">{t('footer.perfection')}</span>
          </div>
        </motion.div>

        {/* Navigation Links */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-white/[0.04]">
          <div className="flex gap-8 md:gap-12">
            {['menu', 'story', 'contact'].map(item => (
              <a 
                key={item} 
                href={`#${item}`} 
                className="text-[10px] text-white/20 hover:text-gold transition-colors duration-500 uppercase tracking-widest font-mono"
              >
                {t(`nav.${item}`)}
              </a>
            ))}
          </div>
          <p className="text-[10px] text-white/10 uppercase tracking-widest font-mono">© 2026 SUGI • Riyadh</p>
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
