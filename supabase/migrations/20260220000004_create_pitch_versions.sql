-- Pitch versions table
CREATE TABLE IF NOT EXISTS pitch_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pitch_id UUID NOT NULL REFERENCES pitches(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_pitch_versions_pitch_id ON pitch_versions(pitch_id);
CREATE UNIQUE INDEX idx_pitch_versions_number ON pitch_versions(pitch_id, version_number);

ALTER TABLE pitch_versions ENABLE ROW LEVEL SECURITY;

-- Owners can read versions of their own pitches
CREATE POLICY "pitch_versions_select_own"
  ON pitch_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pitches
      JOIN users ON users.id = pitches.user_id
      WHERE pitches.id = pitch_versions.pitch_id
        AND users.auth_id = auth.uid()
    )
  );

-- Owners can insert versions for their own pitches
CREATE POLICY "pitch_versions_insert_own"
  ON pitch_versions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pitches
      JOIN users ON users.id = pitches.user_id
      WHERE pitches.id = pitch_versions.pitch_id
        AND users.auth_id = auth.uid()
    )
  );
