-- Fix RLS policy conflicts causing 401 errors

-- Drop conflicting policies
DROP POLICY IF EXISTS "admins_manage_all_course_modules" ON course_modules;
DROP POLICY IF EXISTS "admins_manage_all_course_lessons" ON course_lessons;
DROP POLICY IF EXISTS "members_read_published_modules" ON course_modules;
DROP POLICY IF EXISTS "members_read_published_lessons" ON course_lessons;
DROP POLICY IF EXISTS "public_can_read_course_modules" ON course_modules;
DROP POLICY IF EXISTS "public_can_read_course_lessons" ON course_lessons;

-- Course Modules: Allow reading published content OR if user is an active member (admin access)
CREATE POLICY "read_course_modules"
ON course_modules
FOR SELECT
TO authenticated
USING (
  is_published = true 
  OR EXISTS (
    SELECT 1 FROM members
    WHERE members.id = auth.uid()
    AND members.is_active = true
  )
);

-- Course Modules: Only active members can INSERT
CREATE POLICY "admins_insert_course_modules"
ON course_modules
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM members
    WHERE members.id = auth.uid()
    AND members.is_active = true
  )
);

-- Course Modules: Only active members can UPDATE
CREATE POLICY "admins_update_course_modules"
ON course_modules
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM members
    WHERE members.id = auth.uid()
    AND members.is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM members
    WHERE members.id = auth.uid()
    AND members.is_active = true
  )
);

-- Course Modules: Only active members can DELETE
CREATE POLICY "admins_delete_course_modules"
ON course_modules
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM members
    WHERE members.id = auth.uid()
    AND members.is_active = true
  )
);

-- Course Lessons: Allow reading published content OR if user is an active member (admin access)
CREATE POLICY "read_course_lessons"
ON course_lessons
FOR SELECT
TO authenticated
USING (
  is_published = true 
  OR EXISTS (
    SELECT 1 FROM members
    WHERE members.id = auth.uid()
    AND members.is_active = true
  )
);

-- Course Lessons: Only active members can INSERT
CREATE POLICY "admins_insert_course_lessons"
ON course_lessons
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM members
    WHERE members.id = auth.uid()
    AND members.is_active = true
  )
);

-- Course Lessons: Only active members can UPDATE
CREATE POLICY "admins_update_course_lessons"
ON course_lessons
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM members
    WHERE members.id = auth.uid()
    AND members.is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM members
    WHERE members.id = auth.uid()
    AND members.is_active = true
  )
);

-- Course Lessons: Only active members can DELETE
CREATE POLICY "admins_delete_course_lessons"
ON course_lessons
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM members
    WHERE members.id = auth.uid()
    AND members.is_active = true
  )
);