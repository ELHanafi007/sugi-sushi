'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { MapPin, Clock, Phone } from 'lucide-react';

/**
 * FOOTER — Obsidian Kinetic
 *
 * Minimalist luxury closure with:
 * - Gold divider top accent
 * - Brand logo + tagline
 * - Contact info in mono
 * - Credits
 */
export default function Footer() {
  const { t, lang } = useLanguage();

  return (
    <footer className="relative bg-void border-t border-white/[0.04]">
      {/* Gold accent line */}
      <div className="divider-gold" />

      <div className="container-luxury py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr] gap-12 md:gap-16">

          {/* ─── Brand Column ─── */}
          <div className="flex flex-col gap-6">
            <Image
              src="/brand-logo-removebg-preview.png"
              alt="Sugi Sushi"
              width={140}
              height={70}
              className="w-[120px] h-auto object-contain opacity-80"
            />
            <p className="text-white/30 text-sm leading-7 max-w-[300px]" style={{ fontFamily: 'var(--font-serif)' }}>
              {lang === 'ar'
                ? 'سوشي طازج، تحضير نظيف، ونكهة تفرق من أول لقمة.'
                : 'Fresh sushi, clean prep, and flavors that matter from the first bite.'}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="w-2 h-2 rounded-full bg-gold/60 animate-pulse" />
              <span className="text-white/25 text-[9px] font-mono uppercase tracking-[0.4em]">
                {t('contact.hours')}
              </span>
            </div>
          </div>

          {/* ─── Visit Column ─── */}
          <div className="flex flex-col gap-6">
            <h4 className="text-gold/40 text-[9px] font-mono font-bold uppercase tracking-[0.6em]">
              {lang === 'ar' ? 'زورنا' : 'Visit'}
            </h4>
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-3">
                <MapPin size={16} strokeWidth={1} className="text-gold/40 mt-0.5 shrink-0" />
                <div>
                  <p className="text-white/50 text-sm" style={{ fontFamily: 'var(--font-serif)' }}>
                    {t('loc.city')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={16} strokeWidth={1} className="text-gold/40 mt-0.5 shrink-0" />
                <div>
                  <p className="text-white/50 text-xs font-mono">{t('contact.hours')}</p>
                  <p className="text-white/20 text-[10px] mt-1">{t('loc.fri_sat')}: {t('loc.t2')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} strokeWidth={1} className="text-gold/40 mt-0.5 shrink-0" />
                <p className="text-white/50 text-xs font-mono">+966 50 133 5273</p>
              </div>
            </div>
          </div>

          {/* ─── Quick Links Column ─── */}
          <div className="flex flex-col gap-6">
            <h4 className="text-gold/40 text-[9px] font-mono font-bold uppercase tracking-[0.6em]">
              {lang === 'ar' ? 'روابط' : 'Explore'}
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                { label: t('nav.menu'), href: '/menu' },
                { label: t('nav.reservations'), href: '/reserve' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-white/30 text-sm hover:text-gold transition-colors duration-500"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* ─── Bottom Bar ─── */}
        <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/15 text-[10px] font-mono uppercase tracking-[0.3em]">
            {t('footer.legal')}
          </p>
          <p className="text-white/10 text-[10px] font-mono uppercase tracking-[0.2em]">
            {t('footer.crafted')}
          </p>
        </div>
      </div>
    </footer>
  );
}
