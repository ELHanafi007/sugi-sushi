import * as XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gwhkqwuxktpjlwhivcoq.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3aGtxd3V4a3Rwamx3aGl2Y29xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzE0ODU2NiwiZXhwIjoyMDkyNzI0NTY2fQ.4QUyhLsP9QFYx1R8yC9zngflboROS1yNZYtCobwZxpQ';

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const excelPath = './SUGI   MENU LAST Updated Price KARIM GRAPHIC 1 UP last up.xlsx';

interface MenuItem {
  id: string;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  price: string;
  category: string;
  calories: string;
  tags: string[];
  image: string;
  allergens: string[];
}

async function migrate() {
  console.log('Reading Excel file...');
  const workbook = XLSX.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);
  
  console.log('Total rows:', data.length);

  const products: MenuItem[] = [];
  let currentCategory = 'Starters';
  let productId = 1;

  for (const row of data as any[]) {
    const keys = Object.keys(row);
    
    // Get values from different possible columns
    const nameValue = row['__EMPTY'] || row['__EMPTY_1'] || '';
    const priceValue = row['__EMPTY_5'] || row['__EMPTY_4'] || row['__EMPTY_6'] || '';
    const caloriesValue = row['ALL PRICES INCLUDED VAT 15% '] || '';
    const arabicNameValue = row['__EMPTY_11'] || row['__EMPTY_10'] || '';
    
    // Skip header rows
    if (!nameValue || typeof nameValue !== 'string') continue;
    const nameTrim = nameValue.trim();
    if (nameTrim.includes('SUGI') || nameTrim.includes('RESTAURANT') || nameTrim.includes('PRICE') || nameTrim.includes('Calories')) continue;
    if (nameTrim.includes('VAT') || nameTrim.includes('الاسعار')) continue;
    
    // Determine category
    const upperName = nameTrim.toUpperCase();
    if (upperName.includes('SALAD') || nameTrim.includes('سلاط')) {
      currentCategory = 'Salads';
    } else if (upperName.includes('SOUP') || nameTrim.includes('شوربة')) {
      currentCategory = 'Soups';
    } else if (upperName.includes('WOK') || upperName.includes('NOODLE') || upperName.includes('RICE') || nameTrim.includes('أرز') || nameTrim.includes('نودلز')) {
      currentCategory = 'Wok, Noodles & Rice';
    } else if (upperName.includes('TEMPURA') || nameTrim.includes('تمبورا')) {
      currentCategory = 'Tempura';
    } else if (upperName.includes('SASHIMI') || nameTrim.includes('ساشيمي')) {
      currentCategory = 'Sashimi';
    } else if (upperName.includes('NIGIRI') || nameTrim.includes('نيغيري')) {
      currentCategory = 'Nigiri';
    } else if (upperName.includes('MAKI') || nameTrim.includes('رول')) {
      currentCategory = 'Maki Rolls';
    } else if (upperName.includes('TEMAKI') || nameTrim.includes('تيماكي')) {
      currentCategory = 'Temaki';
    } else if (upperName.includes('GUNKAN') || nameTrim.includes('غونكان')) {
      currentCategory = 'Gunkan';
    } else if (upperName.includes('SUGI') || nameTrim.includes('سوجي') || upperName.includes('BEEF') || upperName.includes('CHICKEN') || upperName.includes('لحم') || upperName.includes('دجاج')) {
      currentCategory = 'Sugi Dishes';
    }
    
    // Only add if has valid price
    const price = priceValue;
    if (price && !isNaN(Number(price)) && Number(price) > 0) {
      products.push({
        id: `prod-${productId++}`,
        name: nameTrim,
        name_ar: arabicNameValue?.toString().trim() || '',
        description: '',
        description_ar: '',
        price: `${price} SR`,
        category: currentCategory,
        calories: caloriesValue?.toString().replace('calories', '').trim() || '',
        tags: [],
        image: '',
        allergens: []
      });
    }
  }

  console.log('Products found:', products.length);
  console.log('Categories:', [...new Set(products.map(p => p.category))]);

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category))];
  
  // Upload categories
  console.log('Uploading categories...');
  for (let i = 0; i < categories.length; i++) {
    await supabase.from('categories').upsert({ name: categories[i], order: i }, { onConflict: 'name' });
  }
  console.log('Categories uploaded!');

  // Upload products
  console.log('Uploading products...');
  const { error } = await supabase.from('products').upsert(products, { onConflict: 'id' });
  if (error) {
    console.error('Products error:', error);
  } else {
    console.log('Products uploaded!');
  }

  // Verify
  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
  console.log('Total in DB:', count);

  process.exit(0);
}

migrate().catch(console.error);
