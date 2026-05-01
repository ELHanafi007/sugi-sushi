const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env.local' });

async function test() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  console.log("Testing connection to:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  const { data, error } = await supabase.from('categories').select('count', { count: 'exact', head: true });
  if (error) {
    console.error("Connection error:", error);
  } else {
    console.log("Connection successful! Category count:", data);
  }
}

test();
