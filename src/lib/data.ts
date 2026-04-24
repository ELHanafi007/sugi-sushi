import { Dish, CATEGORIES, menuData } from '@/data/menuData';

export interface MenuData {
  categories: string[];
  products: Dish[];
}

export async function getMenu(): Promise<MenuData> {
  // Use local menu data (no Supabase setup yet)
  return { categories: CATEGORIES, products: menuData };
}

// These are now handled by direct Supabase calls in actions.ts for better control
export async function saveMenu(data: MenuData): Promise<boolean> {
  console.warn('saveMenu is deprecated, use specific actions instead');
  return false;
}
