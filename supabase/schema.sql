-- Schema para Memory Cream Back-Office & Eventos

-- 1. Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
    lead_code TEXT NOT NULL,
    name TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_date TEXT NOT NULL,
    guest_count INTEGER NOT NULL DEFAULT 100,
    location TEXT NOT NULL,
    city TEXT NOT NULL,
    structure TEXT NOT NULL,
    status TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    notes TEXT,
    preferred_flavors JSONB DEFAULT '[]'::jsonb,
    vegan_requested BOOLEAN DEFAULT false,
    received_at TEXT NOT NULL,
    avatar_text TEXT NOT NULL,
    avatar_color TEXT NOT NULL,
    checklist JSONB DEFAULT '{"dataAgenda":false,"logistica":false,"propostaEnviada":false,"degustacao":false}'::jsonb,
    proposal_amount NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_initials TEXT NOT NULL,
    client_color TEXT NOT NULL,
    event_name TEXT NOT NULL,
    event_date TEXT NOT NULL,
    package_type TEXT NOT NULL,
    total_value NUMERIC NOT NULL DEFAULT 0,
    signal_desc TEXT NOT NULL,
    signal_status_desc TEXT NOT NULL,
    balance_value NUMERIC NOT NULL DEFAULT 0,
    balance_due_date TEXT NOT NULL,
    liquidation_status TEXT NOT NULL,
    method TEXT NOT NULL,
    category TEXT NOT NULL,
    auth_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Contracts Table
CREATE TABLE IF NOT EXISTS public.contracts (
    id TEXT PRIMARY KEY,
    contract_code TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_short TEXT NOT NULL,
    client_cpf TEXT NOT NULL,
    client_rg TEXT NOT NULL,
    client_address TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_date TEXT NOT NULL,
    event_location TEXT NOT NULL,
    model TEXT NOT NULL,
    hours INTEGER NOT NULL DEFAULT 4,
    total_value NUMERIC NOT NULL DEFAULT 0,
    signal_value NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL,
    badge_class TEXT NOT NULL,
    badge_text TEXT NOT NULL,
    signed_by_contractor BOOLEAN NOT NULL DEFAULT true,
    contractor_sign_date TEXT NOT NULL,
    contractor_name TEXT NOT NULL,
    client_signed BOOLEAN NOT NULL DEFAULT false,
    client_sign_date TEXT,
    client_ip TEXT,
    security_hash TEXT NOT NULL,
    valid_days INTEGER NOT NULL DEFAULT 5,
    flavors_desc TEXT NOT NULL,
    channel_desc TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    company_name TEXT NOT NULL,
    cnpj TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    bike_price NUMERIC NOT NULL DEFAULT 3200,
    station_price NUMERIC NOT NULL DEFAULT 2400,
    extra_hour_price NUMERIC NOT NULL DEFAULT 380,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Drop policies if exists to allow rerun
DROP POLICY IF EXISTS "Allow public read leads" ON public.leads;
DROP POLICY IF EXISTS "Allow public insert leads" ON public.leads;
DROP POLICY IF EXISTS "Allow public update leads" ON public.leads;
DROP POLICY IF EXISTS "Allow public delete leads" ON public.leads;

CREATE POLICY "Allow public read leads" ON public.leads FOR SELECT USING (true);
CREATE POLICY "Allow public insert leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update leads" ON public.leads FOR UPDATE USING (true);
CREATE POLICY "Allow public delete leads" ON public.leads FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public read payments" ON public.payments;
DROP POLICY IF EXISTS "Allow public insert payments" ON public.payments;
DROP POLICY IF EXISTS "Allow public update payments" ON public.payments;
DROP POLICY IF EXISTS "Allow public delete payments" ON public.payments;

CREATE POLICY "Allow public read payments" ON public.payments FOR SELECT USING (true);
CREATE POLICY "Allow public insert payments" ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update payments" ON public.payments FOR UPDATE USING (true);
CREATE POLICY "Allow public delete payments" ON public.payments FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public read contracts" ON public.contracts;
DROP POLICY IF EXISTS "Allow public insert contracts" ON public.contracts;
DROP POLICY IF EXISTS "Allow public update contracts" ON public.contracts;
DROP POLICY IF EXISTS "Allow public delete contracts" ON public.contracts;

CREATE POLICY "Allow public read contracts" ON public.contracts FOR SELECT USING (true);
CREATE POLICY "Allow public insert contracts" ON public.contracts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update contracts" ON public.contracts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete contracts" ON public.contracts FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public read settings" ON public.settings;
DROP POLICY IF EXISTS "Allow public insert settings" ON public.settings;
DROP POLICY IF EXISTS "Allow public update settings" ON public.settings;

CREATE POLICY "Allow public read settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert settings" ON public.settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update settings" ON public.settings FOR UPDATE USING (true);

-- Enable Realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contracts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.settings;
