-- Create share_links table
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

CREATE INDEX idx_share_links_pitch_id ON share_links(pitch_id);

-- One active share link per pitch
CREATE UNIQUE INDEX idx_share_links_unique_active
  ON share_links(pitch_id)
  WHERE deleted_at IS NULL;

-- Enable RLS
ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;

-- Owner can manage their own share links
CREATE POLICY "share_links_select_own"
  ON share_links FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pitches
      JOIN users ON users.id = pitches.user_id
      WHERE pitches.id = share_links.pitch_id
        AND users.auth_id = auth.uid()
    )
  );

CREATE POLICY "share_links_insert_own"
  ON share_links FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pitches
      JOIN users ON users.id = pitches.user_id
      WHERE pitches.id = share_links.pitch_id
        AND users.auth_id = auth.uid()
    )
  );

CREATE POLICY "share_links_update_own"
  ON share_links FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM pitches
      JOIN users ON users.id = pitches.user_id
      WHERE pitches.id = share_links.pitch_id
        AND users.auth_id = auth.uid()
    )
  );

CREATE POLICY "share_links_delete_own"
  ON share_links FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM pitches
      JOIN users ON users.id = pitches.user_id
      WHERE pitches.id = share_links.pitch_id
        AND users.auth_id = auth.uid()
    )
  );

-- Anyone can read public share links (needed to resolve shared pitch URLs)
CREATE POLICY "share_links_select_public"
  ON share_links FOR SELECT
  USING (visibility = 'public' AND deleted_at IS NULL);

-- Public read policies on pitches (when share_link exists)
CREATE POLICY "pitches_select_shared_public"
  ON pitches FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM share_links
      WHERE share_links.pitch_id = pitches.id
        AND share_links.visibility = 'public'
        AND share_links.deleted_at IS NULL
    )
  );

-- Public read policies on pitch_sections (when share_link exists)
CREATE POLICY "pitch_sections_select_shared"
  ON pitch_sections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM share_links
      WHERE share_links.pitch_id = pitch_sections.pitch_id
        AND share_links.visibility = 'public'
        AND share_links.deleted_at IS NULL
    )
  );

-- Public read policies on media (when share_link exists)
CREATE POLICY "media_select_shared"
  ON media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM share_links
      WHERE share_links.pitch_id = media.pitch_id
        AND share_links.visibility = 'public'
        AND share_links.deleted_at IS NULL
    )
  );
