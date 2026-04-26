import * as XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gwhkqwuxktpjlwhivcoq.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3aGtxd3V4a3Rwamx3aGl2Y29xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzE0ODU2NiwiZXhwIjoyMDkyNzI0NTY2fQ.4QUyhLsP9QFYx1R8yC9zngflboROS1yNZYtCobwZxpQ';

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function setup() {
  console.log('Setting up Supabase Storage bucket...');

  const { data, error } = await supabase.storage.createBucket('product-images', {
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    fileSizeLimit: 5242880
  });

  if (error) {
    if (error.message.includes('already exists')) {
      console.log('Bucket already exists');
    } else {
      console.error('Error creating bucket:', error.message);
    }
  } else {
    console.log('Bucket created:', data);
  }

  process.exit(0);
}

setup().catch(console.error);