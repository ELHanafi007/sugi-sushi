import { getMenu } from '@/lib/data';
import CategoriesPageClient from './CategoriesPageClient';

export default async function CategoriesPage() {
  const { categories } = await getMenu();

  return (
    <CategoriesPageClient initialCategories={categories} />
  );
}
