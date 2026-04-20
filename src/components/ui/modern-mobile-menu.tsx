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
      className="menu"
      role="navigation"
      style={navStyle}
    >
      {finalItems.map((item, index) => {
        const isActive = index === activeIndex;
        const IconComponent = item.icon;

        return (
          <button
            key={item.label}
            className={`menu__item ${isActive ? 'active' : ''}`}
            onClick={() => handleItemClick(index)}
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="menu__icon relative">
              <IconComponent 
                className={`icon transition-all duration-300 ${isActive ? 'text-gold scale-110' : 'text-white/20'}`} 
              />
            </div>

            <AnimatePresence>
              {isActive && (
                <motion.strong
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 800, damping: 35 }}
                  className="menu__text text-gold !block !opacity-100 !w-auto"
                >
                  {item.label}
                </motion.strong>
              )}
            </AnimatePresence>

            {/* Faster Active Indicator (Background only) */}
            {isActive && (
              <motion.div 
                layoutId="activePill"
                transition={{ type: 'spring', stiffness: 800, damping: 40 }}
                className="absolute inset-0 bg-gold/10 rounded-full -z-10"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};

export {InteractiveMenu}
