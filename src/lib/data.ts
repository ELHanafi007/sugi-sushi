import { Dish, CATEGORIES, menuData } from '@/data/menuData';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';



export interface MenuData {
  categories: string[];
  products: Dish[];
  categoryData: { name: string; image: string }[];
}

/* ─── Caching Layer ─── */
// In-memory cache: survives across requests in the same server process
// File cache: survives server restarts, used as fallback when Supabase is down

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes — menu doesn't change every second
const CACHE_FILE = process.env.VERCEL
  ? '/tmp/sugi-menu-cache.json'
  : path.join(process.cwd(), '.cache', 'sugi-menu-cache.json');

let memoryCache: { data: MenuData; timestamp: number } | null = null;

function getMemoryCache(): MenuData | null {
  if (memoryCache && (Date.now() - memoryCache.timestamp) < CACHE_TTL_MS) {
    return memoryCache.data;
  }
  return null;
}

function setMemoryCache(data: MenuData): void {
  memoryCache = { data, timestamp: Date.now() };
}

function readFileCache(): MenuData | null {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && parsed.data && parsed.data.products?.length > 0) {
        console.log('[Cache] Serving menu from file cache (last good Supabase data)');
        return parsed.data;
      }
    }
  } catch (e) {
    console.warn('[Cache] Failed to read file cache:', e);
  }
  return null;
}

function writeFileCache(data: MenuData): void {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      CACHE_FILE,
      JSON.stringify({ data, timestamp: Date.now() }),
      'utf-8'
    );
  } catch (e) {
    // Silently fail — Vercel's filesystem may be read-only outside /tmp
    console.warn('[Cache] Failed to write file cache:', e);
  }
}

type PortionWithDish = NonNullable<Dish['portions']>[number] & { originalDish: Dish };

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
      const group = [current];
      assigned.add(i);
      const baseName = getNormalizedBaseName(current.name);

      for (let j = i + 1; j < dishes.length; j++) {
        if (assigned.has(j)) continue;
        
        const other = dishes[j];
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
        if (dish.portions && dish.portions.length > 1) {
          result.push(dish);
          continue;
        }

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
        const portions: PortionWithDish[] = group.flatMap(dish => {
          if (dish.portions && dish.portions.length > 0) {
            return dish.portions.map(portion => ({
              ...portion,
              price: portion.price || dish.price,
              originalDish: dish
            }));
          }

          const info = extractPortionInfo(dish.name, dish.description);
          const priceVal = parseInt(dish.price) || 0;
          
          return [{
            name: info.label || (priceVal > 0 ? `Variant ${priceVal}` : 'Standard'),
            nameAr: info.pieces > 0 ? `${info.pieces} قطع` : 'قسم',
            price: dish.price,
            pieces: info.pieces || 0,
            originalDish: dish
          }];
        }).sort((a, b) => {
          // Sort by pieces first, then by price if pieces are zero
          if (a.pieces !== b.pieces) return a.pieces - b.pieces;
          return (parseInt(a.price) || 0) - (parseInt(b.price) || 0);
        });

        const uniquePortions = portions.filter((portion, index, list) => {
          const portionKey = `${portion.pieces}-${portion.price}`;
          return list.findIndex(item => `${item.pieces}-${item.price}` === portionKey) === index;
        });

        // Assign logical piece counts if missing
        uniquePortions.forEach((p, idx) => {
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
        const mainPortion = uniquePortions[uniquePortions.length - 1];
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
          portions: uniquePortions.map(({ originalDish, ...p }) => ({
             ...p,
             tags: p.pieces >= 8 ? ['Best Value'] : []
          })),
          price: uniquePortions[0].price, // Base price is the cheapest
          tags: Array.from(allTags),
          allergens: Array.from(allAllergens),
        });
      }
    }
  }

  return result;
}

/**
 * Fetch raw menu data from Supabase (no caching — called only when cache is stale).
 * Returns null on any failure so the caller can fall back gracefully.
 */
async function _fetchMenuFromSupabase(): Promise<MenuData | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[Supabase] CRITICAL: credentials missing');
    return null;
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
      console.error('[Supabase] Fetch error:', catError || prodError);
      return null;
    }

    if (!productsData || productsData.length === 0) {
      console.warn('[Supabase] No products returned');
      return null;
    }

    // 1. Normalize and De-duplicate raw items from DB
    const uniqueProductsMap = new Map<string, any>();
    productsData.forEach(p => {
      // Normalize category: trim and title case
      let cat = (p.category || 'Other').trim();
      if (cat.toLowerCase() === 'kani crunchy roll') cat = 'kani  CRUNCHY   roll'; // Match existing case if specific
      
      const normalizedProduct = {
        ...p,
        category: cat,
        name: (p.name || '').trim(),
      };
      
      // Use ID as primary key, but if multiple items have same ID, last one wins
      uniqueProductsMap.set(p.id, normalizedProduct);
    });

    const deDuplicatedRaw = Array.from(uniqueProductsMap.values());

    // If categories table is blocked by RLS, derive from products
    let categoryList = categoriesData && categoriesData.length > 0 
      ? categoriesData.map(c => ({ name: c.name.trim(), image: c.image })) 
      : Array.from(new Set(deDuplicatedRaw.map(p => p.category))).map(name => ({ name, image: '' }));
    
    // De-duplicate category names (case-insensitive)
    const seenCats = new Set<string>();
    categoryList = categoryList.filter(c => {
      const lower = c.name.toLowerCase();
      if (seenCats.has(lower)) return false;
      seenCats.add(lower);
      return true;
    });

    const categories = categoryList.map(c => c.name);
    const categoryData = categoryList;
    
    const rawProducts: Dish[] = deDuplicatedRaw.map(p => {
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
  } catch (error) {
    console.error('[Supabase] Error fetching:', error);
    return null;
  }
}

/**
 * Get menu data with 3-tier caching:
 *   1. In-memory cache (5-min TTL) — instant, zero network calls
 *   2. Supabase fetch — on cache miss, saves to both caches on success
 *   3. File cache — last known good data, survives restarts & Supabase outages
 *   4. Static fallback — hardcoded menuData.ts as absolute last resort
 */
export async function getMenu(): Promise<MenuData> {
  // ── Tier 1: In-memory cache ──
  const cached = getMemoryCache();
  if (cached) {
    return cached;
  }

  // ── Tier 2: Fresh fetch from Supabase ──
  const freshData = await _fetchMenuFromSupabase();
  if (freshData) {
    console.log('[Cache] Fresh data from Supabase — updating caches');
    setMemoryCache(freshData);
    writeFileCache(freshData);
    return freshData;
  }

  // ── Tier 3: File cache (last known good data) ──
  const fileCached = readFileCache();
  if (fileCached) {
    // Also warm the memory cache so subsequent requests are fast
    setMemoryCache(fileCached);
    return fileCached;
  }

  // ── Tier 4: Static fallback (ancient hardcoded data — absolute last resort) ──
  console.warn('[Cache] All caches exhausted — serving static fallback data');
  const staticFallback = { categories: CATEGORIES, products: mergePortionDuplicates(menuData), categoryData: [] };
  setMemoryCache(staticFallback);
  return staticFallback;
}

export const dynamic = 'force-dynamic';

