-- Migration: Fix RLS policies to allow INSERT operations on course_modules and course_lessons
-- Problem: Existing policies have command ALL but missing USING clause, blocking INSERT
-- Solution: Drop existing policies and recreate with both USING and WITH CHECK clauses

-- Drop existing broken policies
DROP POLICY IF EXISTS authenticated_users_full_access_course_modules ON course_modules;
DROP POLICY IF EXISTS authenticated_users_full_access_course_lessons ON course_lessons;

-- Create correct policies with BOTH USING and WITH CHECK clauses
-- USING clause: Controls SELECT, UPDATE, DELETE
-- WITH CHECK clause: Controls INSERT, UPDATE

-- Course Modules: Allow authenticated users full access
CREATE POLICY authenticated_users_full_access_course_modules
ON course_modules
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Course Lessons: Allow authenticated users full access
CREATE POLICY authenticated_users_full_access_course_lessons
ON course_lessons
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Verify RLS is enabled (should already be enabled, but ensuring)
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;