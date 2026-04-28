import { getMenu } from '@/lib/data';
import ProductForm from '../ProductForm';
import { Suspense } from 'react';

export default async function NewProductPage() {
  const { categories } = await getMenu();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif italic text-white/90">New Product</h1>
        <p className="text-white/25 text-[11px] font-mono uppercase tracking-widest mt-1">
          Add a new item to your menu
        </p>
      </div>

      <Suspense fallback={<div className="p-8 text-white/20 text-[13px]">Loading form...</div>}>
        <ProductForm categories={categories} />
      </Suspense>
    </div>
  );
}
