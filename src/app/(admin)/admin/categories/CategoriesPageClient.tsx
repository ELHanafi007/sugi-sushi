'use client';

import { useState, useEffect } from 'react';
import { getMenu } from '@/lib/data';
import { updateCategories } from '../actions';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Save, 
  X, 
  Info,
  AlertTriangle
} from 'lucide-react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';

// This is a client component but we need initial data. 
// We'll fetch it in a useEffect or pass it from a server component.
export default function CategoriesPageClient({ initialCategories }: { initialCategories: string[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [newCategory, setNewCategory] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
      setHasChanges(true);
    }
  };

  const handleDelete = (cat: string) => {
    if (confirm(`Are you sure? Products in "${cat}" will lose their category association.`)) {
      setCategories(categories.filter(c => c !== cat));
      setHasChanges(true);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const success = await updateCategories(categories);
    if (success) {
      setHasChanges(false);
      alert('Categories updated successfully');
    } else {
      alert('Failed to update categories');
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-12 pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif italic mb-2">Categories</h1>
          <p className="text-white/20 text-[10px] uppercase tracking-widest font-black font-mono">Organize your menu structure</p>
        </div>

        <div className="flex items-center gap-4">
          <AnimatePresence>
            {hasChanges && (
              <motion.span 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="text-gold/60 text-[10px] font-black font-mono uppercase tracking-widest"
              >
                Unsaved Changes
              </motion.span>
            )}
          </AnimatePresence>
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="bg-gold text-black px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:scale-105 transition-all disabled:opacity-50 shadow-[0_10px_30px_rgba(212,175,55,0.2)]"
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Order'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Category List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-[2rem] bg-gold/5 border border-gold/10 flex gap-4">
            <Info size={20} className="text-gold flex-shrink-0" />
            <p className="text-xs text-gold/80 italic leading-relaxed">
              Drag and drop to reorder categories. This order will reflect directly in the menu sliders on the live site.
            </p>
          </div>

          <Reorder.Group 
            axis="y" 
            values={categories} 
            onReorder={(newOrder) => {
              setCategories(newOrder);
              setHasChanges(true);
            }}
            className="space-y-3"
          >
            {categories.map((cat) => (
              <Reorder.Item 
                key={cat} 
                value={cat}
                className="group relative flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-gold/20 hover:bg-white/[0.04] transition-all duration-300 cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-center gap-4">
                  <GripVertical size={18} className="text-white/10 group-hover:text-gold/40 transition-colors" />
                  <span className="text-lg font-serif italic text-white/80 group-hover:text-white transition-colors">{cat}</span>
                </div>
                
                <button 
                  onClick={() => handleDelete(cat)}
                  className="p-2 rounded-xl text-white/10 hover:text-red-400 hover:bg-red-400/5 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>

        {/* Add New Category */}
        <div className="space-y-8">
          <section className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6">
            <h2 className="text-xl font-serif italic">Add New Category</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-4">Category Name</label>
                <input 
                  type="text" 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g. Signature Sushi"
                  className="w-full bg-white/[0.04] border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-gold/30 transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-white/[0.04] border border-white/5 text-white/60 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-gold/10 hover:text-gold hover:border-gold/20 transition-all duration-500"
              >
                <Plus size={16} />
                Add to List
              </button>
            </form>
          </section>

          <section className="p-8 rounded-[2.5rem] bg-red-400/[0.02] border border-red-400/5 space-y-4">
            <div className="flex items-center gap-3 text-red-400/60">
              <AlertTriangle size={18} />
              <h3 className="text-sm font-black uppercase tracking-widest font-mono">Danger Zone</h3>
            </div>
            <p className="text-[10px] text-white/20 leading-relaxed italic">
              Deleting a category does not delete the products within it, but they will no longer appear under this category filter until reassigned.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
