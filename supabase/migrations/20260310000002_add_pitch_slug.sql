-- Add custom slug support to pitches
ALTER TABLE pitches ADD COLUMN slug TEXT;

-- Partial unique index: slugs must be unique among non-deleted pitches.
-- Deleted pitches release their slug for reuse.
CREATE UNIQUE INDEX idx_pitches_slug ON pitches(slug)
  WHERE slug IS NOT NULL AND deleted_at IS NULL;
