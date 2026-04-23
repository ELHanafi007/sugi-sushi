'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
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
];

export default function ZoomExperience() {
  const { isRTL } = useLanguage();

  return (
    <section className="relative w-full bg-bg py-24 md:py-36">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {GALLERY_ITEMS.map((item, idx) => (
            <motion.article
              key={item.src}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: idx * 0.08 }}
              className="group relative overflow-hidden rounded-[2rem] luxury-card"
            >
              <div className="relative h-[320px] md:h-[360px]">
                <Image
                  src={item.src}
                  alt={isRTL ? item.titleAr : item.titleEn}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                <p className="text-gold/70 text-[10px] uppercase tracking-[0.45em] font-mono mb-3">
                  {isRTL ? item.tagAr : item.tagEn}
                </p>
                <h3 className="text-white text-2xl md:text-3xl font-serif italic leading-tight">
                  {isRTL ? item.titleAr : item.titleEn}
                </h3>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}