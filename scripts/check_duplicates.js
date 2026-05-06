const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceKey);

async function checkDuplicates() {
  const { data, error } = await supabase.from('products').select('name');
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  const names = data.map(p => p.name);
  const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
  
  if (duplicates.length > 0) {
    console.log('Found duplicates:', [...new Set(duplicates)]);
  } else {
    console.log('No duplicates found in product names.');
  }
}

checkDuplicates().catch(console.error);
