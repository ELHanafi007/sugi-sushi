'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { MENU_DATA, CATEGORIES } from '@/data/menuData';
import { useLanguage } from '@/context/LanguageContext';

export default function MenuSection() {
  const { t, lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const filteredItems = MENU_DATA.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="w-full min-h-screen bg-background washi py-32 px-6 flex flex-col items-center">
      {/* Sharp Katana Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col items-center mb-24"
      >
        <span className="text-gold text-[10px] tracking-[0.8em] uppercase mb-4 pl-[0.8em]">{t('menu.collection')}</span>
        <h2 className="text-foreground text-4xl font-serif uppercase tracking-widest">{t('menu.title')}</h2>
        <div className="h-[1px] w-12 bg-gold/40 mt-8" />
      </motion.div>

      {/* Luxury Nav - Horizontal Scroll for Mobile */}
      <div className="w-full flex justify-center mb-24">
        <nav className="flex items-center gap-10 md:gap-20 overflow-x-auto no-scrollbar px-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-[10px] uppercase tracking-[0.4em] pl-[0.4em] whitespace-nowrap transition-all duration-700 relative ${
                activeCategory === cat ? 'text-gold' : 'text-foreground/30 hover:text-foreground/60'
              }`}
            >
              {t(`menu.cat.${cat}`)}
              {activeCategory === cat && (
                <motion.div 
                  layoutId="activeUnderline"
                  className="absolute -bottom-2 left-[0.4em] right-0 h-[1px] bg-gold/60"
                />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Sharp Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-16 max-w-5xl w-full">
        <AnimatePresence mode="wait">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              className="group flex flex-col gap-4 border-b border-gold/10 pb-6 hover:border-gold/30 transition-colors duration-700"
            >
              <div className="flex justify-between items-baseline">
                <h3 className="text-foreground text-lg font-serif group-hover:text-gold transition-colors duration-500 uppercase tracking-wide">
                  {lang === 'ar' ? item.nameAr || item.name : item.name}
                </h3>
                <span className="text-gold/60 font-serif italic text-sm pl-4">
                  {item.price}
                </span>
              </div>
              <p className="text-foreground/40 text-xs font-light leading-relaxed tracking-wider italic">
                {lang === 'ar' ? item.descriptionAr || item.description : item.description}
              </p>
              <div className="flex gap-2">
                {item.tags.map(tag => (
                  <span key={tag} className="text-[7px] border border-gold/10 px-2 py-0.5 rounded-full text-gold/30 uppercase tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Ritual Seal Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.1 }}
        className="mt-48 text-[120px] font-serif select-none pointer-events-none text-gold"
      >
        杉
      </motion.div>
    </section>
  );
}
