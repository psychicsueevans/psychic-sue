-- Location: supabase/migrations/20260113125940_add_voice_notes.sql
-- Schema Analysis: Existing members table with UUID id column
-- Integration Type: NEW_MODULE - Voice notes functionality
-- Dependencies: members table (existing)

-- Create voice_notes table
CREATE TABLE public.voice_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    audio_url TEXT NOT NULL,
    question_topic TEXT,
    is_listened BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_voice_notes_member_id ON public.voice_notes(member_id);
CREATE INDEX idx_voice_notes_created_at ON public.voice_notes(created_at DESC);
CREATE INDEX idx_voice_notes_is_listened ON public.voice_notes(is_listened);

-- Enable Row Level Security
ALTER TABLE public.voice_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Members can manage their own voice notes
CREATE POLICY "users_manage_own_voice_notes"
ON public.voice_notes
FOR ALL
TO authenticated
USING (member_id = auth.uid())
WITH CHECK (member_id = auth.uid());

-- RLS Policy: Allow authenticated users to insert voice notes (for new submissions)
CREATE POLICY "authenticated_can_insert_voice_notes"
ON public.voice_notes
FOR INSERT
TO authenticated
WITH CHECK (member_id = auth.uid());

-- Create Supabase Storage bucket for voice notes (if not exists)
-- Note: This requires Supabase CLI or Dashboard configuration
-- Bucket name: voice-notes
-- Public: false (private)
-- Allowed MIME types: audio/mpeg, audio/mp4, audio/wav, audio/ogg
-- Max file size: 10MB