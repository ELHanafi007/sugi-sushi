const xlsx = require('xlsx');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceKey);

async function compare() {
  console.log('--- DEEP MENU COMPARISON ---');
  
  // 1. Read Excel
  const workbook = xlsx.readFile(path.join(__dirname, '../menu_update.xlsx'));
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const excelData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  
  const excelDishes = [];
  excelData.forEach((row, i) => {
    const name = row[0] ? row[0].toString().trim() : '';
    const priceVal = parseFloat(row[4]) || parseFloat(row[6]);
    if (name && !isNaN(priceVal) && priceVal > 0 && !name.toLowerCase().includes('calorie')) {
      excelDishes.push({ name, price: priceVal });
    }
  });

  // 2. Fetch DB
  const { data: dbDishes } = await supabase.from('products').select('name, price');
  const dbDishNames = new Set((dbDishes || []).map(p => p.name.trim().toLowerCase()));

  // 3. Analyze
  const missingInDb = excelDishes.filter(d => !dbDishNames.has(d.name.toLowerCase()));
  const totalInExcel = excelDishes.length;
  const totalInDb = dbDishes.length;

  console.log(`Total Dishes in Excel (with price): ${totalInExcel}`);
  console.log(`Total Dishes in DB: ${totalInDb}`);
  
  if (missingInDb.length > 0) {
    console.log('--- MISSING IN DB ---');
    missingInDb.forEach(d => console.log(`- ${d.name}`));
  } else {
    console.log('All Excel dishes are present in DB.');
  }

  // Check Order
  console.log('Checking Order Consistency...');
  let orderMismatch = false;
  for (let i = 0; i < Math.min(excelDishes.length, dbDishes.length); i++) {
    // Note: DB dishes might be in a different order depending on how they were fetched
  }
}

compare().catch(console.error);
