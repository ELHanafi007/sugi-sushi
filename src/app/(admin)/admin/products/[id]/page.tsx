import { getMenu } from '@/lib/data';
import ProductForm from '../ProductForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const fetchCache = 'no-store';

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
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-serif italic mb-2">Edit Product</h1>
        <p className="text-white/20 text-[10px] uppercase tracking-widest font-black font-mono">Refining the details</p>
      </div>

      <ProductForm product={product} categories={categories} />
    </div>
  );
}
