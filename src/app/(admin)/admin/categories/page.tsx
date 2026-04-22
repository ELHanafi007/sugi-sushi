import { getMenu } from '@/lib/data';
import CategoriesPageClient from './CategoriesPageClient';

export default async function CategoriesPage() {
  const { categories } = getMenu();

  return (
    <CategoriesPageClient initialCategories={categories} />
  );
}
