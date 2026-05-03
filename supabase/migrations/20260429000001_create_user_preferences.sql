-- Migration: create public.user_preferences
-- Feature:   Language Dropdown (frame hUyaaugye2)
-- Spec:      .momorph/specs/hUyaaugye2-Dropdown-ngon-ngu/spec.md (FR-011)
--
-- Stores per-user preferences keyed by auth.uid(). Currently only `locale`,
-- but the table is intentionally a satellite for additional preferences later
-- (theme, notification_opts, …) without crowding `auth.users`.

CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id    uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  locale     text NOT NULL CHECK (locale IN ('vi', 'en')),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- A user MAY read only their own preferences row.
CREATE POLICY "user_preferences_select_own"
  ON public.user_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

-- A user MAY insert only a row with their own user_id.
CREATE POLICY "user_preferences_insert_own"
  ON public.user_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- A user MAY update only their own row.
CREATE POLICY "user_preferences_update_own"
  ON public.user_preferences
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Touch updated_at on every UPDATE so callers can debug stale state.
CREATE OR REPLACE FUNCTION public.user_preferences_touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER user_preferences_set_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.user_preferences_touch_updated_at();
