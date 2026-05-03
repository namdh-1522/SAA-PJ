# Implementation Plan: Sun* Kudos – Live Board

**Frame**: `MaZUn5xHXZ-Sun-Kudos-Live-board`
**Date**: 2026-04-27
**Spec**: [`spec.md`](./spec.md)
**Design Style**: [`design-style.md`](./design-style.md)

---

## Summary

Build the real-time Sun\* Kudos Live Board at route `/kudos` — a four-region dashboard (Hero, Highlight carousel, All Kudos feed, Right panel) with Supabase Realtime push updates, an optimistic heart system, hashtag/department filters synced to URL, and a "Xem thêm" load-more feed. The page is an **RSC shell** with targeted `'use client'` islands for interactive/real-time regions. All new API routes use `createServerClient`; RLS is enforced at the database layer. Three new production dependencies require team approval before development starts.

---

## Technical Context

| Area | Choice |
|------|--------|
| Language / Framework | TypeScript (strict) / Next.js 16 App Router |
| Styling | Tailwind CSS v4 + CSS variables (`globals.css`) |
| Database / BaaS | Supabase (Auth, PostgreSQL, Realtime) |
| Data Fetching | **TanStack Query** `@tanstack/react-query` (new — needs approval) |
| Real-time | Supabase Realtime channels (part of existing `@supabase/supabase-js`) |
| Validation | **Zod** (new — needs approval) |
| UI Primitives | **`@radix-ui/react-dialog`** for `<ImageLightbox />` (new — needs approval) |
| i18n | `next-intl@^4.9.1` (already installed) |
| Unit / Integration | Vitest + Supabase local instance |
| E2E | Playwright |
| Font Loading | `next/font/local` for SVN-Gotham + `next/font/google` for Montserrat |

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

| Requirement | Constitution Rule | Status |
|-------------|------------------|--------|
| TypeScript strict mode | §I | ✅ Enforced |
| RSC by default; `'use client'` only where required | §II | ✅ Planned — RSC shell, 8 targeted client islands |
| `createServerClient` for authenticated ops | §II | ✅ All API routes use server client |
| RLS on every Supabase table | §V | ✅ Migrations include RLS policies |
| Tailwind CSS v4 + CSS variables — no hard-coded values | §II | ✅ New kudos tokens added to `globals.css` |
| `@/*` path alias — no deep relative imports | §I | ✅ All imports use `@/` |
| `next/font` for all typefaces | §II | ✅ SVN-Gotham via `next/font/local` |
| Input validation at system boundaries | §V | ✅ Zod on all API route handlers |
| Supabase parameterised queries only | §V | ✅ No raw SQL string concatenation |
| TDD — tests authored before implementation | §III | ✅ Vitest specs written per phase |
| Navigation sourced from SCREENFLOW.md | §IV | ✅ 15 outgoing edges mapped |
| Touch targets ≥ 48 × 48 px | §IV | ✅ Specified in design-style.md |
| Secrets in env vars only | §V | ✅ Supabase URL/key already in `.env.local` |

**Violations requiring justification:**

| Package | Justification | Alternative Rejected |
|---------|--------------|---------------------|
| `@tanstack/react-query` | Server state caching + stale-while-revalidate for 8 API endpoints with per-user keying; SWR was considered but TQ has better devtools and `useInfiniteQuery` needed for pagination | SWR, `fetch` + `useState` |
| `zod` | Schema validation at API boundaries; constitution §V mandates input validation; no validation library exists in the project | `class-validator` (NestJS-specific, not idiomatic in App Router) |
| `@radix-ui/react-dialog` | Accessible focus-trap dialog for ImageLightbox with Esc/overlay-close; builds on WAI-ARIA spec | Custom modal (a11y complexity), `headlessui` (React 19 compatibility unclear) |

> All three packages must be added to the Technology Stack table in `constitution.md` and approved by a senior contributor before Phase 1 begins.

---

## Architecture Decisions

### Frontend

- **Component pattern**: Feature-based under `components/kudos/`. Atomic components (`HeartButton`, `HashtagChip`, `LoadMoreButton`) are reusable within the feature; organisms (`KudosPostCard`, `KudosHighlightCard`) are feature-scoped.
- **RSC / Client split**:

| Component | Boundary | Reason |
|-----------|----------|--------|
| `app/kudos/page.tsx` | RSC | Static shell, auth guard, metadata |
| `KudosBoardHero` | RSC | Static hero — no interaction |
| `KudosHighlightSection` | `'use client'` | Carousel state + auto-advance timer |
| `KudosFilters` | `'use client'` | Dropdown open/close + URL sync |
| `KudosAllFeed` | `'use client'` | TanStack Query + Realtime subscription |
| `KudosPostCard` | RSC (rendered inside feed) | Static card shell |
| `HeartButton` | `'use client'` | Optimistic mutation |
| `CopyLinkButton` | `'use client'` | Clipboard API |
| `KudosRightPanel` | `'use client'` | Stats live-update via Realtime |
| `SpotlightBoard` | `'use client'` | D3 canvas / force layout |
| `ImageLightbox` | `'use client'` | Radix Dialog |

- **State management**: TanStack Query for server state (8 query keys); URL search params (via Next.js `useSearchParams` / `useRouter`) for filter state; local `useState` for UI-only state (carousel index, toast, modal open).
- **Styling**: All values from CSS variables in `globals.css`. New kudos-scoped tokens added under `/* Kudos Live Board */` comment block. Tailwind utilities reference `var(--*)` through arbitrary-value syntax.

### Backend

- **API design**: Next.js Route Handlers (`app/api/kudos/…/route.ts`). All handlers use `createServerClient` + Supabase RPC / parameterised queries.
- **Real-time**: Supabase Realtime channel `kudos-live` — no additional WS library. Ticker events (`kudos.new`) come from the same channel that the feed subscribes to.
- **Validation**: Zod schemas in `lib/kudos/schemas.ts` — shared between API routes and hooks for type safety end-to-end.
- **Data access**: Direct Supabase query builder in `lib/kudos/queries.ts`. No ORM layer.

### Integration Points

| Point | Existing Code | Action |
|-------|--------------|--------|
| Auth guard | `lib/supabase/server.ts` + middleware | Reuse — redirect to `/` on `null` session |
| Header / Footer | `components/ui/header.tsx`, `footer.tsx` | Reuse as-is |
| Notification button | `components/ui/notification-button.tsx` | Reuse — wire to real unread count |
| Language selector | `components/ui/language-selector.tsx` | Reuse |
| Avatar menu | `components/ui/avatar-menu.tsx` | Reuse |
| Icons | `components/icons/*.tsx` | Reuse existing; add missing icons |
| i18n | `messages/vi.json`, `messages/en.json` | Extend with `kudos.*` namespace |
| `app/api/notifications/unread-count` | Stub returning `{ count: 0 }` | Wire to real Supabase query |
| TanStack Query | Not installed | Add `QueryProvider` wrapper in `app/layout.tsx` |
| CSS variables | `app/globals.css` (existing tokens overlap) | Extend with kudos-specific tokens; alias existing where values match |

---

## Project Structure

### Documentation

```
.momorph/specs/MaZUn5xHXZ-Sun-Kudos-Live-board/
├── spec.md              ✅ Done
├── design-style.md      ✅ Done
├── plan.md              ✅ This file
└── assets/frame.png     ✅ Done
```

### New Files

```
app/
└── kudos/
    ├── page.tsx                          # RSC shell — auth guard + metadata
    ├── layout.tsx                        # QueryProvider island wrapper
    ├── loading.tsx                       # Skeleton page shell
    └── error.tsx                         # Error boundary

app/api/
├── kudos/
│   ├── route.ts                          # GET /api/kudos  (paginated feed)
│   ├── highlights/
│   │   └── route.ts                      # GET /api/kudos/highlights
│   ├── stats/
│   │   └── total/
│   │       └── route.ts                  # GET /api/kudos/stats/total
│   └── [id]/
│       ├── route.ts                      # GET /api/kudos/:id
│       └── likes/
│           └── route.ts                  # POST/DELETE /api/kudos/:id/likes
├── sunners/
│   ├── route.ts                          # GET /api/sunners?q=  (search)
│   └── top/
│       └── route.ts                      # GET /api/sunners/top
├── hashtags/
│   └── route.ts                          # GET /api/hashtags?scope=trending
├── departments/
│   └── route.ts                          # GET /api/departments
├── users/
│   └── me/
│       └── stats/
│           └── route.ts                  # GET /api/users/me/stats
└── me/
    └── secret-boxes/
        └── next/
            └── route.ts                  # GET /api/me/secret-boxes/next

components/kudos/
├── KudosLiveBoard.tsx                    # Root layout orchestrator (client island mount)
├── hero/
│   ├── KudosBoardHero.tsx               # RSC hero banner
│   ├── KudosComposeTrigger.tsx          # A.1 "Ghi nhận" pill (client — navigation)
│   └── SunnerSearchTrigger.tsx          # Hero "Tìm kiếm sunner" pill
├── highlight/
│   ├── KudosHighlightSection.tsx        # B block wrapper (client)
│   ├── KudosFilters.tsx                 # B.1.1 / B.1.2 filter dropdowns
│   ├── KudosHighlightCarousel.tsx       # B.2 carousel with auto-advance
│   ├── KudosHighlightCard.tsx           # B.3 featured card
│   └── KudosSlideBar.tsx               # B.5 slide pagination
├── spotlight/
│   ├── SpotlightBoard.tsx              # B.7 D3 word-cloud (client, canvas)
│   ├── SpotlightActivityFeed.tsx      # B.7.4 latest-activity rail (Thông báo content pattern)
│   └── SpotlightSearch.tsx             # B.7.3 search input
├── feed/
│   ├── KudosAllFeed.tsx                # C block (client — TQ + Realtime)
│   ├── KudosPostCard.tsx               # C.3 single post card (RSC inside feed)
│   ├── KudosPostHeader.tsx             # Sender → Receiver row
│   ├── KudosPostContent.tsx            # Content + image gallery
│   ├── KudosPostActions.tsx            # C.4 heart + copy-link bar
│   ├── HeartButton.tsx                 # C.4.1 optimistic like toggle (client)
│   ├── CopyLinkButton.tsx              # C.4.2 clipboard (client)
│   ├── HashtagChip.tsx                 # Hashtag pill (shared)
│   ├── LoadMoreButton.tsx              # C.2 "Xem thêm" button
│   └── ImageLightbox.tsx              # C.3.6 fullscreen (Radix Dialog, client)
├── panel/
│   ├── KudosRightPanel.tsx             # D block orchestrator (client)
│   ├── KudosStatsCard.tsx              # D.1 personal stats
│   ├── OpenGiftButton.tsx              # D.1.8 gold CTA
│   ├── KudosLeaderboard.tsx           # D.3 top recipients
│   └── LeaderboardRow.tsx             # D.3.x single row
└── shared/
    ├── UserInfoBlock.tsx               # Sender/receiver (avatar + name + dept + star)
    ├── StarTierBadge.tsx               # Star badge with tooltip
    ├── AvatarHoverPreview.tsx          # Hover overlay (300ms delay)
    └── KudosSkeleton.tsx              # Shared skeleton components

hooks/
├── kudos/
│   ├── use-kudos-feed.ts              # TQ: paginated feed + append
│   ├── use-kudos-highlights.ts        # TQ: highlight carousel data
│   ├── use-kudos-filters.ts           # URL-synced hashtag+dept state
│   ├── use-kudos-stats.ts             # TQ: /users/me/stats
│   ├── use-kudos-total.ts             # TQ: /kudos/stats/total
│   ├── use-heart.ts                   # Optimistic like mutation
│   ├── use-copy-link.ts               # Clipboard + toast state
│   ├── use-sunner-search.ts           # Debounced search query
│   └── use-realtime-kudos.ts         # Supabase Realtime subscription

lib/
└── kudos/
    ├── queries.ts                     # Supabase query builder functions
    ├── schemas.ts                     # Zod schemas (shared API ↔ hook)
    ├── realtime.ts                    # Supabase Realtime channel helpers
    └── constants.ts                  # STALE_TIME, PAGE_SIZE, DEBOUNCE_MS, etc.

types/
└── kudos.ts                          # Kudos, Heart, Hashtag, Department, SecretBox, etc.

supabase/
└── migrations/
    ├── YYYYMMDD_01_create_kudos.sql
    ├── YYYYMMDD_02_create_hearts.sql
    ├── YYYYMMDD_03_create_hashtags.sql
    ├── YYYYMMDD_04_create_departments.sql
    ├── YYYYMMDD_05_create_secret_boxes.sql
    └── YYYYMMDD_06_rls_policies.sql

tests/
├── unit/kudos/
│   ├── use-heart.test.ts
│   ├── use-kudos-filters.test.ts
│   ├── use-copy-link.test.ts
│   └── schemas.test.ts
├── integration/kudos/
│   ├── api-kudos-feed.test.ts
│   ├── api-kudos-likes.test.ts
│   └── api-kudos-highlights.test.ts
└── e2e/kudos/
    └── live-board.spec.ts
```

### Modified Files

| File | Change |
|------|--------|
| `app/layout.tsx` | Wrap with `<QueryProvider>` (TanStack Query) |
| `app/globals.css` | Add kudos-scoped CSS variable block |
| `app/api/notifications/unread-count/route.ts` | Replace stub with real Supabase query |
| `messages/vi.json` | Add `kudos.*` namespace keys |
| `messages/en.json` | Add `kudos.*` namespace keys |
| `components/icons/` | Add missing icons: Heart, Copy, OpenGift, PanZoom, ArrowSent |
| `.momorph/constitution.md` | Add `@tanstack/react-query`, `zod`, `@radix-ui/react-dialog` to Technology Stack |

### New Dependencies

| Package | Version | Purpose | Approval required |
|---------|---------|---------|-------------------|
| `@tanstack/react-query` | `^5` | Server state caching, stale-while-revalidate | ✅ Yes |
| `@tanstack/react-query-devtools` | `^5` | Dev-only TQ inspector | ✅ Yes (devDep) |
| `zod` | `^3` | API request/response validation | ✅ Yes |
| `@radix-ui/react-dialog` | `^1` | Accessible `<ImageLightbox />` modal | ✅ Yes |

> Supabase Realtime is already part of `@supabase/supabase-js` — no extra WS package needed.
> D3 force-layout: evaluate during Phase 6. If added, requires a separate approval PR.

---

## CSS Variable Extension Plan

Add the following block to `app/globals.css` under `/* Kudos Live Board */`:

```css
/* ─── Kudos Live Board ──────────────────────────── */
/* Colors */
--color-kudos-bg-panel: #00070C;         /* right-panel surface */
--color-kudos-cream: #FFF8E1;            /* KUDO card bg */
--color-kudos-cream-shelf: #FFF3C6;      /* award shelf wash */
--color-kudos-text-on-cream: #00101A;    /* text on cream cards */
--color-kudos-text-timestamp: #999999;   /* timestamps, dept labels */
--color-kudos-text-footer: rgba(255,255,255,0.60);
--color-kudos-gold-hover: rgba(255,234,158,0.40);
--color-kudos-accent-hot: #F17676;       /* hot sender highlight */
--color-kudos-heart-active: #D4271D;     /* aliased from --color-status-unread */

/* Radius */
--radius-kudos-card: 24px;              /* KUDO post card */
--radius-kudos-highlight: 16px;         /* Highlight card */
--radius-kudos-panel: 16px;             /* D.1 / D.3 panels */
--radius-kudos-pill-lg: 64px;           /* Hero CTAs */
--radius-kudos-pill-md: 48px;           /* Filter chips */
--radius-kudos-arrow: 4px;              /* Carousel arrow buttons */
--radius-kudos-open-gift: 8px;          /* D.1.8 Mở quà */

/* Spacing */
--spacing-kudos-card-pad: 40px;         /* KUDO post outer padding */
--spacing-kudos-card-pad-b: 16px;       /* KUDO post bottom padding */
--spacing-kudos-card-gap: 16px;         /* KUDO post inner gap */
--spacing-kudos-panel-pad: 24px;        /* D.1 / D.3 padding */
--spacing-kudos-panel-gap: 10px;        /* D.1 / D.3 inner gap */
--spacing-kudos-feed-gap: 24px;         /* Gap between C.3 cards */

/* Borders */
--border-kudos-highlight: 4px solid #FFEA9E;   /* B.3 Highlight card */
--border-kudos-panel: 1px solid #998C5F;        /* D.1 / D.3 panels */
--border-kudos-avatar: 1.869px solid #FFFFFF;   /* Avatar ring */

/* Skeleton */
--color-kudos-skeleton: #0D1E29;
--color-kudos-skeleton-shimmer: #1A2E3D;

/* Z-index (slot into existing --z-* scale) */
--z-kudos-lightbox: 60;    /* above dropdown --z-dropdown: 30 */
--z-kudos-tooltip: 70;     /* above lightbox */
--z-kudos-toast: 80;       /* topmost */
```

> Existing tokens that can be reused directly (no alias needed):
> `--color-bg-dark` → app background; `--color-cta-bg` → brand gold; `--color-cta-outline-bg` → soft gold button; `--color-cta-outline-border` → 1px gold border; `--color-status-unread` → notification dot + heart active; `--color-bg-header` → sticky header bg; `--color-divider` → dark divider.

---

## Implementation Strategy

### Phase 0 — Asset Preparation *(before any code)*

- [ ] Obtain SVN-Gotham font file (`.woff2`) from the design/brand team — commit to `public/fonts/svn-gotham/`
- [ ] Download keyvisual/hero background image(s) via `get_media_files` Figma tool → `public/images/kudos/`
- [ ] Download any badge overlay images (Legend Hero, Super Hero, New Hero, Rising Hero) → `public/images/kudos/badges/`
- [ ] Verify all asset filenames follow kebab-case convention

### Phase 1 — Foundation *(gates all later phases)*

> **TDD gate**: write Zod schema tests and type-check before writing API logic.

- [ ] **Team approval**: get sign-off on 3 new packages + update `constitution.md`
- [ ] `npm install @tanstack/react-query@^5 zod@^3 @radix-ui/react-dialog@^1`
- [ ] `npm install -D @tanstack/react-query-devtools@^5`
- [ ] Create `types/kudos.ts` — all domain types (`Kudos`, `Heart`, `Hashtag`, `Department`, `SecretBox`, `TickerEvent`, `KudosStats`, `LeaderboardEntry`, `KudosFilters`)
- [ ] Create `lib/kudos/schemas.ts` — Zod schemas for every API route
- [ ] Create `lib/kudos/constants.ts` — `PAGE_SIZE=20`, `STALE_TIME_*`, `DEBOUNCE_MS=300`, etc.
- [ ] Write `supabase/migrations/` — 6 migration files (kudos, hearts, hashtags, departments, secret_boxes, RLS)
- [ ] Apply migrations to local Supabase; verify RLS
- [ ] Add `kudos.*` i18n keys to `messages/vi.json` + `messages/en.json`
- [ ] Add CSS variable block to `app/globals.css`
- [ ] Add `QueryProvider` wrapper in `app/layout.tsx`
- [ ] Add `next/font/local` setup for SVN-Gotham in `app/layout.tsx`

### Phase 2 — Route Shell & Hero *(US2 foundation)*

- [ ] Create `app/kudos/page.tsx` (RSC) — auth guard (`createServerClient` session check) + `<KudosLiveBoard />`
- [ ] Create `app/kudos/layout.tsx` — no extra layout logic; QueryProvider already at root
- [ ] Create `app/kudos/loading.tsx` — skeleton shell (4-region placeholders using `<KudosSkeleton />`)
- [ ] Create `app/kudos/error.tsx` — section-scoped error boundary shell
- [ ] Implement `KudosBoardHero` (RSC) — static layout, KUDOS wordmark, subtitle
- [ ] Implement `KudosComposeTrigger` (client) — `A.1` pill, click → `router.push('/kudos/new')`
- [ ] Implement `SunnerSearchTrigger` (client, hero) — pill, click → opens search overlay
- [ ] Reuse `Header` / `Footer` components

### Phase 3 — All Kudos Feed + Real-time *(US1 P1)*

> Start here for MVP — this is the highest-value user story.

**API routes** (write Vitest integration tests first):
- [ ] `GET /api/kudos` — paginated feed (Zod: `page`, `limit`, `hashtag?`, `dept?`)
- [ ] `GET /api/kudos/:id` — single kudo
- [ ] `POST /api/kudos/:id/likes` / `DELETE /api/kudos/:id/likes` — heart toggle

**Hooks** (write unit tests first):
- [ ] `use-kudos-feed.ts` — `useInfiniteQuery`-style with `page` cursor; invalidate on Realtime event
- [ ] `use-heart.ts` — optimistic mutation with rollback
- [ ] `use-copy-link.ts` — clipboard write + 2s toast state
- [ ] `use-realtime-kudos.ts` — Supabase Realtime channel subscribe / unsubscribe lifecycle

**Components**:
- [ ] `KudosAllFeed` (client) — TQ query + Realtime subscription mount; renders list + `LoadMoreButton`
- [ ] `KudosPostCard` — `UserInfoBlock` sender + receiver, time, content (5-line truncate), hashtag chips, action bar
- [ ] `HeartButton` — gray ↔ red toggle, disabled when `sender === currentUser`, special-day weight logic
- [ ] `CopyLinkButton` — clipboard write + toast
- [ ] `HashtagChip` — click handler sets filter (calls `useKudosFilters().setHashtag`)
- [ ] `LoadMoreButton` — idle / loading spinner / error retry / hidden-when-done states
- [ ] `SpotlightActivityFeed` (client) — **B.7.4** lines; poll `/api/kudos?page=1`; optional WS invalidation (replaces removed `KudosLiveTicker`)
- [ ] Wire `notifications/unread-count` API to real Supabase query

### Phase 4 — Filters + Right Panel *(US3, US4, US6)*

**API routes**:
- [ ] `GET /api/hashtags?scope=trending`
- [ ] `GET /api/departments`
- [ ] `GET /api/users/me/stats`
- [ ] `GET /api/sunners/top?limit=10&metric=gift`
- [ ] `GET /api/me/secret-boxes/next`

**Hooks**:
- [ ] `use-kudos-filters.ts` — wraps `useSearchParams` / `useRouter`; exposes `setHashtag`, `setDept`, `clearAll`; resets `feedPage` to 1 on change
- [ ] `use-kudos-stats.ts` — TQ with 2-min stale; invalidated on `secretBox.opened` Realtime event

**Components**:
- [ ] `KudosFilters` (client) — B.1.1 / B.1.2 dropdown triggers with active state
- [ ] `KudosRightPanel` (client) — orchestrates D.1 + D.3 (no right-panel ticker)
- [ ] `KudosStatsCard` — 5 metric rows + `OpenGiftButton`
- [ ] `OpenGiftButton` — enabled/disabled based on `secretBoxClosed > 0`, navigates to secret-box flow
- [ ] `KudosLeaderboard` — top-10 rows; click → profile; empty state copy

### Phase 5 — Highlight Carousel *(US1 second wave)*

**API routes**:
- [ ] `GET /api/kudos/highlights`
- [ ] `GET /api/kudos/stats/total`

**Hooks**:
- [ ] `use-kudos-highlights.ts` — 5-min stale
- [ ] `use-kudos-total.ts` — invalidate on `kudos.new`

**Components**:
- [ ] `KudosHighlightSection` (client) — section wrapper with filter awareness
- [ ] `KudosHighlightCarousel` — slide state, auto-advance (5s, pause on hover/focus-within), keyboard ← / →
- [ ] `KudosHighlightCard` — B.3 card (4px gold border, 3-line content, red hashtags, "Xem chi tiết" link)
- [ ] `KudosSlideBar` — B.5 `< 2/5 >` pagination; prev/next disable at edges

### Phase 6 — Spotlight + Search + Lightbox *(US5 P3)*

- [ ] `SpotlightBoard` (client) — D3 `forceSimulation` with node hover tooltip and click-to-detail; pan/zoom toggle via `d3-zoom`; evaluate adding `d3` dep (needs separate approval if not already present)
- [ ] `SpotlightSearch` — `B.7.3` text input, maxLength 100, debounced 300ms, triggers `/api/sunners?q=`
- [ ] `use-sunner-search.ts` — debounced TQ search hook
- [ ] `ImageLightbox` (Radix Dialog) — overlay, Esc, click-outside, ← / → cycling, `aria-modal`, counter badge

### Phase 7 — Polish, A11y & Testing

- [ ] **Loading skeletons**: `<KudosSkeleton />` shimmer variants (feed cards, highlight, right-panel stats rows)
- [ ] **Empty states**: per-region copy; Highlight block hidden on 0 results
- [ ] **Error boundaries**: `error.tsx` per region with section-scoped retry button
- [ ] **Responsive**: verify single-column at < 1280px; accordion for right panel at < 768px; carousel swipe on mobile
- [ ] **Accessibility audit**: focus order, `aria-live` on **B.7.4** (when WS-driven) + toast, `aria-label` on post cards, skip link, keyboard carousel
- [ ] **Unit tests**: `use-heart`, `use-kudos-filters`, `use-copy-link`, `schemas.ts` — target 80% coverage
- [ ] **Integration tests**: `GET /api/kudos`, `POST/DELETE /api/kudos/:id/likes`, `GET /api/kudos/highlights` against local Supabase
- [ ] **E2E tests**: `tests/e2e/kudos/live-board.spec.ts` — happy-path feed load, heart toggle, copy-link toast, filter cascade, load-more, auth redirect

---

## Integration Testing Strategy

### Test Scope

- [x] **Component/UI interactions**: filter → feed cascade; heart optimistic toggle + rollback; carousel auto-advance pause
- [x] **External dependencies**: Supabase (PostgreSQL + Realtime); `/auth/callback` session
- [x] **Data layer**: CRUD on `kudos`, `hearts`; RLS policy enforcement (user cannot like own kudos)
- [x] **User workflows**: load board → filter → like → copy → load more

### Test Categories

| Category | Applicable | Key Scenarios |
|----------|-----------|---------------|
| UI ↔ Logic | Yes | Heart toggle visual state matches TQ cache; filter URL param sync; load-more appends pages |
| App ↔ External API | Yes | Supabase CRUD + RLS; Realtime channel subscribe/receive |
| App ↔ Data Layer | Yes | `hearts` unique constraint; `weight` 1 vs 2 on special days |
| Cross-platform | Yes | Responsive layout at 360 / 768 / 1280px; keyboard-only navigation |

### Mocking Strategy

| Dependency | Strategy | Rationale |
|------------|---------|-----------|
| Supabase DB | **Real** (local Supabase instance) | Constitution §III: mocking DB is PROHIBITED |
| Supabase Realtime | **Real** (local) | WS semantics must match production |
| Clipboard API | **Stub** (`vi.stubGlobal('navigator')`) | Not available in jsdom |
| `window.matchMedia` | **Stub** | Not available in jsdom |
| D3 (Spotlight) | **Mock** in unit tests; real in E2E | D3 rendering needs a real DOM |

### Test Scenarios

1. **Happy Path**
   - [ ] Board loads all four regions within 2.5s (performance budget)
   - [ ] Heart toggle: gray → red → count + 1, POST confirmed, WS echo reconciles
   - [ ] Copy link: toast appears with exact text `Link copied — ready to share!`
   - [ ] Hashtag filter updates both Highlight + All Kudos; URL reflects `?hashtag=:tag`
   - [ ] "Xem thêm" loads next page and appends cards; hides when exhausted
   - [ ] "Mở quà" navigates to secret-box flow when `secretBoxClosed > 0`

2. **Error Handling**
   - [ ] One region 500 → other three render; retry button in failed region
   - [ ] Heart POST 409 (constraint violated) → rollback heart + toast
   - [ ] WS disconnect → reconnect banner; auto-dismiss on reconnect
   - [ ] 401 on any request → redirect to `/`

3. **Edge Cases**
   - [ ] Sender cannot heart their own kudo (disabled button, no API call)
   - [ ] Special-day heart adds weight=2; un-heart subtracts 2
   - [ ] 0 highlights → entire B block hidden
   - [ ] 0 leaderboard rows → "Chưa có dữ liệu"
   - [ ] Content > 5 lines truncates with `…`; content > 3 lines in highlight card

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Zod schemas | 100% | High |
| `use-heart` hook | 90% | High |
| `use-kudos-filters` hook | 90% | High |
| API route handlers | 80% | High |
| UI components | 70% | Medium |
| Spotlight (D3) | 50% | Low |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Dep approval delay (3 packages) | Medium | High | Start Phase 0 assets + migrations in parallel; unblock with `fetch` + `useState` stubs if TQ not approved in time |
| SVN-Gotham font not available | Medium | Medium | Placeholder: `system-ui` with same weight; hero layout uses fixed-height container so fallback won't reflow |
| D3 Spotlight complexity | High | Medium | Descope to static list/grid for MVP (P3 story); add D3 in a follow-up sprint |
| Supabase Realtime schema changes | Low | High | Keep Realtime payload minimal (`{type, kudosId}`); fetch full record on receive rather than trusting WS payload |
| Special-day heart logic bugs | Medium | High | Vitest unit tests cover all 4 cases (normal like, normal unlike, special like, special unlike); integration test asserts DB `weight` column |
| RLS policy gaps | Low | Critical | All 6 migration files reviewed before any write operation; integration test runs as a non-owner user to verify enforcement |
| Responsive layout at 768–1279px | Medium | Low | Add explicit Tailwind `md:` utilities for the intermediate tablet range; smoke test at 768 + 1024 + 1279px |

---

## Estimated Complexity

| Area | Complexity | Notes |
|------|-----------|-------|
| Foundation (types, schema, i18n) | Low | Straightforward scaffolding |
| API routes | Medium | 10 route files; Zod validation on each |
| Feed + Hearts + Realtime | **High** | Optimistic UI + WS reconciliation is the hardest part |
| Filters + URL sync | Medium | `useSearchParams` + TQ invalidation |
| Right panel | Low | Read-only stats; Realtime for live update |
| Highlight carousel | Medium | Auto-advance + keyboard + swipe |
| Spotlight D3 | **High** | Custom data-viz; descope if at-risk |
| Polish + Testing | Medium | Systematic; no surprises expected |

---

## Dependencies & Prerequisites

### Required Before Phase 1

- [ ] `constitution.md` reviewed — all 5 principles checked ✅
- [ ] `spec.md` + `design-style.md` reviewed and confirmed ✅
- [ ] Team approval for `@tanstack/react-query`, `zod`, `@radix-ui/react-dialog`
- [ ] SVN-Gotham font file obtained from brand team
- [ ] Backend team confirms Supabase schema approach (or provides existing migrations)
- [ ] Confirm: does `/kudos/new` (Viết Kudo) route exist? If not, block Phase 2's compose CTA navigation

### External Dependencies

- Supabase project with RLS-ready setup (local: `supabase start`)
- Figma media files accessible via `get_media_files` (hero background, badge images)
- Backend confirmation on WebSocket event envelope schema: `{ type: 'kudos.new' | 'kudos.liked', ts: string, payload: { kudosId: string, … } }`

---

## Open Questions

- [ ] Does the `/kudos/new` (Viết Kudo, frame `ihQ26W78P2`) route exist yet? The "Ghi nhận" CTA depends on it.
- [ ] Is D3 (`d3` package) already approved / in use elsewhere? Or should Spotlight use a simpler canvas approach?
- [ ] Should the "Xem thêm" button reset scroll position to top of feed, or maintain position?
- [ ] Confirm that Supabase Realtime is enabled on the project and that `kudos` table replication is turned on.
- [ ] D.2 "10 SUNNER CÓ SỰ THĂNG HẠNG MỚI NHẤT" — confirm with design team if/when this panel is included.

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate the task breakdown
2. **Complete Phase 0** (assets) in parallel with team approvals
3. **Begin Phase 1** once packages approved and migrations reviewed
4. Follow phase order; use `use-realtime-kudos` stub (no-op) until real-time is confirmed working in local env

---

## Notes

- The `app/kudos/layout.tsx` does NOT add another QueryProvider — the root `app/layout.tsx` wraps once. The `kudos/layout.tsx` exists only to set page-level metadata and Suspense boundaries.
- Supabase Realtime channel name: `kudos-live`. Shared by feed, highlight, right-panel stats context, and (optionally) **B.7.4** invalidation — one channel; unsubscribe on component unmount via the channel's `removeAllChannels()`.
- The `--color-kudos-heart-active` token aliases `--color-status-unread` (`#D4271D`) — use the existing token name in CSS to avoid duplication; the kudos alias is documentation only.
- `KudosPostCard` is passed as an RSC to the client `KudosAllFeed` parent via the `children` prop pattern (React 19 compatible), keeping the card markup out of the client bundle.
- Special-day heart weight (1 vs 2) must be resolved on the API side (`POST /api/kudos/:id/likes` reads the `special_days` config table) — the client always sends a plain POST and reads back `{ weight }` in the response to update the local cache correctly on un-heart.
