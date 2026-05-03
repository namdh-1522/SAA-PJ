# Implementation Plan: Homepage SAA (About SAA 2025)

**Frame**: `i87tDx10uM-Homepage-SAA`
**Date**: 2026-04-22
**Spec**: `.momorph/specs/i87tDx10uM-Homepage-SAA/spec.md`
**Design-style**: `.momorph/specs/i87tDx10uM-Homepage-SAA/design-style.md`

---

## Summary

Implement the authenticated landing page at `/about-saa-2025` (Next.js App Router, RSC-first) that introduces SAA 2025 with: a "ROOT FURTHER" hero + live countdown (60-second tick, SSR-hydrated) + event info + two shared-component CTAs, a long-form campaign narrative (B4), a 3×2 grid of six award cards deep-linking into `/awards-information#<slug>`, a Sun\* Kudos promo block, a floating quick-action widget button, and a global nav (header + footer) with language, notification, and avatar menus. The page **reuses** the Supabase SSR stack, `proxy.ts` auth guard, `<LanguageSelector>` Client pattern, and CSS token system already in place from the Login screen. It **extends** the existing `<Header>` and `<Footer>` with nav/controls rather than duplicating them. No new backend or DB schema is required in v1; unread-count + user-role are stubs or read from the existing Supabase JWT.

---

## Technical Context

**Language/Framework**: TypeScript 5 (strict) / Next.js 16.2.4 App Router
**Primary Dependencies**: React 19.2.4, Tailwind CSS v4, `@supabase/ssr`, `@supabase/supabase-js`, `next-intl` (all already installed from Login)
**Database**: Supabase (Auth only for v1; no new tables written by this screen)
**Testing**: Vitest 2.1.9 + `happy-dom` (unit + integration), Playwright 1.59 (E2E) — all installed
**State Management**: RSC server props (user role, event start) + local `useState` in Client islands (Countdown, AvatarMenu, NotificationButton, WidgetButton). **No React Query / Zustand / Redux.**
**API Style**: Next.js route handlers where needed (notification count may be stubbed in-component); Supabase SSR for auth/session

---

## Constitution Compliance Check

*GATE: Must pass before implementation begins.*

- [x] **§I Clean Code** — kebab-case non-component files; PascalCase components; 2-space indent; 100-char lines; single-direction import flow (page → components → lib/hooks); no circular deps.
- [x] **§II Stack Best Practices** — RSC by default; `<Countdown>`, `<HeaderNav>`, `<AvatarMenu>`, `<NotificationButton>`, `<WidgetButton>`, `<KudosCtaButton>` are the **only** Client Components justified by state/interaction needs. All colors/spacing declared as CSS variables in `app/globals.css` per §II design-token rule. TypeScript strict mode — no `any` without an inline justification comment.
- [x] **§III TDD** — every new component + lib function gets a failing test first (per TR-004 matrix in spec.md). Integration tests hit a real Supabase local instance — no DB mocks.
- [x] **§IV Platform UI & Navigation** — tab-order matches spec.md §Accessibility; all interactive targets ≥48px; navigation destinations derived from `.momorph/SCREENFLOW.md` only (no hard-coded or guessed URLs).
- [x] **§V Security** — no new secrets; `NEXT_PUBLIC_SAA_EVENT_START` is a safe public value; Supabase SSR session remains in HttpOnly cookies; no `localStorage` / `sessionStorage` reads.

**Violations (planned):**

| Violation | Justification | Alternative Rejected |
|-----------|---------------|----------------------|
| ~~`Digital Numbers` is a non-licensed external font~~ **RESOLVED** — swapped to **DSEG7-Classic Bold** (SIL OFL — open-source 7-segment LCD font) | Design called for `Digital Numbers` (Style-7 proprietary). DSEG7 is the visually-equivalent OFL-licensed alternative. | A web-safe monospace (e.g. `Menlo`) — visually off-spec; pure web font (Google) — none match 7-segment LCD aesthetic |
| Render `KUDOS` logomark from a bundled asset (SVN-Gotham not loaded) | SVN-Gotham is not a licensed web font; loading it would break §II and add bundle weight | Reconstruct "KUDOS" live with a similar web font — rejected: the asset is part of the Sun\* brand lockup |

Both violations are contained to `public/assets/home/` (static artefacts) — no new JS dependencies added.

---

## Architecture Decisions

### Frontend Approach

- **Component Structure** — feature-based. Page-specific components live under `components/home/`; shared UI (header + footer extensions) stay in `components/ui/`. All icons remain in `components/icons/`.
- **Hero BG placement** — the keyvisual BG div MUST be a **page-level absolute element**, NOT scoped inside `<HeroSection>`. See design-style.md §B for the full architecture rule. Implementation:
  ```tsx
  // app/about-saa-2025/page.tsx — rendered at the page root, outside <HeroSection>
  <div className="absolute inset-x-0 top-0 h-[1100px] z-[var(--z-hero-bg)] home-hero-bg pointer-events-none" />
  ```
  Placing the BG inside `<HeroSection>` and setting `min-h-[1100px]` creates a ~500px empty gap between the CTAs and the narrative body. The page-level absolute element shows the artwork in the top 1100px while section content flows naturally with the 120px gap.
- **RSC / Client split** — The page, layout, section wrappers, and static-text blocks are RSC. Only these islands are `'use client'`:
  - `<Countdown>` — `useState`, `useEffect(setInterval)` for 60s tick
  - `<HeaderNav>` — needs `usePathname()` for active-link state
  - `<AvatarMenu>` — open/close state + click-outside + Escape handling
  - `<NotificationButton>` — fetch-on-mount + open/close state
  - `<WidgetButton>` — open/close state (menu contents TBD, stubbed)
  - `<KudosCtaButton>` + `<HeroCtaButton>` — NOT client-only; navigation via `next/link` is RSC-compatible. Pure components, no state.
  - `<LanguageSelector>` — already Client (reused from Login)
- **Styling** — Tailwind v4 utilities + CSS tokens in `app/globals.css`. Two shared CSS classes: `.hero-bg` (generalised from Login's `.login-hero-bg`) and new `.home-hero-bg`. No CSS-in-JS, no inline raw hex.
- **Data Fetching** — RSC reads Supabase session via `createServerClient` (reuse `lib/supabase/server.ts`) and event-start ISO from env. Unread count fetched client-side in `<NotificationButton>` via native `fetch` (no React Query in v1 — single endpoint, no cache sharing).
- **Font loading** — `DSEG7-Classic Bold` (open-source 7-segment LCD substitute for the proprietary Figma `Digital Numbers`) via `next/font/local` pointing to `/public/fonts/DSEG7Classic-Bold.woff2`. Exposed as CSS var `--font-digital`. Ultimate fallback (font fails to download): `'Consolas', 'Menlo', 'Courier New', monospace`.
- **Image optimisation** — all raster images go through `next/image`:
  - Hero BG — CSS `background-image` + `priority` preconnect in `<head>`. NOT `<Image>` because the design uses CSS positioning for the gradient overlay stacking.
  - Award thumbnails — `<Image>` with `sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 336px"` and `quality={90}` (preserves gold-glow detail). `priority` is NOT set (below the fold).
  - Kudos bg — CSS `background-image` on the block; no `<Image>`.
  - Kudos logomark — `<Image>` at fixed 364×72 with `priority={false}`.
- **Error resilience** — three layers:
  1. `app/about-saa-2025/error.tsx` — Next.js route error boundary catches RSC rendering / server-component errors; reset button triggers a re-render.
  2. `<Countdown>` wraps its state-tick `useEffect` in a try/catch; any failure collapses tiles to `--` instead of throwing to the boundary.
  3. `<NotificationButton>` swallows fetch errors silently (spec edge case).
- **Loading states** — `app/about-saa-2025/loading.tsx` renders a minimal header shell + hero-dimension placeholder. Prevents blank-flash on slow RSC streams. No client-side skeleton is needed for child content because the page is otherwise fully SSR'd.
- **Metadata** — `app/about-saa-2025/page.tsx` exports `const metadata: Metadata = { title: 'About SAA 2025 — Sun* Annual Awards', description: 'Root Further — Sun* Annual Awards 2025' }` for the `<title>` tag. Authenticated page, so no Open Graph / Twitter cards needed in v1.

### Backend Approach

- **No new DB tables** in v1. The page is read-only w.r.t. user data (just session + optional unread count).
- **Optional new route handler** — `app/api/notifications/unread-count/route.ts` returning `{ count: 0 }` as a stub (gated behind `if (process.env.NODE_ENV !== 'production')` fallback) so the bell component is testable end-to-end. Real implementation will replace this later.
- **User role** — read directly from Supabase JWT `app_metadata.role` via a new helper `lib/auth/get-user-role.ts` — no dedicated API endpoint. Preferred per spec FR-009 note.

### Integration Points

- **Reuse from Login**
  - `lib/supabase/{client,server,middleware}.ts` — unchanged
  - `proxy.ts` — unchanged; already redirects unauth users away from `/about-saa-2025`
  - `i18n/request.ts` + `resolveLocale()` — unchanged; just add `home.*` keys to `messages/{vi,en}.json`
  - `components/login/language-selector.tsx` — **promote** to `components/ui/language-selector.tsx` (rename path; it is no longer Login-specific). Update its one import site in `app/page.tsx`.
  - `components/icons/{google,chevron-down,vn-flag}-icon.tsx` — unchanged
  - Tailwind CSS token system in `app/globals.css` — extended, not replaced
- **Extend from Login**
  - `components/ui/header.tsx` — currently `{ children }` slot. Refactor into 3 slots: `leftSlot` (logo — default provided), `navSlot` (nav links), `rightSlot` (controls). Keep the Login call-site working (uses only `rightSlot` with `<LanguageSelector>`).
  - `components/ui/footer.tsx` — currently copyright-only. Refactor to accept a `navSlot` and add logo on the left. Keep the Login call-site backwards-compatible by passing `navSlot={null}` on Login (footer there has no nav links).
- **New auth helper** — `lib/auth/get-user-role.ts` returns `'user' | 'admin'` from `createServerClient` session's `app_metadata.role`.

### Route-group structure (chosen)

Use a flat route directory `app/about-saa-2025/page.tsx` — **NOT** a `app/(authenticated)/` route group in v1. Rationale:

- Only two authenticated screens exist so far (Homepage + Login is unauth). Introducing a route group for two screens is premature abstraction per Constitution §I.
- `<Header>` and `<Footer>` composition happens at the page level (they accept slots), not at a shared layout — this keeps each page's header/footer explicit and searchable.
- When a 3rd authenticated screen is added (Awards Information), we MAY refactor to `app/(authenticated)/layout.tsx` housing `<Header>` + `<Footer>` shells, but that is an explicit future decision, tracked as a migration plan in SCREENFLOW.md, not this PR.

### Responsive strategy (chosen)

Write new Homepage components **mobile-first**: base classes target the narrowest viewport, then `sm:` / `md:` / `lg:` / `xl:` progressively add styling as width grows. This matches Tailwind's native intent and avoids the override-cascade bug present in the Login page (where `px-36 md:px-12 sm:px-4` resolves to `px-12` at 1440px instead of `px-36`).

| Breakpoint | Tailwind prefix | Usage in plan |
|------------|-----------------|---------------|
| (base, no prefix) | — | Mobile (< 768px) default styles |
| `md:` | `min-width: 768px` | Tablet overrides |
| `lg:` | `min-width: 1024px` | Narrow desktop overrides |
| `xl:` | `min-width: 1280px` | Desktop (≥ 1280px) full-design styles |

We explicitly DO NOT copy the Login page's `px-36 md:px-12 sm:px-4` inverted pattern. A follow-up chore PR should correct Login's responsive classes — tracked as an open question below (not a blocker for this plan).

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/i87tDx10uM-Homepage-SAA/
├── spec.md
├── design-style.md
├── plan.md              ← this file
├── tasks.md             ← produced by /momorph.tasks
└── assets/
    └── frame.png        ← Figma reference
```

### New files

| File | Purpose |
|------|---------|
**Route files** (`app/about-saa-2025/`)

| File | Purpose |
|------|---------|
| `app/about-saa-2025/page.tsx` | RSC — Homepage SAA page; reads session + role + event ISO; composes all sections; exports `metadata` for `<title>` |
| `app/about-saa-2025/loading.tsx` | RSC — minimal loading skeleton (header shell + hero placeholder) shown while server RSC is streaming. Prevents blank-flash on slow networks. |
| `app/about-saa-2025/error.tsx` | **Client** — Next.js route error boundary. Catches rendering errors in this route segment; shows "Something went wrong" with a `<button onClick={reset}>Retry</button>`. |
| `app/api/notifications/unread-count/route.ts` | Stub route → `{ count: 0 }` (gated; real impl later) |

**Feature components** (`components/home/`)

| File | Purpose |
|------|---------|
| `components/home/hero-section.tsx` | RSC — composes hero BG + gradients + title + countdown + event info + CTAs |
| `components/home/countdown.tsx` | **Client** — 60s tick, SSR-rendered initial values |
| `components/home/countdown-tile.tsx` | RSC — pure; renders 1 tile (number + label) |
| `components/home/event-info.tsx` | RSC — B2 time + location + livestream note |
| `components/home/hero-cta-button.tsx` | RSC — shared component for both ABOUT AWARDS & ABOUT KUDOS (default=outlined, hover=filled) |
| `components/home/about-body.tsx` | RSC — B4.0 sub-heading + B4 paragraphs + quote |
| `components/home/root-further-mark.tsx` | RSC — renders the ROOT FURTHER wordmark (SVG asset preferred; text fallback). Accepts `size: 'xl' \| 'md'`. Used for **both** hero title and B4.0 sub-heading — there is no separate `hero-title.tsx`. |
| `components/home/awards-section.tsx` | RSC — C1 header + C2 grid |
| `components/home/award-card.tsx` | RSC — single card; deep-links to `/awards-information#<slug>` |
| `components/home/award-list.tsx` | RSC — maps `lib/awards.ts` AWARDS array to 6 `<AwardCard>` |
| `components/home/kudos-promo.tsx` | RSC — D1 block composing D2 content + logomark |
| `components/home/kudos-cta-button.tsx` | RSC — small filled-yellow CTA (127×56) |
| `components/home/kudos-logomark.tsx` | RSC — wraps the SVG logomark asset |
| `components/home/widget-button.tsx` | **Client** — floating pill; click opens stub "Coming soon" tooltip |

**Shared UI primitives** (`components/ui/`)

| File | Purpose |
|------|---------|
| `components/ui/nav-link.tsx` | **Client** — `<Link>` wrapper that renders "selected" state based on `usePathname()` |
| `components/ui/header-nav.tsx` | **Client** — active-link detection via `usePathname()`; 3 desktop/tablet nav links |
| `components/ui/header-controls.tsx` | RSC composition of Language + Notification + Avatar |
| `components/ui/mobile-nav-drawer.tsx` | **Client** — right-slide drawer for `< 768px`; portal-rendered; focus-trapped; 3 nav links + controls |
| `components/ui/hamburger-button.tsx` | **Client** — 40×40 toggle button; opens `<MobileNavDrawer>` at `< 768px`; `aria-controls` + `aria-expanded` synced with drawer state |
| `components/ui/footer-nav.tsx` | RSC — 4 nav links + active-link styles (uses the same `<NavLink>` primitive as header) |
| `components/ui/avatar-menu.tsx` | **Client** — dropdown with Profile / Sign out / (Admin) |
| `components/ui/notification-button.tsx` | **Client** — bell icon + badge + click-to-open panel stub |

**Icon components** (`components/icons/`)

| File | Purpose |
|------|---------|
| `components/icons/bell-icon.tsx` | 24×24 bell SVG, stroke #FFFFFF |
| `components/icons/user-icon.tsx` | 24×24 generic avatar SVG |
| `components/icons/arrow-up-right-icon.tsx` | 24×24 CTA ↗ arrow SVG |
| `components/icons/pencil-kudos-icon.tsx` | 24×24 pencil SVG (widget left icon) |
| `components/icons/saa-logo-icon.tsx` | 24×24 SAA logo SVG (widget right icon) |
| `components/icons/hamburger-icon.tsx` | 24×24 three-line SVG, stroke #FFFFFF (authored from scratch; no Figma source) |

**Libs + types** (`lib/`, `types/`)

| File | Purpose |
|------|---------|
| `lib/awards.ts` | Exports `readonly AwardSpec[]` with 6 entries (explicit order per Component Contracts) |
| `lib/auth/get-user-role.ts` | Returns `'user' \| 'admin'` from Supabase SSR session; reads `app_metadata.role` with `user_metadata.role` fallback |
| `lib/event.ts` | `parseEventStart(iso)`, `getInitialCountdown(now, target)` pure functions |
| `types/home.ts` | `AwardSpec`, `CountdownValues`, `UserRole` type defs |

**Assets** (`public/assets/home/`, `public/fonts/`)

| File | Purpose |
|------|---------|
| `public/assets/home/hero-bg.jpg` | Hero background image (Figma export needed) |
| `public/assets/home/hero-root-further.svg` | Hero title wordmark — preferred SVG export |
| `public/assets/home/kudos-bg.png` | Kudos promo block background |
| `public/assets/home/kudos-logomark.svg` | Red "S" + gold "KUDOS" brand mark |
| `public/assets/home/awards/top-talent.png` | Award thumbnail |
| `public/assets/home/awards/top-project.png` | Award thumbnail |
| `public/assets/home/awards/top-project-leader.png` | Award thumbnail |
| `public/assets/home/awards/best-manager.png` | Award thumbnail |
| `public/assets/home/awards/signature-2025-creator.png` | Award thumbnail |
| `public/assets/home/awards/mvp.png` | Award thumbnail |
| `public/fonts/DSEG7Classic-Bold.woff2` | Font file for countdown numbers (DSEG7-Classic Bold, OFL — open-source LCD substitute for the proprietary Figma `Digital Numbers`) |
| `public/fonts/DSEG-LICENSE.txt` | SIL Open Font License text (preserved per OFL terms) |

**Tests** (`tests/`)

| File | Purpose |
|------|---------|
| `tests/unit/home/countdown.test.tsx` | Hydration stability + 60s tick + `--` fallback |
| `tests/unit/home/countdown-tile.test.tsx` | Zero-pad + `--` fallback |
| `tests/unit/home/hero-cta-button.test.tsx` | Normal vs hover state; click navigates |
| `tests/unit/home/event-info.test.tsx` | i18n text renders |
| `tests/unit/home/root-further-mark.test.tsx` | Renders SVG with correct `aria-label`; applies `size='xl' \| 'md'` dims |
| `tests/unit/home/award-card.test.tsx` | Slug → href; 2-line clamp; title/desc/image |
| `tests/unit/home/award-list.test.tsx` | Renders exactly 6 cards, in AWARDS order, grid classes per viewport |
| `tests/unit/home/kudos-cta-button.test.tsx` | Small size + filled state + href |
| `tests/unit/home/kudos-promo.test.tsx` | Kicker + title + rich-text body (strong tag) + CTA + logomark |
| `tests/unit/home/kudos-logomark.test.tsx` | Renders `<img>` with correct `aria-label` and dims |
| `tests/unit/home/widget-button.test.tsx` | Fixed position + click → stub `console.warn` + tooltip toggles |
| `tests/unit/home/get-user-role.test.ts` | Session variants (app_metadata.role, user_metadata.role, neither) → derivation |
| `tests/unit/home/event.test.ts` | `parseEventStart` + `getInitialCountdown()` math; invalid/missing env fallback |
| `tests/unit/ui/nav-link.test.tsx` | Active detection + self-click scroll-to-top + hash anchor preserved |
| `tests/unit/ui/header-nav.test.tsx` | Renders 3 links with correct active state |
| `tests/unit/ui/header-controls.test.tsx` | Composition — Language + Bell + Avatar render; `isAdmin` passed through |
| `tests/unit/ui/footer-nav.test.tsx` | 4 links render with mirrored active-link behaviour |
| `tests/unit/ui/avatar-menu.test.tsx` | Admin-only item; sign-out; Escape/outside-click close; focus returns to trigger |
| `tests/unit/ui/notification-button.test.tsx` | Badge aria-label + visibility based on count; fetch-error hides badge silently |
| `tests/unit/ui/mobile-nav-drawer.test.tsx` | Renders at `< 768px`; focus-trap; Escape-close; backdrop-click close |
| `tests/unit/ui/hamburger-button.test.tsx` | `aria-controls` + `aria-expanded` sync; click toggles drawer |
| `tests/unit/ui/header-backcompat.test.tsx` | **Regression** — Login's `<Header><LanguageSelector /></Header>` pattern still renders identically after refactor to slotted API |
| `tests/integration/home/page.test.tsx` | Full page RSC render — sections appear, `isAdmin` drives avatar menu, unauth redirects via proxy |
| `tests/integration/home/unread-count.test.ts` | Stub route handler returns `{ count: 0 }` with correct content-type |
| `tests/e2e/home/homepage-nav.spec.ts` | Login → Homepage → click any Award card → URL `/awards-information#<slug>` |
| `tests/e2e/home/signout.spec.ts` | Login → Homepage → Avatar → Sign out → back at `/`; session cookie cleared |

### Files to modify

| File | Changes |
|------|---------|
| `components/ui/header.tsx` | Refactor to accept `leftSlot` / `navSlot` / `rightSlot` props (or use named children pattern). Keep Login's existing `{children}` call-site working (map `children` → `rightSlot`). Default `leftSlot` = existing logo block. |
| `components/ui/footer.tsx` | Add logo on the left, accept `navSlot`; keep Login call-site backward-compatible (no `navSlot` → render just copyright). |
| `components/login/language-selector.tsx` | **Move** to `components/ui/language-selector.tsx` (it's now shared). Update imports in `app/page.tsx` and new Homepage page. |
| `app/globals.css` | Add all new CSS tokens from design-style.md §Design Tokens (colors `--color-accent-gold*`, `--color-cta-outline-*`, `--color-hover-surface`, z-index scale, spacing, typography vars). Generalise `.login-hero-bg` → `.hero-bg` OR add a parallel `.home-hero-bg`. |
| `app/layout.tsx` | Load `Digital Numbers` via `next/font/local` alongside existing Montserrat fonts; expose as `--font-digital`. |
| `messages/vi.json` | Add `home.*` namespace (header, hero, countdown, event, awards×6, kudos, widget, footer links) |
| `messages/en.json` | Same EN translations (flagged pending content team) |
| `proxy.ts` | If final route is `/about-saa-2025`, set `NEXT_PUBLIC_POST_AUTH_URL=/about-saa-2025` in `.env.local`; no code change needed (the variable is already consumed). |
| `.env.local` / `.env.example` | Add `NEXT_PUBLIC_SAA_EVENT_START=2025-12-26T18:30:00+07:00`; set `NEXT_PUBLIC_POST_AUTH_URL=/about-saa-2025`. |
| `next.config.ts` | No change expected. Verify `remotePatterns` unchanged (all images are local). |
| `tests/setup.ts` | Add mocks for `next/navigation` `usePathname` if not already present. |

### Files to delete

None.

### Dependencies to add

**None in runtime**. All required packages are already in `package.json` (Next 16, React 19, Tailwind 4, Supabase SSR, next-intl, Vitest, Playwright, Testing Library). `Digital Numbers` is loaded as a local font file (not an npm package).

---

## Component Contracts

> This section captures the **TS-level API contracts** task generator and implementers need. It is intentionally verbose to remove any need to re-read spec.md/design-style.md for signatures.

### Refactored `<Header>` (`components/ui/header.tsx`)

```ts
import type { ReactNode } from 'react'

export interface HeaderProps {
  /**
   * Logo area (left). Defaults to the standard SAA logo linked to the home route.
   * Pass `null` to suppress (edge case — not currently used).
   */
  leftSlot?: ReactNode
  /**
   * Nav-links area (center). Default `undefined` = no nav (Login case).
   * Homepage passes `<HeaderNav />`.
   */
  navSlot?: ReactNode
  /**
   * Controls area (right). Login passes `<LanguageSelector />` only;
   * Homepage passes `<HeaderControls />` (Language + Bell + Avatar).
   */
  rightSlot?: ReactNode
}

export default function Header({ leftSlot, navSlot, rightSlot }: HeaderProps): JSX.Element
```

**Backward compatibility**: The current `{ children }` Login call-site (`<Header><LanguageSelector /></Header>`) must continue to work. Implementation strategy: accept `children` as an aliased fallback for `rightSlot` — if `rightSlot` is undefined, fall back to `children`. Add a deprecation comment to `children` usage so future PRs can migrate fully.

### Refactored `<Footer>` (`components/ui/footer.tsx`)

```ts
export interface FooterProps {
  logoSlot?: ReactNode // Default: SAA logo
  navSlot?: ReactNode  // Default: null (Login case; Homepage passes <FooterNav />)
}

export default function Footer({ logoSlot, navSlot }: FooterProps): JSX.Element
```

### `<NavLink>` (new, `components/ui/nav-link.tsx`)

```ts
export interface NavLinkProps {
  href: string
  labelKey: string          // i18n key (e.g. 'common.nav.about')
  matchMode?: 'exact' | 'startsWith'  // default 'exact'
}

// Client component. Uses usePathname() from next/navigation.
// Renders <Link href={href}> with the 'selected' style when usePathname() matches.
// Self-link click (when already active) calls window.scrollTo({ top: 0, behavior: 'smooth' }) and preventsDefault.
export default function NavLink(props: NavLinkProps): JSX.Element
```

### `<HeaderNav>` (new, `components/ui/header-nav.tsx`)

```ts
// Client component. Wraps 3 <NavLink>s. No props.
// Links hard-coded inside (deriving from SCREENFLOW.md):
//   - { href: '/about-saa-2025', labelKey: 'common.nav.about' }
//   - { href: '/awards-information', labelKey: 'common.nav.awards', matchMode: 'startsWith' }
//   - { href: '/sun-kudos', labelKey: 'common.nav.kudos', matchMode: 'startsWith' }
export default function HeaderNav(): JSX.Element
```

### `<HeaderControls>` (new, RSC composition)

```ts
export interface HeaderControlsProps {
  isAdmin: boolean         // Derived from lib/auth/get-user-role.ts at page level
  userEmail?: string       // For avatar menu display
}
// Renders <LanguageSelector /> + <NotificationButton /> + <AvatarMenu isAdmin={isAdmin} email={userEmail} />
```

### `<MobileNavDrawer>` (new, `components/ui/mobile-nav-drawer.tsx`) — Client

```ts
export interface MobileNavDrawerProps {
  isOpen: boolean
  onClose: () => void
  isAdmin: boolean
}
// Full-height right-slide drawer appearing at < 768px.
// Contains: 3 <NavLink>s + Language + (admin?) Admin Dashboard link + Sign out button.
// Bell + Profile links rendered as list items.
// Click backdrop or Escape closes. Focus trap inside.
```

### `<Countdown>` (new, Client)

```ts
export interface CountdownProps {
  /** Event start as ISO-8601. Passed from RSC page (server-computed fallback at hydration). */
  targetISO: string | undefined
}
// Renders 3 <CountdownTile> + B1.2 "Coming soon" subtitle.
// On mount: reads initial value from DOM (SSR-rendered); starts setInterval(60_000) to tick.
// When remaining <= 0: all tiles = '00', subtitle hidden.
// Invalid / undefined targetISO: all tiles = '--', subtitle hidden, console.warn.
```

### `<CountdownTile>` (new, RSC)

```ts
export interface CountdownTileProps {
  value: number | '--'
  labelKey: 'home.countdown.days' | 'home.countdown.hours' | 'home.countdown.minutes'
}
// Numeric value is zero-padded to exactly 2 digits (e.g. 5 -> "05", '--' stays '--').
// Uses var(--font-digital) for the number; Montserrat 700 24/32 ls:0 for label.
//
// Number box: background rgba(255,234,158,0.10), border-radius 4px.
// ⚠ NO border, NO box-shadow, NO text-shadow / glow on the number box — Figma node has none.
//   Any such "polish" is a drift from the design and MUST be removed in review.
```

### `<HeroCtaButton>` (new, RSC)

```ts
export interface HeroCtaButtonProps {
  href: string
  labelKey: string            // i18n key for button text
  ariaLabelKey?: string       // optional override for screen-reader label
}
// 276×60; <Link> styled per design-style §B3 shared states.
// Default = outlined (rgba(255,234,158,0.10) fill, #998C5F border, white text).
// :hover and :focus-visible = solid yellow (#FFEA9E) + #00101A text.
// Includes <ArrowUpRightIcon /> on the right.
```

### `<AwardCard>` (new, RSC)

```ts
export interface AwardCardProps {
  award: AwardSpec
}
// Implementation pattern: ONE outer <Link href={'/awards-information#' + slug}> wraps the
// entire card (image + title + description + "Chi tiết" row). This satisfies the spec
// requirement that clicking image OR title OR "Chi tiết" all navigates — without nesting
// <a> inside <a> (which is invalid HTML and breaks keyboard/AT).
// The "Chi tiết" row is styled to LOOK like a button/link (text #FFFFFF, Montserrat 500
// 16/24 ls:0.15 + ArrowUpRightIcon) but is NOT a separate <a> element.
//
// Visual spec:
//   - Image: 336×336, aspect-square, border 1px solid rgba(250,226,135,0.60),
//            box-shadow 0 0 32px rgba(255,234,158,0.35); hover: 0 0 48px rgba(255,234,158,0.55)
//   - Title: Montserrat 400 24/32 #FFEA9E
//   - Description: Montserrat 400 16/24 ls:0.5 #FFFFFF; -webkit-line-clamp:2; min-height:48px;
//                  title={fullDescription} for screen-reader/pointer-hover
//   - "Chi tiết" row: Montserrat 500 16/24 ls:0.15 #FFFFFF + ArrowUpRightIcon 24×24 #FFFFFF
```

### `<AvatarMenu>` (new, Client)

```ts
export interface AvatarMenuProps {
  isAdmin: boolean
  userEmail?: string
}
// 40×40 circular button (border 1px #998C5F). Click opens dropdown anchored below.
// Dropdown (absolute, z-index: var(--z-dropdown)):
//   - Email (non-interactive) — if provided
//   - <NavLink href="/profile" labelKey="home.menu.profile" />
//   - (isAdmin) <NavLink href="/admin" labelKey="home.menu.admin" />
//   - <button onClick={signOut}>Sign out</button>
// Reuses open/close pattern from <LanguageSelector>. Escape closes + returns focus.
```

### `<NotificationButton>` (new, Client)

```ts
// No props. 40×40 circular button (bell icon).
// useEffect: fetch('/api/notifications/unread-count') once on mount.
// Renders <span aria-label={`${count} unread notifications`} /> 8×8 red badge when count > 0.
// Fetch error: hide badge silently; no toast.
//
// Touch target: the visual size is 40×40 but Constitution §IV requires ≥48px touch targets.
// Inflate via a ::before pseudo-element:
//   &::before { content: ''; position: absolute; inset: -4px; }
// This keeps the visual size 40×40 while meeting the 48px tap-target rule.
// Apply the same technique to <AvatarMenu> trigger (also 40×40).
```

### `<WidgetButton>` (new, Client)

```ts
// No props. position: fixed; right: calc(env(safe-area-inset-right) + 32px); bottom: 96px; z-index: var(--z-widget).
// On click: console.warn('[WidgetButton] menu destinations TBD') + open a non-interactive tooltip "Coming soon" (stub).
```

### `lib/awards.ts` — AWARDS registry (explicit DOM order)

```ts
export interface AwardSpec {
  readonly id: string           // DOM id / test selector
  readonly titleKey: string     // i18n key, e.g. 'home.awards.top-talent.title'
  readonly descriptionKey: string
  readonly image: string        // public path
  readonly slug: string         // URL hash fragment for /awards-information
}

export const AWARDS: readonly AwardSpec[] = [
  { id: 'top-talent',             titleKey: 'home.awards.top-talent.title',             descriptionKey: 'home.awards.top-talent.description',             image: '/assets/home/awards/top-talent.png',             slug: 'top-talent' },
  { id: 'top-project',            titleKey: 'home.awards.top-project.title',            descriptionKey: 'home.awards.top-project.description',            image: '/assets/home/awards/top-project.png',            slug: 'top-project' },
  { id: 'top-project-leader',     titleKey: 'home.awards.top-project-leader.title',     descriptionKey: 'home.awards.top-project-leader.description',     image: '/assets/home/awards/top-project-leader.png',     slug: 'top-project-leader' },
  { id: 'best-manager',           titleKey: 'home.awards.best-manager.title',           descriptionKey: 'home.awards.best-manager.description',           image: '/assets/home/awards/best-manager.png',           slug: 'best-manager' },
  { id: 'signature-2025-creator', titleKey: 'home.awards.signature-2025-creator.title', descriptionKey: 'home.awards.signature-2025-creator.description', image: '/assets/home/awards/signature-2025-creator.png', slug: 'signature-2025-creator' },
  { id: 'mvp',                    titleKey: 'home.awards.mvp.title',                    descriptionKey: 'home.awards.mvp.description',                    image: '/assets/home/awards/mvp.png',                    slug: 'mvp' },
] as const
```

This **order is the DOM order** and matches the Figma 3×2 grid left-to-right, top-to-bottom.

### `lib/event.ts`

```ts
export interface CountdownValues {
  days: number | '--'
  hours: number | '--'
  minutes: number | '--'
  hasStarted: boolean   // true if eventStart <= now; triggers hiding of "Coming soon" subtitle
}

export function parseEventStart(iso: string | undefined): Date | null
export function getInitialCountdown(now: Date, target: Date | null): CountdownValues
```

### `<AboutBody>` (new, RSC, `components/home/about-body.tsx`)

The narrative section below the hero. Renders in this **exact paragraph order** per the Figma reference (design-style.md §B4):

1. `body_p1` — "Đứng trước bối cảnh thay đổi như vũ bão của thời đại AI…"
2. `body_p2` — "Lấy cảm hứng từ sự đa dạng năng lực…"
3. `body_p3` — "Vượt ra khỏi nét nghĩa bề mặt, 'Root Further' chính là hành trình…"
4. **Quote** (centered, italic) — `home.about.quote`
5. **Quote source** (centered, smaller muted) — `home.about.quote_source`
6. `body_p4` — "Trước giông bão, chỉ những tán cây có bộ rễ đủ mạnh…" ← after quote
7. `body_p5` — "Không ai biết trước ấn sâu trong 'lòng đất' của ngành công nghệ…"

⚠ **p4 and p5 MUST appear AFTER the quote** — an earlier implementation draft dropped them. Any implementation that ends at `body_p3 + quote` is incomplete.

```ts
// No props. RSC.
// Outer container: max-w-[1152px] flex-col gap-8, pt-[40px] md:pt-[60px] (reduced per
// 2026-04-26 stakeholder request to keep mark close to hero).
//
// Typography — all body paragraphs:
//   Montserrat 400 16/24 ls:0.5 #FFFFFF; text-align: justify (per Figma — NOT left-aligned)
//
// Quote:
//   Montserrat 400 16/24 ls:0.5 #FFFFFF; text-align: center; font-style: italic
//
// Quote source:
//   Montserrat 400 14/20 ls:0.5 color: var(--color-text-muted) (#DBD1C1); text-align: center
//
// Render the <RootFurtherMark size="md"> (290px wide) ABOVE body_p1, horizontally centered.
```

### i18n key tree (add to `messages/vi.json` and `messages/en.json`)

```jsonc
{
  "common": {
    "nav": { "about": "About SAA 2025", "awards": "Awards Information", "kudos": "Sun* Kudos", "standards": "Tiêu chuẩn chung" },
    "lang": { "vi": "VN", "en": "EN" }
  },
  "home": {
    "hero": { "title_line1": "ROOT", "title_line2": "FURTHER" },
    "countdown": { "subtitle": "Comming soon", "days": "DAYS", "hours": "HOURS", "minutes": "MINUTES" },
    // ↑ "Comming soon" (two m's) — Figma typo preserved verbatim per spec.md §Data Requirements
    "event": {
      "time_label": "Thời gian:",
      "date_value": "26/12/2025",
      "location_label": "Địa điểm:",
      "location_value": "Âu Cơ Art Center",
      "livestream_note": "Tường thuật trực tiếp qua sóng Livestream"
    },
    "cta": { "about_awards": "ABOUT AWARDS", "about_kudos": "ABOUT KUDOS", "detail": "Chi tiết" },
    "about": {
      "body_p1": "…",
      "body_p2": "…",
      "body_p3": "…",
      "quote": "A tree with deep roots fears no storm",
      "quote_source": "(Cây sâu bền rễ, bão giông chẳng nề — Ngạn ngữ Anh)",
      "body_p4": "…",
      "body_p5": "…"
    },
    "awards": {
      "section_caption": "Sun* annual awards 2025",
      "section_title": "Hệ thống giải thưởng",
      "top-talent":             { "title": "Top Talent",             "description": "Vinh danh top cá nhân xuất sắc trên mọi phương diện" },
      "top-project":            { "title": "Top Project",            "description": "…" },
      "top-project-leader":     { "title": "Top Project Leader",     "description": "…" },
      "best-manager":           { "title": "Best Manager",           "description": "…" },
      "signature-2025-creator": { "title": "Signature 2025 - Creator", "description": "…" },
      "mvp":                    { "title": "MVP (Most Valuable Person)", "description": "…" }
    },
    "kudos": {
      "kicker": "Phong trào ghi nhận",
      "title": "Sun* Kudos",
      "description_rich": "<strong>ĐIỂM MỚI CỦA SAA 2025</strong> Hoạt động ghi nhận và cảm ơn đồng nghiệp - lần đầu tiên được diễn ra dành cho tất cả Sunner. Hoạt động sẽ được triển khai vào tháng 11/2025, khuyến khích người Sun* chia sẻ những lời ghi nhận, cảm ơn đồng nghiệp trên hệ thống do BTC công bố. Đây sẽ là chất liệu để Hội đồng Heads tham khảo trong quá trình lựa chọn người đạt giải."
    },
    "menu": { "profile": "Profile", "sign_out": "Sign out", "admin": "Admin Dashboard" },
    "widget": { "stub_tooltip": "Coming soon" }
  },
  "footer": {
    "copyright": "Bản quyền thuộc về Sun* © 2025"
  }
}
```

The 5 unfilled `description: "…"` + `body_pN` entries are flagged in spec.md Dependencies as copy pending from content team. Implementation MAY use placeholder Lorem Ipsum in VN and mark with `TODO(content)` comments.

---

## Implementation Strategy

### Vertical-slice order

We build each user story as a self-contained vertical slice (test → component → integration → visual check) rather than layering (all types → all components → all tests). This keeps the PR set reviewable and the main branch green at each merge.

### Phase 0 — Asset preparation (blocking all UI work)

Before any component code can be pixel-perfect, gather assets. Use the `mcp__momorph__get_media_files` / `get_figma_image` tools to export from Figma file `9ypp4enmFmdK3YAFJLIu6C`:

| Asset | Figma Node | Target Path | Format | Notes |
|-------|-----------|-------------|--------|-------|
| Hero BG | `2167:9028` (MM_MEDIA_Keyvisual BG) | `public/assets/home/hero-bg.jpg` | JPG | Export at 2× scale (3024×2784 min) |
| Hero ROOT FURTHER wordmark | `2167:9032` (Frame 482) | `public/assets/home/hero-root-further.svg` | SVG | Preferred — "Export as SVG" on outlined text in Figma. If not possible, fall back to live text per design-style §B.0. |
| Kudos bg | `I3390:10349;313:8416` | `public/assets/home/kudos-bg.png` | PNG | |
| Kudos logomark | `I3390:10349;329:2948` | `public/assets/home/kudos-logomark.svg` | SVG | Red S + gold KUDOS combined |
| Award thumbnails ×6 | `I{cardId};214:1019` (6 instances) | `public/assets/home/awards/<slug>.png` | PNG 1:1, ≥336×336 | One per category slug |
| Pencil (Widget) | `I5022:15169;214:3839;186:1935` | inline in `<PencilKudosIcon>` | SVG → React component | |
| SAA logo (Widget) | `I5022:15169;214:3839;186:1766` | inline in `<SaaLogoIcon>` | SVG → React component | |
| Hamburger | — (standard 3-line icon; no Figma source) | inline in `<HamburgerIcon>` | SVG → React component | Author from scratch; 24×24; stroke `#FFFFFF` |
| Bell | `I2167:9091;186:2101` | inline in `<BellIcon>` | SVG → React component | |
| User | `I2167:9091;186:1597` | inline in `<UserIcon>` | SVG → React component | |
| Arrow up-right | `MM_MEDIA_Up` (used in B3.1, B3.2, C2.x.4, D2.1) | inline in `<ArrowUpRightIcon>` | SVG → React component | |
| Digital Numbers font | — | `public/fonts/DigitalNumbers-Regular.woff2` | WOFF2 | Awaiting supply; see spec.md Dependencies |

**Gate**: Phase 1 cannot start until all 6 award thumbnails + hero BG + Kudos bg + logomark are in place. ROOT FURTHER SVG and Digital Numbers font can be stubbed short-term (live text fallback + system monospace) — flag in code as TODOs.

### Phase 1 — Foundation (no visual UI yet; lays shared plumbing)

1. **Tokens** — extend `app/globals.css` with every new var from design-style.md §Design Tokens. Three specific buckets to add:
   - Colors (`--color-accent-gold`, `--color-accent-gold-alt`, `--color-cta-outline-bg`, `--color-cta-outline-border`, `--color-hover-surface`, `--color-status-unread`, `--color-text-muted`, `--color-overlay-shade`)
   - Typography (`--text-nav-active`, `--text-nav`, `--text-hero-h1`, `--text-hero-sub`, `--text-countdown-num`, `--text-countdown-label`, `--text-cta-btn-sm`, `--text-card-title`, `--text-card-link`, `--text-section-title`, `--text-kudos-title`, `--font-digital` — the local font registration)
   - Z-index scale (`--z-hero-bg: 0`, `--z-hero-overlay: 1`, `--z-main-content: 2`, `--z-header: 10`, `--z-widget: 20`, `--z-dropdown: 30`, `--z-modal: 50`, `--z-tooltip: 60`) — enforced by TR-010
   - Spacing, border, shadow tokens as listed in design-style.md §Design Tokens

   Commit this alone for ease of review.
2. **Route skeleton** — create `app/about-saa-2025/page.tsx` returning a minimal RSC (`<h1>Homepage</h1>`). Add `NEXT_PUBLIC_POST_AUTH_URL=/about-saa-2025` and `NEXT_PUBLIC_SAA_EVENT_START=2025-12-26T18:30:00+07:00` to `.env.local` and `.env.example`. Verify `proxy.ts` redirects work (sign-in on `/` now lands on `/about-saa-2025`).
3. **Shared nav primitives**
   - `components/ui/nav-link.tsx` (Client) + tests — per Component Contracts
   - Move `language-selector.tsx` from `components/login/` to `components/ui/`; update imports in `app/page.tsx` (Login) + any tests
   - Extend `components/ui/header.tsx` to slotted API per Component Contracts (keep Login's current call-site green — `children` aliases to `rightSlot`)
   - Extend `components/ui/footer.tsx` similarly
   - **Add a regression test** `tests/unit/ui/header-backcompat.test.tsx` that exercises the Login call-site pattern (`<Header><LanguageSelector /></Header>`) to guard against future slot-API breakages
4. **Supporting libs**
   - `types/home.ts` — `AwardSpec`, `CountdownValues`, `UserRole`
   - `lib/awards.ts` — 6 entries per Component Contracts (exact order matters)
   - `lib/event.ts` — `parseEventStart`, `getInitialCountdown` pure functions + tests
   - `lib/auth/get-user-role.ts` + tests (with both `app_metadata.role` and `user_metadata.role` fallback paths)
5. **Icons** — scaffold all 5 new icon components with placeholder SVG paths; swap real paths once Phase 0 assets arrive.
6. **Font** — wire `DigitalNumbers` via `next/font/local` in `app/layout.tsx` alongside the existing Montserrat fonts; expose as `var(--font-digital)`. If the `.woff2` file is missing, use a fallback `font-family: 'Consolas', monospace` inline in the CSS — loader does not error on missing local paths at build time.
7. **i18n keys** — add full `home.*` + extended `common.*` VN + placeholder EN keys per the i18n tree in Component Contracts. Placeholder descriptions for 5/6 awards must be marked `TODO(content)` in comments next to the lines.

**Exit criteria**: `npm run build` + `npx vitest run` + `npx playwright test` all green; new bare page renders at `/about-saa-2025`; Login screen still passes 31 pre-existing tests; new backcompat test for `<Header>` green.

### Phase 2 — User Story 4 (P1): Global nav (header + footer)

We intentionally do US4 first (before US1) because every subsequent slice depends on the extended `<Header>` / `<Footer>` shell. This sequencing keeps subsequent PRs focused on feature content, not scaffolding.

**Desktop + tablet nav (≥ 768px)**

1. **TDD: `<NavLink>`** — active-link detection, self-click → `window.scrollTo({ top: 0, behavior: 'smooth' })` no nav, hash-anchor handling preserved.
2. **TDD: `<HeaderNav>`** — renders 3 links per Component Contracts, correct one active per `usePathname()`.
3. **TDD: `<AvatarMenu>`** — dropdown positioned absolute below button (`top: 48px; right: 0`) anchored inside a `position: relative` wrapper; collision check prevents viewport-right overflow (per spec TR-009). Reuse `<LanguageSelector>` open/close hooks. Admin-only item, sign-out redirect.
4. **TDD: `<NotificationButton>`** — badge shown when unread > 0; badge `aria-label={\`${count} unread notifications\`}`; fetch errors hide badge silently.
5. **TDD: `<HeaderControls>`** — composes Language + Bell + Avatar per Component Contracts.
6. **TDD: `<FooterNav>`** — 4 links per Component Contracts, mirrors header-nav styles via shared `<NavLink>`.

**Mobile nav (< 768px)**

7. **TDD: `<MobileNavDrawer>`** — right-slide drawer overlay per Component Contracts. Opens from a hamburger icon button replacing `<HeaderNav>` at `< 768px`. Focus trap, Escape-close, backdrop-click close. Use `@media (max-width: 767.98px)` in CSS and `useMediaQuery` hook (new, simple) OR render both at the page level and hide via `md:hidden` / `max-md:hidden` Tailwind utilities (**preferred** — avoids the hook and is fully SSR-safe).
8. **TDD: `<HamburgerButton>`** (Client, lightweight) — toggles drawer open state. The burger icon SVG is new (`components/icons/hamburger-icon.tsx`) — add to Phase 0 asset list.
9. **Wire mobile**: `<Header>` at `< 768px` renders `leftSlot` (logo) + right-aligned `<HamburgerButton>`; `<MobileNavDrawer>` portals into `<body>` (via `createPortal`) at z-index `var(--z-dropdown)`.

**Wire-up (all viewports)**

10. Update `app/about-saa-2025/page.tsx` to:
    - Read session via `createServerClient` + derive `isAdmin` via `lib/auth/get-user-role.ts`
    - Render `<Header leftSlot={…} navSlot={<HeaderNav />} rightSlot={<HeaderControls isAdmin email />} />`
    - Render `<Footer logoSlot={…} navSlot={<FooterNav />} />`

**Exit criteria**: test suite green; E2E clicks any header or footer nav link → `router.push` spy called with correct URL; clicking the currently-active link triggers `window.scrollTo` (spied), no `router.push`; mobile drawer opens via hamburger, traps focus, closes on Escape.

### Phase 3 — User Story 1 (P1): Hero + countdown + CTAs

1. **TDD: `<CountdownTile>`** — zero-pad, `--` fallback.
2. **TDD: `<Countdown>`** — hydration stability (renders same markup SSR vs client on first mount), 60s tick, invalid env → `--`.
3. **TDD: `<EventInfo>`** — renders date + venue + livestream note from i18n keys.
4. **TDD: `<HeroCtaButton>`** — default outlined; `:hover` flips to filled yellow; `:focus-visible` outline; click navigates.
5. **TDD: `<RootFurtherMark size="xl">`** — renders SVG asset; `aria-label="ROOT FURTHER"`. Both hero and B4.0 use this.
6. **Compose `<HeroSection>`** (RSC) — BG + gradient overlays + `<RootFurtherMark>` + `<Countdown>` + `<EventInfo>` + 2× `<HeroCtaButton>`.
7. **CSS** — add `.home-hero-bg` class to `app/globals.css` (same pattern as Login's `.login-hero-bg` — native-size on desktop, cover+right on smaller; see design-style.md for coords if they differ from Login).
8. **Wire** into the page; visual-check against `frame.png` using Playwright screenshot comparison at 1440 / 1024 / 768 / 375 viewports.

**Exit criteria**: countdown reflects env var, counts down in real time, all 4 viewports visually pass within the constitution-permitted threshold; tests green.

### Phase 4 — User Story 2 (P1): Awards grid

1. **TDD: `<AwardCard>`** — renders title + 2-line-clamped description + image + "Chi tiết" link; hover lift + glow; href `/awards-information#<slug>`.
2. **TDD: `<AwardList>`** — maps `AWARDS` constant to exactly 6 cards in grid (order per `lib/awards.ts`); **mobile-first** responsive class: `grid grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-[60px] md:gap-y-16 lg:grid-cols-3 lg:gap-x-[108px] lg:gap-y-20`.
3. **Compose `<AwardsSection>`** — C1 header + ruler + title row + `<AwardList>`.
4. **Deep-link scroll**: add a note to `app/about-saa-2025/page.tsx` — when the Awards Information page is implemented, each award section MUST set `scroll-margin-top: 96px` (80px header + 16px breathing room) so hash anchors don't land under the fixed header. This is **not** this PR's concern but is tracked as a dependency on the Awards Information spec.
5. Visual-compare at each breakpoint using Playwright `toHaveScreenshot()` — see Phase 8 tooling.

**Exit criteria**: exactly 6 cards, in AWARDS-array order, correct anchors, visual regression pass at 4 viewports, all tests green.

### Phase 5 — User Story 6 (P2): "Root Further" narrative + B4.0 sub-heading

1. **Compose `<AboutBody>`** — `<RootFurtherMark size="md">` + paragraphs + centered quote.
2. Use `next-intl` rich-text for the quote emphasis (matches Kudos pattern).
3. Visual-compare.

**Exit criteria**: text renders with preserved paragraph breaks, quote centered.

### Phase 6 — User Story 3 (P2): Sun\* Kudos promo

1. **TDD: `<KudosCtaButton>`** — small variant, yellow-filled default.
2. **TDD: `<KudosLogomark>`** — renders asset, correct `aria-label`.
3. **TDD: `<KudosPromo>`** — kicker + title + body (with `<strong>ĐIỂM MỚI CỦA SAA 2025</strong>` rich text) + CTA + logomark positioned right.
4. Visual-compare; mobile: logomark + bg hidden, full-width stack.

### Phase 7 — User Story 5 (P3): Floating widget

1. **TDD: `<WidgetButton>`** — fixed pos, scale-on-hover, click triggers a stub handler with `console.warn('[WidgetButton] menu destinations TBD')`.
2. Verify it does not overlap footer at bottom of page (use `IntersectionObserver` or simple scroll-offset check — keep it simple: fixed `bottom:96px` is enough given footer height).

### Phase 8 — Polish & cross-cutting

1. **Stub API** `app/api/notifications/unread-count/route.ts` + integration test.
2. **A11y audit** — keyboard-only walkthrough; axe-core via `@axe-core/playwright` → `injectAxe(page)` + `checkA11y(page, null, { detailedReport: true })`. Zero `serious` / `critical` violations required.
3. **Performance** — Lighthouse CI on production build; assert FCP ≤ 1500ms (TR-001), CLS < 0.1, no hydration warnings.
4. **Fluid typography** — audit hero H1 + section titles on 375/768/1280/1512 viewports. Use `clamp()` values from design-style.md §Responsive Specifications.
5. **Visual regression** — use **Playwright's built-in `expect(page).toHaveScreenshot()`** for 4 viewport × key-section matrix. Baseline screenshots committed under `tests/e2e/screenshots/` with git-LFS if they exceed 100 KB. Configure `playwright.config.ts` with `toHaveScreenshot: { threshold: 0.1, maxDiffPixelRatio: 0.02 }`. No third-party service (Percy/Chromatic) in v1.
6. **E2E happy-path**
   - `tests/e2e/home/homepage-nav.spec.ts`: Login (stub OAuth via test helper) → Homepage → click each of 6 award cards → assert `page.url()` matches `/awards-information#<slug>` (target page is 404 stub — that's OK, we're asserting the href behaviour).
   - `tests/e2e/home/signout.spec.ts`: Login → Homepage → open Avatar → click Sign out → assert landing on `/` and session cookie cleared.
7. **Cleanup** — grep the repo for `TODO(asset)` / `TODO(content)` / `TODO(admin-role)`; either resolve each or migrate to a GitHub issue with an owner and link in the PR description. A `TODO(content)` comment next to a placeholder i18n value is acceptable for v1 but MUST be surfaced in the release notes.

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Asset delivery delays (ROOT FURTHER SVG, Digital Numbers font, 6 card PNGs, Kudos logomark) | **High** | **High** | Build Phase 0 gate into the plan. Use live-text + system-monospace + 336×336 placeholder PNG fallbacks in dev; flag each with a `TODO(asset)` comment so CI can grep and fail the final merge if any remain. |
| Refactoring `<Header>`/`<Footer>` breaks Login tests | Medium | Medium | Keep the Login call-site contract: `children` prop maps to `rightSlot`. Run Login test suite after each header/footer commit. Explicit Login regression test in CI. |
| Countdown hydration mismatch | Medium | Medium | Compute initial values on the server using request-time `Date` via `lib/event.ts`; pass as serialised prop; client re-computes on first effect with the same `targetISO` — no wall-clock divergence on first paint. Snapshot test for both SSR and hydrated DOM. |
| Admin role claim location differs in real JWT | Low | Medium | `lib/auth/get-user-role.ts` reads from both `app_metadata.role` and `user_metadata.role` with a narrowed union; easy to adjust once the Supabase role setup is finalised. |
| `next-intl` rich-text (`<strong>`) for Kudos emphasis not compatible with our current setup | Low | Low | Verify during Phase 6 kickoff — `next-intl` supports rich-text via tag functions; fallback is two-paragraph split if needed. |
| Z-index conflicts (widget vs. footer vs. avatar dropdown) | Low | Low | Enforce the `--z-*` token scale via Stylelint rule or hand-review. |
| Final route decision changes after implementation begins (`/` vs `/about-saa-2025`) | Medium | Low | Route is defined in exactly one place (`app/about-saa-2025/page.tsx` dir + `NEXT_PUBLIC_POST_AUTH_URL`). Rename is a 2-file change. |

### Estimated complexity

- **Frontend**: **Medium-High** — 22 new React components (16 feature + 8 UI + 1 removed — no separate `hero-title.tsx`), 6 new icon components, responsive layout across 4 breakpoints, mobile drawer + hamburger, countdown SSR hydration edge cases.
- **Backend**: **Low** — one stub route handler + one auth helper. No DB, no business logic.
- **Testing**: **Medium-High** — 22 new unit test files + 2 integration + 2 E2E.

### Complexity breakdown (for estimation)

| Layer | File count | Complexity |
|-------|-----------|------------|
| Route files (page + loading + error + API stub) | 4 | Low |
| Feature components | 14 | Medium (Countdown hydration, CTA state-hover matrix, Kudos rich-text, 2-line clamp) |
| UI primitives | 8 | Medium (slot refactor + mobile drawer + focus trap) |
| Icons | 6 | Low |
| Libs + types | 4 | Low |
| Assets | 12 | External dependency — blocking gate |
| Tests | 26 | Medium-High (TDD red-green per component + 1 regression + E2E) |

---

## Integration Testing Strategy

### Test Scope

- [x] **Component/Module interactions** — Header ↔ HeaderNav ↔ NavLink (active-route flow); Page ↔ `<Countdown>` (SSR hydration); Page ↔ `<AvatarMenu>` (role-driven conditional render); Page ↔ Supabase SSR session.
- [x] **External dependencies** — Supabase Auth (real local instance, no DB mocks per Constitution §III); `NEXT_PUBLIC_SAA_EVENT_START` env var parsing.
- [ ] **Data layer** — N/A (no new DB tables; no writes).
- [x] **User workflows** — Login → Homepage (route), Sign out → Login, Award card → deep link.

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Countdown tick; nav active-link; avatar admin visibility |
| Service ↔ Service | Yes | `get-user-role.ts` reading from `createServerClient` session |
| App ↔ External API | Limited | Supabase session fetch (real) in integration test; notification count (stubbed route) |
| App ↔ Data Layer | No | — |
| Cross-platform | Yes | Responsive: mobile/tablet/desktop visual tests |

### Test Environment

- **Vitest** with `happy-dom` for unit + component tests (as per existing Login setup)
- **Playwright** against `next dev` on `localhost:3000` with a seeded Supabase local-dev project
- **Test data** — a handful of user fixtures in `tests/e2e/fixtures/users.ts`: `regular@test.local`, `admin@test.local` (with `app_metadata.role='admin'`)
- **Isolation** — each E2E test starts from a signed-out state (cookie clear); uses `test.step` to OAuth-stub then resume on target URL

### Mocking strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| Supabase Auth in unit tests | Mock `createBrowserClient`/`createServerClient` return value with Vitest `vi.mock` | Unit tests need deterministic session states; integration tests use real client |
| Supabase Auth in integration tests | **Real** local instance | Constitution §III — no DB mocks; prevents mock/prod divergence |
| `usePathname()` | `vi.mock('next/navigation', ...)` in unit tests | Required for `<NavLink>` / `<HeaderNav>` isolation |
| Notification count endpoint | Real stub route in integration + E2E; unit tests mock `fetch` | Stub is already deterministic (`{ count: 0 }`) |
| Time (`new Date()`, `setInterval`) | Vitest fake timers (`vi.useFakeTimers`) for Countdown tick tests | Otherwise tests would take 60s |

### Test Scenarios

**Happy path**
- [x] Visit `/about-saa-2025` as authenticated user → all 5 sections render (hero / body / awards / kudos / footer)
- [x] Countdown displays future values; ticks after 60s
- [x] Click each of 6 award cards → URL `/awards-information#<slug>`
- [x] Click "ABOUT AWARDS" / "ABOUT KUDOS" → navigate to correct stubs
- [x] Avatar → Sign out → back at `/`; session cookie cleared

**Error handling**
- [x] Missing `NEXT_PUBLIC_SAA_EVENT_START` → tiles `--`, page still renders
- [x] Past event start → tiles `00`, "Coming soon" hidden
- [x] Unread-count fetch fails → badge hidden, no error toast
- [x] Sign-out throws → inline error shown below avatar

**Edge cases**
- [x] User without `admin` role → Admin Dashboard item NOT rendered
- [x] Pathname is `/about-saa-2025` → clicking "About SAA 2025" scrolls to top, does not navigate
- [x] Viewport < 768 → hamburger replaces inline nav (verify click opens drawer once built; drawer structural tests — layout only in v1 if drawer contents TBD)

### Tooling & Framework

- **Test framework**: Vitest 2.1.9 (unit + integration), Playwright 1.59 (E2E)
- **Supporting tools**: `@testing-library/react`, `@testing-library/user-event`, `happy-dom` env, `vi.mock`, `axe-core/playwright` for a11y
- **CI integration**: existing GitHub Actions pipeline — run `npm run lint && npx vitest run && npx playwright test` on every PR (to be set up if not already present; flagged in open questions)

### Coverage goals

| Area | Target | Priority |
|------|--------|----------|
| Core user flows (header nav, award click, sign-out) | 100% | High |
| Client components (state + effects) | ≥ 80% branch coverage | High |
| RSC composition (page + sections) | ≥ 70% integration | Medium |
| Error scenarios | ≥ 75% | Medium |
| A11y (axe-core on full page at 3 viewports) | 0 serious/critical violations | High |

---

## Dependencies & Prerequisites

### Required before start

- [x] `constitution.md` — understood; relevant principles mapped in Compliance Check above
- [x] `spec.md` — approved after two review passes
- [x] `design-style.md` — approved; all tokens concrete
- [x] `SCREENFLOW.md` — updated 2026-04-22 with Homepage + 4 pending sibling screens
- [x] Login infrastructure merged (Supabase SSR clients, proxy.ts, i18n, Header, Footer)
- [ ] **Final route decision** — `/about-saa-2025` vs `/` (see spec.md Dependencies)
- [ ] **Assets delivered** — Phase 0 gate (6 award thumbs + hero BG + Kudos BG + logomark)
- [x] ~~Digital Numbers font file~~ **RESOLVED** — DSEG7-Classic Bold (OFL) added at `public/fonts/DSEG7Classic-Bold.woff2`, license at `public/fonts/DSEG-LICENSE.txt`. See design-style.md §Notes for the swap rationale.
- [ ] **ROOT FURTHER SVG export** — Phase 3 gate (live-text fallback acceptable)
- [ ] **Final copy for 5/6 award card descriptions** — Phase 4 can start with placeholder copy but MUST be replaced before production merge
- [ ] **B4 narrative copy + EN translations for all home.* keys** — Phase 5 + 8 gate

### External dependencies

- **Supabase local dev instance** — required for integration tests; identical env vars to production except pointing at `http://127.0.0.1:54321`
- **No new npm packages** — all already installed
- **Figma file access** — for asset exports in Phase 0

---

## Next Steps

After plan approval:

1. Run `/momorph.tasks` to produce an ordered `tasks.md` breakdown — the tasks file should mirror Phase 0 → 8 with concrete `- [ ] T### [US?] description at file/path.ts` entries, marking `[P]` for parallelisable tasks (same phase, non-overlapping files).
2. Review `tasks.md` for the 6 award-card tests and 6 award-card asset tasks — these are the largest parallelisation opportunity.
3. Begin Phase 0 (assets) — cannot start Phase 1 until the 6 award thumbnails + hero BG + Kudos BG + logomark are in `public/assets/home/`.
4. Open a tracking issue for each outstanding dependency in the Dependencies checklist (assets, copy, route decision) with a clear owner.

---

## Open Questions

- [ ] **"Tiêu chuẩn chung" footer link href**: The 4th footer link (`7.5` in design-style.md) is rendered in `<FooterNav>` (T051) but has NO target route in SCREENFLOW.md. Possible values: `/standards`, `/rules`, an external URL, or stub-disabled. Must be confirmed before T051 can be considered production-ready. Current implementation should use `href="#"` with a `TODO(nav)` comment.
- [ ] **Final route**: `/about-saa-2025` (current plan) or `/` (homepage for authenticated users, with `/` for unauthenticated = Login)? If the latter, `proxy.ts` must flip its redirect rule, and this plan's `app/about-saa-2025/` directory becomes `app/(authenticated)/page.tsx` under a route-group layout.
- [ ] **Admin role source**: confirm `app_metadata.role` is the correct JWT claim path. If it's `user_metadata.role` or a custom SQL function, `lib/auth/get-user-role.ts` needs a one-line adjustment.
- [ ] **Widget menu destinations**: TBD — implementer renders the pill + a `console.warn` stub. Is an interim modal with "Coming soon" text acceptable, or should the pill be visually disabled (`opacity: 0.5`, no onClick)?
- [ ] **Unread-count backend**: is there an existing API endpoint, or do we merge the stub route handler as a temporary placeholder? If the real endpoint is not on the roadmap for this sprint, the stub MUST have a visible comment + a feature-flag gate.
- [ ] **Hamburger menu drawer**: design-style.md mentions mobile header collapses to a drawer but does not provide drawer styling. Does the drawer show exactly the same 3 nav links + language + bell + avatar? Or is it a different layout? (Likely the same, but confirm.)
- [ ] **Notification panel content**: explicitly out-of-scope in spec, but the bell button needs an `onClick` target. Acceptable to render a `<div>` with "Notifications panel coming soon" text, or should the bell be non-interactive for v1?
- [ ] **CI pipeline**: does the project already have GitHub Actions running `lint + vitest + playwright` on PRs? If not, this should be addressed in a separate chore PR before Phase 8.
- [ ] **Login responsive-class bug correction** — the Login page uses `px-36 md:px-12 sm:px-4` (desktop default with small-viewport overrides) which resolves to `px-12` at desktop ≥1280px instead of the intended `px-36`. This plan explicitly writes Homepage **mobile-first**; should we ship a chore PR alongside the Homepage merge correcting Login's classes to the same mobile-first convention, or leave Login untouched until it gets its own polish pass?

---

## Notes

- The `<Header>`/`<Footer>` refactor is a **pre-requirement** for any feature work on sibling screens (Awards Information, Sun\* Kudos, Profile, Admin Dashboard). This plan treats that refactor as Phase 2 — ahead of the UI slices — so downstream specs do not need to re-do it.
- The `ROOT FURTHER` mark appears twice (hero + B4.0). We deliberately extract a single `<RootFurtherMark size>` component to avoid the two instances drifting from each other. Any future screen using the mark reuses this component.
- `proxy.ts` already has the session check for `/about-saa-2025` (it's simply `pathname !== '/'`). No middleware change needed — the only env-var touch-up is `NEXT_PUBLIC_POST_AUTH_URL`.
- Everything in this plan respects the existing file-naming conventions from Login (kebab-case for TSX files, PascalCase component names, co-located tests).
- No new MoMorph research.md is required — the codebase analysis in Phase 1 context gathering (done inline above) is sufficient for this screen. If the Awards Information / Sun\* Kudos screens require deeper exploration (e.g. real backend endpoints), a research.md can be generated separately.
