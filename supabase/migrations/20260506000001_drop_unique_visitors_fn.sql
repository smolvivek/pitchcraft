-- Drop get_pitch_unique_visitors: created for an analytics route that has been
-- removed (CONSTRAINTS.md §4 — no behavioral analytics). Function had no remaining callers.
DROP FUNCTION IF EXISTS get_pitch_unique_visitors(UUID);
