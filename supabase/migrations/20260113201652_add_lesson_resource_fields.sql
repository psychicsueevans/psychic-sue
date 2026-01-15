-- Location: supabase/migrations/20260113201652_add_lesson_resource_fields.sql
-- Schema Analysis: Extending existing course_lessons table
-- Integration Type: Modificative - Adding columns to existing table
-- Dependencies: course_lessons table

-- Add resource URL and title columns to course_lessons table
ALTER TABLE public.course_lessons
ADD COLUMN resource_url TEXT,
ADD COLUMN resource_title TEXT;

-- Add index for resource_url for faster lookups
CREATE INDEX idx_course_lessons_resource_url ON public.course_lessons(resource_url) WHERE resource_url IS NOT NULL;

-- Add comment to explain new columns
COMMENT ON COLUMN public.course_lessons.resource_url IS 'URL to PDF or other resource file (from Google Drive, Dropbox, or Supabase Storage)';
COMMENT ON COLUMN public.course_lessons.resource_title IS 'Display name for the downloadable resource';