'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import Lenis from 'lenis';
import { useLanguage } from '@/context/LanguageContext';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import Image from 'next/image';

const galleryData = [
  { id: 1, src: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1600&h=1200&fit=crop&q=80', x: -20, y: -15, zOffset: 0, w: 'w-[60vw] md:w-[30vw]', aspect: 'aspect-[4/5]', label: 'PRECISION' },
  { id: 2, src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&h=1200&fit=crop&q=80', x: 25, y: 20, zOffset: -1000, w: 'w-[70vw] md:w-[40vw]', aspect: 'aspect-[16/9]', label: 'SANCTUARY' },
  { id: 3, src: 'https://images.unsplash.com/photo-1580828369019-2238b909ca8c?w=1200&h=1600&fit=crop&q=80', x: -25, y: 25, zOffset: -2000, w: 'w-[50vw] md:w-[25vw]', aspect: 'aspect-[3/4]', label: 'FOCUS' },
  { id: 4, src: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1600&h=1200&fit=crop&q=80', x: 20, y: -25, zOffset: -3000, w: 'w-[65vw] md:w-[35vw]', aspect: 'aspect-square', label: 'UMAMI' },
  { id: 5, src: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=1200&h=1600&fit=crop&q=80', x: -10, y: -20, zOffset: -4000, w: 'w-[55vw] md:w-[30vw]', aspect: 'aspect-[4/5]', label: 'ESSENCE' },
  { id: 6, src: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db76?w=1600&h=1200&fit=crop&q=80', x: 30, y: 5, zOffset: -5000, w: 'w-[75vw] md:w-[45vw]', aspect: 'aspect-[16/9]', label: 'TEMPORAL' },
  // The Final Masterpiece
  { id: 7, src: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=1600&h=1200&fit=crop&q=80', x: 0, y: 0, zOffset: -6000, w: 'w-[100vw]', aspect: 'h-[100vh]', label: '', isFinal: true },
];

function FlyThroughImage({ item, progress }: { item: any, progress: any }) {
    const travel = 6000;
    const relativeZ = useTransform(progress, [0, 1], [item.zOffset, item.zOffset + travel]);

    const opacityRanges = item.isFinal 
        ? [-5000, -2000, 0, 1000] 
        : [-4000, -1500, 0, 500];
    const opacityValues = item.isFinal
        ? [0, 1, 1, 1]
        : [0, 1, 1, 0];
        
    const opacity = useTransform(relativeZ, opacityRanges, opacityValues);

    const blurRanges = item.isFinal
        ? [-5000, -1000, 0, 1000]
        : [-4000, -1000, 0, 500];
    const blurValues = item.isFinal
        ? ['blur(20px)', 'blur(0px)', 'blur(0px)', 'blur(0px)']
        : ['blur(20px)', 'blur(0px)', 'blur(0px)', 'blur(20px)'];
        
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
            }}
            className={`flex flex-col items-center justify-center ${item.w} ${item.aspect} ${item.isFinal ? '' : 'luxury-card rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] p-2'}`}
        >
            <div className={`relative w-full h-full ${item.isFinal ? '' : 'rounded-[2rem] overflow-hidden'}`}>
                <Image 
                    src={item.src} 
                    alt={item.label} 
                    fill 
                    sizes={item.isFinal ? "100vw" : "50vw"}
                    className={`object-cover ${item.isFinal ? 'brightness-[0.6]' : ''}`}
                    priority={item.isFinal}
                />
                {!item.isFinal && (
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
                )}
                {!item.isFinal && (
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                        <span className="mono-tag !bg-black/50 !backdrop-blur-md !border-white/10 !text-gold/80 shadow-2xl">{item.label}</span>
                    </div>
                )}
            </div>
            {item.isFinal && (
                 <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
            )}
        </motion.div>
    );
}

export default function ZoomExperience() {
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const lenis = new Lenis({
            lerp: 0.05,
            smoothWheel: true,
        });
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    });

    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

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

    const rotateX = useSpring(useTransform(mouseY, [0, 1], [5, -5]), { stiffness: 50, damping: 20 });
    const rotateY = useSpring(useTransform(mouseX, [0, 1], [-5, 5]), { stiffness: 50, damping: 20 });

    return (
        <section className="relative w-full bg-bg overflow-hidden">
            {/* Cinematic Intro */}
            <div className="relative flex h-[60vh] flex-col items-center justify-center text-center px-4">
                <div
                    aria-hidden="true"
                    className={cn(
                        'pointer-events-none absolute -top-1/2 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 rounded-full',
                        'bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.1),transparent_70%)]',
                        'blur-[100px]',
                    )}
                />
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5 }}
                    className="flex items-center gap-4 mb-8 justify-center"
                >
                    <div className="w-12 h-[1px] bg-gold/40" />
                    <span className="text-mono text-gold text-[10px] tracking-[1em] uppercase font-black">Visual Symphony</span>
                    <div className="w-12 h-[1px] bg-gold/40" />
                </motion.div>
                <motion.h2 
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 2 }}
                    className="text-6xl md:text-9xl text-white font-serif italic font-light leading-none"
                >
                    The <br />
                    <span className="text-gold shimmer-gold">Soul.</span>
                </motion.h2>
            </div>

            {/* MINDBLOWING 3D FLY-THROUGH GALLERY */}
            <div ref={containerRef} className="relative h-[800vh] bg-bg">
                <div className="sticky top-0 h-screen overflow-hidden bg-bg" style={{ perspective: '1200px' }}>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.03),transparent_70%)] pointer-events-none" />
                    
                    <motion.div 
                        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                        className="absolute inset-0 w-full h-full origin-center"
                    >
                        {galleryData.map((item, idx) => (
                            <FlyThroughImage key={idx} item={item} progress={smoothProgress} />
                        ))}
                    </motion.div>
                    
                    {/* Floating Center Narrative Text */}
                    <motion.div 
                        style={{ opacity: useTransform(smoothProgress, [0, 0.1, 0.8, 0.9], [1, 1, 1, 0]) }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[100] text-center mix-blend-overlay"
                    >
                        <h2 className="text-white text-6xl md:text-[10rem] font-serif italic opacity-20 whitespace-nowrap">
                            The Archive
                        </h2>
                    </motion.div>

                    {/* Progress Indicator */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-50">
                        <span className="text-gold/40 text-[8px] uppercase tracking-[0.5em] font-mono">Traversing Memory</span>
                        <div className="w-32 h-[1px] bg-white/5 relative overflow-hidden">
                            <motion.div 
                                style={{ scaleX: smoothProgress }}
                                className="absolute inset-0 bg-gold origin-left"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* The Narrative Landing — Directly following the fly-through */}
            <div className="relative z-20 bg-bg pt-32 pb-40">
                <div className="container-luxury">
                    <div className="max-w-4xl mx-auto text-center space-y-16">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.5 }}
                            className="space-y-8"
                        >
                            <h3 className="text-gold text-[11px] uppercase tracking-[0.8em] font-black font-mono">
                                The Legacy of Flavor
                            </h3>
                            <h4 className="text-4xl md:text-7xl text-white font-serif italic font-light leading-tight">
                                Where every grain of rice <br /> 
                                <span className="opacity-50">tells a thousand-year story.</span>
                            </h4>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 2, delay: 0.5 }}
                            className="w-px h-32 bg-gradient-to-b from-gold/50 to-transparent mx-auto" 
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1.5 }}
                            >
                                <p className="text-white/70 text-lg md:text-xl font-serif italic leading-relaxed">
                                    At Sugi Sushi, we believe that the true essence of Japanese cuisine lies in the pursuit of perfection within simplicity. Our gallery is a testament to the hands that craft, the sea that provides, and the fire that transforms.
                                </p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1.5 }}
                                className="space-y-6"
                            >
                                <p className="text-white/40 text-sm md:text-base font-light leading-relaxed">
                                    From the precision of the sushi knife to the gentle steam of artisanal ramen, each image captures a moment of "Ichi-go Ichi-e"—the philosophy that this exact moment will never happen again.
                                </p>
                                <div className="flex items-center gap-6 pt-4">
                                    <div className="h-px w-12 bg-gold/30" />
                                    <span className="text-gold/50 text-[10px] uppercase font-mono tracking-widest font-black">Est. Riyadh 2024</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-[20vh]"/>
        </section>
    );
}
