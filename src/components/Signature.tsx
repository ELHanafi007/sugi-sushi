'use client';

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState, useRef, useMemo, useEffect } from 'react';
import { menuData, Dish } from '@/data/menuData';
import Image from 'next/image';
import { useLanguage, NavTab } from '@/context/LanguageContext';

/**
 * SIGNATURE SELECTION — Editorial Showcase (Masterpiece Edition)
 * 
 * Cinematic focus-pull interaction and 3D depth orchestration.
 */

const DISH_IMAGES = [
  'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=1600&q=80',
];

const FeaturedDish = ({ dish, onTabChange }: { dish: Dish, onTabChange?: (tab: NavTab) => void }) => {
  const { t, lang, setActiveTab, setPendingDish } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-200, 200], [5, -5]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-200, 200], [-5, 5]), { stiffness: 100, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleDishClick = () => {
    setPendingDish(dish);
    setActiveTab('menu');
  };

  const displayImage = dish.image || DISH_IMAGES[0];

  return (
    <motion.div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onClick={handleDishClick}
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-full h-[50vh] md:h-[70vh] rounded-[3rem] overflow-hidden group shadow-[0_50px_100px_rgba(0,0,0,0.6)] luxury-card"
    >
      {/* Background with Cinematic Depth */}
      <motion.div 
        animate={{ 
          scale: isHovered ? 1.1 : 1,
          filter: isHovered ? 'blur(2px) brightness(0.6)' : 'blur(0px) brightness(0.7)'
        }}
        transition={{ duration: 2.5, ease: [0.19, 1, 0.22, 1] }}
        className="absolute inset-0"
      >
        <Image
          src={displayImage}
          alt={dish.name}
          fill
          className="object-cover"
          priority
        />
      </motion.div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-bg/80" />
      
      {/* Light Sweep Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: isHovered ? '200%' : '-100%' }}
          transition={{ duration: 1.5, ease: "circIn" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent skew-x-12 translate-x-[-100%]"
        />
      </div>

      {/* Content Orchestration */}
      <div className={`absolute inset-0 p-8 md:p-24 lg:p-32 flex flex-col justify-end ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
        <motion.div
          animate={{ z: isHovered ? 50 : 0, y: isHovered ? -10 : 0 }}
          style={{ transformStyle: "preserve-3d" }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className="flex items-center gap-6 mb-10">
            <span className="mono-tag !border-gold/30 !text-gold/80 !bg-gold/5 shadow-[0_0_40px_rgba(212,175,55,0.1)]">
              {t('signature.badge')}
            </span>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 60 }}
              className="h-[1px] bg-gradient-to-r from-gold/50 to-transparent" 
            />
          </div>
          
          <h3 className="text-display liquid-gold mb-10 !text-5xl md:!text-8xl tracking-tightest leading-none">
            {lang === 'ar' ? dish.nameAr || dish.name : dish.name}
          </h3>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <p className="text-xl md:text-2xl text-white/65 max-w-2xl italic font-serif leading-relaxed font-light">
              &quot;{lang === 'ar' ? dish.descriptionAr || dish.description : dish.description}&quot;
            </p>
            
            <div className="flex flex-col items-end gap-4">
              <span className="text-mono text-white/45 tracking-[1em] text-[10px]">{t('signature.sig')}</span>
              <div className="flex items-baseline gap-4 bg-white/[0.02] border border-white/5 backdrop-blur-2xl px-10 py-5 rounded-full group-hover:border-gold/30 transition-colors duration-700">
                <span className="text-4xl text-gold font-serif font-light">{dish.price}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Internal Frame */}
      <div className="absolute inset-10 border border-white/0 group-hover:border-white/[0.03] transition-all duration-1000 pointer-events-none rounded-[2rem]" />
    </motion.div>
  );
};

const SecondaryDish = ({ dish, idx, onTabChange }: { dish: Dish, idx: number, onTabChange?: (tab: NavTab) => void }) => {
  const { t, lang, setActiveTab, setPendingDish } = useLanguage();

  const handleDishClick = () => {
    if (onTabChange) {
      onTabChange('menu');
      setTimeout(() => {
        if ((window as any).dispatchDishSelect) {
          (window as any).dispatchDishSelect(dish);
        }
      }, 300);
    }
  };

  const displayImage = dish.image || DISH_IMAGES[idx + 1] || DISH_IMAGES[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: 0.2 + idx * 0.2, duration: 2, ease: [0.19, 1, 0.22, 1] }}
      onClick={handleDishClick}
      className={`relative rounded-[3rem] overflow-hidden group luxury-card cursor-pointer ${
        idx === 0 ? 'aspect-[4/3]' : 'aspect-square lg:mt-12'
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={displayImage}
          alt={dish.name}
          fill
          className="object-cover transition-transform duration-[8s] ease-out group-hover:scale-110 saturate-[1.1]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className={`absolute inset-0 p-10 md:p-14 flex flex-col justify-end ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
        <motion.div
          whileHover={{ y: -10 }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
        >
          <span className="mono-tag !text-gold/70 !bg-gold/5 !border-gold/10 mb-6 scale-90 origin-left">{t('signature.curated')}</span>
          <h4 className="text-3xl md:text-5xl text-white font-serif font-light mb-6 leading-tight group-hover:text-gold transition-colors duration-1000">
            {lang === 'ar' ? dish.nameAr || dish.name : dish.name}
          </h4>
          <div className="flex items-center justify-between">
            <span className="text-white/45 font-serif italic text-lg">{dish.price}</span>
            <div className="w-3 h-3 rounded-full bg-gold/5 group-hover:bg-gold/40 transition-all duration-1000 shadow-[0_0_20px_rgba(212,175,55,0)] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function Signature({ onTabChange, initialMenuData }: { onTabChange?: (tab: NavTab) => void, initialMenuData?: Dish[] }) {
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const menuDataToUse = initialMenuData || menuData;
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const signatures = useMemo(() => {
    const base = menuDataToUse.filter(d => d.tags.includes('Signature'));
    // Return stable slice during SSR, shuffle only on Client
    if (!isMounted) return base.slice(0, 3);
    return [...base].sort(() => Math.random() - 0.5).slice(0, 3);
  }, [isMounted, menuDataToUse]);

  const featured = signatures[0] || menuDataToUse[0];
  const secondary = signatures.slice(1);

  return (
    <section className="w-full section-padding bg-bg relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[1000px] bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.02),transparent_70%)] pointer-events-none" />

      <div className="container-luxury relative z-10">
        {/* Header Orchestration */}
        <div className="mb-32 md:mb-48 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12 lg:gap-20">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-6 mb-8"
            >
              <div className="w-12 h-[1px] bg-gold/40" />
              <span className="text-mono text-gold/65 text-[10px] tracking-[1em] font-black uppercase">
                {t('signature.label')}
              </span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 50, filter: 'blur(15px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 2, ease: [0.19, 1, 0.22, 1] }}
              className="text-h1 text-white italic leading-tight"
            >
              {t('signature.title1')} <span className="shimmer-gold !font-black not-italic">{t('signature.title2')}</span>
            </motion.h2>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="flex flex-col items-center lg:items-end gap-4"
          >
            <span className="text-gold/60 text-6xl md:text-8xl font-serif font-thin">匠</span>
            <span className="text-mono text-white/35 text-[10px] tracking-[0.8em] font-black uppercase">{t('signature.collection')}</span>
          </motion.div>
        </div>

        {/* The Showcase — Grid of Two for Efficiency */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          <div className="lg:col-span-1 h-full">
            <FeaturedDish dish={featured} onTabChange={onTabChange} />
          </div>
          <div className="lg:col-span-1 flex flex-col gap-12 lg:gap-20">
            {secondary.map((dish, idx) => (
              <SecondaryDish key={dish.id} dish={dish} idx={idx} onTabChange={onTabChange} />
            ))}
          </div>
        </div>

        {/* The Climax Trigger */}
        <div className="mt-48 md:mt-72 flex flex-col items-center gap-12">
           <div className="relative w-px h-40 bg-white/[0.05] overflow-hidden">
             <motion.div 
              animate={{ y: ['-100%', '300%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-gold/40 to-transparent"
             />
           </div>
           <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-mono text-white/10 tracking-[2em] text-[10px] uppercase font-black"
           >
            {t('signature.climax')}
           </motion.p>
        </div>
      </div>
    </section>
  );
}
