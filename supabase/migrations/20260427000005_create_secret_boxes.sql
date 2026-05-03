-- Migration: Create secret_boxes and special_days tables

CREATE TABLE IF NOT EXISTS secret_boxes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id   uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opened     boolean NOT NULL DEFAULT false,
  opened_at  timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS secret_boxes_owner_id_idx   ON secret_boxes(owner_id);
CREATE INDEX IF NOT EXISTS secret_boxes_opened_idx     ON secret_boxes(owner_id, opened);

-- special_days: when date matches today, heart weight = 2
CREATE TABLE IF NOT EXISTS special_days (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_date  date NOT NULL UNIQUE,
  heart_weight smallint NOT NULL DEFAULT 2 CHECK (heart_weight > 0),
  label       text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS special_days_date_idx ON special_days(event_date);
