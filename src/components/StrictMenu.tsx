'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { menuData, CATEGORIES, Dish } from '@/data/menuData';
import { getDynamicRecommendations } from '@/utils/recommendationEngine';
import Image from 'next/image';
import CurrencyPrice from '@/components/CurrencyPrice';
import { PortionSelector } from '@/components/PortionSelector';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=80';

/* Static fallback images per category — used when DB has no image */
const CAT_IMAGES: Record<string, string> = {
  'salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=75',
  'soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=75',
  'starters': 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=75',
  'wok & noodles': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=75',
  'tempura & fried': 'https://images.unsplash.com/photo-1569050278883-d5c58c39bb7a?auto=format&fit=crop&w=800&q=75',
  'sugi dishes': 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=75',
  'sashimi': 'https://images.unsplash.com/photo-1534256958597-7feec80116e7?auto=format&fit=crop&w=800&q=75',
  'tataki': 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&w=800&q=75',
  'ceviche': 'https://images.unsplash.com/photo-1534604973900-c41ab4c5e636?auto=format&fit=crop&w=800&q=75',
  'nigiri': 'https://images.unsplash.com/photo-1611712142469-e39736310f21?auto=format&fit=crop&w=800&q=75',
  'maki rolls': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=75',
  'aromaki rolls': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=75',
  'special rolls': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=75',
  'fry rolls': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=75',
  'boxes': 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?auto=format&fit=crop&w=800&q=75',
  'boats': 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?auto=format&fit=crop&w=800&q=75',
  'cold drinks': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=75',
  'fresh juices': 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=800&q=75',
  'hot drinks': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=75',
  'dessert': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=75',
  'extra sauce': 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=800&q=75',
};

/* ─── Dish Modal (Masterpiece Edition) ─── */
function DishModal({
  dish,
  onClose,
  onDishSelect,
  onCategorySelect,
  menuDataToUse,
  categoriesToUse,
  dynamicCategoryImages
}: { 
  dish: Dish; 
  onClose: () => void;
  onDishSelect: (dish: Dish) => void;
  onCategorySelect: (cat: string) => void;
  menuDataToUse: Dish[];
  categoriesToUse: string[];
  dynamicCategoryImages: Record<string, string>;
}) {
  const { lang, t } = useLanguage();
  const [selectedPortionIdx, setSelectedPortionIdx] = useState(0);

  // Set default portion to the cheapest one when dish changes
  useEffect(() => {
    if (dish.portions && dish.portions.length > 1) {
      let minPrice = Infinity;
      let minIdx = 0;
      dish.portions.forEach((p, i) => {
        const pPrice = parseInt(p.price) || 0;
        if (pPrice < minPrice) {
          minPrice = pPrice;
          minIdx = i;
        }
      });
      setSelectedPortionIdx(minIdx);
    } else {
      setSelectedPortionIdx(0);
    }
  }, [dish]);
  
  const name = lang === 'ar' ? dish.nameAr || dish.name : dish.name;
  const desc = lang === 'ar' ? dish.descriptionAr || dish.description : dish.description;
  const categoryKey = dish.category ? dish.category.toLowerCase() : '';
  const image = dish.image || dynamicCategoryImages[categoryKey] || CAT_IMAGES[categoryKey] || DEFAULT_IMAGE;

  const currentPrice = (dish.portions && dish.portions.length > 1) ? dish.portions[selectedPortionIdx].price : dish.price;

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

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [transitionDirection, setTransitionDirection] = useState(1);

  // Immediate scroll reset on dish change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [dish.id]);

  if (!mounted) return null;

  const contentVariants = {
    initial: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 40 : -40,
    }),
    animate: {
      opacity: 1,
      x: 0,
    },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? -30 : 30,
    }),
  };

  return createPortal(
    <motion.div 
      ref={scrollRef}
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[20000] modal-glass overflow-y-auto overscroll-contain no-scrollbar outline-none pb-20 touch-pan-y"
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

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={dish.id}
            custom={transitionDirection}
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className="max-w-2xl mx-auto px-4 md:px-6 pb-40"
          >
            <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mt-4 mb-2 md:hidden" />

          {/* Cinematic Hero Image */}
          <motion.div
            className="relative w-full h-[35vh] md:h-[65vh] rounded-2xl md:rounded-[2.5rem] overflow-hidden mb-8 shadow-[0_40px_80px_rgba(0,0,0,0.8)] luxury-card"
          >
            <Image
              src={image}
              alt={name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
              <span className="text-mono text-white/30 text-[9px] tracking-[0.8em] font-black uppercase block mb-2">{t('menu.featured')}</span>
              <h2 className="text-3xl md:text-6xl font-serif text-white tracking-tightest leading-tight italic">{name}</h2>
            </div>
          </motion.div>

          <div className="space-y-12">
            <div className="flex flex-col items-center gap-6 md:gap-10 pt-2 md:pt-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPrice}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center gap-1"
                >
                  <span className="text-gold/20 text-[8px] uppercase tracking-[1em] font-black">{t('menu.current_price')}</span>
                  <CurrencyPrice price={currentPrice} className="text-4xl md:text-7xl text-gold font-serif font-light" />
                </motion.div>
              </AnimatePresence>

              {dish.portions && dish.portions.length > 1 && (
                <div className="w-full flex flex-col items-center">
                   <div className="w-full h-px bg-white/5 mb-8" />
                   <PortionSelector 
                     portions={dish.portions} 
                     selectedIdx={selectedPortionIdx} 
                     onChange={setSelectedPortionIdx}
                     lang={lang as 'en' | 'ar'}
                   />
                   <div className="w-full h-px bg-white/5 mt-4" />
                </div>
              )}

            </div>

            <p className="text-base md:text-2xl text-white/40 font-serif italic leading-relaxed font-light text-center">&quot;{desc}&quot;</p>

            <div className="pt-8 md:pt-12 border-t border-white/[0.03] space-y-8 md:space-y-12">
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
                    <span key={tag} className="px-6 py-2 rounded-full bg-white/[0.02] border border-white/[0.05] text-[10px] text-white/30 uppercase tracking-[0.2em] font-black font-mono">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="pt-16 space-y-8">
               <div className="flex items-center justify-between">
                  <h4 className="text-white/60 text-xl font-serif italic">{t('strict.more_from')} {t(`menu.cat.${dish.category}`)}</h4>
                  <div className="h-px flex-1 bg-white/5 mx-6" />
               </div>
               <div className="grid grid-cols-1 gap-4">
                 {menuDataToUse.filter(d => d.category === dish.category && d.id !== dish.id).slice(0, 4).map((item) => (
                   <div key={item.id} onClick={() => onDishSelect(item)} className="flex items-center gap-5 p-4 rounded-3xl luxury-card cursor-pointer group">
                     <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-white/[0.04]">
                       <Image src={item.image || DEFAULT_IMAGE} alt={lang === 'ar' ? item.nameAr || item.name : item.name} fill sizes="64px" className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <h5 className="text-white/80 font-serif text-base group-hover:text-gold transition-colors">{lang === 'ar' ? item.nameAr || item.name : item.name}</h5>
                       <CurrencyPrice price={item.price} className="text-gold/40 text-[11px] font-mono mt-1" />
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>,
    document.body
  );
}

export default function StrictMenu({ 
  initialMenuData, 
  initialCategories, 
  initialCategoryData,
  onTabChange
}: { 
  initialMenuData: Dish[]; 
  initialCategories: string[]; 
  initialCategoryData: { name: string; image: string }[];
  onTabChange?: (tab: any) => void;
}) {
  const { lang, t, activeCategory, setActiveCategory } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(activeCategory || initialCategories[0]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  // Sync with global category if it changes
  useEffect(() => {
    if (activeCategory) {
      setSelectedCategory(activeCategory);
    }
  }, [activeCategory]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setActiveCategory(cat);
  };

  const menuDataToUse = initialMenuData;
  const categoriesToUse = initialCategories;

  const dynamicCategoryImages = useMemo(() => {
    const map: Record<string, string> = {};
    initialCategoryData.forEach(cat => {
      map[(cat.name || '').toLowerCase()] = cat.image;
    });
    return map;
  }, [initialCategoryData]);

  const filteredDishes = useMemo(() => {
    return menuDataToUse.filter(dish => {
      const matchesCategory = selectedCategory === 'All' || dish.category === selectedCategory;
      const matchesSearch = (dish.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (dish.nameAr || '').includes(searchQuery) ||
                          (dish.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const basicMatches = matchesCategory && matchesSearch;
      
      if (activeFilters.length > 0) {
        return basicMatches && activeFilters.every(f => dish.tags.includes(f));
      }
      return basicMatches;
    });
  }, [selectedCategory, searchQuery, activeFilters, menuDataToUse]);

  return (
    <div className="min-h-screen bg-bg pt-24 md:pt-48 pb-[120px]">
      <div className="px-4 md:px-8 mb-8 md:mb-16">
        <h1 className="text-white text-4xl md:text-7xl lg:text-8xl font-serif italic leading-tight">{t('menu.label')}</h1>
      </div>

      <div className="flex gap-4 md:gap-10 overflow-x-auto no-scrollbar px-4 md:px-8 mb-16 md:mb-24 pt-4">
        {categoriesToUse.map((cat, idx) => {
          const catLower = (cat || '').toLowerCase();
          const img = dynamicCategoryImages[catLower];
          const isActive = selectedCategory === cat;
          
          return (
            <button 
              key={cat} 
              onClick={() => handleCategorySelect(cat)} 
              className="flex flex-col items-center gap-5 flex-shrink-0 group relative"
            >
              <div className={`relative w-24 h-24 md:w-40 md:h-40 rounded-full overflow-hidden border transition-all duration-700 ${
                isActive ? 'border-gold scale-110 shadow-[0_0_40px_rgba(212,175,55,0.4)]' : 'border-white/10 group-hover:border-white/30'
              }`}>
                <Image
                  src={img || CAT_IMAGES[catLower] || DEFAULT_IMAGE}
                  alt={cat}
                  fill
                  sizes="(max-width: 768px) 96px, 160px"
                  priority={idx < 6}
                  className={`object-cover transition-all duration-700 ${isActive ? 'scale-110 brightness-110' : 'brightness-[0.35] group-hover:brightness-75 group-hover:scale-105'}`}
                />
                
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className={`text-[10px] md:text-xs uppercase tracking-[0.3em] font-black transition-all duration-500 ${
                  isActive ? 'text-gold' : 'text-white/40 group-hover:text-white/70'
                }`}>
                  {t(`menu.cat.${cat}`)}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="active-cat-indicator"
                    className="h-[2px] w-8 bg-gold rounded-full"
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 px-4 md:px-8">
        {filteredDishes.map((dish, idx) => (
          <motion.div key={dish.id} onClick={() => setSelectedDish(dish)} className="luxury-card rounded-2xl md:rounded-[2.5rem] overflow-hidden p-3 md:p-6 cursor-pointer group">
            <div className="relative aspect-square rounded-xl md:rounded-[2rem] overflow-hidden mb-3 md:mb-6 bg-white/[0.02]">
              <Image
                src={dish.image || DEFAULT_IMAGE}
                alt={lang === 'ar' ? dish.nameAr || dish.name : dish.name}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                priority={idx < 4}
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h3 className="text-white text-sm md:text-2xl font-serif italic mb-1 md:mb-2 truncate-text">{lang === 'ar' ? dish.nameAr || dish.name : dish.name}</h3>
            <CurrencyPrice price={dish.price} className="text-gold text-xs md:text-base font-mono" />
          </motion.div>
        ))}
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
            dynamicCategoryImages={dynamicCategoryImages}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
