import { getMenu } from '@/lib/data';
import ProductForm from '../ProductForm';

export default async function NewProductPage() {
  const { categories } = getMenu();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-serif italic mb-2">New Product</h1>
        <p className="text-white/20 text-[10px] uppercase tracking-widest font-black font-mono">Create a masterpiece</p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
