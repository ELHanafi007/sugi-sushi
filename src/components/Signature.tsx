'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { menuData, Dish } from '@/data/menuData';
import Image from 'next/image';

/**
 * SIGNATURE SELECTION — Editorial Showcase
 * 
 * Cinematic focus-pull interaction on featured dishes.
 * Uses actual brochure images instead of missing hero-wallpaper-alt images.
 */

const DISH_IMAGES = [
  '/media/optimized/brochure-3.jpg',
  '/media/optimized/brochure-5.jpg',
  '/media/optimized/brochure-7.jpg',
];

const FeaturedDish = ({ dish }: { dish: Dish }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 2.5, ease: [0.19, 1, 0.22, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-[65vh] md:h-[80vh] rounded-[2rem] md:rounded-[3rem] overflow-hidden group shadow-2xl"
    >
      {/* Background with Focus Pull */}
      <motion.div 
        animate={{ 
          scale: isHovered ? 1.06 : 1,
          filter: isHovered ? 'blur(3px) brightness(0.7)' : 'blur(0px) brightness(0.8)'
        }}
        transition={{ duration: 1.8, ease: [0.19, 1, 0.22, 1] }}
        className="absolute inset-0"
      >
        <Image
          src={DISH_IMAGES[0]}
          alt={dish.name}
          fill
          className="object-cover"
        />
      </motion.div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
      
      {/* Hover Gold Glow */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.06 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-gold"
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 p-6 md:p-16 lg:p-20 flex flex-col justify-end">
        <motion.div
          animate={{ y: isHovered ? -8 : 0 }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
        >
          {/* Badge Row */}
          <div className="flex items-center gap-4 mb-6">
            <span className="mono-tag !text-gold !bg-gold/10 !border-gold/20 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
              Masterpiece 01
            </span>
            <div className="h-px w-10 bg-gradient-to-r from-gold/30 to-transparent" />
            <span className="text-mono !text-white/30 tracking-[0.4em] text-[8px]">Signature</span>
          </div>
          
          {/* Title */}
          <h3 className="text-4xl md:text-6xl lg:text-7xl text-white font-serif font-light mb-6 tracking-tight leading-none group-hover:text-gold transition-colors duration-1000">
            {dish.name}
          </h3>
          
          {/* Description & Price */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <p className="text-base md:text-lg text-white/50 max-w-xl italic font-serif leading-relaxed">
              &quot;{dish.description}&quot;
            </p>
            
            <div className="flex items-baseline gap-3 bg-black/40 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/[0.06] flex-shrink-0">
              <span className="text-3xl text-gold font-serif font-light tracking-tight">{dish.price}</span>
              <span className="text-mono text-gold/30 text-[8px]">SR</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hover Frame */}
      <div className="absolute inset-0 border border-white/0 group-hover:border-white/[0.06] transition-colors duration-1000 pointer-events-none rounded-[2rem] md:rounded-[3rem]" />
    </motion.div>
  );
};

const SecondaryDish = ({ dish, idx }: { dish: Dish, idx: number }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: 0.2 + idx * 0.15, duration: 2, ease: [0.19, 1, 0.22, 1] }}
      className={`relative rounded-[2rem] overflow-hidden group shadow-xl ${
        idx === 0 ? 'aspect-[4/5]' : 'aspect-square lg:mt-24'
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={DISH_IMAGES[idx + 1] || DISH_IMAGES[0]}
          alt={dish.name}
          fill
          className="object-cover transition-transform duration-[6s] ease-out group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-mono text-gold/40 mb-3 block text-[8px] tracking-[0.5em]">Curated</span>
          <h4 className="text-2xl md:text-3xl text-white font-serif font-light mb-3 leading-none group-hover:text-gold transition-colors duration-700">{dish.name}</h4>
          <div className="flex items-center justify-between">
            <span className="text-white/30 font-serif italic">{dish.price} SR</span>
            <motion.div 
              className="w-2 h-2 rounded-full bg-gold/10 group-hover:bg-gold transition-all duration-700"
              animate={{ boxShadow: ['0 0 0px rgba(212,175,55,0)', '0 0 12px rgba(212,175,55,0.5)', '0 0 0px rgba(212,175,55,0)'] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function Signature() {
  const signatures = menuData.filter(d => d.tags.includes('Signature')).slice(0, 3);
  const featured = signatures[0];
  const secondary = signatures.slice(1);

  return (
    <section className="w-full section-padding bg-bg relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.008] to-transparent pointer-events-none" />

      <div className="container-luxury relative z-10">
        {/* Header */}
        <div className="mb-24 md:mb-32 lg:mb-40 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 lg:gap-12">
          <div className="max-w-3xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-mono text-gold/30 mb-6 block text-[9px] tracking-[0.6em]"
            >
              The Selection
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
              className="text-h1 text-white italic"
            >
              Signature <span className="text-gold">Art.</span>
            </motion.h2>
          </div>
          <div className="h-px flex-1 bg-white/[0.04] mb-6 hidden lg:block mx-8" />
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1 }}
            className="flex flex-col items-end gap-2 mb-6"
          >
            <span className="text-gold/80 text-4xl font-serif">匠</span>
            <span className="text-mono text-white/15 text-[8px] tracking-[0.4em]">Collection</span>
          </motion.div>
        </div>

        {/* Showcase */}
        <div className="flex flex-col gap-24 md:gap-32 lg:gap-40">
          <FeaturedDish dish={featured} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 xl:gap-32 items-start">
            {secondary.map((dish, idx) => (
              <SecondaryDish key={dish.id} dish={dish} idx={idx} />
            ))}
          </div>
        </div>

        {/* Transition */}
        <div className="mt-32 md:mt-48 flex flex-col items-center gap-8">
           <div className="w-px h-24 bg-gradient-to-b from-gold/20 to-transparent" />
           <motion.p 
            animate={{ opacity: [0.08, 0.25, 0.08] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-mono text-white/15 tracking-[1.5em] text-[8px]"
           >
            THE CLIMAX
           </motion.p>
        </div>
      </div>
    </section>
  );
}
