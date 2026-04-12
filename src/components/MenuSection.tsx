'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { MENU_DATA, CATEGORIES } from '@/data/menuData';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

const CATEGORY_IMAGES: Record<string, string> = {
  'Starters': '/media/optimized/brochure-1.jpg',
  'Sushi & Sashimi': '/media/optimized/brochure-3.jpg',
  'Specialty Rolls': '/media/optimized/brochure-5.jpg',
  'Main Dishes': '/media/optimized/brochure-8.jpg',
  'Desserts': '/media/optimized/brochure-10.jpg',
};

export default function MenuSection() {
  const { t, lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredItems = MENU_DATA.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="w-full min-h-screen bg-[#080808] py-32 px-6 flex flex-col items-center relative overflow-hidden">
      {/* Background Subtle Elements */}
      <div className="absolute inset-0 washi opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-64 bg-gradient-to-b from-gold/30 via-gold/10 to-transparent" />
      
      {/* Rich Ambient Glow */}
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-accent-red/3 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Area */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center mb-32 z-10"
      >
        <span className="text-gold text-[10px] tracking-[1em] uppercase mb-6 pl-[1em] font-medium">
          {activeCategory ? t(`menu.cat.${activeCategory}`) : t('menu.collection')}
        </span>
        <h2 className="text-foreground text-5xl md:text-8xl font-serif uppercase tracking-[0.2em] relative">
          {activeCategory ? activeCategory : t('menu.title')}
          <motion.div 
            layoutId="header-underline"
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 h-[1px] w-24 bg-gradient-to-r from-transparent via-gold to-transparent" 
          />
        </h2>
      </motion.div>

      <div className="max-w-[1400px] w-full z-10">
        <AnimatePresence mode="wait">
          {!activeCategory ? (
            /* --- CATEGORY GRID VIEW --- */
            <motion.div
              key="categories"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
            >
              {CATEGORIES.map((cat, idx) => (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 + 0.2, duration: 1 }}
                  onClick={() => setActiveCategory(cat)}
                  className="group relative h-[250px] md:h-[500px] cursor-pointer overflow-hidden rounded-sm border border-gold/5 hover:border-gold/30 transition-all duration-700 shadow-2xl"
                >
                  {/* Category Image Background - Removed grayscale */}
                  <Image 
                    src={CATEGORY_IMAGES[cat] || '/media/optimized/wallpaper.webp'}
                    alt={cat}
                    fill
                    className="object-cover scale-[1.02] group-hover:scale-110 transition-all duration-[2s] ease-out opacity-60 group-hover:opacity-90"
                  />
                  
                  {/* Rich Luxury Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-all duration-700 group-hover:via-black/40" />
                  
                  {/* Subtle Inner Border on Hover */}
                  <div className="absolute inset-4 border border-gold/0 group-hover:border-gold/20 transition-all duration-700 pointer-events-none" />
                  
                  {/* Text Content */}
                  <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end items-center text-center">
                    <span className="text-gold text-[8px] md:text-[9px] tracking-[0.6em] uppercase mb-4 opacity-0 group-hover:opacity-100 group-hover:mb-3 transition-all duration-700 font-serif font-bold">
                      Explore
                    </span>
                    <h3 className="text-foreground text-xl md:text-3xl font-serif uppercase tracking-[0.2em] group-hover:text-gold transition-colors duration-500 mb-2 drop-shadow-lg">
                      {t(`menu.cat.${cat}`)}
                    </h3>
                    <div className="w-8 h-[1px] bg-gold/20 group-hover:w-24 group-hover:bg-gold transition-all duration-700" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* --- PRODUCT LIST VIEW --- */
            <motion.div
              key="products"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              {/* Back Button */}
              <button 
                onClick={() => setActiveCategory(null)}
                className="group mb-20 flex items-center gap-4 text-[10px] tracking-[0.4em] uppercase text-gold/60 hover:text-gold transition-colors duration-500"
              >
                <span className="w-8 h-[1px] bg-gold/20 group-hover:w-12 group-hover:bg-gold transition-all duration-500" />
                {t('menu.back')}
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 md:gap-x-32 gap-y-16 md:gap-y-24 w-full max-w-6xl px-4">
                {filteredItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 1 }}
                    className="group flex flex-col gap-5 relative"
                  >
                    <div className="flex justify-between items-baseline gap-4">
                      <div className="flex flex-col gap-2">
                        <h4 className="text-foreground text-lg md:text-2xl font-serif uppercase tracking-[0.1em] group-hover:text-gold transition-colors duration-500">
                          {lang === 'ar' ? item.nameAr || item.name : item.name}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map(tag => (
                            <span key={tag} className="text-[7px] md:text-[8px] px-2 py-0.5 border border-gold/10 text-gold/60 uppercase tracking-[0.2em] rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex-grow border-b border-dotted border-gold/20 mb-2 min-w-[20px]" />
                      <span className="text-gold font-serif italic text-lg md:text-2xl whitespace-nowrap">
                        {item.price} <span className="text-[10px] not-italic ml-0.5 opacity-60">SR</span>
                      </span>
                    </div>
                    <p className="text-foreground/60 text-[11px] md:text-sm leading-relaxed font-light tracking-wide italic max-w-[90%] border-l-2 border-gold/5 pl-4 group-hover:border-gold/30 transition-all duration-700">
                      {lang === 'ar' ? item.descriptionAr || item.description : item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background Ritual Seal */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.03 }}
        className="mt-48 text-[250px] font-serif select-none pointer-events-none text-gold z-0 fixed bottom-0 right-0"
      >
        杉
      </motion.div>
    </section>
  );
}
