import { Dish, CATEGORIES, menuData } from '@/data/menuData';
import { supabase } from './supabase';

export interface MenuData {
  categories: string[];
  products: Dish[];
}

export async function getMenu(): Promise<MenuData> {
  try {
    // Try fetching from Supabase
    const [{ data: categoriesData, error: catError }, { data: productsData, error: prodError }] = await Promise.all([
      supabase.from('categories').select('name').order('order'),
      supabase.from('products').select('*')
    ]);

    if (catError || prodError) {
      console.error('Supabase error:', catError || prodError);
      // Fallback to local data
      return { categories: CATEGORIES, products: menuData };
    }

    if (categoriesData && categoriesData.length > 0) {
      const categories = categoriesData.map(c => c.name);
      const products: Dish[] = productsData?.map(p => ({
        id: p.id,
        name: p.name,
        nameAr: p.name_ar,
        description: p.description,
        descriptionAr: p.description_ar,
        price: p.price,
        category: p.category,
        calories: p.calories,
        tags: p.tags || [],
        image: p.image,
        allergens: p.allergens || []
      })) || [];
      
      return { categories, products };
    }

    // If no data in DB, use local data as fallback
    return { categories: CATEGORIES, products: menuData };
  } catch (error) {
    console.error('Error fetching from Supabase:', error);
    // Fallback to local data
    return { categories: CATEGORIES, products: menuData };
  }
}