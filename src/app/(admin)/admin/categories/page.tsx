import { getMenu } from '@/lib/data';
import CategoriesPageClient from './CategoriesPageClient';

export default async function CategoriesPage() {
  const { categoryData } = await getMenu();

  return (
    <CategoriesPageClient initialCategories={categoryData} />
  );
}
