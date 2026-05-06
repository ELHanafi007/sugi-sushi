const xlsx = require('xlsx');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceKey);

async function sync() {
  console.log('--- SUGI MENU SYNC 3.0 (ID-Stable & Portion-Aware) ---');
  
  // 1. Fetch current products to map Name -> {id, image}
  console.log('Fetching current products to preserve data mapping...');
  const { data: currentProducts } = await supabase.from('products').select('id, name, image');
  const productMap = new Map(); // name.toLowerCase() -> {id, image}
  if (currentProducts) {
    currentProducts.forEach(p => {
      productMap.set(p.name.trim().toLowerCase(), { id: p.id, image: p.image });
    });
    console.log(`Mapped ${productMap.size} existing products.`);
  }

  // 2. Read Excel file
  const filePath = path.join(__dirname, '../menu_update.xlsx');
  const workbook = xlsx.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  
  let categories = [];
  let products = [];
  let currentCategory = "";
  const KNOWN_CATS = ['SALADS', 'SOUPS', 'STARTERS', 'WOK', 'TEMPURA', 'SASHIMI', 'TATAKI', 'CHEVISHI', 'NIGIRI', 'GUNKAN', 'TEMAKI', 'MAKI ROLL', 'AROMAKI ROLLS', 'CALIFORNIA ROLLS', 'WIN ROLLS', 'DYNAMITE ROLL', 'BEEF ROLL', 'KANI CRUNCHY', 'FIRE CRUNCHY', 'TUNA ROLL', 'VEGI ROLL', 'CHICKEN TEMPURA', 'FLAME SALMON', 'FLAME CRAB', 'LOBSTER ROLL', 'TRUFFLE', 'FRY ROLLS', 'BOXES', 'BOAT', 'DRINKS', 'HOT DRINKS', 'EXPRESSO', 'FRESH JUICES', 'DESSERTS', 'SAUCES'];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const col0 = row[0] ? row[0].toString().trim() : '';
    const col4 = row[4] ? row[4].toString().trim() : '';
    const col5 = row[5] ? row[5].toString().trim() : '';
    const col6 = row[6] ? row[6].toString().trim() : '';
    const col7 = row[7] ? row[7].toString().trim() : '';
    const col11 = row[11] ? row[11].toString().trim() : '';

    if (col0.toUpperCase().includes('PRICES') || col0.toUpperCase().includes('RESTAURANT') || col0.toUpperCase().includes('VAT')) continue;

    // Category logic
    const priceVal = parseFloat(col6) || parseFloat(col4);
    const hasPrice = !isNaN(priceVal) && priceVal > 0;
    const normalizedCol0 = col0.toUpperCase().trim();
    
    // A category header typically has no price, no calories in col4/col5, and matches a known cat
    const isCategoryHeader = !hasPrice && col0.length > 0 && col0.length < 50 && 
                             KNOWN_CATS.some(c => {
                               const nc = c.toUpperCase();
                               return normalizedCol0 === nc || 
                                      (normalizedCol0.includes(nc) && normalizedCol0.length < nc.length + 10);
                             });

    if (isCategoryHeader) {
      const foundCat = KNOWN_CATS.find(c => normalizedCol0.includes(c.toUpperCase()));
      let catName = foundCat || col0;
      
      // Map to standardized names
      if (catName.includes('SALADS')) catName = 'Salads';
      else if (catName.includes('SOUPS')) catName = 'Soups';
      else if (catName.includes('STARTERS')) catName = 'Starters';
      else if (catName.includes('WOK')) catName = 'Wok, Noodles & Rice';
      else if (catName.includes('TEMPURA')) catName = 'Tempura';
      else if (catName.includes('SASHIMI')) catName = 'Sashimi';
      else if (catName.includes('TATAKI')) catName = 'Tataki';
      else if (catName.includes('NIGIRI')) catName = 'Nigiri';
      else if (catName.includes('GUNKAN')) catName = 'Gunkan';
      else if (catName.includes('TEMAKI')) catName = 'Temaki';
      else if (catName.includes('MAKI ROLL')) catName = 'Maki Rolls';
      else if (catName.includes('AROMAKI')) catName = 'Aromaki Rolls';
      else if (catName.includes('CALIFORNIA')) catName = 'California Rolls';
      else if (catName.includes('BOXES')) catName = 'Boxes';
      else if (catName.includes('BOAT')) catName = 'Sugi Boat';
      else if (catName.includes('DRINKS') || catName.includes('JUICES')) catName = 'Cold Drinks';
      else if (catName.includes('HOT DRINKS')) catName = 'Hot Drinks';
      else if (catName.includes('DESSERTS')) catName = 'Desserts';
      else if (catName.includes('SAUCES')) catName = 'Extra Sauces';
      else catName = catName.charAt(0).toUpperCase() + catName.slice(1).toLowerCase();

      currentCategory = catName;
      if (!categories.includes(currentCategory)) categories.push(currentCategory);
      continue;
    }

    // Product logic
    const arabicName = col11 || row.slice(8).find(c => c && /[\u0600-\u06FF]/.test(c.toString())) || '';
    // A row is a product IF it has col0 AND at least one price field (primary or portion)
    if (col0 && (hasPrice || col5)) {
      let name = col0;
      const lowerName = name.toLowerCase();
      
      // Smart price detection: ignore values containing 'Calories'
      let finalPriceVal = 0;
      const p6 = parseFloat(col6);
      const p4 = parseFloat(col4);
      
      if (!isNaN(p6) && !col6.toLowerCase().includes('calorie')) {
        finalPriceVal = p6;
      } else if (!isNaN(p4) && !col4.toLowerCase().includes('calorie')) {
        finalPriceVal = p4;
      }

      let price = finalPriceVal > 0 ? `${finalPriceVal} SR` : '';
      let calories = col5 || (col4.toLowerCase().includes('calorie') ? col4 : '');
      let description = '';
      let descriptionAr = '';
      let portions = [];

      // Detect Portions (ignore if values are calories)
      const p1_raw = col4.toLowerCase().includes('calorie') ? NaN : parseFloat(col4);
      const p2_raw = col6.toLowerCase().includes('calorie') ? NaN : parseFloat(col6);
      
      if (!isNaN(p1_raw) && !isNaN(p2_raw) && p1_raw !== p2_raw) {
        portions = [
          { name: 'Full Order', nameAr: 'طلب كامل', price: `${p1_raw} SR`, pieces: 8, tags: ['Best Value'] },
          { name: 'Half Order', nameAr: 'نصف طلب', price: `${p2_raw} SR`, pieces: 4 }
        ];
        price = `${p2_raw} SR`;
      }

      // Description logic
      const nextRow = data[i+1];
      if (nextRow) {
        const nextCol0 = nextRow[0] ? nextRow[0].toString().trim() : '';
        const nextCol6 = nextRow[6] ? nextRow[6].toString().trim() : '';
        const nextHasPrice = !isNaN(parseFloat(nextCol6)) && parseFloat(nextCol6) > 0;
        if (!nextHasPrice && nextCol0 && nextCol0.length > 5 && !KNOWN_CATS.some(c => nextCol0.toUpperCase().includes(c))) {
          description = nextCol0;
          descriptionAr = nextRow.slice(8).find(c => c && /[\u0600-\u06FF]/.test(c.toString())) || '';
          i++;
        }
      }

      // Resolve ID and Image from mapping
      const existing = productMap.get(lowerName);
      const id = existing ? existing.id : `prod-${Date.now()}-${lowerName.replace(/[^a-z0-9]/g, '-')}`;
      const image = existing ? existing.image : '';

      products.push({
        id, name, name_ar: arabicName.toString().trim(),
        description, description_ar: descriptionAr.toString().trim(),
        price, category: currentCategory || 'Other',
        calories: calories ? calories.toString().replace(/calories/gi, '').trim() : '',
        tags: [], image, portions, allergens: []
      });
    }
  }

  // 2.5 Deduplicate products by ID
  const uniqueProducts = [];
  const seenIds = new Set();
  for (const p of products) {
    if (!seenIds.has(p.id)) {
      uniqueProducts.push(p);
      seenIds.add(p.id);
    }
  }
  console.log(`Finalized ${uniqueProducts.length} unique products for upload.`);

  // 3. Sync to Supabase
  console.log('Upserting categories...');
  const categoryData = categories.map((name, index) => ({ name, order: index }));
  await supabase.from('categories').upsert(categoryData, { onConflict: 'name' });

  console.log(`Upserting ${uniqueProducts.length} products...`);
  for (let i = 0; i < uniqueProducts.length; i += 50) {
    const batch = uniqueProducts.slice(i, i + 50);
    const { error } = await supabase.from('products').upsert(batch, { onConflict: 'id' });
    if (error) console.error(`Error in batch ${i/50 + 1}:`, error.message);
  }

  console.log('Sync process completed successfully!');

  // 4. Cleanup obsolete products (those in DB but NOT in Excel)
  console.log('Checking for obsolete products to remove...');
  const { data: dbProducts, error: fetchError } = await supabase.from('products').select('id');
  if (fetchError) {
    console.error('Error fetching existing products for cleanup:', fetchError.message);
  } else {
    const idsToDelete = dbProducts
      .map(p => p.id)
      .filter(id => !seenIds.has(id));
    
    if (idsToDelete.length > 0) {
      console.log(`Deleting ${idsToDelete.length} obsolete products: ${idsToDelete.join(', ')}`);
      const { error: delError } = await supabase.from('products').delete().in('id', idsToDelete);
      if (delError) console.error('Error during cleanup:', delError.message);
      else console.log('Cleanup completed.');
    } else {
      console.log('No obsolete products found. System is clean.');
    }
  }
}

sync().catch(console.error);
