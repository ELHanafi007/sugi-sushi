-- Run this in Supabase Dashboard > SQL Editor

-- Create reservations table
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

-- Create auto-incrementing code trigger
CREATE SEQUENCE IF NOT EXISTS reservation_code_seq START 1;

-- Disable RLS for now (you can enable it later with proper policies)
ALTER TABLE reservations DISABLE ROW LEVEL SECURITY;

-- Function to generate reservation code
CREATE OR REPLACE FUNCTION generate_reservation_code()
RETURNS TEXT AS $$
BEGIN
  RETURN '#' || LPAD(CAST(nextval('reservation_code_seq') AS TEXT), 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Test the table
-- INSERT INTO reservations (code, name, phone, date, time, guests) 
-- VALUES (generate_reservation_code(), 'Test', '0500000000', '2026-05-01', '19:00', 2);

-- Drop test if exists
DELETE FROM reservations WHERE name = 'Test';