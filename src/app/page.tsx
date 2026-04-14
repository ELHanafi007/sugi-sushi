'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { menuData, CATEGORIES, Dish } from '@/data/menuData';
import Navbar from '@/components/Navbar';

/* ─── Kinetic Hero ─── */
const KineticHero = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 0.2], [0, -10]);

  return (
    <section className="h-screen flex items-center justify-center relative overflow-hidden">
      <motion.div style={{ y, opacity, scale, rotate }} className="relative z-10 text-center">
        <span className="mono-tag mb-8 block opacity-50">Introducing</span>
        <h1 className="heading-huge liquid-gold">SUGI</h1>
        <div className="flex items-center justify-center gap-12 mt-4">
          <div className="h-px w-24 bg-gold/30" />
          <span className="text-4xl font-serif tracking-[0.5em] text-white/80">杉</span>
          <div className="h-px w-24 bg-gold/30" />
        </div>
      </motion.div>
      
      {/* Decorative large Kanji */}
      <motion.span 
        style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [0.03, 0]) }}
        className="absolute text-[60vw] font-serif text-gold leading-none select-none pointer-events-none"
      >
        杉
      </motion.span>
    </section>
  );
};

/* ─── Kinetic Menu ─── */
const KineticMenu = () => {
  const { lang, t } = useLanguage();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);

  return (
    <section id="menu" ref={containerRef} className="relative py-48 bg-bg">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-24">
          {/* Vertical Category HUD */}
          <div className="lg:w-1/4 sticky top-48 h-fit">
            <span className="mono-tag opacity-30 mb-8 block">Category Selection</span>
            <div className="flex flex-col gap-4">
              {CATEGORIES.filter(cat => menuData.some(d => d.category === cat)).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-left transition-all duration-500 group relative ${
                    activeCategory === cat ? 'pl-8 text-gold' : 'text-white/20 hover:text-white/50'
                  }`}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-[10px] opacity-50">
                      {CATEGORIES.indexOf(cat).toString().padStart(2, '0')}
                    </span>
                    <span className="text-2xl font-serif uppercase tracking-widest uppercase">{t(`menu.cat.${cat}`)}</span>
                  </div>
                  {activeCategory === cat && (
                    <motion.div 
                      layoutId="catUnderline"
                      className="absolute left-0 top-1/2 w-6 h-px bg-gold"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Scrolling Grid */}
          <div className="lg:w-3/4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24"
              >
                {menuData.filter(d => d.category === activeCategory).map((dish, i) => (
                  <motion.div
                    key={dish.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group"
                  >
                    <div className="flex flex-col gap-6">
                      <div className="flex justify-between items-start border-b border-white/10 pb-4">
                        <div className="flex flex-col gap-2">
                          <span className="mono-tag !text-white/30">{dish.id.split('-')[0]}</span>
                          <h3 className="text-3xl font-serif tracking-tight group-hover:text-gold transition-colors">
                            {lang === 'ar' ? dish.nameAr || dish.name : dish.name}
                          </h3>
                        </div>
                        <span className="text-2xl font-mono text-gold/80 italic">{dish.price}</span>
                      </div>
                      
                      <p className="text-white/50 text-sm leading-relaxed max-w-sm italic">
                        {lang === 'ar' ? dish.descriptionAr || dish.description : dish.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {dish.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 hud-border rounded-full text-[9px] uppercase tracking-tighter opacity-40 group-hover:opacity-100 transition-opacity">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── Immersive Story ─── */
const ImmersiveStory = () => {
  const { t } = useLanguage();
  return (
    <section id="story" className="min-h-screen flex items-center justify-center py-48 relative px-6">
      <div className="max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <span className="mono-tag mb-12 block">The Philosophy</span>
          <h2 className="text-6xl md:text-8xl font-serif mb-16 leading-tight italic">
            "Perfection is not a destination, but a <span className="liquid-gold">way of being.</span>"
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left text-white/60">
            <p className="text-lg leading-relaxed font-serif">{t('story.p1')}</p>
            <p className="text-lg leading-relaxed font-serif">{t('story.p2')}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ─── Main Page ─── */
export default function Home() {
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <main className="bg-bg text-white relative min-h-screen">
      <Navbar />
      <KineticHero />
      <KineticMenu />
      <ImmersiveStory />
      
      {/* Footer Utility */}
      <footer id="contact" className="py-24 border-t border-white/5 text-center relative overflow-hidden">
        <span className="heading-huge opacity-[0.02] absolute left-0 right-0 pointer-events-none">SUGI SUSHI</span>
        <div className="container mx-auto px-6 relative z-10">
          <span className="mono-tag opacity-20 block mb-4">© 2026 Crafted with obsession</span>
          <div className="flex justify-center gap-12">
            <a href="#" className="mono-tag hover:text-white transition-colors">Instagram</a>
            <a href="#" className="mono-tag hover:text-white transition-colors">Twitter</a>
            <a href="#" className="mono-tag hover:text-white transition-colors">Vimeo</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
