'use client';

import React, { useMemo } from 'react';
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
  const finalItems = useMemo(() => items || [], [items]);

  const [internalActiveIndex, setInternalActiveIndex] = React.useState(0);
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
      className="menu !bg-black/70 !backdrop-blur-md !border-white/10 !shadow-[0_16px_40px_rgba(0,0,0,0.75)] !p-1.5"
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
              whileTap={{ scale: 0.92, transition: { duration: 0.1 } }}
              className="menu__item relative flex flex-col items-center justify-center py-4 px-5 md:px-8 group transition-colors duration-200"
              onClick={() => handleItemClick(index)}
            >
              {isActive && (
                <motion.div
                  layoutId="activeMasterPill"
                  transition={{ type: 'spring', stiffness: 600, damping: 40 }}
                  className="absolute inset-0 bg-white/[0.05] border border-white/10 rounded-full -z-10"
                />
              )}

              <div className="menu__icon relative flex items-center justify-center">
                <IconComponent
                  className={`icon transition-colors duration-200 ${isActive ? 'text-gold scale-110' : 'text-white/30 group-hover:text-white/50'}`}
                />
              </div>

              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 2 }}
                    transition={{ duration: 0.15 }}
                    className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-gold mt-1.5 block"
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

export { InteractiveMenu };
