'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative h-dvh w-full flex flex-col items-center justify-center overflow-hidden bg-bg">
      {/* ─── Background Image ─── */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.25 }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: 'url(/media/optimized/hero-wallpaper-1.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-transparent to-bg" />
      </div>

      {/* ─── Ambient Background Layers ─── */}
      <div
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px]
                    rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(201,168,76,0.06), transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* ─── Content ─── */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Top decorative line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-16 h-px mb-12"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent)',
          }}
        />

        {/* Kanji */}
        <div className="relative mb-6">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[100px] sm:text-[130px] font-serif text-gold select-none leading-none block"
            style={{
              animation: 'kanji-glow 8s ease-in-out infinite',
              textShadow: '0 0 40px rgba(201, 168, 76, 0.1)',
            }}
          >
            杉
          </motion.span>
          {/* Subtle glow behind kanji */}
          <div
            className="absolute inset-0 -z-10 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(201,168,76,0.1), transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
        </div>

        {/* Brand Name */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-text text-[11px] uppercase tracking-[0.6em] font-serif font-medium"
        >
          {t('hero.brand')}
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-text-secondary/70 text-[10px] uppercase tracking-[0.4em] font-serif mt-4"
        >
          {t('hero.tagline')}
        </motion.p>

        {/* Bottom decorative line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.3, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-10 h-px mt-10"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)',
          }}
        />

        {/* Explore CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <a
            href="#menu"
            className="mt-14 group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full
                       border border-gold/20 bg-gold/[0.02] overflow-hidden
                       transition-all duration-500 hover:border-gold/40 hover:bg-gold/[0.05]"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-gold/[0.05] to-transparent" />
            
            <span className="text-gold text-[10px] uppercase tracking-[0.35em] font-serif font-semibold">
              {t('hero.explore')}
            </span>
            <span className="text-gold/60 group-hover:translate-y-1 transition-transform duration-300">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 2V10M6 10L3 7M6 10L9 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </a>
        </motion.div>
      </div>

      {/* ─── Scroll Indicator ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 2.2, duration: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
      >
        <span className="text-[7px] text-gold/30 uppercase tracking-[0.4em] font-serif">Scroll</span>
        <div className="w-px h-12 relative overflow-hidden rounded-full bg-gradient-to-b from-transparent via-gold/15 to-transparent">
          <div
            className="absolute inset-x-0 top-0 w-full h-1/2 rounded-full bg-gold/40"
            style={{ animation: 'scroll-arrow 2.5s ease-in-out infinite' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
