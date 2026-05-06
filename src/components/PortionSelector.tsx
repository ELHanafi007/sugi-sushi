'use client';

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useState, useEffect } from 'react';

export interface Portion {
  name: string;
  nameAr: string;
  price: string;
  pieces: number;
  tags?: string[];
}

interface PortionSelectorProps {
  portions: Portion[];
  selectedIdx: number;
  onChange: (idx: number) => void;
  lang: 'en' | 'ar';
}

export const PortionSelector = ({ 
  portions, 
  selectedIdx, 
  onChange, 
  lang 
}: PortionSelectorProps) => {
  const isAr = lang === 'ar';
  
  // Create a slider logic based on index (0 to portions.length - 1)
  // For dual portions (4P, 8P), this is just 0 or 1.
  
  return (
    <div className="flex flex-col items-center gap-6 py-4 w-full max-w-[280px]">
      {/* The Track & Thumb Slider */}
      <div className="relative w-full h-12 bg-white/[0.03] border border-white/[0.08] rounded-full p-1.5 flex items-center shadow-inner overflow-hidden">
        {/* Sliding Background (The Thumb Effect) */}
        <motion.div
          initial={false}
          animate={{ 
            x: isAr ? (selectedIdx === 0 ? '0%' : '-100%') : (selectedIdx === 0 ? '0%' : '100%'),
            left: isAr ? 'auto' : '0',
            right: isAr ? '0' : 'auto'
          }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="absolute w-1/2 h-[calc(100%-12px)] bg-gold rounded-full shadow-[0_4px_20px_rgba(212,175,55,0.4)]"
          style={{ 
            // In AR, if selectedIdx is 1, it should slide left
            // We use left/right or translateX
          }}
        />

        {/* Labels Overlay */}
        {portions.map((p, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`relative z-10 flex-1 h-full flex flex-col items-center justify-center transition-colors duration-500 ${
              selectedIdx === i ? 'text-bg' : 'text-white/30 hover:text-white/60'
            }`}
          >
            <span className="text-[10px] font-black font-mono uppercase tracking-[0.2em]">
              {p.pieces}P
            </span>
            <span className="text-[8px] font-bold uppercase opacity-60">
              {isAr ? p.nameAr : p.name}
            </span>
          </button>
        ))}
      </div>

      {/* Kinetic Feedback (Best Value Glow) */}
      <div className="h-6 flex items-center justify-center">
        {portions[selectedIdx]?.tags?.includes('Best Value') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="px-4 py-1 rounded-full bg-gold/10 border border-gold/20 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
          >
            <motion.span 
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[9px] text-gold font-black uppercase tracking-[0.3em] font-mono"
            >
              {isAr ? 'أفضل قيمة' : 'BEST VALUE'}
            </motion.span>
          </motion.div>
        )}
      </div>
    </div>
  );
};
