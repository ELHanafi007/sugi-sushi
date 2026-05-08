import { Dish, CATEGORIES, menuData } from '@/data/menuData';
import { createClient } from '@supabase/supabase-js';



export interface MenuData {
  categories: string[];
  products: Dish[];
  categoryData: { name: string; image: string }[];
}

/* ─── Portion Indicator Helpers ─── */

/** Indicators that suggest an item is part of a multi-portion set */
const PORTION_TEXT_INDICATORS = ['half', 'full', 'small', 'large', 'mini', 'reg', 'regular', 'xl', 'double', 'single'];
const PORTION_REGEX = /(\d+)\s*p(?:cs|ieces?)?\b|\bp(?:cs|ieces?)\s*(\d+)/i;

function hasPortionIndicator(name: string, description: string = ''): boolean {
  const combined = (name + ' ' + description).toLowerCase();
  return PORTION_REGEX.test(combined) || PORTION_TEXT_INDICATORS.some(ind => combined.includes(ind));
}

/** Extract piece count or label from a string */
function extractPortionInfo(name: string, description: string = ''): { pieces: number; label: string } {
  const combined = (name + ' ' + description).toLowerCase();
  
  // Try numeric pieces first
  let match = combined.match(/(\d+)\s*p(?:cs|ieces?)?/i);
  if (match) return { pieces: parseInt(match[1]), label: `${match[1]} Pieces` };
  match = combined.match(/p(?:cs|ieces?)?\s*(\d+)/i);
  if (match) return { pieces: parseInt(match[1]), label: `${match[1]} Pieces` };

  // Try text indicators
  if (combined.includes('half')) return { pieces: 4, label: 'Half Order' };
  if (combined.includes('full')) return { pieces: 8, label: 'Full Order' };
  if (combined.includes('small')) return { pieces: 1, label: 'Small' };
  if (combined.includes('large')) return { pieces: 2, label: 'Large' };
  if (combined.includes('mini')) return { pieces: 1, label: 'Mini' };

  return { pieces: 0, label: '' };
}

/** Strip portion indicators and normalize a name for grouping */
function getNormalizedBaseName(name: string): string {
  let normalized = name.toLowerCase();
  
  // Remove numeric portions
  normalized = normalized.replace(/\d+\s*p(?:cs|ieces?)?\b/gi, '');
  normalized = normalized.replace(/\bp(?:cs|ieces?)?\s*\d+/gi, '');
  
  // Remove text portions
  PORTION_TEXT_INDICATORS.forEach(ind => {
    const reg = new RegExp(`\\b${ind}\\b`, 'gi');
    normalized = normalized.replace(reg, '');
  });

  // Remove common filler words
  normalized = normalized.replace(/\broll(s)?\b/gi, '');
  normalized = normalized.replace(/\border\b/gi, '');
  normalized = normalized.replace(/\bsize\b/gi, '');
  
  // Final cleanup
  return normalized
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Simple Levenshtein distance for fuzzy name matching */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const an = a.length, bn = b.length;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix: number[][] = [];
  for (let i = 0; i <= an; i++) { matrix[i] = [i]; }
  for (let j = 0; j <= bn; j++) { matrix[0][j] = j; }
  for (let i = 1; i <= an; i++) {
    for (let j = 1; j <= bn; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[an][bn];
}

/**
 * Merge duplicate products that differ only by portion size.
 */
function mergePortionDuplicates(products: Dish[]): Dish[] {
  const result: Dish[] = [];

  // Group by category first
  const byCategory = new Map<string, Dish[]>();
  products.forEach(p => {
    const list = byCategory.get(p.category) || [];
    list.push(p);
    byCategory.set(p.category, list);
  });

  for (const [, dishes] of byCategory) {
    const groups: Dish[][] = [];
    const assigned = new Set<number>();

    for (let i = 0; i < dishes.length; i++) {
      if (assigned.has(i)) continue;
      
      const current = dishes[i];
      // Skip items that already have multiple portions defined manually
      if (current.portions && current.portions.length > 1) {
        result.push(current);
        assigned.add(i);
        continue;
      }

      const group = [current];
      assigned.add(i);
      const baseName = getNormalizedBaseName(current.name);

      for (let j = i + 1; j < dishes.length; j++) {
        if (assigned.has(j)) continue;
        
        const other = dishes[j];
        if (other.portions && other.portions.length > 1) continue;

        const otherBase = getNormalizedBaseName(other.name);
        
        // Exact match or very close fuzzy match
        if (baseName === otherBase || levenshtein(baseName, otherBase) <= 1) {
          group.push(other);
          assigned.add(j);
        }
      }
      groups.push(group);
    }

    // Merge each group
    for (const group of groups) {
      if (group.length === 1) {
        const dish = group[0];
        const info = extractPortionInfo(dish.name, dish.description);
        
        if (info.pieces > 0) {
          const cleanName = dish.name
            .replace(/\d+\s*p(?:cs|ieces?)?\s*/gi, '')
            .replace(/\bp(?:cs|ieces?)?\s*\d+/gi, '')
            .replace(/\s+/g, ' ')
            .trim();
            
          result.push({
            ...dish,
            name: cleanName || dish.name,
            portions: [{ 
              name: info.label, 
              nameAr: info.pieces + ' قطع', 
              price: dish.price, 
              pieces: info.pieces 
            }]
          });
        } else {
          result.push(dish);
        }
      } else {
        // Multiple items in group → merge
        const portions = group.map(dish => {
          const info = extractPortionInfo(dish.name, dish.description);
          const priceVal = parseInt(dish.price) || 0;
          
          return {
            name: info.label || (priceVal > 0 ? `Variant ${priceVal}` : 'Standard'),
            nameAr: info.pieces > 0 ? `${info.pieces} قطع` : 'قسم',
            price: dish.price,
            pieces: info.pieces || 0,
            originalDish: dish
          };
        }).sort((a, b) => {
          // Sort by pieces first, then by price if pieces are zero
          if (a.pieces !== b.pieces) return a.pieces - b.pieces;
          return (parseInt(a.price) || 0) - (parseInt(b.price) || 0);
        });

        // Assign logical piece counts if missing
        portions.forEach((p, idx) => {
          if (p.pieces === 0) {
            // Assume 4, 8, 12... based on price rank
            p.pieces = (idx + 1) * 4;
            if (p.name.startsWith('Variant')) {
              p.name = `${p.pieces} Pieces`;
              p.nameAr = `${p.pieces} قطع`;
            }
          }
        });

        // Pick the "main" dish (usually the one with more info or higher price)
        const mainPortion = portions[portions.length - 1];
        const mainDish = mainPortion.originalDish;

        // Clean the name
        let cleanName = mainDish.name;
        PORTION_TEXT_INDICATORS.forEach(ind => {
           const reg = new RegExp(`\\b${ind}\\b`, 'gi');
           cleanName = cleanName.replace(reg, '');
        });
        cleanName = cleanName
          .replace(/\d+\s*p(?:cs|ieces?)?\s*/gi, '')
          .replace(/\bp(?:cs|ieces?)?\s*\d+/gi, '')
          .replace(/\broll(s)?\b/gi, '')
          .replace(/\s+/g, ' ')
          .trim();

        // Ensure "Roll" is added back if it was part of the original and lost
        if (mainDish.name.toLowerCase().includes('roll') && !cleanName.toLowerCase().includes('roll')) {
          cleanName += ' Roll';
        }

        const allTags = new Set<string>();
        group.forEach(d => d.tags.forEach(t => allTags.add(t)));
        const allAllergens = new Set<string>();
        group.forEach(d => d.allergens?.forEach(a => allAllergens.add(a)));

        result.push({
          ...mainDish,
          name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
          portions: portions.map(({ originalDish, ...p }) => ({
             ...p,
             tags: p.pieces >= 8 ? ['Best Value'] : []
          })),
          price: portions[0].price, // Base price is the cheapest
          tags: Array.from(allTags),
          allergens: Array.from(allAllergens),
        });
      }
    }
  }

  return result;
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
      
      const rawProducts: Dish[] = productsData.map(p => {
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

      // Merge duplicate portion items (e.g. "Roll 4 PCS" + "Roll 8 PCS" → single item)
      const products = mergePortionDuplicates(rawProducts);
      
      return { categories, products, categoryData };
    }

    // Apply merging to static fallback data as well
    return { categories: CATEGORIES, products: mergePortionDuplicates(menuData), categoryData: [] };
  } catch (error) {
    console.error('Error fetching from Supabase:', error);
    // Apply merging to static fallback data as well
    return { categories: CATEGORIES, products: mergePortionDuplicates(menuData), categoryData: [] };
  }
}

export const dynamic = 'force-dynamic';