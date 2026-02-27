-- ═══════════════════════════════════════════════════════════
-- PITCHCRAFT — FULL DATABASE SETUP
-- Paste this entire block into Supabase SQL Editor and run it.
-- Safe to re-run: uses IF NOT EXISTS / IF EXISTS checks.
-- ═══════════════════════════════════════════════════════════

-- ─── 1. USERS TABLE ───

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  statement TEXT,
  gdpr_consent BOOLEAN NOT NULL DEFAULT false,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON public.users(auth_id);

-- Auto-create public.users row when someone signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_id, email, name, gdpr_consent)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'gdpr_consent')::boolean, false)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can view own profile') THEN
    CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can update own profile') THEN
    CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth_id = auth.uid());
  END IF;
END $$;


-- ─── 2. HELPER FUNCTIONS ───

CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS UUID AS $$
  SELECT id FROM public.users WHERE auth_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- These bypass RLS to avoid circular policy dependencies
CREATE OR REPLACE FUNCTION public.user_owns_pitch(p_pitch_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.pitches
    WHERE id = p_pitch_id
    AND user_id = public.current_user_id()
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.pitch_has_public_share(p_pitch_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.share_links
    WHERE pitch_id = p_pitch_id
    AND visibility = 'public'
    AND deleted_at IS NULL
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- ─── 3. PITCHES TABLE ───

CREATE TABLE IF NOT EXISTS public.pitches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  logline VARCHAR(500) NOT NULL,
  synopsis TEXT NOT NULL,
  genre VARCHAR(100) NOT NULL,
  vision TEXT NOT NULL,
  cast_and_characters TEXT NOT NULL,
  budget_range VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'development',
  team TEXT NOT NULL,
  current_version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Add project_name if it doesn't exist
ALTER TABLE public.pitches ADD COLUMN IF NOT EXISTS project_name VARCHAR(100);
UPDATE public.pitches SET project_name = 'Untitled Project' WHERE project_name IS NULL;
ALTER TABLE public.pitches ALTER COLUMN project_name SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_pitches_user_id ON public.pitches(user_id);
CREATE INDEX IF NOT EXISTS idx_pitches_status ON public.pitches(status);
CREATE INDEX IF NOT EXISTS idx_pitches_deleted_at ON public.pitches(deleted_at);

ALTER TABLE public.pitches ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pitches' AND policyname = 'pitches_select_own') THEN
    CREATE POLICY "pitches_select_own" ON public.pitches FOR SELECT
      USING (user_id = public.current_user_id() AND deleted_at IS NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pitches' AND policyname = 'pitches_insert_own') THEN
    CREATE POLICY "pitches_insert_own" ON public.pitches FOR INSERT
      WITH CHECK (user_id = public.current_user_id());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pitches' AND policyname = 'pitches_update_own') THEN
    CREATE POLICY "pitches_update_own" ON public.pitches FOR UPDATE
      USING (user_id = public.current_user_id())
      WITH CHECK (user_id = public.current_user_id());
  END IF;
END $$;


-- ─── 4. PITCH SECTIONS TABLE ───

CREATE TABLE IF NOT EXISTS public.pitch_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pitch_id UUID NOT NULL REFERENCES public.pitches(id) ON DELETE CASCADE,
  section_name VARCHAR(100) NOT NULL,
  data JSONB NOT NULL,
  order_index INT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pitch_sections_pitch_id ON public.pitch_sections(pitch_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_pitch_sections_unique ON public.pitch_sections(pitch_id, section_name);

ALTER TABLE public.pitch_sections ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pitch_sections' AND policyname = 'pitch_sections_select_own') THEN
    CREATE POLICY "pitch_sections_select_own" ON public.pitch_sections FOR SELECT
      USING (public.user_owns_pitch(pitch_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pitch_sections' AND policyname = 'pitch_sections_insert_own') THEN
    CREATE POLICY "pitch_sections_insert_own" ON public.pitch_sections FOR INSERT
      WITH CHECK (public.user_owns_pitch(pitch_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pitch_sections' AND policyname = 'pitch_sections_update_own') THEN
    CREATE POLICY "pitch_sections_update_own" ON public.pitch_sections FOR UPDATE
      USING (public.user_owns_pitch(pitch_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pitch_sections' AND policyname = 'pitch_sections_delete_own') THEN
    CREATE POLICY "pitch_sections_delete_own" ON public.pitch_sections FOR DELETE
      USING (public.user_owns_pitch(pitch_id));
  END IF;
END $$;


-- ─── 5. STORAGE BUCKET + MEDIA TABLE ───

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pitch-assets',
  'pitch-assets',
  false,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Users can upload own files') THEN
    CREATE POLICY "Users can upload own files" ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'pitch-assets' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Users can view own files') THEN
    CREATE POLICY "Users can view own files" ON storage.objects FOR SELECT
      USING (bucket_id = 'pitch-assets' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Users can delete own files') THEN
    CREATE POLICY "Users can delete own files" ON storage.objects FOR DELETE
      USING (bucket_id = 'pitch-assets' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Users can update own files') THEN
    CREATE POLICY "Users can update own files" ON storage.objects FOR UPDATE
      USING (bucket_id = 'pitch-assets' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
END $$;

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

ALTER TABLE public.media ADD COLUMN IF NOT EXISTS caption TEXT;

CREATE INDEX IF NOT EXISTS idx_media_pitch_id ON public.media(pitch_id);
CREATE INDEX IF NOT EXISTS idx_media_section_name ON public.media(pitch_id, section_name);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'media' AND policyname = 'media_select_own') THEN
    CREATE POLICY "media_select_own" ON public.media FOR SELECT
      USING (public.user_owns_pitch(pitch_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'media' AND policyname = 'media_insert_own') THEN
    CREATE POLICY "media_insert_own" ON public.media FOR INSERT
      WITH CHECK (public.user_owns_pitch(pitch_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'media' AND policyname = 'media_update_own') THEN
    CREATE POLICY "media_update_own" ON public.media FOR UPDATE
      USING (public.user_owns_pitch(pitch_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'media' AND policyname = 'media_delete_own') THEN
    CREATE POLICY "media_delete_own" ON public.media FOR DELETE
      USING (public.user_owns_pitch(pitch_id));
  END IF;
END $$;


-- ─── 6. AI USAGE TABLE ───

CREATE TABLE IF NOT EXISTS ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  text_count INTEGER NOT NULL DEFAULT 0,
  image_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, usage_date)
);

ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_usage' AND policyname = 'Users can read own usage') THEN
    CREATE POLICY "Users can read own usage" ON ai_usage FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_usage' AND policyname = 'Users can insert own usage') THEN
    CREATE POLICY "Users can insert own usage" ON ai_usage FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_usage' AND policyname = 'Users can update own usage') THEN
    CREATE POLICY "Users can update own usage" ON ai_usage FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;


-- ─── 7. SHARE LINKS TABLE ───

CREATE TABLE IF NOT EXISTS share_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pitch_id UUID NOT NULL REFERENCES pitches(id) ON DELETE CASCADE,
  visibility VARCHAR(50) NOT NULL DEFAULT 'public',
  password_hash VARCHAR(255),
  allow_version_history BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_share_links_pitch_id ON share_links(pitch_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_share_links_unique_active ON share_links(pitch_id) WHERE deleted_at IS NULL;

ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'share_links' AND policyname = 'share_links_select_own') THEN
    CREATE POLICY "share_links_select_own" ON share_links FOR SELECT
      USING (public.user_owns_pitch(pitch_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'share_links' AND policyname = 'share_links_insert_own') THEN
    CREATE POLICY "share_links_insert_own" ON share_links FOR INSERT
      WITH CHECK (public.user_owns_pitch(pitch_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'share_links' AND policyname = 'share_links_update_own') THEN
    CREATE POLICY "share_links_update_own" ON share_links FOR UPDATE
      USING (public.user_owns_pitch(pitch_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'share_links' AND policyname = 'share_links_delete_own') THEN
    CREATE POLICY "share_links_delete_own" ON share_links FOR DELETE
      USING (public.user_owns_pitch(pitch_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'share_links' AND policyname = 'share_links_select_public') THEN
    CREATE POLICY "share_links_select_public" ON share_links FOR SELECT
      USING (visibility = 'public' AND deleted_at IS NULL);
  END IF;
END $$;

-- Public read: pitches visible when shared (uses SECURITY DEFINER helper)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pitches' AND policyname = 'pitches_select_shared_public') THEN
    CREATE POLICY "pitches_select_shared_public" ON pitches FOR SELECT
      USING (public.pitch_has_public_share(id));
  END IF;
END $$;

-- Public read: sections visible when pitch is shared
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pitch_sections' AND policyname = 'pitch_sections_select_shared') THEN
    CREATE POLICY "pitch_sections_select_shared" ON pitch_sections FOR SELECT
      USING (public.pitch_has_public_share(pitch_id));
  END IF;
END $$;

-- Public read: media visible when pitch is shared
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'media' AND policyname = 'media_select_shared') THEN
    CREATE POLICY "media_select_shared" ON media FOR SELECT
      USING (public.pitch_has_public_share(pitch_id));
  END IF;
END $$;


-- ─── 8. FUNDING + DONATIONS TABLES (STRIPE) ───

CREATE TABLE IF NOT EXISTS funding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pitch_id UUID UNIQUE NOT NULL REFERENCES pitches(id) ON DELETE CASCADE,
  funding_goal INT NOT NULL,
  description TEXT,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE funding ADD COLUMN IF NOT EXISTS stretch_goals JSONB DEFAULT '[]'::jsonb;
ALTER TABLE funding ADD COLUMN IF NOT EXISTS rewards JSONB DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_funding_pitch_id ON funding(pitch_id);

ALTER TABLE funding ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'funding' AND policyname = 'funding_select_own') THEN
    CREATE POLICY "funding_select_own" ON funding FOR SELECT
      USING (public.user_owns_pitch(pitch_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'funding' AND policyname = 'funding_insert_own') THEN
    CREATE POLICY "funding_insert_own" ON funding FOR INSERT
      WITH CHECK (public.user_owns_pitch(pitch_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'funding' AND policyname = 'funding_update_own') THEN
    CREATE POLICY "funding_update_own" ON funding FOR UPDATE
      USING (public.user_owns_pitch(pitch_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'funding' AND policyname = 'funding_delete_own') THEN
    CREATE POLICY "funding_delete_own" ON funding FOR DELETE
      USING (public.user_owns_pitch(pitch_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'funding' AND policyname = 'funding_select_shared') THEN
    CREATE POLICY "funding_select_shared" ON funding FOR SELECT
      USING (public.pitch_has_public_share(pitch_id));
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funding_id UUID NOT NULL REFERENCES funding(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  message TEXT,
  stripe_session_id VARCHAR(255),
  stripe_payment_intent VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_donations_funding_id ON donations(funding_id);
CREATE INDEX IF NOT EXISTS idx_donations_stripe_session ON donations(stripe_session_id);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'donations' AND policyname = 'donations_select_own') THEN
    CREATE POLICY "donations_select_own" ON donations FOR SELECT
      USING (EXISTS (SELECT 1 FROM funding WHERE funding.id = donations.funding_id AND public.user_owns_pitch(funding.pitch_id)));
  END IF;
END $$;


-- ─── 9. PITCH VERSIONS TABLE ───

CREATE TABLE IF NOT EXISTS pitch_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pitch_id UUID NOT NULL REFERENCES pitches(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pitch_versions_pitch_id ON pitch_versions(pitch_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_pitch_versions_number ON pitch_versions(pitch_id, version_number);

ALTER TABLE pitch_versions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pitch_versions' AND policyname = 'pitch_versions_select_own') THEN
    CREATE POLICY "pitch_versions_select_own" ON pitch_versions FOR SELECT
      USING (public.user_owns_pitch(pitch_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pitch_versions' AND policyname = 'pitch_versions_insert_own') THEN
    CREATE POLICY "pitch_versions_insert_own" ON pitch_versions FOR INSERT
      WITH CHECK (public.user_owns_pitch(pitch_id));
  END IF;
END $$;


-- ═══════════════════════════════════════════════════════════
-- DONE. All tables, policies, indexes, and functions created.
-- ═══════════════════════════════════════════════════════════
