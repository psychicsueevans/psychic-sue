-- Drop existing policies to recreate with proper authentication handling
DROP POLICY IF EXISTS "read_course_modules" ON course_modules;
DROP POLICY IF EXISTS "admins_insert_course_modules" ON course_modules;
DROP POLICY IF EXISTS "admins_update_course_modules" ON course_modules;
DROP POLICY IF EXISTS "admins_delete_course_modules" ON course_modules;
DROP POLICY IF EXISTS "read_course_lessons" ON course_lessons;
DROP POLICY IF EXISTS "admins_insert_course_lessons" ON course_lessons;
DROP POLICY IF EXISTS "admins_update_course_lessons" ON course_lessons;
DROP POLICY IF EXISTS "admins_delete_course_lessons" ON course_lessons;

-- Course Modules Policies with auth bypass for service role
CREATE POLICY "read_course_modules"
ON course_modules
FOR SELECT
TO authenticated, anon
USING (
  is_published = true 
  OR EXISTS (
    SELECT 1 FROM members
    WHERE members.id = auth.uid()
    AND members.is_active = true
  )
);

-- Allow INSERT for authenticated users (admin operations)
CREATE POLICY "admins_insert_course_modules"
ON course_modules
FOR INSERT
TO authenticated
WITH CHECK (true);  -- Allow all authenticated users to insert

-- Allow UPDATE for authenticated users (admin operations)
CREATE POLICY "admins_update_course_modules"
ON course_modules
FOR UPDATE
TO authenticated
USING (true)  -- Allow all authenticated users to update
WITH CHECK (true);

-- Allow DELETE for authenticated users (admin operations)
CREATE POLICY "admins_delete_course_modules"
ON course_modules
FOR DELETE
TO authenticated
USING (true);  -- Allow all authenticated users to delete

-- Course Lessons Policies with auth bypass for service role
CREATE POLICY "read_course_lessons"
ON course_lessons
FOR SELECT
TO authenticated, anon
USING (
  is_published = true 
  OR EXISTS (
    SELECT 1 FROM members
    WHERE members.id = auth.uid()
    AND members.is_active = true
  )
);

-- Allow INSERT for authenticated users (admin operations)
CREATE POLICY "admins_insert_course_lessons"
ON course_lessons
FOR INSERT
TO authenticated
WITH CHECK (true);  -- Allow all authenticated users to insert

-- Allow UPDATE for authenticated users (admin operations)
CREATE POLICY "admins_update_course_lessons"
ON course_lessons
FOR UPDATE
TO authenticated
USING (true)  -- Allow all authenticated users to update
WITH CHECK (true);

-- Allow DELETE for authenticated users (admin operations)
CREATE POLICY "admins_delete_course_lessons"
ON course_lessons
FOR DELETE
TO authenticated
USING (true);  -- Allow all authenticated users to delete