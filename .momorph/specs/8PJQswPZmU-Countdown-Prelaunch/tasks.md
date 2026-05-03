# Tasks: Countdown - Prelaunch page

**Frame**: `8PJQswPZmU-Countdown-Prelaunch`
**Prerequisites**: plan.md ✅ spec.md ✅ design-style.md ✅
**Created**: 2026-04-27
**Generated from**: `/momorph.tasks` after plan.md review (all gaps closed)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel with other `[P]` tasks in the same group (different files, no dependency on an incomplete task)
- **[Story]**: Which user story this belongs to (US1–US3). Omitted for Setup / Foundational / Polish phases.
- **|**: File path the task creates or modifies

**TDD note (Constitution §III)**: Within every implementation pair, the test MUST be authored and FAILING before the implementation is written. Test-writing tasks are marked `[P]` because different test files are independent.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Directory scaffolding, CSS tokens, i18n keys. These unblock every subsequent phase. No code logic, no tests required here.

- [x] T001 Create directory scaffolding (`app/prelaunch/`, `components/prelaunch/`, `lib/prelaunch/`, `tests/unit/prelaunch/`, `tests/integration/middleware/`, `tests/e2e/prelaunch/`) | project root
- [x] T002 Add prelaunch CSS design tokens to `:root` block per plan.md Phase 1.1 — `--spacing-prelaunch-page-px: 144px`, `--spacing-prelaunch-page-py: 96px`, `--spacing-prelaunch-section-gap: 120px`, `--spacing-prelaunch-units-gap: 60px`, `--spacing-prelaunch-unit-stack-gap: 21px`, `--spacing-prelaunch-digits-gap: 21px`, `--color-tile-border: #FFEA9E`, `--color-tile-fill-top: #FFFFFF`, `--color-tile-fill-bottom: rgba(255,255,255,0.10)`, `--radius-tile-prelaunch: 12px`, `--blur-tile-backdrop: blur(24.96px)`, `--overlay-prelaunch-cover: linear-gradient(18deg, #00101A 15.48%, rgba(0,18,29,0.46) 52.13%, rgba(0,19,32,0.00) 63.41%)` (z-index tokens NOT added — reuse existing `--z-hero-bg`, `--z-hero-overlay`, `--z-main-content`) | app/globals.css
- [x] T003 [P] Add `prelaunch` namespace to Vietnamese message file: `headline`, `days_label`, `hours_label`, `minutes_label`, `page_title`, `meta_description` with confirmed VN copy | messages/vi.json
- [x] T004 [P] Add matching `prelaunch` namespace to English message file with same keys; use `[TODO: EN translation]` for `headline`/`page_title`/`meta_description`; EN unit labels are already "DAYS"/"HOURS"/"MINUTES" | messages/en.json
- [x] T005 Add `NEXT_PUBLIC_PRELAUNCH_END=2026-06-07T18:30:00+07:00` and `NEXT_PUBLIC_SAA_EVENT_START=2026-07-07T18:30:00+07:00` comments to `.env.local` (if not present) and `.env.example` with documentation | .env.local, .env.example

**Checkpoint**: Directories exist, tokens declared, i18n keys present, env var documented. Phase 2 can now begin.

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: The `lib/prelaunch/config.ts` helper is needed by BOTH the middleware gate (US2) and the page's graceful fallback (US3). Must be complete before US1 tests can fully assert env-var behavior and before proxy.ts can be extended.

**⚠️ CRITICAL**: No user-story implementation may begin until this phase is complete.

- [x] T006 Write failing unit tests for `parsePrelaunchEnd()` and `isPrelaunchActive()`: undefined → null; empty string → null; `'not-a-date'` → null + `console.warn('Invalid NEXT_PUBLIC_PRELAUNCH_END')`; valid ISO → Date; `isPrelaunchActive(null)` → false; `isPrelaunchActive(pastDate)` → false; `isPrelaunchActive(futureDate)` → true | tests/unit/lib/prelaunch-config.test.ts
- [x] T007 Implement `parsePrelaunchEnd(iso: string | undefined): Date | null` and `isPrelaunchActive(cutoff: Date | null): boolean` per plan.md Phase 1.3 — make T006 pass | lib/prelaunch/config.ts

**Checkpoint**: Config helper green. `lib/prelaunch/config.ts` is tested and ready for import.

---

## Phase 3: User Story 1 — Visitor sees the prelaunch holding page (Priority: P1) 🎯 MVP

**Goal**: A visitor hitting any URL during the prelaunch window is served the full-bleed branded countdown page: keyvisual BG (`.home-hero-bg`), diagonal cover gradient, headline `<h1>`, and three glass-card countdown units (DAYS / HOURS / MINUTES), each showing a 2-digit zero-padded value that refreshes once per minute.

**Independent Test**: With `NEXT_PUBLIC_PRELAUNCH_END` set to a future ISO, run `npx vitest run tests/unit/prelaunch/` — all tests green. Then open a browser at `/prelaunch` and confirm the page renders the headline and six digit tiles, that a minute tick updates the MINUTES tile without a full reload, and that no `<a>`, `<button>`, or `<form>` elements are present in the DOM.

### Tests (TDD — write first, confirm FAILING before implementing)

- [x] T008 [P] Write failing unit tests for `<DigitTile>`: renders given char; falls back to `-` for null/undefined; renders `aria-hidden="true"`; outer element has class `rounded-[var(--radius-tile-prelaunch)]`; inner rectangle has `opacity-50` and `backdrop-blur-[24.96px]`; digit `<span>` is flex-centered | tests/unit/prelaunch/digit-tile.test.tsx
- [x] T009 [P] Write failing unit tests for `<CountdownUnit>`: `value={6}` renders tiles `'0'` and `'6'`; `value="--"` renders two `-` tiles; `value={9}` renders `'0'` and `'9'`; `value={100}` renders `'9'` and `'9'` + emits `console.warn`; `value={0}` renders two `'0'` tiles; label text rendered in `<span>` | tests/unit/prelaunch/countdown-unit.test.tsx
- [x] T010 [P] Write failing unit tests for `<PrelaunchCountdown>`: given valid `targetISO` renders 3 units with correct initial values (mock `Date.now` via `vi.setSystemTime`); after `vi.advanceTimersByTime(60_000)` values update; given `targetISO={undefined}` all tiles show `-`; headline is an `<h1>`; wrapper `<div>` has `aria-live="polite"` and `aria-atomic="true"`; zero interactive elements (`<a>`, `<button>`, `<form>`, `<input>`) in subtree (FR-005); countdown at zero renders `00/00/00` without any navigation call (FR-013) | tests/unit/prelaunch/prelaunch-countdown.test.tsx
- [x] T011 [P] Write failing unit tests for the prelaunch page RSC: mock `process.env.NEXT_PUBLIC_PRELAUNCH_END` to valid ISO → rendered HTML contains non-`--` digit values; mock env missing → all tiles show `--` and `console.warn` was called; metadata has `robots: { index: false, follow: false }` (TR-004) | tests/unit/prelaunch/prelaunch-page.test.tsx

### Implementation (TDD — implement after tests are confirmed FAILING)

- [x] T012 [US1] Implement `<DigitTile>` — relative wrapper (76.8×122.88, rounded `--radius-tile-prelaunch`); absolute inner glass rectangle (border 0.75px `--color-tile-border`, gradient `--tile-fill-top → --tile-fill-bottom`, opacity 0.5, backdrop-blur); absolute digit `<span>` flex-centered with `var(--font-digital)` 73.728px bold; `aria-hidden="true"` on wrapper; char defaults to `-` — make T008 pass | components/prelaunch/digit-tile.tsx
- [x] T013 [US1] Implement `<CountdownUnit>` — flex-col items-start gap `--spacing-prelaunch-unit-stack-gap` w-[175px]; digit-pair row (flex-row gap `--spacing-prelaunch-digits-gap`) with two `<DigitTile>`; label `<span>` Montserrat 700 36/48; `pad()` function zero-pads and caps at 99 with `console.warn` for overflow — make T009 pass | components/prelaunch/countdown-unit.tsx
- [x] T014 [US1] Implement `<PrelaunchCountdown>` — `'use client'`; `useState<CountdownValues>` initialised from `getInitialCountdown(new Date(), parseEventStart(targetISO))`; `useEffect` sets `setInterval(60_000)` tick + cleanup; renders `<h1>` headline via `useTranslations('prelaunch').get('headline')`; renders `<div aria-live="polite" aria-atomic="true">` containing three `<CountdownUnit>` with i18n labels; no navigation on zero; TODO comment for future `useCountdown` hook extraction — make T010 pass | components/prelaunch/prelaunch-countdown.tsx
- [x] T015 [US1] Implement `app/prelaunch/page.tsx` RSC — static `export const metadata` with title, description, `robots: { index: false, follow: false }` (FR-012); page renders: BG layer (`<div className="absolute inset-0 z-[var(--z-hero-bg)] home-hero-bg" aria-hidden="true" role="presentation" />`), Cover gradient (`<div className="absolute inset-0 z-[var(--z-hero-overlay)] pointer-events-none" style={{background: 'var(--overlay-prelaunch-cover)'}} aria-hidden="true" />`), Content wrapper (`<div className="relative z-[var(--z-main-content)] flex min-h-screen items-center justify-center px-[var(--spacing-prelaunch-page-px)] py-[var(--spacing-prelaunch-page-py)]">`), `<PrelaunchCountdown targetISO={process.env.NEXT_PUBLIC_PRELAUNCH_END} />` — make T011 pass | app/prelaunch/page.tsx

**Checkpoint**: US1 complete. `npx vitest run tests/unit/prelaunch/` → all green. Open `/prelaunch` in browser → headline + six glass tiles visible, minute tick works.

---

## Phase 4: User Story 2 — Cut-off has passed; gate lifts (Priority: P1)

**Goal**: After `NEXT_PUBLIC_PRELAUNCH_END`, the server-side prelaunch gate stops all rewrites. Unauthenticated visitors hitting any URL land on Login (`/`); authenticated visitors land on their intended route. The `/prelaunch` route itself returns a 302 → `/` so it is not bookmarkable post-launch.

**Independent Test**: Set `NEXT_PUBLIC_PRELAUNCH_END` to a past ISO, restart dev server, request `/` and `/about-saa-2025` — confirm Login and Homepage SAA respectively, NOT the prelaunch page. Set it to a future ISO — confirm all routes rewrite to the prelaunch page. Request `/prelaunch` directly with a past cutoff — confirm redirect to `/`.

### Tests (TDD — write first, confirm FAILING before implementing)

- [x] T016 [US2] Write failing integration tests for the prelaunch gate: `now < cutoff`, `pathname='/'` → response rewrites to `/prelaunch`; `now < cutoff`, `pathname='/about-saa-2025'` → rewrites to `/prelaunch`; `now < cutoff`, `pathname='/prelaunch'` → passthrough (allowlist); `now < cutoff`, `pathname='/auth/callback'` → passthrough (allowlist); `now >= cutoff`, `pathname='/'` → passthrough (auth gate runs normally); `now >= cutoff`, `pathname='/prelaunch'` → redirect to `/`; env var missing → gate inactive, all requests passthrough | tests/integration/middleware/prelaunch-gate.test.ts

### Implementation (TDD — implement after T016 is confirmed FAILING)

- [x] T017 [US2] Extend `proxy.ts` — import `{ parsePrelaunchEnd, isPrelaunchActive }` from `@/lib/prelaunch/config`; define `const PRELAUNCH_ALLOWLIST = ['/prelaunch', '/auth/callback']`; prepend gate block BEFORE Supabase auth block: if active → rewrite non-allowlisted paths to `/prelaunch`; else if `pathname === '/prelaunch'` → redirect to `/`; existing auth logic unchanged — make T016 pass | proxy.ts

**Checkpoint**: US1 + US2 complete. Gate activates on future cutoff, lifts on past cutoff, prevents direct access to `/prelaunch` post-launch.

---

## Phase 5: User Story 3 — Misconfigured env var (Priority: P2)

**Goal**: When `NEXT_PUBLIC_PRELAUNCH_END` is missing or unparsable, the system degrades gracefully: the gate is inactive (no site lockout), the page renders `--` in all six tiles, `console.warn('Invalid NEXT_PUBLIC_PRELAUNCH_END')` is emitted, and no error boundary triggers.

**Independent Test**: Unset `NEXT_PUBLIC_PRELAUNCH_END`, restart dev server → request `/prelaunch` directly → headline visible, all 6 tiles show `--`, browser console shows the warn message, page is HTTP 200, no React error boundary. Request `/` → gets Login (gate inactive, no lockout).

> **Note**: All US3 implementation work is covered by the foundational config helper (T006–T007) and the US1 component tests (T010–T011). Phase 5 adds only the two cross-cutting verification tasks and the `console.warn` exact-match assertion.

### Verification + Edge-Case Assertions

- [x] T018 [P] [US3] Assert exact `console.warn` message string `'Invalid NEXT_PUBLIC_PRELAUNCH_END'` in `prelaunch-config.test.ts` (add assertion if not already present) and in `prelaunch-countdown.test.tsx` for the `targetISO=undefined` branch (via `vi.spyOn(console, 'warn')`) | tests/unit/lib/prelaunch-config.test.ts, tests/unit/prelaunch/prelaunch-countdown.test.tsx
- [x] T019 [P] [US3] Assert that the `prelaunch-gate` integration test covers the `env-var missing → gate inactive` case: confirm request to `'/'` passes through to auth logic (not rewritten) and request to `'/prelaunch'` also redirects to `'/'` even with missing env var | tests/integration/middleware/prelaunch-gate.test.ts

**Checkpoint**: US1 + US2 + US3 complete. All acceptance criteria from spec.md covered by tests.

---

## Phase 6: E2E (Critical Paths)

**Purpose**: Playwright smoke tests covering gate activation, page render, and zero-interaction guarantee.

- [x] T020 [US1] [US2] Write Playwright E2E spec — set `NEXT_PUBLIC_PRELAUNCH_END` to future → request `'/'` → assert page contains `h1` with "Sự kiện sẽ bắt đầu sau" text and 6 digit tile elements; assert no `<a>` / `<button>` / `<form>` in DOM; request `'/about-saa-2025'` → assert same prelaunch page (gate rewrites); set cutoff to past → request `'/'` → assert Login page (not prelaunch) | tests/e2e/prelaunch/prelaunch.spec.ts

**Checkpoint**: E2E gates are in place.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, reduced motion, responsive verification, TypeScript gate.

- [x] T021 [P] Add `@media (prefers-reduced-motion: reduce)` rule to suppress digit-tick fade animation (if any animation was added) — targets `.prelaunch-digit-fade` or equivalent; if no animation was implemented, add a comment noting FR compliance | app/globals.css
- [x] T022 [P] Add responsive Tailwind overrides to `<DigitTile>` (sm: `w-[52px] h-[84px]` / md: `w-16 h-[102px]`) and `<CountdownUnit>` (sm/md gap + label size overrides) per design-style.md §Responsive Specifications; verify at 360px, 768px, 1280px in browser | components/prelaunch/digit-tile.tsx, components/prelaunch/countdown-unit.tsx
- [x] T023 [P] Add responsive padding/gap overrides to `app/prelaunch/page.tsx` content wrapper (sm: `px-4 py-12` / md: `px-12 py-20`) per design-style.md §Responsive Specifications | app/prelaunch/page.tsx
- [x] T024 Run `npx tsc --noEmit` and fix any type errors introduced by the new files — Constitution §II TypeScript strict gate | project root

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) → Phase 2 (Foundation) → Phase 3 (US1) → Phase 4 (US2) → Phase 5 (US3 verification)
                                                          ↕ independent →  Phase 6 (E2E, after US1+US2)
Phase 7 (Polish) → depends on Phase 3–6 complete
```

- **Phase 1**: No dependencies — start immediately.
- **Phase 2**: Depends on Phase 1 (tokens and i18n must exist before tests reference them). **BLOCKS** all user story work.
- **Phase 3 (US1)**: Depends on Phase 2. Tests T008–T011 can be written in parallel. Implementations T012–T015 are sequential: `DigitTile` → `CountdownUnit` → `PrelaunchCountdown` → `Page`.
- **Phase 4 (US2)**: Depends on Phase 2 only (config helper is a Phase 2 product). Can be started in parallel with Phase 3 if a second engineer is available.
- **Phase 5 (US3)**: Depends on T006–T007 (Phase 2) and T010–T011 (Phase 3). Verification tasks only — no new implementation.
- **Phase 6 (E2E)**: Depends on Phase 3 (US1 page exists) and Phase 4 (US2 gate is wired). T020 can be written after T015 and T017 are done.
- **Phase 7 (Polish)**: Depends on Phase 3 (component files exist for responsive overrides).

### Within Each User Story

- Test files MUST be written and FAILING before their paired implementation task begins (Constitution §III).
- `DigitTile` (T012) must be complete before `CountdownUnit` (T013) is implemented.
- `CountdownUnit` (T013) must be complete before `PrelaunchCountdown` (T014) is implemented.
- `PrelaunchCountdown` (T014) must be complete before `Page` (T015) is implemented.

### Parallel Opportunities

| Group | Parallel Tasks |
|-------|----------------|
| Setup writes | T003, T004, T005 (different files) |
| Phase 3 test-writing | T008, T009, T010, T011 (different test files) |
| Phase 3 + Phase 4 kickoff | T016 (gate test write) can start as soon as T007 (config) is green |
| Phase 5 verification | T018, T019 (different test files) |
| Phase 7 polish | T021, T022, T023, T024 (different files) |

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 + Phase 2.
2. Complete Phase 3 (US1) — prelaunch page visible at `/prelaunch`.
3. **STOP and VALIDATE**: `vitest run tests/unit/prelaunch/` → all green. Open browser at `/prelaunch` manually.
4. Complete Phase 4 (US2) — gate wired in middleware.
5. **VALIDATE**: Set future/past cutoff, verify gate behavior end-to-end.
6. Phase 5 → Phase 6 → Phase 7.

### Incremental Delivery

1. Phase 1 + 2 → push to branch.
2. Phase 3 (US1 page) → push → preview deploy → visual review.
3. Phase 4 (US2 gate) → push → QA gate behavior.
4. Phase 5–7 → final polish push.

---

## Notes

- Commit after each completed phase or logical task group.
- Run `npx vitest run` before moving to the next phase.
- Mark tasks `[x]` as you go.
- `--radius-tile` is `4px` (Homepage tile) — do NOT overwrite it; use `--radius-tile-prelaunch: 12px` (added in T002).
- `--z-hero-bg`, `--z-hero-overlay`, `--z-main-content` already exist in `app/globals.css` — reuse them for BG / Cover / Content z-layers; do NOT add new `--z-bg-image` / `--z-content` tokens.
- BG image is the existing `/assets/home/hero-bg.jpg` shared with `/about-saa-2025` — do not copy the file.
- `var(--font-digital)` (DSEG7 Bold) is already registered in `app/layout.tsx` — no additional font setup needed.
- `parseEventStart` and `getInitialCountdown` in `lib/event.ts` are reused as-is by `<PrelaunchCountdown>` — no duplication.
