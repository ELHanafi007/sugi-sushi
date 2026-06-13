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
    ('l01', 'L01', 2, 'Side Wall', 9.2, 17.5),
    ('l02', 'L02', 2, 'Side Wall', 9.2, 26.7),
    ('l03', 'L03', 2, 'Side Wall', 9.2, 41.0),
    ('l04', 'L04', 2, 'Side Wall', 9.2, 49.9),
    ('l05', 'L05', 2, 'Side Wall', 9.2, 63.9),
    ('l06', 'L06', 2, 'Side Wall', 9.2, 72.8),
    ('l07', 'L07', 2, 'Side Wall', 9.2, 84.7),
    ('m01', 'M01', 4, 'Main Hall', 42.1, 8.8),
    ('m02', 'M02', 4, 'Main Hall', 56.4, 8.8),
    ('m03', 'M03', 4, 'Main Hall', 56.4, 35.8),
    ('m04', 'M04', 4, 'Main Hall', 29.3, 56.3),
    ('m05', 'M05', 4, 'Main Hall', 57.1, 56.3),
    ('w01', 'W01', 6, 'Window Booths', 82.9, 12.6),
    ('w02', 'W02', 6, 'Window Booths', 82.9, 37.3),
    ('w03', 'W03', 6, 'Window Booths', 82.9, 61.8),
    ('b01', 'B01', 6, 'Sushi Bar', 35.2, 76.6),
    ('b02', 'B02', 6, 'Sushi Bar', 51.8, 76.6),
    ('r01', 'R01', 2, 'Reception', 23.3, 13.6)
ON CONFLICT (id) DO UPDATE SET
    label = EXCLUDED.label,
    capacity = EXCLUDED.capacity,
    floor_zone = EXCLUDED.floor_zone,
    x_pos = EXCLUDED.x_pos,
    y_pos = EXCLUDED.y_pos;
