'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Lenis from 'lenis';
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

export default function ZoomExperience() {
    const { t } = useLanguage();

	React.useEffect( () => {
        const lenis = new Lenis();
       
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

	const images = [
		{
			src: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1280&h=720&fit=crop&q=80',
			alt: 'Masterfully crafted Nigiri',
		},
		{
			src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1280&h=720&fit=crop&q=80',
			alt: 'Luxurious Restaurant Interior',
		},
		{
			src: 'https://images.unsplash.com/photo-1580828369019-2238b909ca8c?w=800&h=800&fit=crop&q=80',
			alt: 'Chef Artistry Close-up',
		},
		{
			src: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1280&h=720&fit=crop&q=80',
			alt: 'Symmetry of Sushi',
		},
		{
			src: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&h=800&fit=crop&q=80',
			alt: 'Gourmet Ramen Presentation',
		},
		{
			src: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db76?w=1280&h=720&fit=crop&q=80',
			alt: 'Elegant Table Setting',
		},
		{
			src: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=1280&h=720&fit=crop&q=80',
			alt: 'Seasonal Sashimi Platter',
		},
	];

	return (
		<section className="relative w-full bg-bg overflow-hidden">
			{/* Cinematic Intro */}
			<div className="relative flex h-[60vh] flex-col items-center justify-center text-center px-4">
				{/* Radial spotlight */}
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

            {/* The Zoom Parallax Core */}
			<ZoomParallax images={images} />

            {/* The Narrative Landing — Preventing the 'Black Void' */}
            <div className="relative z-20 bg-bg pt-20 pb-40">
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

