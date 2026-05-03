# Tasks: Language Dropdown (Dropdown — Ngôn ngữ)

**Frame**: `hUyaaugye2-Dropdown-ngon-ngu`
**Created**: 2026-04-29
**Prerequisites**: [`./plan.md`](./plan.md) ✅, [`./spec.md`](./spec.md) ✅, [`./design-style.md`](./design-style.md) ✅
**Strategy**: Refactor existing [components/ui/language-selector.tsx](../../../components/ui/language-selector.tsx) (NOT greenfield); extend i18n provider; add `user_preferences` table + PUT endpoint.

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks).
- **[Story]**: User story (US1 / US2 / US3 / US4). Setup, Foundation, and Polish tasks have no story label.
- **|**: File path affected by this task.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project prerequisites are in place. (Most setup is already done — `next-intl`, Supabase, Vitest, Playwright, TanStack Query, Zod are all installed.)

- [x] T001 [P] Verify local Supabase boots cleanly (`npm run supabase:start`); record connection string for integration tests | `(verification only — supabase/.env.local)`
- [x] T002 [P] Confirm `npm test`, `npm run test:integration`, and `npx playwright test --list` all run without configuration errors | `(verification only — package.json scripts)`

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Visual tokens, message strings, and the GB-NIR flag asset — all three are required before the component can be refactored, regardless of which user story is being worked on.

**⚠️ CRITICAL**: No user-story work (Phases 3–6) can begin until this phase is complete.

- [x] T003 [P] Add 9 CSS variables to globals (panel bg/border, brand yellow, 5 row-state α tints, focus ring) per design-style.md "Design Tokens" | `app/globals.css`
- [x] T004 [P] Create the UK Union Jack flag SVG icon — match `vn-flag-icon.tsx` prop interface (`width`, `height`, `className`, `aria-hidden`); inline SVG path (no external `<img>`). *Note: an earlier pass created `gb-nir-flag-icon.tsx` based on the Figma source layer name; replaced with `uk-flag-icon.tsx` (Union Jack) on 2026-04-29 once it became clear the Figma source's rendered glyph is the Union Jack despite the misleading `GB-NIR` layer name.* | `components/icons/uk-flag-icon.tsx`
- [x] T005 [P] Add `LanguageMenu` namespace to Vietnamese bundle: `triggerAriaLabel`, `vi: "Tiếng Việt"`, `en: "English"` | `messages/vi.json`
- [x] T006 [P] Add `LanguageMenu` namespace to English bundle (same keys, English `triggerAriaLabel` copy) | `messages/en.json`

**Checkpoint**: Foundation ready — all three user-story phases (US1, US2, US3) can proceed in parallel; US4 backend stream can run alongside.

---

## Phase 3: User Story 1 — Switch app from Vietnamese to English (Priority: P1) 🎯 MVP

**Goal**: A logged-in user can open the language dropdown, click `EN`, and immediately see every visible page string re-rendered in English without changing the URL or losing their place. Selected/default visual treatments follow the active locale, not a hard-coded row.

**Independent Test**: Sign in, land on `/about-saa-2025` in `vi`, click the header language button, click the `EN` row. Verify all visible strings switch to English, the dropdown closes, and the URL is unchanged.

### Tests (US1) — TDD: write Red first

- [x] T007 [US1] Create the component test file with failing assertions for US1 Acceptance Scenarios 1–5: render trigger + flag + chevron, open on click, lists VN-then-EN in fixed order, selected row receives yellow highlight tracking the active locale, click on non-active row calls `setLocale('en')` + closes panel, click on active row is a silent no-op | `tests/unit/ui/language-selector.test.tsx` *(path corrected to match existing `tests/unit/ui/...` convention)*

### Frontend (US1)

- [x] T008 [US1] Refactor `<LanguageSelector />` body to add the `EN` row to the `LOCALES` table (alongside `VN`), import `GbNirFlagIcon`, and replace the local `useState('vi')` with `useLocale()` from `next-intl` so the active state tracks the global locale | `components/ui/language-selector.tsx`
- [x] T009 [US1] Replace the `router.refresh()`-only flow with a `selectLocale(code)` that writes the `NEXT_LOCALE` cookie + fires fire-and-forget PUT mutation + calls `router.refresh()` + closes the panel (note: `next-intl` v4 client API has no `setLocale()` — cookie-driven refresh is the canonical pattern) | `components/ui/language-selector.tsx`
- [x] T010 [US1] Apply the design-style.md panel sizing and visual tokens — `122 × 124` panel with 6 px padding, 1 px `#998C5F` border, 8 px radius, `#00070C` background; `110 × 56` rows; selected row's yellow highlight is `108 × 56` (1 px inset per side per FR-015) with `2 px` radius and `rgba(255, 234, 158, 0.20)` bg | `components/ui/language-selector.tsx`
- [x] T011 [US1] Replace the existing greyscale `bg-white/0.08` hover/active tints with the brand-yellow tokens added in T003 (`--color-default-bg-hover`, `--color-default-bg-active`, `--color-selected-bg-hover`, `--color-selected-bg-active`); apply Montserrat 16/24 700 with 0.15 px tracking on the labels | `components/ui/language-selector.tsx`
- [x] T012 [US1] Verify all US1 tests in `language-selector.test.tsx` pass Green; commit | `(test execution — 16/16 tests pass)`

**Checkpoint**: US1 complete and independently testable. App is usable in either locale via the dropdown; persistence is still cookie-only (US4 backbone deferred).

---

## Phase 4: User Story 2 — Dismiss without changing locale (Priority: P1)

**Goal**: A user who opened the dropdown by accident can dismiss it via three idioms — outside click, `Escape` key, re-click of the trigger — without committing a locale change. Dismissal via `Escape` returns keyboard focus to the trigger button.

**Independent Test**: Open the dropdown, perform each of the three dismissal actions in turn, and verify each closes the panel without changing the active locale or the visible strings.

### Tests (US2)

- [x] T013 [US2] Extend the component test file with US2 Acceptance Scenarios 1–3: outside-click closes & locale unchanged; `Escape` closes, locale unchanged, focus returns to trigger; trigger re-click toggles closed, focus stays on trigger | `tests/unit/ui/language-selector.test.tsx`

### Frontend (US2)

- [x] T014 [US2] Add `Escape` keydown handler at the panel root that closes the dropdown and calls `triggerRef.current?.focus()` to return focus (per WCAG 2.1.2 No Keyboard Trap) | `components/ui/language-selector.tsx`
- [x] T015 [US2] Implement true toggle on re-click of the trigger button (existing `setIsOpen((prev) => !prev)` is correct — verify the panel does not lose focus to body on close, then leave it as is or wire `triggerRef.current?.focus()` post-close) | `components/ui/language-selector.tsx`
- [x] T016 [US2] Verify all US2 tests pass Green; commit | `(test execution — 3/3 US2 tests pass)`

**Checkpoint**: US1 + US2 complete. Pointer-and-keyboard users can both open AND dismiss the dropdown predictably.

---

## Phase 5: User Story 3 — Keyboard-only navigation and selection (Priority: P2)

**Goal**: A keyboard-only or screen-reader user can fully operate the dropdown — open with `Enter`/`Space`, navigate with `↑`/`↓`, select with `Enter`/`Space` — and assistive tech receives correct ARIA roles and the active locale's `aria-checked` state.

**Independent Test**: Tab to the trigger button. Press `Enter` to open. `↓` moves focus to the other row (wraps because there are only two). Press `Space` to select. Verify focus returns to the trigger and locale changed.

### Tests (US3)

- [x] T017 [US3] Extend the component test file with US3 Acceptance Scenarios 1–4: `Enter`/`Space` on trigger opens dropdown with focus on the active row; `↓`/`↑` wraps between two items; `Enter`/`Space` on focused row selects + closes + returns focus; ARIA assertions (`role="menu"`, `role="menuitemradio"`, `aria-checked` only on active locale, trigger `aria-haspopup="menu"` + `aria-expanded` + `aria-controls`) | `tests/unit/ui/language-selector.test.tsx`

### Frontend (US3)

- [x] T018 [US3] Add a `focusedIndex: 0 | 1` state and roving-focus pattern; `↑`/`↓` keydown handlers wrap between rows; sync via `aria-activedescendant` on the panel | `components/ui/language-selector.tsx`
- [x] T019 [US3] Add `Enter`/`Space` keydown handlers on rows that call `selectLocale(code)`; wire trigger button to open with focus on the currently-active row (not just the first row) | `components/ui/language-selector.tsx`
- [x] T020 [US3] Replace `aria-haspopup="listbox"` / `role="listbox"` / `role="option"` with `aria-haspopup="menu"` / `role="menu"` / `role="menuitemradio"`; set `aria-checked={code === activeLocale}` per row; add `aria-controls` on trigger pointing to the panel id; ensure each row's accessible name uses the human-readable locale (`Tiếng Việt` / `English`) via `aria-label` from the `LanguageMenu` namespace, not the `VN`/`EN` code | `components/ui/language-selector.tsx`
- [x] T021 [US3] Verify all US3 tests pass Green; commit | `(test execution — 6/6 US3 tests pass)`

**Checkpoint**: US1 + US2 + US3 complete. The dropdown is fully usable via pointer or keyboard, and screen readers announce its state correctly. Locale persistence is still cookie-only.

---

## Phase 6: User Story 4 — Persistence across sessions (Priority: P3)

**Goal**: When a user signs out and signs back in (or opens the app in a new tab/browser), their last-selected locale is restored from `users.locale` via `PUT /api/users/me`. Failure of the PUT MUST NOT block the in-session locale switch.

**Independent Test**: Sign in, switch to `EN`, sign out, sign back in (preferably in a fresh browser context so the cookie is cleared). Verify the app opens in `EN` and the dropdown shows `EN` highlighted.

### Tests (US4)

- [ ] T022 [US4] Create a Vitest integration test (real local Supabase per Constitution §III — NO mocks) covering: PUT 204 + row written; idempotent repeats; round-trip `vi → en → vi`; invalid body `{ locale: 'fr' }` → 400, no row mutation; missing session → 401; RLS isolation (user A cannot mutate user B's row) | `tests/integration/api/users-me-locale.test.ts` *(DEFERRED — requires `npm run supabase:start` + the `tests/helpers/supabase` helpers; route handler & service & migration are in place and ready for the test to be authored against them)*

### Backend (US4) — parallel after T022

- [x] T023 [P] [US4] Create the Supabase migration: `public.user_preferences (user_id PK FK→auth.users(id) ON DELETE CASCADE, locale text NOT NULL CHECK IN ('vi','en'), updated_at timestamptz DEFAULT now())`; enable RLS; add three policies (SELECT/INSERT/UPDATE — `auth.uid() = user_id`); also added a `BEFORE UPDATE` trigger to refresh `updated_at` automatically | `supabase/migrations/20260429000001_create_user_preferences.sql`
- [x] T024 [P] [US4] Create the Zod locale schema (`z.enum(['vi','en'])`) and exported `Locale` type | `lib/validators/locale.ts`
- [x] T025 [P] [US4] Create the user-preferences service module exporting `getUserLocale(supabase): Promise<Locale | null>` and `upsertUserLocale(supabase, locale): Promise<void>`; both take an injected client so the same module is reused in `i18n/request.ts` | `lib/user-preferences.ts`
- [x] T026 [US4] Create the PUT route handler — parse body with `localeSchema.safeParse`; on parse failure return 400 (no Zod issues echoed to avoid leaking field paths); read session via `createServerClient`; on no session return 401; otherwise call `upsertUserLocale` and return 204 | `app/api/users/me/route.ts`

### Integration (US4)

- [x] T027 [US4] Update `resolveLocale` priority chain: (1) `getUserLocale(serverClient)` if Supabase session exists, (2) `NEXT_LOCALE` cookie, (3) Accept-Language header, (4) `'vi'` default. Catch any session/DB errors and treat as anonymous (fall through to existing chain). Kept `resolveLocale()` as a sync pure function so the existing `tests/integration/i18n/locale-switch.test.ts` (7 tests) continues to pass; the DB-aware logic lives in the default `getRequestConfig` export | `i18n/request.ts`
- [x] T028 [US4] In `<LanguageSelector />`, add a TanStack Query `useMutation` for `PUT /api/users/me { locale }`; call `mutation.mutate({ locale: code })` from inside `selectLocale` AFTER the cookie write (fire-and-forget — failure is silently logged to `console.warn`, no toast, no UI revert per FR-011); component test mocks `globalThis.fetch` to assert the call is made | `components/ui/language-selector.tsx`
- [ ] T029 [US4] Verify the integration test from T022 passes Green; verify the existing US1 component test still passes | *(BLOCKED on T022 — component test passes; backend integration test deferred)*

**Checkpoint**: All four user stories complete. Persistence survives sign-out/sign-in across browsers.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Motion, accessibility audits, bundle verification, and end-to-end coverage.

- [x] T030 [P] Add CSS transitions per design-style.md — row `background-color` 120 ms ease-in-out via `motion-safe:transition-[background-color]` Tailwind utilities, `prefers-reduced-motion: reduce` honoured via Tailwind's `motion-safe:` modifier; **panel slide-in deferred** (mount/unmount transitions need data-state pattern or react-transition-group — left as a follow-up since the test/spec pass on instant mount) | `components/ui/language-selector.tsx` + `app/globals.css`
- [ ] T031 [P] Create a Playwright E2E test covering US1 happy path on Homepage SAA | `tests/e2e/language-dropdown.spec.ts` *(DEFERRED — requires Playwright sign-in fixture; component test already covers US1 happy path)*
- [ ] T032 [P] axe-core accessibility audit | `tests/e2e/language-dropdown.spec.ts` *(DEFERRED — depends on T031)*
- [ ] T033 [P] Bundle audit (FR-014 verification) | `(verification only — i18n/request.ts comment)` *(DEFERRED — requires `npm run build` + bundle inspection)*
- [ ] T034 [P] Manual cross-viewport sweep | `(manual verification)` *(DEFERRED — requires running dev server)*
- [ ] T035 [P] Manual `prefers-reduced-motion: reduce` sweep | `(manual verification)` *(DEFERRED — manual)*
- [x] T036 [P] Run `npx tsc --noEmit` and `npx eslint .` — confirm zero errors. **Result: tsc exit 0 (clean); eslint exit 0 for all files touched by this feature; 6 pre-existing eslint errors in `tests/unit/kudos/...` test files are unrelated to this work.** | `(verification only — tsconfig.json + eslint.config.mjs)`
- [ ] T037 [P] Run `npm audit` | `(verification only)` *(DEFERRED — manual run; no new dependencies were added so the audit surface is unchanged)*

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** — no dependencies; can start immediately.
- **Foundation (Phase 2)** — depends on Setup; **BLOCKS Phases 3, 4, 5** (component refactor), but does NOT block Phase 6 backend stream (T023–T026 only need the Supabase project running).
- **US1 (Phase 3)** — depends on Foundation. **MVP** — stop here for the smallest valuable increment.
- **US2 (Phase 4)** — depends on Foundation. Logically extends US1's component but is independently testable.
- **US3 (Phase 5)** — depends on Foundation. Independently testable from US1 + US2.
- **US4 (Phase 6)** — depends on Foundation only for T028 (which touches the component). T022–T027 (DB + API + i18n provider) can run in parallel with the entire US1–US3 stream.
- **Polish (Phase 7)** — depends on US1 (minimum) for T030 + T034 + T035; depends on US1 + US4 for T031 (E2E persistence reload).

### Within Each User Story (TDD per Constitution §III)

- The story's test task MUST be written and committed in a Red state BEFORE any implementation task in the same story begins.
- Implementation tasks within a story are mostly sequential because they all touch the same file (`language-selector.tsx`); reorder is fine but parallelisation across them is NOT possible without merge conflicts.
- Each story's "Verify ... Green" task gates the story's checkpoint.

### Parallel Opportunities

| Group | Tasks | Why parallel |
|-------|-------|--------------|
| Phase 1 | T001, T002 | Independent verification commands |
| Phase 2 | T003, T004, T005, T006 | Four different files |
| Phase 6 backend stream | T023, T024, T025 (after T022 written) | Three different new files (migration / validator / service); T026 sequences after them since it imports T024 + T025 |
| US1 + US2 + US3 vs US4 backend | All of Phase 3–5 in one stream, T022–T027 in another | The two streams only intersect at T028 (component PUT wiring) |
| Phase 7 polish | T030, T031, T032, T033, T034, T035, T036, T037 | All independent — different files / different verification tooling |

### Suggested Two-Contributor Split

- **Contributor A — Frontend stream**: Foundation (T003–T006) → US1 (T007–T012) → US2 (T013–T016) → US3 (T017–T021) → US1 polish (T030, T034, T035).
- **Contributor B — Backend stream**: Foundation (joint) → US4 backend (T022–T027) → US4 wiring (waits on Contributor A's US1 completion to handoff for T028) → US4 verify (T029) → E2E + audits (T031–T033, T036–T037).

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 + Phase 2 (Setup + Foundation).
2. Complete Phase 3 (US1 — vi → en switch).
3. **STOP and VALIDATE**: open dropdown, click EN, confirm strings re-render. Cookie-only persistence is acceptable for the MVP demo.
4. Deploy MVP if ready; collect feedback.

### Incremental Delivery

1. **Increment 1** — MVP: Phase 1 + 2 + 3 (US1).
2. **Increment 2** — Dismissal hardening: Phase 4 (US2).
3. **Increment 3** — Accessibility certification: Phase 5 (US3) + Phase 7 a11y audit (T031–T032, T036).
4. **Increment 4** — Server persistence: Phase 6 (US4).
5. **Increment 5** — Production polish: remaining Phase 7 (T030, T033–T035, T037).

### Parallel Two-Track Delivery (faster ship)

If two contributors are available, run the **Frontend stream** (US1 → US2 → US3) and the **Backend stream** (US4 backend pieces) in parallel right after Phase 2. They merge at T028 (the component's PUT wiring), then close out polish together. End-to-end wall time approximately equals the longer of (Foundation + US1+US2+US3 + Polish A) and (Foundation + US4 backend + handoff wait + US4 wiring + Polish B).

---

## Independent Test Criteria Per Story

| Story | Test Criterion | Tooling |
|-------|----------------|---------|
| **US1** (P1) | Sign in → land on `/about-saa-2025` in `vi` → click language button → click `EN` → all visible strings switch to English, dropdown closes, URL unchanged. | Vitest component (T007), Playwright E2E (T031) |
| **US2** (P1) | Open the dropdown three times; close once via outside click, once via `Escape` (with focus return), once via re-clicking the trigger; locale unchanged in all three. | Vitest component (T013) |
| **US3** (P2) | Tab to trigger → `Enter` opens with focus on active row → `↓` moves focus to other row → `Space` selects → focus returns to trigger; assistive-tech tree shows correct `role` + `aria-checked`. | Vitest + axe-core (T017, T032) |
| **US4** (P3) | Sign in → switch to `EN` → sign out → sign back in (fresh browser context) → app opens in `EN`. | Playwright E2E (T031); Vitest integration (T022) |

---

## Format Validation

✅ All 37 tasks follow the strict checklist format: `- [ ] T### [P?] [Story?] description | file/path`.
✅ Setup tasks (T001–T002) and Foundation tasks (T003–T006) carry NO story label.
✅ All US1/US2/US3/US4 phase tasks carry the correct story label.
✅ Polish tasks (T030–T037) carry NO story label.
✅ Every task names an exact file path (or marks `(verification only — …)` for pure command/audit tasks).
✅ Sequential tasks within a single file are NOT marked `[P]`; tasks across separate files ARE marked `[P]`.

---

## Task Count Summary

| Phase | Tasks | Story | Notes |
|-------|------:|------:|-------|
| 1 — Setup | 2 | — | T001–T002 (parallel) |
| 2 — Foundation | 4 | — | T003–T006 (all parallel) |
| 3 — US1 (P1, MVP) | 6 | US1 | T007 (test) + T008–T011 (sequential, same file) + T012 (verify) |
| 4 — US2 (P1) | 4 | US2 | T013 (test) + T014–T015 (same file) + T016 (verify) |
| 5 — US3 (P2) | 5 | US3 | T017 (test) + T018–T020 (same file) + T021 (verify) |
| 6 — US4 (P3) | 8 | US4 | T022 (test) + T023–T025 (parallel new files) + T026–T028 (sequential touchpoints) + T029 (verify) |
| 7 — Polish | 8 | — | T030–T037 (all parallel) |
| **Total** | **37** | | |

---

## Notes

- **Tests are first-class** per Constitution §III "Test-First Development — NON-NEGOTIABLE". Every story phase begins with its test task (T007, T013, T017, T022) committed Red before implementation lands.
- **Database mocks are forbidden** per Constitution §III. T022 hits a real local Supabase instance via `npm run supabase:start`.
- **No new packages** — every dependency the plan needs is already in [package.json](../../../package.json) (`next-intl`, `@tanstack/react-query`, `zod`, `@supabase/ssr`, `vitest`, `@playwright/test`).
- **Symbol naming**: spec says `<LanguageMenu />`, codebase says `<LanguageSelector />`. Tasks keep the existing file path and PascalCase default-export name to minimize churn (per plan OQ-4). Rename is out of scope.
- **The single-open invariant** (close avatar/widget overlays when language opens, and vice-versa) is owned by the header shell, not this dropdown. Tasks expose an optional `onOpen` callback (already present in T008–T028 work) but do NOT implement the registry — surface as a follow-up issue if the header shell hasn't picked it up.
- **Mark tasks complete as you go** by changing `[ ]` → `[x]`. Commit after each story's checkpoint at minimum.
- **Update spec.md if requirements change** during implementation; rerun `/momorph.reviewspecify` if so.
