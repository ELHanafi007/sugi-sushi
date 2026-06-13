-- Run this in Supabase Dashboard > SQL Editor

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_number TEXT NOT NULL,
  items JSONB NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'served', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Enable realtime for orders
ALTER publication supabase_realtime ADD TABLE orders;

-- Disable RLS for now (you can enable it later with proper policies)
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
