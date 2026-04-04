-- STEP 1: Create Tables
-- users table linked to Supabase Auth
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT,
  position TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'viewer'))
);

-- items table for inventory
CREATE TABLE public.items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('Finished Good', 'Raw Material'))
);

-- stock_movements table
CREATE TABLE public.stock_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('IN', 'OUT')),
  reason TEXT,
  note TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES public.users(id)
);

-- production_logs table
CREATE TABLE public.production_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bottle_type TEXT NOT NULL CHECK (bottle_type IN ('500ml', '330ml')),
  quantity INTEGER NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  action_type TEXT NOT NULL CHECK (action_type IN ('add', 'replace')),
  user_id UUID REFERENCES public.users(id)
);

-- STEP 2: Row Level Security (RLS)
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_logs ENABLE ROW LEVEL SECURITY;

-- Create policies so ONLY authenticated users can read/write.
-- Users table policies
CREATE POLICY "Allow authenticated full access to users" ON public.users FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Items table policies
CREATE POLICY "Allow authenticated full access to items" ON public.items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Stock movements policies
CREATE POLICY "Allow authenticated full access to stock_movements" ON public.stock_movements FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Production logs policies
CREATE POLICY "Allow authenticated full access to production_logs" ON public.production_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- STEP 3: Seed 'items' table with Critical Data
INSERT INTO public.items (name, category) VALUES
  ('500ml Bottles', 'Finished Good'),
  ('330ml Bottles', 'Finished Good'),
  ('Preforms 500ml', 'Raw Material'),
  ('Preforms 330ml', 'Raw Material'),
  ('Shrinkwrap', 'Raw Material'),
  ('Caps', 'Raw Material'),
  ('Labels', 'Raw Material');
