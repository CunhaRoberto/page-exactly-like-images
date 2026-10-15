-- Memory Cream back-office: leads, pagamentos, contratos e configurações

CREATE TABLE public.mc_leads (
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
  preferred_flavors JSONB NOT NULL DEFAULT '[]'::jsonb,
  vegan_requested BOOLEAN NOT NULL DEFAULT false,
  received_at TEXT NOT NULL,
  avatar_text TEXT NOT NULL,
  avatar_color TEXT NOT NULL,
  checklist JSONB NOT NULL DEFAULT '{"dataAgenda":false,"logistica":false,"propostaEnviada":false,"degustacao":false}'::jsonb,
  proposal_amount NUMERIC,
  position INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.mc_payments (
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
  position INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.mc_contracts (
  id TEXT PRIMARY KEY,
  contract_code TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_short TEXT NOT NULL,
  client_cpf TEXT,
  client_rg TEXT,
  client_address TEXT,
  event_type TEXT NOT NULL,
  event_date TEXT NOT NULL,
  event_location TEXT NOT NULL,
  model TEXT NOT NULL,
  hours INTEGER NOT NULL DEFAULT 4,
  total_value NUMERIC NOT NULL DEFAULT 0,
  signal_value NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  badge_class TEXT,
  badge_text TEXT,
  signed_by_contractor BOOLEAN NOT NULL DEFAULT false,
  contractor_sign_date TEXT,
  contractor_name TEXT,
  client_signed BOOLEAN NOT NULL DEFAULT false,
  client_sign_date TEXT,
  client_ip TEXT,
  security_hash TEXT,
  valid_days INTEGER NOT NULL DEFAULT 5,
  flavors_desc TEXT,
  channel_desc TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.mc_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.mc_leads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mc_leads TO authenticated;
GRANT ALL ON public.mc_leads TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.mc_payments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mc_payments TO authenticated;
GRANT ALL ON public.mc_payments TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.mc_contracts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mc_contracts TO authenticated;
GRANT ALL ON public.mc_contracts TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.mc_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mc_settings TO authenticated;
GRANT ALL ON public.mc_settings TO service_role;

ALTER TABLE public.mc_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mc_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mc_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mc_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_full_access" ON public.mc_leads FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "payments_full_access" ON public.mc_payments FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "contracts_full_access" ON public.mc_contracts FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "settings_full_access" ON public.mc_settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);