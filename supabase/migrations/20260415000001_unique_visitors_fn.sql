-- Efficient unique visitor count using COUNT(DISTINCT) instead of loading all rows into JS.
-- Called by the Studio analytics API route.
CREATE OR REPLACE FUNCTION get_pitch_unique_visitors(p_pitch_id UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT COUNT(DISTINCT ip_day_hash)::INTEGER
  FROM pitch_views
  WHERE pitch_id = p_pitch_id
$$;
