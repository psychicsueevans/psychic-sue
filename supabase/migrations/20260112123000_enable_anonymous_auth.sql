-- Enable anonymous authentication for admin access
-- This allows the admin panel to authenticate without requiring explicit user credentials

-- Enable RLS on all tables if not already enabled
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meditations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Ensure anon role has necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Add comment explaining the authentication approach
COMMENT ON SCHEMA public IS 'Schema with anonymous authentication enabled for admin panel access. RLS policies control data access based on authentication status.';