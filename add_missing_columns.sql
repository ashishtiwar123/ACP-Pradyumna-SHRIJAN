-- Add missing columns to startup_profiles and domain-specific tables
-- This script adds columns if they don't already exist

-- Add missing columns to startup_profiles table
ALTER TABLE public.startup_profiles 
ADD COLUMN IF NOT EXISTS headquarters text,
ADD COLUMN IF NOT EXISTS legal_entity_name text,
ADD COLUMN IF NOT EXISTS incorporation_country text,
ADD COLUMN IF NOT EXISTS contact_email text,
ADD COLUMN IF NOT EXISTS contact_phone text,
ADD COLUMN IF NOT EXISTS revenue_current_year numeric,
ADD COLUMN IF NOT EXISTS monthly_burn numeric,
ADD COLUMN IF NOT EXISTS runway_months integer,
ADD COLUMN IF NOT EXISTS funding_ask numeric,
ADD COLUMN IF NOT EXISTS funding_use text;

-- Add missing columns to profiles table (from schema but not in types)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS kyc_completed boolean DEFAULT false;

-- Create healthcare_details table if it doesn't exist (with all columns)
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

-- Create fintech_details table if it doesn't exist (with all columns)
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

-- Create food_details table if it doesn't exist (with all columns)
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

-- Create ecommerce_details table if it doesn't exist (with all columns)
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

-- Update the industry column constraint to match form options
ALTER TABLE public.startup_profiles 
DROP CONSTRAINT IF EXISTS startup_profiles_industry_check;

ALTER TABLE public.startup_profiles 
ADD CONSTRAINT startup_profiles_industry_check 
CHECK (industry IN ('healthcare', 'fintech', 'food', 'ecommerce'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_startup_profiles_industry ON public.startup_profiles(industry);
CREATE INDEX IF NOT EXISTS idx_startup_profiles_user_id ON public.startup_profiles(user_id);

-- Add any missing RLS policies
-- Enable RLS on domain-specific tables if not already enabled
ALTER TABLE public.healthcare_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fintech_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecommerce_details ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for domain-specific tables
-- Healthcare details policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'healthcare_details' 
        AND policyname = 'Users can view their own healthcare details'
    ) THEN
        CREATE POLICY "Users can view their own healthcare details"
          ON public.healthcare_details FOR SELECT
          USING (
            startup_profile_id IN (
              SELECT id FROM public.startup_profiles WHERE user_id = auth.uid()
            )
          );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'healthcare_details' 
        AND policyname = 'Users can insert their own healthcare details'
    ) THEN
        CREATE POLICY "Users can insert their own healthcare details"
          ON public.healthcare_details FOR INSERT
          WITH CHECK (
            startup_profile_id IN (
              SELECT id FROM public.startup_profiles WHERE user_id = auth.uid()
            )
          );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'healthcare_details' 
        AND policyname = 'Users can update their own healthcare details'
    ) THEN
        CREATE POLICY "Users can update their own healthcare details"
          ON public.healthcare_details FOR UPDATE
          USING (
            startup_profile_id IN (
              SELECT id FROM public.startup_profiles WHERE user_id = auth.uid()
            )
          );
    END IF;
END $$;

-- Fintech details policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'fintech_details' 
        AND policyname = 'Users can view their own fintech details'
    ) THEN
        CREATE POLICY "Users can view their own fintech details"
          ON public.fintech_details FOR SELECT
          USING (
            startup_profile_id IN (
              SELECT id FROM public.startup_profiles WHERE user_id = auth.uid()
            )
          );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'fintech_details' 
        AND policyname = 'Users can insert their own fintech details'
    ) THEN
        CREATE POLICY "Users can insert their own fintech details"
          ON public.fintech_details FOR INSERT
          WITH CHECK (
            startup_profile_id IN (
              SELECT id FROM public.startup_profiles WHERE user_id = auth.uid()
            )
          );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'fintech_details' 
        AND policyname = 'Users can update their own fintech details'
    ) THEN
        CREATE POLICY "Users can update their own fintech details"
          ON public.fintech_details FOR UPDATE
          USING (
            startup_profile_id IN (
              SELECT id FROM public.startup_profiles WHERE user_id = auth.uid()
            )
          );
    END IF;
END $$;

-- Food details policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'food_details' 
        AND policyname = 'Users can view their own food details'
    ) THEN
        CREATE POLICY "Users can view their own food details"
          ON public.food_details FOR SELECT
          USING (
            startup_profile_id IN (
              SELECT id FROM public.startup_profiles WHERE user_id = auth.uid()
            )
          );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'food_details' 
        AND policyname = 'Users can insert their own food details'
    ) THEN
        CREATE POLICY "Users can insert their own food details"
          ON public.food_details FOR INSERT
          WITH CHECK (
            startup_profile_id IN (
              SELECT id FROM public.startup_profiles WHERE user_id = auth.uid()
            )
          );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'food_details' 
        AND policyname = 'Users can update their own food details'
    ) THEN
        CREATE POLICY "Users can update their own food details"
          ON public.food_details FOR UPDATE
          USING (
            startup_profile_id IN (
              SELECT id FROM public.startup_profiles WHERE user_id = auth.uid()
            )
          );
    END IF;
END $$;

-- Ecommerce details policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'ecommerce_details' 
        AND policyname = 'Users can view their own ecommerce details'
    ) THEN
        CREATE POLICY "Users can view their own ecommerce details"
          ON public.ecommerce_details FOR SELECT
          USING (
            startup_profile_id IN (
              SELECT id FROM public.startup_profiles WHERE user_id = auth.uid()
            )
          );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'ecommerce_details' 
        AND policyname = 'Users can insert their own ecommerce details'
    ) THEN
        CREATE POLICY "Users can insert their own ecommerce details"
          ON public.ecommerce_details FOR INSERT
          WITH CHECK (
            startup_profile_id IN (
              SELECT id FROM public.startup_profiles WHERE user_id = auth.uid()
            )
          );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'ecommerce_details' 
        AND policyname = 'Users can update their own ecommerce details'
    ) THEN
        CREATE POLICY "Users can update their own ecommerce details"
          ON public.ecommerce_details FOR UPDATE
          USING (
            startup_profile_id IN (
              SELECT id FROM public.startup_profiles WHERE user_id = auth.uid()
            )
          );
    END IF;
END $$;