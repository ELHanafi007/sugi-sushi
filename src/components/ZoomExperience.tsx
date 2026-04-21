'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Lenis from 'lenis';
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { useLanguage } from '@/context/LanguageContext';

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
		<section className="relative w-full bg-bg overflow-hidden py-40">
			<div className="relative flex h-[40vh] flex-col items-center justify-center text-center px-4 mb-20">
				{/* Radial spotlight */}
				<div
					aria-hidden="true"
					className={cn(
						'pointer-events-none absolute -top-1/2 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 rounded-full',
						'bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.1),transparent_70%)]',
						'blur-[100px]',
					)}
				/>
                <div className="flex items-center gap-4 mb-8 justify-center">
                    <div className="w-12 h-[1px] bg-gold/40" />
                    <span className="text-mono text-gold text-[10px] tracking-[1em] uppercase font-black">Visual Symphony</span>
                    <div className="w-12 h-[1px] bg-gold/40" />
                </div>
				<h2 className="text-5xl md:text-8xl text-white font-serif italic font-light leading-none">
					Dive into <br />
					<span className="text-gold shimmer-gold">The Soul.</span>
				</h2>
			</div>
			<ZoomParallax images={images} />
			<div className="h-[20vh]"/>
		</section>
	);
}
