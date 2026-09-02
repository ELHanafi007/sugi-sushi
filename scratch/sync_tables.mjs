import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const TABLES = [
  { id: 't01', label: 'Table 1', capacity: 2, floor_zone: 'Side Wall', x_pos: 9.2, y_pos: 17.5 },
  { id: 't02', label: 'Table 2', capacity: 2, floor_zone: 'Side Wall', x_pos: 9.2, y_pos: 26.7 },
  { id: 't03', label: 'Table 3', capacity: 2, floor_zone: 'Side Wall', x_pos: 9.2, y_pos: 41.0 },
  { id: 't04', label: 'Table 4', capacity: 2, floor_zone: 'Side Wall', x_pos: 9.2, y_pos: 49.9 },
  { id: 't05', label: 'Table 5', capacity: 2, floor_zone: 'Side Wall', x_pos: 9.2, y_pos: 63.9 },
  { id: 't06', label: 'Table 6', capacity: 2, floor_zone: 'Side Wall', x_pos: 9.2, y_pos: 72.8 },
  { id: 't07', label: 'Table 7', capacity: 2, floor_zone: 'Side Wall', x_pos: 9.2, y_pos: 84.7 },
  { id: 't08', label: 'Table 8', capacity: 2, floor_zone: 'Reception', x_pos: 23.3, y_pos: 13.6 },
  { id: 't09', label: 'Table 9', capacity: 4, floor_zone: 'Main Hall', x_pos: 42.1, y_pos: 8.8 },
  { id: 't10', label: 'Table 10', capacity: 4, floor_zone: 'Main Hall', x_pos: 56.4, y_pos: 8.8 },
  { id: 't11', label: 'Table 11', capacity: 4, floor_zone: 'Main Hall', x_pos: 56.4, y_pos: 35.8 },
  { id: 't12', label: 'Table 12', capacity: 6, floor_zone: 'Window Booths', x_pos: 82.9, y_pos: 12.6 },
  { id: 't13', label: 'Table 13', capacity: 6, floor_zone: 'Window Booths', x_pos: 82.9, y_pos: 37.3 },
  { id: 't14', label: 'Table 14', capacity: 6, floor_zone: 'Window Booths', x_pos: 82.9, y_pos: 61.8 },
  { id: 'b01', label: 'Bar 1', capacity: 1, floor_zone: 'Sushi Bar', x_pos: 34.7, y_pos: 72.0 },
  { id: 'b02', label: 'Bar 2', capacity: 1, floor_zone: 'Sushi Bar', x_pos: 40.0, y_pos: 78.2 },
  { id: 'b03', label: 'Bar 3', capacity: 1, floor_zone: 'Sushi Bar', x_pos: 45.6, y_pos: 72.0 },
  { id: 'b04', label: 'Bar 4', capacity: 1, floor_zone: 'Sushi Bar', x_pos: 51.1, y_pos: 78.2 },
  { id: 'b05', label: 'Bar 5', capacity: 1, floor_zone: 'Sushi Bar', x_pos: 56.5, y_pos: 72.0 },
  { id: 'b06', label: 'Bar 6', capacity: 1, floor_zone: 'Sushi Bar', x_pos: 61.7, y_pos: 78.2 },
  { id: 'b07', label: 'Bar 7', capacity: 1, floor_zone: 'Sushi Bar', x_pos: 66.9, y_pos: 72.0 },
];

async function sync() {
  console.log('Upserting 21 tables into restaurant_tables...');
  for (const table of TABLES) {
    const { error } = await supabase
      .from('restaurant_tables')
      .upsert({
        id: table.id,
        label: table.label,
        capacity: table.capacity,
        floor_zone: table.floor_zone,
        x_pos: table.x_pos,
        y_pos: table.y_pos,
      }, { onConflict: 'id' });

    if (error) {
      console.error(`Error with ${table.id} (${table.label}):`, error.message);
    } else {
      console.log(`Synced ${table.label} (${table.id})`);
    }
  }

  // Remove old IDs that are no longer used (l01-l07, m01-m05, w01-w03, r01)
  const oldIds = ['l01','l02','l03','l04','l05','l06','l07','m01','m02','m03','m04','m05','w01','w02','w03','r01'];
  const { error: delError } = await supabase
    .from('restaurant_tables')
    .delete()
    .in('id', oldIds);
  if (delError) {
    console.log('Old tables deletion note:', delError.message);
  } else {
    console.log('Cleaned up legacy table IDs');
  }

  console.log('Done syncing tables!');
}

sync();
