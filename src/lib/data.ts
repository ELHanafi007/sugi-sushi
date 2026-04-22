import fs from 'fs';
import path from 'path';
import { Dish } from '@/data/menuData';

const DATA_PATH = path.join(process.cwd(), 'src/data/menu.json');

export interface MenuData {
  categories: string[];
  products: Dish[];
}

export function getMenu(): MenuData {
  try {
    const data = fs.readFileSync(DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading menu data:', error);
    return { categories: [], products: [] };
  }
}

export function saveMenu(data: MenuData): boolean {
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving menu data:', error);
    return false;
  }
}
