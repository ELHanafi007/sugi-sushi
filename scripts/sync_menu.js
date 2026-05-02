const xlsx = require('xlsx');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

console.log("Using Supabase URL:", supabaseUrl);
console.log("Using Service Key (first 10 chars):", serviceKey.substring(0, 10) + "...");

const supabase = createClient(supabaseUrl, serviceKey);

async function sync() {
  console.log('Reading Excel file...');
  const filePath = path.join(__dirname, '../SUGI   MENU LAST Updated Price KARIM GRAPHIC 1 UP last up.xlsx');
  const workbook = xlsx.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  
  let categories = [];
  let products = [];
  let currentCategory = "";
  
  const KNOWN_CATS = ['SALADS', 'SOUPS', 'STARTERS', 'WOK', 'TEMPURA', 'SASHIMI', 'TATAKI', 'CHEVISHI', 'NIGIRI', 'GUNKAN', 'TEMAKI', 'MAKI ROLL', 'AROMAKI ROLLS', 'CALIFORNIA ROLLS', 'WIN ROLLS', 'DYNAMITE ROLL', 'BEEF   ROLL', 'KANI  CRUNCHY', 'FIRE CRUNCHY', 'TUNA ROLL', 'VEGI ROLL', 'CHICKEN TEMPURA', 'FLAME SALMON', 'FLAME CRAB', 'LOBSTER ROLL', 'TRUFFLE', 'FRY ROLLS', 'BOXES', 'BOAT', 'DRINKS', 'DESSERTS', 'SAUCES'];

  console.log(`Processing ${data.length} rows...`);

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const col0 = row[0] ? row[0].toString().trim() : '';
    const col1 = row[1] ? row[1].toString().trim() : '';
    const col5 = row[5] ? row[5].toString().trim() : '';
    const col6 = row[6] ? row[6].toString().trim() : '';
    
    if (col0.includes('PRICES') || col0.includes('RESTAURANT') || col0.includes('VAT')) continue;

    // 1. Check if it's a CATEGORY
    const normalizedCol0 = col0.toUpperCase().replace(/[^A-Z ]/g, '').trim();
    const foundCat = KNOWN_CATS.find(c => {
      const normalizedCat = c.toUpperCase().replace(/[^A-Z ]/g, '').trim();
      return normalizedCol0 === normalizedCat || normalizedCol0.includes(normalizedCat);
    });

    // A category row shouldn't have a price in col 6 (unless it's the header "PRICE")
    const priceVal = parseFloat(col6);
    const hasPrice = !isNaN(priceVal) && priceVal > 0;

    if (foundCat && !hasPrice && col0.length < 500) {
      let catName = foundCat;
      // Normalization
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
      else if (catName.includes('DRINKS')) catName = 'Cold Drinks';
      else if (catName.includes('DESSERTS')) catName = 'Desserts';
      else if (catName.includes('SAUCES')) catName = 'Extra Sauces';
      else {
        // Keep name as is but title case
        catName = catName.charAt(0).toUpperCase() + catName.slice(1).toLowerCase();
      }

      currentCategory = catName;
      if (!categories.includes(currentCategory)) {
        categories.push(currentCategory);
      }
      continue;
    }

    // 2. Check if it's a PRODUCT
    const col8plus = row.slice(8).join(' ');
    const hasArabic = /[\u0600-\u06FF]/.test(col8plus);
    const hasEnglish = (col0 || col1);
    
    // Safety: if it's a header like "Calories" skip
    if (col0.toLowerCase() === 'calories' || col1.toLowerCase() === 'calories') continue;

    if (hasEnglish && (hasArabic || hasPrice || col5)) {
      let name = col0 || col1;
      
      // Special case for sub-headers that are part of the name
      if (col0 && col1 && col0 !== col1 && col0.length < 20 && !col0.includes('All served')) {
        name = `${col0} ${col1}`;
      }

      let nameAr = row.slice(8).find(c => c && /[\u0600-\u06FF]/.test(c.toString())) || '';
      let calories = col5;
      let description = '';
      let descriptionAr = '';

      // Description logic: check next row
      const nextRow = data[i+1];
      if (nextRow) {
        const nextCol0 = nextRow[0] ? nextRow[0].toString().trim() : '';
        const nextCol1 = nextRow[1] ? nextRow[1].toString().trim() : '';
        const nextCol6 = nextRow[6] ? nextRow[6].toString().trim() : '';
        const nextPrice = parseFloat(nextCol6);
        const nextHasPrice = !isNaN(nextPrice) && nextPrice > 0;
        const nextArabic = nextRow.slice(8).find(c => c && /[\u0600-\u06FF]/.test(c.toString()));

        // If next row has text but no price and is not a known category, it's a description
        const nextCol0Upper = nextCol0.toUpperCase();
        const nextIsCat = KNOWN_CATS.some(c => nextCol0Upper.includes(c.toUpperCase()));

        if (!nextHasPrice && (nextCol0 || nextCol1) && !nextIsCat && !nextCol0.includes('Calories')) {
          description = nextCol0 || nextCol1;
          descriptionAr = nextArabic || '';
          i++;
        }
      }

      products.push({
        id: `prod-${products.length + 1}-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: name,
        name_ar: nameAr.toString().trim(),
        description: description,
        description_ar: descriptionAr.toString().trim(),
        price: hasPrice ? `${priceVal} SR` : '',
        category: currentCategory || 'Other',
        calories: calories ? calories.replace(/calories/gi, '').trim() : '',
        tags: [],
        image: '',
        allergens: []
      });
    }
  }

  console.log(`Found ${categories.length} categories and ${products.length} products.`);

  // Sync to Supabase
  console.log('Cleaning up existing data...');
  await supabase.from('products').delete().neq('id', '0'); // Delete all products
  await supabase.from('categories').delete().neq('name', '0'); // Delete all categories

  console.log('Syncing categories...');
  const categoryData = categories.map((name, index) => ({ name, order: index }));
  const { error: catError } = await supabase.from('categories').insert(categoryData);
  if (catError) console.error('Error syncing categories:', catError);

  console.log('Syncing products...');
  // Insert in batches of 50 to avoid issues
  for (let i = 0; i < products.length; i += 50) {
    const batch = products.slice(i, i + 50);
    const { error: prodError } = await supabase.from('products').insert(batch);
    if (prodError) console.error(`Error syncing products batch ${i/50 + 1}:`, prodError);
  }

  console.log('Sync complete!');
}

sync().catch(console.error);
