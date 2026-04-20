'use client';

import { useState, useMemo, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { menuData, CATEGORIES, Dish } from '@/data/menuData';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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

const CAT_IMAGES: Record<string, string> = {
  'Salads': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
  'Soups': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80',
  'Starters': 'https://images.unsplash.com/photo-1541014741259-df549fa9ba6f?auto=format&fit=crop&w=1200&q=80',
  'Wok, Noodles & Rice': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80',
  'Tempura': 'https://images.unsplash.com/photo-1569050278883-d5c58c39bb7a?auto=format&fit=crop&w=1200&q=80',
  'Sugi Dishes': 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=80',
  'Sashimi': 'https://images.unsplash.com/photo-1534422298391-e4f8c170db0a?auto=format&fit=crop&w=1200&q=80',
  'Tataki': 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&w=1200&q=80',
  'Ceviche': 'https://images.unsplash.com/photo-1534604973900-c41ab4c5e636?auto=format&fit=crop&w=1200&q=80',
  'Nigiri': 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?auto=format&fit=crop&w=1200&q=80',
};
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=80';

/* ─── Featured Dish Card (Masterpiece Edition) ─── */
const FeaturedDishCard = ({ dish, lang }: { dish: Dish; lang: 'en' | 'ar' }) => {
  const name = lang === 'ar' ? dish.nameAr || dish.name : dish.name;
  const desc = lang === 'ar' ? dish.descriptionAr || dish.description : dish.description;
  const imageUrl = dish.image || CAT_IMAGES[dish.category] || DEFAULT_IMAGE;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
      style={{ willChange: "transform, opacity" }}
      className="relative w-full h-[60vh] md:h-[75vh] rounded-[3rem] overflow-hidden group shadow-[0_40px_80px_rgba(0,0,0,0.5)] luxury-card"
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 1024px) 100vw, 1200px"
          className="object-cover transition-transform duration-[8s] group-hover:scale-110 brightness-[0.4] saturate-[1.2]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-black/20" />
      
      {/* Light Sweep */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-12"
        />
      </div>

      <div className="absolute inset-0 p-8 md:p-20 flex flex-col justify-end">
        <div className="max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="mono-tag !text-gold/80 !bg-gold/5 !border-gold/20 font-black">Featured Selection</span>
            <div className="h-px w-12 bg-gold/20" />
          </motion.div>
          
          <h3 className="text-display liquid-gold mb-8 !text-4xl md:!text-7xl tracking-tightest leading-none">
            {name}
          </h3>
          <p className="text-white/65 text-lg md:text-2xl font-serif italic mb-10 line-clamp-3 leading-relaxed">
            &quot;{desc}&quot;
          </p>
          
          <div className="flex items-center gap-8">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl text-gold font-serif">{dish.price}</span>
              <span className="text-mono text-gold/30 text-[10px]">SR</span>
            </div>
            <div className="h-10 w-px bg-white/5" />
            <span className="text-mono text-white/35 text-[10px] tracking-[0.5em] font-black">{dish.category}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Secondary Dish Card (Masterpiece Edition) ─── */
const SecondaryDishCard = ({ dish, lang, idx }: { dish: Dish; lang: 'en' | 'ar'; idx: number }) => {
  const name = lang === 'ar' ? dish.nameAr || dish.name : dish.name;
  const imageUrl = dish.image || CAT_IMAGES[dish.category] || DEFAULT_IMAGE;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 * idx, duration: 2, ease: [0.19, 1, 0.22, 1] }}
      style={{ willChange: "transform, opacity" }}
      className={`relative rounded-[2.5rem] overflow-hidden group luxury-card ${
        idx === 0 ? 'aspect-[4/5]' : 'aspect-square lg:mt-20'
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 500px"
          className="object-cover transition-transform duration-[6s] group-hover:scale-110 brightness-[0.5]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent" />
      
      <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
        <h4 className="text-white text-2xl md:text-4xl font-serif font-light mb-6 leading-tight group-hover:text-gold transition-colors duration-1000">{name}</h4>
        <div className="flex justify-between items-center">
          <div className="flex items-baseline gap-2">
            <span className="text-gold/60 text-2xl font-serif">{dish.price}</span>
            <span className="text-mono text-gold/20 text-[8px]">SR</span>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-gold/5 group-hover:bg-gold/40 transition-all duration-1000" />
        </div>
      </div>
    </motion.div>
  );
};

function PhilosophySection() {
  const { t } = useLanguage();
  return (
    <section className="w-full section-padding relative bg-bg overflow-hidden">
      <div className="divider-gold opacity-30 mb-48" />
      
      <div className="container-luxury">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-10"
          >
            <span className="section-label tracking-[1.5em] font-black">{t('story.label')}</span>
            <div className="w-px h-12 bg-gold/30" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 50, filter: 'blur(20px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 2.5, ease: [0.19, 1, 0.22, 1] }}
            className="text-white text-4xl md:text-7xl lg:text-8xl font-serif font-light mb-24 tracking-tightest leading-tight italic"
          >
            {t('story.title')}
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 text-left items-start">
            <motion.p 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 1.5 }}
              className="text-white/50 text-xl md:text-3xl font-serif italic leading-[1.6] font-light"
            >
              {t('story.p1')}
            </motion.p>
            <div className="flex flex-col gap-10">
              <motion.p 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 1.5 }}
                className="text-white/55 text-base md:text-xl leading-relaxed"
              >
                {t('story.p2')}
              </motion.p>
              <div className="h-[1px] w-40 bg-white/5" />
            </div>
          </div>
          
          <div className="mt-40 relative w-px h-32 bg-white/[0.05] overflow-hidden">
            <motion.div 
              animate={{ y: ['-100%', '300%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-gold/30 to-transparent"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function MenuExperience() {
  const { t, lang } = useLanguage();
  const [activeChapter, setActiveChapter] = useState(CHAPTERS[0].id);

  return (
    <section id="menu" className="w-full py-32 md:py-56 bg-bg relative">
      <div className="container-luxury">
        {/* Header Orchestration */}
        <div className="mb-32 md:mb-56 text-center lg:text-left">
          <div className="flex items-center gap-6 mb-12 justify-center lg:justify-start">
            <span className="section-label !opacity-60">{t('menu.label')}</span>
            <div className="h-[1px] w-24 bg-white/5 hidden md:block" />
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16">
            <motion.h2 
              initial={{ opacity: 0, x: -50, filter: 'blur(20px)' }}
              whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              className="text-white text-6xl md:text-9xl lg:text-[11rem] font-serif font-light tracking-tighter leading-none italic"
            >
              The <span className="text-gold shimmer-gold not-italic !font-black">Experience.</span>
            </motion.h2>
            
            {/* Chapter Navigation — Editorial Sidebar style */}
            <div className="flex lg:flex-col gap-6 md:gap-8 overflow-x-auto no-scrollbar pb-6 -mx-6 px-6 lg:mx-0 lg:px-0 lg:pb-0 items-center lg:items-end">
              {CHAPTERS.map((chap) => (
                <button
                  key={chap.id}
                  onClick={() => setActiveChapter(chap.id)}
                  className={`relative group flex items-center gap-6 min-w-fit transition-all duration-700 ${
                    activeChapter === chap.id ? 'opacity-100' : 'opacity-20 hover:opacity-50'
                  }`}
                >
                  <div className="flex flex-col items-center lg:items-end">
                    <span className="text-mono text-[9px] tracking-[0.4em] font-black uppercase text-gold/60 mb-1">
                      {lang === 'ar' ? chap.titleAr : chap.title}
                    </span>
                    <span className="font-serif text-3xl md:text-5xl text-white font-thin">
                      {chap.kanji}
                    </span>
                  </div>
                  {activeChapter === chap.id && (
                    <motion.div 
                      layoutId="active-chap"
                      className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_15px_rgba(212,175,55,1)] hidden lg:block"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Chapter Reveal */}
        <AnimatePresence mode="wait">
          {CHAPTERS.map((chap) => chap.id === activeChapter && (
            <motion.div
              key={chap.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
              className="space-y-40 md:space-y-72"
            >
              {chap.cats.map((catName) => {
                const dishes = menuData.filter(d => d.category === catName);
                if (dishes.length === 0) return null;
                
                const featured = dishes.find(d => d.tags.includes('Signature')) || dishes[0];
                const secondary = dishes.filter(d => d.id !== featured.id).slice(0, 2);
                const others = dishes.filter(d => d.id !== featured.id && !secondary.find(s => s.id === d.id));

                return (
                  <div key={catName} className="relative">
                    {/* Category Editorial Header */}
                    <div className="flex flex-col md:flex-row md:items-end gap-8 mb-20 md:mb-32">
                      <div className="flex items-center gap-8">
                        <span className="text-gold/60 font-serif text-6xl md:text-8xl font-thin leading-none">{KANJI[catName]}</span>
                        <div className="flex flex-col">
                          <span className="text-mono text-gold/30 text-[10px] tracking-[0.8em] font-black mb-2 uppercase">Category</span>
                          <h3 className="text-white/90 text-3xl md:text-6xl font-serif font-light tracking-tight italic">
                            {t(`menu.cat.${catName}`)}
                          </h3>
                        </div>
                      </div>
                      <div className="flex-1 h-[1px] bg-white/[0.04] mb-4 hidden md:block" />
                      <div className="flex flex-col items-end gap-2 mb-2">
                         <span className="text-mono text-white/10 text-[9px] uppercase tracking-widest font-black">
                           {dishes.length} Selected Items
                         </span>
                         <div className="w-12 h-px bg-gold/20" />
                      </div>
                    </div>

                    {/* Grid of Two for Efficiency */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-stretch">
                      {/* Left Column: Featured and some secondary */}
                      <div className="flex flex-col gap-12 md:gap-20">
                        <FeaturedDishCard dish={featured} lang={lang} />
                        {secondary.slice(0, 1).map((s, i) => (
                          <SecondaryDishCard key={s.id} dish={s} lang={lang} idx={i} />
                        ))}
                      </div>

                      {/* Right Column: Other secondary and others */}
                      <div className="flex flex-col gap-12 md:gap-20">
                        {secondary.slice(1).map((s, i) => (
                          <SecondaryDishCard key={s.id} dish={s} lang={lang} idx={i + 1} />
                        ))}
                        
                        {/* Remaining items — Editorial typography list */}
                        {others.length > 0 && (
                          <div className="flex flex-col gap-6 pt-10 border-t border-white/[0.03]">
                            {others.map((dish, idx) => (
                              <motion.div 
                                key={dish.id} 
                                className="flex flex-col group py-3 relative"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                              >
                                <div className="flex justify-between items-baseline mb-1">
                                  <span className="text-white/80 font-serif text-lg md:text-xl group-hover:text-gold transition-colors duration-700">
                                    {lang === 'ar' ? dish.nameAr || dish.name : dish.name}
                                  </span>
                                  <span className="text-gold/65 font-serif text-base group-hover:text-gold transition-colors duration-700">{dish.price}</span>
                                </div>
                                <p className="text-white/45 text-[10px] md:text-xs italic font-serif leading-relaxed line-clamp-1 group-hover:text-white/65 transition-colors duration-700">
                                  {lang === 'ar' ? dish.descriptionAr || dish.description : dish.description}
                                </p>
                                <div className="absolute bottom-0 left-0 w-0 h-px bg-gold/20 group-hover:w-full transition-all duration-1000" />
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
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

function ContactSection() {
  const { t } = useLanguage();
  return (
    <section id="contact" className="w-full section-padding relative bg-bg overflow-hidden">
      <div className="divider-gold opacity-30 mb-56" />
      
      <div className="container-luxury relative z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.03),transparent_70%)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-10 mb-32"
          >
            <span className="section-label tracking-[1em] font-black">{t('contact.label')}</span>
            <h2 className="text-white text-5xl md:text-8xl lg:text-9xl font-serif font-light tracking-tightest leading-none italic">
              Experience the <span className="text-gold shimmer-gold not-italic !font-black">Art of Motion.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
            {[
              { label: t('contact.visit'), content: t('contact.location'), sub: "Riyadh, KSA", icon: "📍" },
              { label: t('contact.opening'), content: t('contact.hours'), sub: "7 Days a Week", icon: "🕐" },
              { label: t('contact.reservation'), content: "+966 55 000 0000", sub: "Digital Booking", icon: "📞" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * i, duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                className="luxury-card rounded-[2.5rem] p-12 flex flex-col items-center gap-8 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity duration-1000 text-6xl">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-gold/60 text-[10px] uppercase tracking-[0.5em] font-black font-mono mb-6">{item.label}</h4>
                  <p className="text-white text-2xl md:text-3xl font-serif font-light mb-3">{item.content}</p>
                  <span className="text-white/35 text-[10px] uppercase tracking-[0.5em] font-black font-mono">{item.sub}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="mt-40 md:mt-56" 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <a 
              href="tel:+966" 
              className="cta-btn group px-20 py-8"
            >
              <span className="relative text-white text-[11px] uppercase tracking-[0.6em] font-black group-hover:text-gold group-hover:tracking-[0.8em] transition-all duration-700">
                {t('contact.cta')}
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="w-full pt-48 pb-32 bg-bg relative overflow-hidden">
      <div className="container-luxury flex flex-col items-center">
        {/* Cinematic Brand Mark */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-12 mb-32"
        >
          <motion.div 
            className="relative w-96 h-96 mix-blend-screen opacity-90"
            animate={{ 
              filter: [
                'drop-shadow(0 0 10px rgba(212,175,55,0.2))', 
                'drop-shadow(0 0 30px rgba(212,175,55,0.5))', 
                'drop-shadow(0 0 10px rgba(212,175,55,0.2))'
              ],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image src="/media/optimized/brand-logo.png" alt="Sugi Logo" fill className="object-contain" />
          </motion.div>
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-white text-3xl md:text-5xl font-serif font-light tracking-[0.8em] leading-none uppercase">SUGI SUSHI</h2>
            <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
            <span className="text-gold/30 text-[9px] font-mono uppercase tracking-[0.6em] font-black">{t('footer.perfection')}</span>
          </div>
        </motion.div>

        {/* Navigation & Legal Links */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-12 pt-16 border-t border-white/[0.03]">
          <div className="flex gap-12 md:gap-20">
            {['menu', 'story', 'contact'].map(item => (
              <a 
                key={item} 
                href={`#${item}`} 
                className="text-[10px] text-white/20 hover:text-gold transition-all duration-500 uppercase tracking-[0.4em] font-black font-mono"
              >
                {t(`nav.${item}`)}
              </a>
            ))}
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-[10px] text-white/35 uppercase tracking-[0.6em] font-black font-mono">© 2026 SUGI EXPERIENCE • RIYADH</p>
            <span className="text-[8px] text-white/25 uppercase tracking-[0.4em] font-mono">Crafted with Perfection</span>
          </div>
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
