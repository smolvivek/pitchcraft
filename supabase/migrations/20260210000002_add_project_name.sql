-- Add project_name field to pitches table
ALTER TABLE public.pitches
ADD COLUMN project_name VARCHAR(100) NOT NULL DEFAULT 'Untitled Project';

-- Remove default after adding the column (for future inserts to require it)
ALTER TABLE public.pitches
ALTER COLUMN project_name DROP DEFAULT;
