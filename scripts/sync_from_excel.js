#!/usr/bin/env node
/**
 * sync_from_excel.js
 * Syncs "MENU FOR WEB SITE Mr Hanafi designer.xlsx" → Supabase
 * Products table columns: id, name, name_ar, description, description_ar, price, category, calories, tags, image, allergens, portions
 * Categories table columns: id, name, order, image
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const XLSX = require('xlsx');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ─── Category mapping from Excel category_ref numbers ───────────────────────
const CAT_MAP = {
  '1':  'Salad',
  '2':  'Soup',
  '3':  'Starters',
  '4':  'Wok & Noodles',
  '5':  'Tempura & Fried',
  '6':  'Sugi Dishes',
  '7':  'Sashimi',
  '8':  'Tataki',
  '9':  'Ceviche',
  '10': 'Nigiri',
  '11': 'Temaki',
  '12': 'Gunkan',
  '13': 'Maki Rolls',
  '14': 'Aromaki Rolls',
  '15': 'Fried Aromaki Rolls',
  '16': 'California Rolls',
  '17': 'Fry Rolls',
  '18': 'Boxes',
  '19': 'Boats',
  '20': 'Cold Drinks',
  '21': 'Fresh Juices',
  '22': 'Hot Drinks',
  '23': 'Dessert',
  '24': 'Extra Sauce',
};

// Category display order
const CAT_ORDER = Object.entries(CAT_MAP).map(([num, name]) => ({ order: parseInt(num), name }));

async function main() {
  console.log('📖 Reading Excel file...');
  const wb = XLSX.readFile('MENU FOR WEB SITE Mr Hanafi designer.xlsx');
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: null, raw: true });

  // ─── Parse items ─────────────────────────────────────────────────────────
  const items = [];
  let skipped = 0;

  for (const row of rows) {
    const keys = Object.keys(row);
    const name = row['name'] ? String(row['name']).trim() : null;
    // Arabic name is usually in the second column (unnamed or has Arabic header)
    const nameAr = row[keys[1]] ? String(row[keys[1]]).trim() : '';
    const catRef = row['category_reference'] ? String(row['category_reference']).trim() : null;
    const priceRaw = row['price VAT '];

    if (!name || !catRef) { skipped++; continue; }

    const m = catRef.match(/category-(\d+)/);
    const catNum = m ? m[1] : null;
    if (!catNum || !CAT_MAP[catNum]) {
      console.warn(`  ⚠️  Unknown category: "${catRef}" → skipping "${name}"`);
      skipped++;
      continue;
    }

    const catName = CAT_MAP[catNum];
    const price = priceRaw ? Math.round(Number(priceRaw)) : 0;

    items.push({
      id: `prod-excel-${items.length + 1}-${Date.now()}`,
      name: name,
      name_ar: nameAr || '',
      category: catName,
      price: `${price} SR`,
      tags: [],
      allergens: [],
      portions: [],
    });
  }

  console.log(`✅ Parsed ${items.length} items (skipped ${skipped})`);
  console.log(`   Categories: ${[...new Set(items.map(i => i.category))].join(', ')}`);

  // ─── Step 1: Upsert categories (preserve existing images) ────────────────
  console.log('\n📂 Syncing categories...');
  const { data: existingCats } = await supabase.from('categories').select('name, image, order');
  const existingCatMap = {};
  (existingCats || []).forEach(c => { existingCatMap[c.name.toLowerCase()] = c; });

  for (const { order, name } of CAT_ORDER) {
    const existing = existingCatMap[name.toLowerCase()];
    const payload = { name, order };
    if (existing?.image) payload.image = existing.image;

    const { error } = await supabase.from('categories').upsert(payload, { onConflict: 'name' });
    if (error) console.error(`  ❌ ${name}: ${error.message}`);
    else console.log(`  ✅ ${name}`);
  }

  // ─── Step 2: Clear all products ───────────────────────────────────────────
  console.log('\n🗑️  Clearing existing products...');
  const { error: delErr } = await supabase.from('products').delete().neq('id', '__never__');
  if (delErr) { console.error('❌ Could not delete products:', delErr.message); return; }
  console.log('  ✅ All old products cleared');

  // ─── Step 3: Insert new products in batches ───────────────────────────────
  console.log('\n🍣 Inserting new products...');
  const BATCH = 40;
  let inserted = 0;

  for (let i = 0; i < items.length; i += BATCH) {
    const batch = items.slice(i, i + BATCH);
    const { error } = await supabase.from('products').insert(batch);
    if (error) {
      console.error(`  ❌ Batch ${i}–${i + batch.length}: ${error.message}`);
    } else {
      inserted += batch.length;
      console.log(`  ✅ ${i + 1}–${i + batch.length} inserted`);
    }
  }

  // ─── Summary ──────────────────────────────────────────────────────────────
  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
  console.log(`\n🎉 Done! ${count} products now in database.`);
  if (count !== items.length) {
    console.warn(`⚠️  Expected ${items.length}, got ${count} — check errors above.`);
  }
}

main().catch(console.error);
