-- Allow an authenticated user to INSERT their own row into `profiles`.
--
-- Background: `profiles` had RLS enabled in 20260427000007_rls_policies.sql
-- with SELECT (auth) and UPDATE (own) policies, but NO INSERT policy. The
-- `ensureProfile` helper called from the OAuth callback issues an upsert
-- under the user's session — for a brand-new Google sign-in this resolves
-- to an INSERT, which RLS silently blocked. Result: new users had no
-- `profiles` row, so the Kudos board fell back to email/blank avatar and
-- any FK targeting `profiles.id` (kudos.sender_id, etc.) failed downstream.
--
-- Self-insert is safe: `WITH CHECK (auth.uid() = id)` ensures users can
-- only create the row keyed to their own auth user id.

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
