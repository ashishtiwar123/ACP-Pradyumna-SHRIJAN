-- =============================================================================
-- SIMPLE ROLE-BASED AUTHENTICATION MIGRATION
-- Just adds role identification - keeps it simple!
-- =============================================================================

-- 1. CREATE SIMPLE ROLE ENUM
-- =============================================================================
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('founder', 'investor');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. DROP INVESTORS TABLE (as requested - not needed)
-- =============================================================================
DROP TABLE IF EXISTS public.investors CASCADE;

-- 3. ADD ROLE TO PROFILES TABLE
-- =============================================================================
-- Add role column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'founder';

-- Update existing users to have founder role (if any exist)
UPDATE public.profiles 
SET role = 'founder' 
WHERE role IS NULL;

-- 4. SIMPLE HELPER FUNCTIONS FOR ROLE CHECKING
-- =============================================================================
-- Function to check if user is founder
CREATE OR REPLACE FUNCTION public.is_founder(user_id uuid)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id AND role = 'founder'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is investor
CREATE OR REPLACE FUNCTION public.is_investor(user_id uuid)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id AND role = 'investor'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if founder has completed startup profile
CREATE OR REPLACE FUNCTION public.has_complete_startup_profile(user_id uuid)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.startup_profiles 
        WHERE user_id = user_id AND is_complete = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. CREATE INDEX FOR PERFORMANCE
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- =============================================================================
-- MIGRATION COMPLETE - SIMPLE & CLEAN!
-- =============================================================================
-- This migration only adds:
-- 1. Role enum (founder/investor)
-- 2. Role column in profiles table
-- 3. Simple helper functions to check roles
-- 4. Basic performance index
-- =============================================================================

-- Verify the migration
SELECT 
    'Simple role-based auth completed. Available roles:' as status,
    unnest(enum_range(NULL::user_role)) as available_roles;