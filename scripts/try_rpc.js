const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceKey);

async function tryRpc() {
  const { data, error } = await supabase.rpc('exec_sql', { sql: 'ALTER TABLE products ADD COLUMN IF NOT EXISTS portions JSONB;' });
  if (error) {
    console.log('RPC exec_sql not available or error:', error.message);
  } else {
    console.log('Successfully added portions column via RPC!');
  }
}

tryRpc().catch(console.error);
