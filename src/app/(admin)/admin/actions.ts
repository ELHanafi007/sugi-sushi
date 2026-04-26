'use server';

import { Dish } from '@/data/menuData';
import { revalidatePath } from 'next/cache';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function upsertProduct(product: Dish) {
  const supabase = getSupabaseAdmin();
  
  console.log('=== UPSERT PRODUCT ===');
  console.log('Product ID:', product.id);
  
  // First check if product exists
  const { data: existing, error: checkError } = await supabase
    .from('products')
    .select('id')
    .eq('id', product.id)
    .single();
    
  let result;
  if (existing) {
    // Update existing
    console.log('Updating existing product...');
    result = await supabase
      .from('products')
      .update({
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
      })
      .eq('id', product.id)
      .select();
  } else {
    // Insert new
    console.log('Inserting new product...');
    result = await supabase
      .from('products')
      .insert({
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
      })
      .select();
  }

  const { data, error } = result;

  if (error) {
    console.error('=== UPSERT ERROR ===');
    console.error('Error:', error.message);
    return { success: false, error: error.message };
  }
  
  console.log('=== UPSERT SUCCESS ===');
  console.log('Data:', data);
  revalidatePath('/');
  revalidatePath('/admin/products');
  return { success: true };
}

export async function deleteProduct(id: string) {
  const supabase = getSupabaseAdmin();
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    return false;
  }
  
  revalidatePath('/');
  revalidatePath('/admin/products');
  return true;
}

export async function updateCategories(categories: string[]) {
  const supabase = getSupabaseAdmin();
  
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

  if (error) {
    console.error('Error updating categories:', error);
    return false;
  }
  
  revalidatePath('/');
  revalidatePath('/admin/categories');
  return true;
}
