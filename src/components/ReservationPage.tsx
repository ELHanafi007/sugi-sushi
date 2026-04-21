'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import { 
  User, 
  Phone, 
  Mail, 
  Users, 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  MapPin,
  PhoneCall,
  Info
} from 'lucide-react';

export default function ReservationPage() {
  const { t, lang } = useLanguage();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: 2,
    date: '',
    time: ''
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t('res.success'));
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStep1Valid = formData.name && formData.phone;
  const isStep2Valid = formData.date && formData.time;

  return (
    <div className="min-h-screen bg-bg relative pt-48 pb-[120px] overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <Image
          src="https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1600&q=80"
          alt="Atmosphere"
          fill
          className="object-cover grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg" />
      </div>

      <div className="container-luxury relative z-10">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-6 mb-8"
            >
              <div className="w-12 h-px bg-gold/30" />
              <span className="text-mono text-gold/50 text-[10px] tracking-[1.2em] uppercase font-black">
                {t('contact.reservation')}
              </span>
              <div className="w-12 h-px bg-gold/30" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-white text-4xl md:text-8xl font-serif font-light mb-12 italic px-4"
            >
              {t('res.title_title')}
              <span className="shimmer-gold not-italic font-black">
                {t('res.title_span')}
              </span>
            </motion.h1>

            {/* Step Indicator */}
            <div className="flex justify-center items-center gap-2 md:gap-12 px-4">
              {[
                { n: 1, label: t('res.details') },
                { n: 2, label: t('res.timing') },
                { n: 3, label: t('res.finalize') }
              ].map((s) => (
                <div key={s.n} className="flex items-center gap-2 md:gap-3">
                  <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[9px] md:text-[10px] font-black border transition-all duration-500 ${
                    step >= s.n ? 'bg-gold border-gold text-black' : 'border-white/10 text-white/30'
                  }`}>
                    {step > s.n ? <CheckCircle2 size={12} className="md:size-[14px]" /> : s.n}
                  </div>
                  <span className={`text-[8px] md:text-[10px] uppercase tracking-widest font-black ${
                    step >= s.n ? 'text-white' : 'text-white/20'
                  } ${s.n === step ? 'block' : 'hidden md:block'}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 items-start">
            
            {/* Form Section */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1" 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="luxury-card p-8 md:p-12 space-y-8"
                  >
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-widest text-gold/60 font-black flex items-center gap-2">
                          <User size={12} /> {t('res.guest_name')}
                        </label>
                        <input
                          type="text"
                          placeholder={t('res.placeholder_name')}
                          value={formData.name}
                          onChange={e => updateFormData('name', e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-gold/50 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-widest text-gold/60 font-black flex items-center gap-2">
                          <Phone size={12} /> {t('res.contact_number')}
                        </label>
                        <input
                          type="tel"
                          placeholder="+966 50 000 0000"
                          value={formData.phone}
                          onChange={e => updateFormData('phone', e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-gold/50 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-widest text-gold/60 font-black flex items-center gap-2">
                        <Users size={12} /> {t('res.guests')}
                      </label>
                      <div className="flex flex-wrap items-center gap-3 md:gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                          <button
                            key={n}
                            onClick={() => updateFormData('guests', n)}
                            className={`w-10 h-10 md:w-12 md:h-12 rounded-xl border flex items-center justify-center font-mono text-xs md:text-sm transition-all duration-300 ${
                              formData.guests === n 
                                ? 'bg-gold border-gold text-black' 
                                : 'bg-white/5 border-white/10 text-white/40 hover:border-gold/30'
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                        <span className="text-white/20 text-[9px] md:text-[10px] uppercase tracking-tighter w-full md:w-auto mt-2 md:mt-0">Guests</span>
                      </div>
                    </div>

                    <div className="pt-6 flex justify-end">
                      <button 
                        onClick={nextStep}
                        disabled={!isStep1Valid}
                        className={`cta-btn px-12 py-5 group flex items-center gap-4 ${!isStep1Valid && 'opacity-50 cursor-not-allowed'}`}
                      >
                        <span className="text-[10px] uppercase tracking-[0.4em] font-black">{t('res.next')}</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="luxury-card p-8 md:p-12 space-y-10"
                  >
                    <div className="grid md:grid-cols-2 gap-12">
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-gold/60 font-black flex items-center gap-2">
                          <CalendarIcon size={12} /> {t('res.date')}
                        </label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={e => updateFormData('date', e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-gold/50 outline-none transition-all [color-scheme:dark]"
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-gold/60 font-black flex items-center gap-2">
                          <Clock size={12} /> {t('res.time')}
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'].map(slot => (
                            <button
                              key={slot}
                              onClick={() => updateFormData('time', slot)}
                              className={`py-3 rounded-xl border font-mono text-xs transition-all ${
                                formData.time === slot 
                                  ? 'bg-gold border-gold text-black' 
                                  : 'bg-white/5 border-white/10 text-white/40 hover:border-gold/30'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 flex justify-between">
                      <button onClick={prevStep} className="text-white/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] uppercase tracking-widest font-black">
                        <ChevronLeft size={14} /> {t('res.prev')}
                      </button>
                      <button 
                        onClick={nextStep}
                        disabled={!isStep2Valid}
                        className={`cta-btn px-12 py-5 group flex items-center gap-4 ${!isStep2Valid && 'opacity-50 cursor-not-allowed'}`}
                      >
                        <span className="text-[10px] uppercase tracking-[0.4em] font-black">{t('res.review')}</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="luxury-card p-8 md:p-12 text-center space-y-12"
                  >
                    <div className="space-y-4">
                      <h2 className="text-3xl md:text-4xl font-serif italic text-white">
                        {t('res.confirm_title')} <span className="text-gold not-italic">{t('res.confirm_span')}</span>
                      </h2>
                      <p className="text-white/40 text-xs font-mono uppercase tracking-[0.4em]">Review your selection</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                        <User size={16} className="text-gold/40 mx-auto mb-3" />
                        <p className="text-[10px] text-white/20 uppercase mb-1">{t('res.guest_name')}</p>
                        <p className="text-white font-serif">{formData.name}</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                        <Users size={16} className="text-gold/40 mx-auto mb-3" />
                        <p className="text-[10px] text-white/20 uppercase mb-1">{t('res.guests')}</p>
                        <p className="text-white font-mono">{formData.guests}</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                        <CalendarIcon size={16} className="text-gold/40 mx-auto mb-3" />
                        <p className="text-[10px] text-white/20 uppercase mb-1">{t('res.date')}</p>
                        <p className="text-white font-mono">{formData.date}</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                        <Clock size={16} className="text-gold/40 mx-auto mb-3" />
                        <p className="text-[10px] text-white/20 uppercase mb-1">{t('res.time')}</p>
                        <p className="text-white font-mono">{formData.time}</p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                      <button onClick={prevStep} className="text-white/40 hover:text-white transition-colors text-[10px] uppercase tracking-widest font-black underline underline-offset-8">
                        {t('res.edit')}
                      </button>
                      <button 
                        onClick={handleSubmit}
                        className="cta-btn px-16 py-6"
                      >
                        <span className="text-[10px] uppercase tracking-[0.5em] font-black">{t('res.confirm_btn')}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Info Sidebar */}
            <div className="space-y-8">
              <div className="luxury-card p-8 space-y-8">
                <h4 className="text-gold text-xs uppercase tracking-[0.4em] font-black border-b border-gold/10 pb-4 flex items-center gap-2">
                  <Info size={14} /> {t('res.info')}
                </h4>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <MapPin size={18} className="text-gold/40 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase text-white/20 mb-1 tracking-widest">{t('res.address')}</p>
                      <p className="text-white/80 text-sm font-serif italic">{t('loc.address')}, {t('loc.city')}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Clock size={18} className="text-gold/40 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase text-white/20 mb-1 tracking-widest">{t('res.hours')}</p>
                      <p className="text-white/80 text-sm font-mono">{t('contact.hours')}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <PhoneCall size={18} className="text-gold/40 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase text-white/20 mb-1 tracking-widest">{t('res.contact')}</p>
                      <p className="text-white/80 text-sm font-mono">+966 50 000 0000</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="luxury-card p-8 bg-gold/5 border-gold/20">
                <p className="text-gold/80 text-[10px] leading-relaxed uppercase tracking-widest font-bold text-center">
                  {t('res.policy')}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}