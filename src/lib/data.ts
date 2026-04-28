import { Dish, CATEGORIES, menuData } from '@/data/menuData';
import { createClient } from '@supabase/supabase-js';



export interface MenuData {
  categories: string[];
  products: Dish[];
}

export async function getMenu(): Promise<MenuData> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('CRITICAL: Supabase credentials missing in getMenu');
    return { categories: CATEGORIES, products: menuData };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
    global: {
      fetch: (url, options) => {
        return fetch(url, { ...options, cache: 'no-store' });
      }
    }
  });

  try {
    const [{ data: categoriesData, error: catError }, { data: productsData, error: prodError }] = await Promise.all([
      supabase.from('categories').select('name').order('order'),
      supabase.from('products').select('*')
    ]);

    if (catError || prodError) {
      console.error('Supabase fetch error:', catError || prodError);
      return { categories: CATEGORIES, products: menuData };
    }

    if (productsData && productsData.length > 0) {
      // If categories table is blocked by RLS, derive from products
      let fetchedCategories = categoriesData && categoriesData.length > 0 
        ? categoriesData.map(c => c.name) 
        : Array.from(new Set(productsData.map(p => p.category)));
        
      const categories = Array.from(new Set(fetchedCategories));
      
      const products: Dish[] = productsData.map(p => {
        return {
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
        };
      });
      
      return { categories, products };
    }

    return { categories: CATEGORIES, products: menuData };
  } catch (error) {
    console.error('Error fetching from Supabase:', error);
    return { categories: CATEGORIES, products: menuData };
  }
}

export const dynamic = 'force-dynamic';