# Implementation Plan: Awards Information ("Hệ thống giải thưởng SAA 2025")

**Frame**: `zFYDgyj_pD-He-thong-giai`
**Date**: 2026-04-26
**Spec**: `.momorph/specs/zFYDgyj_pD-He-thong-giai/spec.md`
**Design-style**: `.momorph/specs/zFYDgyj_pD-He-thong-giai/design-style.md`
**SCREENFLOW**: `.momorph/SCREENFLOW.md` § "Screen Detail — Awards Information"

---

## Summary

Implement the authenticated reference page at `/awards` (Next.js App Router, RSC-first) that explains the SAA 2025 award system: shared header with "Award Information" active → keyvisual + page title → a sticky 6-item side navigation (`C.1`–`C.6`) wired to a long scroll containing 6 detail rows (`D.1`–`D.6`) in an **alternating zig-zag** layout (image-left / image-right) → reuse of the existing `<KudosPromo>` block as the page-foot teaser → shared footer.

**The implementation is heavily reuse-driven.** Every shared chrome element (header, header-nav, controls, mobile drawer, footer, footer-nav, language selector, avatar menu, notification button, all icons except 3 new ones, the `<KudosPromo>` + `<KudosCtaButton>` + `<KudosLogomark>` cluster, and the entire Supabase + auth + i18n + design-token layer) is **already in production from the Homepage SAA**. New code is contained to: the `/awards` route, ~9 page-specific components under `components/awards/`, a single scroll-spy hook, 3 new icons, an extended `AwardCategory` data model in the existing `lib/awards.ts`, and the `awards.*` i18n namespace.

**No new backend, no new database table, no new API endpoint** in v1 — the awards data is served from the existing static `AWARDS` array in `lib/awards.ts` (extended with the per-award `quantity`, `quantityUnit`, `values`, `nameOverlayImage` fields). The spec's "predicted" `/api/awards` endpoint is deferred until the Admin Dashboard is built; the Awards Information page reads the array directly during RSC render. **No new dependencies.**

---

## Technical Context

| Item                        | Value                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------ |
| **Language / Framework**    | TypeScript 5 (strict) / Next.js 16.2.4 App Router                                    |
| **Primary Dependencies**    | React 19.2.4, Tailwind CSS v4, `@supabase/ssr` ^0.10.2, `@supabase/supabase-js` ^2.104.0, `next-intl` ^4.9.1 — all already installed |
| **Database**                | Supabase (Auth only for v1; awards data is in-code static — see § Data Model)        |
| **Testing**                 | Vitest 2.1.9 + `happy-dom` ^20.9.0 (unit + integration), Playwright ^1.59.1 (E2E) — all installed |
| **State Management**        | RSC server props (user role, email) + local `useState` in two Client islands (`<AwardsSideNav>` for scroll-spy; the existing `<AvatarMenu>` / `<NotificationButton>` / `<LanguageSelector>` are already Client). **No React Query / Zustand / Redux.** |
| **API Style**               | None added. Existing Supabase SSR for auth/session. The "Chi tiết" CTA is a `next/link` to `/kudos` (route reserved). |
| **Routing**                 | Flat `app/awards/page.tsx` (matches `app/about-saa-2025/page.tsx` convention; route-group refactor deferred — see § Architecture > Route structure) |

---

## Constitution Compliance Check

*GATE: Must pass before implementation begins.*

- [x] **§I Clean Code & Source Organization** — kebab-case for non-component modules (`use-scroll-spy.ts`, `award-row.tsx`); PascalCase for components and types (`AwardCategory`, `<AwardRow>`); 2-space indent; ~100-char lines; single-direction imports (`page → components → lib/hooks/types`); no circular deps. Business logic stays out of route handlers (no route handlers added). New components live in `components/awards/` (feature folder); shared chrome stays in `components/ui/`.
- [x] **§II Tech Stack Best Practices — Next.js + Supabase** — RSC by default; **only one new Client Component**: `<AwardsSideNav>` (needs `useEffect` + `IntersectionObserver`). All colors/spacing/typography are CSS variables in `app/globals.css` per the design-token rule (existing tokens reused; only new tokens added per § Project Structure > Modified files > globals.css). TypeScript strict mode. The `@/*` path alias is used everywhere. Awards data is read via the existing `lib/awards.ts` (no new Supabase tables in v1, so no new RLS policies needed yet — but TR-002a in spec.md preserves the policy contract for the future Admin Dashboard migration).
- [x] **§III Test-First Development — NON-NEGOTIABLE** — every new component, hook, and lib export gets a failing test first (TDD). Integration tests run against a real local Supabase instance (no DB mocks). Unit tests cover scroll-spy logic, value formatting, and accessibility wiring. E2E covers: unauthenticated redirect, authenticated render, anchor scroll-spy, deep-link from `/awards#mvp`, "Chi tiết" CTA → `/kudos`. Tests are committed in the same PR as implementation per the "no implementation without tests" rule.
- [x] **§IV Platform UI & Navigation Guidelines** — responsive at mobile (≥360), tablet (≥768), desktop (≥1280), per spec § Responsive. Navigation is derived **only** from `SCREENFLOW.md` (the "Award Information" link points at `/awards`; "Chi tiết" points at `/kudos`; both routes are reserved). All interactive targets ≥48×48 (CTA = 56h; nav items = 56h). Active state uses both color **and** `aria-current="true"` per spec § Visual Requirements > Accessibility.
- [x] **§V Security First — OWASP** — Awards Information is a protected route (`proxy.ts` already redirects unauthenticated access to `/`). No user input on this page → no new validation/sanitization surface. No secrets added. Supabase session remains in HttpOnly cookies (existing `lib/supabase/server.ts`). No `localStorage` / `sessionStorage` reads. `npm audit` runs in CI per existing setup.

**Violations (planned)**: None. The plan complies fully with all five constitution principles.

---

## Architecture Decisions

### Frontend Approach

- **Component structure** — feature-based. Page-specific components live under `components/awards/`; shared chrome (header, footer, kudos promo, mobile nav) is **reused as-is** from `components/ui/` and `components/home/`. All icons remain in `components/icons/`.

- **RSC / Client split** — RSC is the default. **Only one new Client Component** is required:
  - `<AwardsSideNav>` — needs `useEffect` to install `IntersectionObserver` for the scroll-spy and to manage the URL hash on click. The 6 individual `<AwardsSideNavItem>` children inside it can stay as RSC props (they receive `active: boolean` from the parent).
  - The existing `<AvatarMenu>`, `<NotificationButton>`, `<LanguageSelector>`, `<MobileNavDrawer>`, `<HamburgerButton>` are already `'use client'` and are reused untouched.
  - Award rows (`<AwardRow>`, `<AwardImage>`, `<AwardContent>`, etc.) and the `<AwardsPageTitle>` are pure RSC — they receive props derived from `lib/awards.ts` + i18n.

- **Styling** — Tailwind v4 utilities + CSS tokens in `app/globals.css`. **Reuse** the existing token surface (e.g. `--color-bg-dark`, `--color-cta-bg`, `--color-accent-gold-alt`, `--color-divider`, `--font-montserrat`, `--radius-card`, `--shadow-card-default`, `--spacing-section-gap`). **Add** the small set of new tokens this feature needs (see § Project Structure > Modified files > globals.css). No CSS-in-JS, no inline raw hex literals (per Principle II).

- **Data fetching** — RSC reads the static `AWARDS` array from `lib/awards.ts` directly. No `fetch()`, no API call. The session check is done by `proxy.ts` (already deployed); `app/awards/page.tsx` calls `getUserRole()` to drive the avatar dropdown's "Admin Dashboard" item visibility (same pattern as Homepage SAA). The `lib/awards.ts` array is extended with the new fields (see § Data Model), keeping backward compat for the Homepage `<AwardCard>` consumer.

- **Scroll-spy strategy** — `IntersectionObserver` with `rootMargin: '-112px 0px -50% 0px'` (top offset = sticky-header height 80 + 32 visual gap; bottom = halfway viewport, so a section is "active" when its title is in the upper half). The observer registers each `<section data-award-slug="…">` and fires a callback that updates a `useState<string>` for the active slug. Click handler calls `element.scrollIntoView({ behavior: 'smooth', block: 'start' })` and writes `history.replaceState(null, '', '#slug)` to update the URL without adding history entries. Under `prefers-reduced-motion: reduce`, the `behavior` is forced to `'auto'`.

- **Sticky-positioning gotcha — page root wrapper MUST use `overflow-x-clip`, NOT `overflow-x-hidden`** — the `<div className="relative min-h-screen ... overflow-x-*">` wrapper at the top of `app/awards/page.tsx` exists to prevent horizontal overflow from decorative elements (e.g. the keyvisual gradient). However, `overflow-x: hidden` implicitly computes `overflow-y: auto`, which turns the wrapper into a scroll container — and `position: sticky` on the side nav will then anchor to that (non-scrolling) container instead of the viewport, making the menu appear frozen rather than following scroll. Use **`overflow-x: clip`** (Chrome 90+ / Firefox 81+ / Safari 16+ — sufficient coverage) which prevents horizontal overflow without creating a scroll container, preserving sticky behaviour. Tests must include an E2E assertion that the side nav's bounding-box `top` stays within `[112px, 113px]` of the viewport top after a programmatic scroll past the keyvisual.

- **Zig-zag rendering** — `<AwardRow>` accepts `direction: 'image-left' | 'image-right'`. The list component (`<AwardsList>`) computes direction from render index: `direction = idx % 2 === 0 ? 'image-left' : 'image-right'`. Per spec FR-002a, the index is **render position**, not slug — so a partial API response in the future will still produce a correct zig-zag.

- **Award image stacking** — the 336×336 frame contains two `next/image` instances: a background `imageUrl` (the photographic award artwork, with `aria-hidden="true"`, `alt=""`) and a centered `nameOverlayImage` (the raster wordmark, with `alt={t(award.titleKey)}` so screen readers announce the title once). Border + glow shadow + `mix-blend-mode: screen` are applied to the wrapping `<div>`, not the images, per design-style § 3a.

- **Font loading** — Montserrat is already loaded in `app/layout.tsx` via `next/font/google` (per Homepage SAA plan compliance) and exposed as `--font-montserrat`. The Awards Information page **adds nothing** here — it just consumes the existing variable. No `Digital Numbers` / DSEG7 needed (this page has no countdown).

- **Image optimisation** — all raster images go through `next/image`:
  - **Award background images** (336 × 336) — `<Image fill sizes="336px" quality={90}>`. **NOT** `priority`; only the first 1–2 rows are above the fold. The rest lazy-load.
  - **Award name overlays** (≈ 221 × 35 px each) — `<Image>` with explicit `width` and `height` per asset. Tiny payload; no special optimisation needed beyond standard PNG compression.
  - **Keyvisual** — uses CSS `background-image` via the existing `.home-hero-bg` class (or a new `.awards-hero-bg` if design provides a different image — see § Open Questions). NOT `<Image>` because of the gradient overlay stacking.
  - **Sun* Kudos block image** — already handled by the existing `<KudosPromo>`/`<KudosLogomark>` components.

- **Error resilience** — three layers (mirroring Homepage SAA):
  1. `app/awards/error.tsx` — Next.js route error boundary catches RSC rendering errors; reset button triggers re-render.
  2. `<AwardsSideNav>` wraps its `IntersectionObserver` `useEffect` in a try/catch; if observer setup fails (older browser, unusual fix), the menu still renders and click-to-scroll still works — only auto-active-on-scroll is disabled.
  3. The `<AwardsList>` reads from a static array — no fetch failure mode in v1. Spec edge case "Network failure on awards data" is preserved as a future-proofing requirement; when `/api/awards` is wired up, the failure UI lives at the same boundary.

- **Loading state** — `app/awards/loading.tsx` renders a minimal header shell + page-title placeholder. The page is otherwise fully SSR'd, so client-side skeleton is unnecessary.

- **Metadata** — `app/awards/page.tsx` exports `const metadata: Metadata = { title: 'Hệ thống giải thưởng SAA 2025 — Sun* Annual Awards', description: 'Tìm hiểu chi tiết hệ thống giải thưởng Sun* Annual Awards 2025' }`. Authenticated page; no Open Graph cards needed in v1.

### Backend Approach

- **No new DB tables in v1.** Awards are static, brand-curated content; they change once per year. Storing them in code is correct.
- **No new API endpoints in v1.** The spec's "predicted" `/api/awards` is deferred to the Admin Dashboard PR; the Awards Information page reads `AWARDS` directly from `lib/awards.ts` during RSC.
- **No new Supabase calls** beyond the existing `auth.getSession` (for the route guard, already in `proxy.ts`) and `getUser()` (used by `getUserRole()` for the avatar dropdown). No new RLS policies are required, but **TR-002a in spec.md preserves the future requirement**: when the Admin Dashboard introduces an `awards` table, it MUST ship with an RLS `SELECT` policy granting authenticated users read access in the same migration commit.
- **Sun\* Kudos teaser copy** is **not** fetched. Per spec § "API Dependencies > NOT used on this screen", the eyebrow / title / description / CTA text are static i18n strings. The existing `<KudosPromo>` already implements this pattern; no change needed.

### Integration Points

- **Reuse from Homepage SAA (no code change)**
  - `lib/supabase/{client,server,middleware}.ts` — unchanged.
  - `proxy.ts` — unchanged. `/awards` is automatically protected because it's neither `/` nor `/auth/callback`. Verified by inspection of `proxy.ts:28`.
  - `lib/auth/get-user-role.ts` — unchanged. Used by Awards page exactly like Homepage uses it (`const role = await getUserRole(); const isAdmin = role === 'admin'`).
  - `i18n/request.ts` + `next-intl` — unchanged; just adds the `awards.*` namespace to `messages/{vi,en}.json`.
  - `components/ui/header.tsx` — unchanged. Awards page passes `<HeaderNav />` as `navSlot` (the existing `<HeaderNav>` already handles "Award Information" active-state via `usePathname()`).
  - `components/ui/{header-nav,header-controls,avatar-menu,notification-button,language-selector,mobile-nav-drawer,hamburger-button,nav-link,footer,footer-nav}.tsx` — all unchanged.
  - `components/home/homepage-mobile-nav.tsx` — **reused unchanged** as the header-level mobile drawer (3 nav links + controls). Despite the name, this component is page-agnostic at the header level (it's the mobile counterpart to `<HeaderNav />`); only the import path is misleading. **Track a follow-up rename** to `components/ui/app-mobile-nav.tsx` once a 3rd authenticated screen reuses it (per the layout-group migration in Open Q1). Both Awards page and a future Sun* Kudos page would benefit from the rename, so doing it now is justified — but to keep this PR small, the rename is deferred. **Do NOT** create an `<AwardsMobileNav>` duplicate — that would diverge the two pages' header behavior.
  - `components/icons/{bell,user,chevron-down,vn-flag,saa-logo,hamburger,arrow-up-right}-icon.tsx` — all unchanged.
  - `components/home/{kudos-promo,kudos-cta-button,kudos-logomark}.tsx` — **reused unchanged**. The same teaser block is the design intent on both Homepage and Awards page (Q2 lock decision and SCREENFLOW.md both confirm). They live under `components/home/` today; **rationale for not moving them**: the import path `@/components/home/kudos-promo` is short, the cluster is one cohesive unit, and the cost of moving is non-zero (refactor, retest the Homepage). A future PR may promote them to `components/ui/` if a third consumer arises — tracked under § Open Questions.
  - `components/home/award-card.tsx` — **NOT reused** (different layout). That component is the Homepage **compact card** (image + 2-line description + "Chi tiết" link, deep-linking to `/awards#<slug>` after the href update — see Modified files). The Awards Information page needs a fundamentally different layout (336×336 image + full-paragraph description + quantity + value), so we author a new `<AwardRow>` component under `components/awards/` rather than overload `<AwardCard>`. Existing Homepage tests must be updated in lockstep with the href change (see Modified files).

- **Extend (additive only — backward compatible)**
  - `types/home.ts` → add `AwardCategory extends AwardSpec` interface with optional new fields (`quantity`, `quantityUnit`, `values`, `nameOverlayImage`, `descriptionLongKey`). Homepage `<AwardCard>` continues to read only the original `AwardSpec` shape; Awards Information reads the full `AwardCategory`. Single source of truth.
  - `lib/awards.ts` → broaden `AWARDS` from `readonly AwardSpec[]` to `readonly AwardCategory[]`, populating the new fields per the design-style § "Per-card content reference" table. Homepage reads only the subset → no Homepage regression.
  - `messages/{vi,en}.json` → add the `awards.*` namespace and per-card `descriptionLong` keys. Homepage's `home.awards.{slug}.title/description` keys are untouched.
  - `app/globals.css` → add only the new tokens this feature requires (see § Modified files).

- **New dependencies** — **none**. All required packages are already in `package.json`.

### Route structure (chosen)

Use a flat `app/awards/page.tsx` — **NOT** a `app/(authenticated)/` route group in v1. Rationale (carry-over from the Homepage SAA plan):

- We now have **two** authenticated screens (Homepage + Awards Information). A route group for two screens is still premature abstraction per Constitution §I.
- `<Header>` and `<Footer>` composition happens at the page level (they accept slots), not at a shared layout — keeps each page's chrome explicit and searchable.
- When a 3rd authenticated screen lands (Sun* Kudos / Profile / Admin Dashboard), refactor to `app/(authenticated)/layout.tsx` housing the chrome shell. **Track that as an explicit migration PR**, not piggy-backed on this one. Open question logged below.

### Responsive strategy (chosen)

Mobile-first, matching Homepage SAA convention. Base classes target the narrowest viewport; `md:` / `lg:` / `xl:` progressively add styling as width grows.

| Breakpoint        | Tailwind prefix      | Awards behavior                                                               |
| ----------------- | -------------------- | ----------------------------------------------------------------------------- |
| (base, no prefix) | —                    | < 768 px: stacked rows (image-on-top, content-below); side menu becomes a horizontal scroll strip pinned below the header; CTA `width: 100%` |
| `md:`             | `min-width: 768px`   | 768–1023 px: keep two-column row, retain zig-zag, smaller image (≈ 280²), reduced gutter |
| `lg:`             | `min-width: 1024px`  | 1024–1279 px: same as md, slightly larger image                               |
| `xl:`             | `min-width: 1280px`  | ≥ 1280 px: full Figma-spec values (336² image, 178 px sticky menu, 96 px page padding-y, 144 px gutter) |

The Homepage SAA plan already proved the mobile-first pattern works (cf. its responsive cascade). No deviation here.

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/zFYDgyj_pD-He-thong-giai/
├── spec.md            # Feature specification (reviewed × 4)
├── design-style.md    # Design specifications (reviewed × 4)
├── plan.md            ← this file
├── tasks.md           ← produced by /momorph.tasks
└── assets/
    └── frame.png      # Figma reference
```

### New files

**Route files** (`app/awards/`)

| File                          | Purpose                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------ |
| `app/awards/page.tsx`         | RSC — Awards Information page; reads `role` + `userEmail`; composes header + keyvisual + page-title + side nav + awards list + Kudos promo + footer; exports `metadata` for `<title>` |
| `app/awards/loading.tsx`      | RSC — minimal loading skeleton (header shell + page-title placeholder) shown while RSC streams |
| `app/awards/error.tsx`        | **Client** — Next.js route error boundary; "Something went wrong" + `<button onClick={reset}>` |

**Feature components** (`components/awards/`)

| File                                       | Purpose                                                                                |
| ------------------------------------------ | -------------------------------------------------------------------------------------- |
| `components/awards/awards-keyvisual.tsx`   | RSC — composes `.home-hero-bg` (or new `.awards-hero-bg` — see Open Q2) + cover gradient overlay; `aria-hidden="true"` decorative |
| `components/awards/awards-page-title.tsx`  | RSC — eyebrow ("Sun* Annual Awards 2025") + 1px divider + main title ("Hệ thống giải thưởng SAA 2025") |
| `components/awards/awards-side-nav.tsx`    | **Client** — single component handling **both** desktop and mobile layouts via Tailwind: < md → horizontal scroll strip pinned below the header (height 56); ≥ md → sticky `<aside>` 178 px wide. Scroll-spy via `IntersectionObserver` (rootMargin recomputed per breakpoint via `matchMedia`); click handler smooth-scrolls + updates hash; passes `active` to children. |
| `components/awards/awards-side-nav-item.tsx` | RSC — single nav item; renders icon + label; styled per `active` prop (yellow + border-b + glow) or default (white, no border) |
| `components/awards/awards-list.tsx`        | RSC — maps the `AWARDS` array (`AwardCategory[]`) to 6 `<AwardRow>` instances, computing `direction` from render index |
| `components/awards/award-row.tsx`          | RSC — wraps a single `D.x` row; accepts `direction: 'image-left' \| 'image-right'`; renders `<AwardImage>` + `<AwardContent>` with the right flex order; trailing `<Divider>` between cards |
| `components/awards/award-image.tsx`        | RSC — 336×336 frame with glow shadow + `mix-blend-mode: screen` + 24 px rounded border; renders background `imageUrl` + centered `nameOverlayImage` |
| `components/awards/award-content.tsx`      | RSC — composes the right-column content panel (title + description + dividers + quantity + value) inside a `rounded-2xl backdrop-blur-[32px]` container |
| `components/awards/award-quantity.tsx`     | RSC — "Số lượng giải thưởng:" label + diamond icon + `quantity` + `quantityUnit` (i18n) |
| `components/awards/award-value.tsx`        | RSC — "Giá trị giải thưởng:" label + license icon + value figure(s) + caption "cho mỗi giải thưởng"; handles single value (most awards) and dual value (Signature 2025 - Creator) |
| `components/awards/awards-divider.tsx`     | RSC — 1 px `#2E3940` horizontal rule; used inside the content panel (between blocks) and between adjacent award rows |

**Hooks** (`hooks/`)

| File                          | Purpose                                                                          |
| ----------------------------- | -------------------------------------------------------------------------------- |
| `hooks/use-scroll-spy.ts`     | `useScrollSpy(slugs: readonly string[], { rootMargin?, smooth? }): { activeSlug, setActiveSlug, scrollTo }`; encapsulates `IntersectionObserver` + click-handler + reduced-motion fallback. Independent of awards-specific markup so it can be unit-tested with a stub DOM. |
| `hooks/use-post-auth-redirect.ts` | `usePostAuthRedirect(currentPathname: string): void`; on mount, calls `consumePostAuthRedirect()` and, if the stashed pathname matches `currentPathname` AND a hash is present, scrolls the matching `D.x` row into view. Used by `app/awards/page.tsx` only. |

**Library helpers** (`lib/auth/`)

| File                                | Purpose                                                                          |
| ----------------------------------- | -------------------------------------------------------------------------------- |
| `lib/auth/post-auth-redirect.ts`    | Pure module exporting `stashRedirectTarget(target: string)` and `consumePostAuthRedirect(): string \| null` — both `sessionStorage`-backed under key `saa.postAuthRedirect`. Server-rendered safe (returns `null` when `window` is undefined). |

**Icon components** (`components/icons/`)

| File                                | Purpose                                                                          |
| ----------------------------------- | -------------------------------------------------------------------------------- |
| `components/icons/target-icon.tsx`  | 24×24 SVG target/crosshair icon; used in side-nav items (active = `#FFEA9E`, inactive = `#FFFFFF` via `currentColor`) |
| `components/icons/diamond-icon.tsx` | 24×24 SVG diamond icon; used as the "Số lượng" label affordance                  |
| `components/icons/license-icon.tsx` | 24×24 SVG license/seal icon; used as the "Giá trị" label affordance              |

> All three follow the existing icon-component pattern: a default-exported function that returns an `<svg>` with `width`, `height`, and `aria-hidden="true"` (decorative); colours via `currentColor`. No external SVG files.

**Assets** (`public/assets/awards/`)

| File                                                   | Purpose                                                                              |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `public/assets/awards/overlays/top-talent.png`         | Pre-rendered "TOP TALENT" wordmark overlay (~ 221 × 35 px); centered over award image |
| `public/assets/awards/overlays/top-project.png`        | Pre-rendered "TOP PROJECT" overlay (~ 232 × 35 px)                                   |
| `public/assets/awards/overlays/top-project-leader.png` | Pre-rendered "TOP PROJECT LEADER" overlay (~ 232 × 64 px, two lines)                 |
| `public/assets/awards/overlays/best-manager.png`       | Pre-rendered "BEST MANAGER" overlay                                                  |
| `public/assets/awards/overlays/signature-2025-creator.png` | Pre-rendered "SIGNATURE 2025 - CREATOR" overlay                                  |
| `public/assets/awards/overlays/mvp.png`                | Pre-rendered "MVP" overlay                                                           |

> Award background images (`public/assets/home/awards/{slug}.png`) **already exist** from the Homepage SAA implementation and are reused by the new `<AwardImage>` component via the existing `image` field on `AwardSpec`/`AwardCategory`.

**Tests** (`tests/`)

| File                                                                  | Purpose                                                                                 |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `tests/unit/awards/awards-page-title.test.tsx`                        | Renders eyebrow + divider + main title with correct typography tokens                   |
| `tests/unit/awards/awards-side-nav.test.tsx`                          | Renders 6 items in order; click sets active + updates hash; respects `prefers-reduced-motion` |
| `tests/unit/awards/awards-side-nav-item.test.tsx`                     | Active vs inactive visuals; `aria-current="true"` on active; icon + label render        |
| `tests/unit/awards/awards-list.test.tsx`                              | Renders exactly 6 rows in order; first → image-left, second → image-right alternation; partial list still alternates correctly starting from image-left |
| `tests/unit/awards/award-row.test.tsx`                                | `direction='image-left'` → `flex-row`; `direction='image-right'` → `flex-row-reverse`; children DOM order unchanged |
| `tests/unit/awards/award-image.test.tsx`                              | Background image has `aria-hidden="true"` + `alt=""`; overlay image has `alt={title}`; glow shadow + `mix-blend-mode: screen` applied to wrapper |
| `tests/unit/awards/award-content.test.tsx`                            | Renders title + description + dividers + quantity + value in correct vertical order; `<section aria-labelledby={...}>` wrapping for screen-reader nav |
| `tests/unit/awards/award-quantity.test.tsx`                           | Renders quantity number + unit with i18n; diamond icon present                          |
| `tests/unit/awards/award-value.test.tsx`                              | Single-value award: shows one figure + caption; dual-value (Signature): shows two figures with `cá nhân` / `tập thể` recipients |
| `tests/unit/hooks/use-scroll-spy.test.ts`                             | `IntersectionObserver` mock; visibility transitions update active slug; `scrollTo()` writes correct `history.replaceState` + scroll behavior; `prefers-reduced-motion` forces `behavior: 'auto'` |
| `tests/unit/icons/target-icon.test.tsx`                               | Renders SVG with `aria-hidden="true"` + `currentColor` fill                             |
| `tests/unit/icons/diamond-icon.test.tsx`                              | Same shape contract                                                                     |
| `tests/unit/icons/license-icon.test.tsx`                              | Same shape contract                                                                     |
| `tests/unit/lib/awards-extension.test.ts`                             | `AWARDS` array now exposes the new `AwardCategory` fields for all 6 entries; existing `AwardSpec` shape still satisfied (Homepage `<AwardCard>` regression) |
| `tests/unit/lib/post-auth-redirect.test.ts`                           | `stashRedirectTarget` writes correct sessionStorage key; `consumePostAuthRedirect` reads + deletes; both safe under `typeof window === 'undefined'`; respects same-origin only |
| `tests/unit/hooks/use-post-auth-redirect.test.ts`                     | On mount with matching pathname + hash → scrolls; non-matching → no-op; absent storage → no-op |
| `tests/integration/awards/page.test.tsx`                              | Full RSC render — header active state, keyvisual, page-title, 6 rows in zig-zag, KudosPromo, footer; `isAdmin` drives avatar item; integration with real Supabase test instance for the auth gate |
| `tests/integration/awards/page-empty.test.tsx`                        | Stub `AWARDS = []` → page-title + KudosPromo render; awards list shows empty-state copy; side menu hidden |
| `tests/integration/awards/page-partial.test.tsx`                      | Stub `AWARDS` of length 3 → only 3 rows; first image-left, second image-right, third image-left; side menu lists 3 items |
| `tests/e2e/awards/render.spec.ts`                                     | Login → `/awards` → all 6 rows visible; "Award Information" header item is active; first row has image on the left, second row has image on the right |
| `tests/e2e/awards/scroll-spy.spec.ts`                                 | Click each side-menu item → page scrolls to matching `D.x` row + URL hash updates + active state moves; manual scroll updates active state on cross-threshold |
| `tests/e2e/awards/deep-link.spec.ts`                                  | Direct visit to `/awards#mvp` → page scrolls to D.6 on first paint + C.6 starts active; invalid hash `/awards#nope` → top of page, C.1 active, no error |
| `tests/e2e/awards/kudos-cta.spec.ts`                                  | Click "Chi tiết" → URL becomes `/kudos`                                                 |
| `tests/e2e/awards/auth-redirect.spec.ts`                              | Unauthenticated visit to `/awards` → server-side redirect to `/`; on login success, return to `/awards` (without hash; basic FR-009 path)                |
| `tests/e2e/awards/auth-redirect-hash.spec.ts`                         | Unauthenticated visit to `/awards#mvp` → redirect to `/`; on login success, return to `/awards` with hash restored AND scrolled to D.6 (FR-009 hash-preservation path) |
| `tests/e2e/awards/responsive.spec.ts`                                 | Mobile viewport (375): zig-zag dropped, image-on-top for every row; menu becomes horizontal scroll strip; CTA `width: 100%` |
| `tests/e2e/awards/i18n.spec.ts`                                       | Switch language to EN → all visible strings re-render in English without full page reload; missing-key fallback works |

### Files to modify

| File                                  | Changes                                                                                 |
| ------------------------------------- | --------------------------------------------------------------------------------------- |
| `types/home.ts`                       | Add `AwardCategory extends AwardSpec` interface with: `quantity: number`, `quantityUnit: 'individual' \| 'team' \| 'unit'`, `values: AwardValue[]`, `nameOverlayImage: string`, `descriptionLongKey: string`. Add `AwardValue` type: `{ amountVnd: number; recipientType?: 'individual' \| 'team' \| null; captionKey?: string }`. Existing `AwardSpec` remains unchanged. |
| `lib/awards.ts`                       | Broaden `AWARDS` type from `readonly AwardSpec[]` to `readonly AwardCategory[]`. Populate the new fields for all 6 entries per design-style § "Per-card content reference" table. Add per-card `descriptionLongKey` and `nameOverlayImage` paths. Existing keys stay the same → Homepage `<AwardCard>` reads the subset and continues to work. |
| `components/home/award-card.tsx`      | **Update href**: change `const href = \`/awards-information#${award.slug}\`` (line 13) to `\`/awards#${award.slug}\``. The Homepage was authored before the `/awards` route was locked in. The Homepage spec / Homepage plan both still reference `/awards-information` — flag a follow-up to align them. Existing Homepage tests that assert href values must be updated in lockstep. |
| `app/page.tsx` (Login page)           | Add a one-line client island that calls `stashRedirectTarget(...)` on mount, capturing `document.referrer` if it points at a same-origin protected path (e.g. `/awards#mvp`). Used by Phase 4 hash-preservation flow. Does NOT change any existing Login behavior. |
| `tests/integration/home/page.test.tsx` (existing) | Update the Homepage page integration test (if it asserts award-card href) to reflect the new `/awards#${slug}` target. Same change for any Homepage E2E that clicks award cards. |
| `messages/vi.json`                    | Add `awards.*` namespace: `awards.title`, `awards.subtitle`, `awards.menu.{slug}` (×6), `awards.{slug}.descriptionLong` (×6 — multi-paragraph), `awards.label.quantity`, `awards.label.value`, `awards.label.perAward`, `awards.unit.{individual,team,unit}`, `awards.value.recipient.{individual,team}`, `awards.empty`, `awards.error.title`, `awards.error.retry`. |
| `messages/en.json`                    | Mirror the Vietnamese keys with English translations (flagged pending content team review).                                              |
| `app/globals.css`                     | Add only the new tokens this feature requires: <br>• `--shadow-award-image: 0 4px 4px 0 rgba(0,0,0,0.25), 0 0 6px 0 #FAE287;` <br>• `--text-shadow-active: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287;` <br>• `--backdrop-blur-card: 32px;` <br>• `--spacing-awards-content-w: 480px;` <br>• `--spacing-awards-image-w: 336px;` <br>• `--spacing-awards-row-gap: 80px;` <br>• Optionally: `.awards-hero-bg` class if a different keyvisual asset is provided (see Open Q2). All existing tokens (e.g. `--color-bg-dark`, `--color-cta-bg`, `--color-accent-gold-alt`, `--color-divider`) are reused as-is. |
| `app/layout.tsx`                      | **No change** unless a new font is required (none expected — Montserrat already loaded). |
| `proxy.ts`                            | **No change** — `/awards` is automatically protected (matches the "not `/` and not `/auth/callback`" branch). Verified by inspection. |
| `.env.local` / `.env.example`         | **No change** — no new env vars. (`NEXT_PUBLIC_POST_AUTH_URL` is unaffected — Awards Information is not the post-auth landing.) |
| `next.config.ts`                      | **No change** — no remote-pattern additions (all images stay local).                   |
| `tests/setup.ts`                      | (a) If `IntersectionObserver` is not yet polyfilled in the test env, install a stub (`vi.stubGlobal('IntersectionObserver', class { observe(){} unobserve(){} disconnect(){} })`). Verify before adding — happy-dom may already provide it. (b) Provide an i18n test wrapper helper: a `renderWithIntl(ui, { locale = 'vi' })` utility (in `tests/utils/render-with-intl.tsx`) that mounts the children inside `<NextIntlClientProvider locale={locale} messages={...}>` so `useTranslations()` resolves in unit tests. Required for every `tests/unit/awards/*.test.tsx` that renders a component using `useTranslations()` (i.e. all of them). (c) Stub `sessionStorage` (already provided by happy-dom — no action) but reset it `beforeEach`. |

### Files to delete

None.

### Dependencies to add

**None in runtime.** All required packages are already in `package.json`:

| Package                  | Version             | Already used by Awards Info? |
| ------------------------ | ------------------- | ---------------------------- |
| `next`                   | 16.2.4              | ✅                           |
| `react` / `react-dom`    | 19.2.4              | ✅                           |
| `@supabase/ssr`          | ^0.10.2             | ✅ (auth guard via existing `proxy.ts`) |
| `@supabase/supabase-js`  | ^2.104.0            | ✅                           |
| `next-intl`              | ^4.9.1              | ✅ (i18n catalogue)          |
| `tailwindcss`            | ^4                  | ✅                           |
| `@playwright/test`       | ^1.59.1             | ✅                           |
| `vitest`                 | ^2.1.9              | ✅                           |
| `@testing-library/react` | ^16.3.2             | ✅                           |
| `happy-dom`              | ^20.9.0             | ✅                           |

---

## Component Contracts

### `<AwardsSideNav>` (Client) — `components/awards/awards-side-nav.tsx`

```ts
'use client'

import type { AwardCategory } from '@/types/home'

export interface AwardsSideNavProps {
  /** Awards in render order; the n-th item drives both the menu and the matching D.n row. */
  awards: readonly AwardCategory[]
}

export default function AwardsSideNav({ awards }: AwardsSideNavProps): JSX.Element
```

**Behavior**
- Renders a sticky `<aside>` (`sticky top-[112px]`) containing `<AwardsSideNavItem>` × N.
- On mount: installs `IntersectionObserver` on `<section[data-award-slug]>` elements; updates `activeSlug` on cross-threshold.
- Click handler on each item: `e.preventDefault()`, smooth-scroll to target, `history.replaceState(null, '', '#slug)`, set `activeSlug`.
- On first paint with a URL hash: looks up the matching slug, scrolls to it, and sets `activeSlug` (deep-link support).
- Falls back gracefully under `prefers-reduced-motion: reduce` (instant scroll) and when `IntersectionObserver` is unavailable (no auto-active-on-scroll).

### `<AwardsSideNavItem>` (RSC) — `components/awards/awards-side-nav-item.tsx`

```ts
import type { AwardCategory } from '@/types/home'

export interface AwardsSideNavItemProps {
  award: AwardCategory
  active: boolean
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export default function AwardsSideNavItem({ award, active, onClick }: AwardsSideNavItemProps): JSX.Element
```

**Behavior**
- Renders an `<a href="#${award.slug}">` containing `<TargetIcon>` + label (`{t(award.titleKey)}`).
- Active state applies: `text-[var(--color-cta-bg)]`, `border-b border-[var(--color-cta-bg)]`, `[text-shadow:var(--text-shadow-active)]`, `aria-current="true"`.
- Inactive state: `text-white`, no border, no glow, no `aria-current`.

### `<AwardsList>` (RSC) — `components/awards/awards-list.tsx`

```ts
import type { AwardCategory } from '@/types/home'

export interface AwardsListProps {
  awards: readonly AwardCategory[]
}

export default function AwardsList({ awards }: AwardsListProps): JSX.Element
```

**Behavior**
- Maps each award to `<AwardRow>` with `direction = idx % 2 === 0 ? 'image-left' : 'image-right'`.
- Renders `<AwardsDivider>` between adjacent rows (not after the last).
- If `awards.length === 0`, renders an empty-state message (`{t('awards.empty')}`).

### `<AwardRow>` (RSC) — `components/awards/award-row.tsx`

```ts
import type { AwardCategory } from '@/types/home'

export interface AwardRowProps {
  award: AwardCategory
  direction: 'image-left' | 'image-right'
}

export default function AwardRow({ award, direction }: AwardRowProps): JSX.Element
```

**Behavior**
- Wraps content in `<section id={award.slug} data-award-slug={award.slug} aria-labelledby={`${award.slug}-title`}>` so the side-nav scroll-spy and screen-reader navigation both work.
- `direction='image-left'` → `flex flex-col xl:flex-row gap-10 items-start`.
- `direction='image-right'` → `flex flex-col xl:flex-row-reverse gap-10 items-start`.
- On viewports < `xl:` (< 1280 px) the row collapses to `flex-col` (image always on top — zig-zag dropped), per spec § Responsive.

### `<AwardImage>` (RSC) — `components/awards/award-image.tsx`

```ts
import type { AwardCategory } from '@/types/home'

export interface AwardImageProps {
  award: AwardCategory
}

export default function AwardImage({ award }: AwardImageProps): JSX.Element
```

**Behavior**
- 336 × 336 wrapper with `box-shadow: var(--shadow-award-image)`, `mix-blend-mode: screen`, `border: 1px solid var(--color-cta-bg)`, `border-radius: 24px`, `overflow: hidden`.
- Background `<Image src={award.image} alt="" aria-hidden="true" fill>`.
- Overlay `<Image src={award.nameOverlayImage} alt={t(award.titleKey)}>` absolutely positioned + centered.
- Below the fold → `loading="lazy"`; above the fold (first 1–2 rows) → `priority` is conditional on `isAboveFold` prop default `false`.

### `<AwardContent>` (RSC) — `components/awards/award-content.tsx`

```ts
import type { AwardCategory } from '@/types/home'

export interface AwardContentProps {
  award: AwardCategory
}

export default function AwardContent({ award }: AwardContentProps): JSX.Element
```

**Behavior**
- Renders an `<article class="rounded-2xl backdrop-blur-[32px] flex flex-col gap-8 w-full xl:w-[480px]">`.
- Children top → bottom: `<h2 id={`${award.slug}-title`}>` + description (i18n rich text) → `<AwardsDivider>` → `<AwardQuantity>` → `<AwardsDivider>` → `<AwardValue>`.

### `useScrollSpy` (hook) — `hooks/use-scroll-spy.ts`

```ts
export interface UseScrollSpyOptions {
  /** IntersectionObserver rootMargin; default: '-112px 0px -50% 0px' */
  rootMargin?: string
  /** If false, click-scroll uses `behavior: 'auto'`. Default: respect `prefers-reduced-motion` */
  smooth?: boolean
}

export interface UseScrollSpyReturn {
  activeSlug: string | null
  setActiveSlug: (slug: string) => void
  scrollTo: (slug: string, options?: { updateHash?: boolean }) => void
}

export function useScrollSpy(slugs: readonly string[], options?: UseScrollSpyOptions): UseScrollSpyReturn
```

---

## Data Model

### Extended `AwardCategory` (replaces / extends `AwardSpec` consumers)

```ts
// types/home.ts (additive)

export interface AwardValue {
  amountVnd: number
  recipientType?: 'individual' | 'team' | null
  captionKey?: string  // i18n key, e.g. 'awards.label.perAward'
}

export interface AwardCategory extends AwardSpec {
  /** Long-form description i18n key (multi-paragraph, justified). */
  descriptionLongKey: string
  /** Path to the pre-rendered name-overlay raster. NOT i18n-bound. */
  nameOverlayImage: string
  /** Number of awards in this category. Display-only. */
  quantity: number
  /** Recipient unit type — drives the UI suffix and i18n. */
  quantityUnit: 'individual' | 'team' | 'unit'
  /** One or two prize values. Two-entry array only for Signature 2025 - Creator. */
  values: readonly AwardValue[]
}
```

### Sample row (D.1 Top Talent)

```ts
// lib/awards.ts (extended)
{
  id: 'top-talent',
  titleKey: 'home.awards.top-talent.title',
  descriptionKey: 'home.awards.top-talent.description',
  descriptionLongKey: 'awards.top-talent.descriptionLong',
  image: '/assets/home/awards/top-talent.png',
  nameOverlayImage: '/assets/awards/overlays/top-talent.png',
  slug: 'top-talent',
  quantity: 10,
  quantityUnit: 'unit',
  values: [{ amountVnd: 7_000_000, captionKey: 'awards.label.perAward' }],
} satisfies AwardCategory
```

### Sample row (D.5 Signature 2025 - dual value)

```ts
{
  id: 'signature-2025-creator',
  titleKey: 'home.awards.signature-2025-creator.title',
  descriptionKey: 'home.awards.signature-2025-creator.description',
  descriptionLongKey: 'awards.signature-2025-creator.descriptionLong',
  image: '/assets/home/awards/signature-2025-creator.png',
  nameOverlayImage: '/assets/awards/overlays/signature-2025-creator.png',
  slug: 'signature-2025-creator',
  quantity: 1,
  quantityUnit: 'unit',
  values: [
    { amountVnd: 5_000_000, recipientType: 'individual' },
    { amountVnd: 8_000_000, recipientType: 'team' },
  ],
}
```

---

## Implementation Strategy

### Phase 0: Asset Preparation

1. **Download award name-overlay rasters** — design team to provide 6 PNGs at `public/assets/awards/overlays/{slug}.png` matching the per-card sizes captured in design-style § 3a. Use MoMorph `get_media_files` if assets are uploaded there; otherwise file an asset-request ticket.
2. **Confirm keyvisual asset** — decide whether `/awards` reuses the Homepage's `home-hero-bg` (`public/assets/home/hero-bg.jpg`) or needs its own `awards-hero-bg`. See Open Q2.
3. Award background images already exist at `public/assets/home/awards/{slug}.png` (from Homepage SAA) — no work needed.

### Phase 1: Foundation (test-first, per Constitution §III)

1. **Tests first**: write the unit tests for `useScrollSpy`, `AwardCategory` type, the 3 new icons, and each new component (skeleton tests asserting structure / aria roles / props). All should fail.
2. **Add `AwardCategory` + `AwardValue` types** in `types/home.ts`.
3. **Extend `lib/awards.ts`** with the new fields for all 6 entries (data lifted from design-style § "Per-card content reference" table).
4. **Add new CSS tokens** to `app/globals.css` (`--shadow-award-image`, `--text-shadow-active`, `--backdrop-blur-card`, spacing tokens).
5. **Author the 3 new icon components** (`<TargetIcon>`, `<DiamondIcon>`, `<LicenseIcon>`).
6. **Author `useScrollSpy`** hook against the unit tests.
7. **Add `awards.*` i18n keys** to `messages/{vi,en}.json`. Vietnamese is canonical; English is initial draft (flag for content review).

**Deliverable**: tests written + foundation green; no UI yet.

### Phase 2: User Story 1 (P1) — Authenticated user reads the full award catalogue

1. **Tests first**: integration test asserting the page renders all 6 rows in order with title + description + quantity + value (`tests/integration/awards/page.test.tsx`); unit tests for each new component.
2. Author `<AwardsPageTitle>`, `<AwardImage>`, `<AwardQuantity>`, `<AwardValue>`, `<AwardContent>`, `<AwardRow>`, `<AwardsList>`, `<AwardsDivider>`, `<AwardsKeyvisual>`.
3. Author `app/awards/page.tsx`, `loading.tsx`, `error.tsx`. Compose existing `<Header navSlot={<HeaderNav />} rightSlot={<HeaderControls/>}>`, the new awards components, the existing `<KudosPromo>`, and the existing `<Footer navSlot={<FooterNav/>}>`.
4. Verify the page renders end-to-end against Phase-1 unit + Phase-2 integration tests (all green).

**Deliverable**: `/awards` returns a fully-rendered, accessible page with all 6 awards in zig-zag — but no scroll-spy or anchor-jump yet.

### Phase 3: User Story 2 (P1) — Anchor jump + scroll spy

1. **Tests first**: `tests/unit/hooks/use-scroll-spy.test.ts` (already authored in Phase 1 — confirm green); `tests/e2e/awards/scroll-spy.spec.ts` and `tests/e2e/awards/deep-link.spec.ts`.
2. Author `<AwardsSideNav>` (Client) and `<AwardsSideNavItem>` (RSC). Wire into `<AwardRow>` IDs (`id={award.slug}` already in Phase 2).
3. Connect `useScrollSpy` inside `<AwardsSideNav>`. Implement click handler + first-paint hash handling.
4. Manually verify smooth scroll, hash updates, scroll-spy active state, and deep-link from `/awards#mvp` against the E2E suite.

**Deliverable**: side-nav fully interactive; matches all four acceptance scenarios in spec § US2.

### Phase 4: User Story 5 (P1) — Unauthenticated visitor is redirected to Login

1. **Tests first**: `tests/e2e/awards/auth-redirect.spec.ts` (basic redirect + post-auth landing) and `tests/e2e/awards/auth-redirect-hash.spec.ts` (deep-link hash preservation across login).
2. **Basic redirect — no code change required**: `proxy.ts:28` already redirects unauth users for any non-`/`, non-`/auth/callback` path. Server-side redirect to `/` is automatic.
3. **Hash preservation across the login round-trip (FR-009 — MANDATORY)**: URL fragments (`#mvp`) are not sent to the server, so `proxy.ts` cannot capture them. Implement client-side:
   - Add `lib/auth/post-auth-redirect.ts` — exports `stashRedirectTarget(): void` (called from a `'use client'` hook on the Login page that runs once on mount; reads `window.location.pathname + window.location.hash` and writes it to `sessionStorage` under key `saa.postAuthRedirect`) and `consumePostAuthRedirect(): string | null` (called on the post-auth landing page; reads + deletes the value).
   - Wire into existing Login page: a single new client island at the top of `app/page.tsx` calling `stashRedirectTarget()` once, BEFORE the user clicks Google sign-in. (`pathname` will be `/` so only the hash matters; the redirect target is the previously-attempted protected URL, captured from `document.referrer` if it points back to the same origin and a protected path.)
   - Wire into `app/awards/page.tsx`: a small client island at top-of-page reads `consumePostAuthRedirect()` once on mount; if the result matches the current pathname AND has a hash, calls `useScrollSpy.scrollTo(slug)` to jump to that anchor.
4. Verify acceptance scenarios per spec § US5: (a) basic redirect, (b) expired session → 401 → client redirect, (c) login from `/awards#<hash>` → returns to `/awards` with the hash restored.

**Deliverable**: both E2E specs green; FR-009 fully satisfied including hash preservation.

### Phase 5: User Story 3 (P2) — "Chi tiết" CTA → Sun* Kudos

1. **Tests first**: `tests/e2e/awards/kudos-cta.spec.ts`.
2. Reuse `<KudosPromo>` directly in `app/awards/page.tsx`. The component already navigates to the configured Kudos route — confirm it points at `/kudos` (the locked decision from `momorph.reviewspecify`); if it currently points elsewhere, update its `<KudosCtaButton>` href.

**Deliverable**: clicking "Chi tiết" routes to `/kudos`; visuals match Homepage's existing implementation.

### Phase 6: User Story 4 (P2) — i18n

1. **Tests first**: `tests/e2e/awards/i18n.spec.ts`.
2. All visible strings already use `useTranslations` from Phase 1–5 — no code change beyond verifying every static string flows through `messages/{vi,en}.json`.
3. Confirm fallback behavior: if a key is missing in EN, render the VN copy + emit a console warning in non-prod (per spec acceptance scenario 3).

**Deliverable**: switching VN ↔ EN updates every string without a full reload.

### Phase 7: User Story 6 (P3) — Responsive on mobile and tablet

1. **Tests first**: `tests/e2e/awards/responsive.spec.ts` at 375 × 720 and 768 × 1024 viewports.
2. Apply mobile-first Tailwind classes per the responsive table in design-style § Responsive. Drop zig-zag at `< xl` (always image-on-top + content-below).
3. Convert sticky side-nav to a horizontal scroll strip below the header at `< md`.
4. Ensure the CTA fills available width at `< md`.
5. Recompute `IntersectionObserver` `rootMargin` per viewport — the `-112px` top offset matches `80 px header + 32 px gap` on desktop; on mobile the side strip is sticky-top (height 56), so the offset shrinks. **Concrete approach** (NOT a CSS-variable trick — `IntersectionObserver` reads its `rootMargin` once at construction): inside `useScrollSpy`, evaluate `window.matchMedia('(max-width: 767px)').matches` to pick `'-56px 0px -50% 0px'` (mobile) vs `'-112px 0px -50% 0px'` (≥ md), and listen on `mql.addEventListener('change', …)` to **rebuild** the observer when the viewport crosses the breakpoint. Tested in `tests/unit/hooks/use-scroll-spy.test.ts`.

**Deliverable**: all responsive E2E tests green at 375 / 768 / 1280.

### Phase 8: Polish

1. Final accessibility pass with `axe` (per TR-007); confirm tab-order matches design (header → side-nav → first award → … → "Chi tiết" → footer).
2. Lighthouse mobile run — ensure ≥ 90 Performance and ≥ 95 Accessibility (SC-003).
3. Verify all error/loading boundaries render correctly under simulated failures.
4. PR review + manual cross-browser test on Chrome / Safari / Firefox latest.

**Deliverable**: feature ready for staging deploy; all spec success criteria measurably testable.

### Risk Assessment

| Risk                                                           | Probability | Impact | Mitigation                                                                                              |
| -------------------------------------------------------------- | ----------- | ------ | ------------------------------------------------------------------------------------------------------- |
| Award name-overlay rasters not delivered in time               | Medium      | High   | Build with placeholder PNGs sized to the spec dimensions; gate the merge on real assets via PR checklist. Use `<Image>` `placeholder="blur"` to avoid visual regressions if assets land late. |
| `IntersectionObserver` behavior diverges in older Safari       | Low         | Medium | Polyfill via existing CDN if needed, or fall back to "click sets active, no auto-update on scroll" — graceful degradation already designed into `useScrollSpy`. |
| Sun* Kudos route changes from `/kudos` after design review     | Low         | Low    | The route is referenced in exactly one place (`<KudosCtaButton>` href) — single-line change.            |
| Homepage `<KudosPromo>` evolves and breaks Awards Information  | Medium      | Medium | Add a regression integration test (`tests/integration/awards/page.test.tsx`) that asserts the Awards page renders the same `<KudosPromo>` structure. If a future Homepage-only divergence is needed, promote the component to `components/ui/` then.                                                                |
| Deep scroll page (~6 400 px) hurts Lighthouse Performance       | Medium      | Medium | Lazy-load all but the first 1–2 award images; preload only the first overlay. Tested in Phase 8.       |
| `mix-blend-mode: screen` looks wrong on a small set of browsers | Very Low    | Low    | Provide a fallback `background-color: var(--color-bg-dark-alt)` on the wrapper so the image still renders legibly even without blend mode support. |

### Estimated Complexity

- **Frontend**: Medium — heavy reuse, but the scroll-spy hook + alternating-row layout add real complexity worth getting right.
- **Backend**: None (in v1).
- **Testing**: Medium-High — 7 E2E specs (responsive, scroll-spy, deep-link, auth, CTA, i18n, render) plus extensive unit + integration coverage.

---

## Integration Testing Strategy

### Test Scope

- [x] **Component / Module interactions** — `<AwardsSideNav>` ↔ `<AwardRow>` (scroll-spy via DOM IDs); `<AwardsList>` ↔ `lib/awards.ts` (data binding); `<AwardImage>` ↔ `next/image` (lazy + priority logic).
- [x] **External dependencies** — Supabase auth (route guard + `getUser()` in RSC); `next-intl` (i18n catalogue lookup, missing-key fallback).
- [x] **Data layer** — None (in v1; static array). Revisit when `/api/awards` is wired in.
- [x] **User workflows** — Login → Awards Information render; Awards Information ← deep-link from Homepage award card; Awards Information → Sun* Kudos.

### Test Categories

| Category               | Applicable? | Key Scenarios                                                                              |
| ---------------------- | ----------- | ------------------------------------------------------------------------------------------ |
| UI ↔ Logic             | Yes         | Click side-nav item → smooth-scroll + hash update; manual scroll → side-nav active follows |
| Service ↔ Service      | Yes         | Supabase Auth ↔ `proxy.ts` ↔ `app/awards/page.tsx` (auth guard + role lookup)              |
| App ↔ External API     | No          | No new API in v1                                                                           |
| App ↔ Data Layer       | Limited     | RSC reads static `AWARDS` array — covered by integration tests asserting render output     |
| Cross-platform         | Yes         | Mobile (375), Tablet (768), Desktop (1280, 1440) — Playwright project per breakpoint       |

### Test Environment

- **Environment type** — Local (Vitest unit + integration), Playwright with `next dev` server (E2E). CI runs Playwright on a headless Chromium / WebKit / Firefox matrix.
- **Test data strategy** — Real `lib/awards.ts` for happy-path; per-test stubs (via `vi.mock('@/lib/awards', () => ...)`) for empty / partial / single-value variations.
- **Isolation approach** — Fresh state per test (`afterEach(() => vi.restoreAllMocks())`); Playwright tests use `test.use({ storageState: 'tests/auth.json' })` to authenticate via a pre-saved session (existing pattern).

### Mocking Strategy

| Dependency Type       | Strategy   | Rationale                                                                            |
| --------------------- | ---------- | ------------------------------------------------------------------------------------ |
| Supabase Auth         | Real (test instance) | Constitution Principle III: integration tests MUST hit a real Supabase instance |
| `next-intl`           | Real (`messages/*.json`) | Mocking would mask missing-key bugs                                                |
| `IntersectionObserver` | Stub (jsdom/happy-dom may not implement it)  | Verified standalone via `tests/unit/hooks/use-scroll-spy.test.ts`; behavior-tested via Playwright in real browser |
| `lib/awards.ts`       | Real for integration; selectively stubbed for empty / partial scenarios | Real data is the contract; stubs prove edge-case branches |

### Test Scenarios Outline

1. **Happy Path**
   - [ ] Authenticated user lands on `/awards` and sees all 6 awards in zig-zag order.
   - [ ] Side-nav shows "Top Talent" active by default; menu clicks scroll the page.
   - [ ] "Chi tiết" navigates to `/kudos`.

2. **Error Handling**
   - [ ] Unauthenticated visit redirects to `/`.
   - [ ] Awards data empty → page-title + Kudos block render; awards list shows empty-state.
   - [ ] Awards data partial (e.g. 3 entries) → 3 rows render, zig-zag preserved from index 0.
   - [ ] `/awards#unknown` → page top, first item active, no console errors.

3. **Edge Cases**
   - [ ] Mobile viewport drops zig-zag and stacks every row image-on-top.
   - [ ] `prefers-reduced-motion: reduce` switches scroll behavior to instant.
   - [ ] Deep-link `/awards#mvp` from Homepage award card → row in viewport on first paint.
   - [ ] Switching VN ↔ EN re-renders all visible strings without full reload.

### Tooling & Framework

- **Test framework** — Vitest 2.1.9 (`unit`, `integration`); Playwright 1.59.1 (E2E).
- **Supporting tools** — `@testing-library/react` 16.3.2 + `happy-dom` 20.9.0 for DOM-mode unit tests; Supabase local instance via `npx supabase start` for integration.
- **CI integration** — `npm test` runs unit + integration; `npm run test:e2e` runs Playwright. Both gated on `tsc --noEmit` + `eslint` + `npm audit` per constitution Development Workflow.

### Coverage Goals

| Area                                        | Target  | Priority |
| ------------------------------------------- | ------- | -------- |
| `useScrollSpy` hook                         | ≥ 95 %  | High     |
| `<AwardsList>` zig-zag logic                | 100 %   | High     |
| `<AwardImage>` accessibility wiring         | 100 %   | High     |
| `<AwardValue>` single + dual variants       | 100 %   | High     |
| `<AwardContent>` rendering order            | ≥ 90 %  | High     |
| `useScrollSpy` reduced-motion fallback      | ≥ 80 %  | Medium   |
| Error / empty / partial branches            | 100 %   | High     |
| Responsive E2E at 3 breakpoints             | Each pass | High   |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `.momorph/constitution.md` reviewed and understood
- [x] `spec.md` approved (4 review passes complete)
- [x] `design-style.md` approved (4 review passes complete)
- [x] `SCREENFLOW.md` updated and consistent (Awards Information promoted to discovered; `/kudos` route reserved)
- [x] Existing Homepage SAA shared chrome (header, footer, kudos block, etc.) is in production
- [ ] Award name-overlay raster assets delivered by design team (6 PNGs)
- [ ] Optional: dedicated `awards-hero-bg.jpg` if different from Homepage hero (resolves Open Q2)
- [ ] Vietnamese long-form description copy approved by stakeholders (resolves Open Q4)

### External Dependencies

- Sun* design team for the 6 award name-overlay PNGs.
- Sun* content team for English translations of the long-form descriptions.
- Sun* design system (potentially) for official hover/active/focus token values that can replace the locked-in defaults from `momorph.reviewspecify`.

---

## Open Questions

> Each item is **non-blocking** — the plan ships with a documented default. Track resolution as follow-up tickets.

- **Q1 — Authenticated layout group**: should we refactor `app/about-saa-2025` + `app/awards` into `app/(authenticated)/[…]/page.tsx` with a shared `(authenticated)/layout.tsx` housing the header + footer? Default decision: **defer until we have a 3rd authenticated screen** (Sun* Kudos / Profile / Admin Dashboard). Track as a migration PR ticket.
- **Q2 — Keyvisual asset**: does the Awards Information page reuse the Homepage `home-hero-bg`, or does design provide a separate `awards-hero-bg`? Default decision: **reuse `home-hero-bg`**. Override locally if design publishes a separate asset.
- **Q3 — `<KudosPromo>` and `<HomepageMobileNav>` location**: keep under `components/home/` (current) or promote to `components/ui/`? Default decision: **keep under `components/home/`** for now; promote in a single chore PR when the 3rd authenticated screen lands (along with the layout-group refactor in Q1).
- **Q4 — Long-form description copy**: each card needs a multi-paragraph justified description (per the Figma frame). The Homepage's existing `home.awards.{slug}.description` is short (2-line clamp). Default decision: **add new `awards.{slug}.descriptionLong` keys** initialised with the Figma copy; flag for content team review before merge.
- ~~**Q5 — Hash preservation across login redirect**~~ — **resolved**: implemented client-side in Phase 4 via `lib/auth/post-auth-redirect.ts` (stash on Login mount, consume on Awards mount, `sessionStorage` key `saa.postAuthRedirect`). Required by spec FR-009 (mandatory).
- **Q6 — Future `/api/awards` endpoint**: when does the static `lib/awards.ts` array migrate to a live Supabase table? Default decision: **deferred** until the Admin Dashboard PR. The data model already accommodates the migration (the existing static array is shaped exactly like the future API response).

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate the task breakdown from this plan.
2. **Review** `tasks.md` for parallelisation opportunities (Phase 1 foundation tasks are largely independent; Phase 2 depends on Phase 1).
3. **Begin** implementation following task order, TDD per Constitution Principle III, with Phase 1 as the first PR (foundation only) to keep diffs reviewable.

---

## Notes

- This plan is **reuse-maximising by design**. The Homepage SAA implementation already established the entire authenticated-page pattern; Awards Information slots into the same shape with a new route, a new data extension, ~9 new components, and one new hook. Total new TypeScript LOC estimate: ~1 200–1 500 (excluding tests).
- The `lib/awards.ts` extension is the single most important piece of cross-feature contract — making the Homepage `<AwardCard>` and the Awards page `<AwardRow>` share one source of truth means anchor slugs, image paths, and titles can never drift between the two pages.
- Constitution compliance was verified item-by-item against Principles I–V before this plan was written; no exceptions or violations are planned. The "Violations" table is intentionally empty.
- The `momorph.reviewspecify` × 4 cycle has already pushed every design / scope decision down to either "data-driven from Figma" or "locked-in default with rationale". Implementation can proceed without further design clarification.
