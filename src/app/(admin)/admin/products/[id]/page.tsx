import { getMenu } from '@/lib/data';
import ProductForm from '../ProductForm';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const { products, categories } = await getMenu();
  const product = products.find(p => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif italic text-white/90">Edit Product</h1>
        <p className="text-white/25 text-[11px] font-mono uppercase tracking-widest mt-1">
          {product.name} — {product.category}
        </p>
      </div>

      <Suspense fallback={<div className="p-8 text-white/20 text-[13px]">Loading form...</div>}>
        <ProductForm product={product} categories={categories} />
      </Suspense>
    </div>
  );
}
