-- Location: supabase/migrations/20260113153732_fix_multiple_rls_policies_conflict.sql
-- Schema Analysis: course_modules and course_lessons tables exist with multiple conflicting RLS policies
-- Integration Type: Destructive (dropping all policies) + Additive (creating single clean policy per table)
-- Dependencies: course_modules, course_lessons tables (existing)

-- ============================================================================
-- STEP 1: DROP ALL EXISTING RLS POLICIES ON COURSE_MODULES
-- ============================================================================

-- Drop all policies on course_modules table
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'course_modules'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.course_modules', policy_record.policyname);
    END LOOP;
END $$;

-- ============================================================================
-- STEP 2: DROP ALL EXISTING RLS POLICIES ON COURSE_LESSONS
-- ============================================================================

-- Drop all policies on course_lessons table
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'course_lessons'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.course_lessons', policy_record.policyname);
    END LOOP;
END $$;

-- ============================================================================
-- STEP 3: CREATE ONE SINGLE CLEAN POLICY FOR COURSE_MODULES
-- ============================================================================

-- Create single policy for course_modules - authenticated users get full access
CREATE POLICY "authenticated_users_full_access_course_modules"
ON public.course_modules
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================================================
-- STEP 4: CREATE ONE SINGLE CLEAN POLICY FOR COURSE_LESSONS
-- ============================================================================

-- Create single policy for course_lessons - authenticated users get full access
CREATE POLICY "authenticated_users_full_access_course_lessons"
ON public.course_lessons
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Result: All conflicting policies removed, ONE clean policy per table
-- Access: Authenticated users have SELECT, INSERT, UPDATE, DELETE on both tables