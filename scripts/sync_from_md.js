const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function syncFromMd() {
  const content = fs.readFileSync('menu_cleaned.md', 'utf-8');
  const sections = content.split('####').slice(1);
  const products = [];
  const categories = [];

  for (const section of sections) {
    const lines = section.split('\n');
    const category = lines[0].trim();
    categories.push(category);

    const tableLines = lines.filter(l => l.includes('|')).slice(2); // Skip header and separator
    
    // Get header to determine columns
    const headerRow = lines.find(l => l.includes('|'));
    const cols = headerRow.split('|').map(c => c.trim()).filter(Boolean);

    for (const row of tableLines) {
      const cells = row.split('|').map(c => c.trim()).filter(Boolean);
      if (cells.length < 2) continue;

      let name = '';
      let desc = '';
      let descAr = '';
      let price = '';
      let calories = '';
      let portions = null;

      if (category === 'WOK, NOODLES & RICE') {
        const subCat = cells[0];
        const itemName = cells[1];
        name = `${subCat} ${itemName}`;
        calories = cells[2] === '—' ? '' : cells[2];
        price = cells[3] === '—' ? '' : cells[3];
      } else if (category === 'CALIFORNIA ROLLS' || category === 'FRY ROLLS') {
        name = cells[0];
        desc = cells[1];
        const p8 = cells[2] === '—' ? '' : cells[2];
        const c8 = cells[3] === '—' ? '' : cells[3];
        const p4 = cells[4] === '—' ? '' : cells[4];
        const c4 = cells[5] === '—' ? '' : cells[5];
        
        if (p8 || p4) {
          portions = [];
          if (p8) portions.push({ name: 'Full Order', nameAr: 'طلب كامل', price: p8 + ' SR', pieces: 8, calories: c8 });
          if (p4) portions.push({ name: 'Half Order', nameAr: 'نصف طلب', price: p4 + ' SR', pieces: 4, calories: c4 });
          price = p4 || p8; // Base price for sorting
        }
      } else {
        name = cells[0];
        // Standard columns: Item | Desc EN | Desc AR | Cals | Price
        if (cols.includes('Description (Arabic)')) {
          desc = cells[1];
          descAr = cells[2];
          calories = cells[3] === '—' ? '' : cells[3];
          price = cells[4] === '—' ? '' : cells[4];
        } else if (cols.includes('Ingredients')) {
          desc = cells[1];
          calories = cells[2] === '—' ? '' : cells[2];
          price = cells[3] === '—' ? '' : cells[3];
        } else if (cols.includes('Description')) {
          desc = cells[1];
          calories = cells[2] === '—' ? '' : cells[2];
          price = cells[3] === '—' ? '' : cells[3];
        } else if (cols.includes('Calories') && cols.includes('Price (KWD)')) {
          calories = cells[1] === '—' ? '' : cells[1];
          price = cells[2] === '—' ? '' : cells[2];
        } else if (cols.includes('Price (KWD)')) {
          price = cells[1] === '—' ? '' : cells[1];
        }
      }

      if (name && (price || portions)) {
        const id = name.toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');

        products.push({
          id,
          name,
          description: desc,
          description_ar: descAr,
          name_ar: '', // Add if you have it, or leave as is
          category,
          price: price ? (price.includes('SR') ? price : price + ' SR') : '',
          calories: calories ? calories.toString() : '',
          portions,
          tags: [],
          image: '', // Will be filled from current DB if match
          allergens: []
        });
      }
    }
  }

  console.log(`Parsed ${products.length} products from Markdown.`);

  // Deduplicate by ID
  const uniqueProducts = [];
  const seenIds = new Set();
  for (const p of products) {
    if (!seenIds.has(p.id)) {
      uniqueProducts.push(p);
      seenIds.add(p.id);
    } else {
      console.warn(`Duplicate ID found and skipped: ${p.id}`);
    }
  }
  console.log(`Finalized ${uniqueProducts.length} unique products.`);

  // Preserve existing images
  const { data: existing } = await supabase.from('products').select('id, image');
  const imageMap = {};
  existing.forEach(p => { if (p.image) imageMap[p.id] = p.image; });

  uniqueProducts.forEach(p => {
    if (imageMap[p.id]) p.image = imageMap[p.id];
  });

  // Sync Categories
  console.log('Syncing categories...');
  await supabase.from('categories').upsert(categories.map((c, i) => ({ name: c, order: i })), { onConflict: 'name' });

  // Sync Products
  console.log(`Syncing ${uniqueProducts.length} products...`);
  const { error: upsertError } = await supabase.from('products').upsert(uniqueProducts, { onConflict: 'id' });
  if (upsertError) {
    console.error('Upsert error:', upsertError.message);
    return;
  }

  // Cleanup obsolete
  const { data: dbAll } = await supabase.from('products').select('id');
  const currentSeenIds = new Set(uniqueProducts.map(p => p.id));
  const idsToDelete = dbAll.map(p => p.id).filter(id => !currentSeenIds.has(id));

  if (idsToDelete.length > 0) {
    console.log(`Deleting ${idsToDelete.length} obsolete products...`);
    await supabase.from('products').delete().in('id', idsToDelete);
  }

  console.log('Markdown Sync Complete!');
}

syncFromMd().catch(console.error);
