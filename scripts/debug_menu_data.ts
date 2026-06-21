import { getMenu } from '../src/lib/data';

type DuplicateDish = {
  name: string;
  category: string;
  id: string;
  originalId: string;
};

async function debug() {
  console.log('Starting debug...');
  const { products, categories } = await getMenu();
  
  console.log('--- Categories ---');
  console.log(categories);
  
  console.log('\n--- Duplicate Check (Name + Category) ---');
  const seen = new Map<string, string>();
  const duplicates: DuplicateDish[] = [];
  
  products.forEach(p => {
    const key = `${p.name.toLowerCase()}|${p.category.toLowerCase()}`;
    const originalId = seen.get(key);
    if (originalId) {
      duplicates.push({ name: p.name, category: p.category, id: p.id, originalId });
    } else {
      seen.set(key, p.id);
    }
  });
  
  if (duplicates.length > 0) {
    console.log(`Found ${duplicates.length} potential duplicates:`);
    console.log(duplicates);
  } else {
    console.log('No duplicates found in processed data.');
  }

  console.log('\n--- Category Casing Check ---');
  const catSeen = new Set<string>();
  const catDuplicates: string[] = [];
  categories.forEach(c => {
    if (catSeen.has(c.toLowerCase())) {
        catDuplicates.push(c);
    }
    catSeen.add(c.toLowerCase());
  });

  if (catDuplicates.length > 0) {
      console.log('Found category casing duplicates:');
      console.log(catDuplicates);
  } else {
      console.log('No category casing duplicates found.');
  }
}

debug().catch(console.error);
