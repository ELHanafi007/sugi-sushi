const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
  const { data: existing, error: e1 } = await supabase.from('categories').select('name');
  console.log('Existing error:', e1);
  const categories = (existing || []).map(c => c.name).reverse(); // Try reversing the order
  
  const upserts = categories.map((name, index) => ({
    name,
    order: index
  }));

  const { error } = await supabase
    .from('categories')
    .upsert(upserts, { onConflict: 'name' });
    
  console.log('Upsert error:', error);
}

test();
