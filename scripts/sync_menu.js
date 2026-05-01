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

    // Detect Category
    if (col0 && !col5 && !col6 && row.length < 15 && !col0.includes('served with') && !col0.includes('mix of')) {
       const isKnownCategory = ['SALADS', 'SOUPS', 'STARTERS', 'WOK', 'TEMPURA', 'SASHIMI', 'TATAKI', 'CHEVISHI', 'NIGIRI', 'GUNKAN', 'TEMAKI', 'MAKI ROLL', 'AROMAKI ROLLS', 'CALIFORNIA ROLLS', 'WIN ROLLS', 'DYNAMITE ROLL', 'BEEF   ROLL', 'KANI  CRUNCHY', 'FIRE CRUNCHY', 'TUNA ROLL', 'VEGI ROLL', 'CHICKEN TEMPURA', 'FLAME SALMON', 'FLAME CRAB', 'LOBSTER ROLL', 'TRUFFLE', 'FRY ROLLS', 'BOXES', 'BOAT', 'DRINKS', 'DESSERTS', 'SAUCES'].some(c => col0.toUpperCase().includes(c));
       
       if (isKnownCategory || (col0.length < 30 && !col1)) {
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
    // A product usually has a price in col 6 OR calories in col 5
    const priceVal = parseFloat(col6);
    const hasPrice = !isNaN(priceVal) && priceVal > 0;
    const hasCalories = col5 && col5.toLowerCase().includes('calories');
    
    if (hasPrice || hasCalories) {
      let name = col0 || col1;
      // If col0 and col1 are both present, col0 might be a subcategory (like NOODLES)
      if (col0 && col1 && col0 !== col1 && col0.length < 20) {
        name = `${col0} ${col1}`;
      }
      
      let nameAr = col11 || col9;
      let calories = col5;
      let description = '';
      let descriptionAr = '';

      // Check next row for description
      const nextRow = data[i+1];
      if (nextRow && nextRow.length > 0) {
        const nextCol0 = nextRow[0] ? nextRow[0].toString().trim() : '';
        const nextCol1 = nextRow[1] ? nextRow[1].toString().trim() : '';
        const nextCol6 = nextRow[6] ? nextRow[6].toString().trim() : '';
        const nextCol9 = nextRow[9] ? nextRow[9].toString().trim() : '';

        if (!nextCol6 && (nextCol0 || nextCol1) && !(nextCol0+nextCol1).toLowerCase().includes('calories')) {
          description = nextCol0 || nextCol1;
          descriptionAr = nextCol9;
          i++; // Skip next row
        }
      }

      products.push({
        id: `prod-${products.length + 1}-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: name,
        name_ar: nameAr,
        description: description,
        description_ar: descriptionAr,
        price: hasPrice ? `${priceVal} SR` : '',
        category: currentCategory,
        calories: calories.replace(/calories/gi, '').trim(),
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
