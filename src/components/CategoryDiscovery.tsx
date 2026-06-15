'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

interface CategoryDiscoveryProps {
  categories: { name: string; image: string }[];
  onCategorySelect: (category: string) => void;
}

export default function CategoryDiscovery({ categories, onCategorySelect }: CategoryDiscoveryProps) {
  const { t } = useLanguage();

  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full py-24 bg-bg overflow-hidden">
      <div className="container-luxury">
        <div className="flex flex-col gap-4 mb-12">
          <span className="text-mono text-gold text-[10px] tracking-[0.8em] uppercase font-black">Exploration</span>
          <h2 className="text-white text-4xl md:text-6xl font-serif italic">Curated <span className="text-gold shimmer-gold">Selections</span></h2>
        </div>

        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-12 -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="flex-shrink-0 w-64 md:w-80 group cursor-pointer"
              onClick={() => onCategorySelect(cat.name)}
            >
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden luxury-card mb-6">
                <Image
                  src={cat.image || 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80'}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-8 left-8 right-8">
                  <span className="text-gold/60 text-[8px] tracking-[0.4em] uppercase font-black font-mono block mb-2">{t('menu.cat_label')}</span>
                  <h3 className="text-white text-2xl font-serif italic">{t(`menu.cat.${cat.name}`)}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
