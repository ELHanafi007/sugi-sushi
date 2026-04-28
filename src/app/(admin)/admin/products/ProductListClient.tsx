'use client';

import { useState, useEffect } from 'react';
import { Dish } from '@/data/menuData';
import { Search, Edit2, Trash2, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { deleteProduct } from '../actions';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductListClient({ 
  initialProducts, 
  categories 
}: { 
  initialProducts: Dish[], 
  categories: string[] 
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState(initialProducts);

  const router = useRouter();

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          (p.nameAr && p.nameAr.includes(search));
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const success = await deleteProduct(id);
      if (success) {
        setProducts(products.filter(p => p.id !== id));
        router.refresh();
      } else {
        alert('Failed to delete product');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={20} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/5 rounded-full py-4 pl-14 pr-6 text-white focus:outline-none focus:border-gold/30 transition-all"
          />
        </div>
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white/[0.02] border border-white/5 rounded-full py-4 px-8 text-white focus:outline-none focus:border-gold/30 appearance-none cursor-pointer"
        >
          <option value="All" className="bg-[#060608]">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat} className="bg-[#060608]">{cat}</option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => (
            <motion.div
              layout
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group bg-white/[0.02] border border-white/5 rounded-[2rem] p-4 flex items-center gap-6 hover:border-gold/20 transition-all duration-500"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-white/[0.04]">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/5">
                    <Utensils size={24} />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-gold/40 text-[8px] font-black font-mono uppercase tracking-widest">{product.category}</span>
                  <div className="w-1 h-1 rounded-full bg-white/10" />
                  <span className="text-white/20 text-[8px] font-mono">{product.id}</span>
                </div>
                <h3 className="text-xl font-serif italic text-white group-hover:text-gold transition-colors truncate">{product.name}</h3>
                <p className="text-white/20 text-xs truncate max-w-md">{product.description}</p>
              </div>

              <div className="text-right hidden sm:block">
                <p className="text-gold font-serif text-xl">{product.price || 'N/A'}</p>
                <p className="text-white/10 text-[9px] font-mono mt-1 uppercase">{product.calories || '-'}</p>
              </div>

              <div className="flex items-center gap-2 pl-4 border-l border-white/5">
                <Link 
                  href={`/admin/products/${product.id}`}
                  className="p-3 rounded-xl bg-white/[0.04] text-white/40 hover:text-gold hover:bg-gold/10 transition-all"
                >
                  <Edit2 size={18} />
                </Link>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="p-3 rounded-xl bg-white/[0.04] text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-[3rem]">
            <p className="text-white/20 font-serif italic text-xl">No products found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Utensils({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
      <path d="M7 2v20"/>
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
    </svg>
  );
}
