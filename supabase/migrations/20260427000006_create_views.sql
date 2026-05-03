-- Migration: Cross-table VIEWs for the Kudos Live Board
--
-- These views aggregate across multiple tables (kudos, hearts, kudos_hashtags,
-- hashtags, profiles, kudos_highlight_flags, secret_boxes). They are defined in
-- this dedicated migration — instead of inline with CREATE TABLE — so that all
-- referenced tables are guaranteed to exist by the time CREATE VIEW runs.
--
-- Order constraint: must run AFTER 01..05 (table creation) and BEFORE the RLS
-- policies migration (which only touches base tables, but conceptually views
-- belong with schema, not security).

-- ─── kudos_with_stats ──────────────────────────────────────────────────────
-- Feed query view: kudos row + heart_count + hashtag_names + sender/receiver profile fields.
CREATE OR REPLACE VIEW kudos_with_stats AS
SELECT
  k.*,
  COALESCE(h.heart_count, 0)::int  AS heart_count,
  COALESCE(htags.hashtag_names, '{}') AS hashtag_names,
  p_sender.full_name               AS sender_name,
  p_sender.avatar_url              AS sender_avatar_url,
  p_sender.department_code         AS sender_dept_code,
  p_receiver.full_name             AS receiver_name,
  p_receiver.avatar_url            AS receiver_avatar_url,
  p_receiver.department_code       AS receiver_dept_code
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

-- ─── kudos_highlights ──────────────────────────────────────────────────────
-- Manually curated highlight feed (joins on the boolean flag table).
CREATE OR REPLACE VIEW kudos_highlights AS
SELECT kws.*, kh.featured
FROM kudos k
JOIN kudos_highlight_flags kh ON kh.kudos_id = k.id AND kh.featured = true
JOIN kudos_with_stats kws ON kws.id = k.id;

-- ─── user_kudos_stats ──────────────────────────────────────────────────────
-- Per-user aggregate counters used by profile screens & leaderboards.
CREATE OR REPLACE VIEW user_kudos_stats AS
SELECT
  u.id AS user_id,
  COALESCE(r.kudos_received, 0) AS kudos_received,
  COALESCE(s.kudos_sent,     0) AS kudos_sent,
  COALESCE(h.hearts,         0) AS hearts,
  COALESCE(bo.opened,        0) AS secret_box_opened,
  COALESCE(bc.closed,        0) AS secret_box_closed
FROM auth.users u
LEFT JOIN (
  SELECT receiver_id, COUNT(*)::int AS kudos_received
  FROM kudos GROUP BY receiver_id
) r ON r.receiver_id = u.id
LEFT JOIN (
  SELECT sender_id, COUNT(*)::int AS kudos_sent
  FROM kudos GROUP BY sender_id
) s ON s.sender_id = u.id
LEFT JOIN (
  SELECT k.receiver_id, SUM(h.weight)::int AS hearts
  FROM hearts h
  JOIN kudos k ON k.id = h.kudos_id
  GROUP BY k.receiver_id
) h ON h.receiver_id = u.id
LEFT JOIN (
  SELECT owner_id, COUNT(*)::int AS opened
  FROM secret_boxes WHERE opened = true GROUP BY owner_id
) bo ON bo.owner_id = u.id
LEFT JOIN (
  SELECT owner_id, COUNT(*)::int AS closed
  FROM secret_boxes WHERE opened = false GROUP BY owner_id
) bc ON bc.owner_id = u.id;
