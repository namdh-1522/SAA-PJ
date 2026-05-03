# Implementation Plan: Language Dropdown (Dropdown — Ngôn ngữ)

**Frame**: `hUyaaugye2-Dropdown-ngon-ngu`
**Date**: 2026-04-29
**Spec**: [`./spec.md`](./spec.md)
**Design Style**: [`./design-style.md`](./design-style.md)

---

## Summary

The Language Dropdown is **partially implemented**: a stub `<LanguageSelector />` component
exists at [components/ui/language-selector.tsx](../../../components/ui/language-selector.tsx)
and is already wired into [components/ui/header-controls.tsx](../../../components/ui/header-controls.tsx).
The existing implementation:

- ✅ Has the trigger button + dropdown shell + outside-click dismiss + cookie-based locale write.
- ❌ Lists **only `vi`** — `en` row is missing.
- ❌ Persists **only to `NEXT_LOCALE` cookie** — does not write to `users.locale` (FR-011 / Q1).
- ❌ Visual tokens **diverge from design** — uses `bg-white/0.08` greyscale tints instead of the
  brand-yellow `rgba(255, 234, 158, 0.20)` selected highlight.
- ❌ **No keyboard support** beyond the implicit button focus — no `Escape` close, no arrow-key
  navigation between items, no focus return on dismiss.
- ❌ **No GB-NIR flag icon** — must be added to match design FR-012.
- ❌ Wrong dropdown sizing (122 × 124 panel + 1 px highlight inset) per spec FR-015.

The plan therefore is **refactor + extend**, not greenfield. Net-new work:

1. **Frontend** — refactor `<LanguageSelector />` to satisfy FR-001…FR-015, add the GB-NIR
   flag icon, redesign visual tokens against `design-style.md`, add full keyboard contract
   (Escape, ↑/↓, focus return), add ARIA, add motion (with `prefers-reduced-motion`), and
   add the EN locale row.
2. **Backend** — add `PUT /api/users/me` route handler with Zod-validated `{ locale }` body.
3. **Database** — new Supabase migration creating `public.user_preferences (user_id PK,
   locale text CHECK)` with RLS so an authenticated user can read/upsert their own row.
4. **i18n** — update [i18n/request.ts](../../../i18n/request.ts) to source the active locale
   from `user_preferences.locale` (server-read on each request) with the existing cookie
   as fast-path fallback for unauthenticated routes.
5. **Tests** — Vitest component tests for the dropdown's behaviour, Vitest integration test
   for the PUT route hitting a real Supabase test DB (Constitution §III), Playwright E2E
   asserting the `vi → en` happy path on Homepage SAA / Awards Information.

---

## Technical Context

| Concern | Decision |
|---------|----------|
| **Language / Framework** | TypeScript 5 (strict), Next.js 16.2.4 (App Router) |
| **UI runtime** | React 19.2.4 — Client Component (`'use client'`) per TR-002 |
| **Primary dependencies** | `next-intl ^4.9.1`, `@supabase/ssr ^0.10.2`, `@supabase/supabase-js ^2.104.0`, `@tanstack/react-query ^5.100.5`, `zod ^3.25.76`, `tailwindcss ^4` |
| **Database** | Supabase Postgres; new table `public.user_preferences` |
| **Server validation** | Zod `z.object({ locale: z.enum(['vi','en']) })` (Constitution §V, TR-007) |
| **State management** | Local `useState` (open / focused index) + `next-intl` `useLocale()` / `setLocale()` (global locale) + TanStack Query mutation (fire-and-forget PUT) |
| **API style** | Next.js Route Handler at `app/api/users/me/route.ts` (PUT) |
| **Testing** | Vitest 2.1.9 (unit + integration); Playwright 1.59.1 (E2E) |
| **Styling** | Tailwind v4 utilities + CSS variables in `app/globals.css` (Constitution §II) |
| **Fonts** | Montserrat 700 (already loaded via `next/font` in [app/layout.tsx](../../../app/layout.tsx)) |

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin.*

| Constitution rule | How this plan complies | Status |
|-------------------|------------------------|:------:|
| **§I Clean Code** — kebab-case for non-component modules, PascalCase for components | New files: `language-selector.tsx` (kept; PascalCase default export), `gb-nir-flag-icon.tsx`, `user-preferences.ts` (lib), `route.ts` (API handler) | ✅ |
| **§I** — Business logic in service modules | Locale-write logic lives in `lib/user-preferences.ts` (server) + `useLocaleMutation` hook (client) — NOT in the component | ✅ |
| **§I** — One direction of dependencies | route.ts → service (lib/user-preferences) → supabase server client. No cycles. | ✅ |
| **§II RSC default** | Component remains a Client Component (interactive overlay) — exception per TR-002 | ✅ |
| **§II Supabase server client** | PUT handler uses `createServerClient` (per `lib/supabase/server.ts`) for the session | ✅ |
| **§II RLS** | New migration includes RLS policies allowing authenticated user to SELECT/INSERT/UPDATE only their own `user_preferences` row | ✅ |
| **§II Tailwind + CSS vars** | No raw colours in component body; all tokens added to `globals.css` and consumed via `bg-[var(--…)]` | ✅ |
| **§II `next/font`** | Montserrat already loaded in root layout | ✅ |
| **§II `@/*` alias** | All imports use `@/components/...` etc. | ✅ |
| **§III TDD — Vitest** | Vitest component tests for FR-001…FR-007, FR-009, FR-014, FR-015 written first; locale-write integration test against local Supabase DB (no DB mocks per §III) | ✅ |
| **§III TDD — Playwright** | E2E asserts US1 Acceptance Scenario 2 (click EN → strings re-render synchronously) | ✅ |
| **§IV — Responsive breakpoints** | Single anchored 122 × 124 px panel for mobile / tablet / desktop (Q8 locked) | ✅ |
| **§IV — MD3 / WCAG** | 56 px row height (≥ 48 px touch target), `2px #FFEA9E` focus ring (≈ 16:1 contrast on `#00070C`), `aria-checked` on the active locale row | ✅ |
| **§IV — Source-of-truth navigation** | No route change → no SCREENFLOW Navigation Graph entry needed for per-row clicks | ✅ |
| **§V Input validation** | Zod schema on PUT body | ✅ |
| **§V Auth** | PUT writes only the current user's row (RLS-enforced); no `service_role` key | ✅ |
| **§V No secrets in client** | Component reads/writes via `next-intl` + the authenticated PUT — no service keys in the bundle | ✅ |
| **§V Dependency hygiene** | All deps already in `package.json`; no new dependencies needed | ✅ |

**Violations**: none. **Exceptions**: none.

---

## Architecture Decisions

### Frontend approach

- **Component pattern**: a single Client Component — `<LanguageSelector />` (default export at
  `components/ui/language-selector.tsx`) — owns the trigger button, the dropdown panel, and
  per-row rendering. The spec's `<LanguageMenu />` reference (FR-001, SC-004) is treated as
  the same component under its existing project name; no rename to avoid churn in
  [components/ui/header-controls.tsx](../../../components/ui/header-controls.tsx) and to keep
  the diff focused. SC-004's "single component file" invariant is satisfied (one file,
  PascalCase default export) regardless of the symbol's exact name.
- **Subcomponent split**: extract a colocated `LanguageMenuItem` (still in the same file) for
  the per-row renderer to keep the parent component focused on open/close state.
- **Styling strategy**: Tailwind v4 utility classes consuming CSS variables added to
  [app/globals.css](../../../app/globals.css) (`--color-details-container-2`,
  `--color-details-border`, `--color-selected-bg`, `--color-selected-bg-hover`,
  `--color-selected-bg-active`, `--color-default-bg-hover`, `--color-default-bg-active`,
  `--color-focus-ring`). No raw hex/rgba in the component body.
- **Data fetching**: locale itself comes from `useLocale()` (client) and is set via
  `setLocale()` (client navigation refresh). The fire-and-forget PUT uses TanStack Query's
  `useMutation` (no retry, no cache invalidation, only side-effect logging on failure).
- **Motion**: pure CSS transitions on `opacity` / `transform` and `background-color` (per
  `design-style.md`). No JS animation library. `prefers-reduced-motion: reduce` honoured via
  Tailwind `motion-reduce:transition-none`.
- **Accessibility primitive**: hand-rolled (Radix `DropdownMenu` is approved in the constitution
  but the existing seed already uses bare `button` + `ul`/`li` with `role` overrides; bringing
  Radix in for two items is over-engineering and would rewrite working code. If this proves
  fragile, escalate to Radix in a follow-up — not now). Single-open invariant (Edge Case)
  deferred to the header-shell pass; this plan emits an `onOpen` callback prop the header can
  hook into later.

### Backend approach

- **API design**: a single Route Handler at `app/api/users/me/route.ts` exposing **PUT** with
  body `{ locale: 'vi' | 'en' }`. The existing `app/api/users/me/stats/route.ts` is unrelated
  — no impact, no shared file. Returns `204 No Content` on success.
- **Authorization**: `createServerClient` reads the Supabase session from cookies; if no
  session, return `401`. The query is `upsert` on `user_preferences` keyed by
  `auth.uid()` — the only row a user can ever touch (RLS-enforced).
- **Validation**: Zod schema, parsed in the route handler. On parse failure → `400` with a
  generic error body (no Zod issues echoed to avoid leaking field paths).
- **Data access**: thin service module at `lib/user-preferences.ts` with two functions —
  `getUserLocale(supabase)` (returns `Locale | null`) and `upsertUserLocale(supabase, locale)`
  (returns `void`). Both take an injected client so the same module is reusable in tests
  and in `i18n/request.ts`.

### Database approach

- New table `public.user_preferences` with shape:
  ```sql
  CREATE TABLE public.user_preferences (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    locale  text NOT NULL CHECK (locale IN ('vi','en')),
    updated_at timestamptz NOT NULL DEFAULT now()
  );
  ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "user can read own preferences"
    ON public.user_preferences FOR SELECT
    USING (auth.uid() = user_id);

  CREATE POLICY "user can upsert own preferences"
    ON public.user_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "user can update own preferences"
    ON public.user_preferences FOR UPDATE
    USING (auth.uid() = user_id);
  ```
- **Why a separate table** (vs. `auth.users.raw_user_meta_data`): metadata mutations require
  the `service_role` key (must run server-side; cannot RLS-protect granular writes). A
  separate `public` table is the canonical, RLS-friendly path and matches the constitution's
  "RLS on every table" rule. Keeps `auth.users` un-touched.
- **Why not extend an existing custom users table**: there is no existing `public.users`
  (verified — only kudos-related tables in `supabase/migrations/`). Creating a brand-new
  general "users" table is out of scope for this feature; a focused `user_preferences`
  table is the minimum viable surface and can be joined into a wider `users` table later
  without breaking change.

### i18n approach

- Update [i18n/request.ts](../../../i18n/request.ts):
  ```
  resolveLocale priority:
    1. user_preferences.locale (if Supabase session exists — use server client + service)
    2. NEXT_LOCALE cookie (existing behaviour — fast path for unauthenticated routes)
    3. Accept-Language header (existing fallback)
    4. 'vi' (default)
  ```
- Both `messages/vi.json` and `messages/en.json` continue to be imported via dynamic
  `import()`. In Next.js 16's bundler, both files end up in the initial JS payload regardless
  of which one is selected at request time (the `import()` is resolved at build time when the
  argument is a static interpolation), satisfying FR-014. **Verification step in Phase 1**:
  inspect the production bundle (`next build` + `next analyze` or manual `.next/static`
  inspection) to confirm both JSON modules are present.
- The existing `LanguageSelector.selectLocale()` writes the cookie + `router.refresh()`. Keep
  the cookie write as a fast-path mirror so server-rendered pages render correctly even
  on the first response (before the PUT lands). The PUT is the durable source of truth on
  the next session.

### Integration points

- **Existing services / files modified**:
  - [components/ui/language-selector.tsx](../../../components/ui/language-selector.tsx) — refactor.
  - [components/ui/header-controls.tsx](../../../components/ui/header-controls.tsx) — no change (already imports the component).
  - [i18n/request.ts](../../../i18n/request.ts) — extend `resolveLocale` priority.
  - [app/globals.css](../../../app/globals.css) — add new CSS variables.
  - [messages/vi.json](../../../messages/vi.json) + [messages/en.json](../../../messages/en.json) — add a `LanguageMenu` namespace with `triggerAriaLabel`, `vi`, `en`.
- **Existing components reused**:
  - [components/icons/vn-flag-icon.tsx](../../../components/icons/vn-flag-icon.tsx) — already correct asset for VN row.
  - [components/icons/chevron-down-icon.tsx](../../../components/icons/chevron-down-icon.tsx) — used by the trigger button.
  - [components/providers/query-provider.tsx](../../../components/providers/query-provider.tsx) — already wraps the app, so `useMutation` is available.
- **API contracts** — `PUT /api/users/me` to be documented in `momorph.apispecs` (out of
  scope for this plan; flagged in Dependencies).

---

## Project Structure

### Documentation (this feature)

```
.momorph/specs/hUyaaugye2-Dropdown-ngon-ngu/
├── spec.md              # Feature specification (existing — reviewed)
├── design-style.md      # Design specifications (existing — reviewed)
├── plan.md              # This file
├── tasks.md             # To be generated by `momorph.tasks` (next step)
└── assets/
    └── frame.png        # Figma reference (existing)
```

### Source code (new + modified files)

```
my-app/
├── app/
│   └── api/
│       └── users/
│           └── me/
│               └── route.ts                       # NEW — PUT handler (Zod-validated)
├── components/
│   ├── icons/
│   │   └── gb-nir-flag-icon.tsx                   # NEW — Northern Ireland flag SVG (per FR-012)
│   └── ui/
│       └── language-selector.tsx                  # MODIFIED — full rewrite of body, file kept
├── i18n/
│   └── request.ts                                 # MODIFIED — add user_preferences read step
├── lib/
│   ├── user-preferences.ts                        # NEW — getUserLocale / upsertUserLocale service
│   └── validators/
│       └── locale.ts                              # NEW — Zod schema (`localeSchema`)
├── messages/
│   ├── vi.json                                    # MODIFIED — add `LanguageMenu` namespace
│   └── en.json                                    # MODIFIED — add `LanguageMenu` namespace
├── app/
│   └── globals.css                                # MODIFIED — add 8 CSS variables
├── supabase/
│   └── migrations/
│       └── 20260429000001_create_user_preferences.sql   # NEW — table + 3 RLS policies
└── tests/
    ├── unit/
    │   └── components/
    │       └── language-selector.test.tsx         # NEW — Vitest component tests
    ├── integration/
    │   └── api/
    │       └── users-me-locale.test.ts            # NEW — Vitest + real Supabase test DB
    └── e2e/
        └── language-dropdown.spec.ts              # NEW — Playwright E2E (vi → en happy path)
```

### Dependencies

**No new packages required.** Every dependency the plan needs is already in
[package.json](../../../package.json):

| Need | Existing package | Version |
|------|------------------|---------|
| Client overlay state | React 19 (`useState`, `useEffect`, `useRef`) | 19.2.4 |
| i18n provider / hooks | `next-intl` | ^4.9.1 |
| Server data fetch (locale persistence mutation) | `@tanstack/react-query` | ^5.100.5 |
| Server / browser Supabase clients | `@supabase/ssr`, `@supabase/supabase-js` | ^0.10.2 / ^2.104.0 |
| Zod validation | `zod` | ^3.25.76 |
| Styling | `tailwindcss` v4 | ^4 |
| Tests | `vitest`, `@testing-library/react`, `@playwright/test` | ^2.1.9 / ^16.3.2 / ^1.59.1 |

---

## Implementation Strategy

### Phase 0 — Asset preparation

The Figma frame contains only flag instances and text — no image media to download via
`get_media_files`. The two flag SVGs are pure code:

- VN flag — already implemented at [components/icons/vn-flag-icon.tsx](../../../components/icons/vn-flag-icon.tsx).
- GB-NIR flag — new file `components/icons/gb-nir-flag-icon.tsx`. Implement as inline SVG
  matching the same prop interface (`width`, `height`, `className`, `aria-hidden`). Source
  artwork is the Northern Ireland Government Flag (per Figma source); use a clean SVG path
  (e.g. from a public-domain Wikipedia SVG) — **NO external `<img>` source** (Constitution §II).

### Phase 1 — Foundation (Tests first)

Per Constitution §III "Test-First Development — NON-NEGOTIABLE", author tests **before** any
implementation lands. All three test files MUST be committed in a Red state and reviewed
before Phase 2 begins.

1. **Component test** ([tests/unit/components/language-selector.test.tsx](../../../tests/unit/components/language-selector.test.tsx)):
   - Renders trigger with current-locale flag + `aria-haspopup="menu"`, `aria-expanded="false"`.
   - Open / close on trigger click; close on outside click; close on `Escape` (with focus
     return); no close while interacting inside the panel.
   - Lists exactly two rows, in fixed order `VN` first then `EN` (FR-002).
   - Selected row receives the yellow-tinted treatment based on the active locale, NOT a
     hard-coded index (US1 Scenario 3, FR-003).
   - Click on the active row is a no-op (US1 Scenario 5).
   - Click on the non-active row calls `setLocale()`, fires the mutation, and closes the panel.
   - Keyboard: ↑/↓ moves focus; `Enter` / `Space` selects (US3).
   - ARIA: `aria-checked` set on the active row only.
2. **Integration test** ([tests/integration/api/users-me-locale.test.ts](../../../tests/integration/api/users-me-locale.test.ts)):
   - Hits the local Supabase test DB (no mocks, per §III). Uses `npm run supabase:start`.
   - `PUT /api/users/me { locale: 'en' }` → `204`; row written.
   - Idempotent: repeated PUTs with same value → still `204`, single row.
   - Switch to `'vi'` then back to `'en'` → final row reflects last write.
   - Invalid body `{ locale: 'fr' }` → `400`, no row mutation.
   - No session → `401`, no row mutation.
   - User can ONLY mutate their own row (RLS) — direct query attempting another `user_id`
     is rejected.
3. **E2E test** ([tests/e2e/language-dropdown.spec.ts](../../../tests/e2e/language-dropdown.spec.ts)):
   - Sign in (existing auth fixture).
   - Land on `/about-saa-2025`. Verify Vietnamese hero string is visible.
   - Open language dropdown, click `EN`, assert the same hero block re-renders with the
     English string and the URL is unchanged.
   - Reload the page; confirm `EN` is still active (cookie + DB persisted).
   - Open dropdown again; confirm `EN` row is yellow-tinted, `VN` is transparent.

### Phase 2 — Database + API (US4 backbone — required for FR-011 even though US4 is P3 because the test gates demand a working PUT)

1. Add migration `supabase/migrations/20260429000001_create_user_preferences.sql` (see SQL
   above). Include in the same migration the three RLS policies for SELECT / INSERT / UPDATE.
2. Add `lib/validators/locale.ts`:
   ```ts
   import { z } from 'zod'
   export const localeSchema = z.enum(['vi', 'en'])
   export type Locale = z.infer<typeof localeSchema>
   ```
3. Add `lib/user-preferences.ts`:
   ```ts
   import type { SupabaseClient } from '@supabase/supabase-js'
   import type { Locale } from '@/lib/validators/locale'
   export async function getUserLocale(supabase: SupabaseClient): Promise<Locale | null> { … }
   export async function upsertUserLocale(supabase: SupabaseClient, locale: Locale) { … }
   ```
4. Add `app/api/users/me/route.ts` exporting `PUT` only. Body parsed with
   `localeSchema.safeParse(await request.json())`. Returns `204` on success, `400` on
   parse failure, `401` on missing session.
5. Run integration tests (Phase 1) and confirm Green.

### Phase 3 — i18n provider + globals

1. Update `i18n/request.ts` to call `getUserLocale(serverClient)` first, falling back to the
   existing cookie + Accept-Language chain. Catch any session errors and treat as anonymous
   (no DB read).
2. Add new CSS variables to `app/globals.css`:
   ```css
   :root {
     --color-details-container-2: #00070C;
     --color-details-border: #998C5F;
     --color-brand-yellow: #FFEA9E;
     --color-selected-bg: rgba(255, 234, 158, 0.20);
     --color-selected-bg-hover: rgba(255, 234, 158, 0.28);
     --color-selected-bg-active: rgba(255, 234, 158, 0.32);
     --color-default-bg-hover: rgba(255, 234, 158, 0.10);
     --color-default-bg-active: rgba(255, 234, 158, 0.18);
     --color-focus-ring: #FFEA9E;
   }
   ```
3. Add `LanguageMenu` namespace to both message bundles:
   ```json
   "LanguageMenu": {
     "triggerAriaLabel": "Select language (currently {locale})",
     "vi": "Tiếng Việt",
     "en": "English"
   }
   ```
   (English bundle uses `"Tiếng Việt"` and `"English"` — same labels, English `aria-label`.)

### Phase 4 — Component rewrite (US1 + US2 + US3)

Refactor [components/ui/language-selector.tsx](../../../components/ui/language-selector.tsx):

1. Add the `en` row to the `LOCALES` table with `Flag: GbNirFlagIcon`.
2. Replace `useState('vi')` + cookie read with `useLocale()` from `next-intl` for the active
   value. Keep the cookie write inside `selectLocale` for fast-path SSR; add the
   `useMutation` call for the PUT.
3. Add keyboard contract: `Escape` closes (with focus return — store the trigger ref);
   `↑` / `↓` move focus between rows; `Enter` / `Space` selects the focused row; trigger
   re-click toggles.
4. Rewrite the panel JSX to match `design-style.md` exactly: 122 × 124 panel, 6 px padding,
   1 px `#998C5F` border, 8 px radius, dark `#00070C` background, anchored
   `top-[calc(100%+4px)] right-0`, `z-50`. Two 110 × 56 rows; selected row's yellow highlight
   is 108 × 56 (1 px inset per FR-015) with `2px` radius; default row's inner content frame
   has `4px` radius.
5. Replace all greyscale `bg-white/...` tints with the yellow-α tokens added in Phase 3.
6. Wire `aria-haspopup="menu"`, `aria-expanded`, `aria-controls` on the trigger;
   `role="menu"` + `aria-activedescendant` on the panel; `role="menuitemradio"` +
   `aria-checked` per row. (Spec accepts `menu`/`menuitemradio` OR `listbox`/`option`; we
   pick `menu` because it semantically matches "two mutually-exclusive choices that close
   on selection" better than a listbox.)
7. Add motion: panel `opacity` + `translateY(-4px → 0)` 150 ms ease-out (open) / ease-in
   (close); rows `bg-color` 120 ms ease-in-out. Use `motion-reduce:transition-none` to
   honour `prefers-reduced-motion`.
8. Run component tests (Phase 1) and confirm Green.

### Phase 5 — E2E + Polish

1. Run the Playwright E2E (Phase 1) and confirm Green.
2. Run an axe-core audit inside the E2E open-dropdown step → SC-003 (zero violations).
3. Manually verify on the dev server (`npm run dev`):
   - Mobile viewport (360 × 640) — anchored panel still anchors correctly.
   - `prefers-reduced-motion: reduce` (Chrome devtools rendering tab) → no slide.
   - Switch locale, reload, sign out, sign back in → preserved (US4).
4. Bundle audit: confirm both `messages/vi.json` and `messages/en.json` end up in the same
   chunk (FR-014 verification).

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|:----:|:----:|------------|
| **R1** — Hydration mismatch when `i18n/request.ts` reads from `user_preferences` and the cookie disagrees | Medium | High (white-screen / React hydration warning) | After every successful `selectLocale`, write the cookie BEFORE calling `router.refresh()` so the next SSR pass sees the same value. Integration test asserts cookie + DB are in sync after a switch. |
| **R2** — `next.config.ts` dynamic `import()` does NOT bundle both locales eagerly (FR-014 broken; we'd silently regress to lazy fetch) | Low | Medium (loading flash on switch; no functional break) | Phase 5 bundle audit. If only one bundle ships, switch the dynamic `import()` in `i18n/request.ts` to a static `import` map keyed by locale literal. |
| **R3** — RLS migration locks out the test fixture user | Low | High (CI red) | Integration test uses an authenticated test session created via `supabase.auth.signUp` in `beforeAll`; never tries to write another user's row. |
| **R4** — Existing `<LanguageSelector />` is imported and rendered by other pages besides the header (rare but possible — would surface different selection contexts) | Low | Low | `grep -r 'LanguageSelector' --include='*.tsx'` before refactor; if found elsewhere, surface in tasks.md. |
| **R5** — `auth.users.id` cascade delete leaves orphan `user_preferences` rows during account deletion | Very low | Low | `ON DELETE CASCADE` in the migration handles this directly. |
| **R6** — Single-open invariant (close other header overlays when this one opens) is owned by the header shell, not this component — risk of stale spec note | Low | Low | Component emits an `onOpen?: () => void` prop the header can wire to its overlay context in a follow-up. Plan does NOT implement the registry — a follow-up task. |
| **R7** — GB-NIR SVG path complexity (the Saint Patrick's Saltire + Star + Crown is more intricate than a simple flag) | Medium | Low | Use a known, public-domain SVG path (e.g. derived from Wikipedia Commons). If quality is poor at 20 × 15, render at 24 × 24 with `viewBox="0 0 24 24"` to absorb the detail. |

### Estimated complexity

- **Frontend**: Medium (existing component to refactor + accessibility + motion).
- **Backend**: Low (single endpoint, single Zod schema, well-trodden path).
- **Database**: Low (single table, three RLS policies).
- **Testing**: Medium (Playwright fixture wiring + axe-core integration take longer than the
  unit work).

---

## Integration Testing Strategy

### Test scope

- [x] **Component / module interactions** — `<LanguageSelector />` ↔ `next-intl` provider ↔ TanStack Query mutation ↔ PUT route handler.
- [x] **External dependencies** — Supabase Postgres (real, via `npm run supabase:start`); Supabase Auth (real session).
- [x] **Data layer** — `user_preferences` row read on SSR (`i18n/request.ts`) and written on PUT.
- [x] **User workflows** — End-to-end: open dropdown → click EN → page strings re-render → reload → still EN.

### Test categories

| Category | Applicable? | Key scenarios |
|----------|:----:|-----|
| UI ↔ Logic | Yes | Open / close / select / keyboard nav (Vitest component tests) |
| Service ↔ Service | Yes | `i18n/request.ts` calls `getUserLocale()` → server Supabase client → `user_preferences` row |
| App ↔ External API | Yes (real Supabase) | PUT route → real local Supabase → row insert / update |
| App ↔ Data Layer | Yes | RLS isolation — user A cannot mutate user B's `user_preferences` |
| Cross-platform | Yes | Mobile (360px) / Tablet (768px) / Desktop (1280px) — anchored panel renders identically |

### Test environment

- **Environment type**: Local Supabase via `npm run supabase:start` (Docker). Vitest
  integration suite uses `tests/integration/...` directory pattern (already present in
  `package.json` scripts).
- **Test data strategy**: per-test `auth.signUp` to create a fresh user; clean up via
  cascade. No shared fixtures across tests.
- **Isolation approach**: each integration test wraps writes in a transaction OR creates a
  unique user — choose unique-user approach for simplicity (matches existing pattern in
  `lib/kudos/...` if any; verify in tasks).

### Mocking strategy

| Dependency | Strategy | Rationale |
|-----------|----------|-----------|
| Supabase Postgres | **Real** | Constitution §III "mocking the database is PROHIBITED" |
| Supabase Auth | **Real** | Same reason — session cookies are exercised end-to-end |
| `next-intl` provider | **Real** in component tests (wrap with `<NextIntlClientProvider>` + a tiny in-memory message map) | Avoids stubbing the public API surface |
| `useRouter` (next navigation) | **Stub** | Vitest `vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }))` — pure indirection, no business value in the real router |
| Network / `fetch` for the PUT | **MSW** (component tests only — assert the request was sent) | Avoids cross-process integration in unit tests; integration tests use real route |

### Test scenarios outline

1. **Happy path**
   - [ ] Open dropdown → click `EN` → strings re-render → `aria-checked` on `EN` row.
   - [ ] Reload → `EN` still active (cookie + DB).
2. **Error handling**
   - [ ] PUT returns 500 → locale still switched client-side, no toast surfaced (FR-011).
   - [ ] PUT body validation rejects `'fr'` → 400, row unchanged.
3. **Edge cases**
   - [ ] Click already-active locale → silent no-op (US1 Scenario 5).
   - [ ] `Escape` returns focus to trigger (US2 Scenario 2).
   - [ ] `prefers-reduced-motion` disables slide (FR-013).
   - [ ] Anonymous `i18n/request.ts` falls back to cookie when there's no session.

### Tooling & framework

- **Test framework**: Vitest 2.1.9 (unit + integration via `tests/integration/`) + Playwright 1.59.1 (E2E).
- **Supporting tools**: `@testing-library/react`, `@testing-library/user-event`, `happy-dom` (DOM env), `jsdom` (alt DOM env), `axe-core` (E2E accessibility audit — already present in deps? verify in tasks).
- **CI integration**: existing `npm test` (unit) and `npm run test:integration` scripts. Playwright suite to be wired into the CI flow defined in Constitution §"Development Workflow".

### Coverage goals

| Area | Target | Priority |
|------|:----:|:----:|
| Core user flows (open / close / select / persist) | 95 %+ | High |
| Integration points (`/api/users/me` PUT + RLS) | 90 %+ | High |
| Error scenarios (validation, auth, RLS denial) | 80 %+ | Medium |
| A11y (axe-core open-state audit) | 0 violations | High |

---

## Dependencies & Prerequisites

### Required before start

- [x] **Constitution** ([.momorph/constitution.md](../../constitution.md)) reviewed.
- [x] **Spec** ([./spec.md](./spec.md)) reviewed and confirmed (`momorph.reviewspecify` × 2 — all 9 clarifications resolved).
- [x] **Design style** ([./design-style.md](./design-style.md)) reviewed and locked.
- [ ] **API specs** ([.momorph/contexts/](../../contexts/)) — `momorph.apispecs` has not yet documented `PUT /api/users/me`. **Non-blocking** for this plan; the PUT contract is fully specified within this document and `spec.md` TR-007. Add to `momorph.apispecs` as a follow-up.
- [ ] **Backend API test cases** ([.momorph/contexts/BACKEND_API_TESTCASES.md](../../contexts/BACKEND_API_TESTCASES.md)) — file does not exist in the project. **Non-blocking**; the integration test file in this plan covers the PUT route's contract and is itself the authoritative test artefact. Surface during `momorph.tasks` whether to retroactively add it.
- [x] **Database design** — no `database.sql` snapshot exists, but the migration in this plan is self-describing and references existing Supabase Auth (`auth.users`) which is built-in.
- [x] **Screen flow** ([.momorph/SCREENFLOW.md](../../SCREENFLOW.md)) — Language Dropdown row added under "In-page Overlays". One stale follow-up (`/api/i18n/:locale` reference) is owned by the next `momorph.screenflow` pass.
- [x] **i18n library** — `next-intl` already installed and wired (TR-010 satisfied at the codebase level — no install step needed).

### External dependencies

- **Supabase project** — already configured (existing `lib/supabase/{client,server,middleware}.ts`).
- **Local Supabase via Docker** — `npm run supabase:start` script exists.
- **Public-domain GB-NIR flag SVG** — to be sourced (e.g. Wikipedia Commons), inlined into `gb-nir-flag-icon.tsx`. No external runtime dependency.

---

## Open Questions

- [ ] **OQ-1** — Should the locale-write PUT live at `app/api/users/me/route.ts` (PUT) or at a dedicated `app/api/users/me/locale/route.ts` (PUT)? The plan picks the former (single endpoint, validated body) for simplicity. If the team has a "PATCH/PUT shape per resource sub-field" convention, raise during `momorph.tasks` and refactor the path. Non-blocking.
- [ ] **OQ-2** — Should the dropdown component register itself with a header-overlay context to enforce the single-open invariant (close other overlays on open) now, or is that a follow-up after the avatar-menu and floating-widget overlays exist? Plan defers to follow-up; component exposes an `onOpen?: () => void` prop ready to be hooked in. Non-blocking.
- [ ] **OQ-3** — `auth.users.id` cascade vs `RESTRICT`: cascade chosen for `user_preferences` so account deletion cleans up. Confirm during `momorph.database` review.
- [ ] **OQ-4** — Symbol name discrepancy: the spec writes `<LanguageMenu />` while the codebase uses `<LanguageSelector />`. Plan keeps `LanguageSelector` (default export at `language-selector.tsx`) to minimise churn. Confirm acceptable, otherwise rename and update `header-controls.tsx`. Non-blocking.

---

## Next Steps

After plan approval:

1. **Run `/momorph.tasks`** to generate the `tasks.md` breakdown — expect ~15 tasks across
   the 5 phases above, with Phase 1 (tests) and Phase 2 (DB + API) parallelisable across
   two contributors.
2. **Run `/momorph.apispecs`** in parallel to add `PUT /api/users/me` to the API
   documentation (spec dependency).
3. **Run `/momorph.database`** in parallel to formalise the `user_preferences` migration
   in any DB-design snapshot.
4. **Begin implementation** in task order — Phase 1 tests first per Constitution §III.

---

## Notes

- The plan deliberately **scopes the database work narrowly** (a single `user_preferences`
  table) rather than introducing a wider `public.users` table. If a future feature needs
  general user metadata (display name, avatar URL, etc.), `public.users` should be
  introduced in its own migration and `user_preferences` either merged into it or kept as
  a 1:1 satellite table. Keeping the surface small avoids carving out cross-feature design
  decisions inside this dropdown's plan.
- The plan keeps the existing **cookie-based persistence as a fast-path mirror** of the
  durable DB write, on purpose. Removing it would force every page render to await a DB
  call — costly. Risk R1 covers the hydration consistency concern directly.
- The component is **deliberately not migrated to Radix `DropdownMenu`** despite the
  constitution approving it for `ImageLightbox`. Radix is appropriate when complex menu
  patterns (sub-menus, item types, custom positioning) demand it; for two flat items, the
  hand-rolled implementation is smaller, easier to reason about, and matches the existing
  seed. If accessibility tests flag gaps the hand-rolled version cannot meet, escalate to
  Radix in a follow-up.
- **No new dependencies** — the implementation uses only what's already in
  [package.json](../../../package.json). This is intentional and tracks Constitution §V
  "Dependency hygiene".
