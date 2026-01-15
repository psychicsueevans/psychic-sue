-- Location: supabase/migrations/20260113171600_add_lesson_content_column.sql
-- Schema Analysis: Extending existing course_lessons table
-- Integration Type: Modification - Adding content column to support rich lesson content
-- Dependencies: course_lessons table

-- Add content column to course_lessons table for storing detailed lesson content
ALTER TABLE public.course_lessons
ADD COLUMN IF NOT EXISTS content TEXT;

-- Add comment to explain the new column
COMMENT ON COLUMN public.course_lessons.content IS 'Rich text/HTML content for the lesson body';