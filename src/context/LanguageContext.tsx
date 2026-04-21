'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

type Lang = 'en' | 'ar';

interface ContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
}

const translations = {
  en: {
    'res.success': 'Reservation received',
    'res.next': 'Next',
    'res.prev': 'Back',
    'res.review': 'Review',
    'res.confirm_btn': 'Confirm Reservation',
    'res.confirm_title': 'Ready for the',
    'res.confirm_span': 'Experience?',
    'res.title_title': 'The ',
    'res.title_span': 'Experience',
    'res.placeholder_name': 'Your Name',
    'res.contact_number': 'Phone',
    'res.guest_name': 'Name',
    'res.date': 'Date',
    'res.time': 'Time',
    'res.edit': 'Edit',
    'contact.reservation': 'Reservation',
  },
  ar: {
    'res.success': 'تم استلام الحجز',
    'res.next': 'التالي',
    'res.prev': 'رجوع',
    'res.review': 'مراجعة',
    'res.confirm_btn': 'تأكيد الحجز',
    'res.confirm_title': 'هل أنت مستعد',
    'res.confirm_span': 'للتجربة؟',
    'res.title_title': 'تجربة ',
    'res.title_span': 'سوجي',
    'res.placeholder_name': 'اسمك',
    'res.contact_number': 'رقم الهاتف',
    'res.guest_name': 'الاسم',
    'res.date': 'التاريخ',
    'res.time': 'الوقت',
    'res.edit': 'تعديل',
    'contact.reservation': 'الحجز',
  }
};

const LanguageContext = createContext<ContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    const saved = localStorage.getItem('lang');
    if (saved === 'ar' || saved === 'en') {
      setLang(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
  }, [lang]);

  const t = useCallback((key: string) => {
    return translations[lang][key as keyof typeof translations['en']] || key;
  }, [lang]);

  const value = useMemo(() => ({
    lang,
    setLang,
    t
  }), [lang, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}