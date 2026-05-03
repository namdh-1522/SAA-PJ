-- Migration: Row Level Security policies for all Kudos tables
-- Principle: public read on kudos/hearts/hashtags/departments; owner-only write on hearts/secret_boxes.

-- ─── Enable RLS ─────────────────────────────────────────────────────────────
ALTER TABLE kudos              ENABLE ROW LEVEL SECURITY;
ALTER TABLE hearts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE hashtags           ENABLE ROW LEVEL SECURITY;
ALTER TABLE kudos_hashtags     ENABLE ROW LEVEL SECURITY;
ALTER TABLE kudos_highlight_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE secret_boxes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_days       ENABLE ROW LEVEL SECURITY;

-- ─── kudos ──────────────────────────────────────────────────────────────────
CREATE POLICY "kudos_select_auth" ON kudos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "kudos_insert_own" ON kudos
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- ─── hearts ─────────────────────────────────────────────────────────────────
CREATE POLICY "hearts_select_auth" ON hearts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "hearts_insert_own" ON hearts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "hearts_delete_own" ON hearts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ─── hashtags ───────────────────────────────────────────────────────────────
CREATE POLICY "hashtags_select_auth" ON hashtags
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "hashtags_insert_service" ON hashtags
  FOR INSERT TO service_role WITH CHECK (true);

-- ─── kudos_hashtags ─────────────────────────────────────────────────────────
CREATE POLICY "kudos_hashtags_select_auth" ON kudos_hashtags
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "kudos_hashtags_insert_service" ON kudos_hashtags
  FOR INSERT TO service_role WITH CHECK (true);

-- ─── kudos_highlight_flags ──────────────────────────────────────────────────
CREATE POLICY "kudos_highlight_select_auth" ON kudos_highlight_flags
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "kudos_highlight_manage_service" ON kudos_highlight_flags
  FOR ALL TO service_role USING (true);

-- ─── departments ────────────────────────────────────────────────────────────
CREATE POLICY "departments_select_auth" ON departments
  FOR SELECT TO authenticated USING (active = true);

-- ─── profiles ───────────────────────────────────────────────────────────────
CREATE POLICY "profiles_select_auth" ON profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ─── secret_boxes ───────────────────────────────────────────────────────────
CREATE POLICY "secret_boxes_select_own" ON secret_boxes
  FOR SELECT TO authenticated USING (auth.uid() = owner_id);

CREATE POLICY "secret_boxes_update_own" ON secret_boxes
  FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "secret_boxes_insert_service" ON secret_boxes
  FOR INSERT TO service_role WITH CHECK (true);

-- ─── special_days ───────────────────────────────────────────────────────────
CREATE POLICY "special_days_select_auth" ON special_days
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "special_days_manage_service" ON special_days
  FOR ALL TO service_role USING (true);
