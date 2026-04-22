'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { motion, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const galleryData = [
  { id: 1, src: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1600&h=1200&fit=crop&q=80', x: -20, y: -15, zStart: 0, w: 'w-[60vw] md:w-[30vw]', aspect: 'aspect-[4/5]', label: 'PRECISION' },
  { id: 2, src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&h=1200&fit=crop&q=80', x: 25, y: 20, zStart: -2000, w: 'w-[70vw] md:w-[40vw]', aspect: 'aspect-[16/9]', label: 'SANCTUARY' },
  { id: 3, src: 'https://images.unsplash.com/photo-1580828369019-2238b909ca8c?w=1200&h=1600&fit=crop&q=80', x: -25, y: 25, zStart: -4000, w: 'w-[50vw] md:w-[25vw]', aspect: 'aspect-[3/4]', label: 'FOCUS' },
  { id: 4, src: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1600&h=1200&fit=crop&q=80', x: 20, y: -25, zStart: -6000, w: 'w-[65vw] md:w-[35vw]', aspect: 'aspect-square', label: 'UMAMI' },
  { id: 5, src: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=1200&h=1600&fit=crop&q=80', x: -10, y: -20, zStart: -8000, w: 'w-[55vw] md:w-[30vw]', aspect: 'aspect-[4/5]', label: 'ESSENCE' },
  { id: 6, src: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db76?w=1600&h=1200&fit=crop&q=80', x: 30, y: 5, zStart: -10000, w: 'w-[75vw] md:w-[45vw]', aspect: 'aspect-[16/9]', label: 'TEMPORAL' },
  { id: 7, src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1600&h=1200&fit=crop&q=80', x: -30, y: 15, zStart: -12000, w: 'w-[40vw]', aspect: 'aspect-square', label: 'VIBRANCE' },
  { id: 8, src: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=1600&h=1200&fit=crop&q=80', x: 25, y: -10, zStart: -14000, w: 'w-[50vw]', aspect: 'aspect-[4/5]', label: 'CRAFT' },
  { id: 9, src: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=1600&h=1200&fit=crop&q=80', x: 0, y: 0, zStart: -16000, w: 'w-[100vw]', aspect: 'h-[100vh]', label: '', isFinal: true },
];

function FlyThroughImage({ item, progress }: { item: any, progress: any }) {
    // Images move from their zStart to the front (around z=1000)
    // Total travel is 17000 to ensure the last image (at -16000) reaches the front (at +1000)
    const travel = 17500;
    const z = useTransform(progress, [0, 1], [item.zStart, item.zStart + travel]);

    // Opacity: Fade in early, stay visible, fade out ONLY if it's not the final masterpiece
    const opacity = useTransform(
        z,
        item.isFinal 
            ? [-10000, -2000, 0, 2000] // Masterpiece: Fades in and stays
            : [-8000, -3000, 0, 1200, 1500], // Normal images: Fade in, stay, then fade out fast before camera
        item.isFinal
            ? [0, 1, 1, 1]
            : [0, 1, 1, 1, 0]
    );

    // Blur: Blurry in the distance, sharp at the screen
    const filter = useTransform(
        z,
        [-10000, -2000, 0, 1500],
        ['blur(20px)', 'blur(0px)', 'blur(0px)', 'blur(10px)']
    );

    return (
        <motion.div
            style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                x: item.isFinal ? '-50%' : `calc(-50% + ${item.x}vw)`,
                y: item.isFinal ? '-50%' : `calc(-50% + ${item.y}vh)`,
                z,
                opacity,
                filter,
                willChange: 'transform, opacity',
            }}
            className={cn(
                "flex flex-col items-center justify-center",
                item.w, item.aspect,
                item.isFinal ? "z-0" : "luxury-card rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.9)] p-2 z-10"
            )}
        >
            <div className={cn("relative w-full h-full", !item.isFinal && "rounded-[2rem] overflow-hidden")}>
                <Image 
                    src={item.src} 
                    alt={item.label || 'Sugi Gallery'} 
                    fill 
                    sizes={item.isFinal ? "100vw" : "50vw"}
                    className={cn("object-cover", item.isFinal && "brightness-[0.7]")}
                    priority={item.isFinal || item.id < 3}
                />
                {!item.isFinal && (
                    <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors duration-1000" />
                )}
                {!item.isFinal && item.label && (
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                        <span className="mono-tag !bg-black/60 !backdrop-blur-xl !border-white/10 !text-gold/90 shadow-2xl">{item.label}</span>
                    </div>
                )}
            </div>
            {item.isFinal && <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />}
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

    const rotateX = useSpring(useTransform(mouseY, [0, 1], [4, -4]), { stiffness: 50, damping: 30 });
    const rotateY = useSpring(useTransform(mouseX, [0, 1], [-4, 4]), { stiffness: 50, damping: 30 });

    // Weighted smooth progress
    const smoothProgress = useSpring(virtualProgress, { stiffness: 30, damping: 25, restDelta: 0.0001 });

    // Virtual Scroll Hijacking
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (!containerRef.current) return;
            
            const rect = containerRef.current.getBoundingClientRect();
            // Check if we are in the "Active Zone" (roughly the middle of the viewport)
            const inView = rect.top <= 50 && rect.bottom >= window.innerHeight - 50;

            if (inView) {
                // Scroll Down -> Progress Forward
                if (e.deltaY > 0 && progressTarget.current < 1) {
                    e.preventDefault();
                    progressTarget.current = Math.min(1, progressTarget.current + e.deltaY * 0.00015); 
                    setVirtualProgress(progressTarget.current);
                    setHasFinished(false);
                    return false;
                }
                // Scroll Up -> Progress Backward
                if (e.deltaY < 0 && progressTarget.current > 0) {
                    e.preventDefault();
                    progressTarget.current = Math.max(0, progressTarget.current + e.deltaY * 0.00015);
                    setVirtualProgress(progressTarget.current);
                    setHasFinished(false);
                    return false;
                }
            }

            // If we hit 100%, allow scrolling down to the next section
            if (progressTarget.current >= 1) {
                setHasFinished(true);
            } else {
                setHasFinished(false);
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleWheel);
    }, []);

    // Mobile Touch Logic
    useEffect(() => {
        let startY = 0;
        const handleTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
        const handleTouchMove = (e: TouchEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            if (rect.top <= 50 && rect.bottom >= window.innerHeight - 50) {
                const deltaY = startY - e.touches[0].clientY;
                if ((deltaY > 0 && progressTarget.current < 1) || (deltaY < 0 && progressTarget.current > 0)) {
                    e.preventDefault();
                    progressTarget.current = Math.max(0, Math.min(1, progressTarget.current + deltaY * 0.0005));
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
            <div className="relative flex h-[80vh] flex-col items-center justify-center text-center px-4 overflow-hidden bg-bg">
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
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="mt-12 text-white/30 text-[10px] uppercase tracking-[0.8em] font-mono font-black"
                >
                    Scroll to Explore
                </motion.p>
            </div>

            {/* THE GALLERY VOID */}
            <div ref={containerRef} className="relative h-[300vh] bg-bg">
                <div className="sticky top-0 h-screen overflow-hidden bg-bg" style={{ perspective: '1500px' }}>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.03),transparent_80%)] pointer-events-none" />
                    
                    <motion.div 
                        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                        className="absolute inset-0 w-full h-full origin-center"
                    >
                        {galleryData.map((item, idx) => (
                            <FlyThroughImage key={idx} item={item} progress={smoothProgress} />
                        ))}
                    </motion.div>
                    
                    {/* Background Text */}
                    <motion.div 
                        style={{ 
                          opacity: useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.1, 0.1, 0.1, 0]),
                          z: useTransform(smoothProgress, [0, 1], [-100, -1000]),
                          scale: useTransform(smoothProgress, [0, 1], [1, 1.3])
                        }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 text-center select-none"
                    >
                        <h2 className="text-white text-[12rem] md:text-[25rem] font-serif italic whitespace-nowrap leading-none opacity-20">
                            ARCHIVE
                        </h2>
                    </motion.div>

                    {/* Navigation HUD */}
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

            {/* Narrative Conclusion */}
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
                        <p className="text-white/70 text-xl md:text-2xl font-serif italic leading-relaxed px-4">
                            At Sugi Sushi, we believe that the true essence of Japanese cuisine lies in the pursuit of perfection within simplicity. Our gallery is a testament to the hands that craft, the sea that provides, and the fire that transforms.
                        </p>
                    </div>
                </div>
            </div>
            <div className="h-[10vh]"/>
        </section>
    );
}
