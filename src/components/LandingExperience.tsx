'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const r = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(r);
  }, []);

  return (
    <section
      className="relative h-dvh h-[100dvh] w-full flex flex-col items-center
                 justify-center overflow-hidden"
    >
      {/* ─── Ambient Background ─── */}
      {/* Soft radial glow — top center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px]
                      bg-gold/[0.04] blur-[120px] rounded-full pointer-events-none" />

      {/* Subtle side glow */}
      <div className="absolute bottom-0 right-0 w-[200px] h-[200px]
                      bg-vermilion/[0.02] blur-[80px] rounded-full pointer-events-none" />

      {/* Grain overlay */}
      <div className="absolute inset-0 grain pointer-events-none" />

      {/* ─── Main Content ─── */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Top decorative line */}
        <div
          className={`w-12 h-[1px] mb-10 transition-all duration-1000 ease-out
                      ${visible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)',
            transformOrigin: 'center',
          }}
        />

        {/* Kanji — Centerpiece */}
        <div className="relative">
          <span
            className={`text-[100px] font-serif text-gold select-none leading-none
                        block transition-all duration-[1500ms] ease-out
                        ${visible
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-6'
                        }`}
            style={{
              animation: visible ? 'kanji-pulse 5s ease-in-out infinite' : 'none',
            }}
          >
            {t('hero.kanji')}
          </span>

          {/* Soft glow behind kanji */}
          <div className="absolute inset-0 bg-gold/[0.06] blur-[60px] rounded-full -z-10" />
        </div>

        {/* Brand Name */}
        <p
          className={`text-text-secondary/70 text-[10px] uppercase tracking-[0.6em]
                      font-serif mt-6 transition-all duration-1000 delay-300 ease-out
                      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {t('hero.brand')}
        </p>

        {/* Tagline */}
        <p
          className={`text-text-muted text-[9px] uppercase tracking-[0.4em]
                      font-serif mt-3 transition-all duration-1000 delay-500 ease-out
                      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {t('hero.tagline')}
        </p>

        {/* Bottom decorative line */}
        <div
          className={`w-8 h-[1px] mt-8 transition-all duration-1000 delay-700 ease-out
                      ${visible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)',
            transformOrigin: 'center',
          }}
        />
      </div>

      {/* ─── Scroll Indicator ─── */}
      <div
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-10
                    flex flex-col items-center gap-2
                    transition-opacity duration-1000 delay-1000
                    ${visible ? 'opacity-100' : 'opacity-0'}`}
      >
        <span className="text-[7px] uppercase tracking-[0.5em] text-gold/30 font-serif">
          {t('hero.scroll')}
        </span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-gold/20 to-transparent rounded-full relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 w-full h-1/2 bg-gold/40 rounded-full scroll-hint" />
        </div>
      </div>

      {/* ─── Fixed Kanji Seal (bottom-right watermark) ─── */}
      <div className="fixed bottom-3 right-3 text-[80px] font-serif select-none
                      pointer-events-none text-gold/[0.015] z-0 leading-none">
        杉
      </div>
    </section>
  );
}
