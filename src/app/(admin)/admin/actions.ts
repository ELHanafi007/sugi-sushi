'use server';

import { Dish } from '@/data/menuData';
import { revalidatePath, updateTag } from 'next/cache';
import { getSupabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function upsertProduct(product: Dish) {
  // Security check: verify admin session
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session) {
    return { success: false, error: 'Unauthorized' };
  }

  const supabase = getSupabaseAdmin();
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing');
    return { success: false, error: 'Server configuration error: missing credentials' };
  }
  
  console.log('=== UPSERT PRODUCT ===');
  console.log('Product ID:', product.id);
  
  try {
    // First check if product exists - using maybeSingle to avoid error on 0 rows
    const { data: existing, error: fetchError } = await supabase
      .from('products')
      .select('id')
      .eq('id', product.id)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error fetching existing product:', fetchError.message);
      return { success: false, error: `Database error: ${fetchError.message}` };
    }
    
    let error = null;
    
    // Clean data for Supabase (remove any non-DB fields if any)
    const productData = {
      name: product.name,
      name_ar: product.nameAr || '',
      description: product.description || '',
      description_ar: product.descriptionAr || '',
      price: product.price || '',
      category: product.category,
      calories: product.calories || '',
      tags: product.tags || [],
      portions: product.portions || [],
      image: product.image || '',
      allergens: product.allergens || []
    };
    
    if (existing) {
      // Update existing
      console.log('Updating existing product...');
      const { error: updateError } = await supabase
        .from('products')
        .update(productData)
        .eq('id', product.id);
      
      error = updateError;
    } else {
      // Insert new
      console.log('Inserting new product...');
      const { error: insertError } = await supabase
        .from('products')
        .insert({
          id: product.id,
          ...productData
        });
      
      error = insertError;
    }

    if (error) {
      console.error('=== UPSERT ERROR ===');
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      return { success: false, error: `${error.message} (${error.code})` };
    }
    
    console.log('=== UPSERT SUCCESS ===');
    
    // Next.js 16 revalidation
    updateTag('products');
    revalidatePath('/');
    revalidatePath('/admin/products');
    return { success: true };
    
  } catch (e: any) {
    console.error('=== UPSERT EXCEPTION ===');
    console.error(e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
}

export async function deleteProduct(id: string) {
  // Security check: verify admin session
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session) {
    return false;
  }

  const supabase = getSupabaseAdmin();
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    return false;
  }
  
  updateTag('products');
  revalidatePath('/');
  revalidatePath('/admin/products');
  return true;
}

export async function updateCategories(categories: string[]) {
  // Security check: verify admin session
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session) {
    return false;
  }

  const supabase = getSupabaseAdmin();
  
  // Delete all existing categories to avoid unique constraint issues
  await supabase.from('categories').delete().not('name', 'eq', 'SOME_IMPOSSIBLE_NAME');

  const inserts = categories.map((name, index) => ({
    name,
    order: index
  }));

  const { error } = await supabase
    .from('categories')
    .insert(inserts);

  if (error) {
    console.error('Error inserting categories:', error);
    return false;
  }
  
  revalidatePath('/');
  revalidatePath('/admin/categories');
  return true;
}
