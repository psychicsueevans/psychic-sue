-- Location: supabase/migrations/20260112125510_add_bookings_announcements.sql
-- Schema Analysis: Existing membership site schema with members, courses, content tables
-- Integration Type: Addition - New bookings and announcements modules
-- Dependencies: Existing members table

-- 1. Create enum types for bookings and announcements
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE public.reading_type AS ENUM ('express', 'general', 'love_relationships', 'money_career', 'in_depth', 'live_phone');
CREATE TYPE public.announcement_delivery_method AS ENUM ('email', 'dashboard', 'both');

-- 2. Create bookings table
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    reading_type public.reading_type NOT NULL,
    booking_date TIMESTAMPTZ NOT NULL,
    status public.booking_status DEFAULT 'pending'::public.booking_status,
    customer_questions TEXT,
    special_requests TEXT,
    payment_amount DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create reading history table (for tracking past readings)
CREATE TABLE public.reading_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    reading_date TIMESTAMPTZ NOT NULL,
    reading_type public.reading_type NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create announcements table
CREATE TABLE public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    delivery_method public.announcement_delivery_method DEFAULT 'both'::public.announcement_delivery_method,
    is_sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMPTZ,
    target_tier TEXT, -- 'all', 'circle_member', 'vip'
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create indexes for performance
CREATE INDEX idx_bookings_member_id ON public.bookings(member_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX idx_reading_history_member_id ON public.reading_history(member_id);
CREATE INDEX idx_reading_history_booking_id ON public.reading_history(booking_id);
CREATE INDEX idx_announcements_published ON public.announcements(is_published);
CREATE INDEX idx_announcements_sent ON public.announcements(is_sent);

-- 6. Enable RLS on new tables
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for bookings (authenticated users can manage all - admin access)
CREATE POLICY "authenticated_manage_bookings"
ON public.bookings
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Members can view their own bookings
CREATE POLICY "members_view_own_bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (member_id = auth.uid());

-- 8. RLS Policies for reading history
CREATE POLICY "authenticated_manage_reading_history"
ON public.reading_history
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "members_view_own_reading_history"
ON public.reading_history
FOR SELECT
TO authenticated
USING (member_id = auth.uid());

-- 9. RLS Policies for announcements
CREATE POLICY "authenticated_manage_announcements"
ON public.announcements
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "members_view_published_announcements"
ON public.announcements
FOR SELECT
TO authenticated
USING (is_published = true);

-- 10. Create mock data for bookings
DO $$
DECLARE
    member1_id UUID;
    member2_id UUID;
    booking1_id UUID := gen_random_uuid();
    booking2_id UUID := gen_random_uuid();
BEGIN
    -- Get existing member IDs
    SELECT id INTO member1_id FROM public.members WHERE email = 'sarah.circle@example.com' LIMIT 1;
    SELECT id INTO member2_id FROM public.members WHERE email = 'mike.circle@example.com' LIMIT 1;

    IF member1_id IS NOT NULL AND member2_id IS NOT NULL THEN
        -- Insert sample bookings
        INSERT INTO public.bookings (id, member_id, reading_type, booking_date, status, customer_questions, payment_amount)
        VALUES
            (booking1_id, member1_id, 'love_relationships', NOW() + INTERVAL '3 days', 'confirmed', 'Will I find love this year? What should I focus on?', 75.00),
            (booking2_id, member2_id, 'general', NOW() + INTERVAL '7 days', 'pending', 'General guidance for the next 6 months', 50.00);

        -- Insert reading history
        INSERT INTO public.reading_history (booking_id, member_id, reading_date, reading_type, notes)
        VALUES
            (booking1_id, member1_id, NOW() - INTERVAL '30 days', 'express', 'Quick reading about career change - positive outlook'),
            (booking2_id, member2_id, NOW() - INTERVAL '60 days', 'general', 'General life reading - focus on relationships and career');
    END IF;

    -- Insert sample announcements
    INSERT INTO public.announcements (title, content, delivery_method, target_tier, is_published)
    VALUES
        ('New Course Module Released!', 'Module 3: Understanding Your Intuition is now available to all members. Check it out in your dashboard!', 'both', 'all', true),
        ('VIP Member Exclusive Event', 'Join us for a special live Q&A session next week. Details sent via email.', 'email', 'vip', true),
        ('Upcoming Maintenance', 'The platform will undergo scheduled maintenance on Sunday 2-4 AM. Service may be briefly interrupted.', 'dashboard', 'all', false);
END $$;