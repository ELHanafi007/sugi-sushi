'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { menuData, CATEGORIES, Dish } from '@/data/menuData';
import { getDynamicRecommendations } from '@/utils/recommendationEngine';

/* ─── Category Imagery (Using available assets) ─── */
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
  'Maki Rolls': '/media/optimized/hero-wallpaper-alt-1.jpg',
  'Special Rolls': '/media/optimized/hero-wallpaper-alt-2.jpg',
  'Fried Rolls': '/media/optimized/hero-wallpaper-alt-3.jpg',
  'Desserts': '/media/optimized/hero-wallpaper-alt-4.jpg',
};

const DEFAULT_IMAGE = '/media/optimized/hero-wallpaper-alt-0.jpg';

/* ═══════════════════════════════════════════════════════
   DISH MODAL (DETAILED VIEW)
   ═══════════════════════════════════════════════════════ */
function DishModal({ dish, onClose }: { dish: Dish; onClose: () => void }) {
  const { lang, t } = useLanguage();
  const name = lang === 'ar' ? dish.nameAr || dish.name : dish.name;
  const desc = lang === 'ar' ? dish.descriptionAr || dish.description : dish.description;
  const image = dish.image || CAT_IMAGES[dish.category] || DEFAULT_IMAGE;

  // Recommended dishes (dynamic pairing engine)
  const recommendations = useMemo(() => {
    return getDynamicRecommendations(dish, menuData, lang as 'en' | 'ar');
  }, [dish, lang]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-xl overflow-y-auto no-scrollbar"
    >
      {/* Top Header / Close */}
      <div className="sticky top-0 z-10 flex justify-between items-center p-6 bg-gradient-to-b from-black to-transparent">
        <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="mono-tag !bg-gold/20 !text-gold">{dish.category}</div>
        <div className="w-12" />
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-32">
        {/* Large Swipable Photos (Simulated) */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="relative aspect-[4/5] rounded-[3rem] overflow-hidden mb-12 shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
        >
          <img src={image} alt={name} className="absolute inset-0 w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
          
          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
            <div className="flex gap-2.5">
              <div className="w-10 h-1 rounded-full bg-gold shadow-[0_0_15px_rgba(226,183,20,0.8)]" />
              <div className="w-2.5 h-1 rounded-full bg-white/20" />
              <div className="w-2.5 h-1 rounded-full bg-white/20" />
            </div>
            <span className="text-white/40 text-[9px] font-mono uppercase tracking-[0.3em] bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">Visual Presentation</span>
          </div>
        </motion.div>

        {/* Info Section */}
        <div className="space-y-12">
          <div className="space-y-4">
            <div className="flex justify-between items-baseline gap-6">
              <h2 className="text-5xl font-serif text-white tracking-tight leading-tight">{name}</h2>
              <div className="flex flex-col items-end">
                <span className="text-3xl text-gold font-serif drop-shadow-[0_0_20px_rgba(226,183,20,0.3)]">{dish.price}</span>
                <span className="text-white/20 text-[10px] uppercase tracking-widest mt-1">VAT Included</span>
              </div>
            </div>

            <p className="text-2xl text-white/70 font-serif italic leading-relaxed max-w-xl">
              &quot;{desc}&quot;
            </p>
          </div>

          {/* Core Traits */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 space-y-2">
              <span className="text-gold/40 text-[9px] uppercase tracking-[0.3em] font-bold block">Flavor Profile</span>
              <p className="text-white text-sm font-serif">{dish.tags.includes('Spicy') ? 'Spicy & Vibrant' : 'Balanced & Umami'}</p>
            </div>
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 space-y-2">
              <span className="text-gold/40 text-[9px] uppercase tracking-[0.3em] font-bold block">Chef Recommendation</span>
              <p className="text-white text-sm font-serif">{dish.tags.includes('Signature') ? 'A House Special' : 'Seasonal Favorite'}</p>
            </div>
          </div>

          {/* Details Tabs */}
          <div className="pt-12 border-t border-white/5 space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-8 h-px bg-gold/30" />
                <h4 className="text-gold text-[10px] uppercase tracking-[0.5em] font-bold">Provenance & Integrity</h4>
              </div>
              
              <div className="flex flex-wrap gap-4">
                {dish.tags.map(tag => (
                  <span key={tag} className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] text-white/50 uppercase tracking-[0.2em] font-bold">
                    {tag}
                  </span>
                ))}
                {dish.calories && (
                  <span className="px-5 py-2 rounded-full bg-gold/10 border border-gold/20 text-[9px] text-gold uppercase tracking-[0.2em] font-bold">
                    🔥 {dish.calories}
                  </span>
                )}
              </div>

              <p className="text-white/40 text-sm leading-relaxed font-serif italic max-w-lg">
                Sourced with respect for the ocean and the season. Prepared with the precision of a master&apos;s blade.
              </p>
              
              <div className="flex gap-8 pt-4">
                <div className="flex flex-col items-center gap-2 group cursor-help">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-2xl group-hover:border-gold/40 group-hover:bg-gold/5 transition-all duration-500">🌾</div>
                  <span className="text-[8px] uppercase tracking-widest text-white/20 group-hover:text-white/40">Gluten</span>
                </div>
                <div className="flex flex-col items-center gap-2 group cursor-help">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-2xl group-hover:border-gold/40 group-hover:bg-gold/5 transition-all duration-500">🥜</div>
                  <span className="text-[8px] uppercase tracking-widest text-white/20 group-hover:text-white/40">Nuts</span>
                </div>
                <div className="flex flex-col items-center gap-2 group cursor-help">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-2xl group-hover:border-gold/40 group-hover:bg-gold/5 transition-all duration-500">🦐</div>
                  <span className="text-[8px] uppercase tracking-widest text-white/20 group-hover:text-white/40">Shellfish</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="pt-16 space-y-8">
            <h4 className="text-white text-lg font-serif italic">{lang === 'ar' ? 'نقترح عليك تجربته مع...' : 'Recommended to pair with...'}</h4>
            <div className="grid grid-cols-1 gap-4">
              {recommendations.map(rec => (
                <div 
                  key={rec.dish.id} 
                  onClick={() => {
                    onClose();
                    // Small timeout to allow the modal to close before reopening with the new dish
                    setTimeout(() => {
                      (window as any).dispatchDishSelect?.(rec.dish);
                    }, 100);
                  }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-gold/[0.02] hover:border-gold/20 transition-all group cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                    <img 
                      src={rec.dish.image || CAT_IMAGES[rec.dish.category] || DEFAULT_IMAGE} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-white font-serif truncate group-hover:text-gold transition-colors">{lang === 'ar' ? rec.dish.nameAr || rec.dish.name : rec.dish.name}</h5>
                    <p className="text-gold/60 text-[10px] uppercase tracking-wider mt-0.5 line-clamp-1 italic">{rec.reason}</p>
                    <span className="text-white/40 text-xs mt-1 block">{rec.dish.price}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
    <div className="min-h-screen bg-bg pt-12 pb-32">
      {/* Category Slider */}
      <div className="mb-12">
        <div className="px-6 mb-6">
          <h2 className="text-white/40 text-[10px] uppercase tracking-[0.5em] font-bold">Categories</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-4">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex-shrink-0 w-32 h-44 rounded-2xl overflow-hidden group shadow-2xl transition-shadow duration-500 hover:shadow-gold/10"
            >
              <motion.img 
                layoutId={`img-${cat}`}
                src={CAT_IMAGES[cat] || DEFAULT_IMAGE} 
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                  selectedCategory === cat ? 'scale-110 blur-0' : 'scale-100 opacity-30 blur-[2px] group-hover:opacity-60 group-hover:blur-0'
                }`} 
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent ${
                selectedCategory === cat ? 'opacity-90' : 'opacity-60'
              }`} />
              
              <div className="absolute inset-0 p-4 flex flex-col justify-end items-center text-center">
                <span className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-500 font-mono ${
                  selectedCategory === cat ? 'text-gold scale-110 drop-shadow-[0_0_10px_rgba(226,183,20,0.5)]' : 'text-white/40'
                }`}>
                  {cat}
                </span>
                {selectedCategory === cat && (
                  <motion.div 
                    layoutId="catActive" 
                    className="w-12 h-0.5 rounded-full bg-gold mt-2 shadow-[0_0_15px_rgba(226,183,20,0.8)]" 
                  />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className={`px-6 space-y-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
        <div className={`flex justify-between items-baseline mb-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <h3 className="text-white text-3xl font-serif">{selectedCategory}</h3>
          <span className="text-white/20 text-xs font-mono">{filteredDishes.length} Items</span>
        </div>

        {/* Dietary Filters */}
        <div className={`flex flex-wrap gap-2 mb-8 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          {[
            { id: 'Vegetarian', label: lang === 'ar' ? 'نباتي' : 'Vegetarian', icon: '🍃' },
            { id: 'Spicy', label: lang === 'ar' ? 'حار' : 'Spicy', icon: '🌶️' },
            { id: 'Best Seller', label: lang === 'ar' ? 'الأكثر مبيعاً' : 'Best Seller', icon: '⭐' },
          ].map((filter) => (
            <motion.button
              key={filter.id}
              onClick={() => toggleFilter(filter.id)}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
                activeFilters.includes(filter.id)
                  ? 'bg-gold border-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-gold/30'
              }`}
            >
              <span className="text-xs">{filter.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{filter.label}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 gap-4"
          >
            {filteredDishes.length > 0 ? (
              filteredDishes.map((dish, idx) => (
                <motion.div
                  key={dish.id}
                  onClick={() => setSelectedDish(dish)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.05, ease: [0.19, 1, 0.22, 1] }}
                  whileHover={{ scale: 1.02, x: lang === 'ar' ? -8 : 8 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative flex items-center gap-4 p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-gold/30 hover:bg-gold/[0.03] transition-all duration-500 cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-white/5">
                    <img 
                      src={dish.image || CAT_IMAGES[dish.category] || DEFAULT_IMAGE} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-white font-serif text-lg group-hover:text-gold transition-all duration-500 truncate">
                        {lang === 'ar' ? dish.nameAr || dish.name : dish.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-gold font-serif text-lg tracking-tight">{dish.price}</span>
                        <div className="w-1 h-1 rounded-full bg-gold/0 group-hover:bg-gold transition-all duration-500 shadow-[0_0_10px_rgba(226,183,20,1)]" />
                      </div>
                    </div>
                    <p className="text-white/30 text-[11px] font-serif italic mt-1 line-clamp-2 leading-relaxed group-hover:text-white/50 transition-colors">
                      {lang === 'ar' ? dish.descriptionAr || dish.description : dish.description}
                    </p>
                    <div className="flex gap-2 mt-3">
                      {dish.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[8px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 group-hover:border-gold/20 group-hover:text-gold/60 transition-all">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center space-y-4"
              >
                <div className="text-4xl">🍽️</div>
                <p className="text-white/40 font-serif italic">
                  {lang === 'ar' 
                    ? 'لا توجد أطباق تطابق هذه الفلاتر في هذه الفئة.' 
                    : 'No dishes match these filters in this category.'}
                </p>
                <button 
                  onClick={() => setActiveFilters([])}
                  className="text-gold text-xs uppercase tracking-widest border-b border-gold/30 pb-1"
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
