'use client';

import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type IconComponentType = React.ElementType<{ className?: string }>;
export interface InteractiveMenuItem {
  label: string;
  icon: IconComponentType;
}

export interface InteractiveMenuProps {
  items?: InteractiveMenuItem[];
  accentColor?: string;
  activeIndex?: number;
  onItemClick?: (index: number) => void;
}

const defaultAccentColor = 'var(--component-active-color-default)';

const InteractiveMenu: React.FC<InteractiveMenuProps> = ({ items, accentColor, activeIndex: externalActiveIndex, onItemClick }) => {

  const finalItems = useMemo(() => {
     return items || [];
  }, [items]);

  const [internalActiveIndex, setInternalActiveIndex] = useState(0);
  const activeIndex = externalActiveIndex !== undefined ? externalActiveIndex : internalActiveIndex;

  const handleItemClick = (index: number) => {
    if (onItemClick) {
        onItemClick(index);
    } else {
        setInternalActiveIndex(index);
    }
  };

  const navStyle = useMemo(() => {
      const activeColor = accentColor || defaultAccentColor;
      return { '--component-active-color': activeColor } as React.CSSProperties;
  }, [accentColor]); 

  return (
    <nav
      className="menu !bg-black/60 !backdrop-blur-3xl !border-white/5 !shadow-[0_20px_50px_rgba(0,0,0,0.8)] !p-2"
      role="navigation"
      style={navStyle}
    >
      <div className="flex items-center gap-1 relative">
        {finalItems.map((item, index) => {
          const isActive = index === activeIndex;
          const IconComponent = item.icon;

          return (
            <button
              key={item.label}
              className="menu__item relative flex flex-col items-center justify-center py-4 px-6 md:px-8 group transition-all duration-700"
              onClick={() => handleItemClick(index)}
              style={{ willChange: 'transform, opacity' }}
            >
              {/* Active Indicator (Liquid Pill) */}
              {isActive && (
                <motion.div 
                  layoutId="activeMasterPill"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="absolute inset-0 bg-white/[0.03] border border-white/5 rounded-full -z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                />
              )}

              <div className="menu__icon relative">
                <IconComponent 
                  className={`icon transition-all duration-700 ${isActive ? 'text-gold scale-125' : 'text-white/20 group-hover:text-white/40'}`} 
                />
                
                {/* Glow Effect */}
                {isActive && (
                  <motion.div 
                    layoutId="iconGlow"
                    className="absolute inset-0 bg-gold/20 blur-xl rounded-full -z-10"
                  />
                )}
              </div>

              <AnimatePresence>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: 5, filter: 'blur(10px)' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    className="text-[8px] font-mono font-black uppercase tracking-[0.2em] text-gold mt-2 block"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export {InteractiveMenu}
