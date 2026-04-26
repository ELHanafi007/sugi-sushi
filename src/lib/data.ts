import { Dish, CATEGORIES, menuData } from '@/data/menuData';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false }
});

export interface MenuData {
  categories: string[];
  products: Dish[];
}

export async function getMenu(): Promise<MenuData> {
  try {
    const [{ data: categoriesData, error: catError }, { data: productsData, error: prodError }] = await Promise.all([
      supabase.from('categories').select('name').order('order'),
      supabase.from('products').select('*')
    ]);

    if (catError || prodError) {
      console.error('Supabase error:', catError || prodError);
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

    return { categories: CATEGORIES, products: menuData };
  } catch (error) {
    console.error('Error fetching from Supabase:', error);
    return { categories: CATEGORIES, products: menuData };
  }
}

export const dynamic = 'force-dynamic';