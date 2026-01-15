-- Location: supabase/migrations/20260112114316_membership_site_schema.sql
-- Schema Analysis: Fresh project - no existing tables
-- Integration Type: Complete membership site schema
-- Dependencies: auth.users (Supabase provided)

-- 1. TYPES
CREATE TYPE public.membership_tier AS ENUM ('circle_member', 'vip');
CREATE TYPE public.meditation_category AS ENUM ('relaxation', 'intuition', 'protection', 'sleep');
CREATE TYPE public.resource_category AS ENUM ('journals', 'guides', 'workbooks', 'reference');
CREATE TYPE public.file_type AS ENUM ('pdf');
CREATE TYPE public.reading_category AS ENUM ('love_relationships', 'general');

-- 2. CORE TABLES

-- Members table (intermediary for auth.users)
CREATE TABLE public.members (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    membership_tier public.membership_tier DEFAULT 'circle_member'::public.membership_tier NOT NULL,
    membership_start_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    membership_end_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Course modules table
CREATE TABLE public.course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_number INTEGER NOT NULL UNIQUE CHECK (module_number >= 1 AND module_number <= 8),
    title TEXT NOT NULL,
    description TEXT,
    is_published BOOLEAN DEFAULT false NOT NULL,
    order_position INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Course lessons table
CREATE TABLE public.course_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE NOT NULL,
    lesson_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    duration_minutes INTEGER,
    is_published BOOLEAN DEFAULT false NOT NULL,
    order_position INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Lesson progress table
CREATE TABLE public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE NOT NULL,
    is_completed BOOLEAN DEFAULT false NOT NULL,
    completed_at TIMESTAMPTZ,
    UNIQUE(member_id, lesson_id)
);

-- Weekly messages table
CREATE TABLE public.weekly_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message_content TEXT NOT NULL,
    published_date TIMESTAMPTZ NOT NULL,
    is_current BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Meditations table
CREATE TABLE public.meditations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    audio_url TEXT NOT NULL,
    duration_minutes INTEGER,
    category public.meditation_category NOT NULL,
    is_featured BOOLEAN DEFAULT false NOT NULL,
    is_published BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Resources table
CREATE TABLE public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type public.file_type DEFAULT 'pdf'::public.file_type NOT NULL,
    file_size INTEGER,
    category public.resource_category NOT NULL,
    is_featured BOOLEAN DEFAULT false NOT NULL,
    is_published BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Digital readings table
CREATE TABLE public.digital_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category public.reading_category NOT NULL,
    card_number INTEGER NOT NULL CHECK (card_number >= 0 AND card_number <= 21),
    card_name TEXT NOT NULL,
    video_url TEXT NOT NULL,
    card_meaning TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(category, card_number)
);

-- 3. INDEXES
CREATE INDEX idx_members_email ON public.members(email);
CREATE INDEX idx_members_membership_tier ON public.members(membership_tier);
CREATE INDEX idx_course_modules_module_number ON public.course_modules(module_number);
CREATE INDEX idx_course_lessons_module_id ON public.course_lessons(module_id);
CREATE INDEX idx_lesson_progress_member_id ON public.lesson_progress(member_id);
CREATE INDEX idx_lesson_progress_lesson_id ON public.lesson_progress(lesson_id);
CREATE INDEX idx_weekly_messages_is_current ON public.weekly_messages(is_current);
CREATE INDEX idx_meditations_category ON public.meditations(category);
CREATE INDEX idx_resources_category ON public.resources(category);
CREATE INDEX idx_digital_readings_category ON public.digital_readings(category);

-- 4. FUNCTIONS (BEFORE RLS POLICIES)
CREATE OR REPLACE FUNCTION public.handle_new_member()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.members (id, email, full_name, membership_tier)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'membership_tier')::public.membership_tier, 'circle_member'::public.membership_tier)
    );
    RETURN NEW;
END;
$$;

-- 5. ENABLE RLS
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meditations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_readings ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES

-- Members policies (Pattern 1: Core user table)
CREATE POLICY "users_view_own_member_profile"
ON public.members
FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "users_update_own_member_profile"
ON public.members
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Course modules policies (Pattern 4: Public read)
CREATE POLICY "public_can_read_course_modules"
ON public.course_modules
FOR SELECT
TO authenticated
USING (is_published = true);

-- Course lessons policies (Pattern 4: Public read)
CREATE POLICY "public_can_read_course_lessons"
ON public.course_lessons
FOR SELECT
TO authenticated
USING (is_published = true);

-- Lesson progress policies (Pattern 2: Simple user ownership)
CREATE POLICY "users_manage_own_lesson_progress"
ON public.lesson_progress
FOR ALL
TO authenticated
USING (member_id = auth.uid())
WITH CHECK (member_id = auth.uid());

-- Weekly messages policies (Pattern 4: Public read)
CREATE POLICY "public_can_read_weekly_messages"
ON public.weekly_messages
FOR SELECT
TO authenticated
USING (true);

-- Meditations policies (Pattern 4: Public read)
CREATE POLICY "public_can_read_meditations"
ON public.meditations
FOR SELECT
TO authenticated
USING (is_published = true);

-- Resources policies (Pattern 4: Public read)
CREATE POLICY "public_can_read_resources"
ON public.resources
FOR SELECT
TO authenticated
USING (is_published = true);

-- Digital readings policies (Pattern 4: Public read)
CREATE POLICY "public_can_read_digital_readings"
ON public.digital_readings
FOR SELECT
TO authenticated
USING (true);

-- 7. TRIGGERS
CREATE TRIGGER on_auth_user_created_member
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_member();

-- 8. MOCK DATA
DO $$
DECLARE
    member1_id UUID := gen_random_uuid();
    member2_id UUID := gen_random_uuid();
    vip_member_id UUID := gen_random_uuid();
    module1_id UUID := gen_random_uuid();
    module2_id UUID := gen_random_uuid();
    lesson1_id UUID := gen_random_uuid();
    lesson2_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with complete fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (member1_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'sarah.circle@example.com', crypt('circlemember123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Sarah Johnson", "membership_tier": "circle_member"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (member2_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'mike.circle@example.com', crypt('circlemember456', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Mike Wilson", "membership_tier": "circle_member"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (vip_member_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'jessica.vip@example.com', crypt('vipmember789', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Jessica Martinez", "membership_tier": "vip"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Course modules
    INSERT INTO public.course_modules (id, module_number, title, description, is_published, order_position) VALUES
        (module1_id, 1, 'Introduction to Psychic Development', 'Learn the basics of developing your psychic abilities', true, 1),
        (module2_id, 2, 'Understanding Your Intuition', 'Deep dive into intuitive awareness and trust', true, 2);

    -- Course lessons
    INSERT INTO public.course_lessons (id, module_id, lesson_number, title, description, video_url, duration_minutes, is_published, order_position) VALUES
        (lesson1_id, module1_id, 1, 'Welcome to Your Journey', 'Introduction to the course and what to expect', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 15, true, 1),
        (lesson2_id, module1_id, 2, 'Setting Your Intentions', 'How to set powerful intentions for your development', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 20, true, 2);

    -- Lesson progress
    INSERT INTO public.lesson_progress (member_id, lesson_id, is_completed, completed_at) VALUES
        (member1_id, lesson1_id, true, now() - interval '2 days'),
        (vip_member_id, lesson1_id, true, now() - interval '1 day'),
        (vip_member_id, lesson2_id, true, now());

    -- Weekly messages
    INSERT INTO public.weekly_messages (title, message_content, published_date, is_current) VALUES
        ('Welcome to January 2026', 'This week we focus on new beginnings and setting intentions for the year ahead. Remember, your intuition is your greatest guide.', now() - interval '1 day', true),
        ('Trusting Your Inner Voice', 'Last week we explored how to listen to your inner wisdom. Continue practicing daily meditation to strengthen this connection.', now() - interval '8 days', false);

    -- Meditations
    INSERT INTO public.meditations (title, description, audio_url, duration_minutes, category, is_featured, is_published) VALUES
        ('Morning Grounding Meditation', 'Start your day centered and connected', 'https://example.com/audio/grounding.mp3', 10, 'relaxation', true, true),
        ('Intuition Activation', 'Awaken your psychic senses', 'https://example.com/audio/intuition.mp3', 15, 'intuition', true, true),
        ('Psychic Protection Shield', 'Create energetic boundaries', 'https://example.com/audio/protection.mp3', 12, 'protection', false, true),
        ('Deep Sleep Journey', 'Peaceful rest and dream enhancement', 'https://example.com/audio/sleep.mp3', 20, 'sleep', false, true);

    -- Resources
    INSERT INTO public.resources (title, description, file_url, file_type, file_size, category, is_featured, is_published) VALUES
        ('Intuition Development Journal', 'Track your psychic experiences and growth', 'https://example.com/resources/intuition-journal.pdf', 'pdf', 2048000, 'journals', true, true),
        ('Tarot Basics Guide', 'Introduction to reading tarot cards', 'https://example.com/resources/tarot-guide.pdf', 'pdf', 3072000, 'guides', true, true),
        ('Crystal Healing Workbook', 'Exercises for working with crystals', 'https://example.com/resources/crystal-workbook.pdf', 'pdf', 1536000, 'workbooks', false, true);

    -- Digital readings (22 cards for each category)
    INSERT INTO public.digital_readings (category, card_number, card_name, video_url, card_meaning) VALUES
        ('love_relationships', 0, 'The Fool', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'New beginnings in love, taking a leap of faith'),
        ('love_relationships', 1, 'The Magician', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Manifesting love, attraction and chemistry'),
        ('general', 0, 'The Fool', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'New adventures, fresh starts, embracing the unknown'),
        ('general', 1, 'The Magician', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Manifestation power, skills and resources available');
END $$;