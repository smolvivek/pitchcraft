-- Helper function for RLS (returns users.id for current auth user)
CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS UUID AS $$
  SELECT id FROM public.users WHERE auth_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Create pitches table (8 required fields only)
CREATE TABLE IF NOT EXISTS public.pitches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  logline VARCHAR(500) NOT NULL,
  synopsis TEXT NOT NULL,
  genre VARCHAR(100) NOT NULL,
  vision TEXT NOT NULL,
  cast_and_characters TEXT NOT NULL,
  budget_range VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'looking',
  team TEXT NOT NULL,
  current_version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Create pitch_sections table (optional sections)
CREATE TABLE IF NOT EXISTS public.pitch_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pitch_id UUID NOT NULL REFERENCES public.pitches(id) ON DELETE CASCADE,
  section_name VARCHAR(100) NOT NULL,
  data JSONB NOT NULL,
  order_index INT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_pitches_user_id ON public.pitches(user_id);
CREATE INDEX idx_pitches_status ON public.pitches(status);
CREATE INDEX idx_pitches_deleted_at ON public.pitches(deleted_at);
CREATE INDEX idx_pitch_sections_pitch_id ON public.pitch_sections(pitch_id);
CREATE UNIQUE INDEX idx_pitch_sections_unique ON public.pitch_sections(pitch_id, section_name);

-- RLS: pitches table
ALTER TABLE public.pitches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pitches_select_own"
  ON public.pitches FOR SELECT
  USING (user_id = public.current_user_id() AND deleted_at IS NULL);

CREATE POLICY "pitches_insert_own"
  ON public.pitches FOR INSERT
  WITH CHECK (user_id = public.current_user_id());

CREATE POLICY "pitches_update_own"
  ON public.pitches FOR UPDATE
  USING (user_id = public.current_user_id())
  WITH CHECK (user_id = public.current_user_id());

-- RLS: pitch_sections table
ALTER TABLE public.pitch_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pitch_sections_select_own"
  ON public.pitch_sections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pitches
      WHERE pitches.id = pitch_sections.pitch_id
        AND pitches.user_id = public.current_user_id()
    )
  );

CREATE POLICY "pitch_sections_insert_own"
  ON public.pitch_sections FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pitches
      WHERE pitches.id = pitch_sections.pitch_id
        AND pitches.user_id = public.current_user_id()
    )
  );

CREATE POLICY "pitch_sections_update_own"
  ON public.pitch_sections FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.pitches
      WHERE pitches.id = pitch_sections.pitch_id
        AND pitches.user_id = public.current_user_id()
    )
  );

CREATE POLICY "pitch_sections_delete_own"
  ON public.pitch_sections FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.pitches
      WHERE pitches.id = pitch_sections.pitch_id
        AND pitches.user_id = public.current_user_id()
    )
  );
