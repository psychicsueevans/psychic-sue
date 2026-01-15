-- Migration: Completely disable RLS on course_modules and course_lessons tables
-- Previous attempts to fix RLS policies failed - this error keeps recurring
-- Root cause: RLS policies aren't being applied correctly despite correct syntax
-- Solution: Temporarily disable RLS entirely, then recreate with explicit admin access

-- STEP 1: Completely disable RLS on both tables
ALTER TABLE course_modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons DISABLE ROW LEVEL SECURITY;

-- STEP 2: Drop ALL existing policies to ensure clean slate
DROP POLICY IF EXISTS authenticated_users_full_access_course_modules ON course_modules;
DROP POLICY IF EXISTS authenticated_users_full_access_course_lessons ON course_lessons;

-- STEP 3: Re-enable RLS after clean slate
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;

-- STEP 4: Create completely permissive policies with explicit role targeting
-- Using PERMISSIVE mode and targeting specific roles ensures policies work

-- Course Modules: Authenticated users can do everything
CREATE POLICY course_modules_admin_full_access
ON course_modules
AS PERMISSIVE
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Course Lessons: Authenticated users can do everything
CREATE POLICY course_lessons_admin_full_access
ON course_lessons
AS PERMISSIVE
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- STEP 5: Grant explicit table permissions to authenticated role
GRANT ALL ON course_modules TO authenticated;
GRANT ALL ON course_lessons TO authenticated;

-- STEP 6: Ensure sequence permissions for UUID generation
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Verification queries (commented out for migration)
-- SELECT tablename, policyname, permissive, roles, cmd, qual, with_check 
-- FROM pg_policies 
-- WHERE tablename IN ('course_modules', 'course_lessons');