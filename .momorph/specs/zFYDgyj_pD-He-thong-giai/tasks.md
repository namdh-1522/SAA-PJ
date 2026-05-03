# Tasks: Awards Information ("Hệ thống giải thưởng SAA 2025")

**Frame**: `zFYDgyj_pD-He-thong-giai`
**Prerequisites**: plan.md ✓, spec.md ✓ (reviewed × 4), design-style.md ✓ (reviewed × 4)
**Generated**: 2026-04-26

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel with sibling tasks (different files, no dependency on an incomplete task)
- **[Story]**: User story this task belongs to (US1, US2, US3, US4, US5, US6) — set ONLY in user-story phases
- **|**: file path the task touches

---

## Phase 1: Setup (Asset Preparation)

**Purpose**: Make sure all design assets and existing infrastructure are in place. The Next.js + Supabase + Tailwind project is already initialized — no scaffolding tasks needed.

- [ ] T001 [P] Verify all 6 award background images exist (`top-talent`, `top-project`, `top-project-leader`, `best-manager`, `signature-2025-creator`, `mvp`) | public/assets/home/awards/
- [ ] T002 Acquire 6 award name-overlay raster assets from design team and place in folder (sizes per design-style § 3a — D.1 ≈ 221×35, D.2 ≈ 232×35, D.3 ≈ 232×64, D.4–D.6 per asset) | public/assets/awards/overlays/
- [ ] T003 [P] Confirm keyvisual decision (reuse `home-hero-bg.jpg` or provision dedicated `awards-hero-bg.jpg`) and place file if separate | public/assets/home/hero-bg.jpg

**Checkpoint**: All raster assets are accessible at `/assets/...` paths used by the data model.

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Types, library helpers, design tokens, hooks, and i18n keys that ALL user stories depend on. Per Constitution Principle III, every implementation task is preceded by its failing test.

**⚠️ CRITICAL**: No user-story work begins until this phase is complete.

### Test infrastructure

- [ ] T004 [P] Add `IntersectionObserver` stub (only if happy-dom doesn't provide one) and `sessionStorage` reset in `beforeEach` | tests/setup.ts
- [ ] T005 [P] Create `renderWithIntl(ui, { locale = 'vi' })` test utility wrapping children in `<NextIntlClientProvider>` so `useTranslations()` resolves in unit tests | tests/utils/render-with-intl.tsx

### Type extensions

- [ ] T006 [P] Add `AwardValue` and `AwardCategory extends AwardSpec` interfaces (with `quantity`, `quantityUnit`, `values`, `nameOverlayImage`, `descriptionLongKey`) | types/home.ts

### Awards data extension (depends on T006)

- [ ] T007 [P] Write failing test asserting `AWARDS` array exposes the new `AwardCategory` fields for all 6 entries AND existing `AwardSpec` shape is still satisfied (Homepage `<AwardCard>` regression) | tests/unit/lib/awards-extension.test.ts
- [ ] T008 Broaden `AWARDS` from `readonly AwardSpec[]` to `readonly AwardCategory[]`; populate `quantity`, `quantityUnit`, `values`, `nameOverlayImage`, `descriptionLongKey` for all 6 entries per design-style § "Per-card content reference" table | lib/awards.ts

### Design tokens

- [ ] T009 [P] Add new CSS variables: `--shadow-award-image`, `--text-shadow-active`, `--backdrop-blur-card`, `--spacing-awards-content-w`, `--spacing-awards-image-w`, `--spacing-awards-row-gap`. Optionally add `.awards-hero-bg` class if T003 produced a separate keyvisual | app/globals.css

### Icon components (test-first per Constitution III)

- [ ] T010 [P] Write failing test for `TargetIcon` (renders SVG, `aria-hidden="true"`, `currentColor` fill) | tests/unit/icons/target-icon.test.tsx
- [ ] T011 [P] Write failing test for `DiamondIcon` (same shape contract) | tests/unit/icons/diamond-icon.test.tsx
- [ ] T012 [P] Write failing test for `LicenseIcon` (same shape contract) | tests/unit/icons/license-icon.test.tsx
- [ ] T013 [P] Implement `TargetIcon` (24×24 target/crosshair SVG; used by side-nav items) | components/icons/target-icon.tsx
- [ ] T014 [P] Implement `DiamondIcon` (24×24 diamond SVG; used by "Số lượng" label) | components/icons/diamond-icon.tsx
- [ ] T015 [P] Implement `LicenseIcon` (24×24 seal/license SVG; used by "Giá trị" label) | components/icons/license-icon.tsx

### Scroll-spy hook (test-first)

- [ ] T016 [P] Write failing test for `useScrollSpy` (`IntersectionObserver` mock; visibility transitions update `activeSlug`; `scrollTo()` smooth-scrolls + `history.replaceState`; `prefers-reduced-motion: reduce` forces `behavior: 'auto'`; `matchMedia` change rebuilds the observer with new `rootMargin`) | tests/unit/hooks/use-scroll-spy.test.ts
- [ ] T017 Implement `useScrollSpy(slugs, options)` returning `{ activeSlug, setActiveSlug, scrollTo }`; install IO with breakpoint-dependent `rootMargin` (`-56px ...` mobile / `-112px ...` ≥ md, recomputed via `matchMedia` listener); reduced-motion fallback | hooks/use-scroll-spy.ts

### Post-auth redirect helpers (test-first; FR-009 hash preservation)

- [ ] T018 [P] Write failing test for `stashRedirectTarget` / `consumePostAuthRedirect` (writes correct `sessionStorage` key `saa.postAuthRedirect`; reads + deletes; safe under `typeof window === 'undefined'`; respects same-origin) | tests/unit/lib/post-auth-redirect.test.ts
- [ ] T019 Implement `stashRedirectTarget(target: string)` and `consumePostAuthRedirect(): string \| null`, both `sessionStorage`-backed under key `saa.postAuthRedirect`; SSR-safe | lib/auth/post-auth-redirect.ts
- [ ] T020 [P] Write failing test for `usePostAuthRedirect(currentPathname)` (matching pathname + hash → scroll triggered; non-matching → no-op; absent stash → no-op) | tests/unit/hooks/use-post-auth-redirect.test.ts
- [ ] T021 Implement `usePostAuthRedirect(currentPathname)` calling `consumePostAuthRedirect()` on mount; if pathname matches and hash present, calls `useScrollSpy.scrollTo(slug)` | hooks/use-post-auth-redirect.ts

### i18n catalogue

- [ ] T022 [P] Add `awards.*` namespace: `title`, `subtitle`, `menu.{slug}` (×6), `{slug}.descriptionLong` (×6), `label.{quantity,value,perAward}`, `unit.{individual,team,unit}`, `value.recipient.{individual,team}`, `empty`, `error.{title,retry}` | messages/vi.json
- [ ] T023 [P] Mirror the Vietnamese keys with English translations (flag for content-team review) | messages/en.json

### Cross-feature: fix Homepage `<AwardCard>` href contract (independent of awards page)

- [ ] T024 [P] Update Homepage `<AwardCard>` `href` constant from `/awards-information#${slug}` to `/awards#${slug}` (line 13) so deep-links reach the new awards page | components/home/award-card.tsx
- [ ] T025 Update existing Homepage tests that assert award-card href values (search for `awards-information` references and update to `/awards#`) | tests/integration/home/page.test.tsx

**Checkpoint**: Foundation green — types compile, data layer exposes new fields, tokens loaded, all foundation unit tests pass, i18n catalogues present, Homepage cards now point at `/awards`. User-story implementation can now begin.

---

## Phase 3: User Story 1 — Authenticated user reads the full award catalogue (Priority: P1) 🎯 MVP

**Goal**: Render `/awards` with all six award categories in zig-zag layout (image-left / image-right alternating), each row showing image (background + overlay), title, justified description, "Số lượng giải thưởng:" + quantity + unit, and "Giá trị giải thưởng:" + value (or two values for Signature 2025 - Creator).

**Independent Test**: Navigate to `/awards` while authenticated; verify all 6 award sections render with title, description, quantity, value, image; D.1/D.3/D.5 are image-left, D.2/D.4/D.6 are image-right.

### Tests (US1)

- [ ] T026 [P] [US1] Failing unit test for `AwardsPageTitle` (eyebrow + divider + main title with correct typography tokens) | tests/unit/awards/awards-page-title.test.tsx
- [ ] T027 [P] [US1] Failing unit test for `AwardImage` (background `<Image>` has `aria-hidden="true"` + `alt=""`; overlay `<Image>` has `alt={title}`; glow shadow + `mix-blend-mode: screen` applied to wrapper) | tests/unit/awards/award-image.test.tsx
- [ ] T028 [P] [US1] Failing unit test for `AwardQuantity` (renders quantity number + unit via i18n; diamond icon present) | tests/unit/awards/award-quantity.test.tsx
- [ ] T029 [P] [US1] Failing unit test for `AwardValue` (single-value variant: one figure + caption; dual-value variant: two figures with `cá nhân` / `tập thể`) | tests/unit/awards/award-value.test.tsx
- [ ] T030 [P] [US1] Failing unit test for `AwardContent` (renders title + description + dividers + quantity + value in correct vertical order; `<section aria-labelledby={...}>` present) | tests/unit/awards/award-content.test.tsx
- [ ] T031 [P] [US1] Failing unit test for `AwardRow` (`direction='image-left'` → `flex-row`; `direction='image-right'` → `flex-row-reverse`; children DOM order unchanged) | tests/unit/awards/award-row.test.tsx
- [ ] T032 [P] [US1] Failing unit test for `AwardsList` (renders exactly 6 rows in order; first → image-left, second → image-right; partial list still alternates from index 0; empty list shows `awards.empty` copy) | tests/unit/awards/awards-list.test.tsx

### Components (US1) — depends on the matching test passing red

- [ ] T033 [P] [US1] Implement `AwardsDivider` (1 px `#2E3940` rule via `--color-divider`) | components/awards/awards-divider.tsx
- [ ] T034 [P] [US1] Implement `AwardsPageTitle` (eyebrow → divider → main title; all i18n + Tailwind tokens) | components/awards/awards-page-title.tsx
- [ ] T035 [P] [US1] Implement `AwardsKeyvisual` (uses `.home-hero-bg` or `.awards-hero-bg` per T003 + cover gradient overlay; `aria-hidden="true"` decorative) | components/awards/awards-keyvisual.tsx
- [ ] T036 [P] [US1] Implement `AwardImage` (336×336 wrapper with `--shadow-award-image`, `mix-blend-screen`, 24 px `rounded-3xl`, accent-colored `ring-1`; two stacked `<Image>` layers per FR-002b) | components/awards/award-image.tsx
- [ ] T037 [P] [US1] Implement `AwardQuantity` ("Số lượng giải thưởng:" + `<DiamondIcon>` + quantity number + i18n unit) | components/awards/award-quantity.tsx
- [ ] T038 [P] [US1] Implement `AwardValue` (handles single + dual `values` array; "Giá trị giải thưởng:" + `<LicenseIcon>` + figure(s) + per-recipient caption when dual) | components/awards/award-value.tsx
- [ ] T039 [US1] Implement `AwardContent` (composes `<h2 id={`${slug}-title`}>` + description rich text + dividers + `<AwardQuantity>` + `<AwardValue>`; `rounded-2xl backdrop-blur-[32px]` container) | components/awards/award-content.tsx
- [ ] T040 [US1] Implement `AwardRow` (wraps content in `<section id={slug} data-award-slug={slug} aria-labelledby={...}>`; flex direction driven by `direction` prop) | components/awards/award-row.tsx
- [ ] T041 [US1] Implement `AwardsList` (maps `AWARDS` to `<AwardRow>` × N with `direction = idx % 2 === 0 ? 'image-left' : 'image-right'`; `<AwardsDivider>` between adjacent rows; empty-state branch) | components/awards/awards-list.tsx

### Route files (US1)

- [ ] T042 [US1] Create `app/awards/page.tsx` — RSC; reads `getUserRole()` + `userEmail` (Supabase); composes `<Header navSlot={<HeaderNav />} rightSlot={<HeaderControls /> + <HomepageMobileNav />}>` + decorative hero BG layers + `<main>` with `<AwardsKeyvisual>` + `<AwardsPageTitle>` + (placeholder for `<AwardsSideNav>` to be wired in Phase 4) + `<AwardsList awards={AWARDS} />` + `<KudosPromo>` + `<Footer navSlot={<FooterNav />} />`; export `metadata: Metadata` for `<title>` | app/awards/page.tsx
- [ ] T043 [US1] Create `app/awards/loading.tsx` — RSC; minimal header shell + page-title placeholder | app/awards/loading.tsx
- [ ] T044 [US1] Create `app/awards/error.tsx` — Client; route error boundary with reset button | app/awards/error.tsx

### Integration tests (US1)

- [ ] T045 [P] [US1] Integration test — full RSC render: header active state, keyvisual, page-title, 6 rows in zig-zag, KudosPromo, footer, `isAdmin` drives avatar item; uses real Supabase test instance for the auth gate | tests/integration/awards/page.test.tsx
- [ ] T046 [P] [US1] Integration test — empty `AWARDS` stub: page-title + KudosPromo render; awards list shows `awards.empty` copy; side menu hidden | tests/integration/awards/page-empty.test.tsx
- [ ] T047 [P] [US1] Integration test — partial `AWARDS` stub (length 3): only 3 rows render; first image-left, second image-right, third image-left (zig-zag from index 0) | tests/integration/awards/page-partial.test.tsx

**Checkpoint**: User Story 1 complete — `/awards` renders the full catalogue. No anchor scrolling yet, no auth-redirect E2E yet.

---

## Phase 4: User Story 2 — Quick-jump to a specific award via side menu (Priority: P1)

**Goal**: Sticky 6-item side menu (`C.1`–`C.6`) wired to scroll-spy. Click an item → smooth-scroll to matching `D.x` row + URL hash updates; manual scroll → active state follows; deep-link `/awards#mvp` lands on D.6 with C.6 active.

**Independent Test**: Click each side-menu item → page scrolls to the matching row + hash updates + active state moves; visit `/awards#mvp` directly → row in viewport on first paint, C.6 active.

### Tests (US2)

- [ ] T048 [P] [US2] Failing unit test for `AwardsSideNav` (renders 6 items in order; click sets active + updates hash; respects `prefers-reduced-motion`; rebuilds observer on viewport breakpoint change) | tests/unit/awards/awards-side-nav.test.tsx
- [ ] T049 [P] [US2] Failing unit test for `AwardsSideNavItem` (active vs inactive visuals; `aria-current="true"` only on active; icon + label render via i18n) | tests/unit/awards/awards-side-nav-item.test.tsx

### Components (US2)

- [ ] T050 [P] [US2] Implement `AwardsSideNavItem` (RSC; renders `<a href="#${slug}">` + `<TargetIcon>` + label; active vs inactive Tailwind classes per design-style § 2) | components/awards/awards-side-nav-item.tsx
- [ ] T051 [US2] Implement `AwardsSideNav` (Client; uses `useScrollSpy` from T017; sticky `<aside>` ≥ md / horizontal scroll strip < md; click handler `e.preventDefault()` + smooth-scroll + `history.replaceState`; on first paint with hash, scrolls to matching slug for deep-link support) | components/awards/awards-side-nav.tsx

### Wiring (US2)

- [ ] T052 [US2] Replace the placeholder in `app/awards/page.tsx` with `<AwardsSideNav awards={AWARDS} />` rendered alongside `<AwardsList>` in a two-column flex (≥ md) | app/awards/page.tsx

### E2E (US2)

- [ ] T053 [P] [US2] E2E — scroll-spy: click each `C.x` → page scrolls to `D.x` + URL hash updates + active state moves; manual scroll past a heading updates active state on cross-threshold | tests/e2e/awards/scroll-spy.spec.ts
- [ ] T054 [P] [US2] E2E — deep-link: visit `/awards#mvp` directly → D.6 in viewport on first paint + C.6 starts active; visit `/awards#unknown` → top of page + C.1 active + no console errors | tests/e2e/awards/deep-link.spec.ts
- [ ] T055 [P] [US2] E2E — render order verification: first row has image on the left, second row has image on the right (visual zig-zag confirmation across all 6 cards) | tests/e2e/awards/render.spec.ts

**Checkpoint**: User Story 2 complete — side-nav fully interactive; deep-links work; visual zig-zag verified.

---

## Phase 5: User Story 5 — Unauthenticated visitor is redirected to Login (Priority: P1)

**Goal**: Hitting `/awards` without a session redirects to `/`. After login, the user is returned to `/awards` (with the original hash preserved if one was present) per FR-009.

**Independent Test**: Open `/awards` in an incognito window → server redirects to `/` before any awards content renders. Visit `/awards#mvp` while signed-out → log in → land on `/awards` with D.6 in viewport.

### Implementation (US5)

> Basic redirect requires NO code change — `proxy.ts:28` already protects `/awards`. The work is hash preservation.

- [ ] T056 [P] [US5] Add a one-line `'use client'` island at the top of the Login page that calls `stashRedirectTarget(...)` on mount, capturing `document.referrer` if it points at a same-origin protected path (e.g. `/awards#mvp`). Does NOT change existing Login behavior | app/page.tsx
- [ ] T057 [US5] Wire `usePostAuthRedirect(pathname)` (T021) into `app/awards/page.tsx` via a small client island near the top of the body so it consumes any stashed redirect on mount and triggers `useScrollSpy.scrollTo(slug)` | app/awards/page.tsx

### E2E (US5)

- [ ] T058 [P] [US5] E2E — basic redirect: unauthenticated visit to `/awards` returns 307/302 to `/`; on login success, return to `/awards` (no hash) | tests/e2e/awards/auth-redirect.spec.ts
- [ ] T059 [P] [US5] E2E — hash preservation: unauthenticated visit to `/awards#mvp` → redirect to `/`; on login success, return to `/awards`, hash restored, D.6 row scrolled into view | tests/e2e/awards/auth-redirect-hash.spec.ts

**Checkpoint**: User Story 5 complete — auth gate verified, hash preserved across the login round-trip per FR-009.

---

## Phase 6: User Story 3 — Open Sun* Kudos detail from the promo block (Priority: P2)

**Goal**: Clicking the "Chi tiết" CTA inside the (existing, reused) `<KudosPromo>` block on `/awards` navigates to `/kudos`.

**Independent Test**: Click "Chi tiết" on `/awards` → URL becomes `/kudos`. Hover/focus produce the locked-in default states.

- [ ] T060 [US3] Confirm `<KudosCtaButton>` `href` points to `/kudos` (the locked decision); if it currently targets a different route, update the href constant | components/home/kudos-cta-button.tsx
- [ ] T061 [P] [US3] E2E — Chi tiết CTA: click "Chi tiết" on `/awards` → URL becomes `/kudos`; verify hover state visible | tests/e2e/awards/kudos-cta.spec.ts

**Checkpoint**: User Story 3 complete — CTA wired and tested. (Visual fidelity is automatic via reused component.)

---

## Phase 7: User Story 4 — Localised UI follows the global language preference (Priority: P2)

**Goal**: All visible strings on `/awards` re-render in the active locale (VN default, EN alternate) without a full page reload, using `next-intl` already configured in the app.

**Independent Test**: Switch language to EN via the header → page title, side-menu items, "Số lượng/Giá trị" labels, captions, descriptions, and Kudos block all switch to English without a refresh.

- [ ] T062 [US4] Audit every awards component (`components/awards/*`) and confirm every visible string flows through `useTranslations()` from `next-intl` — no hard-coded VN strings anywhere | components/awards/
- [ ] T063 [P] [US4] E2E — VN/EN switching: page loads in VN, switch to EN via header, verify all visible strings change without full reload; missing-key fallback emits a console warning in non-prod | tests/e2e/awards/i18n.spec.ts

**Checkpoint**: User Story 4 complete — i18n end-to-end verified.

---

## Phase 8: User Story 6 — Responsive on mobile and tablet (Priority: P3)

**Goal**: `/awards` is usable at all three breakpoints (mobile ≥ 360, tablet ≥ 768, desktop ≥ 1280) per the responsive table in design-style § Responsive. Mobile drops the zig-zag (image always on top); side-nav becomes a horizontal scroll strip below the header; CTA fills width.

**Independent Test**: Resize the viewport to 375 / 768 / 1280; verify the layout matches design-style § Responsive at each breakpoint.

### Tests (US6)

- [ ] T064 [P] [US6] E2E — responsive at 375 × 720 (mobile), 768 × 1024 (tablet), 1440 × 900 (desktop): zig-zag dropped on mobile, retained on tablet/desktop; side-nav transforms; CTA `width: 100%` on mobile | tests/e2e/awards/responsive.spec.ts

### Implementation (US6)

- [ ] T065 [P] [US6] Apply mobile-first Tailwind to `<AwardRow>` (`flex-col` base; `xl:flex-row` / `xl:flex-row-reverse` per direction), `<AwardImage>` (full-width 1:1 aspect on mobile; fixed 336² at xl), `<AwardContent>` (`w-full` mobile; `xl:w-[480px]` desktop) | components/awards/{award-row,award-image,award-content}.tsx
- [ ] T066 [P] [US6] Apply mobile-first to `<AwardsSideNav>`: < md → horizontal scroll strip pinned below the header (height 56); ≥ md → existing sticky 178 px aside | components/awards/awards-side-nav.tsx
- [ ] T067 [P] [US6] Verify `useScrollSpy` recomputes `rootMargin` on `(max-width: 767px)` matchMedia change events (already tested in T016 — ensure the awards page exercises it) | hooks/use-scroll-spy.ts
- [ ] T068 [US6] Verify the reused `<KudosPromo>` collapses correctly at < md (it already supports column-stacked layout from Homepage) and that the awards-page padding/gap follow `xl:px-36 px-4 md:px-12` consistent with Homepage SAA convention | app/awards/page.tsx

**Checkpoint**: User Story 6 complete — feature is responsive at all three breakpoints.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final accessibility, performance, and cross-browser validation before staging deploy.

- [ ] T069 [P] Run `axe-core` against the rendered page in Playwright; resolve any A or AA violations (focus order, aria-labels, contrast); add the axe pass to the E2E suite | tests/e2e/awards/a11y.spec.ts
- [ ] T070 [P] Lighthouse mobile audit on `/awards`: target ≥ 90 Performance and ≥ 95 Accessibility per spec SC-003; fix lazy-loading / image-priority issues if scores fall short | (Lighthouse run, no file)
- [ ] T071 [P] Manual cross-browser smoke test on Chrome / Safari / Firefox latest at 1440 × 900: confirm `mix-blend-mode: screen`, glow shadows, `backdrop-blur`, sticky positioning, smooth-scroll all render correctly | (manual)
- [ ] T072 Verify all spec success criteria (SC-001 through SC-005) are measurable and instrumented (telemetry hooks for hash-update and IntersectionObserver visibility) | (manual checklist)
- [ ] T073 [P] Commit-time guard: confirm `npm test`, `npm run lint`, `tsc --noEmit`, and `npm audit` all pass on the feature branch (per Constitution Development Workflow) | CI / package.json scripts

**Checkpoint**: Feature ready for staging deploy.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — can start immediately.
- **Phase 2 (Foundation)**: Depends on Phase 1 (T002 specifically — overlay rasters needed before component impls run end-to-end). T024/T025 can run in parallel with the rest of Phase 2 (independent of awards page).
- **Phase 3+ (User stories)**: All depend on Phase 2 completion.
  - US1 (Phase 3) is the MVP; everything else technically depends on US1's components existing.
  - US5 (Phase 5 — auth) and US3 (Phase 6 — Kudos CTA) can be done in parallel with each other after US1.
  - US2 (Phase 4 — scroll-spy) builds on US1 (needs the rendered rows); should follow US1.
  - US4 (Phase 7 — i18n) is mostly verification; can be done after US1.
  - US6 (Phase 8 — responsive) depends on US1 + US2 components existing.
- **Phase 9 (Polish)**: Depends on all desired user stories being complete.

### Within Each Phase

- Tests are written first (failing) per Constitution Principle III — they precede the implementation task in the listing.
- Sub-component models (icons, hooks, divider) before composers (rows, lists).
- Composers before route file (`app/awards/page.tsx`).
- Route file before integration tests that hit `/awards`.

### Parallel Opportunities

- **Phase 1**: T001 ∥ T003 (T002 is a sequential vendor request, may not be parallelizable).
- **Phase 2**: T004 ∥ T005 ∥ T006 ∥ T009 ∥ T010 ∥ T011 ∥ T012 ∥ T013 ∥ T014 ∥ T015 ∥ T016 ∥ T018 ∥ T020 ∥ T022 ∥ T023 ∥ T024. Each `[P]` is a different file with no incomplete-task dependency. T007/T008/T017/T019/T021/T025 are sequential after their `[P]` siblings.
- **Phase 3 (US1)**: All test tasks T026–T032 in parallel; all component tasks T033–T038 in parallel; T039 → T040 → T041 sequential (composition); T042 sequential (depends on T033–T041); T045 ∥ T046 ∥ T047 once T042 ships.
- **Phase 4 (US2)**: T048 ∥ T049 in parallel; T050 ∥ T051 (T051 depends on T017 from foundation); T052 sequential; T053 ∥ T054 ∥ T055 once T052 ships.
- **Phase 5 (US5)**: T056 ∥ T057 in parallel; T058 ∥ T059 once both ship.
- **Phase 7 (US4)**: T062 ∥ T063 in parallel.
- **Phase 8 (US6)**: T064 ∥ T065 ∥ T066 ∥ T067 in parallel.
- **Phase 9 (Polish)**: T069 ∥ T070 ∥ T071 ∥ T073 in parallel.
- **Cross-story parallelism**: Once Phase 2 is green, US1 + US3 + US4 can be staffed in parallel by different developers if team capacity allows.

---

## Implementation Strategy

### MVP First (recommended)

1. Complete Phase 1 + Phase 2 (assets, types, lib extension, tokens, hooks, helpers, i18n, Homepage href fix).
2. Complete Phase 3 (US1 — full catalogue render).
3. **STOP and VALIDATE**: deploy a feature flag or staging URL; manually walk through the page with design.
4. Complete Phase 5 (US5 — auth + hash) — required for production correctness.
5. Complete Phase 4 (US2 — scroll-spy) — biggest UX win after MVP.
6. Phase 6 (US3 — Kudos CTA), Phase 7 (US4 — i18n), Phase 8 (US6 — responsive) in any order.
7. Phase 9 (polish) before staging deploy.

### Incremental Delivery Order

1. PR #1: Phase 1 + Phase 2 (Foundation only — types, lib, tokens, hooks, icons, i18n, Homepage href fix). Reviewable in isolation; no UI changes.
2. PR #2: Phase 3 (US1 MVP).
3. PR #3: Phase 4 (US2 — scroll-spy).
4. PR #4: Phase 5 (US5 — hash preservation).
5. PR #5: Phase 6 + Phase 7 (Kudos CTA + i18n).
6. PR #6: Phase 8 (US6 — responsive).
7. PR #7: Phase 9 (polish).

Each PR includes its own tests + passes CI gates per Constitution Development Workflow.

---

## Notes

- **Total tasks**: 73 (3 setup + 22 foundation + 22 US1 + 8 US2 + 4 US5 + 2 US3 + 2 US4 + 5 US6 + 5 polish).
- **Tests are non-negotiable** per Constitution Principle III — every implementation task in foundation and user-story phases is preceded by a failing-test task.
- **No mocking the database** — integration tests (T045–T047) MUST hit a real Supabase test instance. See plan.md § Mocking Strategy.
- **Commit cadence**: commit after each task or logical group; mark `- [x]` as you go.
- If a task encounters a spec ambiguity, **stop and re-spec** — do not assume.
- The `momorph.reviewspecify` × 4 + `momorph.reviewplan` cycles have already resolved every design / scope question. If new questions arise, log them under `## Open Questions` in plan.md and tag the team rather than blocking implementation.
