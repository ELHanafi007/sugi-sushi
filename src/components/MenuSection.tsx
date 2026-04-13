'use client';

import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
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

const CATEGORY_ICONS: Record<string, string> = {
  'Starters': '前',
  'Sushi & Sashimi': '鮨',
  'Specialty Rolls': '巻',
  'Main Dishes': '主',
  'Desserts': '甘',
};

/* ===== STAGGER VARIANTS ===== */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
  exit: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

/* ===== DISH CARD COMPONENT ===== */
function DishCard({
  item,
  index,
  lang,
}: {
  item: typeof MENU_DATA[0];
  index: number;
  lang: 'en' | 'ar';
}) {
  const [isPressed, setIsPressed] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -50px 0px' });

  const name = lang === 'ar' ? item.nameAr || item.name : item.name;
  const description = lang === 'ar' ? item.descriptionAr || item.description : item.description;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={itemVariants}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      onPointerLeave={() => setIsPressed(false)}
      className="group relative"
    >
      {/* Card Container */}
      <motion.div
        animate={isPressed ? { scale: 0.98 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
        className="card-luxury p-4 relative overflow-hidden"
      >
        {/* Subtle Gold Accent on Top Edge */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r 
                        from-transparent via-gold/10 to-transparent 
                        group-hover:via-gold/30 transition-all duration-700" />

        {/* Dish Header */}
        <div className="flex justify-between items-start gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="text-foreground text-sm font-serif uppercase tracking-[0.15em] 
                           group-hover:text-gold transition-colors duration-500 
                           truncate pr-2">
              {name}
            </h4>
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[6px] px-2 py-0.5 border border-gold/15 text-gold/70 
                             uppercase tracking-[0.25em] rounded-full bg-gold/5
                             font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="flex-shrink-0 text-right">
            <span className="text-gold font-serif text-base font-medium block">
              {item.price}
            </span>
            <span className="text-[7px] text-gold/50 uppercase tracking-wider">SR</span>
          </div>
        </div>

        {/* Dotted Separator */}
        <div className="w-full h-[1px] border-b border-dotted border-gold/10 my-2.5" />

        {/* Description */}
        <p className="text-foreground-muted/70 text-[10px] leading-relaxed font-light 
                      tracking-wide italic border-l-[1px] border-gold/10 pl-2.5
                      group-hover:border-gold/25 transition-all duration-500 line-clamp-2">
          {description}
        </p>

        {/* Hover Glow Effect */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/5 blur-[60px] 
                        rounded-full opacity-0 group-hover:opacity-100 
                        transition-opacity duration-700 pointer-events-none" />
      </motion.div>
    </motion.div>
  );
}

/* ===== CATEGORY CARD COMPONENT ===== */
function CategoryCard({
  cat,
  idx,
  onClick,
}: {
  cat: string;
  idx: number;
  onClick: () => void;
}) {
  const { t } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -30px 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        delay: idx * 0.08 + 0.1,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group relative h-[180px] rounded-xl overflow-hidden cursor-pointer 
                 border-luxury active:border-gold/20 transition-all duration-500"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    >
      {/* Image Background */}
      <Image
        src={CATEGORY_IMAGES[cat] || '/media/optimized/wallpaper.webp'}
        alt={cat}
        fill
        className="object-cover scale-100 group-hover:scale-110 
                   transition-transform duration-[2s] ease-out opacity-50 
                   group-hover:opacity-80"
        sizes="(max-width: 768px) 50vw, 33vw"
        quality={75}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 
                      to-transparent transition-all duration-700" />

      {/* Kanji Watermark */}
      <span className="absolute top-3 right-3 text-[20px] font-serif text-gold/10 
                       group-hover:text-gold/20 transition-all duration-700 select-none">
        {CATEGORY_ICONS[cat]}
      </span>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        {/* "Explore" Label */}
        <motion.span
          className="text-gold text-[7px] tracking-[0.5em] uppercase mb-1.5 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-500 
                     font-serif font-medium"
        >
          Explore
        </motion.span>

        {/* Category Name */}
        <h3 className="text-foreground text-sm font-serif uppercase tracking-[0.2em] 
                       group-hover:text-gold transition-colors duration-500 drop-shadow-lg">
          {t(`menu.cat.${cat}`)}
        </h3>

        {/* Animated Line */}
        <motion.div
          className="mt-2 h-[1px] bg-gold/20"
          initial={{ width: 20 }}
          whileHover={{ width: 48 }}
          whileTap={{ width: 48 }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Item Count Badge */}
      <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/60 backdrop-blur-sm 
                      rounded-full border border-gold/10">
        <span className="text-[7px] text-gold/60 uppercase tracking-wider font-serif">
          {MENU_DATA.filter((d) => d.category === cat).length} items
        </span>
      </div>
    </motion.div>
  );
}

/* ===== MAIN MENU SECTION ===== */
export default function MenuSection() {
  const { t, lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '0px 0px -50px 0px' });

  const filteredItems = activeCategory
    ? MENU_DATA.filter((item) => item.category === activeCategory)
    : [];

  // Scroll to top of menu section when category changes
  useEffect(() => {
    if (activeCategory && sectionRef.current) {
      const yOffset = -100;
      const element = sectionRef.current;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [activeCategory]);

  return (
    <section
      id="menu"
      ref={sectionRef}
      className="w-full min-h-[100dvh] bg-background py-24 px-4 flex flex-col 
                 items-center relative overflow-hidden"
    >
      {/* ===== AMBIENT BACKGROUND ===== */}
      <div className="absolute inset-0 washi opacity-[0.02] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-32 
                      bg-gradient-to-b from-gold/20 via-gold/5 to-transparent" />
      <div className="absolute -top-[10%] -left-[20%] w-[60%] h-[40%] bg-gold/[0.03] 
                      blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[10%] -right-[20%] w-[60%] h-[40%] 
                      bg-accent-red/[0.02] blur-[100px] rounded-full pointer-events-none" />

      {/* ===== SECTION HEADER ===== */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 30 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center mb-12 z-10 text-center px-2"
      >
        {/* Decorative Top Element */}
        <motion.div
          className="w-6 h-[1px] bg-gold/30 mb-6"
          initial={{ scaleX: 0 }}
          animate={isHeaderInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        <span className="text-gold text-[8px] tracking-[0.8em] uppercase mb-4 
                         font-serif font-medium">
          {activeCategory ? t(`menu.cat.${activeCategory}`) : t('menu.collection')}
        </span>

        <h2 className="text-foreground text-3xl font-serif uppercase tracking-[0.25em] 
                       relative pb-4">
          {activeCategory ? activeCategory : t('menu.title')}
          <motion.div
            layoutId="header-underline"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-16 
                       bg-gradient-to-r from-transparent via-gold/50 to-transparent"
          />
        </h2>
      </motion.div>

      {/* ===== CONTENT AREA ===== */}
      <div className="w-full max-w-lg z-10">
        <AnimatePresence mode="wait">
          {!activeCategory ? (
            /* --- CATEGORY GRID --- */
            <motion.div
              key="categories"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-2 gap-3"
            >
              {CATEGORIES.map((cat, idx) => (
                <CategoryCard
                  key={cat}
                  cat={cat}
                  idx={idx}
                  onClick={() => setActiveCategory(cat)}
                />
              ))}
            </motion.div>
          ) : (
            /* --- PRODUCT LIST --- */
            <motion.div
              key="products"
              className="flex flex-col"
            >
              {/* Back Button */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                onClick={() => setActiveCategory(null)}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-3 text-[8px] tracking-[0.4em] 
                           uppercase text-gold/50 hover:text-gold transition-colors 
                           duration-500 mb-8 pb-4 border-b border-gold/5 self-start
                           active:text-gold"
              >
                <motion.span
                  className="w-6 h-[1px] bg-gold/20 group-hover:w-8 group-hover:bg-gold/50 
                             transition-all duration-500"
                />
                <span className="font-serif">{t('menu.back')}</span>
              </motion.button>

              {/* Dishes Grid */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-3"
              >
                {filteredItems.map((item, idx) => (
                  <DishCard key={item.id} item={item} index={idx} lang={lang} />
                ))}
              </motion.div>

              {/* Category Footer Decoration */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="mt-12 flex flex-col items-center gap-3"
              >
                <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
                <span className="text-[8px] text-foreground-dim/40 uppercase tracking-[0.4em] 
                                 font-serif text-center">
                  End of {t(`menu.cat.${activeCategory}`)}
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===== BACKGROUND KANJI SEAL ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.02 }}
        viewport={{ once: true }}
        className="absolute bottom-8 right-4 text-[150px] font-serif select-none 
                   pointer-events-none text-gold z-0 leading-none"
      >
        杉
      </motion.div>
    </section>
  );
}
