'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { menuData, CATEGORIES, Dish } from '@/data/menuData';
import { getDynamicRecommendations } from '@/utils/recommendationEngine';
import Image from 'next/image';

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

const CAT_IMAGES: Record<string, string> = {
  'Salads': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
  'Soups': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80',
  'Starters': 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
  'Wok, Noodles & Rice': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80',
  'Tempura': 'https://images.unsplash.com/photo-1569050278883-d5c58c39bb7a?auto=format&fit=crop&w=1200&q=80',
  'Sugi Dishes': 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=80',
  'Sashimi': 'https://images.unsplash.com/photo-1534256958597-7feec80116e7?auto=format&fit=crop&w=1200&q=80',
  'Tataki': 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&w=1200&q=80',
  'Ceviche': 'https://images.unsplash.com/photo-1534604973900-c41ab4c5e636?auto=format&fit=crop&w=1200&q=80',
  'Nigiri': 'https://images.unsplash.com/photo-1611712142469-e39736310f21?auto=format&fit=crop&w=1200&q=80',
  'Maki Rolls': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=1200&q=80',
  'Special Rolls': 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=80',
  'Fried Rolls': 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=1200&q=80',
  'Desserts': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1200&q=80',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=80';

/* ─── Dish Modal (Masterpiece Edition) ─── */
function DishModal({ 
  dish, 
  onClose, 
  onDishSelect, 
  onCategorySelect,
  menuDataToUse,
  categoriesToUse
}: { 
  dish: Dish; 
  onClose: () => void;
  onDishSelect: (dish: Dish) => void;
  onCategorySelect: (cat: string) => void;
  menuDataToUse: Dish[];
  categoriesToUse: string[];
}) {
  const { lang, t } = useLanguage();
  const name = lang === 'ar' ? dish.nameAr || dish.name : dish.name;
  const desc = lang === 'ar' ? dish.descriptionAr || dish.description : dish.description;
  const image = dish.image || CAT_IMAGES[dish.category] || DEFAULT_IMAGE;

  const recommendations = useMemo(() => {
    return getDynamicRecommendations(dish, menuDataToUse, lang as 'en' | 'ar');
  }, [dish, lang, menuDataToUse]);

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
      scrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [dish.id]);

  return (
    <motion.div 
      ref={scrollRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[20000] modal-glass overflow-y-auto no-scrollbar"
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
             <span className="text-gold/60 text-xs md:text-sm uppercase tracking-[0.2em] font-black font-mono">{t(`menu.cat.${dish.category}`)}</span>
             <div className="w-12 h-[1px] bg-gold/20 mt-2" />
          </div>
          <div className="w-12" />
        </div>

        <div className="max-w-2xl mx-auto px-6 pb-40">

          {/* Cinematic Hero Image */}
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
            className="relative w-full h-[50vh] md:h-[65vh] rounded-[2.5rem] overflow-hidden mb-10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] luxury-card"
          >
            <img
              src={image}
              alt={name}
              loading="eager"
              className="w-full h-full object-cover transition-transform duration-[10s] hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,black_100%)] opacity-30" />
            {/* Dish name overlay at bottom of image */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className="text-mono text-white/30 text-[9px] tracking-[0.8em] font-black uppercase block mb-2">{t('menu.featured')}</span>
              <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tightest leading-tight italic">{name}</h2>
            </div>
          </motion.div>

          {/* Editorial Content */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="space-y-12"
          >
            {/* Price + Description */}
            <div className="flex justify-between items-center gap-6">
              <span className="text-4xl text-gold font-serif font-light">{dish.price}</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            <p className="text-xl md:text-2xl text-white/40 font-serif italic leading-relaxed font-light">
              &quot;{desc}&quot;
            </p>

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

            {/* ─── More from This Category ─── */}
            <div className="pt-16 space-y-8">
              <div className="flex items-center justify-between">
                 <h4 className="text-white/60 text-xl font-serif italic">{t('strict.more_from')} {t(`menu.cat.${dish.category}`)}</h4>
                 <div className="h-px flex-1 bg-white/5 mx-6" />
                 <span className="text-gold/40 text-[9px] uppercase tracking-widest font-mono">{menuDataToUse.filter(d => d.category === dish.category && d.id !== dish.id).length} {t('menu.selections')}</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {menuDataToUse
                  .filter(d => d.category === dish.category && d.id !== dish.id)
                  .slice(0, 6)
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
                        <p className="text-white/20 text-[11px] font-serif italic line-clamp-1 mt-1">{lang === 'ar' ? item.descriptionAr || item.description : item.description}</p>
                        <p className="text-gold/30 text-[9px] uppercase tracking-widest mt-1 font-mono">{item.price}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-white/10 group-hover:border-gold/30 group-hover:text-gold transition-all duration-700">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m9 18 6-6-6-6"/></svg>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>

            {/* ─── Cross-Category Discovery: Two-Row Slider ─── */}
            <div className="pt-16 space-y-10 overflow-hidden -mx-6">
              <div className="px-6 flex items-center justify-between">
                 <h4 className="text-white/60 text-xl font-serif italic">{t('menu.discovery_title')}</h4>
                 <div className="h-px flex-1 bg-white/5 mx-6" />
              </div>

              <div className="space-y-6">
                {/* Row 1 */}
                <motion.div 
                  className="flex gap-4 px-6 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing"
                  drag="x"
                  dragConstraints={{ right: 0, left: -1000 }} // Approximate constraint, will be responsive
                >
                  {categoriesToUse.slice(0, Math.ceil(categoriesToUse.length / 2)).map((cat) => (
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
                        <span className="text-white text-xs md:text-sm font-serif italic text-center leading-tight">{cat}</span>
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
                  {categoriesToUse.slice(Math.ceil(categoriesToUse.length / 2)).map((cat) => (
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
                        <span className="text-white text-xs md:text-sm font-serif italic text-center leading-tight">{cat}</span>
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
export default function StrictMenu({ 
  onTabChange,
  initialMenuData,
  initialCategories
}: { 
  onTabChange?: (tab: any) => void;
  initialMenuData?: Dish[];
  initialCategories?: string[];
}) {
  const { lang, t, pendingDish, setPendingDish } = useLanguage();
  
  // Use props if provided, otherwise fallback to static data
  const menuDataToUse = initialMenuData || menuData;
  const categoriesToUse = initialCategories || CATEGORIES;

  const [selectedCategory, setSelectedCategory] = useState(categoriesToUse[0]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Portal logic
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    (window as any).dispatchDishSelect = (dish: Dish) => setSelectedDish(dish);
    
    // Check for pending dish from other pages
    if (pendingDish) {
      setSelectedDish(pendingDish);
      setSelectedCategory(pendingDish.category);
      setPendingDish(null);
    }

    return () => { delete (window as any).dispatchDishSelect; };
  }, [pendingDish, setPendingDish]);

  const filteredDishes = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) {
      // Standard Category Mode
      let dishes = menuDataToUse.filter(dish => dish.category === selectedCategory);
      if (activeFilters.length > 0) {
        dishes = dishes.filter(dish => activeFilters.every(filter => dish.tags.includes(filter)));
      }
      return dishes;
    }

    // Dynamic Search Mode (Global across all categories)
    return menuDataToUse.filter(dish => {
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
  }, [selectedCategory, activeFilters, searchQuery, menuDataToUse]);

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]);
  };

  return (
    <div className="min-h-screen bg-bg pt-48 pb-[120px]">
      {/* Masterpiece Header Orchestration */}
      <div className="px-8 mb-16 relative">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6 mb-8"
        >
          <div className="w-16 h-px bg-gold/40" />
          <span className="text-mono text-gold/50 text-[10px] tracking-[1em] font-black uppercase">{t('menu.archive')}</span>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 30, filter: 'blur(20px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.2, duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
              className="text-white text-6xl md:text-8xl lg:text-9xl font-serif font-light mb-8 tracking-tightest leading-[0.85] italic"
            >
              {t('menu.exp_title')} <span className="shimmer-gold not-italic !font-black">{t('menu.discovery_title')}</span>
            </motion.h1>
            <div className="flex items-center gap-4">
               <span className="text-white/15 text-[9px] font-mono uppercase tracking-[0.6em] font-black">
                 {menuDataToUse.length} {t('menu.selected_count')}
               </span>
               <div className="w-2 h-2 rounded-full bg-gold/40 animate-pulse shadow-[0_0_20px_rgba(212,175,55,0.4)]" />
            </div>
          </div>

          {/* Masterpiece Search Trigger */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <button 
              onClick={() => { /* Open Search Overlay logic */ }}
              className="flex items-center gap-6 px-8 py-5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-2xl group hover:border-gold/30 transition-all duration-700 shadow-2xl"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold/40 group-hover:text-gold group-hover:scale-110 transition-all duration-700">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              <input
                type="text"
                placeholder={t('menu.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-white text-xs font-serif italic placeholder:text-white/10 focus:outline-none w-48 lg:w-64"
              />
            </button>
          </motion.div>
        </div>
      </div>

      {/* High-End Category Slider */}
      <div className="mb-24">
        <div className="flex gap-6 overflow-x-auto no-scrollbar px-8 pb-10">
          {categoriesToUse.map((cat, idx) => {
            const isActive = selectedCategory === cat;
            return (
              <motion.button
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 1 }}
                onClick={() => { setSelectedCategory(cat); setActiveFilters([]); }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex-shrink-0 w-36 h-56 rounded-[3rem] overflow-hidden group transition-all duration-1000 ${
                  isActive ? 'shadow-[0_30px_60px_rgba(0,0,0,0.6)]' : 'hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)]'
                }`}
              >
                <Image 
                  src={CAT_IMAGES[cat] || DEFAULT_IMAGE} 
                  alt={cat}
                  fill
                  sizes="150px"
                  className={`object-cover transition-all duration-1000 ${
                    isActive ? 'scale-110 brightness-[0.4] saturate-[1.5]' : 'brightness-[0.2] blur-[2px] group-hover:brightness-[0.3] group-hover:scale-105 group-hover:blur-0'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
                
                <div className="absolute inset-0 p-5 flex flex-col justify-end items-center text-center">
                  <AnimatePresence>
                    {isActive && (
                      <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="text-gold/40 font-serif text-2xl mb-2"
                      >
                        {KANJI[cat]}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <span className={`text-lg md:text-3xl font-serif italic transition-all duration-700 leading-none ${
                    isActive ? 'text-gold shimmer-gold' : 'text-white/60'
                  }`}>
                    {t(`menu.cat.${cat}`)}
                  </span>
                  {isActive && (
                    <motion.div 
                      layoutId="catLineMaster" 
                      className="w-12 h-[1px] bg-gold mt-4 shadow-[0_0_15px_rgba(212,175,55,1)]" 
                    />
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
              ? t('strict.results')
              : t(`menu.cat.${selectedCategory}`)
            }
          </motion.h3>
        </AnimatePresence>
        <div className="h-[1px] flex-1 bg-white/5 mx-6" />
        <span className="text-mono text-white/10 text-[10px] font-black">{filteredDishes.length} {t('menu.selections')}</span>
        </div>

        <div className="flex flex-wrap gap-3">
        {[
          { 
            id: 'Vegetarian', 
            label: t('filter.vegetarian'), 
            icon: (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
            )
          },
          { 
            id: 'Spicy', 
            label: t('filter.spicy'), 
            icon: (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
              </svg>
            )
          },
          { 
            id: 'Best Seller', 
            label: t('filter.bestseller'), 
            icon: (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            )
          },
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
              <span className={activeFilters.includes(filter.id) ? 'text-black' : 'text-gold/50'}>{filter.icon}</span>
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
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 1 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative flex items-center gap-6 p-6 rounded-[2.5rem] luxury-card dish-card-tap cursor-pointer overflow-hidden z-20"
                >
                  <div className="w-24 h-24 rounded-3xl overflow-hidden flex-shrink-0 bg-white/[0.04] shadow-2xl">
                    <Image 
                      src={dish.image || CAT_IMAGES[dish.category] || DEFAULT_IMAGE} 
                      alt={dish.name} 
                      width={96} 
                      height={96} 
                      sizes="96px"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" 
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-2">
                      <h4 className="text-white font-serif text-2xl group-hover:text-gold transition-colors duration-700 truncate tracking-tight">{lang === 'ar' ? dish.nameAr || dish.name : dish.name}</h4>
                      <span className="text-gold font-serif text-2xl flex-shrink-0 font-light">{dish.price}</span>
                    </div>
                    <p className="text-white/30 text-sm font-serif italic line-clamp-1 group-hover:text-white/60 transition-colors duration-700">{lang === 'ar' ? dish.descriptionAr || dish.description : dish.description}</p>
                    
                    <div className="flex items-center gap-4 mt-4">
                      {dish.tags.slice(0, 1).map(tag => (
                        <span key={tag} className="mono-tag !py-1 !px-4 !text-[7px] !bg-gold/5 !border-gold/10 !text-gold/60">{tag}</span>
                      ))}
                      <div className="h-px flex-1 bg-white/[0.03] group-hover:bg-gold/20 transition-all duration-1000" />
                    </div>
                  </div>

                  <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-white/10 group-hover:border-gold/30 group-hover:text-gold group-hover:bg-gold/5 transition-all duration-700">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m9 18 6-6-6-6"/></svg>
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
            menuDataToUse={menuDataToUse}
            categoriesToUse={categoriesToUse}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
