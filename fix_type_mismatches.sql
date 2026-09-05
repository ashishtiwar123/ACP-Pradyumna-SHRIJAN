-- Fix type mismatches between form fields and database schema
-- This script corrects data types to match your actual schema

-- Fix startup_profiles table type mismatches
-- 1. contact_phone should be numeric (not text)
ALTER TABLE public.startup_profiles 
ALTER COLUMN contact_phone TYPE numeric USING contact_phone::numeric;

-- 2. funding_use should be text (not numeric) - this field describes how funds will be used
ALTER TABLE public.startup_profiles 
ALTER COLUMN funding_use TYPE text;

-- 3. Update industry constraint to match actual schema values
ALTER TABLE public.startup_profiles 
DROP CONSTRAINT IF EXISTS startup_profiles_industry_check;

ALTER TABLE public.startup_profiles 
ADD CONSTRAINT startup_profiles_industry_check 
CHECK (industry IN ('healthcare', 'fintech', 'food', 'ecommerce'));

-- The domain-specific tables already have correct types in your schema:
-- - healthcare_details: All text fields except estimated_time_to_market_months (integer) ✓
-- - fintech_details: All text fields except payments_volume_30d (numeric) ✓  
-- - food_details: All text fields except perishability_days (integer) and gross_margin_percent (numeric) ✓
-- - ecommerce_details: All correct types with numeric and integer fields ✓

-- Ensure all tables exist and have correct structure matching your schema
-- Healthcare details table
CREATE TABLE IF NOT EXISTS public.healthcare_details (
  startup_profile_id uuid NOT NULL,
  regulatory_approvals text,
  clinical_stage text,
  target_patient_population text,
  reimbursement_strategy text,
  clinical_partners text,
  estimated_time_to_market_months integer,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT healthcare_details_pkey PRIMARY KEY (startup_profile_id),
  CONSTRAINT healthcare_details_fkey FOREIGN KEY (startup_profile_id) REFERENCES public.startup_profiles(id)
);

-- Fintech details table  
CREATE TABLE IF NOT EXISTS public.fintech_details (
  startup_profile_id uuid NOT NULL,
  licencing_requirements text,
  payments_volume_30d numeric,
  kyc_process text,
  principal_markets text,
  integrations text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT fintech_details_pkey PRIMARY KEY (startup_profile_id),
  CONSTRAINT fintech_details_fkey FOREIGN KEY (startup_profile_id) REFERENCES public.startup_profiles(id)
);

-- Food details table
CREATE TABLE IF NOT EXISTS public.food_details (
  startup_profile_id uuid NOT NULL,
  suppliers text,
  supply_chain_risks text,
  perishability_days integer,
  food_safety_certifications text,
  gross_margin_percent numeric,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT food_details_pkey PRIMARY KEY (startup_profile_id),
  CONSTRAINT food_details_fkey FOREIGN KEY (startup_profile_id) REFERENCES public.startup_profiles(id)
);

-- Ecommerce details table
CREATE TABLE IF NOT EXISTS public.ecommerce_details (
  startup_profile_id uuid NOT NULL,
  primary_channels text,
  average_order_value numeric,
  monthly_active_buyers integer,
  fulfillment_strategy text,
  return_rate_percent numeric,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ecommerce_details_pkey PRIMARY KEY (startup_profile_id),
  CONSTRAINT ecommerce_details_fkey FOREIGN KEY (startup_profile_id) REFERENCES public.startup_profiles(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_startup_profiles_industry ON public.startup_profiles(industry);
CREATE INDEX IF NOT EXISTS idx_startup_profiles_user_id ON public.startup_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_healthcare_details_startup_profile_id ON public.healthcare_details(startup_profile_id);
CREATE INDEX IF NOT EXISTS idx_fintech_details_startup_profile_id ON public.fintech_details(startup_profile_id);
CREATE INDEX IF NOT EXISTS idx_food_details_startup_profile_id ON public.food_details(startup_profile_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_details_startup_profile_id ON public.ecommerce_details(startup_profile_id);

-- Enable RLS on all domain-specific tables
ALTER TABLE public.healthcare_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fintech_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecommerce_details ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies for all domain tables
-- Healthcare details policies
DROP POLICY IF EXISTS "Users can manage their own healthcare details" ON public.healthcare_details;
CREATE POLICY "Users can manage their own healthcare details"
  ON public.healthcare_details
  USING (
    startup_profile_id IN (
      SELECT id FROM public.startup_profiles WHERE user_id = auth.uid()
    )
  );

-- Fintech details policies
DROP POLICY IF EXISTS "Users can manage their own fintech details" ON public.fintech_details;
CREATE POLICY "Users can manage their own fintech details"
  ON public.fintech_details
  USING (
    startup_profile_id IN (
      SELECT id FROM public.startup_profiles WHERE user_id = auth.uid()
    )
  );

-- Food details policies
DROP POLICY IF EXISTS "Users can manage their own food details" ON public.food_details;
CREATE POLICY "Users can manage their own food details"
  ON public.food_details
  USING (
    startup_profile_id IN (
      SELECT id FROM public.startup_profiles WHERE user_id = auth.uid()
    )
  );

-- Ecommerce details policies
DROP POLICY IF EXISTS "Users can manage their own ecommerce details" ON public.ecommerce_details;
CREATE POLICY "Users can manage their own ecommerce details"
  ON public.ecommerce_details
  USING (
    startup_profile_id IN (
      SELECT id FROM public.startup_profiles WHERE user_id = auth.uid()
    )
  );

-- Clean up any inconsistent data (convert empty strings to nulls for numeric fields)
UPDATE public.startup_profiles 
SET contact_phone = NULL 
WHERE contact_phone::text = '' OR contact_phone::text = '0';

-- funding_use is text field, no cleanup needed

UPDATE public.fintech_details 
SET payments_volume_30d = NULL 
WHERE payments_volume_30d::text = '' OR payments_volume_30d::text = '0';

UPDATE public.food_details 
SET perishability_days = NULL 
WHERE perishability_days::text = '' OR perishability_days::text = '0';

UPDATE public.food_details 
SET gross_margin_percent = NULL 
WHERE gross_margin_percent::text = '' OR gross_margin_percent::text = '0';

UPDATE public.ecommerce_details 
SET average_order_value = NULL 
WHERE average_order_value::text = '' OR average_order_value::text = '0';

UPDATE public.ecommerce_details 
SET monthly_active_buyers = NULL 
WHERE monthly_active_buyers::text = '' OR monthly_active_buyers::text = '0';

UPDATE public.ecommerce_details 
SET return_rate_percent = NULL 
WHERE return_rate_percent::text = '' OR return_rate_percent::text = '0';