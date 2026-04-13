'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setLoaded(true));
  }, []);

  return (
    <section className="relative h-dvh w-full flex flex-col items-center justify-center overflow-hidden">
      {/* ─── Ambient Background Layers ─── */}
      {/* Top center warm glow */}
      <div
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[400px] h-[400px]
                    rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(201,168,76,0.04), transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Bottom right subtle red */}
      <div
        className="absolute bottom-[-5%] right-[-10%] w-[250px] h-[250px]
                    rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(160,50,42,0.03), transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
      {/* Center kanji glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    w-[200px] h-[200px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(201,168,76,0.03), transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* ─── Content ─── */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Top decorative line */}
        <div
          className="w-10 h-px mb-10 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)',
            transformOrigin: 'center',
            transform: loaded ? 'scaleX(1)' : 'scaleX(0)',
            opacity: loaded ? 1 : 0,
          }}
        />

        {/* Kanji */}
        <div className="relative">
          <span
            className="text-[90px] sm:text-[110px] font-serif text-gold select-none leading-none block transition-all duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(16px)',
              animation: loaded ? 'kanji-glow 6s ease-in-out infinite' : 'none',
            }}
          >
            {t('hero.tagline')[0] === 'الفن' ? '杉' : '杉'}
          </span>
          {/* Glow behind kanji */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(201,168,76,0.06), transparent 70%)',
              filter: 'blur(50px)',
            }}
          />
        </div>

        {/* Brand Name */}
        <p
          className="text-text-secondary/60 text-[9px] uppercase tracking-[0.5em] font-serif mt-8
                     transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(10px)',
            transitionDelay: '200ms',
          }}
        >
          {t('hero.brand')}
        </p>

        {/* Tagline */}
        <p
          className="text-text-muted/50 text-[9px] uppercase tracking-[0.35em] font-serif mt-3
                     transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(10px)',
            transitionDelay: '350ms',
          }}
        >
          {t('hero.tagline')}
        </p>

        {/* Bottom decorative line */}
        <div
          className="w-6 h-px mt-8 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.35), transparent)',
            transformOrigin: 'center',
            transform: loaded ? 'scaleX(1)' : 'scaleX(0)',
            opacity: loaded ? 1 : 0,
            transitionDelay: '500ms',
          }}
        />

        {/* Explore CTA */}
        <a
          href="#menu"
          className="mt-10 inline-flex items-center gap-2 px-6 py-2.5 rounded-full
                     border border-stroke bg-white/[0.02]
                     text-gold/70 text-[8px] uppercase tracking-[0.3em] font-serif
                     hover:border-gold/20 hover:bg-gold/[0.04]
                     active:scale-95 transition-all duration-300"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 1s cubic-bezier(0.16,1,0.3,1)',
            transitionDelay: '650ms',
          }}
        >
          {t('hero.explore')}
          <span className="text-[10px]">↓</span>
        </a>
      </div>

      {/* ─── Scroll Indicator ─── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10
                   flex flex-col items-center gap-2"
        style={{
          opacity: loaded ? 0.5 : 0,
          transition: 'opacity 1.5s ease',
          transitionDelay: '1200ms',
        }}
      >
        <div className="w-px h-8 relative overflow-hidden rounded-full bg-gradient-to-b from-transparent via-gold/20 to-transparent">
          <div
            className="absolute inset-x-0 top-0 w-full h-1/2 rounded-full bg-gold/30"
            style={{ animation: 'scroll-arrow 2s ease-in-out infinite' }}
          />
        </div>
      </div>
    </section>
  );
}
