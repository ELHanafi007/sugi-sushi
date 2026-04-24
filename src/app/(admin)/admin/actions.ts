'use server';

import { Dish } from '@/data/menuData';
import { revalidatePath } from 'next/cache';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function upsertProduct(product: Dish) {
  const supabase = getSupabaseAdmin();
  
  const { error } = await supabase
    .from('products')
    .upsert({
      id: product.id,
      name: product.name,
      name_ar: product.nameAr,
      description: product.description,
      description_ar: product.descriptionAr,
      price: product.price,
      category: product.category,
      calories: product.calories,
      tags: product.tags,
      image: product.image,
      allergens: product.allergens
    });

  if (!error) {
    revalidatePath('/');
    revalidatePath('/admin/products');
    return true;
  }
  
  console.error('Error upserting product:', error);
  return false;
}

export async function deleteProduct(id: string) {
  const supabase = getSupabaseAdmin();
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (!error) {
    revalidatePath('/');
    revalidatePath('/admin/products');
    return true;
  }
  
  console.error('Error deleting product:', error);
  return false;
}

export async function updateCategories(categories: string[]) {
  const supabase = getSupabaseAdmin();
  
  // This is a bit more complex as we need to sync the categories table
  // For simplicity, we'll upsert all and potentially mark old ones (or just leave them)
  // A better way would be to delete all and re-insert, or use a specific order field
  
  // First, get existing categories to know what to delete or update
  const { data: existing } = await supabase.from('categories').select('name');
  const existingNames = (existing || []).map(c => c.name);
  
  const toDelete = existingNames.filter(name => !categories.includes(name));
  
  if (toDelete.length > 0) {
    await supabase.from('categories').delete().in('name', toDelete);
  }

  const upserts = categories.map((name, index) => ({
    name,
    order: index
  }));

  const { error } = await supabase
    .from('categories')
    .upsert(upserts, { onConflict: 'name' });

  if (!error) {
    revalidatePath('/');
    revalidatePath('/admin/categories');
    return true;
  }
  
  console.error('Error updating categories:', error);
  return false;
}
