-- Create pitch-assets storage bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pitch-assets',
  'pitch-assets',
  false, -- Private bucket
  52428800, -- 50MB max file size
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf'
  ]
);

-- RLS: Users can upload to their own folder
CREATE POLICY "Users can upload own files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'pitch-assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- RLS: Users can view their own files
CREATE POLICY "Users can view own files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'pitch-assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- RLS: Users can delete their own files
CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'pitch-assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- RLS: Users can update their own file metadata
CREATE POLICY "Users can update own files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'pitch-assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create media table
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pitch_id UUID NOT NULL REFERENCES public.pitches(id) ON DELETE CASCADE,
  section_name VARCHAR(100),
  storage_path VARCHAR(500) NOT NULL,
  file_type VARCHAR(50),
  file_size INT,
  order_index INT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for media table
CREATE INDEX idx_media_pitch_id ON public.media(pitch_id);
CREATE INDEX idx_media_section_name ON public.media(pitch_id, section_name);

-- RLS: Enable RLS on media table
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view media for their own pitches
CREATE POLICY "media_select_own"
  ON public.media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pitches
      WHERE pitches.id = media.pitch_id
        AND pitches.user_id = public.current_user_id()
        AND pitches.deleted_at IS NULL
    )
  );

-- RLS: Users can insert media for their own pitches
CREATE POLICY "media_insert_own"
  ON public.media FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pitches
      WHERE pitches.id = media.pitch_id
        AND pitches.user_id = public.current_user_id()
        AND pitches.deleted_at IS NULL
    )
  );

-- RLS: Users can update media for their own pitches
CREATE POLICY "media_update_own"
  ON public.media FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.pitches
      WHERE pitches.id = media.pitch_id
        AND pitches.user_id = public.current_user_id()
        AND pitches.deleted_at IS NULL
    )
  );

-- RLS: Users can delete media for their own pitches
CREATE POLICY "media_delete_own"
  ON public.media FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.pitches
      WHERE pitches.id = media.pitch_id
        AND pitches.user_id = public.current_user_id()
        AND pitches.deleted_at IS NULL
    )
  );
