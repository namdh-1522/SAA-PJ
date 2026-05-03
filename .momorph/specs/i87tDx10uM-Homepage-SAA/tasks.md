# Tasks: Homepage SAA (About SAA 2025)

**Frame**: `i87tDx10uM-Homepage-SAA`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)
**Created**: 2026-04-22
**Generated from**: `/momorph.tasks` after plan.md second review (832 lines, all gaps closed)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel with other `[P]` tasks in the same group (different files, no dependency on an incomplete task)
- **[Story]**: Which user story this belongs to (US1–US6). Omitted for Setup / Foundational / Polish phases per template rules.
- **|**: File path the task creates or modifies

**TDD note (Constitution §III)**: Within every implementation pair, the test file MUST be authored and FAILING before the implementation is written. Tests are marked `[P]` because different test files can be written in parallel; their matching implementation tasks are also marked `[P]` because different impl files are parallelisable once their own test is in place.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, asset preparation, env + token extensions, i18n keys. These unblock every subsequent phase.

- [x] T001 Create directory scaffolding (`app/about-saa-2025/`, `components/home/`, `lib/auth/`, `tests/unit/home/`, `tests/unit/ui/`, `tests/integration/home/`, `tests/e2e/home/`, `public/assets/home/awards/`, `public/fonts/`) | project root
- [x] T002 Add Homepage env vars to environment files (`NEXT_PUBLIC_SAA_EVENT_START=2025-12-26T18:30:00+07:00`, `NEXT_PUBLIC_POST_AUTH_URL=/about-saa-2025`) | .env.local and .env.example
- [x] T003 Extend CSS design tokens per design-style.md §Design Tokens (all new color / typography / z-index / spacing / border / shadow vars) | app/globals.css
- [x] T004 [P] Download hero background image from Figma node `2167:9028` via `mcp__momorph__get_figma_image` (fileKey `9ypp4enmFmdK3YAFJLIu6C`) | public/assets/home/hero-bg.jpg
- [x] T005 [P] Export ROOT FURTHER wordmark from Figma node `2167:9032` as SVG (outlined text). Fallback: note live-text approach in plan.md §B.0 | public/assets/home/hero-root-further.svg
- [x] T006 [P] Download Kudos promo background from Figma node `I3390:10349;313:8416` | public/assets/home/kudos-bg.png
- [x] T007 [P] Export Kudos logomark (red S + gold KUDOS) from Figma node `I3390:10349;329:2948` as SVG | public/assets/home/kudos-logomark.svg
- [x] T008 [P] Download Top Talent award thumbnail from Figma | public/assets/home/awards/top-talent.png
- [x] T009 [P] Download Top Project award thumbnail from Figma | public/assets/home/awards/top-project.png
- [x] T010 [P] Download Top Project Leader award thumbnail from Figma | public/assets/home/awards/top-project-leader.png
- [x] T011 [P] Download Best Manager award thumbnail from Figma | public/assets/home/awards/best-manager.png
- [x] T012 [P] Download Signature 2025 - Creator award thumbnail from Figma | public/assets/home/awards/signature-2025-creator.png
- [x] T013 [P] Download MVP award thumbnail from Figma | public/assets/home/awards/mvp.png
- [x] T014 Place `Digital Numbers` WOFF2 font file supplied by design team (placeholder file OK if delayed — font loader tolerates missing paths at build time) | public/fonts/DigitalNumbers-Regular.woff2
- [x] T015 Register Digital Numbers font via `next/font/local`, expose as `--font-digital` with `'Consolas', monospace` fallback; keep existing Montserrat registrations intact | app/layout.tsx
- [x] T016 [P] Add complete `home.*` + extended `common.*` i18n keys to Vietnamese message file per plan.md §i18n key tree. Mark the 5/6 award descriptions + B4 body paragraphs as `TODO(content)` placeholders | messages/vi.json
- [x] T017 [P] Add matching `home.*` + `common.*` i18n keys to English message file; mark every value as `[TODO: EN translation]` awaiting content team | messages/en.json

**Checkpoint**: Assets on disk, tokens declared, i18n keys present. Phase 2 can now begin.

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Shared types, libs, icons, header/footer refactor, route skeleton. **CRITICAL**: no user-story work may start until this phase is complete.

### Shared types + libs (TDD for functions)

- [x] T018 Create TypeScript types `AwardSpec`, `CountdownValues`, `UserRole` | types/home.ts
- [x] T019 Create `AWARDS: readonly AwardSpec[]` registry with 6 entries in exact DOM order per plan.md §Component Contracts | lib/awards.ts
- [x] T020 [P] Write failing unit tests for `parseEventStart()` + `getInitialCountdown()` (future/past/invalid ISO + zero-pad math) | tests/unit/home/event.test.ts
- [x] T021 Implement `parseEventStart(iso: string | undefined): Date | null` and `getInitialCountdown(now: Date, target: Date | null): CountdownValues` | lib/event.ts
- [x] T022 [P] Write failing unit tests for `getUserRole()` covering `app_metadata.role='admin'`, `user_metadata.role='admin'`, neither-present → `'user'`, and null session | tests/unit/home/get-user-role.test.ts
- [x] T023 Implement `getUserRole()` reading Supabase SSR session (preferring `app_metadata.role`, falling back to `user_metadata.role`) | lib/auth/get-user-role.ts

### Icon components (all pure SVG components, parallel-safe)

- [x] T024 [P] Create Bell SVG icon React component (24×24, stroke `#FFFFFF`) | components/icons/bell-icon.tsx
- [x] T025 [P] Create User/Avatar SVG icon React component (24×24, stroke `#FFFFFF`) | components/icons/user-icon.tsx
- [x] T026 [P] Create Arrow-up-right SVG icon React component (24×24, inherits `currentColor`) | components/icons/arrow-up-right-icon.tsx
- [x] T027 [P] Create Pencil/Kudos SVG icon React component (24×24, `#00101A`) | components/icons/pencil-kudos-icon.tsx
- [x] T028 [P] Create SAA-logo SVG icon React component (24×24, original multi-stop SVG) | components/icons/saa-logo-icon.tsx
- [x] T029 [P] Create Hamburger SVG icon React component (24×24, stroke `#FFFFFF`, 3 lines 2px each) — authored from scratch, no Figma source | components/icons/hamburger-icon.tsx

### Shared infrastructure: LanguageSelector promotion

- [x] T030 Move LanguageSelector to shared UI location (file rename `components/login/language-selector.tsx` → `components/ui/language-selector.tsx`) | components/ui/language-selector.tsx
- [x] T031 Update the one existing import site in `app/page.tsx` (Login) to point at the new path; run Login unit test suite to verify all 31 tests still pass | app/page.tsx

### Header/Footer slotted refactor (with backcompat regression test)

- [x] T032 Write failing regression test exercising Login's `<Header><LanguageSelector /></Header>` call-site pattern — `children` must alias `rightSlot` after refactor | tests/unit/ui/header-backcompat.test.tsx
- [x] T033 Refactor Header to slotted API (`leftSlot?` / `navSlot?` / `rightSlot?` + `children` fallback mapping to `rightSlot`) per plan.md §Component Contracts | components/ui/header.tsx
- [x] T034 Refactor Footer to slotted API (`logoSlot?` / `navSlot?`) preserving Login's copyright-only default when no navSlot is supplied | components/ui/footer.tsx
- [x] T035 Run full Vitest + Playwright suites; confirm Login's 31 pre-existing tests still pass and the new backcompat test goes from red → green | tests

### Route skeleton

- [x] T036 Create minimal RSC page (server-side `getUser()` + `getUserRole()` reads + empty `<h1>Homepage</h1>` body) as a placeholder for later wire-ups | app/about-saa-2025/page.tsx
- [x] T037 Verify `proxy.ts` redirects: authenticated users on `/` land on `/about-saa-2025`; unauthenticated on `/about-saa-2025` are redirected to `/` | proxy.ts (no code change — behavioural verification only)

**Checkpoint**: Foundation ready — user-story implementation can now begin.

---

## Phase 3: User Story 4 — Global Navigation (Priority: P1) 🎯 Scaffolding MVP

**Goal**: Every authenticated page must have a header with logo + 3 nav links + language + bell + avatar menu, plus a footer with the same 4 nav links + copyright. Active-route detection, mobile hamburger drawer, and sign-out flow all live here.

**Why first among P1s** — every subsequent story (US1, US2, US6, US3, US5) renders _inside_ this shell. Completing it first lets downstream PRs focus on content, not chrome.

**Independent Test**: At `/about-saa-2025`, logged in, verify (a) the header shows logo + "About SAA 2025" active + "Awards Information" + "Sun\* Kudos" + Language (VN) + Bell + Avatar; (b) clicking any currently-inactive nav link routes correctly; (c) clicking the active "About SAA 2025" link scrolls-to-top without navigating; (d) avatar dropdown shows Profile + Sign out (+ Admin Dashboard if the session has `role: 'admin'`); (e) at viewport < 768px the nav collapses to a hamburger opening a focus-trapped drawer.

### Tests (write red first, per Constitution §III)

- [x] T038 [P] [US4] Write failing tests for `<NavLink>` — active-route detection via `usePathname`, self-click `scrollTo({ top: 0, behavior: 'smooth' })` without navigation, hash-anchor preservation | tests/unit/ui/nav-link.test.tsx
- [x] T039 [P] [US4] Write failing tests for `<HeaderNav>` — 3 links render, correct active state per pathname | tests/unit/ui/header-nav.test.tsx
- [x] T040 [P] [US4] Write failing tests for `<AvatarMenu>` — admin-only "Admin Dashboard" item, Escape/outside-click closes, focus-trap inside menu, sign-out redirects to `/` | tests/unit/ui/avatar-menu.test.tsx
- [x] T041 [P] [US4] Write failing tests for `<NotificationButton>` — badge `aria-label="${count} unread notifications"` visible only when `count > 0`; fetch error hides badge silently | tests/unit/ui/notification-button.test.tsx
- [x] T042 [P] [US4] Write failing tests for `<HeaderControls>` — composition renders Language + Bell + Avatar; `isAdmin` prop propagates to AvatarMenu | tests/unit/ui/header-controls.test.tsx
- [x] T043 [P] [US4] Write failing tests for `<FooterNav>` — 4 links render with the same active-link treatment as header; "Tiêu chuẩn chung" fourth link present | tests/unit/ui/footer-nav.test.tsx
- [x] T044 [P] [US4] Write failing tests for `<MobileNavDrawer>` — opens at `< 768px` only, focus-trap, Escape + backdrop-click close, renders 3 nav links + language + avatar menu items | tests/unit/ui/mobile-nav-drawer.test.tsx
- [x] T045 [P] [US4] Write failing tests for `<HamburgerButton>` — `aria-controls` + `aria-expanded` sync with drawer state, visible only below `md` breakpoint | tests/unit/ui/hamburger-button.test.tsx

### Implementations (each depends on its test)

- [x] T046 [P] [US4] Implement `<NavLink>` Client Component (`href`, `labelKey`, `matchMode`) per plan.md §Component Contracts | components/ui/nav-link.tsx
- [x] T047 [P] [US4] Implement `<HeaderNav>` Client Component wrapping 3 `<NavLink>`s (About SAA 2025, Awards Information [startsWith], Sun\* Kudos [startsWith]) | components/ui/header-nav.tsx
- [x] T048 [P] [US4] Implement `<AvatarMenu>` Client Component with dropdown anchored `top: 48px; right: 0` + collision check (TR-009) + focus trap + Escape handler + sign-out via `supabase.auth.signOut()` + `router.push('/')` | components/ui/avatar-menu.tsx
- [x] T049 [P] [US4] Implement `<NotificationButton>` Client Component — 40×40 rounded button + bell icon + red 8×8 badge (hidden when count=0 or fetch error) + fetch `/api/notifications/unread-count` on mount | components/ui/notification-button.tsx
- [x] T050 [P] [US4] Implement `<HeaderControls>` RSC composing LanguageSelector + NotificationButton + AvatarMenu; accepts `isAdmin: boolean` + `userEmail?: string` | components/ui/header-controls.tsx
- [x] T051 [P] [US4] Implement `<FooterNav>` RSC with 4 `<NavLink>`s (About SAA 2025, Awards Information, Sun\* Kudos, Tiêu chuẩn chung) | components/ui/footer-nav.tsx
- [x] T052 [P] [US4] Implement `<MobileNavDrawer>` Client Component — portal into `<body>` via `createPortal`, z-index `var(--z-dropdown)`, right-slide animation, focus-trap, dismiss on Escape/backdrop | components/ui/mobile-nav-drawer.tsx
- [x] T053 [P] [US4] Implement `<HamburgerButton>` Client Component — toggles drawer open state, `md:hidden` visibility, `aria-controls`/`aria-expanded` attributes | components/ui/hamburger-button.tsx

### Integration

- [x] T054 [US4] Wire `<Header>` (with default logo `leftSlot`, `navSlot={<HeaderNav />}` + `<HamburgerButton>` for mobile, `rightSlot={<HeaderControls />}`) and `<Footer>` (with default logo `logoSlot`, `navSlot={<FooterNav />}`) into the Homepage RSC; also render `<MobileNavDrawer>` at page level | app/about-saa-2025/page.tsx

**Checkpoint**: Global nav fully functional; all subsequent story PRs render inside this shell.

---

## Phase 4: User Story 1 — Landing experience, hero, countdown (Priority: P1)

**Goal**: Users land at `/about-saa-2025` and see the ROOT FURTHER hero, a live 60-second-ticking countdown to the event, event info ("Thời gian: 26/12/2025" / "Địa điểm: Âu Cơ Art Center" / livestream note), and two CTAs that navigate to Awards Information and Sun\* Kudos.

**Independent Test**: Page loads → ROOT FURTHER visible, "Coming soon" subtitle visible, 3 countdown tiles show zero-padded 2-digit values matching `floor((NEXT_PUBLIC_SAA_EVENT_START − now)/unit)`, clicking ABOUT AWARDS → `/awards-information`, clicking ABOUT KUDOS → `/sun-kudos`, hover on either CTA flips to filled-yellow (#FFEA9E + #00101A text).

### Tests

- [x] T055 [P] [US1] Write failing tests for `<CountdownTile>` — zero-padding ("05" not "5"), `--` fallback when value is the literal string | tests/unit/home/countdown-tile.test.tsx
- [x] T056 [P] [US1] Write failing tests for `<Countdown>` — SSR-rendered initial DOM == first client render (no hydration warning), `setInterval(60000)` tick changes tile values, missing/invalid `targetISO` collapses tiles to `--` and hides "Coming soon" subtitle, `hasStarted=true` collapses tiles to "00" | tests/unit/home/countdown.test.tsx
- [x] T057 [P] [US1] Write failing tests for `<EventInfo>` — renders all three i18n keys (time label+value, location label+value, livestream note) in correct layout | tests/unit/home/event-info.test.tsx
- [x] T058 [P] [US1] Write failing tests for `<HeroCtaButton>` — default state has outlined classes, `:hover` flips classes to filled yellow, click navigates via `next/link` to `href`, focus-visible outline visible, icon + text composition | tests/unit/home/hero-cta-button.test.tsx
- [x] T059 [P] [US1] Write failing tests for `<RootFurtherMark>` — renders SVG with `aria-label="ROOT FURTHER"`, `size='xl'` applies hero dimensions (1224×200), `size='md'` applies sub-heading dimensions (290×134) | tests/unit/home/root-further-mark.test.tsx

### Implementations

- [x] T060 [P] [US1] Implement `<CountdownTile>` RSC — 116×128 flex-col centered, number at `font-family: var(--font-digital)` 49.152px `#FFEA9E` in a `rgba(255,234,158,0.10)` rounded background, label Montserrat 700 16/24 ls:0.5 uppercase `#FFFFFF` | components/home/countdown-tile.tsx
- [x] T061 [P] [US1] Implement `<Countdown>` Client Component — accepts `targetISO: string \| undefined` prop, computes initial values on server via `getInitialCountdown()`, re-computes every 60s on the client, renders B1.2 "Coming soon" subtitle (hidden when `hasStarted`), wraps tick `useEffect` in try/catch | components/home/countdown.tsx
- [x] T062 [P] [US1] Implement `<EventInfo>` RSC — flex-col gap:8; row 1 flex-row gap:60 (Time group + Location group); row 2 livestream note; all strings via `useTranslations('home.event')` | components/home/event-info.tsx
- [x] T063 [P] [US1] Implement `<HeroCtaButton>` RSC — `<Link>` with 276×60 dims, `rounded-lg`, default classes per plan.md implementation mapping (outlined state), hover/focus-visible classes flip to filled yellow, gap-2 flex items-center with label + `<ArrowUpRightIcon />` | components/home/hero-cta-button.tsx
- [x] T064 [P] [US1] Implement `<RootFurtherMark>` RSC — loads `/assets/home/hero-root-further.svg` via `<Image>` or `<img>`, passes through `size` prop to width/height, includes `aria-label="ROOT FURTHER"` with `role="img"` wrapper; falls back to outlined `<h1>` text if SVG asset missing | components/home/root-further-mark.tsx

### CSS + Section composition + Integration

- [x] T065 [US1] Add `.home-hero-bg` CSS class to globals.css applying hero background image + `background-size: cover` + `background-position: right top` + H/V gradient overlays per design-style.md §B | app/globals.css
- [x] T066 [US1] Implement `<HeroSection>` RSC composing: BG div with `.home-hero-bg` class + `<RootFurtherMark size="xl">` + `<Countdown targetISO={…}>` + `<EventInfo>` + two `<HeroCtaButton>` (labels `home.cta.about_awards` / `home.cta.about_kudos`, hrefs `/awards-information` / `/sun-kudos`) | components/home/hero-section.tsx
- [x] T067 [US1] Wire `<HeroSection>` into Homepage (pass `eventStartISO={process.env.NEXT_PUBLIC_SAA_EVENT_START}`) | app/about-saa-2025/page.tsx

**Checkpoint**: US1 independently testable. Hero + countdown + CTAs all live and accessible.

---

## Phase 5: User Story 2 — Award categories discovery (Priority: P1)

**Goal**: The six award cards (Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025 - Creator, MVP) render as a 3×2 grid on desktop (2×3 on tablet, 1×6 on mobile), each deep-linking to `/awards-information#<slug>` on click of image / title / "Chi tiết" link.

**Independent Test**: Scroll to "Hệ thống giải thưởng" → exactly 6 cards in AWARDS-array order; clicking any image, title, or "Chi tiết" navigates to `/awards-information#<slug>` with the expected hash; descriptions longer than 2 lines truncate with ellipsis and `title` attribute; cards lift and glow on hover.

### Tests

- [x] T068 [P] [US2] Write failing tests for `<AwardCard>` — renders title + 2-line-clamped description + image with alt text + "Chi tiết" link, all 3 clickable regions link to `/awards-information#<slug>`, hover adds lift transform and box-shadow class, `min-height: 48px` reserved for 2-line description | tests/unit/home/award-card.test.tsx
- [x] T069 [P] [US2] Write failing tests for `<AwardList>` — renders exactly 6 `<AwardCard>` in AWARDS-array order, correct grid classes at each viewport (mobile-first: `grid-cols-1` → `md:grid-cols-2` → `lg:grid-cols-3`) | tests/unit/home/award-list.test.tsx

### Implementations

- [x] T070 [P] [US2] Implement `<AwardCard>` RSC — `<Link>` wrapping the 336×336 gold-glow `<Image>`, title, and "Chi tiết" row; image uses `next/image` with `sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 336px"` + `quality={90}`; description uses `-webkit-line-clamp: 2` + full `title` attribute | components/home/award-card.tsx
- [x] T071 [P] [US2] Implement `<AwardList>` RSC — maps `AWARDS` from `lib/awards.ts` to `<AwardCard>`s; grid classes `grid grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-[60px] md:gap-y-16 lg:grid-cols-3 lg:gap-x-[108px] lg:gap-y-20` | components/home/award-list.tsx

### Section composition + Integration

- [x] T072 [US2] Implement `<AwardsSection>` RSC — C1 header (caption + `<hr class="border-[var(--color-divider)]">` + title row containing ONLY "Hệ thống giải thưởng" — no descriptor; the previously-included "Các hạng mục sẽ được trao giải theo TOP..." string is NOT in the Figma design and MUST NOT be rendered) + `<AwardList>`; outer flex-col gap:80 | components/home/awards-section.tsx
- [x] T073 [US2] Wire `<AwardsSection>` into Homepage (below hero, above future Kudos block) | app/about-saa-2025/page.tsx

**Checkpoint**: US2 independently testable. 6 award cards render, deep-link correctly, responsive across all breakpoints.

---

## Phase 6: User Story 6 — Root Further narrative (Priority: P2)

**Goal**: Between the hero and the awards grid, users see a campaign narrative section with the smaller "ROOT FURTHER" sub-heading (Group 434), multi-paragraph body copy, and a centered pull-quote.

**Independent Test**: Scroll below hero → smaller "ROOT FURTHER" mark appears (290×134) above multi-paragraph body text (Montserrat 400 16/24 ls:0.5 #FFFFFF, max-width 1152); quote "A tree with deep roots fears no storm" is centered with source attribution "(Cây sâu bền rễ, bão giông chẳng nề — Ngạn ngữ Anh)" below; mobile reduces body to 14/22 and padding-x to 16.

- [x] T074 [US6] Implement `<AboutBody>` RSC — `<RootFurtherMark size="md">` on top, then body paragraphs via `t('home.about.body_pN')` in a `max-w-[1152px]` flex-col, then centered quote + source. Use `next-intl` `useTranslations('home.about')` for text | components/home/about-body.tsx
- [x] T075 [US6] Wire `<AboutBody>` into Homepage between `<HeroSection>` and `<AwardsSection>` | app/about-saa-2025/page.tsx

**Checkpoint**: US6 visible; copy placeholders acceptable pending content team.

---

## Phase 7: User Story 3 — Sun\* Kudos promo (Priority: P2)

**Goal**: Below the awards grid, a 1224×500 promo block surfaces Sun\* Kudos with kicker "Phong trào ghi nhận", title "Sun\* Kudos", the "ĐIỂM MỚI CỦA SAA 2025…" description with rich-text emphasis, a small filled-yellow "Chi tiết" CTA navigating to `/sun-kudos`, and the composite red-S + gold "KUDOS" logomark on the right.

**Independent Test**: Scroll to D1 → kicker + title + body render (with bolded "ĐIỂM MỚI CỦA SAA 2025" first run); "Chi tiết" button navigates to `/sun-kudos`; logomark SVG visible on right; at `< 768px` the logomark + BG are hidden/de-emphasised and the content stacks full-width.

### Tests

- [x] T076 [P] [US3] Write failing tests for `<KudosLogomark>` — renders image with `role="img"` + `aria-label="Sun* Kudos logo"`; correct dimensions (364×72) | tests/unit/home/kudos-logomark.test.tsx
- [x] T077 [P] [US3] Write failing tests for `<KudosCtaButton>` — 127×56 small variant, filled yellow default, `font-size: 16px/24`, icon + text gap:8, clicks navigate to `/sun-kudos` | tests/unit/home/kudos-cta-button.test.tsx
- [x] T078 [P] [US3] Write failing tests for `<KudosPromo>` — renders kicker + title + body with `<strong>` wrapping "ĐIỂM MỚI CỦA SAA 2025" + `<KudosCtaButton>` + `<KudosLogomark>` positioned on the right | tests/unit/home/kudos-promo.test.tsx

### Implementations

- [x] T079 [P] [US3] Implement `<KudosLogomark>` RSC — `<Image src="/assets/home/kudos-logomark.svg" width={364} height={72} role="img" aria-label="Sun* Kudos logo">`; wrap in positioned `<div class="absolute right-8 top-1/2 -translate-y-1/2">` | components/home/kudos-logomark.tsx
- [x] T080 [P] [US3] Implement `<KudosCtaButton>` RSC — `<Link href="/sun-kudos">` styled 127×56 filled yellow + `<ArrowUpRightIcon />` + label from `t('home.cta.detail')`; uses `--text-cta-btn-sm` typography | components/home/kudos-cta-button.tsx
- [x] T081 [P] [US3] Implement `<KudosPromo>` RSC — 1224×500 relative container with background from `/assets/home/kudos-bg.png`; D2 content column (457×408) on left with kicker + title (57/64 #FFEA9E) + rich-text description using `t.rich('home.kudos.description_rich', { strong: (chunks) => <strong>{chunks}</strong> })` + `<KudosCtaButton>`; `<KudosLogomark>` on right; mobile: stacks single-column, hides logomark + bg | components/home/kudos-promo.tsx

### Integration

- [x] T082 [US3] Wire `<KudosPromo>` into Homepage (below `<AwardsSection>`, above footer) | app/about-saa-2025/page.tsx

**Checkpoint**: US3 independently testable. Kudos block fully rendered with rich-text emphasis.

---

## Phase 8: User Story 5 — Floating widget button (Priority: P3)

**Goal**: A 106×64 yellow pill fixed at `right:32 bottom:96 z:var(--z-widget)` always visible on Homepage; clicking opens a stubbed "Coming soon" tooltip + `console.warn('[WidgetButton] menu destinations TBD')`.

**Independent Test**: At any scroll position and viewport, the widget is visible. On desktop it sits above the footer even when scrolled to bottom. Click → tooltip appears briefly, console warning logged.

- [x] T083 [P] [US5] Write failing tests for `<WidgetButton>` — has `position: fixed` class-set, correct right/bottom offsets; hover scales to 1.05; click fires stub handler (console.warn spied) and toggles a "Coming soon" tooltip element | tests/unit/home/widget-button.test.tsx
- [x] T084 [US5] Implement `<WidgetButton>` Client Component — 106×64 `rounded-full` yellow pill + pencil icon + "/" separator + SAA-logo icon; `position: fixed; right: 32px; bottom: 96px; z-index: var(--z-widget)`; on hover scale; on click `console.warn` + toggle tooltip state | components/home/widget-button.tsx
- [x] T085 [US5] Wire `<WidgetButton>` into Homepage (rendered at page level, not inside any section) | app/about-saa-2025/page.tsx

**Checkpoint**: All 6 user stories complete.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: API stub, route convention files, integration + E2E tests, a11y, visual regression, performance, metadata, cleanup.

### Stub API + integration test

- [x] T086 [P] Write integration test for the unread-count stub route — returns `{ count: 0 }` with `content-type: application/json` | tests/integration/home/unread-count.test.ts
- [x] T087 Implement stub route handler — `GET` returns `NextResponse.json({ count: 0 })`; include a `// TODO: replace with real backend` comment + feature-flag gate comment | app/api/notifications/unread-count/route.ts

### Next.js route convention files + metadata

- [x] T088 [P] Create loading skeleton (header shell + hero placeholder div) for the route | app/about-saa-2025/loading.tsx
- [x] T089 [P] Create route error boundary Client Component with reset button | app/about-saa-2025/error.tsx
- [ ] T090 [P] Add `export const metadata: Metadata = { title: 'About SAA 2025 — Sun* Annual Awards', description: 'Root Further — Sun* Annual Awards 2025' }` to page | app/about-saa-2025/page.tsx

### Integration + E2E tests

- [ ] T091 [P] Write integration test for Homepage RSC — authenticated render surfaces all sections (hero + body + awards + kudos + footer), `isAdmin=true` shows Admin Dashboard in AvatarMenu, `isAdmin=false` hides it, unauthenticated redirect via `proxy.ts` | tests/integration/home/page.test.tsx
- [ ] T092 [P] Write Playwright E2E — stub OAuth login → land on `/about-saa-2025` → for each of 6 award cards, click and assert `page.url()` matches `/awards-information#<slug>` | tests/e2e/home/homepage-nav.spec.ts
- [ ] T093 [P] Write Playwright E2E — login → Homepage → open avatar menu → click Sign out → assert `page.url() === '/'` and Supabase session cookie cleared | tests/e2e/home/signout.spec.ts

### Quality gates

- [ ] T094 Run `@axe-core/playwright` `injectAxe` + `checkA11y(page, null, { detailedReport: true })` on Homepage at 375/768/1280/1512 viewports; assert zero `serious` and zero `critical` violations | tests/e2e/home/a11y.spec.ts
- [ ] T095 Configure Playwright visual regression — `playwright.config.ts` `toHaveScreenshot: { threshold: 0.1, maxDiffPixelRatio: 0.02 }`; generate baseline screenshots at 4 viewports for hero/awards/kudos/footer sections | tests/e2e/screenshots (baselines) + playwright.config.ts
- [ ] T096 Run Lighthouse CI on production build (`next build && next start`); assert FCP ≤ 1500ms, CLS < 0.1, zero hydration warnings; commit Lighthouse config | lighthouserc.js + CI workflow

### Cleanup + final verification

- [ ] T097 Grep repository for `TODO(asset)`, `TODO(content)`, `TODO(admin-role)`; resolve each or migrate to a tracked GitHub issue with owner + due date; surface remaining content-team placeholders in the release notes | repo-wide
- [ ] T098 Final CI verification — `npm run lint` clean, `npx tsc --noEmit` zero errors, `npx vitest run` all green (Login 31 + new 22 unit + 2 integration), `npx playwright test` all green (E2E + a11y + visual), `npm run build` succeeds | CI pipeline

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 Setup ─┐
               ├─► Phase 2 Foundation ─► Phase 3 US4 (Nav) ─┬─► Phase 4 US1 (Hero)
               │                                            ├─► Phase 5 US2 (Awards)
               │                                            ├─► Phase 6 US6 (Body)
               │                                            ├─► Phase 7 US3 (Kudos)
               │                                            └─► Phase 8 US5 (Widget)
               │                                                     │
               └─────────────────────────────────────────────────────┴─► Phase 9 Polish
```

- **Phase 1 → Phase 2**: strict. Assets + tokens + i18n keys must exist before foundation reads them.
- **Phase 2 → Phase 3**: strict. All shared primitives (types, libs, icons, Header/Footer refactor) must exist before any user-story code.
- **Phase 3 → Phases 4–8**: strict. The global nav shell is a hard prerequisite — every subsequent wire-up writes into the same `app/about-saa-2025/page.tsx` already populated with Header/Footer.
- **Phases 4–8**: parallelisable across team members once Phase 3 is complete. Within each story the TDD order (test → impl → integration) is mandatory per Constitution §III.
- **Phase 9**: depends on all desired user stories being complete.

### Within each user story (TDD)

1. Tests marked `[P]` — all can be authored simultaneously (different files, parallel-safe).
2. Implementations marked `[P]` — each depends on its matching test being RED. Once its own test is red, the impl task can proceed in parallel with other `[P]` impl tasks.
3. Section composition tasks (e.g. `<HeroSection>`) depend on all their child impls being green.
4. Integration tasks (wiring into `app/about-saa-2025/page.tsx`) are sequential between stories — they share the same file.

### Shared-file sequencing (cannot be `[P]` despite different stories)

- `app/about-saa-2025/page.tsx` — modified by T036, T054, T067, T073, T075, T082, T085, T090 (eight sequential writes)
- `app/globals.css` — modified by T003 (setup) and T065 (US1 hero BG class). T065 must follow T003.

### Parallel opportunities

- **Phase 1 assets** (T004–T013) — all 10 asset downloads in parallel
- **Phase 2 icons** (T024–T029) — all 6 icon components in parallel
- **Phase 3 tests** (T038–T045) — all 8 nav tests in parallel
- **Phase 3 impls** (T046–T053) — all 8 nav impls in parallel (once their tests are red)
- **Phase 4 tests** (T055–T059) — all 5 hero tests in parallel
- **Phase 4 impls** (T060–T064) — all 5 hero impls in parallel
- **Phase 5 tests** (T068–T069) — both award tests in parallel
- **Phase 7 tests** (T076–T078) — all 3 kudos tests in parallel
- **Phase 9 test authoring** (T086, T088, T089, T091, T092, T093) — all 6 in parallel (different files)

---

## Implementation Strategy

### MVP (recommended staging for incremental delivery)

1. **Phase 1 + Phase 2** (Setup + Foundation) — merged as one or two small PRs (tokens, assets, refactor) — **no user-visible change yet except via the refactored `<Header>` serving Login**.
2. **Phase 3 (US4)** — adds the full nav shell. First PR with user-visible Homepage content (the page renders with header + footer + a bare `<h1>`).
3. **Phase 4 (US1)** — hero + countdown + CTAs live. 🎯 **First MVP-worthy deployable**.
4. **STOP + VALIDATE**: run all tests + manual QA + Lighthouse baseline.
5. **Phase 5 (US2)** — awards grid. Second deployable.
6. **Phase 6 (US6)** — narrative body. Third deployable.
7. **Phase 7 (US3)** — Kudos promo. Fourth deployable.
8. **Phase 8 (US5)** — widget button. Fifth (minor) deployable.
9. **Phase 9 (Polish)** — integration tests + E2E + a11y + Lighthouse CI + cleanup — final deployable.

### Alternative: single big bang

Not recommended — the component surface is wide (22 components + 6 icons + 26 tests) and a single PR is near-unreviewable. The incremental sequence lets each PR stay < 600 LOC with focused review.

### Parallelism across team members

Once Phase 3 is merged, Phases 4, 5, 6, 7, 8 can be staffed in parallel by 5 devs. Each dev owns one story end-to-end (tests + impls + wire-up). Serialise only the wire-up step (single-file write).

---

## Notes

- Commit after every TDD pair (test + its impl) or after a logical group of `[P]` tasks.
- Run `npx vitest run` before moving to the next task within a phase.
- Update spec.md or plan.md if requirements change mid-implementation — do NOT silently drift.
- Mark tasks complete as you go: change `[ ]` → `[x]`.
- The Login page's 31 existing tests must remain green throughout — especially after Phase 2's header/footer refactor (guarded by the new backcompat test T032).
- `console.warn` stubs in `<WidgetButton>` + `<NotificationButton>` badge-fetch error path are intentional and MUST remain until the real implementations ship.
- All pull requests MUST pass the Constitution Compliance Check in plan.md before merge.
