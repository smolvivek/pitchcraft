-- Add optional caption to media records
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS caption TEXT;
