'use client';

import { useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring
} from 'framer-motion';
import { Images } from 'lucide-react';

import { useLanguage, NavTab } from '@/context/LanguageContext';

interface NavbarProps {
  onTabChange: (tab: NavTab) => void;
  activeTab: NavTab;
}

export default function Navbar({ onTabChange, activeTab }: NavbarProps) {
  const { lang, setLang, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = activeTab === 'home';

  /* =========================
     SCROLL MORPH ENGINE
  ========================== */
  const { scrollY } = useScroll();

  const progressRaw = useTransform(scrollY, [0, 160], [0, 1]);
  const progress = useSpring(progressRaw, {
    stiffness: 120,
    damping: 25
  });

  /* =========================
     LOGO ANIMATION
  ========================== */
  const logoY = useTransform(progress, [0, 1], [120, 0]);
  const logoScale = useTransform(progress, [0, 1], [3.2, 1]);

  /* =========================
     NAV ANIMATION
  ========================== */
  const navOpacity = useTransform(progress, [0.5, 1], [0, 1]);
  const navHeight = useTransform(progress, [0, 1], [140, 80]);
  const logoFadeScale = useTransform(progress, [0.5, 1], [0.85, 1]);

  const bgOpacity = useTransform(progress, [0, 1], [0.2, 0.85]);

  /* =========================
     NAV ITEMS
  ========================== */
  const navItems: { id: 'home' | 'menu' | 'gallery'; labelKey: string; hasIcon?: boolean }[] = [
    { id: 'home', labelKey: 'nav.home' },
    { id: 'menu', labelKey: 'nav.menu' },
    { id: 'gallery', labelKey: 'nav.gallery', hasIcon: true },
  ];

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <motion.header
        style={{
          height: isHome ? navHeight : 80,
          backgroundColor: `rgba(6,6,8,${isHome ? bgOpacity : 0.85})`,
          backdropFilter: 'blur(22px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}
        className="fixed top-0 left-0 right-0 z-[10000] flex items-center"
      >
        <div className="max-w-[1800px] mx-auto w-full flex items-center justify-between px-6 md:px-16">

          {/* ================= LEFT ================= */}
          <motion.div
            style={{ opacity: isHome ? navOpacity : 1 }}
            className="flex-1 flex items-center"
          >
            <nav className="hidden lg:flex gap-6">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const hasIcon = 'hasIcon' in item && item.hasIcon;

                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`relative px-5 py-2 text-[11px] uppercase tracking-[0.25em] font-semibold transition flex items-center gap-2 ${
                      isActive
                        ? 'text-yellow-400'
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-yellow-400/10 border border-yellow-400/20"
                      />
                    )}
                    {hasIcon && (
                      <Images className="w-3.5 h-3.5" />
                    )}
                    <span className="relative z-10">
                      {t(item.labelKey)}
                    </span>
                  </button>
                );
              })}
            </nav>
          </motion.div>

          {/* ================= CENTER LOGO ================= */}
          <div className="flex-1 flex justify-center">
            <motion.div
              style={{
                opacity: isHome ? navOpacity : 1,
                scale: isHome ? logoFadeScale : 1
              }}
              className="origin-center"
            >
              <button
                onClick={() => {
                  onTabChange('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-3 md:gap-6 transition-transform hover:scale-105 active:scale-95"
              >
                <span className="text-white text-[18px] md:text-[22px] font-black tracking-tight">
                  SUGI
                </span>

                <span className="text-yellow-400 text-[22px] md:text-[26px]">
                  杉
                </span>

                <span className="text-white text-[18px] md:text-[22px] font-black opacity-90">
                  سوجي
                </span>
              </button>
            </motion.div>
          </div>

          {/* ================= RIGHT ================= */}
          <motion.div
            style={{ opacity: isHome ? navOpacity : 1 }}
            className="flex-1 flex justify-end items-center gap-5"
          >
            {/* STATUS */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-[10px] uppercase text-white/50 font-mono">
                {t('contact.status')}
              </span>
            </div>

            {/* RESERVE BUTTON */}
            <a
              href="/reserve"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-yellow-400/20 transition"
            >
              {t('nav.reservations')}
            </a>

            {/* LANGUAGE */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="w-10 h-10 rounded-full border border-white/10 bg-white/5 text-[11px] font-bold text-white/60 hover:text-yellow-400 hover:border-yellow-400/30 transition"
            >
              {lang === 'en' ? 'AR' : 'EN'}
            </button>

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 flex flex-col justify-center items-center gap-1"
            >
              <span className="w-5 h-[2px] bg-white/70" />
              <span className="w-5 h-[2px] bg-white/70" />
              <span className="w-5 h-[2px] bg-white/70" />
            </button>
          </motion.div>
        </div>
      </motion.header>

      {/* ================= MOBILE MENU ================= */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-[80px] left-0 right-0 z-[9999] bg-black/95 backdrop-blur-xl border-b border-white/10 lg:hidden"
        >
          <div className="flex flex-col p-6 gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileOpen(false);
                }}
                className="text-left text-white/70 hover:text-yellow-400 text-sm uppercase tracking-[0.2em]"
              >
                {t(item.labelKey)}
              </button>
            ))}
            <a
              href="/reserve"
              onClick={() => setMobileOpen(false)}
              className="text-left text-yellow-400 text-sm uppercase tracking-[0.2em] font-bold"
            >
              {t('nav.reservations')}
            </a>
          </div>
        </motion.div>
      )}
    </>
  );
}