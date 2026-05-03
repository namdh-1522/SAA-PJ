-- Migration: Add `anonymous_nickname` to `kudos` and surface it in the masking
-- view so anonymous senders can show a public alias instead of the generic
-- "Ẩn danh" label.
--
-- Spec source: Sun* Kudos – Live Board (`MaZUn5xHXZ`), Add-link / nickname
-- pop-up `OyDLDuSGEa` (the user-supplied Figma reference for the input shell).
-- Field is OPTIONAL — empty string ⇒ no alias, masked sender renders as
-- "Ẩn danh" client-side.

-- ─── 1. Column ───────────────────────────────────────────────────────────────
ALTER TABLE kudos
  ADD COLUMN IF NOT EXISTS anonymous_nickname varchar(50) NOT NULL DEFAULT '';

-- 50-char cap matches the Zod limit in `lib/kudos/schemas.ts` and keeps the
-- alias legible inside the avatar caption on the cream card.
-- Postgres has no `ADD CONSTRAINT IF NOT EXISTS`. This migration previously
-- collided on timestamp `20260503000002` with `profiles_insert_own.sql`
-- (Supabase's migration tracker uses the prefix as a primary key, so only one
-- of the two could be recorded). It has now been bumped to `…000003` so it
-- re-applies cleanly on databases that swallowed the collision.
-- DROP-then-ADD makes the statement safely re-runnable on databases that
-- already have the constraint.
ALTER TABLE kudos
  DROP CONSTRAINT IF EXISTS kudos_anonymous_nickname_len;
ALTER TABLE kudos
  ADD CONSTRAINT kudos_anonymous_nickname_len CHECK (char_length(anonymous_nickname) <= 50);

-- ─── 2. Surface on the kudos_with_stats view ─────────────────────────────────
-- Same mask rule as `sender_*`: only the sender themselves can see their real
-- nickname; everyone else gets the alias (or NULL when none was provided, so
-- the client falls back to "Ẩn danh"). Drop + recreate because PostgreSQL
-- doesn't allow inserting a column in the middle of an existing view.
DROP VIEW IF EXISTS kudos_highlights;
DROP VIEW IF EXISTS kudos_with_stats;

CREATE VIEW kudos_with_stats AS
SELECT
  k.id,
  CASE WHEN k.is_anonymous AND auth.uid() <> k.sender_id THEN NULL ELSE k.sender_id END AS sender_id,
  k.receiver_id,
  k.content,
  k.image_urls,
  k.created_at,
  k.updated_at,
  k.title,
  k.is_anonymous,
  k.anonymous_nickname,
  COALESCE(h.heart_count, 0)::int AS heart_count,
  COALESCE(htags.hashtag_names, '{}') AS hashtag_names,
  CASE
    WHEN k.is_anonymous AND auth.uid() <> k.sender_id
      THEN NULLIF(k.anonymous_nickname, '')
    ELSE p_sender.full_name
  END AS sender_name,
  CASE WHEN k.is_anonymous AND auth.uid() <> k.sender_id THEN NULL ELSE p_sender.avatar_url END AS sender_avatar_url,
  CASE WHEN k.is_anonymous AND auth.uid() <> k.sender_id THEN NULL ELSE p_sender.department_code END AS sender_dept_code,
  p_receiver.full_name      AS receiver_name,
  p_receiver.avatar_url     AS receiver_avatar_url,
  p_receiver.department_code AS receiver_dept_code
FROM kudos k
LEFT JOIN (
  SELECT kudos_id, SUM(weight)::int AS heart_count
  FROM hearts
  GROUP BY kudos_id
) h ON h.kudos_id = k.id
LEFT JOIN (
  SELECT kh.kudos_id, array_agg(ht.name) AS hashtag_names
  FROM kudos_hashtags kh
  JOIN hashtags ht ON ht.id = kh.hashtag_id
  GROUP BY kh.kudos_id
) htags ON htags.kudos_id = k.id
LEFT JOIN profiles p_sender   ON p_sender.id   = k.sender_id
LEFT JOIN profiles p_receiver ON p_receiver.id = k.receiver_id;

-- Recreate `kudos_highlights` (cascaded out by the DROP above) with the
-- exact shape it had in `20260429000002_kudos_compose.sql` — keeps the
-- `featured` column so anything depending on the original view contract
-- still resolves.
CREATE VIEW kudos_highlights AS
SELECT kws.*, kh.featured
FROM kudos k
JOIN kudos_highlight_flags kh ON kh.kudos_id = k.id AND kh.featured = true
JOIN kudos_with_stats kws ON kws.id = k.id;
