'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const EASE = [0.19, 1, 0.22, 1] as const;

const options = [
  { id: 'en' as const, label: 'EN', sublabel: 'English' },
  { id: 'ar' as const, label: 'عربي', sublabel: 'Arabic' },
];

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language"
      className="group/toggle relative flex items-center rounded-full p-[3px] border border-white/[0.08] bg-void/60 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] transition-[border-color,box-shadow] duration-500 hover:border-gold/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_24px_rgba(212,175,55,0.08),inset_0_1px_0_rgba(255,255,255,0.06)]"
    >
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.06),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover/toggle:opacity-100" />

      {options.map((option) => {
        const isActive = lang === option.id;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setLang(option.id)}
            aria-pressed={isActive}
            aria-label={option.sublabel}
            className="relative z-10 flex min-w-[42px] md:min-w-[46px] items-center justify-center px-3 py-2 md:px-3.5 md:py-2.5 rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/40"
          >
            {isActive && (
              <motion.div
                layoutId="lang-toggle-pill"
                transition={{ type: 'spring', stiffness: 520, damping: 38, mass: 0.8 }}
                className="absolute inset-0 rounded-full border border-gold/30"
                style={{
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.28) 0%, rgba(184,150,46,0.14) 100%)',
                  boxShadow: '0 4px 20px rgba(212,175,55,0.18), inset 0 1px 0 rgba(255,255,255,0.12)',
                }}
              />
            )}

            <motion.span
              animate={{
                opacity: isActive ? 1 : 0.38,
                y: isActive ? 0 : 1,
                scale: isActive ? 1 : 0.96,
              }}
              transition={{ duration: 0.28, ease: EASE }}
              className={`relative z-10 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.22em] whitespace-nowrap ${
                option.id === 'ar' ? 'font-arabic tracking-normal normal-case text-[11px] md:text-[12px]' : 'font-mono'
              } ${isActive ? 'text-gold-bright' : 'text-white/50 group-hover/toggle:text-white/65'}`}
            >
              {option.label}
            </motion.span>
          </button>
        );
      })}
    </div>
  );
}
