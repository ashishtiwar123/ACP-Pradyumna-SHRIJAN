-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-----------------------------------------------------
-- 1. PROFILES TABLE
-----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY,                               -- same as auth.users.id
  email text UNIQUE,
  full_name text,
  avatar_url text,
  phone text,
  country text,
  kyc_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT profiles_user_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

-- ✅ Ensure the "role" column exists (if migrating older table)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role text DEFAULT 'founder';

-- ✅ Drop any broken index first (just in case)
DROP INDEX IF EXISTS idx_profiles_role;

-- ✅ Now safely recreate the index
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-----------------------------------------------------
-- 2. STARTUP PROFILES TABLE
-----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.startup_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  startup_name text NOT NULL,
  industry text CHECK (industry IN ('healthcare', 'fintech', 'food', 'ecommerce')),
  stage text,
  description text,
  website text,
  founded_year integer,
  team_size integer,
  headquarters text,
  legal_entity_name text,
  incorporation_country text,
  contact_email text,
  contact_phone text,
  revenue_current_year numeric,
  monthly_burn numeric,
  runway_months integer,
  funding_ask numeric,
  funding_use text,
  is_complete boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT startup_profiles_user_fkey FOREIGN KEY (user_id)
    REFERENCES public.profiles(id) ON DELETE CASCADE
);

-----------------------------------------------------
-- 3. DOMAIN-SPECIFIC TABLES
-----------------------------------------------------

-- Healthcare
CREATE TABLE IF NOT EXISTS public.healthcare_details (
  startup_profile_id uuid PRIMARY KEY,
  regulatory_approvals text,
  clinical_stage text,
  target_patient_population text,
  reimbursement_strategy text,
  clinical_partners text,
  estimated_time_to_market_months integer,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT healthcare_details_fkey FOREIGN KEY (startup_profile_id)
    REFERENCES public.startup_profiles(id) ON DELETE CASCADE
);

-- Fintech
CREATE TABLE IF NOT EXISTS public.fintech_details (
  startup_profile_id uuid PRIMARY KEY,
  licencing_requirements text,
  payments_volume_30d numeric,
  kyc_process text,
  principal_markets text,
  integrations text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT fintech_details_fkey FOREIGN KEY (startup_profile_id)
    REFERENCES public.startup_profiles(id) ON DELETE CASCADE
);

-- Food
CREATE TABLE IF NOT EXISTS public.food_details (
  startup_profile_id uuid PRIMARY KEY,
  suppliers text,
  supply_chain_risks text,
  perishability_days integer,
  food_safety_certifications text,
  gross_margin_percent numeric,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT food_details_fkey FOREIGN KEY (startup_profile_id)
    REFERENCES public.startup_profiles(id) ON DELETE CASCADE
);

-- E-commerce
CREATE TABLE IF NOT EXISTS public.ecommerce_details (
  startup_profile_id uuid PRIMARY KEY,
  primary_channels text,
  average_order_value numeric,
  monthly_active_buyers integer,
  fulfillment_strategy text,
  return_rate_percent numeric,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT ecommerce_details_fkey FOREIGN KEY (startup_profile_id)
    REFERENCES public.startup_profiles(id) ON DELETE CASCADE
);

-----------------------------------------------------
-- 4. INVESTORS TABLE (merged with portfolio)
-----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.investors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  org_name text,
  investor_type text,
  preferred_industries text[],
  invested_startups uuid[],
  total_invested numeric DEFAULT 0,
  recent_activity jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT investors_profile_fkey FOREIGN KEY (profile_id)
    REFERENCES public.profiles(id) ON DELETE CASCADE
);

-----------------------------------------------------
-- 5. ANALYSIS LOGS TABLE (optional tracking)
-----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.analysis_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  startup_profile_id uuid,
  model_used text,
  request_summary text,
  response_summary text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT analysis_logs_user_fkey FOREIGN KEY (user_id)
    REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT analysis_logs_startup_fkey FOREIGN KEY (startup_profile_id)
    REFERENCES public.startup_profiles(id) ON DELETE SET NULL
);

-----------------------------------------------------
-- 6. ADDITIONAL INDEXES
-----------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_startup_industry
  ON public.startup_profiles(industry);

CREATE INDEX IF NOT EXISTS idx_investor_industries
  ON public.investors USING gin (preferred_industries);

CREATE INDEX IF NOT EXISTS idx_analysis_logs_created_at
  ON public.analysis_logs(created_at DESC);
