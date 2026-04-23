'use client';

import { useState } from 'react';
import { Dish } from '@/data/menuData';
import { useRouter } from 'next/navigation';
import { upsertProduct } from '../actions';
import { ArrowLeft, Save, X, Plus, Info } from 'lucide-react';
import Link from 'next/link';

export default function ProductForm({ 
  product, 
  categories 
}: { 
  product?: Partial<Dish>, 
  categories: string[] 
}) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Dish>>({
    id: product?.id || `prod-${Date.now()}`,
    name: product?.name || '',
    nameAr: product?.nameAr || '',
    description: product?.description || '',
    descriptionAr: product?.descriptionAr || '',
    price: product?.price || '',
    category: product?.category || categories[0],
    calories: product?.calories || '',
    tags: product?.tags || [],
    allergens: product?.allergens || [],
    image: product?.image || '',
  });

  const [newTag, setNewTag] = useState('');
  const [newAllergen, setNewAllergen] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await upsertProduct(formData as Dish);
    if (success) {
      router.push('/admin/products');
      router.refresh();
    } else {
      alert('Failed to save product');
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag && !formData.tags?.includes(newTag)) {
      setFormData({ ...formData, tags: [...(formData.tags || []), newTag] });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter(t => t !== tag) });
  };

  const addAllergen = () => {
    if (newAllergen && !formData.allergens?.includes(newAllergen)) {
      setFormData({ ...formData, allergens: [...(formData.allergens || []), newAllergen] });
      setNewAllergen('');
    }
  };

  const removeAllergen = (allergen: string) => {
    setFormData({ ...formData, allergens: formData.allergens?.filter(a => a !== allergen) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 pb-24">
      <div className="flex items-center justify-between">
        <Link 
          href="/admin/products"
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Products</span>
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="bg-gold text-black px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:scale-105 transition-all disabled:opacity-50"
        >
          <Save size={16} />
          {loading ? 'Saving...' : 'Save Product'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Basic Info */}
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-6">
            <h2 className="text-2xl font-serif italic border-b border-white/5 pb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-4">Product Name (EN)</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-3xl py-4 px-6 text-white focus:outline-none focus:border-gold/30 transition-all"
                  required
                />
              </div>
              <div className="space-y-2 text-right">
                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 mr-4">Product Name (AR)</label>
                <input 
                  type="text" 
                  dir="rtl"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-3xl py-4 px-6 text-white focus:outline-none focus:border-gold/30 transition-all text-right font-arabic"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-4">Description (EN)</label>
              <textarea 
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-white/[0.02] border border-white/5 rounded-3xl py-4 px-6 text-white focus:outline-none focus:border-gold/30 transition-all resize-none"
              />
            </div>

            <div className="space-y-2 text-right">
              <label className="text-[10px] uppercase tracking-widest font-black text-white/40 mr-4">Description (AR)</label>
              <textarea 
                rows={3}
                dir="rtl"
                value={formData.descriptionAr}
                onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                className="w-full bg-white/[0.02] border border-white/5 rounded-3xl py-4 px-6 text-white focus:outline-none focus:border-gold/30 transition-all resize-none text-right font-arabic"
              />
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-serif italic border-b border-white/5 pb-4">Classification & Pricing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-4">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-3xl py-4 px-6 text-white focus:outline-none focus:border-gold/30 transition-all appearance-none cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-[#060608]">{cat}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-4">Price (e.g. 20 SR)</label>
                <input 
                  type="text" 
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-3xl py-4 px-6 text-white focus:outline-none focus:border-gold/30 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-4">Calories</label>
                <input 
                  type="text" 
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-3xl py-4 px-6 text-white focus:outline-none focus:border-gold/30 transition-all"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Media & Tags */}
        <div className="space-y-8">
          <section className="space-y-6">
            <h2 className="text-2xl font-serif italic border-b border-white/5 pb-4">Product Image</h2>
            <div className="space-y-4">
              <div className="aspect-square rounded-[2rem] bg-white/[0.02] border border-white/5 overflow-hidden flex items-center justify-center relative group">
                {formData.image ? (
                  <>
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
                      className="absolute top-4 right-4 p-2 bg-black/60 rounded-full text-white/60 hover:text-white transition-all"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-8">
                    <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto mb-4 text-white/10">
                      <Plus size={32} />
                    </div>
                    <p className="text-white/20 text-xs font-mono uppercase tracking-widest">No Image Set</p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-4">Image URL</label>
                <input 
                  type="url" 
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-3xl py-4 px-6 text-white focus:outline-none focus:border-gold/30 transition-all text-xs"
                />
              </div>
              <div className="p-4 rounded-2xl bg-gold/5 border border-gold/10 flex gap-3">
                <Info size={16} className="text-gold flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-gold/60 leading-relaxed italic">
                  Tip: Use high-quality Unsplash or Cloudinary URLs for the best cinematic look.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-serif italic border-b border-white/5 pb-4">Tags & Labels</h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map(tag => (
                  <span key={tag} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/60">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Add tag (e.g. Signature)" 
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl py-3 px-6 text-white focus:outline-none focus:border-gold/30 transition-all text-xs"
                />
                <button 
                  type="button" 
                  onClick={addTag}
                  className="p-3 bg-white/[0.04] rounded-2xl text-gold hover:bg-gold/10 transition-all"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-serif italic border-b border-white/5 pb-4">Allergies</h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.allergens?.map(allergen => (
                  <span key={allergen} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/60">
                    {allergen}
                    <button type="button" onClick={() => removeAllergen(allergen)} className="hover:text-red-400 transition-colors">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Add allergy (e.g. Nuts)" 
                  value={newAllergen}
                  onChange={(e) => setNewAllergen(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergen())}
                  className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl py-3 px-6 text-white focus:outline-none focus:border-gold/30 transition-all text-xs"
                />
                <button 
                  type="button" 
                  onClick={addAllergen}
                  className="p-3 bg-white/[0.04] rounded-2xl text-gold hover:bg-gold/10 transition-all"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
