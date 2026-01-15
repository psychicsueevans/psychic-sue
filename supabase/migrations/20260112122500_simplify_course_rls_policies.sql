-- Drop all existing RLS policies for course_modules and course_lessons
DROP POLICY IF EXISTS "read_course_modules" ON public.course_modules;
DROP POLICY IF EXISTS "public_can_read_course_modules" ON public.course_modules;
DROP POLICY IF EXISTS "admins_insert_course_modules" ON public.course_modules;
DROP POLICY IF EXISTS "admins_update_course_modules" ON public.course_modules;
DROP POLICY IF EXISTS "admins_delete_course_modules" ON public.course_modules;

DROP POLICY IF EXISTS "read_course_lessons" ON public.course_lessons;
DROP POLICY IF EXISTS "public_can_read_course_lessons" ON public.course_lessons;
DROP POLICY IF EXISTS "admins_insert_course_lessons" ON public.course_lessons;
DROP POLICY IF EXISTS "admins_update_course_lessons" ON public.course_lessons;
DROP POLICY IF EXISTS "admins_delete_course_lessons" ON public.course_lessons;

-- ============================================
-- Simplified RLS Policies for course_modules
-- ============================================

-- Allow public and authenticated users to read published modules
CREATE POLICY "public_read_published_modules"
ON public.course_modules
FOR SELECT
TO public
USING (is_published = true);

-- Allow authenticated users to read all modules (including unpublished)
CREATE POLICY "authenticated_read_all_modules"
ON public.course_modules
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert modules
CREATE POLICY "authenticated_insert_modules"
ON public.course_modules
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update modules
CREATE POLICY "authenticated_update_modules"
ON public.course_modules
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete modules
CREATE POLICY "authenticated_delete_modules"
ON public.course_modules
FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- Simplified RLS Policies for course_lessons
-- ============================================

-- Allow public and authenticated users to read published lessons
CREATE POLICY "public_read_published_lessons"
ON public.course_lessons
FOR SELECT
TO public
USING (is_published = true);

-- Allow authenticated users to read all lessons (including unpublished)
CREATE POLICY "authenticated_read_all_lessons"
ON public.course_lessons
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert lessons
CREATE POLICY "authenticated_insert_lessons"
ON public.course_lessons
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update lessons
CREATE POLICY "authenticated_update_lessons"
ON public.course_lessons
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete lessons
CREATE POLICY "authenticated_delete_lessons"
ON public.course_lessons
FOR DELETE
TO authenticated
USING (true);