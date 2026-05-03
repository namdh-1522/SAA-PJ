# Feature Specification: Hệ thống giải thưởng SAA 2025 (Awards Information)

**Frame ID**: `zFYDgyj_pD` (root node `313:8436`)
**Frame Name**: `Hệ thống giải`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Figma Link**: https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C?node-id=zFYDgyj_pD
**Created**: 2026-04-26
**Last Reviewed**: 2026-04-26 (`momorph.reviewspecify` × 3 — zig-zag layout, Sun* Kudos block layout, Awards-Name overlay = raster, Q2–Q5 locked)
**Status**: Reviewed — ready for `momorph.plan`
**Route**: `/awards` (Next.js App Router; protected route — authenticated users only)

---

## Overview

The "Hệ thống giải thưởng SAA 2025" page (Awards Information) is the canonical reference page
for Sun* Annual Awards 2025. It explains the six award categories — **Top Talent**, **Top
Project**, **Top Project Leader**, **Best Manager**, **Signature 2025 - Creator**, and **MVP
(Most Valuable Person)** — including each one's purpose, quantity (how many will be awarded),
unit (individual / team / unit), and monetary value. The page is **read-only**: there are no
forms, submissions, or interactive data — the only interactivity is anchor-based navigation
between the side menu and the per-award detail rows, plus a single CTA that opens the
Sun* Kudos overview page.

The screen is reached from the Homepage SAA via the header/footer "Award Information" link,
the hero "ABOUT AWARDS" CTA, or any of the six per-award cards (each award card deep-links
into this page anchored on the matching `D.x` row). It also serves as a teaser for the
Sun* Kudos program through a promo block at the bottom.

Visually, it is a single 1440 × 6410 px desktop frame on a dark page background (`#00101A`)
with the brand-yellow accent (`#FFEA9E`). Visual specs are documented separately in
[`./design-style.md`](./design-style.md).

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Authenticated user reads the full award catalogue (Priority: P1)

A logged-in Sun* employee opens `/awards` and is presented with all six SAA 2025 award
categories in a single scrollable page. For each award they can see the award image, title,
description (the criteria / meaning), the number of awards in that category (quantity + unit),
and the prize value in VNĐ. The information is read-only.

**Why this priority**: This is the primary purpose of the screen. Without it the page
delivers no value, and Homepage CTAs ("ABOUT AWARDS" + every award card) have no destination.

**Independent Test**: Navigate to `/awards` while authenticated. Verify all six award
sections render with title, description, quantity, value, and image. No scenario requires
user input or back-end mutation.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they visit `/awards`, **Then** the page renders
   header, a keyvisual banner (with the ROOT FURTHER brand logo overlaid in the upper-left),
   the page title "Hệ thống giải thưởng SAA 2025", a sticky side menu with six items (Top
   Talent, Top Project, Top Project Leader, Best Manager, Signature 2025 - Creator, MVP),
   six matching award detail rows in the same order, the Sun* Kudos promo block, and the
   shared footer.
2. **Given** an authenticated user on `/awards`, **When** the awards data loads, **Then**
   each award row MUST display its image, title, description (justified text), "Số lượng giải
   thưởng:" with quantity + unit (e.g. `10 — Đơn vị`), and "Giá trị giải thưởng:" with the
   primary value (e.g. `7.000.000 VNĐ`) and any unit caption ("cho mỗi giải thưởng").
3. **Given** the **Signature 2025 - Creator** award, **When** the row is rendered, **Then**
   it MUST display **two** value lines (one for individual, one for team) per the design
   data, not a single value.
4. **Given** the **MVP** award, **When** the row is rendered, **Then** it MUST display
   "MVP (Most Valuable Person)" as the title and `15.000.000 VNĐ` as the value.
5. **Given** the six award rows are rendered in order, **When** the user looks at the page,
   **Then** the rows MUST alternate horizontally — odd-indexed rows (D.1, D.3, D.5) show the
   award image on the **left** and the content panel on the **right**; even-indexed rows
   (D.2, D.4, D.6) show the content panel on the **left** and the award image on the
   **right**. The pattern MUST hold even if the API returns a different number or order of
   awards (the **n-th rendered row** uses image-left if `n` is odd, image-right if `n` is
   even, regardless of `slug`).

---

### User Story 2 - Quick-jump to a specific award via side menu (Priority: P1)

While reading, the user can click any of the six items in the left-side menu (`C_Menu list`)
to jump directly to the corresponding award detail row. The active item is visually
distinguished (yellow text + bottom border + glow). As the user scrolls, the active
indicator follows the section currently in view.

**Why this priority**: Six rich award rows produce a long scroll (~6 400 px). Without this
in-page navigation users have to scroll manually, breaking the design intent and the
deep-linking behaviour from the Homepage award cards. Per constitution Principle IV,
navigation MUST be source-of-truth — so this anchor scheme is also depended on by the
Homepage spec.

**Independent Test**: Click each side-menu item and verify the corresponding `D.x` row
scrolls into view. Manually scroll and verify the active indicator follows the visible
section.

**Acceptance Scenarios**:

1. **Given** the user is on `/awards` with the page scrolled to top, **When** they click
   "Top Project" (`C.2`) in the side menu, **Then** the page MUST smooth-scroll the `D.2`
   row to the top of the viewport (offset by sticky-header height) and update the URL hash
   to `#top-project`.
2. **Given** the user clicks any menu item, **When** the scroll completes, **Then** the
   clicked item MUST take the **active** visual state (text `#FFEA9E`, bottom border `1px
   solid #FFEA9E`, glow text-shadow) and the previously-active item MUST revert to the
   **inactive** visual state (white text, no border, no glow).
3. **Given** the user manually scrolls the page, **When** an award row's title crosses the
   active threshold (header bottom + 24 px), **Then** the side-menu item for that row MUST
   become active without the user clicking. *(Implementation note: the slug array passed to
   `useScrollSpy` MUST be stable across renders — use `useMemo` — otherwise the
   `IntersectionObserver` disconnects and reconnects on every render, breaking this scenario.)*
4. **Given** the user navigates to `/awards#mvp` (e.g. by clicking the MVP award card on
   Homepage SAA), **When** the page loads, **Then** the page MUST scroll the `D.6 MVP` row
   into view on first paint and `C.6` MUST start in the active state.

---

### User Story 3 - Open Sun* Kudos detail from the promo block (Priority: P2)

At the bottom of the awards content, a Sun* Kudos promo block displays an eyebrow ("Phong
trào ghi nhận"), a title ("Sun* Kudos"), a short description, and a yellow "Chi tiết" CTA
button. Clicking the button takes the user to the Sun* Kudos screen.

**Why this priority**: The promo is a secondary entry point (the Homepage and the header/
footer also point to Sun* Kudos), so it is not the only path. But it is the only on-page
CTA on this screen, and missing it breaks the documented navigation in `SCREENFLOW.md`.

**Independent Test**: Click the "Chi tiết" button on `/awards`. Verify the user is taken
to the Sun* Kudos route.

**Acceptance Scenarios**:

1. **Given** the user is on `/awards` and the Sun* Kudos block is visible, **When** they
   click the "Chi tiết" button, **Then** the app MUST navigate to the Sun* Kudos page at
   `/kudos` (route reserved in `SCREENFLOW.md`; the destination screen is pending discovery
   but the route is fixed).
2. **Given** the user hovers the "Chi tiết" button, **When** they hover, **Then** the button
   MUST show its hover state (background tint defined in `design-style.md` § 4b).
3. **Given** the user focuses the "Chi tiết" button via keyboard, **When** focused, **Then**
   the focus ring MUST be visible (`outline: 2px solid #FFEA9E`).

---

### User Story 4 - Localised UI follows the global language preference (Priority: P2)

Like every authenticated page in the app, the awards page MUST honour the language switcher
in the shared header (VN / EN). Switching language re-renders all UI strings (page title,
menu items, "Số lượng giải thưởng:", "Giá trị giải thưởng:", caption "cho mỗi giải thưởng",
"Phong trào ghi nhận", "Chi tiết", award titles, descriptions) without a full page reload.

**Why this priority**: The constitution and Homepage SAA spec mandate Vietnamese as the
default with English as alternate. A monolingual awards page would diverge from the rest of
the app.

**Independent Test**: Switch the language to EN via the header language menu while on
`/awards`. Verify all visible strings update to English copy.

**Acceptance Scenarios**:

1. **Given** the user has selected EN, **When** the awards page loads, **Then** all UI
   labels MUST be rendered in English using the i18n message catalogue (`messages/en.json`
   etc.).
2. **Given** the user is on `/awards` in VN, **When** they switch to EN via the header,
   **Then** the language change MUST persist (cookie / Supabase user setting per existing
   i18n flow), and the page MUST re-render in EN without a full reload.
3. **Given** an award has only VN copy in the data source, **When** EN is selected, **Then**
   the page MUST fall back to the VN copy and emit a console-level i18n-missing warning in
   non-production environments. **No empty strings or `undefined` are allowed in the UI.**

---

### User Story 5 - Unauthenticated visitor is redirected to Login (Priority: P1)

Per the constitution and the Login spec, all routes other than `/` and `/auth/callback` are
protected. Hitting `/awards` without a valid Supabase session MUST redirect to Login.

**Why this priority**: Security gate. Required by Principle V (Security First — OWASP) and
the application-wide auth contract documented in `SCREENFLOW.md`.

**Independent Test**: Open `/awards` in an incognito window with no session. Verify a
redirect to `/` (Login) before any awards content renders.

**Acceptance Scenarios**:

1. **Given** a visitor with no Supabase session, **When** they navigate to `/awards`,
   **Then** the server MUST redirect (HTTP 307/302) to the Login route before the awards
   page is server-rendered.
2. **Given** a visitor whose session has expired, **When** the page is rendered, **Then**
   any subsequent client-side data fetch (e.g. `/api/awards`) MUST receive `401`, and the
   client MUST redirect to Login.
3. **Given** a successful login from `/awards`, **When** the user authenticates, **Then**
   the post-auth redirect MUST return them to `/awards` (preserve `redirectTo` per the
   existing `/auth/callback` contract).

---

### User Story 6 - Responsive on mobile and tablet (Priority: P3)

The Figma source is desktop-only (1440 px). The web app supports mobile (≥ 360 px) and
tablet (≥ 768 px). The page MUST remain usable at smaller widths: side menu collapses into
a horizontal scrollable strip, award rows stack vertically (image above content), title/value
typography scales down. Locked-in default breakpoint values (chosen by review on 2026-04-26;
override locally if design later publishes mobile / tablet frames) are in
[`./design-style.md`](./design-style.md) § Responsive.

**Why this priority**: Important for completeness and constitution compliance, but the
primary audience uses desktop browsers.

**Independent Test**: Resize the browser to 375 px wide. Verify all six award rows render
top-to-bottom without horizontal scroll, the side menu becomes a horizontal scroller, and
the CTA fills the available width.

**Acceptance Scenarios**:

1. **Given** a viewport ≤ 767 px, **When** the awards page renders, **Then** the layout MUST
   collapse to a single column with image stacked above content for each award row
   (the desktop zig-zag alternation MUST be dropped — every row uses the same image-on-top,
   content-below order on mobile), and the side menu MUST become a horizontal scroll strip
   pinned below the header.
2. **Given** a viewport ≥ 768 px and < 1280 px, **When** the awards page renders, **Then**
   the side-menu / list two-column layout MUST be retained but with reduced gutter (per
   tablet token map in `design-style.md`).
3. **Given** any responsive breakpoint, **When** a side-menu item is clicked, **Then** the
   anchor-scroll behaviour MUST still work and the active state MUST track scroll position.

---

### Edge Cases

- **Empty awards list**: If `/api/awards` returns zero categories, the page MUST render the
  page title, the Sun* Kudos block, and a graceful empty-state in the awards section
  ("Award details are not available yet."). The side menu MUST be hidden in this case.
- **Partial awards list**: If `/api/awards` returns fewer than six categories, only the
  returned ones MUST render — both in the menu and in the list — preserving the order
  supplied by the API. The zig-zag alternation (FR-002a) MUST still be applied based on
  render index (first card image-left, second card image-right, …).
- **Slow image load**: Award images use `mix-blend-mode: screen` and a soft glow shadow.
  Image load MUST be lazy (`loading="lazy"`) for rows below the fold, and the image
  container MUST display a placeholder background (`bg-[--color-bg-page-deep]`) until the
  image loads — never a layout shift.
- **Anchor target missing**: If the URL hash refers to a slug not present in the loaded
  data (e.g. `/awards#unknown`), the page MUST scroll to the top and not throw, and the
  first menu item MUST become active.
- **Reduced-motion preference**: When `prefers-reduced-motion: reduce`, the smooth-scroll
  on anchor click MUST switch to instant scroll, and the optional image hover scale MUST
  be disabled.
- **Network failure on awards data**: A failed `/api/awards` fetch MUST display an inline
  error placeholder ("Không tải được danh sách giải thưởng. Vui lòng thử lại.") with a
  retry button; the side menu MUST be hidden until the data is available.
- **Hash deep-link from external referrer**: When entering with a hash from outside the app
  (e.g. emailed link), the auth gate redirects to Login first; on success the user MUST
  return to `/awards` with the hash preserved.

---

## UI/UX Requirements *(from Figma)*

> Visual specs (colors, typography, spacing, dimensions, shadows, ASCII layout, component
> mappings) are documented in [`./design-style.md`](./design-style.md). This section
> enumerates the components and their interactions; refer to design-style for pixel values.

### Screen Components

| Component                                  | Node ID         | Description                                                                 | Interactions                                                                                  |
| ------------------------------------------ | --------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Shared Header (`A1`)                       | `313:8440`      | Sticky top bar — logo, primary nav (About SAA / Award Information / Sun* Kudos), language switcher, avatar dropdown. Reused from Homepage SAA. | See Homepage spec; "Award Information" item is in **active** state on this screen. |
| Keyvisual (`3`)                            | `313:8437`      | Decorative banner image with cover gradient (`linear-gradient` defined in design-style.md). | Display only; `alt="Keyvisual Sun* Annual Award 2025"`. |
| Page Title (`A`)                           | `313:8453`      | Vertical stack: eyebrow "Sun* Annual Awards 2025" → divider → main title "Hệ thống giải thưởng SAA 2025". | Display only.                                            |
| Side Menu container (`C_Menu list`)        | `313:8459`      | Sticky left column listing six award categories.                            | Click each item → smooth-scroll to matching `D.x` and update URL hash. Active state follows scroll. |
| Side Menu item — `C.1` Top Talent          | `313:8460`      | Active-state nav item (yellow + bottom border + glow).                      | Click → scroll to `#top-talent`. Hover / focus / active states per design-style § 2.         |
| Side Menu item — `C.2` Top Project         | `313:8461`      | Inactive-state nav item.                                                    | Click → scroll to `#top-project`.                                                            |
| Side Menu item — `C.3` Top Project Leader  | `313:8462`      | Inactive-state nav item.                                                    | Click → scroll to `#top-project-leader`.                                                     |
| Side Menu item — `C.4` Best Manager        | `313:8463`      | Inactive-state nav item.                                                    | Click → scroll to `#best-manager`.                                                           |
| Side Menu item — `C.5` Signature 2025 - Creator | `313:8464` | Inactive-state nav item.                                                    | Click → scroll to `#signature-2025-creator`.                                                 |
| Side Menu item — `C.6` MVP                 | `313:8465`      | Inactive-state nav item.                                                    | Click → scroll to `#mvp`.                                                                    |
| Award row — `D.1` Top Talent               | `313:8467`      | **image-LEFT** (Frame 506) — Image (336²) on the left, content panel on the right (title, description, quantity, value, caption). | Display only.                                              |
| Award row — `D.2` Top Project              | `313:8468`      | **image-RIGHT** (Frame 507) — content panel on the left, image on the right. Quantity 02 — Tập thể; value 15.000.000 VNĐ.        | Display only.                                              |
| Award row — `D.3` Top Project Leader       | `313:8469`      | **image-LEFT** (Frame 506). Quantity 03 — Cá nhân; value 7.000.000 VNĐ.                                                          | Display only.                                              |
| Award row — `D.4` Best Manager             | `313:8470`      | **image-RIGHT** (Frame 507). Quantity 01 — Cá nhân; value 10.000.000 VNĐ.                                                        | Display only.                                              |
| Award row — `D.5` Signature 2025 - Creator | `313:8471`      | **image-LEFT** (Frame 506). Quantity 01; value 5.000.000 VNĐ (cá nhân) / 8.000.000 VNĐ (tập thể) — TWO value lines.              | Display only.                                              |
| Award row — `D.6` MVP                      | `313:8510`      | **image-RIGHT** (Frame 507). Title "MVP (Most Valuable Person)"; quantity 01; value 15.000.000 VNĐ.                              | Display only.                                              |
| Sun* Kudos promo block (`D1_Sunkudos`)     | `335:12023`     | Two-column horizontal block: `D2_Content` (eyebrow + title + description + "Chi tiết" CTA) on the LEFT, decorative image + KUDOS logo overlay on the RIGHT. **Note**: the Figma node is a `GROUP` with absolutely-positioned children — implement as a flex row, ignore the inherited `flex-direction: column` style. | Click "Chi tiết" → navigate to Sun* Kudos screen. |
| "Chi tiết" CTA (`D2.1_Button-IC`)          | `I335:12023;313:8426` | Yellow rectangular button with trailing chevron icon.                  | Click → navigate to Sun* Kudos. Hover / focus / active states per design-style § 4b.         |
| Section dividers                            | various 1px `#2E3940` | Horizontal rules between blocks (title divider, between award rows, footer top border). | Display only.                                                                                |
| Shared Footer                               | `354:4323`      | Footer instance with secondary nav and legal text. Reused from Homepage SAA. | See Homepage spec.                                                                           |

### Navigation Flow

> Source of truth: `.momorph/SCREENFLOW.md` § "Screen Detail — Awards Information" (after
> screenflow update). Per constitution Principle IV, all destinations below MUST be derived
> from that document.

#### Entries (other screens → Awards Information)

| Trigger                                                              | Hash anchor                  |
| -------------------------------------------------------------------- | ---------------------------- |
| Homepage SAA — header/footer "Award Information"                     | (none — page top)            |
| Homepage SAA — hero CTA "ABOUT AWARDS"                               | (none — page top)            |
| Homepage SAA — Award card "Top Talent"                               | `#top-talent`                |
| Homepage SAA — Award card "Top Project"                              | `#top-project`               |
| Homepage SAA — Award card "Top Project Leader"                       | `#top-project-leader`        |
| Homepage SAA — Award card "Best Manager"                             | `#best-manager`              |
| Homepage SAA — Award card "Signature 2025 - Creator"                 | `#signature-2025-creator`    |
| Homepage SAA — Award card "MVP"                                      | `#mvp`                       |

#### Exits (Awards Information → other screens)

| Trigger                                                              | Destination                                  |
| -------------------------------------------------------------------- | -------------------------------------------- |
| Header logo / "About SAA 2025"                                       | Homepage SAA                                 |
| Header "Sun* Kudos" / Footer "Sun* Kudos" / D2.1 "Chi tiết" CTA      | Sun* Kudos (`/kudos`)                        |
| Header avatar → "Profile"                                            | Profile                                      |
| Header avatar → "Admin Dashboard" (admin only)                       | Admin Dashboard                              |
| Header avatar → "Sign out"                                           | Login                                        |
| Header language menu (VN / EN)                                       | (overlay; no route change)                   |

#### In-page navigation (no route change, hash only)

| Trigger                              | Action                                                                                                       |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Click side-menu item `C.x`           | Smooth-scroll to matching `D.x`; update `location.hash`; set `C.x` active                                    |
| Manual scroll past `D.x` heading     | Update active side-menu item; update `location.hash` (debounced) — but only for accessibility, not history   |

### Visual Requirements

- **Responsive breakpoints**: Mobile (≥ 360 px), Tablet (≥ 768 px), Desktop (≥ 1280 px) —
  see `design-style.md` § Responsive for the per-breakpoint behaviour. Desktop is the
  Figma-authoritative size; mobile and tablet are locked-in defaults (extrapolated from
  the desktop spacing scale; can be overridden locally without re-spec if design later
  publishes mobile / tablet frames).
- **Animations / Transitions**:
  - Side-menu state changes (color, border, text-shadow) animate over 200 ms ease-in-out.
  - Anchor click → page scroll uses `scroll-behavior: smooth` (~ 400 ms ease-out); MUST
    fall back to `auto` under `prefers-reduced-motion: reduce`.
  - "Chi tiết" CTA hover transitions in 150 ms ease-in-out.
- **Accessibility (WCAG 2.1 AA)**:
  - All text/background pairs meet AA — verified in `design-style.md` § Notes.
  - Active side-menu items MUST also expose `aria-current="true"` (not rely on color alone).
  - Award rows MUST be wrapped in `<section aria-labelledby="…">` with the title `<h2>` as
    the labelled element so screen readers can navigate by section.
  - The "Chi tiết" CTA MUST have an accessible label ("Xem chi tiết Sun* Kudos") even when
    the trailing icon is decorative.
  - Touch targets ≥ 48 × 48 (Material Design 3) — applies to the CTA and side-menu items.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST render the Awards Information page at `/awards` for
  authenticated users only.
- **FR-002**: The page MUST display all six award categories returned by the awards data
  source, in the order returned, with for each: image, title, description (justified rich
  text), "Số lượng giải thưởng:" with quantity + unit, and "Giá trị giải thưởng:" with
  primary monetary value plus optional caption.
- **FR-002a**: Award rows MUST be rendered in an **alternating zig-zag pattern**: rows at
  odd render-index (1st, 3rd, 5th) MUST be `image-left` (image column on the left, content
  column on the right); rows at even render-index (2nd, 4th, 6th) MUST be `image-right`. The
  index is the **render position**, not the slug — so if the API returns an arbitrary subset
  of awards, the alternation MUST always start with `image-left` for the first rendered row.
- **FR-002b**: Each award image (`D.x.1_Picture-Award`) MUST render two stacked image
  layers: the square award background (`imageUrl`) and the centered name-overlay raster
  (`nameOverlayImage`). The overlay is a **pre-rendered image asset, not HTML text** — the
  implementation MUST NOT attempt to render the award title as styled text on top of the
  image. The overlay's `<img alt>` MUST equal the award `name` (i18n-bound), and the
  background `imageUrl` MUST carry `aria-hidden="true"` so screen readers announce the award
  title exactly once.
- **FR-003**: The system MUST support an optional **second value line** per award (used by
  Signature 2025 - Creator) — the data model and UI MUST accept either a single value or a
  pair (e.g. `cá nhân` / `tập thể`).
- **FR-004**: Users MUST be able to click any of the six side-menu items and have the
  matching award row smooth-scroll into view, with the URL hash updated to the corresponding
  slug.
- **FR-005**: As the user scrolls, the system MUST update the active side-menu item to
  match the section currently in the viewport (via `IntersectionObserver`).
- **FR-006**: When the page is loaded with a URL hash (e.g. `/awards#mvp`), the system MUST
  scroll the matching row into view on first paint and set the matching side-menu item to
  active. An invalid hash MUST not throw — it MUST fall back to scrolling to top with the
  first item active.
- **FR-007**: Users MUST be able to click "Chi tiết" in the Sun* Kudos promo block to
  navigate to the Sun* Kudos screen at `/kudos` (route reserved in `SCREENFLOW.md`).
- **FR-008**: The system MUST honour the global language setting (VN default, EN alternate)
  and re-render all visible strings on language change without a full page reload.
- **FR-009**: Unauthenticated requests to `/awards` MUST be server-side redirected to the
  Login screen (`/`), preserving the original URL (including hash) as `redirectTo` so the
  user returns to the same anchor after login.
- **FR-010**: The page MUST present the active "Award Information" item in the shared
  header in its active visual state.
- **FR-011**: The page MUST render the shared header and footer (existing components from
  the Homepage SAA spec) and MUST NOT duplicate or fork them.
- **FR-012**: When the awards data fails to load, the system MUST display an inline error
  with a retry control and MUST hide the side menu until data is available.
- **FR-013**: When the awards data is empty, the system MUST hide the side menu and show
  an empty-state message in the awards-list region; the page title and Sun* Kudos block
  MUST remain visible.

### Technical Requirements

- **TR-001 (Performance)**: First Contentful Paint ≤ 1.5 s on a cold load over a typical
  4G connection (LCP ≤ 2.5 s). Award images below the fold MUST be lazy-loaded.
- **TR-002 (Security — Principle V)**: Auth guard MUST be performed server-side using
  `createServerClient` from Supabase SSR. Client-only guards are NOT acceptable.
  No award metadata MUST contain user-identifying fields.
- **TR-002a (RLS — Principle II)**: If `AwardCategory` is persisted in Supabase, **Row
  Level Security MUST be enabled on the table**. Policy: a single `SELECT` policy
  granting authenticated users (`auth.uid() IS NOT NULL`) read access to all rows. No
  `INSERT` / `UPDATE` / `DELETE` policy on this table is needed for this screen — write
  access is reserved for the (future) Admin Dashboard. The migration PR introducing the
  table MUST include the RLS policy in the same commit (per constitution Development
  Workflow "RLS gate").
- **TR-003 (Stack — Principle II)**: The page MUST be implemented as a React Server
  Component by default. Client components are permitted only for the side-nav scroll-spy
  hook, anchor-click handler, and CTA button.
- **TR-003a (Fonts — Principle II)**: Montserrat (Bold 700) MUST be loaded via
  `next/font/google` with `subsets: ['latin', 'vietnamese']` and `display: 'swap'`. External
  `<link href="https://fonts.googleapis.com/...">` imports are FORBIDDEN. The font instance
  MUST be exported from a single place (e.g. `app/fonts.ts`) and reused across this page,
  the Homepage SAA, and any future page that uses the same family.
- **TR-004 (Tokens — Principle II)**: All colours, spacing, typography, and shadow values
  MUST be consumed via the CSS variables defined in `design-style.md` § Design Tokens —
  hard-coded raw values in component files are forbidden.
- **TR-005 (Tests — Principle III)**: The feature MUST ship with unit tests (formatting
  helpers, scroll-spy hook), an integration test against a real Supabase test instance for
  the awards data fetch, and a Playwright E2E test covering: unauthenticated redirect,
  authenticated render, anchor scroll, active-state tracking, and the "Chi tiết" CTA.
- **TR-006 (i18n)**: All visible strings MUST come from the i18n message catalogue
  (`messages/{vi,en}.json`). Hard-coded user-visible strings are forbidden.
- **TR-007 (Accessibility)**: The page MUST pass automated `axe` checks at each breakpoint
  and MUST be navigable end-to-end with keyboard alone (anchor jumps + CTA + header nav).
- **TR-008 (Source-of-truth navigation — Principle IV)**: Every clickable element on this
  page MUST resolve to a destination documented in `SCREENFLOW.md`. Any element whose
  destination cannot be found there MUST block implementation and be raised to design.

### Key Entities *(if feature involves data)*

- **AwardCategory** — represents one of the six SAA 2025 awards.
  Attributes:
  - `slug` (`'top-talent' | 'top-project' | 'top-project-leader' | 'best-manager' | 'signature-2025-creator' | 'mvp'`) — used as the URL hash.
  - `order` (number) — controls display order in the menu and list.
  - `name` (i18n string) — full title used in the right-hand content panel (e.g. "Top Talent", "MVP (Most Valuable Person)"). i18n-bound (re-renders per locale).
  - `description` (i18n string, may be Markdown / rich text) — the long-form criteria.
  - `imageUrl` (string) — square award image (≥ 336 × 336 px) used as the background of `D.x.1_Picture-Award`.
  - `nameOverlayImage` (string) — pre-rendered raster overlay (e.g. "TOP TALENT", "TOP PROJECT LEADER") that sits centered over `imageUrl`. The text in this asset is **baked in by design** and is **NOT** i18n-bound. Aspect ratio is per-asset (e.g. D.1 ≈ 221 × 35 px single-line, D.3 ≈ 232 × 64 px two-line). The `<img alt>` MUST mirror `name` so screen readers announce the award title once.
  - `quantity` (number) — count of awards in this category.
  - `quantityUnit` (i18n string) — `Đơn vị` | `Tập thể` | `Cá nhân`.
  - `values` (array of `{ amountVnd: number; recipientType?: 'individual' | 'team' | null; caption?: i18n string }`) — usually one entry, two for Signature 2025 - Creator.
- **AwardsResponse** — payload returned by `/api/awards`: `{ items: AwardCategory[] }`.

> No data is **created or modified** by this screen. All entities are read-only here. The
> authoring surface for awards lives in the (future) Admin Dashboard.

---

## API Dependencies

| Endpoint                       | Method | Purpose                                                            | Status                                          |
| ------------------------------ | ------ | ------------------------------------------------------------------ | ----------------------------------------------- |
| Supabase `auth.getSession`     | —      | Server-side session check / route guard                            | Existing (Supabase built-in)                    |
| `/api/users/me`                | GET    | Current user (avatar, name, role) — for shared header              | Predicted (also used by Homepage SAA)           |
| `/api/awards`                  | GET    | Returns the ordered list of `AwardCategory` for menu + list        | **Predicted** — must be created                 |
| `/api/i18n/:locale`            | GET    | Localised message catalogue (or static JSON via `next-intl`)       | Predicted (shared)                              |
| Supabase `auth.signOut`        | —      | Sign out from header avatar dropdown                               | Existing (Supabase built-in; shared with Homepage) |

> Real endpoints MUST replace these predictions before implementation begins. See
> `.momorph/SCREENFLOW.md` § "API Endpoints Summary".

**NOT used on this screen (intentional)**:

| Endpoint              | Why not                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| `/api/kudos/summary`  | The Sun* Kudos promo block (`D1_Sunkudos`) on this page is a **purely promotional teaser** — its eyebrow ("Phong trào ghi nhận"), title ("Sun* Kudos"), description, and "Chi tiết" CTA are static text supplied by the i18n catalogue. Live Kudos data (pings, leaderboard, etc.) belongs to the Sun* Kudos screen at `/kudos`, not here. Avoiding the call here saves a request on every awards page view. |

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100 % of authenticated users landing on `/awards` see all six award
  categories rendered in correct order with all five fields (image, title, description,
  quantity, value).
- **SC-002**: Click-through rate from the side-menu items to the corresponding award
  detail row is ≥ 95 % on first click (measured by hash-update + scroll-completion telemetry,
  with no double-clicks needed).
- **SC-003**: Lighthouse mobile score ≥ 90 for Performance and ≥ 95 for Accessibility on
  the awards page.
- **SC-004**: Zero unauthenticated requests reach the awards data endpoint in production
  logs (verified weekly).
- **SC-005**: For users arriving via a Homepage award-card deep-link
  (`/awards#<slug>`), the targeted award row is in the viewport on first interaction
  ≥ 99 % of the time (measured by IntersectionObserver telemetry on first paint).

---

## Out of Scope

- Award **creation, editing, or moderation** — those flows belong to the future Admin
  Dashboard.
- Voting, nomination, or submission to any award — not part of this screen.
- Detail pages **per award** with deeper drill-down content beyond the on-page row.
- Award-recipient announcements, leaderboards, or historical winners.
- Sharing an award row to social media or copying a deep link from a button (the URL hash
  is updated as a side-effect of scrolling but no "share" UI is provided here).
- The Sun* Kudos screen itself (it is the destination of the "Chi tiết" CTA, not part of
  this spec).
- The Floating Widget Button visible on Homepage SAA — it is **not** present on this
  screen.

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [x] Screen flow documented (`.momorph/SCREENFLOW.md` includes Awards Information)
- [x] Design-style document (`./design-style.md`) — required for visual specs
- [x] Login spec (`.momorph/specs/GzbNeVGJHz-Login/spec.md`) — defines auth gate / redirect
- [x] Homepage SAA spec (`.momorph/specs/i87tDx10uM-Homepage-SAA/spec.md`) — defines shared
      header/footer, language switcher, avatar dropdown, and the inbound deep-link slugs
- [ ] API specifications (`/api/awards`, `/api/users/me`, `/api/i18n/:locale`) — to be
      authored under `.momorph/api-docs.yaml`
- [ ] Database design (`AwardCategory` table or equivalent) — to be authored
- [x] Sun* Kudos route reserved as `/kudos` (2026-04-26) — Sun* Kudos screen spec is still pending but no longer blocks this page.

---

## Notes

- The page is **information-display only**. Treat it as an editorial / marketing page that
  happens to be authenticated, not as a transactional surface.
- The `slug` set used for award anchors is the contract between this screen and the
  Homepage SAA award cards. **Do not rename a slug** without updating both specs and the
  Homepage implementation.
- The Signature 2025 - Creator award has **two value lines** (individual + team). The
  `AwardCategory.values` entity is intentionally an array, not a single field, to model
  this without a special case.
- The award name overlaid on each award image (e.g. "TOP TALENT") is a **raster asset** —
  see FR-002b and `design-style.md` § 3a. Implementations MUST NOT recreate it as styled
  HTML text; the overlay is therefore not localised, while the right-hand title row IS
  localised via the i18n-bound `name` field.
- Vietnamese is the default UI language; English is fallback. The Figma source is in
  Vietnamese.
- Visuals (gradient cover, glow shadow, mix-blend-mode on award images) are
  brand-critical — do not substitute simpler equivalents during implementation.
- Open question (tracked in `SCREENFLOW.md`): final route for Homepage SAA. The locked-in
  `/awards` route here is independent of that decision and does not block.
- Sun* Kudos route is locked as `/kudos` even though the screen itself is still pending
  discovery — this lets us build, test, and ship the awards page without blocking on the
  Sun* Kudos screen spec. If design later picks a different route, only the link target
  needs to change (one constant in i18n / config).
