-- ==========================================
-- IDMS - RLS PERMISSION FIX (Public Access for Demo)
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. Disable RLS on all tables to ensure the demo works without permission issues
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.industries DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.investment_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.employment_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.utilities_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.turnover_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.csr_activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.admin_notes DISABLE ROW LEVEL SECURITY;

-- 2. Drop any existing restrictive policies (optional but safe)
DROP POLICY IF EXISTS "Public Read Access" ON public.users;
DROP POLICY IF EXISTS "Public Read Access" ON public.industries;
DROP POLICY IF EXISTS "Public Read Access" ON public.investment_data;
DROP POLICY IF EXISTS "Public Read Access" ON public.employment_data;
DROP POLICY IF EXISTS "Public Read Access" ON public.utilities_data;
DROP POLICY IF EXISTS "Public Read Access" ON public.turnover_data;
DROP POLICY IF EXISTS "Public Read Access" ON public.csr_activities;
DROP POLICY IF EXISTS "Public Read Access" ON public.notifications;
DROP POLICY IF EXISTS "Public Read Access" ON public.admin_notes;

-- 3. Just as a backup, grant all permissions to anon/authenticated roles
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
