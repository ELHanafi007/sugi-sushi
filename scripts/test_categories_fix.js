const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
  const categories = ['SALADS', 'SOUPS', 'STARTERS'];
  
  await supabase.from('categories').delete().not('name', 'eq', 'SOME_IMPOSSIBLE_NAME');
  
  const inserts = categories.map((name, index) => ({
    name,
    order: index
  }));

  const { error } = await supabase.from('categories').insert(inserts);
  console.log('Insert error:', error);
  
  const { data } = await supabase.from('categories').select('*');
  console.log('Current categories:', data);
}

test();
