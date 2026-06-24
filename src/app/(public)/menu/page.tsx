import { getMenu } from '@/lib/data';
import HomeClient from '../HomeClient';

export const dynamic = 'force-dynamic';

export default async function MenuPage() {
  const { products, categories, categoryData } = await getMenu();

  return (
    <HomeClient
      initialMenuData={products}
      initialCategories={categories}
      initialCategoryData={categoryData}
      initialTab="menu"
    />
  );
}
