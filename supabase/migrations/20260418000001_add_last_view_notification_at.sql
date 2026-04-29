-- Add DB-backed notification cooldown column to pitches.
-- Replaces the in-memory Map in lib/views/record.ts that reset on every cold start.
ALTER TABLE public.pitches
  ADD COLUMN IF NOT EXISTS last_view_notification_at TIMESTAMPTZ;
