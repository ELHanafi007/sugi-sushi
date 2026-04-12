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
    <section id="menu" className="w-full min-h-screen bg-[#0D0D0D] py-32 px-6 flex flex-col items-center relative overflow-hidden">
      {/* Background Subtle Elements */}
      <div className="absolute inset-0 washi opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-64 bg-gradient-to-b from-gold/40 to-transparent opacity-20" />
      
      {/* Header Area */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center mb-32 z-10"
      >
        <span className="text-gold text-[10px] tracking-[1em] uppercase mb-6 pl-[1em] font-medium opacity-60">
          {activeCategory ? t(`menu.cat.${activeCategory}`) : t('menu.collection')}
        </span>
        <h2 className="text-foreground text-5xl md:text-7xl font-serif uppercase tracking-[0.2em] relative">
          {activeCategory ? activeCategory : t('menu.title')}
          <motion.div 
            layoutId="header-underline"
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 h-[1px] w-24 bg-gold/50" 
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
                  className="group relative h-[250px] md:h-[450px] cursor-pointer overflow-hidden border border-white/5 hover:border-gold/30 transition-all duration-700 rounded-sm"
                >
                  {/* Category Image Background */}
                  <Image 
                    src={CATEGORY_IMAGES[cat] || '/media/optimized/wallpaper.webp'}
                    alt={cat}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1.5s] ease-out opacity-40 group-hover:opacity-70"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
                  
                  {/* Text Content */}
                  <div className="absolute inset-0 p-12 flex flex-col justify-end items-center text-center">
                    <span className="text-gold/40 text-[9px] tracking-[0.6em] uppercase mb-4 opacity-0 group-hover:opacity-100 group-hover:mb-2 transition-all duration-700 font-serif">
                      Explore
                    </span>
                    <h3 className="text-foreground text-2xl font-serif uppercase tracking-[0.3em] group-hover:text-gold transition-colors duration-500 mb-2">
                      {t(`menu.cat.${cat}`)}
                    </h3>
                    <div className="w-0 h-[1px] bg-gold/40 group-hover:w-16 transition-all duration-700" />
                  </div>

                  {/* Subtle Border Glow */}
                  <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-none" />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-32 gap-y-20 w-full max-w-5xl">
                {filteredItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 1 }}
                    className="group flex flex-col gap-6 relative"
                  >
                    <div className="flex justify-between items-baseline gap-6 border-b border-gold/10 pb-4 group-hover:border-gold/40 transition-colors duration-700">
                      <div className="flex flex-col gap-1">
                        <h4 className="text-foreground text-xl font-serif uppercase tracking-[0.1em] group-hover:text-gold transition-colors duration-500">
                          {lang === 'ar' ? item.nameAr || item.name : item.name}
                        </h4>
                        <div className="flex gap-3">
                          {item.tags.map(tag => (
                            <span key={tag} className="text-[7px] text-gold/40 uppercase tracking-[0.2em]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-gold font-serif italic text-lg">
                        {item.price} <span className="text-[9px] not-italic ml-1">SR</span>
                      </span>
                    </div>
                    <p className="text-foreground/40 text-xs leading-relaxed font-light tracking-wider italic">
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
