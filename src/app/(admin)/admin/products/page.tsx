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
        
        <Link 
          href="/admin/products/new"
          className="bg-gold text-black px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:scale-105 transition-all duration-500 shadow-[0_10px_30px_rgba(212,175,55,0.2)]"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      <ProductListClient initialProducts={products} categories={categories} />
    </div>
  );
}
