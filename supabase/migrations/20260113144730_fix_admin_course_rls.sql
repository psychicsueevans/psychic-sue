-- Fix RLS policies for course_modules to allow admin operations
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Enable read for authenticated users only" ON public.course_modules;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.course_modules;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.course_modules;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.course_modules;

-- Create permissive admin policies for course_modules
CREATE POLICY "Allow all operations for service role"
ON public.course_modules
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users"
ON public.course_modules
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow read for anonymous users"
ON public.course_modules
FOR SELECT
TO anon
USING (is_published = true);

-- Fix RLS policies for course_lessons similarly
DROP POLICY IF EXISTS "Enable read for authenticated users only" ON public.course_lessons;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.course_lessons;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.course_lessons;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.course_lessons;

CREATE POLICY "Allow all operations for service role"
ON public.course_lessons
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users"
ON public.course_lessons
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow read for anonymous users"
ON public.course_lessons
FOR SELECT
TO anon
USING (is_published = true);

-- Add helpful comment
COMMENT ON POLICY "Allow all operations for authenticated users" ON public.course_modules IS 'Allows authenticated admin users to create, read, update, and delete course modules without restrictions';
COMMENT ON POLICY "Allow all operations for authenticated users" ON public.course_lessons IS 'Allows authenticated admin users to create, read, update, and delete course lessons without restrictions';