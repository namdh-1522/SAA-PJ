-- Migration: Create hearts table
-- Tracks likes on Kudos. weight=2 on special days (config from special_days table).

CREATE TABLE IF NOT EXISTS hearts (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kudos_id   uuid NOT NULL REFERENCES kudos(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight     smallint NOT NULL DEFAULT 1 CHECK (weight IN (1, 2)),
  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT hearts_unique_per_user UNIQUE (kudos_id, user_id)
);

CREATE INDEX IF NOT EXISTS hearts_kudos_id_idx ON hearts(kudos_id);
CREATE INDEX IF NOT EXISTS hearts_user_id_idx  ON hearts(user_id);
