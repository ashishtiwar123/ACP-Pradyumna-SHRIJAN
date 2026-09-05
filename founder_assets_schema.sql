-- Founder Assets Table Schema
-- This table stores detailed financial and asset information for startup founders

CREATE TABLE IF NOT EXISTS public.founder_assets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  
  -- Personal Financial Information
  personal_net_worth numeric,
  liquid_assets numeric,
  personal_annual_income numeric,
  credit_score integer,
  
  -- Investment Portfolio
  stock_investments numeric DEFAULT 0,
  crypto_investments numeric DEFAULT 0,
  real_estate_investments numeric DEFAULT 0,
  other_investments numeric DEFAULT 0,
  total_investment_portfolio numeric GENERATED ALWAYS AS (
    COALESCE(stock_investments, 0) + 
    COALESCE(crypto_investments, 0) + 
    COALESCE(real_estate_investments, 0) + 
    COALESCE(other_investments, 0)
  ) STORED,
  
  -- Real Estate Assets
  primary_residence_value numeric,
  investment_properties_value numeric,
  total_real_estate_debt numeric,
  
  -- Business Assets & Equity
  previous_startup_exits numeric DEFAULT 0,
  current_business_equity_value numeric,
  intellectual_property_value numeric,
  business_assets_description text,
  
  -- Financial Commitments
  personal_debt numeric DEFAULT 0,
  monthly_personal_expenses numeric,
  dependents_count integer DEFAULT 0,
  
  -- Funding & Investment Details
  personal_funds_committed_to_startup numeric,
  previous_funding_raised numeric DEFAULT 0,
  investor_connections text, -- JSON array of investor names/firms
  board_memberships text, -- Companies where founder serves on board
  
  -- Professional Assets
  industry_experience_years integer,
  previous_companies text, -- Previous work experience
  professional_network_value text, -- Description of network strength
  advisory_roles text, -- Current advisory positions
  
  -- Additional Information
  insurance_coverage_amount numeric,
  retirement_savings numeric,
  emergency_fund_months integer,
  risk_tolerance text CHECK (risk_tolerance IN ('low', 'medium', 'high')),
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  -- Constraints
  CONSTRAINT founder_assets_pkey PRIMARY KEY (id),
  CONSTRAINT founder_assets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT founder_assets_user_id_unique UNIQUE (user_id),
  
  -- Check constraints for data validation
  CONSTRAINT check_credit_score CHECK (credit_score IS NULL OR (credit_score >= 300 AND credit_score <= 850)),
  CONSTRAINT check_dependents CHECK (dependents_count >= 0),
  CONSTRAINT check_experience CHECK (industry_experience_years IS NULL OR industry_experience_years >= 0),
  CONSTRAINT check_emergency_fund CHECK (emergency_fund_months IS NULL OR emergency_fund_months >= 0)
);

-- Enable Row Level Security
ALTER TABLE public.founder_assets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own founder assets"
  ON public.founder_assets FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own founder assets"
  ON public.founder_assets FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own founder assets"
  ON public.founder_assets FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own founder assets"
  ON public.founder_assets FOR DELETE
  USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_founder_assets_user_id ON public.founder_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_founder_assets_created_at ON public.founder_assets(created_at);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_founder_assets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER founder_assets_updated_at
  BEFORE UPDATE ON public.founder_assets
  FOR EACH ROW
  EXECUTE FUNCTION update_founder_assets_updated_at();

-- Comments for documentation
COMMENT ON TABLE public.founder_assets IS 'Stores comprehensive financial and asset information for startup founders';
COMMENT ON COLUMN public.founder_assets.total_investment_portfolio IS 'Computed column: sum of all investment categories';
COMMENT ON COLUMN public.founder_assets.investor_connections IS 'JSON text field storing investor names and firms';
COMMENT ON COLUMN public.founder_assets.board_memberships IS 'Companies where founder serves on board';