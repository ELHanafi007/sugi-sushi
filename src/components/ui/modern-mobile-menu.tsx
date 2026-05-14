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
  forceActiveIndex?: number;
}

const defaultAccentColor = 'var(--component-active-color-default)';

const InteractiveMenu: React.FC<InteractiveMenuProps> = ({ items, accentColor, activeIndex: externalActiveIndex, onItemClick, forceActiveIndex }) => {

  const finalItems = useMemo(() => {
     return items || [];
  }, [items]);

  const [internalActiveIndex, setInternalActiveIndex] = useState(0);
  const activeIndex = forceActiveIndex !== undefined ? forceActiveIndex : (externalActiveIndex !== undefined ? externalActiveIndex : internalActiveIndex);

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
      className="menu !bg-black/40 !backdrop-blur-[40px] !border-white/10 !shadow-[0_24px_64px_rgba(0,0,0,0.8)] !p-1.5"
      role="navigation"
      style={navStyle}
    >
      <div className="flex items-center gap-1 relative">
        {finalItems.map((item, index) => {
          const isActive = index === activeIndex;
          const IconComponent = item.icon;

          return (
            <motion.button
              key={item.label}
              whileTap={{ scale: 0.9, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
              className="menu__item relative flex flex-col items-center justify-center py-4 px-5 md:px-8 group transition-all duration-500"
              onClick={() => handleItemClick(index)}
              style={{ willChange: 'transform, opacity' }}
            >
              {/* Active Indicator (Liquid Pill) */}
              {isActive && (
                <motion.div 
                  layoutId="activeMasterPill"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute inset-0 bg-white/[0.05] border border-white/10 rounded-full -z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                />
              )}

              <div className="menu__icon relative flex items-center justify-center">
                <IconComponent 
                  className={`icon transition-all duration-500 ${isActive ? 'text-gold scale-110' : 'text-white/30 group-hover:text-white/50'}`} 
                />
                
                {/* Glow Effect */}
                {isActive && (
                  <motion.div 
                    layoutId="iconGlow"
                    className="absolute inset-0 bg-gold/10 blur-2xl rounded-full -z-10"
                  />
                )}
              </div>

              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: 4, filter: 'blur(8px)' }}
                    transition={{ type: 'spring', stiffness: 600, damping: 40 }}
                    className="text-[7px] font-mono font-bold uppercase tracking-[0.25em] text-gold mt-1.5 block"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export {InteractiveMenu}
