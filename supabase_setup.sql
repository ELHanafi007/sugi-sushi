-- ==========================================
-- SUGI SUSHI — Ordering System Migration
-- ==========================================

-- 1. Create Restaurant Tables Registry
CREATE TABLE IF NOT EXISTS public.restaurant_tables (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 2,
    status TEXT NOT NULL DEFAULT 'empty',
    floor_zone TEXT,
    x_pos FLOAT,
    y_pos FLOAT,
    call_waiter BOOLEAN DEFAULT false,
    CONSTRAINT valid_status CHECK (status IN ('empty', 'seated', 'ordering', 'waiting', 'ready', 'delivered', 'billing'))
);

-- Enable RLS for restaurant_tables
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to prevent conflicts
DROP POLICY IF EXISTS "Public read access for tables" ON public.restaurant_tables;
DROP POLICY IF EXISTS "Staff full access to tables" ON public.restaurant_tables;

-- Allow public read access (needed for validating QR scans)
CREATE POLICY "Public read access for tables" 
    ON public.restaurant_tables FOR SELECT 
    USING (true);

-- Allow authenticated (staff/admin) all access
CREATE POLICY "Staff full access to tables" 
    ON public.restaurant_tables FOR ALL 
    USING (true)
    WITH CHECK (true);


-- 2. Create Sessions Table
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_id TEXT REFERENCES public.restaurant_tables(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    closed_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'active',
    CONSTRAINT valid_session_status CHECK (status IN ('active', 'closed'))
);

-- Enable RLS for sessions
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to prevent conflicts
DROP POLICY IF EXISTS "Public can create sessions" ON public.sessions;
DROP POLICY IF EXISTS "Public can view their session" ON public.sessions;
DROP POLICY IF EXISTS "Staff full access to sessions" ON public.sessions;

-- Allow public to insert (create session)
CREATE POLICY "Public can create sessions" 
    ON public.sessions FOR INSERT 
    WITH CHECK (true);

-- Allow public to read active sessions for their table
CREATE POLICY "Public can view their session" 
    ON public.sessions FOR SELECT 
    USING (true);

-- Allow staff all access
CREATE POLICY "Staff full access to sessions" 
    ON public.sessions FOR ALL 
    USING (true)
    WITH CHECK (true);


-- 3. Create/Modify Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_number TEXT NOT NULL,
    items JSONB NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'served', 'delivered', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Safely add columns to orders if they do not exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'session_id') THEN
        ALTER TABLE public.orders ADD COLUMN session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'general_note') THEN
        ALTER TABLE public.orders ADD COLUMN general_note TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'preparing_at') THEN
        ALTER TABLE public.orders ADD COLUMN preparing_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'ready_at') THEN
        ALTER TABLE public.orders ADD COLUMN ready_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'delivered_at') THEN
        ALTER TABLE public.orders ADD COLUMN delivered_at TIMESTAMPTZ;
    END IF;
END $$;

-- Enable RLS for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to prevent conflicts
DROP POLICY IF EXISTS "Allow public read access to orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public create access to orders" ON public.orders;
DROP POLICY IF EXISTS "Allow staff full access to orders" ON public.orders;

-- Allow public read access (to track order status)
CREATE POLICY "Allow public read access to orders" 
    ON public.orders FOR SELECT 
    USING (true);

-- Allow public to place orders
CREATE POLICY "Allow public create access to orders" 
    ON public.orders FOR INSERT 
    WITH CHECK (true);

-- Allow staff full access
CREATE POLICY "Allow staff full access to orders" 
    ON public.orders FOR ALL 
    USING (true)
    WITH CHECK (true);


-- 4. Enable Realtime Publications
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.restaurant_tables;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Table restaurant_tables already added to publication';
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Table orders already added to publication';
END $$;


-- 5. Seed Floor Plan Tables Data
INSERT INTO public.restaurant_tables (id, label, capacity, floor_zone, x_pos, y_pos)
VALUES 
    ('t01', 'Table 1', 2, 'Side Wall', 9.2, 17.5),
    ('t02', 'Table 2', 2, 'Side Wall', 9.2, 26.7),
    ('t03', 'Table 3', 2, 'Side Wall', 9.2, 41.0),
    ('t04', 'Table 4', 2, 'Side Wall', 9.2, 49.9),
    ('t05', 'Table 5', 2, 'Side Wall', 9.2, 63.9),
    ('t06', 'Table 6', 2, 'Side Wall', 9.2, 72.8),
    ('t07', 'Table 7', 2, 'Side Wall', 9.2, 84.7),
    ('t08', 'Table 8', 2, 'Reception', 23.3, 13.6),
    ('t09', 'Table 9', 4, 'Main Hall', 42.1, 8.8),
    ('t10', 'Table 10', 4, 'Main Hall', 56.4, 8.8),
    ('t11', 'Table 11', 4, 'Main Hall', 56.4, 35.8),
    ('t12', 'Table 12', 6, 'Window Booths', 82.9, 12.6),
    ('t13', 'Table 13', 6, 'Window Booths', 82.9, 37.3),
    ('t14', 'Table 14', 6, 'Window Booths', 82.9, 61.8),
    ('b01', 'Bar 1', 1, 'Sushi Bar', 30.5, 76.6),
    ('b02', 'Bar 2', 1, 'Sushi Bar', 36.5, 76.6),
    ('b03', 'Bar 3', 1, 'Sushi Bar', 42.5, 76.6),
    ('b04', 'Bar 4', 1, 'Sushi Bar', 48.5, 76.6),
    ('b05', 'Bar 5', 1, 'Sushi Bar', 54.5, 76.6),
    ('b06', 'Bar 6', 1, 'Sushi Bar', 60.5, 76.6),
    ('b07', 'Bar 7', 1, 'Sushi Bar', 66.5, 76.6)
ON CONFLICT (id) DO UPDATE SET
    label = EXCLUDED.label,
    capacity = EXCLUDED.capacity,
    floor_zone = EXCLUDED.floor_zone,
    x_pos = EXCLUDED.x_pos,
    y_pos = EXCLUDED.y_pos;
