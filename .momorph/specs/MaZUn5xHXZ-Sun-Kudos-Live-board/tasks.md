# Tasks: Sun* Kudos – Live Board

**Frame**: `MaZUn5xHXZ-Sun-Kudos-Live-board`
**Prerequisites**: plan.md ✅, spec.md ✅, design-style.md ✅
**Created**: 2026-04-27
**Generated from**: `/momorph.tasks` after plan.md approval

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path
```

- **[P]**: Can run in parallel with other `[P]` tasks in the same group (different files, no dependency on an incomplete task in this phase)
- **[Story]**: User story this belongs to (US1–US6 map to spec.md user stories). Setup / Foundation / Polish phases have no story label.
- **|**: Primary file this task creates or modifies

**TDD note (Constitution §III)**: For every hook and API route, the test MUST be authored and FAILING before the implementation is written. Test tasks and implementation tasks within a phase are both `[P]` because they target different files; the matching implementation MUST NOT start until its own test is red.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Package installs, asset downloads, CSS tokens, i18n keys, font wiring, QueryProvider. These unblock every subsequent phase.

> **⚠️ BLOCKING GATE — Phase 1 cannot start until the three new packages (`@tanstack/react-query`, `zod`, `@radix-ui/react-dialog`) are approved by the team and added to `constitution.md`.**

### Team approvals + packages

- [ ] T001 Obtain team sign-off on `@tanstack/react-query ^5`, `zod ^3`, `@radix-ui/react-dialog ^1`; update Technology Stack table | .momorph/constitution.md
- [ ] T002 Install runtime dependencies: `npm install @tanstack/react-query@^5 zod@^3 @radix-ui/react-dialog@^1` | package.json
- [ ] T003 Install dev dependency: `npm install -D @tanstack/react-query-devtools@^5` | package.json

### Asset preparation (parallel after T001)

- [ ] T004 [P] Obtain SVN-Gotham font file from brand/design team; commit `.woff2` to `public/fonts/svn-gotham/SVNGotham-Regular.woff2` | public/fonts/svn-gotham/
- [ ] T005 [P] Download hero/keyvisual background image(s) via Figma `get_media_files` → `public/images/kudos/hero-bg.jpg` | public/images/kudos/
- [ ] T006 [P] Download badge overlay images (Legend Hero, Super Hero, New Hero, Rising Hero) via Figma `get_media_files` → `public/images/kudos/badges/` | public/images/kudos/badges/
- [ ] T007 [P] Download KUDOS wordmark / brand lockup asset from Figma node → `public/images/kudos/kudos-wordmark.svg` | public/images/kudos/
- [ ] T008 [P] Verify all downloaded asset filenames follow kebab-case convention; rename where needed | public/images/kudos/

### CSS design tokens

- [ ] T009 Add kudos-scoped CSS variable block to globals.css under `/* ─── Kudos Live Board ─── */` comment (all tokens from plan.md §CSS Variable Extension Plan — colors, radii, spacing, borders, skeleton, z-index) | app/globals.css

### i18n keys

- [ ] T010 [P] Add `kudos.*` namespace with all localised strings (hero CTAs, section headings, empty states, error copy, spotlight activity copy, filter labels, stats labels, button labels) to Vietnamese message file | messages/vi.json
- [ ] T011 [P] Add matching `kudos.*` namespace to English message file; mark every value `[TODO: EN translation]` | messages/en.json

### Font wiring

- [ ] T012 Wire SVN-Gotham via `next/font/local` in root layout, expose as `--font-svn-gotham`; keep existing Montserrat + DSEG7 registrations intact | app/layout.tsx

### QueryProvider

- [ ] T013 Wrap `app/layout.tsx` body children with `<QueryClientProvider>` using a `'use client'` provider component at `components/providers/query-provider.tsx`; add `<ReactQueryDevtools>` gated on `NODE_ENV !== 'production'` | app/layout.tsx + components/providers/query-provider.tsx

**Checkpoint**: Packages installed, tokens declared, i18n keys present, QueryProvider active. Phase 2 can begin.

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Domain types, Zod schemas, Supabase migrations, shared lib utilities, icon components, skeleton / shared components. No user-story work may begin until this phase is complete.

### Domain types

- [ ] T014 Create domain types: `Kudos`, `KudosHighlight`, `Heart`, `Hashtag`, `Department`, `SecretBox`, `TickerEvent`, `KudosStats`, `LeaderboardEntry`, `KudosFilters`, `KudosQueryKey` | types/kudos.ts

### Zod schemas + tests

- [ ] T015 [P] Write failing tests for all Zod schemas (API request/response shapes; invalid inputs must throw) | tests/unit/kudos/schemas.test.ts
- [ ] T016 Create Zod schemas for every API route: `KudosFeedQuerySchema`, `KudosLikeBodySchema`, `KudosTotalResponseSchema`, `SunnerSearchQuerySchema`, `FiltersQuerySchema`, etc. | lib/kudos/schemas.ts

### Shared lib utilities

- [ ] T017 [P] Create constants: `PAGE_SIZE = 20`, `STALE_TIME_FEED`, `STALE_TIME_HIGHLIGHTS`, `STALE_TIME_STATS`, `DEBOUNCE_MS = 300`, `CAROUSEL_INTERVAL_MS = 5000`, `REALTIME_CHANNEL = 'kudos-live'` | lib/kudos/constants.ts
- [ ] T018 [P] Create Supabase query-builder functions: `fetchKudosFeed`, `fetchHighlights`, `fetchKudosTotal`, `fetchUserStats`, `fetchTopSunners`, `toggleHeart`, `fetchHashtags`, `fetchDepartments`, `fetchNextSecretBox` | lib/kudos/queries.ts
- [ ] T019 [P] Create Supabase Realtime channel helpers: `createKudosChannel`, `subscribeKudosChannel`, `unsubscribeKudosChannel`; export typed event payload interfaces | lib/kudos/realtime.ts

### Supabase migrations (write → apply → verify RLS)

- [ ] T020 [P] Write migration: `kudos` table (id, sender_id, receiver_id, content, image_urls, created_at, updated_at) | supabase/migrations/YYYYMMDD_01_create_kudos.sql
- [ ] T021 [P] Write migration: `hearts` table (id, kudos_id, user_id, weight, created_at); unique constraint (kudos_id, user_id) | supabase/migrations/YYYYMMDD_02_create_hearts.sql
- [ ] T022 [P] Write migration: `hashtags` + `kudos_hashtags` join table | supabase/migrations/YYYYMMDD_03_create_hashtags.sql
- [ ] T023 [P] Write migration: `departments` table | supabase/migrations/YYYYMMDD_04_create_departments.sql
- [ ] T024 [P] Write migration: `secret_boxes` table (id, owner_id, opened, opened_at); `special_days` config table (date, heart_weight) | supabase/migrations/YYYYMMDD_05_create_secret_boxes.sql
- [ ] T025a Write migration: cross-table VIEWs (`kudos_with_stats`, `kudos_highlights`, `user_kudos_stats`) — must run AFTER all CREATE TABLE migrations because views reference hearts/hashtags/profiles/kudos_highlight_flags/secret_boxes | supabase/migrations/YYYYMMDD_06_create_views.sql
- [ ] T025b Write migration: RLS policies for all tables (public read on kudos/hearts/hashtags/departments; owner-only write on hearts/secret_boxes; service-role for special_days) | supabase/migrations/YYYYMMDD_07_rls_policies.sql
- [ ] T026 Apply all 7 migrations to local Supabase instance (`supabase db reset`) or remote (`supabase db push`); verify RLS enforcement with a non-owner test user | supabase/migrations/

> **Why a separate views migration?** Views must be created *after* every table they reference. Earlier drafts inlined `CREATE VIEW` next to the first `CREATE TABLE` (e.g. `kudos_with_stats` lived inside `01_create_kudos.sql` but referenced `hearts`/`hashtags`/`profiles` defined in 02–04). That ordering breaks both `db reset` and `db push` with `relation "..." does not exist`. Splitting all views into a dedicated `_06_create_views.sql` is the standard Supabase pattern and keeps each table-creation migration self-contained.

### Icon components (parallel-safe, all pure SVG)

- [ ] T027 [P] Create `<HeartIcon>` (24×24, stroke `currentColor`, filled variant when active) | components/icons/heart-icon.tsx
- [ ] T028 [P] Create `<CopyLinkIcon>` (24×24, stroke `currentColor`) | components/icons/copy-link-icon.tsx
- [ ] T029 [P] Create `<OpenGiftIcon>` (24×24, fill gold `#FFEA9E`) | components/icons/open-gift-icon.tsx
- [ ] T030 [P] Create `<PanZoomIcon>` (24×24, stroke `currentColor`) | components/icons/pan-zoom-icon.tsx
- [ ] T031 [P] Create `<ArrowSentIcon>` (24×24, directional arrow for sender→receiver, stroke `currentColor`) | components/icons/arrow-sent-icon.tsx

### Shared atom components

- [ ] T032 [P] Implement `<UserInfoBlock>` RSC — avatar (ring `--border-kudos-avatar`), name (`font-bold text-[#FFEA9E]`), department label, `<StarTierBadge>` — reused in cards, leaderboard, **B.7.4** lines | components/kudos/shared/UserInfoBlock.tsx
- [ ] T033 [P] Implement `<StarTierBadge>` RSC — star icon(s) with tier-keyed tooltip (1★ → "đã nhận được 10 Kudos…", 2★ → "20 Kudos…", 3★ → "50 Kudos…"); `aria-label` includes tier copy | components/kudos/shared/StarTierBadge.tsx
- [ ] T034 [P] Implement `<AvatarHoverPreview>` Client Component — wraps avatar+name, shows `Hover Avatar info user` overlay card after 300ms `mouseenter`; dismisses on `mouseleave`; click routes to `/profile/:userId` | components/kudos/shared/AvatarHoverPreview.tsx
- [ ] T035 [P] Implement `<KudosSkeleton>` — shimmer skeleton variants for: feed card, highlight card, stats row, leaderboard row, carousel block; uses `--color-kudos-skeleton` / `--color-kudos-skeleton-shimmer` CSS vars | components/kudos/shared/KudosSkeleton.tsx

**Checkpoint**: Foundation ready. All subsequent user-story phases can now begin once their specific Phase 2 prerequisites are confirmed green.

---

## Phase 3: User Story 2 — Compose CTA & Route Shell (Priority: P1) 🎯 Entry Gate

**Goal**: Authenticated users can reach the `/kudos` page and click `Ghi nhận` to navigate to the Kudos compose flow. The four-region layout shell is visible with `<KudosSkeleton>` in each region before data loads.

**Independent Test**: Navigate to `/kudos` as an authenticated user; verify the page renders with Header + Hero banner + four skeleton placeholders + Footer within 1s. Click `A.1 Ghi nhận` → assert URL changes to `/kudos/new`. Unauthenticated visit → redirect to `/`.

### Route files

- [ ] T036 [US2] Implement `/kudos` RSC page — `createServerClient` session check → redirect to `/` if null; pass `currentUser` to `<KudosLiveBoard>`; export `metadata` | app/kudos/page.tsx
- [ ] T037 [P] [US2] Implement layout — sets Suspense boundaries; QueryProvider already at root; no additional provider | app/kudos/layout.tsx
- [ ] T038 [P] [US2] Implement loading skeleton page — 4-region skeleton placeholders using `<KudosSkeleton>` | app/kudos/loading.tsx
- [ ] T039 [P] [US2] Implement route error boundary Client Component — "Something went wrong" + `reset()` button | app/kudos/error.tsx

### Hero components

- [ ] T040 [US2] Implement `<KudosBoardHero>` RSC — KUDOS wordmark (SVG asset), subtitle from `t('kudos.hero.subtitle')`, `<KudosComposeTrigger>`, `<SunnerSearchTrigger>` — full-bleed hero with gradient overlays per design-style.md §A | components/kudos/hero/KudosBoardHero.tsx
- [ ] T041 [P] [US2] Implement `<KudosComposeTrigger>` Client Component — `A.1` pill ("Ghi nhận"), `onClick → router.push('/kudos/new')`; disabled state if `/kudos/new` route is not yet available (flag with `TODO(nav)`) | components/kudos/hero/KudosComposeTrigger.tsx
- [ ] T042 [P] [US2] Implement `<SunnerSearchTrigger>` Client Component — hero search pill ("Tìm kiếm sunner"), `onClick` → opens `SearchSunner` overlay (stub `console.warn` + `router.push('/kudos/search')` until that route ships) | components/kudos/hero/SunnerSearchTrigger.tsx

### Board root orchestrator

- [ ] T043 [US2] Implement `<KudosLiveBoard>` Client Component — four-region layout wrapper (`Hero + HighlightSection + AllFeed + RightPanel`); mounts client islands; accepts `currentUser` prop from RSC page | components/kudos/KudosLiveBoard.tsx
- [ ] T044 [US2] Wire `<Header>` (`navSlot`, `rightSlot` with `<HeaderControls>`) and `<Footer>` into `/kudos` page; reuse existing components | app/kudos/page.tsx

**Checkpoint**: `/kudos` renders, auth guard works, Hero section visible with "Ghi nhận" pill navigating correctly.

---

## Phase 4: User Story 1 — All Kudos Feed + Hearts + Copy Link (Priority: P1) 🎯 MVP

**Goal**: Users see the paginated public Kudos feed, can heart any post (optimistic), copy a post link (with toast), click a post to open detail, and see **B.7.4** recent-activity lines on the Spotlight board. Images in posts open in a fullscreen lightbox.

**Independent Test**: Seed ≥ 10 Kudos; visit `/kudos`; verify feed shows cards in reverse-chronological order. Click heart on a non-own post → count increments optimistically. Click "Copy link" → toast appears. Click "Xem thêm" → more cards append. Click any image thumbnail → lightbox opens.

### API routes — write integration tests first

- [ ] T045 [P] [US1] Write failing integration test: `GET /api/kudos` returns paginated list; `?page=2` returns next page; `?hashtag=X` filters correctly; unauthenticated returns 401 | tests/integration/kudos/api-kudos-feed.test.ts
- [ ] T046 [P] [US1] Implement `GET /api/kudos` route — Zod validate `KudosFeedQuerySchema`; `createServerClient`; return `{ data: Kudos[], nextPage, total }` | app/api/kudos/route.ts
- [ ] T047 [P] [US1] Implement `GET /api/kudos/:id` route — single kudo by id; 404 on missing | app/api/kudos/[id]/route.ts
- [ ] T048 [P] [US1] Write failing integration test: `POST /api/kudos/:id/likes` creates heart; `DELETE` removes it; own-post POST returns 403; duplicate POST returns 409 | tests/integration/kudos/api-kudos-likes.test.ts
- [ ] T049 [P] [US1] Implement `POST /DELETE /api/kudos/:id/likes` route — Zod validate; `createServerClient`; read `special_days` config for weight; return `{ weight, totalHearts }` | app/api/kudos/[id]/likes/route.ts

### Hooks — write unit tests first

- [ ] T050 [P] [US1] Write failing unit tests for `use-kudos-feed`: initial fetch, load-more page cursor, TQ cache, filter param pass-through, Realtime invalidation trigger | tests/unit/kudos/use-kudos-feed.test.ts
- [ ] T051 [P] [US1] Implement `use-kudos-feed` — TanStack Query with `queryKey: ['kudos-feed', filters, page]`; `useInfiniteQuery`-style with manual `page` cursor; exposes `loadMore`, `hasMore`, `isLoadingMore` | hooks/kudos/use-kudos-feed.ts
- [ ] T052 [P] [US1] Write failing unit tests for `use-heart`: optimistic update (gray→red), rollback on 4xx, `sender === currentUser` disabled guard, special-day weight subtraction | tests/unit/kudos/use-heart.test.ts
- [ ] T053 [P] [US1] Implement `use-heart` — `useMutation` with optimistic `setQueryData`; rollback via `onError context`; reads weight from API response to correctly subtract on un-heart | hooks/kudos/use-heart.ts
- [ ] T054 [P] [US1] Write failing unit tests for `use-copy-link`: success sets `copied=true` for 2s then resets; clipboard API unavailable → toast error | tests/unit/kudos/use-copy-link.test.ts
- [ ] T055 [P] [US1] Implement `use-copy-link` — `navigator.clipboard.writeText(url)`; 2s auto-reset; exposes `copy(url)`, `copied: boolean` | hooks/kudos/use-copy-link.ts

### Components — feed section

- [ ] T056 [US1] Implement `<KudosAllFeed>` Client Component — TanStack Query feed subscription; Realtime channel mount/unmount lifecycle; `<KudosPostCard>` list render; `<LoadMoreButton>`; reconnect banner; empty state `Hiện tại chưa có Kudos nào.`; WS disconnect inline banner | components/kudos/feed/KudosAllFeed.tsx
- [ ] T057 [P] [US1] Implement `<KudosPostCard>` RSC (rendered inside client feed via children pattern) — wrapper `bg-[var(--color-kudos-cream)]` `rounded-[var(--radius-kudos-card)]` `p-[var(--spacing-kudos-card-pad)]`; composes `<KudosPostHeader>`, `<KudosPostContent>`, `<KudosPostActions>`; `fade-in translate-y` entry animation on new WS post | components/kudos/feed/KudosPostCard.tsx
- [ ] T058 [P] [US1] Implement `<KudosPostHeader>` RSC — `<AvatarHoverPreview>` for sender → `<ArrowSentIcon>` → `<AvatarHoverPreview>` for receiver; timestamp (`--color-kudos-text-timestamp`) | components/kudos/feed/KudosPostHeader.tsx
- [ ] T059 [P] [US1] Implement `<KudosPostContent>` RSC — content text (5-line clamp + `…`, click → detail); image thumbnails row (max 5, click → `<ImageLightbox>`); hashtag chip row (max 5 chips; `…` when more) | components/kudos/feed/KudosPostContent.tsx
- [x] T060 [P] [US1] Implement `<KudosPostActions>` RSC wrapper — contains `<HeartButton>` + count + `<CopyLinkButton>` | components/kudos/feed/KudosPostActions.tsx
- [x] T061 [P] [US1] Implement `<HeartButton>` Client Component — gray (`#999999`) ↔ red (`#D4271D`) toggle; disabled when `sender === currentUser` (opacity 0.40, `cursor: not-allowed`); calls `use-heart`; `aria-label` announces current count and state | components/kudos/feed/HeartButton.tsx
- [x] T062 [P] [US1] Implement `<CopyLinkButton>` Client Component — clipboard icon; on click calls `use-copy-link`; brief "Copied!" tooltip via `copied` boolean; `aria-live="polite"` for toast | components/kudos/feed/CopyLinkButton.tsx
- [x] T063 [P] [US1] Implement `<HashtagChip>` — pill with `#tag` text; `onClick` calls `useKudosFilters().setHashtag(tag)` (no-op stub until US3 ships); `border-radius: var(--radius-kudos-pill-md)` | components/kudos/feed/HashtagChip.tsx
- [x] T064 [P] [US1] Implement `<LoadMoreButton>` — idle / loading-spinner / error-retry / hidden-when-exhausted states; disabled and shows spinner while fetching; shows "Thử lại" label on error; hidden (`display:none`) when `hasMore === false` | components/kudos/feed/LoadMoreButton.tsx
- [x] T065 [P] [US1] Implement `<ImageLightbox>` Client Component (Radix Dialog) — fullscreen overlay; `Esc` + click-outside closes; `←` / `→` keyboard cycling across all images in the post; counter badge `N / Total`; `aria-modal="true"`; `z-index: var(--z-kudos-lightbox)` | components/kudos/feed/ImageLightbox.tsx

### Real-time subscription hook

- [x] T066 [US1] Implement `use-realtime-kudos` — `useEffect` subscribes to Supabase Realtime channel `kudos-live`; handles `kudos.new` (prepend card, invalidate total), `kudos.liked` (patch heart count in TQ cache), `secretBox.opened` (invalidate stats); unsubscribes on unmount; exposes `isConnected` for reconnect banner; deduplicates events within 1s window | hooks/kudos/use-realtime-kudos.ts

### ~~Live ticker~~ → B.7.4 only (supersedes right-panel ticker)

- [x] T067 [US1] **Superseded (2026-04-29)** — `Thông báo content` / "Hoạt động mới nhất" is implemented as **`SpotlightActivityFeed`** (**B.7.4**), not `<KudosLiveTicker>` under D.3. WS hook-up for B.7.4 remains optional follow-up to `use-realtime-kudos`.

### Wire unread-count

- [x] T068 [US1] Replace stub `GET /api/notifications/unread-count` with real Supabase query (count unseen notifications for `currentUser`); reuse `createServerClient` pattern | app/api/notifications/unread-count/route.ts

**Checkpoint**: All Kudos feed, hearts, copy-link, load-more, lightbox, and **B.7.4** activity rail functional and independently testable.

---

## Phase 5: User Story 6 — Real-time Reconciliation (Priority: P2)

**Goal**: Heart counts and feed updates reflect other users' actions within 1.5s via Supabase Realtime. WS disconnects show a banner; reconnect auto-dismisses. Duplicate events within 1s are deduplicated.

**Independent Test**: Open two sessions A and B. In session A: like a post → verify session B heart count increments within 1.5s. Publish a new Kudo in A → verify B's **feed** updates and **B.7.4** reflects the event after poll/invalidation. Simulate WS disconnect (disable network) → verify banner; reconnect → banner dismisses.

- [x] T069 [US6] Extend `use-realtime-kudos` with reconnect detection — on Supabase channel `CHANNEL_ERROR` / `TIMED_OUT` set `isConnected = false`; on `SUBSCRIBED` set `isConnected = true`; `<KudosAllFeed>` reads `isConnected` to show/hide the inline reconnect banner | hooks/kudos/use-realtime-kudos.ts
- [x] T070 [P] [US6] Implement reconnect inline banner component — `"Đang kết nối lại…"` message with animated spinner; auto-dismisses when `isConnected` flips back to `true`; `aria-live="assertive"` for screen-reader announcement | components/kudos/feed/ReconnectBanner.tsx
- [x] T071 [P] [US6] Extend `use-heart` rollback path — on `kudos.liked` Realtime event, reconcile optimistic cache patch with authoritative value from WS payload; no double-counting if local mutation + remote event arrive for the same action | hooks/kudos/use-heart.ts
- [x] T072 [P] [US6] Write Vitest integration test for Realtime reconciliation — dual-client scenario using Supabase test helpers; assert heart count convergence and event deduplication | tests/integration/kudos/realtime-reconciliation.test.ts

**Checkpoint**: Real-time updates, reconnect UX, and deduplication verified.

---

## Phase 6: User Story 3 — Hashtag & Department Filters (Priority: P2)

**Goal**: Selecting a hashtag or department in the `B.1` filter dropdowns scopes both the Highlight carousel and the All Kudos feed simultaneously; the selection persists in the URL (`?hashtag=X` / `?dept=Y`) and resets pagination to page 1.

**Independent Test**: Seed ≥ 2 hashtags + ≥ 2 departments; open `B.1.1` dropdown → select a hashtag; verify both `B_Highlight` and `C_All kudos` re-fetch with the filter; verify URL updates; select "All hashtags" → both revert; apply both hashtag + dept simultaneously → both preserved in URL.

### API routes

- [x] T073 [P] [US3] Implement `GET /api/hashtags` route — returns trending hashtags sorted by usage count; Zod validate; auth required | app/api/hashtags/route.ts
- [x] T074 [P] [US3] Implement `GET /api/departments` route — returns all active departments; Zod validate; auth required | app/api/departments/route.ts

### Hook — write unit tests first

- [x] T075 [P] [US3] Write failing unit tests for `use-kudos-filters`: initial state from URL params; `setHashtag` updates URL + resets page; `setDept` updates URL + resets page; `clearAll` removes both params; simultaneous hashtag + dept preserved | tests/unit/kudos/use-kudos-filters.test.ts
- [x] T076 [US3] Implement `use-kudos-filters` — wraps `useSearchParams` + `useRouter`; exposes `hashtag`, `dept`, `setHashtag(id)`, `setDept(id)`, `clearAll()`; calling any setter resets the TQ `kudos-feed` query to page 1 via `queryClient.resetQueries` | hooks/kudos/use-kudos-filters.ts

### Components

- [x] T077 [US3] Implement `<KudosFilters>` Client Component — `B.1.1` hashtag dropdown (fetches `/api/hashtags` via TQ) + `B.1.2` department dropdown (fetches `/api/departments`); active-filter chip state `border-radius: var(--radius-kudos-pill-md)`; calls `use-kudos-filters` setters; "All" option clears filter | components/kudos/highlight/KudosFilters.tsx
- [x] T078 [US3] Wire `use-kudos-filters` into `<KudosHighlightSection>` and `<KudosAllFeed>` — both read `{ hashtag, dept }` from the hook as TQ query-key parts so they re-fetch when filters change; pagination reset on filter change also collapses the load-more list | components/kudos/highlight/KudosHighlightSection.tsx + components/kudos/feed/KudosAllFeed.tsx

**Checkpoint**: Filter cascade works; URL persists filters; pagination resets; empty state shown when 0 results.

---

## Phase 7: User Story 4 — Personal Stats & Secret Box (Priority: P2)

**Goal**: The right panel (`D_Thống menu phải`) displays the user's received/sent Kudos, hearts, opened/unopened secret boxes. The `Mở quà` CTA is enabled when `secretBoxClosed > 0` and navigates to the secret-box flow. Stats update without page reload when a box is opened.

**Independent Test**: Seed user with `kudosReceived=25, kudosSent=25, hearts=1000, secretBoxOpened=25, secretBoxClosed=25`; verify all 5 values render exactly. Click `D.1.8` → verify navigation to secret-box route. Seed user with `secretBoxClosed=0` → verify button is disabled (opacity 0.40).

### API routes

- [x] T079 [P] [US4] Implement `GET /api/users/me/stats` route — returns `{ kudosReceived, kudosSent, hearts, secretBoxOpened, secretBoxClosed }` for `currentUser`; Zod validate; auth required | app/api/users/me/stats/route.ts
- [x] T080 [P] [US4] Implement `GET /api/sunners/top` route — returns top 10 sunners by `gift` metric (received kudos count or admin-configured); accepts `?limit` and `?metric` query params; Zod validate; auth required | app/api/sunners/top/route.ts
- [x] T081 [P] [US4] Implement `GET /api/me/secret-boxes/next` route — returns the next unopened secret box for `currentUser` or `{ box: null }` if none; auth required | app/api/me/secret-boxes/next/route.ts

### Hook

- [x] T082 [P] [US4] Write failing unit tests for `use-kudos-stats`: cache hit returns stale data until invalidated; `secretBox.opened` Realtime event triggers refetch | tests/unit/kudos/use-kudos-stats.test.ts
- [x] T083 [P] [US4] Implement `use-kudos-stats` — TQ `queryKey: ['kudos-stats', userId]`; `staleTime: 2 * 60_000`; invalidated by `secretBox.opened` event from `use-realtime-kudos` | hooks/kudos/use-kudos-stats.ts

### Components

- [x] T084 [US4] Implement `<KudosRightPanel>` Client Component — orchestrates `<KudosStatsCard>`, `<KudosLeaderboard>` (no duplicate ticker under D.3 — activity is **B.7.4**); right-column layout; responsive: collapses to accordion at `< 768px` | components/kudos/panel/KudosRightPanel.tsx
- [x] T085 [P] [US4] Implement `<KudosStatsCard>` RSC — `D.1` panel with `--border-kudos-panel` border; 5 stat rows (received, sent, hearts, opened boxes, closed boxes) from `use-kudos-stats`; `<OpenGiftButton>` at `D.1.8` | components/kudos/panel/KudosStatsCard.tsx
- [x] T086 [P] [US4] Implement `<OpenGiftButton>` Client Component — `D.1.8 Button mở quà`; enabled state: `bg-[var(--color-cta-bg)]` solid gold; disabled state: opacity 0.40 `cursor: not-allowed` when `secretBoxClosed === 0`; `onClick → router.push('/kudos/open-box')` | components/kudos/panel/OpenGiftButton.tsx
- [x] T087 [P] [US4] Implement `<KudosLeaderboard>` Client Component — `D.3` top sunners list (TQ fetch `/api/sunners/top`); renders `<LeaderboardRow>` ×N; empty state "Chưa có dữ liệu" when 0 rows; click row → `router.push('/profile/:userId')` | components/kudos/panel/KudosLeaderboard.tsx
- [x] T088 [P] [US4] Implement `<LeaderboardRow>` RSC — rank number + `<UserInfoBlock>` + received-kudos count; hover state `bg-[var(--color-kudos-gold-hover)]` | components/kudos/panel/LeaderboardRow.tsx

**Checkpoint**: Right panel fully functional; stats render correctly; `Mở quà` gated correctly on box count.

---

## Phase 8: User Story 1 — Highlight Carousel (Priority: P1, second wave)

**Goal**: The `B_Highlight` section shows featured Kudos in a carousel (auto-advances every 5s, pauses on hover/focus-within, keyboard ← / →, disable arrows at edges) and the "388 KUDOS" total counter updates via Realtime.

**Independent Test**: Seed ≥ 5 highlights; verify carousel renders, auto-advances, arrow navigation, edge disabling, slide-bar pagination, "388 KUDOS" counter. Apply a hashtag filter → carousel re-fetches; 0 highlights → entire B block hidden.

### API routes — integration tests first

- [x] T089 [P] [US1] Write failing integration test: `GET /api/kudos/highlights` returns highlight array; filtered by hashtag when `?hashtag=X`; empty array hides block | tests/integration/kudos/api-kudos-highlights.test.ts
- [x] T090 [P] [US1] Implement `GET /api/kudos/highlights` route — returns curated highlights array; accepts `?hashtag`, `?dept` filters; Zod validate; auth required | app/api/kudos/highlights/route.ts
- [x] T091 [P] [US1] Implement `GET /api/kudos/stats/total` route — returns `{ total: number }` global kudos count; auth required | app/api/kudos/stats/total/route.ts

### Hooks

- [x] T092 [P] [US1] Implement `use-kudos-highlights` — TQ `queryKey: ['kudos-highlights', filters]`; `staleTime: 5 * 60_000`; filtered by active `use-kudos-filters` state | hooks/kudos/use-kudos-highlights.ts
- [x] T093 [P] [US1] Implement `use-kudos-total` — TQ `queryKey: ['kudos-total']`; invalidated on `kudos.new` Realtime event | hooks/kudos/use-kudos-total.ts

### Components

- [x] T094 [US1] Implement `<KudosHighlightSection>` Client Component — wraps `<KudosFilters>` + "N KUDOS" counter (from `use-kudos-total`) + `<KudosHighlightCarousel>` + `<SpotlightBoard>`; hidden when highlights array is empty | components/kudos/highlight/KudosHighlightSection.tsx
- [x] T095 [P] [US1] Implement `<KudosHighlightCarousel>` Client Component — `useState(slideIndex)`; auto-advance `setInterval(CAROUSEL_INTERVAL_MS)` cleared on hover/focus-within; keyboard `←` / `→`; renders current `<KudosHighlightCard>` | components/kudos/highlight/KudosHighlightCarousel.tsx
- [x] T096 [P] [US1] Implement `<KudosHighlightCard>` RSC — `B.3` card: `4px solid #FFEA9E` border (`--border-kudos-highlight`); sender + receiver info; content (3-line clamp); hashtags (max 5 red chips); "Xem chi tiết" link → `/kudos/:id`; `border-radius: var(--radius-kudos-highlight)` | components/kudos/highlight/KudosHighlightCard.tsx
- [x] T097 [P] [US1] Implement `<KudosSlideBar>` — `B.5` `< N/Total >` pagination row; prev button disabled at slide 0; next button disabled at last slide; `aria-label` includes slide position | components/kudos/highlight/KudosSlideBar.tsx

**Checkpoint**: Highlight carousel fully functional with filter awareness, auto-advance, keyboard nav, and live counter.

---

## Phase 9: User Story 5 — Spotlight Word Cloud (Priority: P3)

**Goal**: `B.7 Spotlight Board` renders a D3 force-simulation word cloud of sunner nodes; hover shows tooltip (name + time); click opens Kudos detail; pan/zoom toggle; `B.7.3` search input scoped to the cloud.

**Independent Test**: Load board with ≥ 50 Kudos; verify nodes render; hover node → tooltip within 150ms; click node → navigate to detail; toggle Pan/Zoom → drag behavior changes; type in B.7.3 → nodes filter; 0 Kudos → empty state.

> **⚠️ D3 dependency gate**: Before implementing `<SpotlightBoard>`, confirm whether `d3` is already installed or requires a separate approval PR. If D3 is not approved, replace with a simpler static grid layout for MVP and flag with `TODO(d3-upgrade)`.

### Hook

- [x] T098 [P] [US5] Write failing unit tests for `use-sunner-search`: debounce fires after 300ms; empty input clears results; 100-char max enforced; TQ cancels in-flight requests on new input | tests/unit/kudos/use-sunner-search.test.ts
- [x] T099 [P] [US5] Implement `use-sunner-search` — debounced `useQuery` against `GET /api/sunners?q=`; `DEBOUNCE_MS = 300`; max 100 chars enforced before API call | hooks/kudos/use-sunner-search.ts
- [x] T100 [P] [US5] Implement `GET /api/sunners` search route — accepts `?q=` param (max 100 chars, Zod validated); returns matching sunners by name | app/api/sunners/route.ts

### Components

- [x] T101 [P] [US5] Implement `<SpotlightSearch>` Client Component — `B.7.3` text input; `maxLength={100}`; `onChange` triggers `use-sunner-search`; focus ring; `aria-label` | components/kudos/spotlight/SpotlightSearch.tsx
- [x] T102 [US5] Implement `<SpotlightBoard>` Client Component — D3 `forceSimulation` with sunner nodes (radius proportional to Kudos count); hover tooltip (name + time, visible after 150ms); click → `router.push('/kudos/:id')`; Pan/Zoom toggle (`d3-zoom`); empty state when 0 nodes; lazy-load D3 via dynamic import to avoid SSR errors | components/kudos/spotlight/SpotlightBoard.tsx

**Checkpoint**: Spotlight cloud renders, interactive, search-filterable, and pan/zoom-able.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Loading skeletons per region, empty states, error boundaries, responsive testing, accessibility audit, tests, performance.

### Skeleton completeness

- [x] T103 [P] Extend `<KudosSkeleton>` to cover all region variants: feed card stack, highlight carousel block, right-panel stats card, leaderboard rows, hero shimmer | components/kudos/shared/KudosSkeleton.tsx

### Error boundaries (section-scoped)

- [x] T104 [P] Add Suspense + error boundary to each of the four regions in `<KudosLiveBoard>` — one region failing MUST NOT crash the others; each shows a "Không thể tải dữ liệu" retry card | components/kudos/KudosLiveBoard.tsx

### Responsive layout

- [x] T105 [P] Audit and fix tablet (768–1279px) layout — single-column hero, 2-col main content, right-panel accordion; spot test at 768, 1024, 1279px viewports | components/kudos/KudosLiveBoard.tsx
- [x] T106 [P] Audit and fix mobile (< 768px) layout — full-width cards, hidden right panel (drawer/accordion), carousel swipe gesture | components/kudos/KudosLiveBoard.tsx

### Accessibility audit

- [x] T107 [P] Run `@axe-core/playwright` on `/kudos` at 375/768/1280/1512 viewports; resolve all `serious` and `critical` violations before merge | tests/e2e/kudos/a11y.spec.ts
- [x] T108 [P] Verify focus order: Header → Hero CTAs → Filter dropdowns → Highlight carousel (keyboard arrows) → Feed cards (hearts, copy, detail links) → Load More → Right panel stats → Footer | manual QA + axe-core
- [x] T109 [P] Verify `aria-live` regions: **B.7.4** / toast (`polite`) when applicable, copy-link toast (`polite`), reconnect banner (`assertive`), heart count change (`polite`) | components/kudos/

### Unit tests sweep

- [x] T110 [P] Integration tests: `GET /api/kudos` paginated feed + filter (T045) — mark passing after T046 impl | tests/integration/kudos/api-kudos-feed.test.ts
- [x] T111 [P] Integration tests: `POST/DELETE /api/kudos/:id/likes` (T048) — mark passing after T049 impl; assert DB `weight` value | tests/integration/kudos/api-kudos-likes.test.ts
- [x] T112 [P] Integration tests: `GET /api/kudos/highlights` (T089) — mark passing after T090 impl | tests/integration/kudos/api-kudos-highlights.test.ts
- [x] T112a Constitution §III remediation — replace mocked Supabase chains in T110/T111/T112 with real-DB integration tests against `supabase start`. Adds `tests/helpers/supabase.ts` (admin client, `userClient`, `ensureUser`, `ensureDepartment`, `insertKudos`, `resetKudosTables`), `.env.test` (well-known local-stack credentials), `vitest.config.ts` env-loading + `environmentMatchGlobs: tests/integration/** → node`, and `package.json` script split (`test` excludes integration; `test:integration` runs them). Tests now exercise the actual queries/views/RLS instead of mock chains. | tests/helpers/, tests/integration/kudos/, vitest.config.ts, .env.test

### E2E tests

- [x] T113 [P] Write and execute Playwright E2E — happy-path: auth login → `/kudos` loads all 4 regions; heart a post → count increments; copy link → toast visible; select hashtag filter → feed re-renders; click "Xem thêm" → cards append; click "Mở quà" when box available → navigates | tests/e2e/kudos/live-board.spec.ts
- [x] T114 [P] Write and execute Playwright E2E — error path: unauthenticated `/kudos` → redirect to `/`; 401 mid-session → redirect to `/`; heart own post disabled; box disabled when 0 closed | tests/e2e/kudos/live-board.spec.ts

### Performance + final CI

- [x] T115 Run Lighthouse CI on production build of `/kudos`; assert FCP ≤ 1500ms per TR-001, CLS < 0.1; zero hydration warnings | lighthouserc.js
- [x] T116 Final CI gate: `npm run lint` clean, `npx tsc --noEmit` zero errors, `npx vitest run` all green, `npx playwright test` all green, `npm run build` succeeds | CI pipeline
- [x] T117 Grep codebase for `TODO(nav)`, `TODO(d3-upgrade)`, `TODO(content)`, `TODO(approval)` stubs; either resolve or migrate to tracked GitHub issues with owners | repo-wide

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
  └─► Phase 2 (Foundation) ─┐
                             └─► Phase 3 (US2 Hero) ─► Phase 4 (US1 Feed) ─┬─► Phase 5 (US6 Realtime)
                                                                             ├─► Phase 6 (US3 Filters)
                                                                             ├─► Phase 7 (US4 Right Panel)
                                                                             └─► Phase 8 (US1 Highlights)
                                                                                       │
                                                                             Phase 9 (US5 Spotlight) ──┐
                                                                                                        └─► Phase 10 (Polish)
```

- **Phase 1 → Phase 2**: Strict. Packages + tokens must exist before any lib/component code.
- **Phase 2 → Phase 3**: Strict. Types, schemas, migrations, icons, shared atoms must exist before feature components.
- **Phase 3 → Phase 4**: Strict. Page shell and `<KudosLiveBoard>` orchestrator must exist before wiring feed.
- **Phase 4 → Phases 5–8**: Phases 5–8 can start in parallel once Phase 4 is complete (they share the TQ client and Realtime hook but write to different files).
- **Phase 9 (Spotlight)**: Can proceed independently after Phase 2 once the `/api/sunners` route is available. D3 approval is an additional gate.
- **Phase 10**: Depends on all phases the team decides are in-scope for this release.

### Within Each Phase (TDD order)

1. API integration test tasks marked `[P]` — all can be authored simultaneously.
2. Hook unit test tasks marked `[P]` — authored simultaneously with API tests.
3. API implementation tasks — each unblocked once its own test is red.
4. Hook implementation tasks — each unblocked once its own test is red.
5. Component tasks — unblocked once their hook/API dependencies are green.
6. Integration / wiring tasks — sequential within phase (shared file).

### Shared-File Sequencing (cannot be `[P]`)

- `app/kudos/page.tsx` — modified by T036, T044, T054 (three sequential writes)
- `app/layout.tsx` — modified by T012, T013 (sequential; T013 depends on T012)
- `app/globals.css` — T009 (one write, Phase 1 only)
- `hooks/kudos/use-realtime-kudos.ts` — T066 (initial), T069 (extend) — sequential
- `hooks/kudos/use-heart.ts` — T053 (initial), T071 (extend) — sequential

### Parallel Opportunities

| Phase | Parallelisable task groups |
|-------|---------------------------|
| Phase 1 | T004–T008 (asset downloads), T010–T011 (i18n) |
| Phase 2 | T015–T019 (schemas + constants + queries), T020–T025 (migrations), T027–T031 (icons), T032–T035 (shared atoms) |
| Phase 3 | T038–T039 (route files), T041–T042 (hero components) |
| Phase 4 | T045+T050+T052+T054 (all test files), T046+T048+T051+T053+T055 (all impls after tests red), T057–T065 (components) |
| Phase 5 | T070–T071 (banner + heart extend) |
| Phase 6 | T073–T074 (API routes), T075+T076 (hook test + impl) |
| Phase 7 | T079–T081 (API routes), T082–T083 (hook), T085–T088 (components) |
| Phase 8 | T089–T090 (API test + impl), T092–T093 (hooks), T095–T097 (components) |
| Phase 9 | T098–T100 (search hook + API), T101 (SpotlightSearch) |
| Phase 10 | T103–T116 (all polish tasks) |

---

## Implementation Strategy

### MVP (P1 stories only — recommended for first release)

1. **Phase 1 + Phase 2** — Setup + Foundation (single sprint, no visible output)
2. **Phase 3 (US2)** — Hero shell goes live; `/kudos` route accessible
3. **Phase 4 (US1) + Phase 5 (US6)** — Feed + Real-time; 🎯 **first deployable with real user value**
4. **STOP + VALIDATE**: run all tests + manual QA; Lighthouse baseline
5. **Phase 8 (US1 Highlights)** — Highlight carousel added to the live board

### MVP+1 (P2 stories)

6. **Phase 6 (US3)** — Filters shipped
7. **Phase 7 (US4)** — Right panel + secret-box CTA

### Nice-to-have (P3)

8. **Phase 9 (US5)** — Spotlight word cloud (only if D3 approved)

### Parallel staffing (once Phase 3 is merged)

Phases 4, 6, 7, and 8 can be staffed across 4 developers simultaneously. Each developer owns one phase end-to-end (API → hook → component → wire-up). Serialise only the shared-file wiring steps.

---

## Notes

- Commit after every TDD pair (test + impl) or after a logical group of `[P]` tasks in the same phase.
- Run `npx vitest run` + `npx tsc --noEmit` before advancing to the next task within a phase.
- `use-realtime-kudos` should be stubbed as a no-op (returns `isConnected: false`) during Phase 4 development so feed tests are deterministic; swap to real implementation in Phase 5.
- The `KudosPostCard` RSC-inside-client-feed pattern uses React 19's children prop: the RSC card is passed as `children` to the client `<KudosAllFeed>`, keeping card HTML out of the client bundle. This is the same pattern used by the Homepage award card.
- All `TODO(nav)` stubs (compose CTA, search overlay) MUST be resolved before production merge; track as GitHub issues if the target routes ship in a separate PR.
- The `--color-kudos-heart-active` CSS token is documentation-only; in code use `--color-status-unread` directly to avoid duplicate declarations.
- Special-day heart weight is always resolved on the API (`POST /api/kudos/:id/likes` reads the `special_days` table); the client simply sends a plain POST and uses `{ weight }` from the response to correctly reverse the action on un-heart.
