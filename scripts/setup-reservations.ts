import * as XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gwhkqwuxktpjlwhivcoq.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3aGtxd3V4a3Rwamx3aGl2Y29xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzE0ODU2NiwiZXhwIjoyMDkyNzI0NTY2fQ.4QUyhLsP9QFYx1R8yC9zngflboROS1yNZYtCobwZxpQ';

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function setupReservationsTable() {
  console.log('Creating reservations table...');

  const { error } = await supabase.rpc('exec', {
    sql: `
      CREATE TABLE IF NOT EXISTS reservations (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        date DATE NOT NULL,
        time TEXT NOT NULL,
        guests INTEGER NOT NULL DEFAULT 2,
        occasion TEXT,
        notes TEXT,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
        is_seen BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
      );
      
      ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Allow all for reservations" ON reservations;
      CREATE POLICY "Allow all for reservations" ON reservations FOR ALL USING (true) WITH CHECK (true);
    `
  });

  if (error) {
    console.log('RPC not available, trying direct approach...');
    
    const { error: insertError } = await supabase.from('reservations').insert({
      id: '00000000-0000-0000-0000-000000000001',
      code: '#0001',
      name: 'Test Reservation',
      phone: '0500000000',
      email: 'test@test.com',
      date: '2026-05-01',
      time: '19:00',
      guests: 2,
      status: 'pending',
      is_seen: false
    });
    
    if (insertError) {
      console.log('Table may already exist or needs manual creation');
      console.log('Error:', insertError.message);
    } else {
      console.log('Test reservation created!');
      
      await supabase.from('reservations').delete().eq('id', '00000000-0000-0000-0000-000000000001');
    }
  }

  const { count } = await supabase.from('reservations').select('*', { count: 'exact', head: true });
  console.log('Reservations table status:', count === null ? 'needs setup' : `${count} records (test only)`);

  process.exit(0);
}

setupReservationsTable().catch(console.error);