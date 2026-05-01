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
  let currentCategory = "Starters";
  
  const KNOWN_CATS = ['SALADS', 'SOUPS', 'STARTERS', 'WOK', 'TEMPURA', 'SASHIMI', 'TATAKI', 'CHEVISHI', 'NIGIRI', 'GUNKAN', 'TEMAKI', 'MAKI ROLL', 'AROMAKI ROLLS', 'CALIFORNIA ROLLS', 'WIN ROLLS', 'DYNAMITE ROLL', 'BEEF   ROLL', 'KANI  CRUNCHY', 'FIRE CRUNCHY', 'TUNA ROLL', 'VEGI ROLL', 'CHICKEN TEMPURA', 'FLAME SALMON', 'FLAME CRAB', 'LOBSTER ROLL', 'TRUFFLE', 'FRY ROLLS', 'BOXES', 'BOAT', 'DRINKS', 'DESSERTS', 'SAUCES'];

  console.log(`Processing ${data.length} rows...`);

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const col0 = row[0] ? row[0].toString().trim() : '';
    const col1 = row[1] ? row[1].toString().trim() : '';
    const col5 = row[5] ? row[5].toString().trim() : '';
    const col6 = row[6] ? row[6].toString().trim() : '';
    const col9 = row[9] ? row[9].toString().trim() : '';
    const col11 = row[11] ? row[11].toString().trim() : '';

    // Ignore headers/footer stuff
    if (col0.includes('PRICES') || col0.includes('RESTAURANT') || col0.includes('Calories') || col0.includes('VAT')) continue;

    const isKnownCategory = KNOWN_CATS.some(c => col0.toUpperCase().trim() === c);

    // Detect Category
    if (col0 && !col5 && !col6 && row.length < 15 && !col0.includes('served with') && !col0.includes('mix of')) {
       // A category usually has no Arabic translation in the same row, or the Arabic is in a specific place
       const hasNoArabic = !col11 && !col9;
       if (isKnownCategory || (hasNoArabic && col0.length < 30 && !col1)) {
         let catName = col0.split('calories')[0].trim();
         // Normalize common categories to match translations
         if (catName.toUpperCase().includes('SALADS')) catName = 'Salads';
         if (catName.toUpperCase().includes('SOUPS')) catName = 'Soups';
         if (catName.toUpperCase().includes('STARTERS')) catName = 'Starters';
         if (catName.toUpperCase().includes('WOK')) catName = 'Wok, Noodles & Rice';
         if (catName.toUpperCase().includes('TEMPURA')) catName = 'Tempura';
         if (catName.toUpperCase().includes('SASHIMI')) catName = 'Sashimi';
         if (catName.toUpperCase().includes('NIGIRI')) catName = 'Nigiri';
         if (catName.toUpperCase().includes('TEMAKI')) catName = 'Temaki';
         if (catName.toUpperCase().includes('MAKI ROLL')) catName = 'Maki Rolls';
         if (catName.toUpperCase().includes('BOXES')) catName = 'Boxes';
         if (catName.toUpperCase().includes('DESSERTS')) catName = 'Desserts';
         if (catName.toUpperCase().includes('COLD DRINKS')) catName = 'Cold Drinks';
         if (catName.toUpperCase().includes('HOT DRINKS')) catName = 'Hot Drinks';
         if (catName.toUpperCase().includes('EXTRA SAUCES')) catName = 'Extra Sauces';

         currentCategory = catName;
         if (!categories.includes(currentCategory)) {
           categories.push(currentCategory);
         }
         continue;
       }
    }

    // Detect Product
    // A product usually has a name and an Arabic translation.
    // If it's not a category and not empty, and has Arabic text, it's a candidate.
    const col8plus = row.slice(8).join(' ');
    const hasArabic = /[\u0600-\u06FF]/.test(col8plus);
    const hasEnglish = (col0 || col1);
    const isActuallyCat = isKnownCategory || (!hasArabic && col0 && !col1 && !col5 && !col6 && col0.length < 30 && !col0.includes('served with') && !col0.includes('mix of'));

    // Even more inclusive: if it has English text and isn't a category/header, it's a product
    if (hasEnglish && !isActuallyCat && !col0.includes('All served')) {
      let name = col0 || col1;
      // Handle sub-categories in same row
      if (col0 && col1 && col0 !== col1 && col0.length < 20) {
        name = `${col0} ${col1}`;
      }
      
      // Find the Arabic part in the row
      let nameAr = row.slice(8).find(c => c && /[\u0600-\u06FF]/.test(c.toString())) || '';
      let calories = col5;
      let description = '';
      let descriptionAr = '';

      // Check next row for description (only if next row is NOT a product itself)
      const nextRow = data[i+1];
      if (nextRow && nextRow.length > 0) {
        const nextCol0 = nextRow[0] ? nextRow[0].toString().trim() : '';
        const nextCol1 = nextRow[1] ? nextRow[1].toString().trim() : '';
        const nextCol5 = nextRow[5] ? nextRow[5].toString().trim() : '';
        const nextCol6 = nextRow[6] ? nextRow[6].toString().trim() : '';
        const nextArabic = nextRow.slice(8).find(c => c && /[\u0600-\u06FF]/.test(c.toString()));

        // If next row has NO price and NO calories, and it's not a category, it's likely a description
        const nextHasPrice = !isNaN(parseFloat(nextCol6)) && parseFloat(nextCol6) > 0;
        const nextIsCat = KNOWN_CATS.some(c => nextCol0.toUpperCase().trim() === c);
        
        if (!nextHasPrice && !nextCol5 && (nextCol0 || nextCol1) && !nextIsCat) {
          description = nextCol0 || nextCol1;
          descriptionAr = nextArabic || '';
          i++; // Skip next row
        }
      }

      const priceVal = parseFloat(col6);
      const hasPrice = !isNaN(priceVal) && priceVal > 0;

      products.push({
        id: `prod-${products.length + 1}-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: name,
        name_ar: nameAr.toString().trim(),
        description: description,
        description_ar: descriptionAr.toString().trim(),
        price: hasPrice ? `${priceVal} SR` : '',
        category: currentCategory,
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
