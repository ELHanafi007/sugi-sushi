'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const CARDS = [
  {
    src:   'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&h=900&fit=crop&q=85',
    label: 'Omakase',
    sub:   "Chef's Selection",
    x: -7, y: -5, w: 520, h: 370,
  },
  {
    src:   'https://images.unsplash.com/photo-1553621042-f6e147245754?w=900&h=1200&fit=crop&q=85',
    label: 'Sashimi',
    sub:   "Ocean's Finest",
    x: 13, y: 9, w: 330, h: 445,
  },
  {
    src:   'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&h=900&fit=crop&q=85',
    label: 'Sanctuary',
    sub:   'The Experience',
    x: -16, y: 5, w: 580, h: 374,
  },
  {
    src:   'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=900&h=900&fit=crop&q=85',
    label: 'Ramen',
    sub:   'Soul in a Bowl',
    x: 15, y: -9, w: 390, h: 390,
  },
  {
    src:   'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=1400&h=900&fit=crop&q=85',
    label: 'Nigiri',
    sub:   'Pure Precision',
    x: -9, y: 11, w: 560, h: 368,
  },
  {
    src:   'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&h=900&fit=crop&q=85',
    label: 'Yakitori',
    sub:   'Fire & Craft',
    x: 12, y: -8, w: 490, h: 370,
  },
  {
    src:   'https://images.unsplash.com/photo-1476224203421-9ac39bcb3b8e?w=1400&h=900&fit=crop&q=85',
    label: 'Kaiseki',
    sub:   'The Full Journey',
    x: -4, y: 4, w: 540, h: 390,
  },
];

const STEP        = 1100;  // Z gap between cards (px)
const TOTAL_DEPTH = STEP * (CARDS.length - 1);
const SCROLL_PX   = 6000;  // total scrollable px for the experience

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function cardOpacity(i: number, camZ: number) {
  const relZ = (-i * STEP) + camZ;
  if (relZ >  380) return 0;   // passed camera, invisible
  if (relZ < -960) return 0;   // too far ahead, not yet
  if (relZ < -580) return (relZ + 960) / 380;
  if (relZ >   80) return 1 - (relZ - 80) / 300;
  return 1;
}

export default function ZoomExperience() {
  const { t, isRTL } = useLanguage();
  const worldRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const introRef = useRef<HTMLDivElement>(null);
  const endCardRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  
  const camZ = useRef(0);
  const targetCamZ = useRef(0);
  const isEnded = useRef(false);

  const [mScale, setMScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      setMScale(window.innerWidth < 700 ? 0.58 : 1);
    };
    
    updateScale();
    window.addEventListener('resize', updateScale);
    
    let animationFrameId: number;
    const tick = () => {
      // Smooth lerp toward target
      camZ.current = lerp(camZ.current, targetCamZ.current, 0.075);
      const progress = Math.min(1, Math.max(0, camZ.current / TOTAL_DEPTH));

      // ── Move the world (= camera traveling forward) ──────────────────────
      if (worldRef.current) {
        worldRef.current.style.transform = `translateZ(${camZ.current}px)`;
      }

      // ── Per-card opacity ─────────────────────────────────────────────────
      cardRefs.current.forEach((el, i) => {
        if (el) {
          el.style.opacity = cardOpacity(i, camZ.current).toString();
        }
      });

      // ── Progress bar ─────────────────────────────────────────────────────
      if (progressFillRef.current) {
        progressFillRef.current.style.transform = `scaleX(${progress})`;
      }

      // ── Intro (fades out as scroll begins) ───────────────────────────────
      if (introRef.current) {
        introRef.current.style.opacity = Math.max(0, 1 - progress * 12).toFixed(3);
      }

      // ── End state ────────────────────────────────────────────────────────
      if (progress >= 0.93 && !isEnded.current) {
        isEnded.current = true;
        if (endCardRef.current) endCardRef.current.style.opacity = '1';
        if (statusRef.current) {
          statusRef.current.textContent = isRTL ? 'اكتملت التجربة' : 'Experience Complete';
          statusRef.current.style.color = 'rgba(201,168,76,0.7)';
        }
      } else if (progress < 0.88 && isEnded.current) {
        isEnded.current = false;
        if (endCardRef.current) endCardRef.current.style.opacity = '0';
        if (statusRef.current) {
          statusRef.current.textContent = isRTL ? 'عبور الذاكرة' : 'Traversing Memory';
          statusRef.current.style.color = 'rgba(201,168,76,0.35)';
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const rawProgress = Math.min(1, Math.max(0, scrollY / SCROLL_PX));
      targetCamZ.current = rawProgress * TOTAL_DEPTH;

      // Fade HUD + scene once user scrolls into content after
      const pastExperience = scrollY > SCROLL_PX + 60;
      if (hudRef.current) hudRef.current.style.opacity = pastExperience ? '0' : '1';
      if (sceneRef.current) sceneRef.current.style.opacity = pastExperience ? '0' : '1';
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    tick();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScale);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isRTL]);

  return (
    <section className="relative w-full bg-bg overflow-x-hidden">
      {/* ═══════════════════════════════════════
        SCENE (fixed)
      ═══════════════════════════════════════ */}
      <div id="scene" ref={sceneRef} className="fixed inset-0 z-10 bg-bg transition-opacity duration-700 pointer-events-none" style={{ perspective: '900px', perspectiveOrigin: '50% 50%' }}>
        {/* Ambient center glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(201,168,76,0.055)_0%,transparent_65%)] pointer-events-none z-0" />
        
        {/* Vignette corners */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_55%,rgba(6,6,6,0.7)_100%)] pointer-events-none z-[2]" />

        <div id="world" ref={worldRef} className="absolute inset-0 transition-transform duration-0 ease-linear" style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
          {CARDS.map((card, i) => {
            const w = Math.round(card.w * mScale);
            const h = Math.round(card.h * mScale);
            return (
              <div
                key={i}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="card absolute left-1/2 top-1/2 rounded-[20px] overflow-hidden transition-opacity duration-0 shadow-[0_0_0_1px_rgba(201,168,76,0.13),0_30px_70px_rgba(0,0,0,0.85),0_70px_140px_rgba(0,0,0,0.5)]"
                style={{
                  width: `${w}px`,
                  height: `${h}px`,
                  transform: `translate(calc(-50% + ${card.x}vw), calc(-50% + ${card.y}vh)) translateZ(${-i * STEP}px)`,
                  opacity: i === 0 ? 1 : 0,
                  transformStyle: 'preserve-3d',
                  willChange: 'opacity'
                }}
              >
                <img 
                  src={card.src} 
                  alt={card.label} 
                  className="block w-full h-full object-cover pointer-events-none select-none scale-[1.01]" 
                />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/65" />
                <div className="absolute top-8 bottom-8 left-0 w-[2px] bg-gradient-to-b from-transparent via-gold to-transparent opacity-40" />
                <div className="absolute bottom-6.5 left-6.5 text-left p-6">
                  <div className="font-mono text-[8.5px] font-bold tracking-[0.38em] uppercase text-gold opacity-80 mb-1">{card.sub}</div>
                  <div className="font-serif text-3xl font-light italic text-white/95 tracking-wide leading-none">{card.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════
        HUD (fixed, above scene)
      ═══════════════════════════════════════ */}
      <div id="hud" ref={hudRef} className="fixed inset-0 z-50 pointer-events-none transition-opacity duration-700">
        {/* Intro */}
        <div id="intro" ref={introRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center will-change-opacity">
          <div className="flex items-center justify-center gap-3.5 mb-5.5">
            <div className="w-14 h-px bg-gold/25" />
            <div className="w-1 h-1 rounded-full bg-gold opacity-45" />
            <div className="w-14 h-px bg-gold/25" />
          </div>
          <div className="font-mono text-[9px] tracking-[0.52em] uppercase text-gold opacity-60 mb-5">
            {isRTL ? 'الأرشيف المكاني' : 'Spatial Archive'}
          </div>
          <h1 className="text-[clamp(60px,11vw,130px)] font-light italic leading-[0.9] tracking-[-0.01em] text-white whitespace-nowrap">
            {isRTL ? <>الـ<em>معرض.</em></> : <>The <em>Gallery.</em></>}
          </h1>
          <div className="mt-9.5 font-mono text-[8.5px] tracking-[0.48em] uppercase text-white/22 animate-pulse">
            {isRTL ? '↓ اسحب للاستكشاف ↓' : '↓ Scroll to Explore ↓'}
          </div>
        </div>

        {/* End card */}
        <div id="end-card" ref={endCardRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-0 transition-opacity duration-1100 whitespace-nowrap">
          <div className="font-mono text-[9px] tracking-[0.5em] uppercase text-gold opacity-60 mb-4.5">
            {isRTL ? 'استكشف القائمة' : 'Explore the Menu'}
          </div>
          <div className="text-[clamp(46px,7.5vw,96px)] font-light italic leading-[0.93] text-white mb-9">
            {isRTL ? <>حيث يلتقي <em>الفن</em><br/>بالمذاق.</> : <>Where <em>art</em><br/>meets flavor.</>}
          </div>
          <div className="font-mono text-[8.5px] tracking-[0.45em] uppercase text-white/20 animate-pulse">
            {isRTL ? '↓ استمر ↓' : '↓ Continue ↓'}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-9.5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <div id="status" ref={statusRef} className="font-mono text-[8.5px] tracking-[0.42em] uppercase text-gold/35 transition-colors duration-600">
            {isRTL ? 'عبور الذاكرة' : 'Traversing Memory'}
          </div>
          <div className="w-[200px] h-px bg-white/7 relative">
            <div id="progress-fill" ref={progressFillRef} className="absolute inset-0 bg-gradient-to-r from-gold/35 to-gold origin-left scale-x-0 will-change-transform" />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
        SCROLL CAPTURE
      ═══════════════════════════════════════ */}
      <div id="spacer" className="relative h-[6000px] w-full" />

      {/* ═══════════════════════════════════════
        CONTENT AFTER
      ═══════════════════════════════════════ */}
      <div id="after" className="relative z-[110] bg-bg px-10 pt-[140px] pb-[120px] text-center">
        <div className="absolute top-0 left-0 right-0 h-[180px] bg-gradient-to-b from-transparent to-bg pointer-events-none" />
        
        <div className="font-mono text-[9px] tracking-[0.52em] uppercase text-gold opacity-60 mb-5.5">
          {isRTL ? 'قائمتنا' : 'Our Menu'}
        </div>
        <h2 className="text-[clamp(44px,8vw,100px)] font-light italic leading-[0.93] text-white mb-20">
          {isRTL ? <>رحلة عبر<br/><em>المذاق.</em></> : <>A Journey Through<br/><em>Flavor.</em></>}
        </h2>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-px max-w-[860px] mx-auto border border-white/4 mb-20">
          {[
            { name: isRTL ? 'أوماكاسي' : 'Omakase', cat: isRTL ? 'توقيعنا' : 'Signature' },
            { name: isRTL ? 'ساشيمي' : 'Sashimi', cat: isRTL ? 'من البحر' : 'From the Sea' },
            { name: isRTL ? 'نيجيري' : 'Nigiri', cat: isRTL ? 'كلاسيك' : 'Classic' },
            { name: isRTL ? 'رامن' : 'Ramen', cat: isRTL ? 'دفء' : 'Warmth' },
            { name: isRTL ? 'ياكيتوري' : 'Yakitori', cat: isRTL ? 'نار' : 'Fire' },
            { name: isRTL ? 'كايسيكي' : 'Kaiseki', cat: isRTL ? 'إرث' : 'Legacy' }
          ].map((item, idx) => (
            <div key={idx} className="p-[44px_24px] text-center border border-white/4 cursor-pointer transition-all duration-350 hover:bg-gold/4 hover:border-gold/22">
              <div className="font-mono text-[8.5px] tracking-[0.38em] uppercase text-gold opacity-65 mb-2.5">{item.cat}</div>
              <div className="text-[26px] font-light italic text-white/85">{item.name}</div>
            </div>
          ))}
        </div>

        <a href="#reservation" className="cta-btn inline-block px-13 py-4 border border-gold/35 text-gold font-mono text-[10px] tracking-[0.42em] uppercase cursor-pointer transition-all duration-300 hover:bg-gold/7 hover:border-gold/60 no-underline">
          {isRTL ? 'احجز طاولة' : 'Reserve a Table'}
        </a>
      </div>
    </section>
  );
}