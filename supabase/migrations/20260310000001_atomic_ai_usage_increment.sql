-- Atomic AI usage increment to prevent TOCTOU race condition.
-- Returns TRUE if usage was incremented (within limit), FALSE if limit exceeded.
CREATE OR REPLACE FUNCTION try_increment_ai_usage(
  p_user_id UUID,
  p_date DATE,
  p_field TEXT,
  p_limit INT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current INT;
BEGIN
  -- Ensure the row exists (no-op if already present)
  INSERT INTO ai_usage (user_id, usage_date, text_count, image_count)
  VALUES (p_user_id, p_date, 0, 0)
  ON CONFLICT (user_id, usage_date) DO NOTHING;

  -- Lock the row and read current count
  IF p_field = 'text_count' THEN
    SELECT text_count INTO v_current
    FROM ai_usage
    WHERE user_id = p_user_id AND usage_date = p_date
    FOR UPDATE;
  ELSIF p_field = 'image_count' THEN
    SELECT image_count INTO v_current
    FROM ai_usage
    WHERE user_id = p_user_id AND usage_date = p_date
    FOR UPDATE;
  ELSE
    RAISE EXCEPTION 'Invalid field: %', p_field;
  END IF;

  -- Reject if at or over limit
  IF v_current >= p_limit THEN
    RETURN FALSE;
  END IF;

  -- Increment
  IF p_field = 'text_count' THEN
    UPDATE ai_usage SET text_count = text_count + 1
    WHERE user_id = p_user_id AND usage_date = p_date;
  ELSE
    UPDATE ai_usage SET image_count = image_count + 1
    WHERE user_id = p_user_id AND usage_date = p_date;
  END IF;

  RETURN TRUE;
END;
$$;

-- Grant execute to authenticated role (called via service-role from API routes)
GRANT EXECUTE ON FUNCTION try_increment_ai_usage(UUID, DATE, TEXT, INT) TO service_role;
