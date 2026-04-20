'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { menuData, CATEGORIES, Dish } from '@/data/menuData';
import { getDynamicRecommendations } from '@/utils/recommendationEngine';
import Image from 'next/image';

/* ─── Category Imagery (Masterpiece Selection) ─── */
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
  'Maki Rolls': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80',
  'Special Rolls': 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=80',
  'Fried Rolls': 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=1200&q=80',
  'Desserts': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=80',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=80';

/* ─── Dish Modal (Masterpiece Edition) ─── */
function DishModal({ 
  dish, 
  onClose, 
  onDishSelect, 
  onCategorySelect 
}: { 
  dish: Dish; 
  onClose: () => void;
  onDishSelect: (dish: Dish) => void;
  onCategorySelect: (cat: string) => void;
}) {
  const { lang, t } = useLanguage();
  const name = lang === 'ar' ? dish.nameAr || dish.name : dish.name;
  const desc = lang === 'ar' ? dish.descriptionAr || dish.description : dish.description;
  const image = dish.image || CAT_IMAGES[dish.category] || DEFAULT_IMAGE;

  const recommendations = useMemo(() => {
    return getDynamicRecommendations(dish, menuData, lang as 'en' | 'ar');
  }, [dish, lang]);

  const mapAllergen = (a: string) => {
    const map: Record<string, { en: string, ar: string }> = {
      'Shellfish': { en: 'Shellfish', ar: 'محار' },
      'Nuts': { en: 'Nuts', ar: 'مكسرات' },
      'Soy': { en: 'Soy', ar: 'صويا' },
      'Gluten': { en: 'Gluten', ar: 'غلوتين' },
      'Egg': { en: 'Egg', ar: 'بيض' },
      'Fish': { en: 'Fish', ar: 'سمك' },
      'Dairy': { en: 'Dairy', ar: 'ألبان' },
      'Sesame': { en: 'Sesame', ar: 'سمسم' },
      'Peanuts': { en: 'Peanuts', ar: 'فول سوداني' },
    };
    return map[a] ? (lang === 'ar' ? map[a].ar : map[a].en) : a;
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [dish.id]);

  return (
    <motion.div 
      ref={scrollRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[300] bg-black/98 backdrop-blur-3xl overflow-y-auto no-scrollbar"
      style={{ willChange: "opacity" }}
      onClick={onClose}
    >
      <div className="min-h-screen" onClick={e => e.stopPropagation()}>
        {/* Navigation Bar */}
        <div className="sticky top-0 z-50 flex justify-between items-center p-6 md:p-10 bg-gradient-to-b from-black via-black/40 to-transparent">
          <motion.button 
            onClick={onClose} 
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-gold hover:border-gold/20 transition-all duration-500"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m15 18-6-6 6-6"/></svg>
          </motion.button>
          <div className="flex flex-col items-center">
             <span className="text-mono text-gold/30 text-[9px] uppercase tracking-[0.5em] font-black">{dish.category}</span>
             <div className="w-12 h-[1px] bg-gold/20 mt-2" />
          </div>
          <div className="w-12" />
        </div>

        <div className="max-w-2xl mx-auto px-6 pb-40">
          {/* Cinematic Hero */}
          <motion.div 
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
            className="relative aspect-[3/4] rounded-[3.5rem] overflow-hidden mb-12 shadow-[0_50px_100px_rgba(0,0,0,0.8)] luxury-card"
          >
            <Image 
              src={image} 
              alt={name} 
              fill 
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover transition-transform duration-[10s] hover:scale-110" 
              priority 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-90" />
            
            {/* Focal Light */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,black_100%)] opacity-40" />
          </motion.div>

          {/* Editorial Content */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="space-y-12"
          >
            {/* Branding Row */}
            <div className="flex justify-between items-end gap-6">
              <div className="flex flex-col gap-2">
                 <span className="text-mono text-white/20 text-[10px] tracking-[0.8em] font-black uppercase">Signature Selection</span>
                 <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tightest leading-tight italic">{name}</h2>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-4xl text-gold font-serif font-light">{dish.price}</span>
                <span className="text-mono text-gold/30 text-[9px] uppercase tracking-widest mt-1">SR</span>
              </div>
            </div>

            <p className="text-xl md:text-2xl text-white/40 font-serif italic leading-relaxed font-light">
              &quot;{desc}&quot;
            </p>

            {/* Technical Detail Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="luxury-card rounded-3xl p-8 space-y-4">
                <span className="text-gold/40 text-[9px] uppercase tracking-[0.4em] font-black font-mono block">{t('strict.flavor')}</span>
                <p className="text-white/70 text-lg font-serif italic">{dish.tags.includes('Spicy') ? t('strict.spicy') : t('strict.umami')}</p>
              </div>
              <div className="luxury-card rounded-3xl p-8 space-y-4">
                <span className="text-gold/40 text-[9px] uppercase tracking-[0.4em] font-black font-mono block">{t('strict.note')}</span>
                <p className="text-white/70 text-lg font-serif italic">{dish.tags.includes('Signature') ? t('strict.special') : t('strict.seasonal')}</p>
              </div>
            </div>

            {/* The Source */}
            <div className="pt-12 border-t border-white/[0.03] space-y-12">
              {/* Allergens Orchestration */}
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-[1px] bg-gold/20" />
                  <h4 className="text-gold/30 text-[10px] uppercase tracking-[0.6em] font-black font-mono">{t('strict.allergens')}</h4>
                </div>
                <div className="flex flex-wrap gap-3">
                  {dish.allergens && dish.allergens.length > 0 ? (
                    dish.allergens.map(allergen => (
                      <span key={allergen} className="px-5 py-2 rounded-xl bg-red-500/5 border border-red-500/10 text-[9px] text-red-400/60 uppercase tracking-[0.2em] font-black font-mono flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-red-400/40" />
                        {mapAllergen(allergen)}
                      </span>
                    ))
                  ) : (
                    <span className="text-white/10 text-[10px] font-serif italic">{t('strict.no_allergens')}</span>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-[1px] bg-gold/20" />
                  <h4 className="text-gold/30 text-[10px] uppercase tracking-[0.6em] font-black font-mono">{t('strict.details')}</h4>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {dish.tags.map(tag => (
                    <span key={tag} className="px-6 py-2 rounded-full bg-white/[0.02] border border-white/[0.05] text-[10px] text-white/30 uppercase tracking-[0.2em] font-black font-mono">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-white/20 text-base leading-relaxed font-serif italic font-light">
                  {t('strict.sourced')}
                </p>
              </div>
            </div>

            {/* ─── Chef's Curated Recommendations ─── */}
            <div className="pt-16 space-y-10">
              <div className="flex items-center justify-between">
                 <h4 className="text-white/60 text-xl font-serif italic">{t('strict.recommendations')}</h4>
                 <div className="h-px flex-1 bg-white/5 mx-6" />
                 <span className="text-gold/40 text-[9px] uppercase tracking-widest font-mono">{t('strict.pairs_vibe')}</span>
              </div>
              <div className="grid grid-cols-1 gap-5">
                {recommendations.map(({ dish: item, reason }) => (
                  <motion.div 
                    key={item.id}
                    onClick={() => onDishSelect(item)}
                    whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.02)' }}
                    className="flex flex-col p-8 rounded-[2.5rem] luxury-card cursor-pointer group transition-all duration-700 relative overflow-hidden"
                  >
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-white/[0.04]">
                        <Image 
                          src={item.image || CAT_IMAGES[item.category] || DEFAULT_IMAGE}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-baseline mb-2">
                          <h5 className="text-white/80 font-serif text-xl group-hover:text-gold transition-colors duration-500">
                            {lang === 'ar' ? item.nameAr || item.name : item.name}
                          </h5>
                          <span className="text-gold/40 font-serif text-lg">{item.price} SR</span>
                        </div>
                        <p className="text-white/20 text-[11px] font-serif italic line-clamp-1">{lang === 'ar' ? item.descriptionAr || item.description : item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pt-5 border-t border-white/[0.03]">
                       <div className="w-2 h-2 rounded-full bg-gold/40 animate-pulse" />
                       <p className="text-white/40 text-[11px] font-serif italic leading-relaxed">
                        {reason}
                       </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ─── Same Category Exploration ─── */}
            <div className="pt-16 space-y-8">
              <div className="flex items-center justify-between">
                 <h4 className="text-white/60 text-xl font-serif italic">{lang === 'ar' ? 'المزيد من ' + dish.category : 'More from ' + dish.category}</h4>
                 <div className="h-px flex-1 bg-white/5 mx-6" />
              </div>
              <div className="grid grid-cols-1 gap-4">
                {menuData
                  .filter(d => d.category === dish.category && d.id !== dish.id)
                  .slice(0, 3)
                  .map((item) => (
                    <motion.div 
                      key={item.id}
                      onClick={() => onDishSelect(item)}
                      whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.02)' }}
                      className="flex items-center gap-5 p-4 rounded-3xl luxury-card cursor-pointer group transition-all duration-700"
                    >
                      <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-white/[0.04]">
                        <Image 
                          src={item.image || CAT_IMAGES[item.category] || DEFAULT_IMAGE}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                        />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-white/80 font-serif text-lg group-hover:text-gold transition-colors">
                          {lang === 'ar' ? item.nameAr || item.name : item.name}
                        </h5>
                        <p className="text-gold/30 text-[9px] uppercase tracking-widest mt-1 font-mono">{item.price} SR</p>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>

            {/* ─── Cross-Category Discovery: Two-Row Slider ─── */}
            <div className="pt-16 space-y-10 overflow-hidden -mx-6">
              <div className="px-6 flex items-center justify-between">
                 <h4 className="text-white/60 text-xl font-serif italic">{lang === 'ar' ? 'استكشف المزيد' : 'Explore Collections'}</h4>
                 <div className="h-px flex-1 bg-white/5 mx-6" />
              </div>

              <div className="space-y-6">
                {/* Row 1 */}
                <motion.div 
                  className="flex gap-4 px-6 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing"
                  drag="x"
                  dragConstraints={{ right: 0, left: -1000 }} // Approximate constraint, will be responsive
                >
                  {CATEGORIES.slice(0, Math.ceil(CATEGORIES.length / 2)).map((cat) => (
                    <motion.button
                      key={cat}
                      onClick={() => { onCategorySelect(cat); onClose(); }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative flex-shrink-0 w-48 aspect-[16/10] rounded-2xl overflow-hidden group luxury-card border border-white/5"
                    >
                      <Image 
                        src={CAT_IMAGES[cat] || DEFAULT_IMAGE} 
                        alt={cat} 
                        fill 
                        sizes="200px"
                        className="object-cover brightness-[0.4] group-hover:scale-110 transition-transform duration-1000" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <span className="text-white text-[9px] font-black uppercase tracking-widest text-center leading-tight">{cat}</span>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>

                {/* Row 2 */}
                <motion.div 
                  className="flex gap-4 px-6 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing ml-12"
                  drag="x"
                  dragConstraints={{ right: 0, left: -1000 }}
                >
                  {CATEGORIES.slice(Math.ceil(CATEGORIES.length / 2)).map((cat) => (
                    <motion.button
                      key={cat}
                      onClick={() => { onCategorySelect(cat); onClose(); }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative flex-shrink-0 w-48 aspect-[16/10] rounded-2xl overflow-hidden group luxury-card border border-white/5"
                    >
                      <Image 
                        src={CAT_IMAGES[cat] || DEFAULT_IMAGE} 
                        alt={cat} 
                        fill 
                        sizes="200px"
                        className="object-cover brightness-[0.4] group-hover:scale-110 transition-transform duration-1000" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <span className="text-white text-[9px] font-black uppercase tracking-widest text-center leading-tight">{cat}</span>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Strict Menu Orchestrator ─── */
export default function StrictMenu({ onTabChange }: { onTabChange?: (tab: any) => void }) {
  const { lang, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    (window as any).dispatchDishSelect = (dish: Dish) => setSelectedDish(dish);
    return () => { delete (window as any).dispatchDishSelect; };
  }, []);

  const filteredDishes = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) {
      // Standard Category Mode
      let dishes = menuData.filter(dish => dish.category === selectedCategory);
      if (activeFilters.length > 0) {
        dishes = dishes.filter(dish => activeFilters.every(filter => dish.tags.includes(filter)));
      }
      return dishes;
    }

    // Dynamic Search Mode (Global across all categories)
    return menuData.filter(dish => {
      const nameMatch = dish.name.toLowerCase().includes(query) || (dish.nameAr && dish.nameAr.includes(query));
      const descMatch = dish.description.toLowerCase().includes(query) || (dish.descriptionAr && dish.descriptionAr.includes(query));
      const tagMatch = dish.tags.some(tag => tag.toLowerCase().includes(query));
      const categoryMatch = dish.category.toLowerCase().includes(query);
      
      const basicMatches = nameMatch || descMatch || tagMatch || categoryMatch;
      
      // If filters are active, they must also match
      if (activeFilters.length > 0) {
        return basicMatches && activeFilters.every(filter => dish.tags.includes(filter));
      }
      return basicMatches;
    });
  }, [selectedCategory, activeFilters, searchQuery]);

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]);
  };

  return (
    <div className="min-h-screen bg-bg pt-48 pb-[120px]">
      {/* Header Orchestration */}
      <div className="px-8 mb-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6 mb-6"
        >
          <div className="w-12 h-px bg-gold/40" />
          <span className="text-mono text-gold/30 text-[10px] tracking-[0.8em] font-black uppercase">Collections</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1.2 }}
          className="text-white text-5xl md:text-7xl font-serif font-light mb-6 tracking-tight leading-none italic"
        >
          {t('menu.title')}
        </motion.h1>
        <div className="flex items-center gap-4">
           <span className="text-white/10 text-[10px] font-mono uppercase tracking-[0.5em] font-black">
             {menuData.length} Items Available
           </span>
           <div className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,1)]" />
        </div>
      </div>

      {/* Cinematic Search Orchestration */}
      <div className="px-8 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative group max-w-xl"
        >
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/40 group-focus-within:text-gold transition-colors duration-500">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder={t('menu.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-white text-sm font-serif italic placeholder:text-white/10 focus:outline-none focus:border-gold/30 focus:bg-white/[0.04] transition-all duration-700 shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-6 flex items-center text-white/20 hover:text-white transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          )}
        </motion.div>
      </div>

      {/* High-End Category Slider */}
      <div className="mb-16">
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-8 pb-6">
          {CATEGORIES.map((cat, idx) => {
            const isActive = selectedCategory === cat;
            return (
              <motion.button
                key={cat}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => { setSelectedCategory(cat); setActiveFilters([]); }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex-shrink-0 w-32 h-48 rounded-[2.5rem] overflow-hidden group transition-all duration-700 ${
                  isActive ? 'shadow-[0_20px_40px_rgba(0,0,0,0.4)]' : ''
                }`}
              >
                <Image 
                  src={CAT_IMAGES[cat] || DEFAULT_IMAGE} 
                  alt={cat}
                  fill
                  sizes="128px"
                  className={`object-cover transition-all duration-1000 ${
                    isActive ? 'scale-110 brightness-[0.4] saturate-[1.5]' : 'brightness-[0.25] group-hover:brightness-[0.4]'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent" />
                
                <div className="absolute inset-0 p-4 flex flex-col justify-end items-center text-center">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-700 font-mono leading-tight ${
                    isActive ? 'text-gold' : 'text-white/30'
                  }`}>
                    {cat}
                  </span>
                  {isActive && (
                    <motion.div layoutId="catLine" className="w-6 h-[1px] bg-gold mt-3 shadow-[0_0_10px_rgba(212,175,55,1)]" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Filter Orchestration */}
      <div className="px-8 space-y-8">
        <div className="flex justify-between items-center">
          <AnimatePresence mode="wait">
            <motion.h3 
              key={searchQuery ? 'search' : selectedCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-white text-3xl font-serif italic font-light"
            >
              {searchQuery 
                ? (lang === 'ar' ? 'نتائج البحث' : 'Search Results') 
                : selectedCategory
              }
            </motion.h3>
          </AnimatePresence>
          <div className="h-[1px] flex-1 bg-white/5 mx-6" />
          <span className="text-mono text-white/10 text-[10px] font-black">{filteredDishes.length} SELECTIONS</span>
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            { id: 'Vegetarian', label: lang === 'ar' ? 'نباتي' : 'Vegetarian', icon: '🍃' },
            { id: 'Spicy', label: lang === 'ar' ? 'حار' : 'Spicy', icon: '🌶️' },
            { id: 'Best Seller', label: lang === 'ar' ? 'الأكثر مبيعاً' : 'Best Seller', icon: '⭐' },
          ].map((filter) => (
            <motion.button
              key={filter.id}
              onClick={() => toggleFilter(filter.id)}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all duration-700 ${
                activeFilters.includes(filter.id)
                  ? 'bg-gold border-gold text-black shadow-[0_10px_20px_rgba(212,175,55,0.2)]'
                  : 'bg-white/[0.02] border-white/[0.05] text-white/40 hover:border-gold/30'
              }`}
            >
              <span className="text-sm">{filter.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest font-mono">{filter.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Masterpiece List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory + activeFilters.join(',')}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="grid grid-cols-1 gap-4 pt-4"
          >
            {filteredDishes.length > 0 ? (
              filteredDishes.map((dish, idx) => (
                <motion.div
                  key={dish.id}
                  onClick={() => setSelectedDish(dish)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative flex items-center gap-5 p-5 rounded-3xl luxury-card cursor-pointer overflow-hidden"
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-white/[0.04]">
                    <Image 
                      src={dish.image || CAT_IMAGES[dish.category] || DEFAULT_IMAGE} 
                      alt={dish.name} 
                      width={80} 
                      height={80} 
                      sizes="80px"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-white font-serif text-xl group-hover:text-gold transition-colors duration-500 truncate">{lang === 'ar' ? dish.nameAr || dish.name : dish.name}</h4>
                      <span className="text-gold font-serif text-xl flex-shrink-0 font-medium">{dish.price} SR</span>
                    </div>
                    <p className="text-white/45 text-xs font-serif italic line-clamp-1 group-hover:text-white/65 transition-colors duration-500">{lang === 'ar' ? dish.descriptionAr || dish.description : dish.description}</p>
                    <div className="flex gap-2 mt-3">
                      {dish.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[8px] uppercase tracking-widest px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05] text-white/20 font-black font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-white/10 group-hover:border-gold/20 group-hover:text-gold transition-all duration-700">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-32 text-center">
                 <p className="text-white/20 font-serif italic text-xl">{t('menu.no_results')}</p>
                 {searchQuery && (
                   <button 
                     onClick={() => setSearchQuery('')}
                     className="mt-6 text-gold/60 text-[10px] uppercase tracking-[0.4em] font-black border-b border-gold/20 pb-1"
                   >
                     {t('strict.clear')}
                   </button>
                 )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedDish && (
          <DishModal 
            dish={selectedDish} 
            onClose={() => setSelectedDish(null)} 
            onDishSelect={setSelectedDish}
            onCategorySelect={setSelectedCategory}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
