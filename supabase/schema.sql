-- ==========================================
-- INDUSTRIAL DATA MANAGEMENT SYSTEM (IDMS)
-- Supabase PostgreSQL Schema
-- ==========================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Extends Supabase Auth)
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'industry')),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Industries Table
CREATE TABLE industries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    plot_number TEXT,
    sector TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    phone TEXT,
    email TEXT NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Active', 'Inactive', 'Pending')),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Investment Data Table
CREATE TABLE investment_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    industry_id UUID REFERENCES industries(id) ON DELETE CASCADE NOT NULL,
    year INTEGER NOT NULL,
    initial_investment NUMERIC NOT NULL DEFAULT 0,
    additional_investment NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(industry_id, year)
);

-- 4. Employment Data Table
CREATE TABLE employment_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    industry_id UUID REFERENCES industries(id) ON DELETE CASCADE NOT NULL,
    year INTEGER NOT NULL,
    permanent_employees INTEGER NOT NULL DEFAULT 0,
    contract_employees INTEGER NOT NULL DEFAULT 0,
    male_employees INTEGER DEFAULT 0,
    female_employees INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(industry_id, year)
);

-- 5. Utilities Data Table
CREATE TABLE utilities_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    industry_id UUID REFERENCES industries(id) ON DELETE CASCADE NOT NULL,
    year INTEGER NOT NULL,
    water_consumption NUMERIC NOT NULL DEFAULT 0, -- in KL
    power_consumption NUMERIC NOT NULL DEFAULT 0, -- in kWh
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(industry_id, year)
);

-- 6. Turnover & Performance Data Table
CREATE TABLE turnover_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    industry_id UUID REFERENCES industries(id) ON DELETE CASCADE NOT NULL,
    year INTEGER NOT NULL,
    annual_turnover NUMERIC NOT NULL DEFAULT 0,
    production_capacity NUMERIC CHECK (production_capacity >= 0 AND production_capacity <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(industry_id, year)
);

-- 7. CSR Activities Table
CREATE TABLE csr_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    industry_id UUID REFERENCES industries(id) ON DELETE CASCADE NOT NULL,
    year INTEGER NOT NULL,
    description TEXT NOT NULL,
    expenditure NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('reminder', 'alert', 'success', 'info')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Admin Notes Table
CREATE TABLE admin_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    industry_id UUID REFERENCES industries(id) ON DELETE CASCADE NOT NULL,
    admin_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    note_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE employment_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE utilities_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE turnover_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE csr_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notes ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
-- (Assuming we create a function is_admin() that checks auth.uid() role in users table)

/* 
Example Policy for Industry Users:
CREATE POLICY "Industry users can view their own profile" ON industries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Industry users can insert their own data" ON investment_data
    FOR INSERT WITH CHECK (industry_id IN (SELECT id FROM industries WHERE user_id = auth.uid()));
*/

-- ==========================================
-- TRIGGERS
-- ==========================================

-- Function to update 'last_updated_at' on industries table
CREATE OR REPLACE FUNCTION update_industry_last_updated()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE industries SET last_updated_at = NOW() WHERE id = NEW.industry_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all data tables
CREATE TRIGGER trigger_update_inv AFTER INSERT OR UPDATE ON investment_data FOR EACH ROW EXECUTE FUNCTION update_industry_last_updated();
CREATE TRIGGER trigger_update_emp AFTER INSERT OR UPDATE ON employment_data FOR EACH ROW EXECUTE FUNCTION update_industry_last_updated();
CREATE TRIGGER trigger_update_util AFTER INSERT OR UPDATE ON utilities_data FOR EACH ROW EXECUTE FUNCTION update_industry_last_updated();
CREATE TRIGGER trigger_update_turn AFTER INSERT OR UPDATE ON turnover_data FOR EACH ROW EXECUTE FUNCTION update_industry_last_updated();
CREATE TRIGGER trigger_update_csr AFTER INSERT OR UPDATE ON csr_activities FOR EACH ROW EXECUTE FUNCTION update_industry_last_updated();
