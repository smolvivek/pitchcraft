CREATE TABLE pitch_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pitch_id UUID NOT NULL REFERENCES pitches(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT now(),
  ip_day_hash TEXT  -- SHA-256(ip+date), dedup unique visitors without storing PII
);

CREATE INDEX idx_pitch_views_pitch_id ON pitch_views(pitch_id);
CREATE INDEX idx_pitch_views_time ON pitch_views(pitch_id, viewed_at);

-- Only pitch owner can read view counts (via service role in API)
ALTER TABLE pitch_views ENABLE ROW LEVEL SECURITY;
-- No client-side RLS policies — reads/writes go through admin client only
