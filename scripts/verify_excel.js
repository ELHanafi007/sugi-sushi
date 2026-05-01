const xlsx = require('xlsx');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceKey);

const KNOWN_CATS = ['SALADS', 'SOUPS', 'STARTERS', 'WOK', 'TEMPURA', 'SASHIMI', 'TATAKI', 'CHEVISHI', 'NIGIRI', 'GUNKAN', 'TEMAKI', 'MAKI ROLL', 'AROMAKI ROLLS', 'CALIFORNIA ROLLS', 'WIN ROLLS', 'DYNAMITE ROLL', 'BEEF   ROLL', 'KANI  CRUNCHY', 'FIRE CRUNCHY', 'TUNA ROLL', 'VEGI ROLL', 'CHICKEN TEMPURA', 'FLAME SALMON', 'FLAME CRAB', 'LOBSTER ROLL', 'TRUFFLE', 'FRY ROLLS', 'BOXES', 'BOAT', 'DRINKS', 'DESSERTS', 'SAUCES'];

async function verify() {
  const filePath = path.join(__dirname, '../SUGI   MENU LAST Updated Price KARIM GRAPHIC 1 UP last up.xlsx');
  const workbook = xlsx.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  
  let excelItems = [];
  let currentCategory = "Unknown";

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const col0 = row[0] ? row[0].toString().trim() : '';
    const col1 = row[1] ? row[1].toString().trim() : '';
    const col5 = row[5] ? row[5].toString().trim() : '';
    const col6 = row[6] ? row[6].toString().trim() : '';
    const col9 = row[9] ? row[9].toString().trim() : '';
    const col11 = row[11] ? row[11].toString().trim() : '';

    if (col0.includes('PRICES') || col0.includes('RESTAURANT') || col0.includes('VAT')) continue;

    // Category detection
    const isCat = KNOWN_CATS.some(c => col0.toUpperCase().includes(c)) && !col6 && !col5;
    if (isCat || (col0 && !col1 && !col5 && !col6 && col0.length < 30 && !col0.includes('served with'))) {
      currentCategory = col0.split('calories')[0].trim();
      continue;
    }

    // Dish detection: If it has an Arabic name and some English text
    const hasArabic = col9 || col11;
    const hasEnglish = col0 || col1;
    
    if (hasEnglish && hasArabic && !isCat) {
      // It's likely a dish
      excelItems.push({
        name: col0 || col1,
        category: currentCategory,
        price: col6,
        calories: col5
      });
    }
  }

  console.log(`Excel analysis: Found ${excelItems.length} potential dishes.`);
  
  const { data: dbItems, error } = await supabase.from('products').select('name, category');
  if (error) {
    console.error("DB Error:", error);
    return;
  }

  console.log(`Database check: Found ${dbItems.length} dishes in DB.`);

  const missing = excelItems.filter(ei => !dbItems.some(di => di.name.toLowerCase() === ei.name.toLowerCase()));
  
  if (missing.length > 0) {
    console.log(`\n!!! MISSING ${missing.length} ITEMS !!!`);
    missing.forEach(m => console.log(`- [${m.category}] ${m.name}`));
  } else {
    console.log("\n✅ ALL EXCEL ITEMS ARE IN THE DATABASE!");
  }
}

verify();
