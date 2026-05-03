-- Migration: Add Kudo compose feature columns + RLS for client-side hashtag attach + anonymous masking view.
-- Frame: ihQ26W78P2 (Viết Kudo) — see .momorph/specs/ihQ26W78P2-Viet-Kudo/.
-- Author flow: spec §FR-002, FR-007, FR-008; design-style.md C.Input (100-char title), G (anonymous toggle).

-- ─── 1. Add `title` (Danh hiệu) + `is_anonymous` columns ────────────────────
ALTER TABLE kudos
  ADD COLUMN IF NOT EXISTS title varchar(100) NOT NULL DEFAULT '';

-- Drop the temporary default once existing rows are seeded; new rows must always provide a title.
ALTER TABLE kudos
  ALTER COLUMN title DROP DEFAULT,
  ADD CONSTRAINT kudos_title_nonempty CHECK (char_length(trim(title)) > 0 AND char_length(title) <= 100);

ALTER TABLE kudos
  ADD COLUMN IF NOT EXISTS is_anonymous boolean NOT NULL DEFAULT false;

-- ─── 2. RLS for client-side hashtag attachment on own kudos ─────────────────
-- The base RLS migration (20260427000007) restricts kudos_hashtags INSERT to service_role only,
-- which prevents the new client compose flow. Allow authenticated users to INSERT junction rows
-- ONLY for kudos they themselves authored.
DROP POLICY IF EXISTS "kudos_hashtags_insert_own" ON kudos_hashtags;
CREATE POLICY "kudos_hashtags_insert_own" ON kudos_hashtags
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM kudos k
      WHERE k.id = kudos_hashtags.kudos_id
        AND k.sender_id = auth.uid()
    )
  );

-- DELETE policy on `kudos` for the sender — needed by the createKudo rollback path
-- when hashtag linking fails after the parent row is inserted, and a sensible base
-- privilege regardless. Receivers cannot delete; only the original sender can.
DROP POLICY IF EXISTS "kudos_delete_own" ON kudos;
CREATE POLICY "kudos_delete_own" ON kudos
  FOR DELETE TO authenticated
  USING (auth.uid() = sender_id);

-- ─── 3. Anonymous masking on kudos_with_stats view ──────────────────────────
-- Per spec §FR-008 + design decision #6: when `is_anonymous = true`, the sender's identity is
-- hidden from non-owner viewers. The sender themselves still sees their own kudos in full.
-- Admins are out of scope here (no admin role present yet); add an OR clause when one is added.
--
-- We need to add `title` and `is_anonymous` columns to the projection. Postgres' CREATE OR REPLACE
-- VIEW only supports appending columns at the END of the column list — it forbids inserting them
-- between existing ones. Drop and recreate (cascade through `kudos_highlights`, which we redefine
-- immediately below).
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
  COALESCE(h.heart_count, 0)::int AS heart_count,
  COALESCE(htags.hashtag_names, '{}') AS hashtag_names,
  CASE WHEN k.is_anonymous AND auth.uid() <> k.sender_id THEN NULL ELSE p_sender.full_name END AS sender_name,
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

-- Recreate `kudos_highlights` (depends on `kudos_with_stats`).
CREATE VIEW kudos_highlights AS
SELECT kws.*, kh.featured
FROM kudos k
JOIN kudos_highlight_flags kh ON kh.kudos_id = k.id AND kh.featured = true
JOIN kudos_with_stats kws ON kws.id = k.id;

-- ─── 4. Index on title for future search (low cost) ─────────────────────────
CREATE INDEX IF NOT EXISTS kudos_title_idx ON kudos USING gin (to_tsvector('simple', title));
