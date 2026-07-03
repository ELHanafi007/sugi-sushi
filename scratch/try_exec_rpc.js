const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceKey);

async function run() {
  console.log("Trying RPC 'exec'...");
  const { data: d1, error: e1 } = await supabase.rpc('exec', { sql: 'ALTER TABLE reservations ADD COLUMN IF NOT EXISTS table_id TEXT;' });
  if (e1) {
    console.error("RPC 'exec' failed:", e1.message);
  } else {
    console.log("RPC 'exec' succeeded:", d1);
    return;
  }

  console.log("Trying RPC 'exec_sql'...");
  const { data: d2, error: e2 } = await supabase.rpc('exec_sql', { sql: 'ALTER TABLE reservations ADD COLUMN IF NOT EXISTS table_id TEXT;' });
  if (e2) {
    console.error("RPC 'exec_sql' failed:", e2.message);
  } else {
    console.log("RPC 'exec_sql' succeeded:", d2);
    return;
  }
}

run().catch(console.error);
