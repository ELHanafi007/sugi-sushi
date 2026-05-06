const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCategoriesSchema() {
  const { data, error } = await supabase.from('categories').select('*').limit(1);
  console.log('Categories data:', data);
  console.log('Error:', error);
}

checkCategoriesSchema();
