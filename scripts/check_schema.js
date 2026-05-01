const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env.local' });

async function check() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data, error } = await supabase.from('categories').select('*').limit(1);
  console.log("Category sample:", data);
  const { data: pData } = await supabase.from('products').select('*').limit(1);
  console.log("Product sample:", pData);
}

check();
