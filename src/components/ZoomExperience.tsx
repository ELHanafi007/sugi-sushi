'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { motion, useTransform, useSpring, useScroll, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// ─── Configuration (Matching your 100% logic) ───────────────────────────────
const STEP = 1100; // Z gap between cards
const SCROLL_PX = 6000; // Total scrollable pixels for the experience

const galleryData = [
  { id: 1, src: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1600&h=1200&fit=crop&q=80', x: -7, y: -5, w: 'w-[60vw] md:w-[35vw]', aspect: 'aspect-[4/3]', label: 'PRECISION', sub: "Chef's Selection" },
  { id: 2, src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&h=1200&fit=crop&q=80', x: 13, y: 9, w: 'w-[50vw] md:w-[25vw]', aspect: 'aspect-[3/4]', label: 'SANCTUARY', sub: "The Experience" },
  { id: 3, src: 'https://images.unsplash.com/photo-1580828369019-2238b909ca8c?w=1200&h=1600&fit=crop&q=80', x: -16, y: 5, w: 'w-[70vw] md:w-[40vw]', aspect: 'aspect-[16/9]', label: 'FOCUS', sub: "Pure Sharpness" },
  { id: 4, src: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1600&h=1200&fit=crop&q=80', x: 15, y: -9, w: 'w-[55vw] md:w-[30vw]', aspect: 'aspect-square', label: 'UMAMI', sub: "Soul in a Bowl" },
  { id: 5, src: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=1200&h=1600&fit=crop&q=80', x: -9, y: 11, w: 'w-[60vw] md:w-[35vw]', aspect: 'aspect-[4/5]', label: 'ESSENCE', sub: "Art of Flavor" },
  { id: 6, src: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db76?w=1600&h=1200&fit=crop&q=80', x: 12, y: -8, w: 'w-[70vw] md:w-[45vw]', aspect: 'aspect-[16/10]', label: 'TEMPORAL', sub: "Fire & Craft" },
  { id: 7, src: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=1600&h=1200&fit=crop&q=80', x: -4, y: 4, w: 'w-[65vw] md:w-[38vw]', aspect: 'aspect-[4/3]', label: 'MASTERPIECE', sub: "The Full Journey" },
];

const TOTAL_DEPTH = STEP * (galleryData.length - 1);

// ─── FlyThroughCard ─────────────────────────────────────────────────────────
function FlyThroughCard({ item, index, camZ }: { item: any, index: number, camZ: any }) {
    // relZ = card's Z in view-space = cardWorldZ + cameraZ
    const cardWorldZ = -index * STEP;
    const relZ = useTransform(camZ, (val: number) => cardWorldZ + val);

    // EXACT Opacity Curve from your code:
    // relZ < -960 -> 0
    // relZ -960 to -580 -> fadeIn (relZ + 960) / 380
    // relZ -580 to 80 -> 1
    // relZ 80 to 380 -> fadeOut 1 - (relZ - 80) / 300
    // relZ > 380 -> 0
    const opacity = useTransform(
        relZ,
        [-960, -580, 80, 380],
        [0, 1, 1, 0]
    );

    // Subtle blur based on distance
    const blurValue = useTransform(relZ, [-1500, -500, 0, 500], [15, 0, 0, 10]);
    const filter = useTransform(blurValue, (v) => `blur(${v}px)`);

    return (
        <motion.div
            style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                x: `calc(-50% + ${item.x}vw)`,
                y: `calc(-50% + ${item.y}vh)`,
                z: cardWorldZ,
                opacity,
                filter,
                transformStyle: 'preserve-3d',
                willChange: 'transform, opacity',
            }}
            className={cn(
                "flex flex-col items-center justify-center overflow-hidden group",
                item.w, item.aspect,
                "luxury-card rounded-[20px] shadow-[0_30px_70px_rgba(0,0,0,0.85)] p-0 z-10"
            )}
        >
            <div className="relative w-full h-full overflow-hidden">
                <Image 
                    src={item.src} 
                    alt={item.label} 
                    fill 
                    sizes="50vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    priority={index < 2}
                />
                {/* Gradient Scrim */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-transparent to-transparent pointer-events-none opacity-80" />
                
                {/* Gold Left-Edge Accent */}
                <div className="absolute top-8 bottom-8 left-0 w-[2px] bg-gradient-to-b from-transparent via-gold to-transparent opacity-40" />

                <div className="absolute bottom-8 left-8 text-left">
                    <div className="font-mono text-[8.5px] text-gold tracking-[0.38em] uppercase mb-1 opacity-80">{item.sub}</div>
                    <div className="font-serif text-3xl text-white italic font-light tracking-wide">{item.label}</div>
                </div>
            </div>
        </motion.div>
    );
}

export default function ZoomExperience() {
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Use natural scroll progress to drive the target camera Z
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    });

    // Smooth lerp toward the target Z
    const targetCamZ = useTransform(scrollYProgress, [0, 1], [0, TOTAL_DEPTH]);
    const camZ = useSpring(targetCamZ, { stiffness: 45, damping: 25, restDelta: 0.01 });

    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        return camZ.onChange((val) => {
            const progress = val / TOTAL_DEPTH;
            if (progress >= 0.93) setIsFinished(true);
            else if (progress < 0.88) setIsFinished(false);
        });
    }, [camZ]);

    return (
        <section className="relative w-full bg-bg">
            {/* The Cinematic Viewport */}
            <div ref={containerRef} className="relative h-[6000px] bg-bg">
                <div className="sticky top-0 h-screen w-full overflow-hidden bg-bg" style={{ perspective: '900px' }}>
                    {/* Ambient Center Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(201,168,76,0.055),transparent_65%)] pointer-events-none" />
                    
                    {/* Vignette Corners */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_55%,rgba(6,6,6,0.7)_100%)] pointer-events-none z-20" />
                    
                    {/* The World - Traveling Camera */}
                    <motion.div 
                        style={{ 
                            translateZ: camZ,
                            transformStyle: 'preserve-3d'
                        }}
                        className="absolute inset-0 w-full h-full origin-center"
                    >
                        {galleryData.map((item, idx) => (
                            <FlyThroughCard key={item.id} item={item} index={idx} camZ={camZ} />
                        ))}
                    </motion.div>

                    {/* HUD - Intro overlay */}
                    <motion.div 
                        style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
                        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-50"
                    >
                         <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-px bg-gold/20" />
                            <div className="w-1 h-1 rounded-full bg-gold/40" />
                            <div className="w-14 h-px bg-gold/20" />
                        </div>
                        <div className="text-mono text-gold/60 text-[9px] tracking-[0.5em] uppercase mb-4">Spatial Archive</div>
                        <h1 className="text-7xl md:text-[8rem] text-white font-serif italic font-light leading-none">The <span className="text-gold">Gallery.</span></h1>
                        <div className="mt-10 text-white/20 text-[8.5px] tracking-[0.4em] uppercase font-mono animate-pulse">↓ Scroll to Explore ↓</div>
                    </motion.div>

                    {/* HUD - End Card */}
                    <AnimatePresence>
                        {isFinished && (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                transition={{ duration: 1 }}
                                className="absolute inset-0 flex flex-col items-center justify-center text-center z-50 bg-bg/20 backdrop-blur-sm"
                            >
                                <div className="text-mono text-gold/60 text-[9px] tracking-[0.5em] uppercase mb-4">Explore the Menu</div>
                                <h2 className="text-5xl md:text-7xl text-white font-serif italic font-light leading-tight mb-8">Where <span className="text-gold">art</span><br/>meets flavor.</h2>
                                <div className="text-white/20 text-[8.5px] tracking-[0.4em] uppercase font-mono animate-pulse">↓ Continue ↓</div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Progress Bar HUD */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-50">
                        <div className="text-mono text-gold/30 text-[8.5px] tracking-[0.4em] uppercase">
                            {isFinished ? 'Experience Complete' : 'Traversing Memory'}
                        </div>
                        <div className="w-[200px] h-px bg-white/5 relative">
                            <motion.div 
                                style={{ scaleX: scrollYProgress }}
                                className="absolute inset-0 bg-gradient-to-r from-gold/30 to-gold origin-left"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* The Content After - This covers the fixed scene naturally */}
            <div className="relative z-[110] bg-bg pt-48 pb-40">
                <div className="absolute top-0 left-0 right-0 h-[180px] bg-gradient-to-b from-transparent to-bg pointer-events-none" />
                
                <div className="container-luxury text-center">
                    <div className="text-mono text-gold/60 text-[9px] tracking-[0.52em] uppercase mb-6">Our Menu</div>
                    <h2 className="text-5xl md:text-8xl text-white font-serif italic font-light leading-none mb-24">A Journey Through<br/><span className="text-gold italic">Flavor.</span></h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-[860px] mx-auto border border-white/5 mb-24">
                        {[
                            { name: 'Omakase', cat: 'Signature' },
                            { name: 'Sashimi', cat: 'From the Sea' },
                            { name: 'Nigiri', cat: 'Classic' },
                            { name: 'Ramen', cat: 'Warmth' },
                            { name: 'Yakitori', cat: 'Fire' },
                            { name: 'Kaiseki', cat: 'Legacy' }
                        ].map((item) => (
                            <div key={item.name} className="group p-11 border border-white/[0.04] hover:bg-gold/[0.04] hover:border-gold/22 transition-all duration-500 cursor-pointer">
                                <div className="text-mono text-gold/65 text-[8.5px] tracking-[0.38em] uppercase mb-3">{item.cat}</div>
                                <div className="text-2xl text-white/85 font-serif italic font-light group-hover:text-white transition-colors">{item.name}</div>
                            </div>
                        ))}
                    </div>

                    <a href="#reservation" className="cta-btn inline-block px-14 py-4 border border-gold/35 text-gold font-mono text-[10px] tracking-[0.42em] uppercase hover:bg-gold/7 hover:border-gold/60 transition-all no-underline">
                        Reserve a Table
                    </a>
                </div>
            </div>
        </section>
    );
}