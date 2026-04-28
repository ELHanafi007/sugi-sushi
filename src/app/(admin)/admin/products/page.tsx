import { getMenu } from '@/lib/data';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ExternalLink 
} from 'lucide-react';
import ProductListClient from './ProductListClient';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const { products, categories } = await getMenu();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif italic mb-2">Products</h1>
          <p className="text-white/20 text-[10px] uppercase tracking-widest font-black font-mono">Manage your offerings</p>
        </div>
      </div>

      <ProductListClient initialProducts={products} categories={categories} />
    </div>
  );
}
