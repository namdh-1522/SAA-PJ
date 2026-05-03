-- Migration: Create hashtags and kudos_hashtags join table

CREATE TABLE IF NOT EXISTS hashtags (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL UNIQUE CHECK (char_length(name) > 0 AND char_length(name) <= 80),
  usage_count int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS hashtags_name_idx        ON hashtags(name);
CREATE INDEX IF NOT EXISTS hashtags_usage_count_idx ON hashtags(usage_count DESC);

CREATE TABLE IF NOT EXISTS kudos_hashtags (
  kudos_id   uuid NOT NULL REFERENCES kudos(id)    ON DELETE CASCADE,
  hashtag_id uuid NOT NULL REFERENCES hashtags(id) ON DELETE CASCADE,
  PRIMARY KEY (kudos_id, hashtag_id)
);

-- Materialised usage count via trigger
CREATE OR REPLACE FUNCTION update_hashtag_usage_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE hashtags SET usage_count = usage_count + 1 WHERE id = NEW.hashtag_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE hashtags SET usage_count = GREATEST(usage_count - 1, 0) WHERE id = OLD.hashtag_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER kudos_hashtags_usage_insert
  AFTER INSERT ON kudos_hashtags
  FOR EACH ROW EXECUTE FUNCTION update_hashtag_usage_count();

CREATE TRIGGER kudos_hashtags_usage_delete
  AFTER DELETE ON kudos_hashtags
  FOR EACH ROW EXECUTE FUNCTION update_hashtag_usage_count();

-- Highlight flags table (referenced by kudos_highlights view)
CREATE TABLE IF NOT EXISTS kudos_highlight_flags (
  kudos_id   uuid PRIMARY KEY REFERENCES kudos(id) ON DELETE CASCADE,
  featured   boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
