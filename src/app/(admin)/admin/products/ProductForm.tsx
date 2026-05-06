'use client';

import { useState, useRef } from 'react';
import { Dish } from '@/data/menuData';
import { useRouter, useSearchParams } from 'next/navigation';
import { upsertProduct } from '../actions';
import { ArrowLeft, Save, X, Plus, Upload, Image as ImageIcon, Check } from 'lucide-react';
import Link from 'next/link';

export default function ProductForm({ 
  product, 
  categories 
}: { 
  product?: Partial<Dish>, 
  categories: string[] 
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultCategory = searchParams.get('category') || categories[0];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const isEditing = !!product?.id;
  
  const [formData, setFormData] = useState<Partial<Dish>>({
    id: product?.id || `prod-${Date.now()}`,
    name: product?.name || '',
    nameAr: product?.nameAr || '',
    description: product?.description || '',
    descriptionAr: product?.descriptionAr || '',
    price: product?.price || '',
    category: product?.category || defaultCategory,
    calories: product?.calories || '',
    tags: product?.tags || [],
    portions: product?.portions || [],
    allergens: product?.allergens || [],
    image: product?.image || '',
  });

  const [newTag, setNewTag] = useState('');
  const [newAllergen, setNewAllergen] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'tags' | 'portions'>('basic');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPG, PNG, and WebP files are allowed');
      return;
    }

    setUploading(true);
    
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('productId', formData.id || `prod-${Date.now()}`);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await res.json();

      if (data.success) {
        setFormData({ ...formData, image: data.url });
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('=== SUBMITTING PRODUCT ===');
    console.log('FormData:', formData);
    const result = await upsertProduct(formData as Dish);
    console.log('=== RESULT ===', result);
    if (result && result.success) {
      setSaved(true);
      setTimeout(() => {
        router.refresh();
        router.push('/admin/products');
      }, 600);
    } else {
      alert('Failed to save product: ' + (result?.error || 'Unknown error'));
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

  const tabs = [
    { id: 'basic' as const, label: 'Details' },
    { id: 'portions' as const, label: 'Portions' },
    { id: 'media' as const, label: 'Image' },
    { id: 'tags' as const, label: 'Tags & Allergies' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link 
          href="/admin/products"
          className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors text-[13px]"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Back</span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Saved indicator */}
          {saved && (
            <span className="flex items-center gap-1.5 text-emerald-400 text-[12px]">
              <Check size={14} />
              Saved
            </span>
          )}
          <button
            type="submit"
            disabled={loading || saved}
            className="flex items-center gap-2 bg-gold hover:bg-gold/90 text-black px-6 py-2.5 rounded-xl font-semibold text-[13px] transition-all disabled:opacity-50"
          >
            <Save size={14} />
            {loading ? 'Saving...' : saved ? 'Saved!' : isEditing ? 'Update' : 'Create'}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.06] rounded-xl p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 rounded-lg text-[12px] font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white/[0.06] text-white/80'
                : 'text-white/25 hover:text-white/45'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Basic Details Tab ─── */}
      {activeTab === 'basic' && (
        <div className="space-y-5">
          {/* Product Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldGroup label="Name (EN)">
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="admin-input"
                placeholder="e.g. Salmon Maki"
                required
              />
            </FieldGroup>
            <FieldGroup label="Name (AR)" align="right">
              <input 
                type="text" 
                dir="rtl"
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                className="admin-input text-right font-arabic"
                placeholder="الاسم بالعربية"
              />
            </FieldGroup>
          </div>

          {/* Description */}
          <FieldGroup label="Description (EN)">
            <textarea 
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="admin-input resize-none"
              placeholder="Brief description of the dish..."
            />
          </FieldGroup>

          <FieldGroup label="Description (AR)" align="right">
            <textarea 
              rows={2}
              dir="rtl"
              value={formData.descriptionAr}
              onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
              className="admin-input resize-none text-right font-arabic"
              placeholder="الوصف بالعربية"
            />
          </FieldGroup>

          {/* Category, Price, Calories */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FieldGroup label="Category">
              <select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="admin-input appearance-none cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-[#0a0a0c]">{cat}</option>
                ))}
              </select>
            </FieldGroup>
            <FieldGroup label="Price">
              <input 
                type="text" 
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="admin-input"
                placeholder="e.g. 35 SR"
              />
            </FieldGroup>
            <FieldGroup label="Calories">
              <input 
                type="text" 
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                className="admin-input"
                placeholder="e.g. 250 cal"
              />
            </FieldGroup>
          </div>
        </div>
      )}

      {/* ─── Media Tab ─── */}
      {activeTab === 'media' && (
        <div className="space-y-5">
          {/* Image preview */}
          <div className="aspect-[16/10] max-w-lg mx-auto rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden relative group">
            {formData.image ? (
              <>
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, image: '' })}
                  className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-xl text-white/60 hover:text-white transition-all"
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-white/10">
                <ImageIcon size={40} />
                <p className="text-[11px] font-mono uppercase tracking-widest">No image</p>
              </div>
            )}
          </div>

          {/* Upload button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />

          <div className="max-w-lg mx-auto space-y-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 bg-gold/[0.08] hover:bg-gold/[0.15] border border-gold/20 text-gold py-3 rounded-xl font-medium text-[13px] transition-all disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Upload Image
                </>
              )}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/[0.04]" />
              <span className="text-[10px] font-mono text-white/15 uppercase tracking-widest">or paste url</span>
              <div className="flex-1 h-px bg-white/[0.04]" />
            </div>

            <input 
              type="url" 
              placeholder="https://..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="admin-input text-[12px]"
            />

            <p className="text-[10px] text-white/15 text-center">
              JPG, PNG, or WebP • Max 5MB
            </p>
          </div>
        </div>
      )}

      {/* ─── Tags & Allergies Tab ─── */}
      {activeTab === 'tags' && (
        <div className="space-y-8">
          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-[13px] font-medium text-white/50">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map(tag => (
                <span key={tag} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] text-white/50">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors">
                    <X size={12} />
                  </button>
                </span>
              ))}
              {(!formData.tags || formData.tags.length === 0) && (
                <span className="text-[11px] text-white/15 italic">No tags added</span>
              )}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Add tag (e.g. Signature)" 
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="admin-input flex-1 text-[12px]"
              />
              <button 
                type="button" 
                onClick={addTag}
                className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-gold hover:bg-gold/10 transition-all"
              >
                <Plus size={16} />
              </button>
            </div>
            {/* Quick-add tag suggestions */}
            <div className="flex flex-wrap gap-1.5">
              {['Signature', 'Best Seller', 'New', 'Spicy', 'Vegetarian', 'Seafood', 'Premium', 'Classic', "Chef's Choice", 'Healthy'].map(suggestion => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    if (!formData.tags?.includes(suggestion)) {
                      setFormData({ ...formData, tags: [...(formData.tags || []), suggestion] });
                    }
                  }}
                  disabled={formData.tags?.includes(suggestion)}
                  className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider bg-white/[0.02] border border-white/[0.04] text-white/20 hover:text-gold/60 hover:border-gold/15 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Allergens */}
          <div className="space-y-4">
            <h3 className="text-[13px] font-medium text-white/50">Allergens</h3>
            <div className="flex flex-wrap gap-2">
              {formData.allergens?.map(allergen => (
                <span key={allergen} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-400/[0.04] border border-red-400/10 text-[11px] text-red-400/60">
                  {allergen}
                  <button type="button" onClick={() => removeAllergen(allergen)} className="hover:text-red-400 transition-colors">
                    <X size={12} />
                  </button>
                </span>
              ))}
              {(!formData.allergens || formData.allergens.length === 0) && (
                <span className="text-[11px] text-white/15 italic">No allergens added</span>
              )}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Add allergen (e.g. Nuts)" 
                value={newAllergen}
                onChange={(e) => setNewAllergen(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergen())}
                className="admin-input flex-1 text-[12px]"
              />
              <button 
                type="button" 
                onClick={addAllergen}
                className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-gold hover:bg-gold/10 transition-all"
              >
                <Plus size={16} />
              </button>
            </div>
            {/* Quick-add allergen suggestions */}
            <div className="flex flex-wrap gap-1.5">
              {['Shellfish', 'Fish', 'Soy', 'Gluten', 'Egg', 'Nuts', 'Peanuts', 'Sesame', 'Dairy', 'Wheat'].map(suggestion => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    if (!formData.allergens?.includes(suggestion)) {
                      setFormData({ ...formData, allergens: [...(formData.allergens || []), suggestion] });
                    }
                  }}
                  disabled={formData.allergens?.includes(suggestion)}
                  className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider bg-red-400/[0.02] border border-red-400/[0.06] text-red-400/25 hover:text-red-400/60 hover:border-red-400/15 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* ─── Portions Tab ─── */}
      {activeTab === 'portions' && (
        <div className="space-y-6">
          <div className="p-4 bg-amber-400/5 border border-amber-400/10 rounded-xl flex gap-3">
            <Check className="text-amber-400 flex-shrink-0" size={18} />
            <p className="text-[12px] text-amber-400/70 leading-relaxed">
              If portions are defined, the main price field will be ignored and the product will use the "Slider Scale" UX.
            </p>
          </div>

          <div className="space-y-4">
            {formData.portions?.map((portion, idx) => (
              <div key={idx} className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl relative group">
                <button 
                  type="button" 
                  onClick={() => {
                    const newPortions = [...(formData.portions || [])];
                    newPortions.splice(idx, 1);
                    setFormData({ ...formData, portions: newPortions });
                  }}
                  className="absolute top-4 right-4 p-1 text-white/10 hover:text-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <FieldGroup label={`Portion ${idx + 1} Name (EN)`}>
                    <input 
                      type="text" 
                      value={portion.name}
                      onChange={(e) => {
                        const newPortions = [...(formData.portions || [])];
                        newPortions[idx] = { ...portion, name: e.target.value };
                        setFormData({ ...formData, portions: newPortions });
                      }}
                      className="admin-input"
                      placeholder="e.g. Full Order"
                    />
                  </FieldGroup>
                  <FieldGroup label="Name (AR)" align="right">
                    <input 
                      type="text" 
                      dir="rtl"
                      value={portion.nameAr}
                      onChange={(e) => {
                        const newPortions = [...(formData.portions || [])];
                        newPortions[idx] = { ...portion, nameAr: e.target.value };
                        setFormData({ ...formData, portions: newPortions });
                      }}
                      className="admin-input text-right font-arabic"
                      placeholder="الاسم بالعربية"
                    />
                  </FieldGroup>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <FieldGroup label="Price">
                    <input 
                      type="text" 
                      value={portion.price}
                      onChange={(e) => {
                        const newPortions = [...(formData.portions || [])];
                        newPortions[idx] = { ...portion, price: e.target.value };
                        setFormData({ ...formData, portions: newPortions });
                      }}
                      className="admin-input"
                      placeholder="e.g. 38 SR"
                    />
                  </FieldGroup>
                  <FieldGroup label="Pieces">
                    <input 
                      type="number" 
                      value={portion.pieces}
                      onChange={(e) => {
                        const newPortions = [...(formData.portions || [])];
                        newPortions[idx] = { ...portion, pieces: parseInt(e.target.value) || 0 };
                        setFormData({ ...formData, portions: newPortions });
                      }}
                      className="admin-input"
                      placeholder="e.g. 8"
                    />
                  </FieldGroup>
                  <div className="md:col-span-1 flex items-end">
                    <button 
                      type="button"
                      onClick={() => {
                        const newPortions = [...(formData.portions || [])];
                        const tags = portion.tags || [];
                        if (tags.includes('Best Value')) {
                          newPortions[idx] = { ...portion, tags: tags.filter(t => t !== 'Best Value') };
                        } else {
                          newPortions[idx] = { ...portion, tags: [...tags, 'Best Value'] };
                        }
                        setFormData({ ...formData, portions: newPortions });
                      }}
                      className={`w-full py-2.5 rounded-xl border text-[11px] font-bold transition-all ${
                        portion.tags?.includes('Best Value') 
                          ? 'bg-gold/20 border-gold/30 text-gold' 
                          : 'bg-white/[0.02] border-white/[0.06] text-white/20'
                      }`}
                    >
                      Best Value
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button 
              type="button"
              onClick={() => {
                setFormData({ 
                  ...formData, 
                  portions: [...(formData.portions || []), { name: 'New Portion', nameAr: 'قسم جديد', price: '', pieces: 0 }] 
                });
              }}
              className="w-full py-4 border-2 border-dashed border-white/[0.05] rounded-2xl text-white/20 hover:text-gold hover:border-gold/20 hover:bg-gold/[0.02] transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Portion
            </button>
          </div>
        </div>
      )}
  );
}

/* ─── Reusable Field Group ─── */
function FieldGroup({ label, children, align }: { label: string; children: React.ReactNode; align?: 'right' }) {
  return (
    <div className="space-y-1.5">
      <label className={`text-[10px] font-mono uppercase tracking-widest text-white/25 block ${align === 'right' ? 'text-right mr-1' : 'ml-1'}`}>
        {label}
      </label>
      {children}
    </div>
  );
}