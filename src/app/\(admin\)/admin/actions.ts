'use server';

import { getMenu, saveMenu, MenuData } from '@/lib/data';
import { Dish } from '@/data/menuData';
import { revalidatePath } from 'next/cache';

export async function upsertProduct(product: Dish) {
  const data = getMenu();
  const index = data.products.findIndex((p) => p.id === product.id);

  if (index > -1) {
    data.products[index] = product;
  } else {
    data.products.push(product);
  }

  const success = saveMenu(data);
  if (success) {
    revalidatePath('/');
    revalidatePath('/admin/products');
  }
  return success;
}

export async function deleteProduct(id: string) {
  const data = getMenu();
  data.products = data.products.filter((p) => p.id !== id);

  const success = saveMenu(data);
  if (success) {
    revalidatePath('/');
    revalidatePath('/admin/products');
  }
  return success;
}

export async function updateCategories(categories: string[]) {
  const data = getMenu();
  data.categories = categories;

  const success = saveMenu(data);
  if (success) {
    revalidatePath('/');
    revalidatePath('/admin/categories');
  }
  return success;
}
