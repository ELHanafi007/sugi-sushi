'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

/**
 * SUGI — The Obsidian Cursor
 * 
 * A high-frequency interactive cursor system that adapts to its environment.
 * Features:
 * - Magnetic pull to interactive elements
 * - State-based scaling (view/drag/click)
 * - Trailing light effect
 */

export default function Cursor() {
  const [cursorState, setCursorState] = useState<'default' | 'hover' | 'click' | 'view'>('default');
  const [isVisible, setIsVisible] = useState(false);
  
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for high-end feel
  const springConfig = { stiffness: 450, damping: 40, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setCursorState('click');
    const handleMouseUp = () => setCursorState('default');

    const handleHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, .interactive')) {
        setCursorState('hover');
      } else if (target.closest('.view-trigger')) {
        setCursorState('view');
      }
    };

    const handleHoverEnd = () => setCursorState('default');

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleHoverStart);
    window.addEventListener('mouseout', handleHoverEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleHoverStart);
      window.removeEventListener('mouseout', handleHoverEnd);
    };
  }, [mouseX, mouseY, isVisible]);

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none mix-blend-difference">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            style={{
              x: cursorX,
              y: cursorY,
              translateX: '-50%',
              translateY: '-50%',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: cursorState === 'hover' ? 2.5 : cursorState === 'click' ? 0.8 : cursorState === 'view' ? 4 : 1,
              opacity: 1 
            }}
            exit={{ scale: 0, opacity: 0 }}
            className="relative flex items-center justify-center"
          >
            {/* Inner Dot */}
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
            
            {/* Outer Ring */}
            <motion.div
              animate={{
                borderWidth: cursorState === 'hover' ? '0.5px' : '1px',
                scale: cursorState === 'hover' ? 1.2 : 1,
              }}
              className="absolute inset-0 w-8 h-8 border border-white/50 rounded-full"
            />

            {/* View Text for 'view' state */}
            {cursorState === 'view' && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute text-[4px] uppercase tracking-widest font-bold text-white"
              >
                View
              </motion.span>
            )}

            {/* Interaction Glow */}
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -inset-4 bg-white/10 blur-xl rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
