'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DeliveryService {
  id: string;
  name: string;
  nameAr: string;
  time: string;
  timeAr: string;
  logo: string;
  url: string;
}

const DELIVERY_SERVICES: DeliveryService[] = [
  {
    id: 'hungerstation',
    name: 'HungerStation',
    nameAr: 'هنقرستيشن',
    time: '30–45 min',
    timeAr: '٣٠–٤٥ د',
    logo: '/media/delivery/hungerstation.png',
    url: 'https://hungerstation.go.link/?c=SA&s=c&v=104233&so=mls&adj_t=1sdhhuza_1spi9ypp&adj_og_title=Sugi&adj_og_image=https://images.deliveryhero.io/image/hungerstation/restaurant/logo/d5be0ced71a768fbbfc5126f42e30c59.png',
  },
  {
    id: 'jahez',
    name: 'Jahez',
    nameAr: 'جاهز',
    time: '30–40 min',
    timeAr: '٣٠–٤٠ د',
    logo: '/media/delivery/jahez.png',
    url: 'https://www.jahez.net/',
  },
  {
    id: 'thechefz',
    name: 'The Chefz',
    nameAr: 'ذا شفز',
    time: '40–55 min',
    timeAr: '٤٠–٥٥ د',
    logo: '/media/delivery/thechefz.png',
    url: 'https://thechefz.co/',
  },
  {
    id: 'mrsool',
    name: 'Mrsool',
    nameAr: 'مرسول',
    time: '30–45 min',
    timeAr: '٣٠–٤٥ د',
    logo: '/media/delivery/mrsool.png',
    url: 'https://mrsool.co/',
  },
  {
    id: 'keeta',
    name: 'Keeta',
    nameAr: 'كيتا',
    time: '25–35 min',
    timeAr: '٢٥–٣٥ د',
    logo: '/media/delivery/keeta.png',
    url: 'https://www.keeta.com/',
  },
  {
    id: 'toyou',
    name: 'ToYou',
    nameAr: 'تويو',
    time: '35–50 min',
    timeAr: '٣٥–٥٠ د',
    logo: '/media/delivery/toyou.png',
    url: 'https://toyou.io/',
  },
];

const EASE = [0.19, 1, 0.22, 1] as const;

export default function DeliveryModal({ isOpen, onClose }: DeliveryModalProps) {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delivery-modal-title"
          className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#030304]/80 backdrop-blur-md z-0"
          />

          {/* Luxury Editorial Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="relative w-full max-w-[580px] rounded-2xl border border-white/[0.08] bg-[#07070a] p-5 sm:p-7 shadow-[0_24px_80px_rgba(0,0,0,0.9)] z-10 overflow-hidden"
          >
            {/* Background Kanji Watermark */}
            <div className="absolute -right-4 -top-6 pointer-events-none select-none text-white/[0.02] text-[150px] font-serif leading-none z-0">
              杉
            </div>

            {/* Top gold hairline */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent z-20" />

            {/* Minimalist Close Button */}
            <button
              onClick={onClose}
              aria-label="Close delivery modal"
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/10 bg-white/[0.03] text-white/40 hover:text-white hover:border-gold/40 transition-colors duration-200 flex items-center justify-center cursor-pointer z-30"
            >
              <X size={14} />
            </button>

            {/* Modal Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-5 sm:mb-6 pt-0.5">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-gold/40" />
                  <span className="text-gold/60 text-[9px] font-mono font-bold uppercase tracking-[0.4em] whitespace-nowrap">
                    {isAr ? 'شركاء التوصيل' : 'Delivery Partners'}
                  </span>
                  <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-gold/40" />
                </div>

                <h2
                  id="delivery-modal-title"
                  className="text-white text-xl sm:text-2xl font-serif italic tracking-tight font-normal"
                >
                  {isAr ? 'خدمة التوصيل المباشر' : 'Direct Delivery'}
                </h2>

                <p className="mt-1 text-white/40 text-[11px] sm:text-xs tracking-wide">
                  {isAr
                    ? 'اختر منصتك المفضلة لتوصيل أطباقنا الطازجة إلى باب بيتك'
                    : 'Select your preferred partner for fresh dispatch across Riyadh'}
                </p>
              </div>

              {/* Curated Partners: 3 columns desktop, 2 columns mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {DELIVERY_SERVICES.map((service) => {
                  const title = isAr ? service.nameAr : service.name;
                  const timeText = isAr ? service.timeAr : service.time;

                  return (
                    <a
                      key={service.id}
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex flex-col items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-gold/30 hover:bg-white/[0.04] transition-all duration-200 active:scale-[0.98] cursor-pointer"
                    >
                      {/* Logo */}
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-white/10 group-hover:border-gold/40 transition-colors duration-200 shadow-sm bg-black/40 mb-2">
                        <Image
                          src={service.logo}
                          alt={title}
                          fill
                          sizes="44px"
                          className="object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                      </div>

                      {/* Partner Name & Time */}
                      <div className="text-center w-full min-w-0">
                        <h3 className="text-white text-xs font-medium tracking-tight group-hover:text-gold-bright transition-colors truncate">
                          {title}
                        </h3>
                        <p className="text-white/35 font-mono text-[9px] tracking-wider mt-0.5">
                          {timeText}
                        </p>
                      </div>

                      {/* Subtle Action Indicator */}
                      <div className="mt-2 pt-1.5 border-t border-white/[0.04] w-full flex items-center justify-center gap-1 text-[9px] font-mono uppercase tracking-widest text-gold/60 group-hover:text-gold transition-colors">
                        <span>{isAr ? 'طلب' : 'Order'}</span>
                        <ArrowUpRight
                          size={10}
                          className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Private Catering / Concierge Footer */}
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-gold/60 shrink-0" />
                  <span className="text-white/40 text-[10px] font-mono tracking-wider">
                    {isAr ? 'طلبات المناسبات والضيافة الخاصة' : 'Private Catering & Events'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <a
                    href="tel:+966501335273"
                    className="text-white/50 hover:text-gold transition-colors"
                  >
                    +966 50 133 5273
                  </a>
                  <span className="text-white/15">|</span>
                  <a
                    href="https://wa.me/966501335273"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold/80 hover:text-gold transition-colors font-bold uppercase tracking-wider"
                  >
                    {isAr ? 'واتساب' : 'WhatsApp'}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
