-- Fix duplicate RLS policies causing "Cannot coerce to single JSON object" error
-- The issue: Multiple policies (ALL + specific UPDATE) causing duplicate row returns

-- Drop the duplicate "ALL operations" policy for authenticated users
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON course_modules;

-- Ensure we have clean, specific policies for each operation
-- These policies are more precise and won't cause row duplication

-- Note: Keep the existing specific policies:
-- - authenticated_read_all_modules (SELECT)
-- - authenticated_insert_modules (INSERT)  
-- - authenticated_update_modules (UPDATE)
-- - authenticated_delete_modules (DELETE)

-- These specific policies work correctly without conflicts