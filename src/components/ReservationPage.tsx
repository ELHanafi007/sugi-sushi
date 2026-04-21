'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

export default function ReservationPage() {
  const { t, lang } = useLanguage();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '2',
    date: '',
    time: ''
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t('res.success'));
  };

  return (
    <div className="min-h-screen bg-bg relative pt-56 pb-[120px] overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <Image
          src="https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1600&q=80"
          alt="Atmosphere"
          fill
          className="object-cover grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg" />
      </div>

      <div className="container-luxury relative z-10">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5 }}
              className="flex items-center justify-center gap-8 mb-10"
            >
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold/30" />
              <span className="text-mono text-gold/50 text-[10px] tracking-[1.2em] uppercase font-black">
                {t('contact.reservation')}
              </span>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold/30" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 2 }}
              className="text-white text-6xl md:text-9xl font-serif font-light mb-10 italic"
            >
              {t('res.title_title')}
              <span className="shimmer-gold not-italic font-black">
                {t('res.title_span')}
              </span>
            </motion.h1>

            <div className="flex justify-center gap-4 text-white/20 text-xs uppercase">
              <span className={step >= 1 ? 'text-gold' : ''}>01 {t('res.details')}</span>
              <span className={step >= 2 ? 'text-gold' : ''}>02 {t('res.timing')}</span>
              <span className={step >= 3 ? 'text-gold' : ''}>03 {t('res.finalize')}</span>
            </div>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">

            {/* STEP 1 */}
            {step === 1 && (
              <motion.div key="step1" className="luxury-card p-12 space-y-10">
                <input
                  placeholder={t('res.placeholder_name')}
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />

                <input
                  placeholder="+966"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />

                <button onClick={nextStep}>
                  {t('res.next')}
                </button>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div key="step2" className="luxury-card p-12 space-y-10">

                <div>
                  <label>{t('res.date')}</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div>
                  <label>{t('res.time')}</label>

                  <div className="grid grid-cols-2 gap-2">
                    {['19:00', '20:00', '21:00', '22:00'].map(slot => (
                      <button
                        key={slot}
                        onClick={() => setFormData({ ...formData, time: slot })}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button onClick={prevStep}>{t('res.prev')}</button>
                  <button onClick={nextStep}>{t('res.review')}</button>
                </div>

              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.div key="step3" className="luxury-card p-12 text-center space-y-10">
                
                <h2>
                  {t('res.confirm_title')} {t('res.confirm_span')}
                </h2>

                <p>{formData.name}</p>
                <p>{formData.date} {formData.time}</p>

                <button onClick={handleSubmit}>
                  {t('res.confirm_btn')}
                </button>

                <button onClick={prevStep}>
                  {t('res.edit')}
                </button>

              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}