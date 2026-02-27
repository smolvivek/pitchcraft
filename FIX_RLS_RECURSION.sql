-- ═══════════════════════════════════════════════════════════
-- FIX: Infinite recursion in RLS policies
--
-- Problem: pitches policies query share_links, share_links
-- policies query pitches → infinite loop.
--
-- Solution: SECURITY DEFINER helper functions that bypass RLS.
-- Paste this into Supabase SQL Editor and run it.
-- ═══════════════════════════════════════════════════════════

-- Helper: does this user own this pitch? (bypasses RLS)
CREATE OR REPLACE FUNCTION public.user_owns_pitch(p_pitch_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.pitches
    WHERE id = p_pitch_id
    AND user_id = public.current_user_id()
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: does this pitch have a public share link? (bypasses RLS)
CREATE OR REPLACE FUNCTION public.pitch_has_public_share(p_pitch_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.share_links
    WHERE pitch_id = p_pitch_id
    AND visibility = 'public'
    AND deleted_at IS NULL
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- ─── Fix pitches policies ───

DROP POLICY IF EXISTS "pitches_select_shared_public" ON pitches;
CREATE POLICY "pitches_select_shared_public" ON pitches FOR SELECT
  USING (public.pitch_has_public_share(id));


-- ─── Fix share_links policies (use user_owns_pitch instead of joining pitches) ───

DROP POLICY IF EXISTS "share_links_select_own" ON share_links;
CREATE POLICY "share_links_select_own" ON share_links FOR SELECT
  USING (public.user_owns_pitch(pitch_id));

DROP POLICY IF EXISTS "share_links_insert_own" ON share_links;
CREATE POLICY "share_links_insert_own" ON share_links FOR INSERT
  WITH CHECK (public.user_owns_pitch(pitch_id));

DROP POLICY IF EXISTS "share_links_update_own" ON share_links;
CREATE POLICY "share_links_update_own" ON share_links FOR UPDATE
  USING (public.user_owns_pitch(pitch_id));

DROP POLICY IF EXISTS "share_links_delete_own" ON share_links;
CREATE POLICY "share_links_delete_own" ON share_links FOR DELETE
  USING (public.user_owns_pitch(pitch_id));


-- ─── Fix pitch_sections policies ───

DROP POLICY IF EXISTS "pitch_sections_select_own" ON pitch_sections;
CREATE POLICY "pitch_sections_select_own" ON pitch_sections FOR SELECT
  USING (public.user_owns_pitch(pitch_id));

DROP POLICY IF EXISTS "pitch_sections_insert_own" ON pitch_sections;
CREATE POLICY "pitch_sections_insert_own" ON pitch_sections FOR INSERT
  WITH CHECK (public.user_owns_pitch(pitch_id));

DROP POLICY IF EXISTS "pitch_sections_update_own" ON pitch_sections;
CREATE POLICY "pitch_sections_update_own" ON pitch_sections FOR UPDATE
  USING (public.user_owns_pitch(pitch_id));

DROP POLICY IF EXISTS "pitch_sections_delete_own" ON pitch_sections;
CREATE POLICY "pitch_sections_delete_own" ON pitch_sections FOR DELETE
  USING (public.user_owns_pitch(pitch_id));

DROP POLICY IF EXISTS "pitch_sections_select_shared" ON pitch_sections;
CREATE POLICY "pitch_sections_select_shared" ON pitch_sections FOR SELECT
  USING (public.pitch_has_public_share(pitch_id));


-- ─── Fix media policies ───

DROP POLICY IF EXISTS "media_select_own" ON media;
CREATE POLICY "media_select_own" ON media FOR SELECT
  USING (public.user_owns_pitch(pitch_id));

DROP POLICY IF EXISTS "media_insert_own" ON media;
CREATE POLICY "media_insert_own" ON media FOR INSERT
  WITH CHECK (public.user_owns_pitch(pitch_id));

DROP POLICY IF EXISTS "media_update_own" ON media;
CREATE POLICY "media_update_own" ON media FOR UPDATE
  USING (public.user_owns_pitch(pitch_id));

DROP POLICY IF EXISTS "media_delete_own" ON media;
CREATE POLICY "media_delete_own" ON media FOR DELETE
  USING (public.user_owns_pitch(pitch_id));

DROP POLICY IF EXISTS "media_select_shared" ON media;
CREATE POLICY "media_select_shared" ON media FOR SELECT
  USING (public.pitch_has_public_share(pitch_id));


-- ─── Fix funding policies ───

DROP POLICY IF EXISTS "funding_select_own" ON funding;
CREATE POLICY "funding_select_own" ON funding FOR SELECT
  USING (public.user_owns_pitch(pitch_id));

DROP POLICY IF EXISTS "funding_insert_own" ON funding;
CREATE POLICY "funding_insert_own" ON funding FOR INSERT
  WITH CHECK (public.user_owns_pitch(pitch_id));

DROP POLICY IF EXISTS "funding_update_own" ON funding;
CREATE POLICY "funding_update_own" ON funding FOR UPDATE
  USING (public.user_owns_pitch(pitch_id));

DROP POLICY IF EXISTS "funding_delete_own" ON funding;
CREATE POLICY "funding_delete_own" ON funding FOR DELETE
  USING (public.user_owns_pitch(pitch_id));

DROP POLICY IF EXISTS "funding_select_shared" ON funding;
CREATE POLICY "funding_select_shared" ON funding FOR SELECT
  USING (public.pitch_has_public_share(pitch_id));


-- ─── Fix donations policies ───

DROP POLICY IF EXISTS "donations_select_own" ON donations;
CREATE POLICY "donations_select_own" ON donations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM funding
    WHERE funding.id = donations.funding_id
    AND public.user_owns_pitch(funding.pitch_id)
  ));


-- ─── Fix pitch_versions policies ───

DROP POLICY IF EXISTS "pitch_versions_select_own" ON pitch_versions;
CREATE POLICY "pitch_versions_select_own" ON pitch_versions FOR SELECT
  USING (public.user_owns_pitch(pitch_id));

DROP POLICY IF EXISTS "pitch_versions_insert_own" ON pitch_versions;
CREATE POLICY "pitch_versions_insert_own" ON pitch_versions FOR INSERT
  WITH CHECK (public.user_owns_pitch(pitch_id));


-- ═══════════════════════════════════════════════════════════
-- DONE. All circular RLS dependencies resolved.
-- ═══════════════════════════════════════════════════════════
