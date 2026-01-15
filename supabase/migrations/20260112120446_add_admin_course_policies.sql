-- Add admin RLS policies for course management

-- Course Modules: Admin can manage all modules
CREATE POLICY "admins_manage_all_course_modules"
ON course_modules
FOR ALL
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

-- Course Lessons: Admin can manage all lessons
CREATE POLICY "admins_manage_all_course_lessons"
ON course_lessons
FOR ALL
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

-- Update existing read policies to be less restrictive for members
DROP POLICY IF EXISTS "public_can_read_course_modules" ON course_modules;
DROP POLICY IF EXISTS "public_can_read_course_lessons" ON course_lessons;

-- Members can read published content
CREATE POLICY "members_read_published_modules"
ON course_modules
FOR SELECT
USING (
  is_published = true
  OR EXISTS (
    SELECT 1 FROM members
    WHERE members.id = auth.uid()
    AND members.is_active = true
  )
);

CREATE POLICY "members_read_published_lessons"
ON course_lessons
FOR SELECT
USING (
  is_published = true
  OR EXISTS (
    SELECT 1 FROM members
    WHERE members.id = auth.uid()
    AND members.is_active = true
  )
);