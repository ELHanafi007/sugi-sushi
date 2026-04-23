'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const GALLERY_ITEMS = [
  {
    src: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&w=1600&q=80',
    titleEn: 'Chef Precision',
    titleAr: 'دقة الشيف',
    tagEn: 'Craft',
    tagAr: 'حرفة',
  },
  {
    src: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=1400&q=80',
    titleEn: 'Sushi Platter',
    titleAr: 'طبق سوشي',
    tagEn: 'Signature',
    tagAr: 'التوقيع',
  },
  {
    src: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1400&q=80',
    titleEn: 'Nigiri Moment',
    titleAr: 'لحظة نيجيري',
    tagEn: 'Fresh',
    tagAr: 'طازج',
  },
  {
    src: 'https://images.unsplash.com/photo-1562158070-57ad9956b86a?auto=format&fit=crop&w=1400&q=80',
    titleEn: 'Warm Ambience',
    titleAr: 'أجواء دافئة',
    tagEn: 'Atmosphere',
    tagAr: 'أجواء',
  },
  {
    src: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&w=1400&q=80',
    titleEn: 'Knife & Fire',
    titleAr: 'سكين ونار',
    tagEn: 'Performance',
    tagAr: 'عرض',
  },
  {
    src: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?auto=format&fit=crop&w=1400&q=80',
    titleEn: 'Omakase Table',
    titleAr: 'طاولة أوماكاسي',
    tagEn: 'Experience',
    tagAr: 'تجربة',
  },
  {
    src: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=1400&q=80',
    titleEn: 'Night Counter',
    titleAr: 'ركن ليلي',
    tagEn: 'Atmosphere',
    tagAr: 'أجواء',
  },
];

const CARD_LAYOUT = [
  'md:col-span-2 md:row-span-2 h-[520px] md:h-[620px]',
  'h-[300px] md:h-[300px]',
  'h-[340px] md:h-[420px]',
  'h-[320px] md:h-[360px]',
  'md:col-span-2 h-[340px] md:h-[420px]',
  'h-[320px] md:h-[360px]',
  'h-[320px] md:h-[360px]',
];

function PremiumCard({
  item,
  idx,
  isRTL,
  scrollProgress,
}: {
  item: (typeof GALLERY_ITEMS)[number];
  idx: number;
  isRTL: boolean;
  scrollProgress: MotionValue<number>;
}) {
  const depth = (idx % 2 === 0 ? 1 : -1) * (28 + idx * 4);
  const y = useTransform(scrollProgress, [0, 1], [depth, -depth]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-120px' }}
      transition={{ duration: 0.9, delay: idx * 0.06, ease: [0.19, 1, 0.22, 1] }}
      style={{ y }}
      className={`group relative overflow-hidden rounded-[2rem] luxury-card ${CARD_LAYOUT[idx % CARD_LAYOUT.length]}`}
    >
      <div className="absolute inset-0">
        <Image
          src={item.src}
          alt={isRTL ? item.titleAr : item.titleEn}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-[2400ms] ease-out group-hover:scale-110"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.18),transparent_42%)] opacity-60" />

      <motion.div
        aria-hidden="true"
        initial={{ x: '-130%' }}
        whileHover={{ x: '130%' }}
        transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
        className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/18 to-transparent skew-x-[-20deg]"
      />

      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <p className="text-gold/75 text-[10px] uppercase tracking-[0.45em] font-mono mb-3">
          {isRTL ? item.tagAr : item.tagEn}
        </p>
        <h3 className="text-white text-2xl md:text-4xl font-serif italic leading-tight">
          {isRTL ? item.titleAr : item.titleEn}
        </h3>
      </div>
    </motion.article>
  );
}

export default function ZoomExperience() {
  const { isRTL } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section ref={sectionRef} className="relative w-full bg-bg py-24 md:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.06),transparent_60%)] pointer-events-none" />
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          style={{ y: titleY }}
          className="mb-16 md:mb-20 text-center"
        >
          <p className="text-mono text-gold/60 text-[10px] tracking-[0.7em] mb-6 uppercase">
            {isRTL ? 'المعرض' : 'Gallery'}
          </p>
          <h2 className="text-white text-4xl md:text-7xl italic font-light leading-tight">
            {isRTL ? 'لقطات من روح' : 'Moments of the'}
            <span className="shimmer-gold not-italic !font-black"> {isRTL ? 'سوجي' : 'Sugi Spirit'}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 auto-rows-auto">
          {GALLERY_ITEMS.map((item, idx) => (
            <PremiumCard
              key={item.src}
              item={item}
              idx={idx}
              isRTL={isRTL}
              scrollProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}