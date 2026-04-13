'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import { MENU_DATA, CATEGORIES, Dish } from '@/data/menuData';
import { useLanguage } from '@/context/LanguageContext';

/* ===== STAGGER VARIANTS ===== */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ===== CATEGORY ICONS ===== */
const CATEGORY_ICONS: Record<string, string> = {
  'Salads': '🥗',
  'Soups': '🍜',
  'Starters': '前',
  'Wok, Noodles & Rice': '炒',
  'Tempura': '天',
  'Sugi Dishes': '主',
  'Sashimi': '刺',
  'Tataki': '叩',
  'Ceviche': '酸',
  'Nigiri': '握',
  'Gunkan': '軍',
  'Temaki': '手',
  'Maki Rolls': '巻',
  'Aromaki Rolls': '香',
  'Aromaki Fried': '揚',
  'California Rolls': '加',
  'Special Rolls': '特',
  'Fried Rolls': '衣',
  'Boxes': '箱',
  'Sugi Boat': '舟',
  'Cold Drinks': '冷',
  'Fresh Juices': '搾',
  'Hot Drinks': '温',
  'Desserts': '甘',
  'Extra Sauces': '醤',
};

/* ===== DISH CARD COMPONENT ===== */
function DishCard({ dish, lang }: { dish: Dish; lang: 'en' | 'ar' }) {
  const [isPressed, setIsPressed] = useState(false);

  const name = lang === 'ar' ? dish.nameAr || dish.name : dish.name;
  const description = lang === 'ar' ? dish.descriptionAr || dish.description : dish.description;

  // Tag color logic
  const getTagStyle = (tag: string) => {
    const t = tag.toLowerCase();
    if (['signature', 'best seller', "chef's choice"].includes(t))
      return 'bg-gold/10 border-gold/20 text-gold/80';
    if (['spicy', 'hot'].includes(t))
      return 'bg-accent-red/10 border-accent-red/20 text-accent-red-light/80';
    if (['premium', 'luxury', 'ultimate luxury'].includes(t))
      return 'bg-gold/15 border-gold/30 text-gold';
    if (['new'].includes(t))
      return 'bg-foreground/5 border-foreground/15 text-foreground-muted/70';
    return 'bg-gold/5 border-gold/10 text-gold/60';
  };

  return (
    <motion.div
      variants={itemVariants}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      onPointerLeave={() => setIsPressed(false)}
    >
      <motion.div
        animate={isPressed ? { scale: 0.985 } : { scale: 1 }}
        transition={{ duration: 0.15 }}
        className="card-luxury p-4 relative overflow-hidden active:scale-[0.985]"
      >
        {/* Gold accent line on top */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r 
                        from-transparent via-gold/8 to-transparent" />

        {/* Name + Price Row */}
        <div className="flex justify-between items-start gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-foreground text-sm font-serif uppercase tracking-[0.12em] 
                           leading-tight pr-2">
              {name}
            </h4>

            {/* Tags */}
            {dish.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {dish.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className={`text-[6px] px-2 py-0.5 border uppercase tracking-[0.2em] 
                               rounded-full font-medium ${getTagStyle(tag)}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Price + Calories */}
          <div className="flex-shrink-0 text-right flex flex-col items-end">
            <span className="text-gold font-serif text-base font-medium leading-none">
              {dish.price.replace(' SR', '')}
            </span>
            <span className="text-[7px] text-gold/50 uppercase tracking-wider">SR</span>
            {dish.calories && (
              <span className="text-[7px] text-foreground-dim/50 mt-1 tracking-wider">
                {dish.calories} cal
              </span>
            )}
          </div>
        </div>

        {/* Dotted Separator */}
        {description && (
          <>
            <div className="w-full h-[1px] border-b border-dotted border-gold/8 my-2" />
            {/* Description */}
            <p className="text-foreground-muted/60 text-[10px] leading-relaxed font-light 
                          tracking-wide border-l-[1px] border-gold/8 pl-2.5 line-clamp-2">
              {description}
            </p>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ===== MAIN MENU SECTION ===== */
export default function MenuSection() {
  const { t, lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabBarRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Get dishes for active category
  const filteredItems = MENU_DATA.filter((item) => item.category === activeCategory);

  // Scroll active tab into view
  useEffect(() => {
    if (tabBarRef.current) {
      const activeTab = tabBarRef.current.querySelector('[data-active="true"]');
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeCategory]);

  // Scroll to menu section when category changes
  const handleCategoryChange = useCallback((cat: string) => {
    setActiveCategory(cat);
    if (sectionRef.current) {
      const yOffset = -80;
      const y = sectionRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  return (
    <section
      id="menu"
      ref={sectionRef}
      className="w-full min-h-[100dvh] bg-background flex flex-col items-center relative overflow-hidden"
    >
      {/* ===== AMBIENT BACKGROUND ===== */}
      <div className="absolute inset-0 washi opacity-[0.02] pointer-events-none" />
      <div className="absolute -top-[10%] -left-[20%] w-[60%] h-[40%] bg-gold/[0.03] 
                      blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[10%] -right-[20%] w-[60%] h-[40%] 
                      bg-accent-red/[0.02] blur-[100px] rounded-full pointer-events-none" />

      {/* ===== SECTION HEADER ===== */}
      <div className="w-full max-w-lg z-10 pt-20 pb-4 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="w-6 h-[1px] bg-gold/30 mb-5" />
          <span className="text-gold text-[8px] tracking-[0.8em] uppercase font-serif font-medium">
            {t('menu.collection')}
          </span>
          <h2 className="text-foreground text-2xl font-serif uppercase tracking-[0.25em] 
                         relative pb-3 mt-3">
            {t('menu.title')}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-12 
                           bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          </h2>
        </motion.div>
      </div>

      {/* ===== STICKY CATEGORY TAB BAR ===== */}
      <div
        ref={scrollRef}
        className="sticky top-[64px] z-50 w-full bg-background/95 backdrop-blur-xl 
                    border-b border-gold/5 py-3"
      >
        <div
          ref={tabBarRef}
          className="flex gap-2 px-4 overflow-x-auto no-scrollbar max-w-lg mx-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = cat === activeCategory;
            const count = MENU_DATA.filter((d) => d.category === cat).length;
            if (count === 0) return null;

            return (
              <motion.button
                key={cat}
                data-active={isActive}
                onClick={() => handleCategoryChange(cat)}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full 
                            text-[8px] uppercase tracking-[0.15em] font-serif transition-all 
                            duration-300 ${
                              isActive
                                ? 'bg-gold/15 text-gold border border-gold/30'
                                : 'bg-foreground/[0.03] text-foreground-dim/60 border border-transparent'
                            }`}
              >
                <span className="text-[10px]">
                  {CATEGORY_ICONS[cat] || '•'}
                </span>
                <span className="whitespace-nowrap">
                  {t(`menu.cat.${cat}`)}
                </span>
                <span className={`text-[7px] ${isActive ? 'text-gold/60' : 'text-foreground-dim/30'}`}>
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ===== CONTENT AREA ===== */}
      <div className="w-full max-w-lg z-10 px-4 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-3 mt-6"
          >
            {filteredItems.map((dish) => (
              <DishCard key={dish.id} dish={dish} lang={lang} />
            ))}

            {filteredItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-foreground-dim/40"
              >
                <span className="text-4xl mb-4">{CATEGORY_ICONS[activeCategory] || '•'}</span>
                <p className="text-[10px] uppercase tracking-[0.4em] font-serif text-center">
                  Coming Soon
                </p>
              </motion.div>
            )}

            {filteredItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex flex-col items-center gap-3"
              >
                <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
                <span className="text-[7px] text-foreground-dim/30 uppercase tracking-[0.4em] font-serif">
                  End of {t(`menu.cat.${activeCategory}`)}
                </span>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ===== BACKGROUND KANJI SEAL ===== */}
      <div className="fixed bottom-4 right-2 text-[120px] font-serif select-none 
                      pointer-events-none text-gold/[0.02] z-0 leading-none">
        杉
      </div>
    </section>
  );
}
