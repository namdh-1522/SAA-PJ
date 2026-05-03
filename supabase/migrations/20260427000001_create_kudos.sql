-- Migration: Create kudos table
-- Stores peer recognition messages sent between Sunners

CREATE TABLE IF NOT EXISTS kudos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id   uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content     text NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 2000),
  image_urls  text[] NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT kudos_sender_ne_receiver CHECK (sender_id <> receiver_id)
);

CREATE INDEX IF NOT EXISTS kudos_sender_id_idx ON kudos(sender_id);
CREATE INDEX IF NOT EXISTS kudos_receiver_id_idx ON kudos(receiver_id);
CREATE INDEX IF NOT EXISTS kudos_created_at_idx ON kudos(created_at DESC);

-- Trigger to keep updated_at current
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER kudos_updated_at
  BEFORE UPDATE ON kudos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- VIEWs that aggregate across kudos / hearts / hashtags / profiles / kudos_highlight_flags
-- live in `20260427000006_create_views.sql` (after all referenced tables exist).
