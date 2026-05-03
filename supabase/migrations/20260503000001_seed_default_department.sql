-- Seed the default department used for users created via Google OAuth.
--
-- Background: Google OAuth doesn't expose Sun*'s internal `department_code`,
-- so every newly-provisioned profile is auto-assigned `CEVC1` until an admin
-- updates it (see `lib/kudos/constants.ts → DEFAULT_DEPARTMENT_CODE`).
-- The application's `ensureProfile` helper relies on this row already
-- existing — `profiles.department_code` is a FK to `departments(code)`, so
-- without this seed the very first OAuth login would fail with a 23503
-- foreign-key violation.

INSERT INTO departments (code, name, active)
VALUES ('CEVC1', 'CEVC1', TRUE)
ON CONFLICT (code) DO NOTHING;
