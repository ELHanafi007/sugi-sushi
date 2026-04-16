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
          transition={{ delay: 0.2 }}
          className="relative aspect-[4/5] rounded-[3rem] overflow-hidden mb-12 shadow-2xl"
        >
          <img src={image} alt={name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
            <div className="flex gap-2">
              <div className="w-8 h-1 rounded-full bg-white" />
              <div className="w-2 h-1 rounded-full bg-white/30" />
              <div className="w-2 h-1 rounded-full bg-white/30" />
            </div>
            <span className="text-white/60 text-xs font-mono uppercase tracking-widest">Swipe for more</span>
          </div>
        </motion.div>

        {/* Info Section */}
        <div className="space-y-8">
          <div className="flex justify-between items-start gap-4">
            <h2 className="text-4xl font-serif text-white tracking-tight">{name}</h2>
            <span className="text-3xl text-gold font-serif whitespace-nowrap">{dish.price}</span>
          </div>

          <p className="text-xl text-white/60 font-serif italic leading-relaxed">
            {desc}
          </p>

          {/* Tags / Badges */}
          <div className="flex flex-wrap gap-3">
            {dish.tags.map(tag => (
              <span key={tag} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/40 uppercase tracking-widest">
                {tag}
              </span>
            ))}
            {dish.calories && (
              <span className="px-4 py-1.5 rounded-full bg-gold/5 border border-gold/20 text-[10px] text-gold/60 uppercase tracking-widest">
                🔥 {dish.calories}
              </span>
            )}
          </div>

          {/* Details Tabs */}
          <div className="pt-8 border-t border-white/5 space-y-8">
            <div className="space-y-4">
              <h4 className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold">Ingredients & Allergens</h4>
              <p className="text-white/40 text-sm leading-relaxed">
                Premium selected {dish.category.toLowerCase()} ingredients. May contain: soy, nuts, gluten, or seafood. Please notify your server of any allergies.
              </p>
              <div className="flex gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                <span className="text-2xl" title="Gluten Free">🌾</span>
                <span className="text-2xl" title="Nuts">🥜</span>
                <span className="text-2xl" title="Shellfish">🦐</span>
                <span className="text-2xl" title="Soy">🫘</span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="pt-16 space-y-8">
            <h4 className="text-white text-lg font-serif italic">{lang === 'ar' ? 'نقترح عليك تجربته مع...' : 'Recommended to pair with...'}</h4>
            <div className="grid grid-cols-1 gap-4">
              {recommendations.map(rec => (
                <div key={rec.dish.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-gold/[0.02] hover:border-gold/20 transition-all group">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                    <img 
                      src={rec.dish.image || CAT_IMAGES[rec.dish.category] || DEFAULT_IMAGE} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-white font-serif truncate">{lang === 'ar' ? rec.dish.nameAr || rec.dish.name : rec.dish.name}</h5>
                    <p className="text-gold/60 text-[10px] uppercase tracking-wider mt-0.5 line-clamp-1 italic">{rec.reason}</p>
                    <span className="text-white/40 text-xs mt-1 block">{rec.dish.price}</span>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                  </button>
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
export default function StrictMenu() {
  const { lang, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
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
                <span className={`text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                  selectedCategory === cat ? 'text-gold scale-110' : 'text-white/60'
                }`}>
                  {cat}
                </span>
                {selectedCategory === cat && (
                  <motion.div layoutId="catActive" className="w-1 h-1 rounded-full bg-gold mt-2" />
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
                      <h4 className="text-white font-serif text-lg group-hover:text-gold transition-colors truncate">
                        {lang === 'ar' ? dish.nameAr || dish.name : dish.name}
                      </h4>
                      <span className="text-gold font-serif ml-2">{dish.price}</span>
                    </div>
                    <p className="text-white/30 text-xs font-serif italic mt-1 line-clamp-1">
                      {lang === 'ar' ? dish.descriptionAr || dish.description : dish.description}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {dish.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[8px] uppercase tracking-tighter px-2 py-0.5 rounded-md bg-white/5 text-white/40">
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
