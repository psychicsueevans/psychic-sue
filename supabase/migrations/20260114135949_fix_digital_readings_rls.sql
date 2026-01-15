-- Fix RLS policies for digital_readings table
-- Issue: Only SELECT policy exists, causing INSERT failures
-- Solution: Drop existing policy and create single policy with full access for authenticated users

-- Drop existing SELECT-only policy
DROP POLICY IF EXISTS "public_can_read_digital_readings" ON public.digital_readings;

-- Create comprehensive policy allowing authenticated users full access
CREATE POLICY "authenticated_full_access_digital_readings" 
ON public.digital_readings
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Verify RLS is enabled (should already be enabled, but ensure it)
ALTER TABLE public.digital_readings ENABLE ROW LEVEL SECURITY;