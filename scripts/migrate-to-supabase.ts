import { getSupabaseAdmin } from '../src/lib/supabase';
import { getMenu } from '../src/lib/data';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function migrate() {
  const supabase = getSupabaseAdmin();
  // Using the old JSON data for migration, so I should probably read the file directly
  // or use the old version of getMenu logic.
  // Since I already changed getMenu to be async and use Supabase, 
  // I'll read the JSON file directly here.
  const fs = require('fs');
  const path = require('path');
  const DATA_PATH = path.join(process.cwd(), 'src/data/menu.json');
  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const { categories, products } = data;

  console.log('Migrating categories...');
  for (let i = 0; i < categories.length; i++) {
    const { error } = await supabase
      .from('categories')
      .upsert({ name: categories[i], order: i }, { onConflict: 'name' });
    
    if (error) console.error(`Error migrating category ${categories[i]}:`, error);
  }

  console.log('Migrating products...');
  for (const product of products) {
    const { error } = await supabase
      .from('products')
      .upsert({
        id: product.id,
        name: product.name,
        name_ar: product.nameAr,
        description: product.description,
        description_ar: product.descriptionAr,
        price: product.price,
        category: product.category,
        calories: product.calories,
        tags: product.tags,
        image: product.image,
        allergens: product.allergens
      });

    if (error) console.error(`Error migrating product ${product.name}:`, error);
  }

  console.log('Migration complete!');
}

migrate().catch(console.error);
