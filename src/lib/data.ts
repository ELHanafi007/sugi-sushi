import { Dish, CATEGORIES, menuData } from '@/data/menuData';
import { createClient } from '@supabase/supabase-js';



export interface MenuData {
  categories: string[];
  products: Dish[];
  categoryData: { name: string; image: string }[];
}

export async function getMenu(): Promise<MenuData> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('CRITICAL: Supabase credentials missing in getMenu');
    return { categories: CATEGORIES, products: menuData, categoryData: [] };
  }
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
    global: {
      fetch: (url, options) => {
        return fetch(url, { ...options, cache: 'no-store' });
      }
    }
  });

  try {
    const [{ data: categoriesData, error: catError }, { data: productsData, error: prodError }] = await Promise.all([
      supabase.from('categories').select('name, image').order('order'),
      supabase.from('products').select('*')
    ]);

    if (catError || prodError) {
      console.error('Supabase fetch error:', catError || prodError);
      return { categories: CATEGORIES, products: menuData, categoryData: [] };
    }

    if (productsData && productsData.length > 0) {
      // If categories table is blocked by RLS, derive from products
      let categoryList = categoriesData && categoriesData.length > 0 
        ? categoriesData 
        : Array.from(new Set(productsData.map(p => p.category))).map(name => ({ name, image: '' }));
        
      const categories = categoryList.map(c => c.name);
      const categoryData = categoryList;
      
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
          portions: p.portions || [],
          image: p.image,
          allergens: p.allergens || []
        };
      });
      
      return { categories, products, categoryData };
    }

    return { categories: CATEGORIES, products: menuData, categoryData: [] };
  } catch (error) {
    console.error('Error fetching from Supabase:', error);
    return { categories: CATEGORIES, products: menuData, categoryData: [] };
  }
}

export const dynamic = 'force-dynamic';