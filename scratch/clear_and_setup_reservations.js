const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceKey);

async function run() {
  // 1. Delete all reservations
  console.log('🗑️  Deleting all reservations...');
  const { error: deleteError, count } = await supabase
    .from('reservations')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // delete all rows

  if (deleteError) {
    console.error('Error deleting reservations:', deleteError.message);
  } else {
    console.log('✅ All reservations deleted.');
  }

  // 2. Check if table_id column exists
  console.log('\n🔍 Checking reservations schema...');
  const { data: sample, error: schemaError } = await supabase
    .from('reservations')
    .select('*')
    .limit(0);

  // Try inserting and removing a test row with table_id to see if column exists
  const { error: testError } = await supabase
    .from('reservations')
    .insert({
      code: '#TEST',
      name: 'Schema Test',
      phone: '0000000000',
      date: '2099-01-01',
      time: '12:00',
      guests: 1,
      status: 'pending',
      is_seen: false,
      table_id: null,
    });

  if (testError) {
    if (testError.message.includes('table_id')) {
      console.log('⚠️  table_id column does NOT exist. You need to run this SQL in Supabase Dashboard:');
      console.log('   ALTER TABLE reservations ADD COLUMN IF NOT EXISTS table_id TEXT REFERENCES public.restaurant_tables(id) ON DELETE SET NULL;');
    } else {
      console.log('Test insert error (may be unrelated to table_id):', testError.message);
    }
  } else {
    console.log('✅ table_id column exists and works.');
    // Clean up test row
    await supabase.from('reservations').delete().eq('code', '#TEST');
  }

  // 3. Verify tables exist
  console.log('\n🔍 Checking restaurant_tables...');
  const { data: tables, error: tablesError } = await supabase
    .from('restaurant_tables')
    .select('id, label, capacity, status');

  if (tablesError) {
    console.error('❌ Error fetching tables:', tablesError.message);
  } else {
    console.log(`✅ Found ${tables.length} restaurant tables.`);
    const occupied = tables.filter(t => t.status !== 'empty');
    console.log(`   ${occupied.length} currently occupied, ${tables.length - occupied.length} available.`);
  }

  // 4. Verify sessions table
  console.log('\n🔍 Checking sessions table...');
  const { data: sessions, error: sessionsError } = await supabase
    .from('sessions')
    .select('id, table_id, status');

  if (sessionsError) {
    console.error('❌ Error fetching sessions:', sessionsError.message);
  } else {
    const active = sessions.filter(s => s.status === 'active');
    console.log(`✅ Found ${sessions.length} sessions (${active.length} active).`);
  }

  // 5. Final reservation count
  console.log('\n🔍 Final reservation count...');
  const { count: finalCount } = await supabase
    .from('reservations')
    .select('*', { count: 'exact', head: true });
  console.log(`✅ Reservations table now has ${finalCount} records.`);

  console.log('\n🎉 Done! System is clean and ready.');
}

run().catch(console.error);
