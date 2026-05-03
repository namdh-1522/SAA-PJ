-- Migration: Provision Supabase Storage bucket `kudos-images` for the Viết Kudo feature.
-- See .momorph/specs/ihQ26W78P2-Viet-Kudo/plan.md §Architecture / Backend / Storage.

-- ─── 1. Create the bucket (idempotent) ──────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('kudos-images', 'kudos-images', true)
ON CONFLICT (id) DO NOTHING;

-- ─── 2. Object policies ─────────────────────────────────────────────────────
-- READ: any authenticated user can read kudos images (they appear in the public feed).
DROP POLICY IF EXISTS "kudos_images_read_auth" ON storage.objects;
CREATE POLICY "kudos_images_read_auth" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'kudos-images');

-- INSERT: only the owning user may upload into their own prefix `${user_id}/...`.
-- We compare the first path segment to auth.uid() to enforce this.
DROP POLICY IF EXISTS "kudos_images_insert_own" ON storage.objects;
CREATE POLICY "kudos_images_insert_own" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'kudos-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- DELETE: same constraint — only delete files in your own prefix (e.g., when removing a thumbnail).
DROP POLICY IF EXISTS "kudos_images_delete_own" ON storage.objects;
CREATE POLICY "kudos_images_delete_own" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'kudos-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
