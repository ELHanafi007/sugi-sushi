'use client';

import { useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
} from 'framer-motion';
import { Images } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage, NavTab } from '@/context/LanguageContext';

const EASE = [0.19, 1, 0.22, 1] as const;

interface NavbarProps {
  onTabChange: (tab: NavTab) => void;
  activeTab: NavTab;
}

export default function Navbar({ onTabChange, activeTab }: NavbarProps) {
  const { lang, setLang, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navSolid, setNavSolid] = useState(false);
  const router = useRouter();

  const isHome = activeTab === 'home';

  const { scrollY } = useScroll();

  const navHeight = useTransform(scrollY, [0, 200], [96, 64]);
  const navBg = useTransform(scrollY, [0, 200], ['rgba(3,3,4,0)', 'rgba(3,3,4,0.92)']);
  const navItemsOpacity = useTransform(scrollY, [80, 200], [0, 1]);
  const navItemsY = useTransform(scrollY, [80, 200], ['8px', '0px']);

  useMotionValueEvent(scrollY, 'change', (value) => {
    const solid = value > 80;
    setNavSolid((prev) => (prev === solid ? prev : solid));
  });

  const [scaleFactor, setScaleFactor] = useState(3.0);
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setScaleFactor(2.0);
      else if (window.innerWidth < 1024) setScaleFactor(2.8);
      else setScaleFactor(3.5);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const logoY = useTransform(scrollY, [0, 200], ['38vh', '0vh']);
  const logoScale = useTransform(scrollY, [0, 200], [scaleFactor, 1]);
  const topLineOpacity = useTransform(scrollY, [100, 250], [0, 1]);
  const bottomBorderOpacity = useTransform(scrollY, [100, 250], [0, 0.5]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navItems: { id: NavTab; labelKey: string; hasIcon?: boolean }[] = [
    { id: 'home', labelKey: 'nav.home' },
    { id: 'menu', labelKey: 'nav.menu' },
  ];

  const navigateTo = (tab: NavTab) => {
    if (tab === 'menu') {
      router.push('/menu');
      return;
    }

    if (window.location.pathname !== '/') {
      onTabChange(tab);
      router.push('/');
    } else {
      onTabChange(tab);
    }
  };

  const showGlass = !isHome || navSolid;

  return (
    <>
      <motion.header
        style={{
          height: isHome ? navHeight : 64,
          backgroundColor: isHome ? navBg : 'rgba(3,3,4,0.92)',
        }}
        className={`fixed top-0 left-0 right-0 z-[10000] flex items-center transition-[backdrop-filter] duration-300 ${showGlass ? 'backdrop-blur-md' : ''}`}
      >
        <motion.div
          style={{ opacity: isHome ? topLineOpacity : 1 }}
          className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/25 to-transparent"
        />

        <motion.div
          style={{ opacity: isHome ? bottomBorderOpacity : 0.5 }}
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/[0.06]"
        />

        <div className="max-w-[1800px] mx-auto w-full flex items-center justify-between px-6 md:px-12 lg:px-16">
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
                    className={`relative px-5 py-2.5 text-[10px] uppercase tracking-[0.25em] font-bold transition-colors duration-300 flex items-center gap-2 rounded-full ${
                      isActive ? 'text-gold' : 'text-white/35 hover:text-white/70'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
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

          <div className="flex-1 flex justify-center relative">
            <motion.div
              style={{
                y: isHome ? logoY : 0,
                scale: isHome ? logoScale : 1,
              }}
              className="origin-center z-[10001]"
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
                className="flex items-center justify-center transition-transform duration-300 hover:scale-105 active:scale-95"
              >
                <div className="relative w-20 h-20 md:w-28 md:h-28">
                  <motion.img
                    src="/brand-logo.png"
                    alt="Sugi Sushi Logo"
                    className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.08)]"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </button>
            </motion.div>
          </div>

          <motion.div
            style={{
              opacity: isHome ? navItemsOpacity : 1,
              y: isHome ? navItemsY : 0,
            }}
            className="flex-1 flex justify-end items-center gap-3 md:gap-4"
          >
            <Link
              href="/reserve"
              className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold/[0.08] border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-gold/15 hover:border-gold/35 transition-all duration-300"
            >
              {t('nav.reservations')}
            </Link>

            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-bold text-white/50 hover:text-gold hover:border-gold/20 transition-all duration-300"
            >
              {lang === 'en' ? 'AR' : 'EN'}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 flex flex-col justify-center items-center gap-[5px] relative"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 7 : 0, width: mobileOpen ? 20 : 18 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="block h-[1.5px] bg-white/70 origin-center"
                style={{ width: 18 }}
              />
              <motion.span
                animate={{ opacity: mobileOpen ? 0 : 1, scaleX: mobileOpen ? 0 : 1 }}
                transition={{ duration: 0.15 }}
                className="block w-[14px] h-[1.5px] bg-white/70"
              />
              <motion.span
                animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -7 : 0, width: mobileOpen ? 20 : 18 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="block h-[1.5px] bg-white/70 origin-center"
                style={{ width: 18 }}
              />
            </button>
          </motion.div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-void/98"
            />

            <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
              <nav className="flex flex-col items-center gap-8">
                {[...navItems, { id: 'reserve' as NavTab, labelKey: 'nav.reservations' }].map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3, delay: 0.05 + i * 0.05, ease: EASE }}
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
                        className={`text-2xl md:text-3xl uppercase tracking-[0.15em] transition-colors duration-200 ${
                          activeTab === item.id ? 'text-white font-bold' : 'text-white/30 hover:text-white/60'
                        }`}
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {t(item.labelKey)}
                      </button>
                    )}
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.3 }}
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
