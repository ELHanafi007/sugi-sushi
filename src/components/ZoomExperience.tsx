'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { motion, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const galleryData = [
  { id: 1, src: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1600&h=1200&fit=crop&q=80', x: -20, y: -15, zOffset: 0, w: 'w-[60vw] md:w-[30vw]', aspect: 'aspect-[4/5]', label: 'PRECISION' },
  { id: 2, src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&h=1200&fit=crop&q=80', x: 25, y: 20, zOffset: -2000, w: 'w-[70vw] md:w-[40vw]', aspect: 'aspect-[16/9]', label: 'SANCTUARY' },
  { id: 3, src: 'https://images.unsplash.com/photo-1580828369019-2238b909ca8c?w=1200&h=1600&fit=crop&q=80', x: -25, y: 25, zOffset: -4000, w: 'w-[50vw] md:w-[25vw]', aspect: 'aspect-[3/4]', label: 'FOCUS' },
  { id: 4, src: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1600&h=1200&fit=crop&q=80', x: 20, y: -25, zOffset: -6000, w: 'w-[65vw] md:w-[35vw]', aspect: 'aspect-square', label: 'UMAMI' },
  { id: 5, src: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=1200&h=1600&fit=crop&q=80', x: -10, y: -20, zOffset: -8000, w: 'w-[55vw] md:w-[30vw]', aspect: 'aspect-[4/5]', label: 'ESSENCE' },
  { id: 6, src: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db76?w=1600&h=1200&fit=crop&q=80', x: 30, y: 5, zOffset: -10000, w: 'w-[75vw] md:w-[45vw]', aspect: 'aspect-[16/9]', label: 'TEMPORAL' },
  { id: 7, src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1600&h=1200&fit=crop&q=80', x: -30, y: 15, zOffset: -12000, w: 'w-[40vw]', aspect: 'aspect-square', label: 'VIBRANCE' },
  { id: 8, src: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=1600&h=1200&fit=crop&q=80', x: 25, y: -10, zOffset: -14000, w: 'w-[50vw]', aspect: 'aspect-[4/5]', label: 'CRAFT' },
  { id: 9, src: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=1600&h=1200&fit=crop&q=80', x: 0, y: 0, zOffset: -16000, w: 'w-[100vw]', aspect: 'h-[100vh]', label: '', isFinal: true },
];

function FlyThroughImage({ item, progress }: { item: any, progress: any }) {
    const travel = 16000;
    const relativeZ = useTransform(progress, [0, 1], [item.zOffset, item.zOffset + travel]);

    // Opacity tuning: Emerges from deep void, becomes sharp at Z=0, flies past camera
    const opacityRanges = item.isFinal ? [-8000, -2000, 0, 1000] : [-5000, -1500, 0, 800];
    const opacityValues = item.isFinal ? [0, 1, 1, 1] : [0, 1, 1, 0];
    const opacity = useTransform(relativeZ, opacityRanges, opacityValues);

    // Blur tuning
    const blurRanges = item.isFinal ? [-8000, -1000, 0, 1000] : [-5000, -1000, 0, 800];
    const blurValues = item.isFinal ? ['blur(30px)', 'blur(0px)', 'blur(0px)', 'blur(0px)'] : ['blur(30px)', 'blur(0px)', 'blur(0px)', 'blur(15px)'];
    const filter = useTransform(relativeZ, blurRanges, blurValues);

    return (
        <motion.div
            style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                x: item.isFinal ? '-50%' : `calc(-50% + ${item.x}vw)`,
                y: item.isFinal ? '-50%' : `calc(-50% + ${item.y}vh)`,
                z: relativeZ,
                opacity,
                filter,
                willChange: 'transform, opacity',
            }}
            className={cn(
                "flex flex-col items-center justify-center",
                item.w, item.aspect,
                item.isFinal ? "z-0" : "luxury-card rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] p-2 z-10"
            )}
        >
            <div className={cn("relative w-full h-full", !item.isFinal && "rounded-[2rem] overflow-hidden")}>
                <Image 
                    src={item.src} 
                    alt={item.label} 
                    fill 
                    sizes={item.isFinal ? "100vw" : "50vw"}
                    className={cn("object-cover", item.isFinal && "brightness-[0.7]")}
                    priority={item.isFinal || item.id < 3}
                />
                {!item.isFinal && (
                    <div className="absolute inset-0 bg-black/30 hover:bg-transparent transition-colors duration-1000" />
                )}
                {!item.isFinal && (
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                        <span className="mono-tag !bg-black/60 !backdrop-blur-xl !border-white/10 !text-gold/90 shadow-2xl scale-125 md:scale-100">{item.label}</span>
                    </div>
                )}
            </div>
            {item.isFinal && <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />}
        </motion.div>
    );
}

export default function ZoomExperience() {
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    const [virtualProgress, setVirtualProgress] = useState(0);
    const progressTarget = useRef(0);
    const [hasFinished, setHasFinished] = useState(false);

    // Mouse tracking for subtle 3D tilt
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX / window.innerWidth);
            mouseY.set(e.clientY / window.innerHeight);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    const rotateX = useSpring(useTransform(mouseY, [0, 1], [3, -3]), { stiffness: 50, damping: 20 });
    const rotateY = useSpring(useTransform(mouseX, [0, 1], [-3, 3]), { stiffness: 50, damping: 20 });

    // Smooth virtual progress - Slower and more weighted
    const smoothProgress = useSpring(virtualProgress, { stiffness: 25, damping: 20, restDelta: 0.0001 });

    // Handle Virtual Scroll Hijacking
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (!containerRef.current) return;
            
            const rect = containerRef.current.getBoundingClientRect();
            const inView = rect.top <= 100 && rect.bottom >= window.innerHeight - 100;

            if (inView) {
                // If scrolling down and not at the end
                if (e.deltaY > 0 && progressTarget.current < 1) {
                    e.preventDefault();
                    progressTarget.current = Math.min(1, progressTarget.current + e.deltaY * 0.00015); // Much slower
                    setVirtualProgress(progressTarget.current);
                    setHasFinished(false);
                    return false;
                }
                // If scrolling up and not at the start
                if (e.deltaY < 0 && progressTarget.current > 0) {
                    e.preventDefault();
                    progressTarget.current = Math.max(0, progressTarget.current + e.deltaY * 0.00015);
                    setVirtualProgress(progressTarget.current);
                    setHasFinished(false);
                    return false;
                }
            }

            // Unlock once we reach 100%
            if (progressTarget.current >= 1) {
                setHasFinished(true);
            } else if (progressTarget.current <= 0) {
                setHasFinished(false);
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleWheel);
    }, []);

    // Handle touch for mobile - Extra "weight" for swipes
    useEffect(() => {
        let startY = 0;
        const handleTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
        const handleTouchMove = (e: TouchEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= window.innerHeight - 100) {
                const deltaY = startY - e.touches[0].clientY;
                if ((deltaY > 0 && progressTarget.current < 1) || (deltaY < 0 && progressTarget.current > 0)) {
                    e.preventDefault();
                    progressTarget.current = Math.max(0, Math.min(1, progressTarget.current + deltaY * 0.0004));
                    setVirtualProgress(progressTarget.current);
                    startY = e.touches[0].clientY;
                    setHasFinished(false);
                }
            }
            if (progressTarget.current >= 1) setHasFinished(true);
        };
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    return (
        <section className="relative w-full bg-bg">
            {/* Cinematic Intro Header */}
            <div className="relative flex h-[80vh] flex-col items-center justify-center text-center px-4 overflow-hidden">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-1/2 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_70%)] blur-[120px]"
                />
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5 }}
                    className="flex items-center gap-4 mb-8 justify-center"
                >
                    <div className="w-16 h-[1px] bg-gold/30" />
                    <span className="text-mono text-gold/60 text-[11px] tracking-[1.2em] uppercase font-black">Spatial Archive</span>
                    <div className="w-16 h-[1px] bg-gold/30" />
                </motion.div>
                <motion.h2 
                    initial={{ opacity: 0, filter: 'blur(20px)' }}
                    whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 2.5, ease: [0.19, 1, 0.22, 1] }}
                    className="text-7xl md:text-[12rem] text-white font-serif italic font-light leading-none tracking-tightest"
                >
                    The <br />
                    <span className="text-gold shimmer-gold">Soul.</span>
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.3 }}
                    transition={{ delay: 1, duration: 2 }}
                    className="mt-12 text-white text-[10px] uppercase tracking-[0.8em] font-mono font-black"
                >
                    Scroll to Traverse
                </motion.p>
            </div>

            {/* THE INFINITE VOID — LOCKED ZONE */}
            <div ref={containerRef} className="relative h-[250vh] bg-bg">
                <div className="sticky top-0 h-screen overflow-hidden bg-bg" style={{ perspective: '1500px' }}>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05),transparent_80%)] pointer-events-none" />
                    
                    <motion.div 
                        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                        className="absolute inset-0 w-full h-full origin-center"
                    >
                        {galleryData.map((item, idx) => (
                            <FlyThroughImage key={idx} item={item} progress={smoothProgress} />
                        ))}
                    </motion.div>
                    
                    {/* Immersive Background Typography */}
                    <motion.div 
                        style={{ 
                          opacity: useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.15, 0.15, 0.15, 0]),
                          z: useTransform(smoothProgress, [0, 1], [-100, -1200]),
                          scale: useTransform(smoothProgress, [0, 1], [1, 1.5])
                        }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 text-center select-none"
                    >
                        <h2 className="text-white text-[10rem] md:text-[25rem] font-serif italic whitespace-nowrap leading-none">
                            ARCHIVE
                        </h2>
                    </motion.div>

                    {/* Progress & Feedback */}
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 z-50">
                        <AnimatePresence mode="wait">
                            {!hasFinished ? (
                                <motion.div 
                                    key="traversing"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="flex flex-col items-center gap-2"
                                >
                                    <span className="text-gold/40 text-[9px] uppercase tracking-[0.6em] font-mono font-black">
                                        Traversing Memory
                                    </span>
                                    <span className="text-white/10 text-[8px] font-mono uppercase">
                                        {Math.round(virtualProgress * 100)}%
                                    </span>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="unlocked"
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="flex flex-col items-center gap-2"
                                >
                                    <span className="text-gold text-[10px] uppercase tracking-[0.6em] font-mono font-black animate-pulse">
                                        Experience Complete
                                    </span>
                                    <motion.div 
                                        animate={{ y: [0, 5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        className="text-gold/60"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="m7 13 5 5 5-5M7 6l5 5 5-5"/>
                                        </svg>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div className="w-64 h-[1px] bg-white/5 relative overflow-hidden">
                            <motion.div 
                                style={{ scaleX: smoothProgress }}
                                className="absolute inset-0 bg-gold origin-left"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Narrative Transition Landing */}
            <div className="relative z-20 bg-bg pt-48 pb-40">
                <div className="container-luxury">
                    <div className="max-w-4xl mx-auto text-center space-y-24">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.5 }}
                            className="space-y-12"
                        >
                            <h3 className="text-gold text-[12px] uppercase tracking-[1em] font-black font-mono">
                                The Legacy of Flavor
                            </h3>
                            <h4 className="text-5xl md:text-8xl text-white font-serif italic font-light leading-none tracking-tight">
                                Where every grain of rice <br /> 
                                <span className="opacity-40">tells a thousand-year story.</span>
                            </h4>
                        </motion.div>
                        <div className="w-px h-40 bg-gradient-to-b from-gold/50 via-gold/20 to-transparent mx-auto" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 text-left items-center">
                            <p className="text-white/70 text-xl md:text-2xl font-serif italic leading-relaxed">
                                At Sugi Sushi, we believe that the true essence of Japanese cuisine lies in the pursuit of perfection within simplicity. Our gallery is a testament to the hands that craft, the sea that provides, and the fire that transforms.
                            </p>
                            <div className="space-y-8">
                                <p className="text-white/40 text-base md:text-lg font-light leading-relaxed">
                                    From the precision of the sushi knife to the gentle steam of artisanal ramen, each image captures a moment of "Ichi-go Ichi-e"—the philosophy that this exact moment will never happen again.
                                </p>
                                <div className="flex items-center gap-8 pt-4">
                                    <div className="h-px w-16 bg-gold/30" />
                                    <span className="text-gold/50 text-[11px] uppercase font-mono tracking-[0.4em] font-black">Est. Riyadh 2024</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-[20vh]"/>
        </section>
    );
}
