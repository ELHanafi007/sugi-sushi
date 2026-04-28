import { getMenu } from '@/lib/data';
import ProductForm from '../ProductForm';

import { Suspense } from 'react';

export default async function NewProductPage() {
  const { categories } = await getMenu();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-serif italic mb-2">New Product</h1>
        <p className="text-white/20 text-[10px] uppercase tracking-widest font-black font-mono">Create a masterpiece</p>
      </div>

      <Suspense fallback={<div className="p-8 text-white/40 italic font-serif">Loading form...</div>}>
        <ProductForm categories={categories} />
      </Suspense>
    </div>
  );
}
