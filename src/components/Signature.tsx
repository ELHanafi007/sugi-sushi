'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { menuData, Dish } from '@/data/menuData';

/**
 * SIGNATURE SELECTION SYSTEM - Editorial V2
 * 
 * SIGNATURE INTERACTION: Cinematic Focus Pull (Background Blur Shift).
 */

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
      className="relative w-full h-[70vh] md:h-[85vh] rounded-[3rem] overflow-hidden group shadow-2xl cursor-none"
    >
      {/* Cinematic Focus Pull Layer */}
      <motion.div 
        animate={{ 
          scale: isHovered ? 1.05 : 1,
          filter: isHovered ? 'blur(4px)' : 'blur(0px)'
        }}
        transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("/media/optimized/hero-wallpaper-alt-2.jpg")' }} 
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      
      {/* Interactive Ripple (Visual Sound) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.1, scale: 1.2 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gold blur-3xl rounded-full"
          />
        )}
      </AnimatePresence>

      {/* Content HUD */}
      <div className="absolute inset-0 p-8 md:p-24 flex flex-col justify-end">
        <motion.div
          animate={{ y: isHovered ? -10 : 0 }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className="flex items-center gap-6 mb-8">
            <span className="text-mono text-gold px-6 py-1.5 rounded-full border border-gold/20 bg-gold/5">
              Masterpiece 01
            </span>
            <div className="h-px w-12 bg-gold/40" />
            <span className="text-mono !text-white/40">Signature</span>
          </div>
          
          <h3 className="text-display text-white mb-8 tracking-tighter">
            {dish.name}
          </h3>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <p className="text-h3 text-white/60 max-w-2xl italic">
              &quot;{dish.description}&quot;
            </p>
            
            <div className="flex items-baseline gap-4">
              <span className="text-h2 text-gold font-light">{dish.price}</span>
              <span className="text-mono text-gold/40">SR</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Signature Frame Bloom */}
      <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 transition-colors duration-1000 pointer-events-none" />
    </motion.div>
  );
};

const SecondaryDish = ({ dish, idx }: { dish: Dish, idx: number }) => {
  const imageUrl = idx === 0 ? "/media/optimized/hero-wallpaper-alt-3.jpg" : "/media/optimized/hero-wallpaper-alt-4.jpg";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: 0.3 + idx * 0.2, duration: 2, ease: [0.19, 1, 0.22, 1] }}
      className={`relative rounded-[2.5rem] overflow-hidden group shadow-xl cursor-none ${
        idx === 0 ? 'aspect-[4/5]' : 'aspect-square lg:mt-32'
      }`}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[5s] ease-out group-hover:scale-110"
        style={{ backgroundImage: `url("${imageUrl}")` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-mono text-gold mb-4 block opacity-60">Curated</span>
          <h4 className="text-h2 text-white mb-4 leading-none">{dish.name}</h4>
          <div className="flex items-center justify-between">
            <span className="text-h3 text-white/40 italic">{dish.price} SR</span>
            <div className="w-2 h-2 rounded-full bg-gold/20 group-hover:bg-gold transition-colors duration-700 glow-gold" />
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
      {/* Background Ambience (Film Grain) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.01] to-transparent pointer-events-none" />

      <div className="container-luxury relative z-10">
        {/* Header Rhythm */}
        <div className="mb-40 flex flex-col lg:flex-row items-end justify-between gap-12">
          <div className="max-w-3xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-mono text-gold/40 mb-8 block"
            >
              The Selection
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1.5 }}
              className="text-h1 text-white italic"
            >
              Signature <span className="text-gold">Art.</span>
            </motion.h2>
          </div>
          <div className="h-px flex-1 bg-white/[0.05] mb-8 hidden lg:block mx-12" />
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-end gap-2 mb-8"
          >
            <span className="text-gold text-5xl font-serif">匠</span>
            <span className="text-mono text-white/20">Collection</span>
          </motion.div>
        </div>

        {/* Cinematic Selection */}
        <div className="flex flex-col gap-40">
          <FeaturedDish dish={featured} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-40 items-start">
            {secondary.map((dish, idx) => (
              <SecondaryDish key={dish.id} dish={dish} idx={idx} />
            ))}
          </div>
        </div>

        {/* Cinematic Cut Transition */}
        <div className="mt-60 flex flex-col items-center gap-12">
           <div className="w-px h-40 bg-gradient-to-b from-gold/30 to-transparent" />
           <motion.p 
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-mono text-white/20 tracking-[1.5em]"
           >
            THE CLIMAX
           </motion.p>
        </div>
      </div>
    </section>
  );
}
