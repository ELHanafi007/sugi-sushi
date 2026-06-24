'use client';

import { useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import { Images, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage, NavTab } from '@/context/LanguageContext';

interface NavbarProps {
  onTabChange: (tab: NavTab) => void;
  activeTab: NavTab;
}

/**
 * NAVBAR — Obsidian Kinetic
 *
 * - Glassmorphic background with gold top-line on scroll
 * - Continuous scroll-driven transforms (no state flicker)
 * - Logo shrinks from hero center to navbar
 * - Full-screen mobile menu with staggered reveal
 * - Animated hamburger → X morph
 */
export default function Navbar({ onTabChange, activeTab }: NavbarProps) {
  const { lang, setLang, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const isHome = activeTab === 'home';

  /* ═══════════════════════════════
     SCROLL-DRIVEN TRANSFORMS
  ═══════════════════════════════ */
  const { scrollY } = useScroll();

  // Navbar appearance
  const navHeight = useTransform(scrollY, [0, 200], [96, 64]);
  const navBg = useTransform(scrollY, [0, 200], ['rgba(3,3,4,0)', 'rgba(3,3,4,0.88)']);
  const navBorder = useTransform(scrollY, [0, 200], ['rgba(212,175,55,0)', 'rgba(212,175,55,0.12)']);
  const navBlur = useTransform(scrollY, [0, 200], ['blur(0px)', 'blur(24px)']);

  // Nav items reveal
  const navItemsOpacity = useTransform(scrollY, [80, 200], [0, 1]);
  const navItemsY = useTransform(scrollY, [80, 200], ['8px', '0px']);

  /* ═══════════════════════════════
     LOGO SCROLL TRANSFORM
  ═══════════════════════════════ */
  const [scaleFactor, setScaleFactor] = useState(3.0);
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setScaleFactor(2.0); // Mobile
      else if (window.innerWidth < 1024) setScaleFactor(2.8); // Tablet
      else setScaleFactor(3.5); // Desktop
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const logoY = useTransform(scrollY, [0, 200], ['38vh', '0vh']);
  const logoScale = useTransform(scrollY, [0, 200], [scaleFactor, 1]);
  const logoGlow = useTransform(scrollY, [0, 200], [
    'drop-shadow(0 0 30px rgba(255,255,255,0.15))',
    'drop-shadow(0 0 10px rgba(255,255,255,0.08))',
  ]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  /* ═══════════════════════════════
     NAV ITEMS CONFIG
  ═══════════════════════════════ */
  const navItems: { id: NavTab; labelKey: string; hasIcon?: boolean }[] = [
    { id: 'home', labelKey: 'nav.home' },
    { id: 'menu', labelKey: 'nav.menu' },
    { id: 'gallery', labelKey: 'nav.gallery', hasIcon: true },
  ];

  const navigateTo = (tab: NavTab) => {
    if (window.location.pathname !== '/') {
      onTabChange(tab);
      router.push('/');
    } else {
      onTabChange(tab);
    }
  };

  return (
    <>
      {/* ═══════════════════════════════ NAVBAR ═══════════════════════════════ */}
      <motion.header
        style={{
          height: isHome ? navHeight : 64,
          backgroundColor: isHome ? navBg : 'rgba(3,3,4,0.88)',
          backdropFilter: isHome ? navBlur : 'blur(24px)',
          WebkitBackdropFilter: isHome ? navBlur : 'blur(24px)',
        }}
        className="fixed top-0 left-0 right-0 z-[10000] flex items-center will-change-transform"
      >
        {/* Gold top-line accent */}
        <motion.div
          style={{
            opacity: isHome
              ? useTransform(scrollY, [100, 250], [0, 1])
              : 1,
          }}
          className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/25 to-transparent"
        />

        {/* Bottom border */}
        <motion.div
          style={{
            opacity: isHome
              ? useTransform(scrollY, [100, 250], [0, 0.5])
              : 0.5,
          }}
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/[0.06]"
        />

        <div className="max-w-[1800px] mx-auto w-full flex items-center justify-between px-6 md:px-12 lg:px-16">

          {/* ═══ LEFT: Nav Items ═══ */}
          <motion.div
            style={{
              opacity: isHome ? navItemsOpacity : 1,
              y: isHome ? navItemsY : 0,
            }}
            className="flex-1 flex items-center"
          >
            <nav className="hidden lg:flex gap-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    className={`relative px-5 py-2.5 text-[10px] uppercase tracking-[0.25em] font-bold transition-colors duration-500 flex items-center gap-2 rounded-full ${
                      isActive
                        ? 'text-gold'
                        : 'text-white/35 hover:text-white/70'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="absolute inset-0 rounded-full bg-gold/[0.08] border border-gold/15"
                      />
                    )}
                    {item.hasIcon && <Images className="w-3.5 h-3.5" />}
                    <span className="relative z-10">{t(item.labelKey)}</span>
                  </button>
                );
              })}
            </nav>
          </motion.div>

          {/* ═══ CENTER: Logo ═══ */}
          <div className="flex-1 flex justify-center relative">
            <motion.div
              style={{
                y: isHome ? logoY : 0,
                scale: isHome ? logoScale : 1,
                filter: isHome ? logoGlow : 'drop-shadow(0 0 10px rgba(255,255,255,0.08))',
              }}
              className="origin-center z-[10001] will-change-transform"
            >
              <button
                onClick={() => {
                  if (window.location.pathname !== '/') {
                    onTabChange('home');
                    router.push('/');
                  } else {
                    onTabChange('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="flex items-center justify-center transition-transform duration-500 hover:scale-105 active:scale-95"
              >
                <div className="relative w-20 h-20 md:w-28 md:h-28">
                  <motion.img
                    src="/brand-logo.png"
                    alt="Sugi Sushi Logo"
                    className="w-full h-full object-contain"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </button>
            </motion.div>
          </div>

          {/* ═══ RIGHT: Actions ═══ */}
          <motion.div
            style={{
              opacity: isHome ? navItemsOpacity : 1,
              y: isHome ? navItemsY : 0,
            }}
            className="flex-1 flex justify-end items-center gap-3 md:gap-4"
          >
            {/* Reserve Button */}
            <Link
              href="/reserve"
              className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold/[0.08] border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-gold/15 hover:border-gold/35 transition-all duration-500"
            >
              {t('nav.reservations')}
            </Link>

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-bold text-white/50 hover:text-gold hover:border-gold/20 transition-all duration-500"
            >
              {lang === 'en' ? 'AR' : 'EN'}
            </button>

            {/* ═══ MOBILE HAMBURGER (Animated) ═══ */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 flex flex-col justify-center items-center gap-[5px] relative"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={{
                  rotate: mobileOpen ? 45 : 0,
                  y: mobileOpen ? 7 : 0,
                  width: mobileOpen ? 20 : 18,
                }}
                transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                className="block h-[1.5px] bg-white/70 origin-center"
                style={{ width: 18 }}
              />
              <motion.span
                animate={{
                  opacity: mobileOpen ? 0 : 1,
                  scaleX: mobileOpen ? 0 : 1,
                }}
                transition={{ duration: 0.2 }}
                className="block w-[14px] h-[1.5px] bg-white/70"
              />
              <motion.span
                animate={{
                  rotate: mobileOpen ? -45 : 0,
                  y: mobileOpen ? -7 : 0,
                  width: mobileOpen ? 20 : 18,
                }}
                transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                className="block h-[1.5px] bg-white/70 origin-center"
                style={{ width: 18 }}
              />
            </button>
          </motion.div>
        </div>
      </motion.header>

      {/* ═══════════════════════════════ MOBILE MENU (Full Screen) ═══════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[9999] lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-void/95 backdrop-blur-2xl"
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
              {/* Nav Items (Staggered) */}
              <nav className="flex flex-col items-center gap-8">
                {[...navItems, { id: 'reserve' as NavTab, labelKey: 'nav.reservations' }].map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.1 + i * 0.08,
                      ease: [0.19, 1, 0.22, 1],
                    }}
                  >
                    {(item.id as string) === 'reserve' ? (
                      <Link
                        href="/reserve"
                        onClick={() => setMobileOpen(false)}
                        className="text-gold text-2xl md:text-3xl uppercase tracking-[0.15em] font-bold"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {t(item.labelKey)}
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          navigateTo(item.id);
                          setMobileOpen(false);
                        }}
                        className={`text-2xl md:text-3xl uppercase tracking-[0.15em] transition-colors duration-300 ${
                          activeTab === item.id
                            ? 'text-white font-bold'
                            : 'text-white/30 hover:text-white/60'
                        }`}
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {t(item.labelKey)}
                      </button>
                    )}
                  </motion.div>
                ))}
              </nav>

              {/* Bottom Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute bottom-12 flex flex-col items-center gap-3"
              >
                <div className="w-8 h-[1px] bg-gold/20" />
                <span className="text-white/15 text-[8px] font-mono uppercase tracking-[0.6em]">
                  {lang === 'ar' ? 'الرياض' : 'Riyadh, KSA'}
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}