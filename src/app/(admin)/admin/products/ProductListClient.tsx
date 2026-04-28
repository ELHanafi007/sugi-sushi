'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Dish } from '@/data/menuData';
import { 
  Search, Edit2, Trash2, Plus, LayoutGrid, List, 
  Filter, X, Image as ImageIcon, ChevronDown, 
  AlertCircle, ArrowUpDown
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { deleteProduct } from '../actions';
import { motion, AnimatePresence } from 'framer-motion';

type ViewMode = 'table' | 'grid';
type SortField = 'name' | 'category' | 'price';
type SortDir = 'asc' | 'desc';

export default function ProductListClient({ 
  initialProducts, 
  categories 
}: { 
  initialProducts: Dish[], 
  categories: string[] 
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [activeFilter, setActiveFilter] = useState<string>(searchParams.get('filter') || '');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // Apply URL params on mount
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const filter = searchParams.get('filter');
    if (filter) setActiveFilter(filter);
  }, [searchParams]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const filteredProducts = useMemo(() => {
    let result = products;
    
    // Text search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.nameAr && p.nameAr.includes(search)) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }
    
    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    // Special filters
    if (activeFilter === 'no-price') {
      result = result.filter(p => !p.price || p.price === '');
    }
    if (activeFilter === 'no-image') {
      result = result.filter(p => !p.image);
    }
    
    // Sort
    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') cmp = a.name.localeCompare(b.name);
      if (sortField === 'category') cmp = a.category.localeCompare(b.category);
      if (sortField === 'price') {
        const pa = parseFloat((a.price || '0').replace(/[^0-9.]/g, '')) || 0;
        const pb = parseFloat((b.price || '0').replace(/[^0-9.]/g, '')) || 0;
        cmp = pa - pb;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    
    return result;
  }, [products, search, selectedCategory, activeFilter, sortField, sortDir]);

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    const success = await deleteProduct(id);
    if (success) {
      setProducts(prev => prev.filter(p => p.id !== id));
      router.refresh();
    } else {
      alert('Failed to delete product');
    }
    setIsDeleting(null);
    setDeleteConfirm(null);
  };

  const clearAllFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setActiveFilter('');
  };

  const hasActiveFilters = search || selectedCategory !== 'all' || activeFilter;

  return (
    <div className="space-y-5">
      {/* Controls Bar */}
      <div className="flex flex-col gap-4">
        {/* Search + Actions row */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/15" size={16} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.025] border border-white/[0.06] rounded-xl py-3 pl-11 pr-4 text-[13px] text-white placeholder:text-white/15 focus:outline-none focus:border-gold/30 transition-all"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50"
              >
                <X size={14} />
              </button>
            )}
          </div>
          
          {/* Filter toggle */}
          <button 
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`p-3 rounded-xl border transition-all flex-shrink-0 ${
              showFilterPanel || hasActiveFilters
                ? 'bg-gold/[0.08] border-gold/20 text-gold' 
                : 'bg-white/[0.025] border-white/[0.06] text-white/30 hover:text-white/50'
            }`}
          >
            <Filter size={16} />
          </button>

          {/* View toggle */}
          <div className="flex items-center bg-white/[0.025] border border-white/[0.06] rounded-xl overflow-hidden flex-shrink-0">
            <button 
              onClick={() => setViewMode('table')}
              className={`p-3 transition-all ${viewMode === 'table' ? 'bg-white/[0.06] text-gold' : 'text-white/25 hover:text-white/50'}`}
            >
              <List size={16} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-3 transition-all ${viewMode === 'grid' ? 'bg-white/[0.06] text-gold' : 'text-white/25 hover:text-white/50'}`}
            >
              <LayoutGrid size={16} />
            </button>
          </div>

          {/* Add product */}
          <Link 
            href="/admin/products/new"
            className="flex items-center gap-2 bg-gold hover:bg-gold/90 text-black px-5 py-3 rounded-xl font-semibold transition-all flex-shrink-0 text-[13px]"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Product</span>
          </Link>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilterPanel && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-white/[0.015] border border-white/[0.06] rounded-xl space-y-3">
                {/* Category filter */}
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/25 block mb-2">Category</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                        selectedCategory === 'all' 
                          ? 'bg-gold/15 text-gold border border-gold/25' 
                          : 'bg-white/[0.03] text-white/30 border border-white/[0.05] hover:text-white/50'
                      }`}
                    >
                      All ({products.length})
                    </button>
                    {categories.map(cat => {
                      const count = products.filter(p => p.category === cat).length;
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                            selectedCategory === cat 
                              ? 'bg-gold/15 text-gold border border-gold/25' 
                              : 'bg-white/[0.03] text-white/30 border border-white/[0.05] hover:text-white/50'
                          }`}
                        >
                          {cat} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Quick filters */}
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/25 block mb-2">Quick Filters</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveFilter(activeFilter === 'no-price' ? '' : 'no-price')}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                        activeFilter === 'no-price' 
                          ? 'bg-amber-400/15 text-amber-400 border border-amber-400/25' 
                          : 'bg-white/[0.03] text-white/30 border border-white/[0.05] hover:text-white/50'
                      }`}
                    >
                      <AlertCircle size={12} />
                      No Price
                    </button>
                    <button
                      onClick={() => setActiveFilter(activeFilter === 'no-image' ? '' : 'no-image')}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                        activeFilter === 'no-image' 
                          ? 'bg-amber-400/15 text-amber-400 border border-amber-400/25' 
                          : 'bg-white/[0.03] text-white/30 border border-white/[0.05] hover:text-white/50'
                      }`}
                    >
                      <ImageIcon size={12} />
                      No Image
                    </button>
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-[11px] text-white/30 hover:text-white/60 transition-colors flex items-center gap-1"
                  >
                    <X size={12} />
                    Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-white/25 font-mono">
          {filteredProducts.length} of {products.length} products
          {selectedCategory !== 'all' && <span> in <span className="text-white/40">{selectedCategory}</span></span>}
        </p>
      </div>

      {/* ─── Table View ─── */}
      {viewMode === 'table' && (
        <div className="bg-white/[0.015] border border-white/[0.06] rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[minmax(0,1fr)_120px_130px_100px] md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_100px_100px_100px] gap-1 px-4 py-3 bg-white/[0.02] border-b border-white/[0.04] text-[10px] font-mono uppercase tracking-widest text-white/20">
            <button onClick={() => toggleSort('name')} className="flex items-center gap-1 hover:text-white/40 transition-colors text-left">
              Product
              {sortField === 'name' && <ArrowUpDown size={10} className="text-gold/50" />}
            </button>
            <button onClick={() => toggleSort('category')} className="hidden md:flex items-center gap-1 hover:text-white/40 transition-colors text-left">
              Category
              {sortField === 'category' && <ArrowUpDown size={10} className="text-gold/50" />}
            </button>
            <button onClick={() => toggleSort('price')} className="flex items-center gap-1 hover:text-white/40 transition-colors text-left">
              Price
              {sortField === 'price' && <ArrowUpDown size={10} className="text-gold/50" />}
            </button>
            <span className="text-center">Status</span>
            <span className="text-right">Actions</span>
          </div>

          {/* Table rows */}
          <div className="divide-y divide-white/[0.03]">
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-white/20 text-[13px]">No products found.</p>
                {hasActiveFilters && (
                  <button onClick={clearAllFilters} className="text-gold/50 hover:text-gold text-[12px] mt-2">
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="grid grid-cols-[minmax(0,1fr)_120px_130px_100px] md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_100px_100px_100px] gap-1 px-4 py-3 hover:bg-white/[0.02] transition-colors group items-center"
                >
                  {/* Product info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/[0.03] border border-white/[0.04]">
                      {product.image ? (
                        <img src={product.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10">
                          <ImageIcon size={14} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] text-white/80 truncate font-medium">{product.name}</p>
                      <p className="text-[11px] text-white/20 truncate md:hidden">{product.category}</p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="hidden md:block min-w-0">
                    <span className="text-[11px] text-white/30 truncate block">{product.category}</span>
                  </div>

                  {/* Price */}
                  <div>
                    {product.price ? (
                      <span className="text-[13px] text-gold/70 font-mono">{product.price}</span>
                    ) : (
                      <span className="text-[11px] text-amber-400/50 flex items-center gap-1">
                        <AlertCircle size={10} />
                        No price
                      </span>
                    )}
                  </div>

                  {/* Status indicators */}
                  <div className="flex items-center justify-center gap-1">
                    {!product.image && (
                      <span className="w-2 h-2 rounded-full bg-amber-400/40" title="No image" />
                    )}
                    {!product.price && (
                      <span className="w-2 h-2 rounded-full bg-red-400/40" title="No price" />
                    )}
                    {product.image && product.price && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400/40" title="Complete" />
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="p-2 rounded-lg text-white/20 hover:text-gold hover:bg-gold/10 transition-all"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </Link>
                    
                    {deleteConfirm === product.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={isDeleting === product.id}
                          className="px-2 py-1 rounded-lg bg-red-500/20 text-red-400 text-[10px] font-bold hover:bg-red-500/30 transition-all disabled:opacity-50"
                        >
                          {isDeleting === product.id ? '...' : 'Yes'}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-2 py-1 rounded-lg bg-white/[0.04] text-white/30 text-[10px] hover:bg-white/[0.08] transition-all"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ─── Grid View ─── */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full py-16 text-center">
              <p className="text-white/20 text-[13px]">No products found.</p>
              {hasActiveFilters && (
                <button onClick={clearAllFilters} className="text-gold/50 hover:text-gold text-[12px] mt-2">
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            filteredProducts.map(product => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-gold/15 transition-all"
              >
                {/* Image */}
                <div className="aspect-[16/10] bg-white/[0.02] relative overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/[0.06]">
                      <ImageIcon size={40} />
                    </div>
                  )}
                  {/* Category badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-mono uppercase tracking-wider text-white/60">
                    {product.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-[14px] font-medium text-white/80 line-clamp-1">{product.name}</h3>
                    {product.price ? (
                      <span className="text-gold/70 text-[13px] font-mono flex-shrink-0">{product.price}</span>
                    ) : (
                      <span className="text-amber-400/50 text-[10px] flex-shrink-0 flex items-center gap-1">
                        <AlertCircle size={10} /> N/A
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/20 line-clamp-2 mb-4">
                    {product.description || 'No description'}
                  </p>

                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.04] text-[9px] font-mono uppercase tracking-wider text-white/25">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-white/[0.04]">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/[0.03] text-white/40 hover:text-gold hover:bg-gold/10 transition-all text-[12px] font-medium"
                    >
                      <Edit2 size={13} />
                      Edit
                    </Link>
                    {deleteConfirm === product.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={isDeleting === product.id}
                          className="px-3 py-2 rounded-lg bg-red-500/20 text-red-400 text-[11px] font-bold hover:bg-red-500/30 transition-all disabled:opacity-50"
                        >
                          {isDeleting === product.id ? '...' : 'Confirm'}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-2 rounded-lg bg-white/[0.04] text-white/30 text-[11px] hover:bg-white/[0.08] transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="py-2 px-3 rounded-lg bg-white/[0.03] text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
