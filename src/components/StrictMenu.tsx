'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { menuData, CATEGORIES, Dish } from '@/data/menuData';
import { getDynamicRecommendations } from '@/utils/recommendationEngine';
import Image from 'next/image';

/* ─── Category Imagery (using available assets) ─── */
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
  'Maki Rolls': '/media/optimized/brochure-1.jpg',
  'Special Rolls': '/media/optimized/brochure-3.jpg',
  'Fried Rolls': '/media/optimized/brochure-5.jpg',
  'Desserts': '/media/optimized/brochure-9.jpg',
};

const DEFAULT_IMAGE = '/media/optimized/hero-wallpaper-alt-0.jpg';

/* ═══════════════════════════════════════════════════════
   DISH MODAL
   ═══════════════════════════════════════════════════════ */
function DishModal({ dish, onClose }: { dish: Dish; onClose: () => void }) {
  const { lang } = useLanguage();
  const name = lang === 'ar' ? dish.nameAr || dish.name : dish.name;
  const desc = lang === 'ar' ? dish.descriptionAr || dish.description : dish.description;
  const image = dish.image || CAT_IMAGES[dish.category] || DEFAULT_IMAGE;

  const recommendations = useMemo(() => {
    return getDynamicRecommendations(dish, menuData, lang as 'en' | 'ar');
  }, [dish, lang]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-2xl overflow-y-auto no-scrollbar"
      onClick={onClose}
    >
      <div className="min-h-screen" onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <div className="sticky top-0 z-10 flex justify-between items-center p-4 md:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <motion.button 
            onClick={onClose} 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-11 h-11 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white hover:border-white/20 transition-all duration-300"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m15 18-6-6 6-6"/></svg>
          </motion.button>
          <span className="mono-tag !bg-gold/10 !text-gold/70 !border-gold/15 text-[8px]">{dish.category}</span>
          <div className="w-11" />
        </div>

        <div className="max-w-lg mx-auto px-5 pb-32">
          {/* Hero Image */}
          <motion.div 
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
          >
            <Image src={image} alt={name} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Image indicators */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div className="flex gap-2">
                <div className="w-8 h-[3px] rounded-full bg-gold" />
                <div className="w-3 h-[3px] rounded-full bg-white/15" />
                <div className="w-3 h-[3px] rounded-full bg-white/15" />
              </div>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-8"
          >
            {/* Name & Price */}
            <div className="flex justify-between items-start gap-4">
              <h2 className="text-3xl md:text-4xl font-serif text-white tracking-tight leading-tight">{name}</h2>
              <div className="flex flex-col items-end flex-shrink-0">
                <span className="text-2xl text-gold font-serif">{dish.price}</span>
                <span className="text-white/15 text-[9px] uppercase tracking-widest mt-0.5 font-mono">VAT Incl.</span>
              </div>
            </div>

            <p className="text-lg text-white/50 font-serif italic leading-relaxed">
              &quot;{desc}&quot;
            </p>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="card-glass rounded-xl p-5 space-y-2">
                <span className="text-gold/30 text-[8px] uppercase tracking-[0.3em] font-mono font-bold block">Flavor</span>
                <p className="text-white/80 text-sm font-serif">{dish.tags.includes('Spicy') ? 'Spicy & Vibrant' : 'Balanced & Umami'}</p>
              </div>
              <div className="card-glass rounded-xl p-5 space-y-2">
                <span className="text-gold/30 text-[8px] uppercase tracking-[0.3em] font-mono font-bold block">Chef Note</span>
                <p className="text-white/80 text-sm font-serif">{dish.tags.includes('Signature') ? 'House Special' : 'Seasonal Pick'}</p>
              </div>
            </div>

            {/* Tags */}
            <div className="pt-6 border-t border-white/[0.04] space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-6 h-px bg-gold/20" />
                <h4 className="text-gold/40 text-[9px] uppercase tracking-[0.4em] font-mono font-bold">Details</h4>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {dish.tags.map(tag => (
                  <span key={tag} className="px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[9px] text-white/40 uppercase tracking-[0.15em] font-mono font-bold">
                    {tag}
                  </span>
                ))}
                {dish.calories && (
                  <span className="px-4 py-1.5 rounded-full bg-gold/[0.06] border border-gold/15 text-[9px] text-gold/70 uppercase tracking-[0.15em] font-mono font-bold">
                    🔥 {dish.calories}
                  </span>
                )}
              </div>

              <p className="text-white/25 text-sm leading-relaxed font-serif italic">
                Sourced with respect for the ocean and the season. Prepared with the precision of a master&apos;s blade.
              </p>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="pt-8 space-y-5">
                <h4 className="text-white/70 text-base font-serif italic">
                  {lang === 'ar' ? 'نقترح عليك تجربته مع...' : 'Pairs beautifully with...'}
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {recommendations.map(rec => (
                    <motion.div 
                      key={rec.dish.id}
                      onClick={() => {
                        onClose();
                        setTimeout(() => {
                          (window as any).dispatchDishSelect?.(rec.dish);
                        }, 150);
                      }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="flex items-center gap-3 p-3 rounded-xl card-glass cursor-pointer group"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white/[0.04]">
                        <Image 
                          src={rec.dish.image || CAT_IMAGES[rec.dish.category] || DEFAULT_IMAGE}
                          alt={rec.dish.name}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-white/80 font-serif text-sm truncate group-hover:text-gold transition-colors duration-300">
                          {lang === 'ar' ? rec.dish.nameAr || rec.dish.name : rec.dish.name}
                        </h5>
                        <p className="text-gold/40 text-[9px] uppercase tracking-wider mt-0.5 italic font-mono line-clamp-1">{rec.reason}</p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-gold/[0.06] flex items-center justify-center text-gold/50 group-hover:bg-gold group-hover:text-black transition-all duration-300 flex-shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   STRICT MENU COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function StrictMenu({ onTabChange }: { onTabChange?: (tab: any) => void }) {
  const { lang, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  useEffect(() => {
    (window as any).dispatchDishSelect = (dish: Dish) => {
      setSelectedDish(dish);
    };
    return () => {
      delete (window as any).dispatchDishSelect;
    };
  }, []);

  const filteredDishes = useMemo(() => {
    let dishes = menuData.filter(dish => dish.category === selectedCategory);
    
    if (activeFilters.length > 0) {
      dishes = dishes.filter(dish => 
        activeFilters.every(filter => dish.tags.includes(filter))
      );
    }
    
    return dishes;
  }, [selectedCategory, activeFilters]);

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  return (
    <div className="min-h-screen bg-bg pt-20 pb-32">
      {/* Header */}
      <div className="px-6 mb-6">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white text-3xl font-serif font-light mb-1"
        >
          Menu
        </motion.h1>
        <span className="text-white/15 text-[9px] font-mono uppercase tracking-[0.4em]">
          {menuData.length} Items • {CATEGORIES.length} Categories
        </span>
      </div>

      {/* Category Slider */}
      <div className="mb-8">
        <div className="px-6 mb-4">
          <h2 className="text-white/25 text-[9px] uppercase tracking-[0.4em] font-mono font-bold">Categories</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-6 pb-3">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <motion.button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setActiveFilters([]); }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex-shrink-0 w-28 h-40 rounded-2xl overflow-hidden group transition-all duration-500 ${
                  isActive 
                    ? 'shadow-[0_8px_30px_rgba(212,175,55,0.12)] ring-1 ring-gold/20' 
                    : 'shadow-lg hover:shadow-xl'
                }`}
              >
                <Image 
                  src={CAT_IMAGES[cat] || DEFAULT_IMAGE} 
                  alt={cat}
                  fill
                  className={`object-cover transition-all duration-700 ${
                    isActive ? 'scale-110 brightness-[0.5]' : 'scale-100 brightness-[0.25] group-hover:brightness-[0.4] group-hover:scale-105'
                  }`}
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent ${
                  isActive ? 'opacity-80' : 'opacity-60'
                }`} />
                
                <div className="absolute inset-0 p-3 flex flex-col justify-end items-center text-center">
                  <span className={`text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-500 font-mono leading-tight ${
                    isActive ? 'text-gold' : 'text-white/30'
                  }`}>
                    {cat}
                  </span>
                  {isActive && (
                    <motion.div 
                      layoutId="catLine" 
                      className="w-8 h-[2px] rounded-full bg-gold mt-2" 
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Active Category & Filters */}
      <div className={`px-6 space-y-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
        <div className={`flex justify-between items-baseline ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <h3 className="text-white text-2xl font-serif">{selectedCategory}</h3>
          <span className="text-white/15 text-[10px] font-mono">{filteredDishes.length} Items</span>
        </div>

        {/* Dietary Filters */}
        <div className={`flex flex-wrap gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          {[
            { id: 'Vegetarian', label: lang === 'ar' ? 'نباتي' : 'Vegetarian', icon: '🍃' },
            { id: 'Spicy', label: lang === 'ar' ? 'حار' : 'Spicy', icon: '🌶️' },
            { id: 'Best Seller', label: lang === 'ar' ? 'الأكثر مبيعاً' : 'Best Seller', icon: '⭐' },
          ].map((filter) => (
            <motion.button
              key={filter.id}
              onClick={() => toggleFilter(filter.id)}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border transition-all duration-300 ${
                activeFilters.includes(filter.id)
                  ? 'bg-gold/90 border-gold text-black shadow-[0_0_16px_rgba(212,175,55,0.2)]'
                  : 'bg-white/[0.03] border-white/[0.06] text-white/50 hover:border-gold/20'
              }`}
            >
              <span className="text-xs">{filter.icon}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider font-mono">{filter.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Dish List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory + activeFilters.join(',')}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="grid grid-cols-1 gap-3 pt-4"
          >
            {filteredDishes.length > 0 ? (
              filteredDishes.map((dish, idx) => (
                <motion.div
                  key={dish.id}
                  onClick={() => setSelectedDish(dish)}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.04, ease: [0.19, 1, 0.22, 1] }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative flex items-center gap-4 p-3.5 rounded-2xl card-glass cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="w-[72px] h-[72px] rounded-xl overflow-hidden flex-shrink-0 bg-white/[0.04]">
                    <Image 
                      src={dish.image || CAT_IMAGES[dish.category] || DEFAULT_IMAGE}
                      alt={dish.name}
                      width={72}
                      height={72}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-white/80 font-serif text-base group-hover:text-gold transition-colors duration-400 truncate">
                        {lang === 'ar' ? dish.nameAr || dish.name : dish.name}
                      </h4>
                      <span className="text-gold/70 font-serif text-base flex-shrink-0">{dish.price}</span>
                    </div>
                    <p className="text-white/20 text-[11px] font-serif italic mt-1 line-clamp-1 leading-relaxed group-hover:text-white/35 transition-colors">
                      {lang === 'ar' ? dish.descriptionAr || dish.description : dish.description}
                    </p>
                    <div className="flex gap-1.5 mt-2.5">
                      {dish.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[7px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.05] text-white/25 group-hover:border-gold/15 group-hover:text-gold/40 transition-all font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-white/10 group-hover:text-gold/40 transition-colors flex-shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center space-y-4"
              >
                <div className="text-3xl opacity-40">🍽️</div>
                <p className="text-white/30 font-serif italic text-sm">
                  {lang === 'ar' 
                    ? 'لا توجد أطباق تطابق هذه الفلاتر في هذه الفئة.' 
                    : 'No dishes match these filters in this category.'}
                </p>
                <button 
                  onClick={() => setActiveFilters([])}
                  className="text-gold/60 text-[10px] uppercase tracking-widest border-b border-gold/20 pb-0.5 hover:text-gold hover:border-gold/40 transition-colors font-mono"
                >
                  {lang === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedDish && (
          <DishModal dish={selectedDish} onClose={() => setSelectedDish(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
