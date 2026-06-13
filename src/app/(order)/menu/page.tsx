'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useOrderSession } from '@/context/OrderSessionContext';
import { getMenu } from '@/lib/data';
import StrictMenu from '@/components/StrictMenu';

function MenuContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { validateTableAndSession, isValidTable } = useOrderSession();
  const [loading, setLoading] = useState(true);
  const [menuData, setMenuData] = useState<any>(null);

  useEffect(() => {
    const tableParam = searchParams.get('table');
    
    if (!tableParam) {
      setLoading(false);
      return;
    }

    const init = async () => {
      const valid = await validateTableAndSession(tableParam);
      if (valid) {
        const data = await getMenu();
        setMenuData(data);
      }
      setLoading(false);
    };

    init();
  }, [searchParams, validateTableAndSession]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060608]">
        <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (isValidTable === false || !searchParams.get('table')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#060608]">
        <h1 className="text-3xl font-serif italic text-white mb-4">Welcome to SUGI</h1>
        <p className="text-white/60">Please scan the QR code on your table to start ordering.</p>
      </div>
    );
  }

  if (menuData) {
    return (
      <StrictMenu 
        initialMenuData={menuData.products} 
        initialCategories={menuData.categories} 
        initialCategoryData={menuData.categoryData} 
      />
    );
  }

  return null;
}

export default function OrderMenuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#060608]" />}>
      <MenuContent />
    </Suspense>
  );
}
