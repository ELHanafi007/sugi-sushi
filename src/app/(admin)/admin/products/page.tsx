import { getMenu } from '@/lib/data';
import ProductListClient from './ProductListClient';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const { products, categories } = await getMenu();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif italic text-white/90">Products</h1>
        <p className="text-white/25 text-[11px] font-mono uppercase tracking-widest mt-1">
          {products.length} items across {categories.length} categories
        </p>
      </div>

      <ProductListClient initialProducts={products} categories={categories} />
    </div>
  );
}
