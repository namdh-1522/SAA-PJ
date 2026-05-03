-- Migration: Create departments and profiles tables

CREATE TABLE IF NOT EXISTS departments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  code       text NOT NULL UNIQUE,
  active     boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS departments_code_idx ON departments(code);

-- Profiles: extends auth.users with display info
CREATE TABLE IF NOT EXISTS profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       text,
  avatar_url      text,
  department_code text REFERENCES departments(code),
  star_tier       smallint CHECK (star_tier IN (1, 2, 3)),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- VIEW `user_kudos_stats` (depends on secret_boxes from migration 05) lives in
-- `20260427000006_create_views.sql` so all referenced tables exist when it runs.
