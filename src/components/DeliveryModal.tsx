'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  X,
  ExternalLink,
  Clock,
  ShieldCheck,
  MapPin,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import DeliveryBikeIcon from '@/components/DeliveryBikeIcon';

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DeliveryService {
  id: string;
  name: string;
  nameAr: string;
  badge: string;
  badgeAr: string;
  desc: string;
  descAr: string;
  time: string;
  timeAr: string;
  logo: string;
  color: string;
  accentBg: string;
  borderColor: string;
  url: string;
}

const DELIVERY_SERVICES: DeliveryService[] = [
  {
    id: 'hungerstation',
    name: 'HungerStation',
    nameAr: 'هنقرستيشن',
    badge: 'Most Popular',
    badgeAr: 'الأكثر طلباً',
    desc: 'Live menu catalog with real-time GPS order tracking.',
    descAr: 'القائمة الكاملة مع تتبع لحظي مباشر وإرسال سريع.',
    time: '30–45 min',
    timeAr: '٣٠–٤٥ دقيقة',
    logo: '/media/delivery/hungerstation.png',
    color: '#f59e0b',
    accentBg: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    url: 'https://hungerstation.go.link/?c=SA&s=c&v=104233&so=mls&adj_t=1sdhhuza_1spi9ypp&adj_og_title=Sugi&adj_og_image=https://images.deliveryhero.io/image/hungerstation/restaurant/logo/d5be0ced71a768fbbfc5126f42e30c59.png',
  },
  {
    id: 'jahez',
    name: 'Jahez',
    nameAr: 'جاهز',
    badge: 'Official Partner',
    badgeAr: 'شريك رسمي',
    desc: 'Direct dispatch across all Riyadh neighborhoods.',
    descAr: 'توصيل مباشر وموثوق يغطي كافة أحياء الرياض.',
    time: '30–40 min',
    timeAr: '٣٠–٤٠ دقيقة',
    logo: '/media/delivery/jahez.png',
    color: '#ef4444',
    accentBg: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    url: 'https://www.jahez.net/',
  },
  {
    id: 'thechefz',
    name: 'The Chefz',
    nameAr: 'ذا شفز',
    badge: 'Fine Dining',
    badgeAr: 'تجارب فاخرة',
    desc: 'Gourmet handling with temperature-insulated packaging.',
    descAr: 'عناية فائقة وتغليف حراري فاخر مخصص للسوشي.',
    time: '40–55 min',
    timeAr: '٤٠–٥٥ دقيقة',
    logo: '/media/delivery/thechefz.png',
    color: '#a855f7',
    accentBg: 'rgba(168, 85, 247, 0.12)',
    borderColor: 'rgba(168, 85, 247, 0.3)',
    url: 'https://thechefz.co/',
  },
  {
    id: 'mrsool',
    name: 'Mrsool',
    nameAr: 'مرسول',
    badge: 'Private Courier',
    badgeAr: 'مندوب خاص',
    desc: 'Dedicated courier for customized pickup and delivery.',
    descAr: 'مندوب مخصص يستلم طلبك مباشرة ويوصله بعناية.',
    time: '30–45 min',
    timeAr: '٣٠–٤٥ دقيقة',
    logo: '/media/delivery/mrsool.png',
    color: '#10b981',
    accentBg: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    url: 'https://mrsool.co/',
  },
  {
    id: 'keeta',
    name: 'Keeta',
    nameAr: 'كيتا',
    badge: 'Fast Delivery',
    badgeAr: 'توصيل سريع',
    desc: 'Smart routing for rapid doorstep arrival.',
    descAr: 'توجيه ذكي لوصول وجبتك بأسرع وقت وأعلى جودة.',
    time: '25–35 min',
    timeAr: '٢٥–٣٥ دقيقة',
    logo: '/media/delivery/keeta.png',
    color: '#eab308',
    accentBg: 'rgba(234, 179, 8, 0.12)',
    borderColor: 'rgba(234, 179, 8, 0.3)',
    url: 'https://www.keeta.com/',
  },
  {
    id: 'toyou',
    name: 'ToYou',
    nameAr: 'تويو',
    badge: 'Citywide Fleet',
    badgeAr: 'تغطية شاملة',
    desc: 'Extensive delivery coverage across greater Riyadh.',
    descAr: 'تغطية واسعة تشمل كافة المناطق والمجمعات السكنية.',
    time: '35–50 min',
    timeAr: '٣٥–٥٠ دقيقة',
    logo: '/media/delivery/toyou.png',
    color: '#0ea5e9',
    accentBg: 'rgba(14, 165, 233, 0.12)',
    borderColor: 'rgba(14, 165, 233, 0.3)',
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
          className="fixed inset-0 z-[100000] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#030304]/80 backdrop-blur-md z-0"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="relative w-full max-w-3xl max-h-[90vh] sm:max-h-[88vh] flex flex-col rounded-t-3xl sm:rounded-3xl border border-white/10 p-5 sm:p-7 md:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.8)] z-10 overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #101116 0%, #08080b 100%)',
            }}
          >
            {/* Top gold hairline */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent z-20" />

            {/* Mobile drag handle */}
            <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-3 sm:hidden shrink-0" />

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close delivery modal"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/10 bg-white/[0.04] text-white/60 hover:text-white hover:border-gold/40 hover:bg-gold/10 flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer z-30"
            >
              <X size={16} />
            </button>

            {/* Modal Body */}
            <div className="overflow-y-auto pr-1 no-scrollbar flex-1 relative z-10">
              {/* Header */}
              <div className="text-center max-w-xl mx-auto mb-6 pt-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/[0.08] px-3.5 py-1 mb-3">
                  <DeliveryBikeIcon size={15} className="text-gold" />
                  <span className="text-gold text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.25em]">
                    {isAr ? 'خدمات التوصيل بالرياض' : 'Riyadh Delivery Partners'}
                  </span>
                </div>

                <h2
                  id="delivery-modal-title"
                  className="text-white text-2xl sm:text-3xl font-serif italic leading-tight"
                >
                  {isAr ? 'اطلب وجبتك المفضلة لباب بيتك' : 'Order for Direct Delivery'}
                </h2>

                <p className="mt-2 text-white/50 text-xs sm:text-sm leading-relaxed">
                  {isAr
                    ? 'اختر منصتك المفضلة لتوصيل أطباق سوجي سوشي الطازجة إلى موقعك بالرياض.'
                    : 'Select your preferred delivery app to get freshly prepared Sugi Sushi delivered to your door.'}
                </p>
              </div>

              {/* 6 Delivery Partners Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-3.5">
                {DELIVERY_SERVICES.map((service) => {
                  const title = isAr ? service.nameAr : service.name;
                  const description = isAr ? service.descAr : service.desc;
                  const badge = isAr ? service.badgeAr : service.badge;
                  const timeText = isAr ? service.timeAr : service.time;

                  return (
                    <div
                      key={service.id}
                      className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] p-4 flex flex-col justify-between transition-all duration-200 hover:border-gold/30 hover:-translate-y-0.5"
                    >
                      <div>
                        {/* Top: Actual App Logo + Name + Badge */}
                        <div className="flex items-start justify-between gap-2 mb-2.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Official App Logo */}
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/10 shadow-md shrink-0 bg-white/5">
                              <Image
                                src={service.logo}
                                alt={title}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-white text-sm font-bold truncate">
                                {title}
                              </h3>
                              <div className="flex items-center gap-1 mt-0.5">
                                <Clock size={10} className="text-gold/80 shrink-0" />
                                <span className="text-white/40 text-[10px] font-mono">
                                  {timeText}
                                </span>
                              </div>
                            </div>
                          </div>

                          <span className="text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.04] text-gold/80 shrink-0">
                            {badge}
                          </span>
                        </div>

                        <p className="text-white/45 text-[11px] leading-relaxed mb-3">
                          {description}
                        </p>
                      </div>

                      {/* Action Button */}
                      <a
                        href={service.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-white/10 bg-white/[0.03] text-white/90 text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-200 hover:border-gold hover:bg-gold hover:text-black active:scale-[0.98]"
                      >
                        <span>{isAr ? `اطلب عبر ${title}` : `Order on ${title}`}</span>
                        <ExternalLink size={11} className="shrink-0 opacity-70" />
                      </a>
                    </div>
                  );
                })}
              </div>

              {/* VIP / Catering Direct Concierge */}
              <div className="mt-5 rounded-2xl border border-gold/20 bg-gold/[0.03] p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-gold/30 bg-gold/10 flex items-center justify-center text-gold shrink-0">
                    <MessageCircle size={15} />
                  </div>
                  <div>
                    <h4 className="text-white text-xs sm:text-sm font-bold">
                      {isAr ? 'طلبات المناسبات والبوكسات الخاصة' : 'Event Catering & Large Orders'}
                    </h4>
                    <p className="text-white/40 text-[11px]">
                      {isAr
                        ? 'تواصل مباشرة لترتيب البوكسات وتنسيق التوصيل الخاص.'
                        : 'Contact our team for customized party boxes and direct VIP delivery.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="tel:+966501335273"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 bg-white/[0.04] text-white text-[10px] font-mono font-bold hover:border-gold/40 hover:text-gold transition-colors"
                  >
                    <Phone size={11} />
                    <span>+966 50 133 5273</span>
                  </a>
                  <a
                    href="https://wa.me/966501335273"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold hover:bg-emerald-500/30 transition-colors"
                  >
                    <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
                  </a>
                </div>
              </div>

              {/* Footer reassurance banner */}
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-white/40 text-[10px] sm:text-[11px]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-gold shrink-0" />
                  <span>
                    {isAr
                      ? 'تحضير طازج وتغليف حراري معتمد للحفاظ على أعلى درجات الجودة.'
                      : 'Prepared fresh upon order with certified temperature-controlled packaging.'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-gold/70 shrink-0">
                  <MapPin size={10} />
                  <span>{isAr ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}</span>
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
