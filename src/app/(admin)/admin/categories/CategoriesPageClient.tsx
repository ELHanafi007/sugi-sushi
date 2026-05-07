'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateCategories } from '../actions';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Save, 
  Check,
  AlertTriangle
} from 'lucide-react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';

export default function CategoriesPageClient({ initialCategories }: { initialCategories: { name: string, image: string }[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [newCategory, setNewCategory] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory && !categories.some(c => c.name === newCategory)) {
      setCategories([...categories, { name: newCategory, image: '' }]);
      setNewCategory('');
      setHasChanges(true);
      setSaved(false);
    }
  };

  const handleDelete = (catName: string) => {
    setCategories(categories.filter(c => c.name !== catName));
    setHasChanges(true);
    setSaved(false);
    setDeleteConfirm(null);
  };

  const handleUpdateImage = (name: string, image: string) => {
    setCategories(categories.map(c => c.name === name ? { ...c, image } : c));
    setHasChanges(true);
    setSaved(false);
  };

  const handleFileUpload = async (name: string, file: File) => {
    if (!file) return;
    
    setUploadingId(name);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'category');
    formData.append('id', name.toLowerCase().replace(/[^a-z0-9]/g, '-'));

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        handleUpdateImage(name, data.url);
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploadingId(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const success = await updateCategories(categories);
    if (success) {
      setHasChanges(false);
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    } else {
      alert('Failed to update categories');
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif italic text-white/90">Categories</h1>
          <p className="text-white/25 text-[11px] font-mono uppercase tracking-widest mt-1">
            {categories.length} categories — drag to reorder
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {hasChanges && (
              <motion.span 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="text-gold/50 text-[10px] font-mono uppercase tracking-widest"
              >
                Unsaved
              </motion.span>
            )}
            {saved && (
              <motion.span 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="text-emerald-400 text-[12px] flex items-center gap-1"
              >
                <Check size={14} />
                Saved
              </motion.span>
            )}
          </AnimatePresence>
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="flex items-center gap-2 bg-gold hover:bg-gold/90 text-black px-6 py-2.5 rounded-xl font-semibold text-[13px] transition-all disabled:opacity-30"
          >
            <Save size={14} />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category List */}
        <div className="lg:col-span-2 space-y-4">
          <Reorder.Group 
            axis="y" 
            values={categories} 
            onReorder={(newOrder) => {
              setCategories(newOrder);
              setHasChanges(true);
              setSaved(false);
            }}
            className="space-y-2"
          >
            {categories.map((cat, index) => (
              <Reorder.Item 
                key={cat.name} 
                value={cat}
                className="group flex flex-col p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <GripVertical size={14} className="text-white/10 group-hover:text-white/25 transition-colors cursor-grab active:cursor-grabbing" />
                    <span className="text-white/15 text-[10px] font-mono w-5">{index + 1}</span>
                    <span className="text-[14px] text-white/60 group-hover:text-white/80 transition-colors">{cat.name}</span>
                  </div>
                  
                  {deleteConfirm === cat.name ? (
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleDelete(cat.name)}
                        className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 text-[10px] font-bold hover:bg-red-500/30 transition-all"
                      >
                        Delete
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm(null)}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-white/30 text-[10px] hover:bg-white/[0.08] transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setDeleteConfirm(cat.name)}
                      className="p-1.5 rounded-lg text-white/8 hover:text-red-400 hover:bg-red-400/5 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4 pl-7">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-white/[0.02] flex-shrink-0 group/img">
                    {cat.image ? (
                      <>
                        <img 
                          src={cat.image} 
                          alt={cat.name} 
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=100&q=20';
                          }}
                        />
                        <button 
                          onClick={() => handleUpdateImage(cat.name, '')}
                          className="absolute inset-0 bg-red-500/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white"
                          title="Remove Image"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center text-white/10 hover:text-gold/50 hover:bg-gold/5 cursor-pointer transition-all gap-1">
                        <Plus size={18} />
                        <span className="text-[8px] font-mono uppercase tracking-widest">Upload</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(cat.name, file);
                          }}
                        />
                      </label>
                    )}
                    {uploadingId === cat.name && (
                      <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                        <span className="text-[7px] text-gold font-mono uppercase tracking-widest animate-pulse">Wait</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-white/20 font-mono uppercase tracking-widest">Category Photo</span>
                    <p className="text-[11px] text-white/40 italic">
                      {cat.image ? 'Custom image active' : 'Using default stock image'}
                    </p>
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          {categories.length === 0 && (
            <div className="py-12 text-center bg-white/[0.01] border border-dashed border-white/[0.06] rounded-xl">
              <p className="text-white/15 text-[13px]">No categories yet. Add one to get started.</p>
            </div>
          )}
        </div>

        {/* Add New Category */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
            <h2 className="text-[14px] font-medium text-white/60">Add Category</h2>
            <form onSubmit={handleAdd} className="space-y-3">
              <input 
                type="text" 
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g. Signature Rolls"
                className="admin-input text-[13px]"
              />
              <button
                type="submit"
                disabled={!newCategory || categories.some(c => c.name === newCategory)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-gold hover:bg-gold/[0.06] hover:border-gold/15 transition-all text-[12px] font-medium disabled:opacity-20"
              >
                <Plus size={14} />
                Add Category
              </button>
            </form>
          </div>

          <div className="p-4 rounded-xl bg-red-400/[0.02] border border-red-400/[0.06] space-y-2">
            <div className="flex items-center gap-2 text-red-400/40">
              <AlertTriangle size={14} />
              <h3 className="text-[10px] font-mono uppercase tracking-widest font-bold">Note</h3>
            </div>
            <p className="text-[11px] text-white/20 leading-relaxed">
              Deleting a category won't delete the products inside it, but they'll lose their category until reassigned.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
