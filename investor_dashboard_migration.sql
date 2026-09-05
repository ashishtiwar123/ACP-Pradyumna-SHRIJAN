-- =============================================================================
-- INVESTOR DASHBOARD MIGRATION
-- This migration enhances the database structure for investor-focused analysis
-- =============================================================================

-- 1. DROP UPLOADS TABLE (not needed for local AI model approach)
-- =============================================================================
DROP TABLE IF EXISTS public.uploads CASCADE;

-- 2. ENHANCE ANALYSIS_RESULTS TABLE
-- =============================================================================
-- Add new columns to match the founder dashboard structure
ALTER TABLE public.analysis_results 
ADD COLUMN IF NOT EXISTS startup_name text,
ADD COLUMN IF NOT EXISTS financial_health_score integer CHECK (financial_health_score >= 0 AND financial_health_score <= 100),
ADD COLUMN IF NOT EXISTS growth_potential_score integer CHECK (growth_potential_score >= 0 AND growth_potential_score <= 100),
ADD COLUMN IF NOT EXISTS risk_assessment_score integer CHECK (risk_assessment_score >= 0 AND risk_assessment_score <= 100),
ADD COLUMN IF NOT EXISTS current_revenue numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS monthly_burn numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS runway_months integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS team_size integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS funding_ask numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS funding_probability_score integer CHECK (funding_probability_score >= 0 AND funding_probability_score <= 100),
ADD COLUMN IF NOT EXISTS business_overview jsonb,
ADD COLUMN IF NOT EXISTS funding_details jsonb,
ADD COLUMN IF NOT EXISTS investment_recommendation text,
ADD COLUMN IF NOT EXISTS comparable_companies jsonb,
ADD COLUMN IF NOT EXISTS market_analysis jsonb,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'completed' CHECK (status IN ('processing', 'completed', 'failed'));

-- Remove upload_id dependency since we're dropping uploads table
ALTER TABLE public.analysis_results DROP COLUMN IF EXISTS upload_id;

-- 3. ENHANCE ANALYSIS_LOGS TABLE  
-- =============================================================================
-- Update analysis_logs to serve as comprehensive history
ALTER TABLE public.analysis_logs
ADD COLUMN IF NOT EXISTS startup_name text,
ADD COLUMN IF NOT EXISTS overall_score integer CHECK (overall_score >= 0 AND overall_score <= 100),
ADD COLUMN IF NOT EXISTS analysis_type text DEFAULT 'pitch_deck',
ADD COLUMN IF NOT EXISTS status text DEFAULT 'completed' CHECK (status IN ('processing', 'completed', 'failed')),
ADD COLUMN IF NOT EXISTS file_name text,
ADD COLUMN IF NOT EXISTS analysis_result_id uuid,
ADD COLUMN IF NOT EXISTS processing_time_seconds integer;

-- Add foreign key to analysis_results
ALTER TABLE public.analysis_logs
ADD CONSTRAINT analysis_logs_result_fkey 
FOREIGN KEY (analysis_result_id) REFERENCES public.analysis_results(id) ON DELETE CASCADE;

-- 4. CREATE INDEXES FOR BETTER PERFORMANCE
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_analysis_results_user_created 
ON public.analysis_results(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analysis_results_startup_name 
ON public.analysis_results(startup_name);

CREATE INDEX IF NOT EXISTS idx_analysis_results_overall_score 
ON public.analysis_results(overall_score DESC);

CREATE INDEX IF NOT EXISTS idx_analysis_logs_user_created 
ON public.analysis_logs(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analysis_logs_status 
ON public.analysis_logs(status);

-- 5. UPDATE EXISTING DATA (if any)
-- =============================================================================
-- Set default values for existing records
UPDATE public.analysis_results 
SET 
  status = 'completed',
  financial_health_score = COALESCE(overall_score, 75),
  growth_potential_score = COALESCE(overall_score, 75),
  risk_assessment_score = COALESCE(overall_score, 75),
  funding_probability_score = COALESCE(overall_score, 75)
WHERE status IS NULL;

UPDATE public.analysis_logs 
SET 
  status = 'completed',
  analysis_type = 'pitch_deck'
WHERE status IS NULL;

-- 6. SAMPLE DATA STRUCTURE EXAMPLES (for reference)
-- =============================================================================
-- Business Overview JSON structure:
-- {
--   "company": "Startup Name",
--   "industry": "fintech",
--   "stage": "pre-seed",
--   "founded": 2023,
--   "description": "Brief description"
-- }

-- Funding Details JSON structure:
-- {
--   "funding_ask": 500000,
--   "use_of_funds": "Product development and team expansion",
--   "funding_probability": 65,
--   "runway_extension": 18,
--   "previous_funding": 0
-- }

-- Market Analysis JSON structure:
-- {
--   "tam": 12000000000,
--   "sam": 1200000000,
--   "som": 120000000,
--   "growth_rate": 23,
--   "market_maturity": "growing",
--   "competitive_landscape": "moderate"
-- }

-- Comparable Companies JSON structure:
-- {
--   "direct_competitors": ["Company A", "Company B"],
--   "indirect_competitors": ["Company C", "Company D"],
--   "competitive_advantages": ["Unique tech", "First mover"],
--   "market_position": "challenger"
-- }

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================
-- This migration:
-- 1. Removes uploads table (not needed for local AI)
-- 2. Enhances analysis_results with comprehensive investor metrics
-- 3. Updates analysis_logs to serve as analysis history
-- 4. Adds proper indexes for performance
-- 5. Includes data validation constraints
-- =============================================================================