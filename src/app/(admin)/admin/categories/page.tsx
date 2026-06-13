import { getMenu } from '@/lib/data';
import CategoriesPageClient from './CategoriesPageClient';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const { categoryData } = await getMenu();

  return (
    <CategoriesPageClient initialCategories={categoryData} />
  );
}
