# Feature Specification: Homepage SAA (About SAA 2025)

**Frame ID**: `i87tDx10uM`
**Frame Name**: `Homepage SAA`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-04-22
**Status**: Draft

---

## Overview

The **Homepage SAA** (route `/about-saa-2025`, the landing page after successful Google sign-in) introduces the Sun\* Annual Awards 2025 event. It anchors the user's journey into the awards programme by:

1. Rendering a **"ROOT FURTHER"** hero banner with a live **countdown timer** to the event start date, event logistics (time + venue), and two primary CTAs (**ABOUT AWARDS**, **ABOUT KUDOS**) linking to the deeper-information screens.
2. Telling the campaign story (the "Root Further" philosophy) through a long-form narrative block (B4).
3. Presenting the six **award categories** as a responsive card grid, each card deep-linking (with hash anchor) into the Awards Information page for the relevant category.
4. Promoting the **Sun\* Kudos** recognition movement via a dedicated block with its own CTA.
5. Providing persistent navigation through the global `<Header>` and `<Footer>`, plus a floating **quick-action widget** button pinned to the bottom-right corner.

**Target users**: all authenticated Sunners (employees of Sun\* Vietnam) who have completed the Google-OAuth login on `/`. Admin role users additionally see "Admin Dashboard" in the avatar dropdown.

**Business context**: The homepage is the first post-auth surface. It must (a) communicate event identity (brand, dates, motivation), (b) funnel users into the three sibling screens — Awards Information, Sun\* Kudos, and Profile — and (c) reinforce the campaign by creating urgency via the countdown to the event on **26/12/2025** at **Âu Cơ Art Center**. The event start hour (18h30) is consumed by the countdown calculation via `NEXT_PUBLIC_SAA_EVENT_START` but is not displayed as a standalone value on the Homepage — the B2 "Thời gian" field shows the event **date** (26/12/2025).

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Landing experience & campaign identity (Priority: P1)

As a signed-in Sunner, when I arrive at the homepage, I am greeted by the "ROOT FURTHER" hero with a live countdown, campaign narrative, and clear paths into the awards content, so I immediately understand what SAA 2025 is about and where to click next.

**Why this priority**: This is the entry point for every authenticated user. Without a working hero + navigation, the rest of the product is unreachable.

**Independent Test**: With a seeded authenticated session and `NEXT_PUBLIC_SAA_EVENT_START` set, visit `/about-saa-2025`. Verify the hero renders "ROOT FURTHER", the countdown shows ≥ 0 Days/Hours/Minutes (zero-padded), event info reads "Thời gian: 26/12/2025" + "Địa điểm: Âu Cơ Art Center" + "Tường thuật trực tiếp qua sóng Livestream", the two CTAs are interactive, and both Header and Footer links render correctly.

**Acceptance Scenarios**:

1. **Given** an authenticated user visits `/about-saa-2025` **when** the page renders **then** header shows logo + "About SAA 2025" (selected/active), "Awards Information", "Sun\* Kudos" + language selector + notification bell + avatar button.
2. **Given** the event start is in the future **when** the page loads **then** "Comming soon" subtitle (Figma typo with two m's preserved verbatim) is visible, and the countdown displays three tiles (DAYS, HOURS, MINUTES) with 2-digit zero-padded values matching `floor((eventStart − now)/unit)`.
3. **Given** the event start is in the past **when** the page loads **then** "Comming soon" subtitle (Figma typo with two m's preserved verbatim) is hidden and all three countdown tiles display `00`.
4. **Given** the countdown is running **when** a full minute elapses on the client **then** the displayed values update without a full page reload (60-second tick).
5. **Given** the user clicks "ABOUT AWARDS" **when** the click fires **then** the browser navigates to `/awards-information`.
6. **Given** the user clicks "ABOUT KUDOS" **when** the click fires **then** the browser navigates to `/sun-kudos`.
7. **Given** the viewport is <768px **when** the page renders **then** the hero title uses `clamp(72px,18vw,200px)`, CTAs stack vertically full-width, and the countdown tiles shrink to 88×96.
8. **Given** the user tabs through the page **when** focus reaches each CTA/link/button **then** a visible focus ring (2px #FFEA9E with 2px offset) is rendered and hit-target is ≥ 48px.

---

### User Story 2 - Award categories discovery (Priority: P1)

As a Sunner, I want to browse the six award categories on the homepage and deep-link into the detailed page for each one, so I can quickly learn what each award recognises without having to scroll through a long single-page list.

**Why this priority**: The award grid is the primary funnel from the homepage to the Awards Information page and is the single highest-density block of content the user will scan. Without it the homepage fails to deliver on the "system-of-awards" promise.

**Independent Test**: Render the homepage and verify that exactly six cards (Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025 - Creator, MVP) are displayed in a 3-column desktop grid (2-column tablet, 1-column mobile); clicking any image / title / "Chi tiết" link on a card triggers a navigation to `/awards-information#<slug>`.

**Acceptance Scenarios**:

1. **Given** the awards section **when** the page renders on desktop ≥1280px **then** the six cards display in a 3×2 grid with `gap-x:108 gap-y:80`.
2. **Given** the awards section **when** viewport is 768–1279px **then** the grid collapses to 2 columns × 3 rows.
3. **Given** the awards section **when** viewport is <768px **then** the grid collapses to 1 column × 6 rows, cards expand to 100% width, the image maintains 1:1 aspect-ratio.
4. **Given** a user hovers any card **when** the hover is active **then** the card translates up by 4px and the gold glow intensifies (box-shadow gains ~25% opacity).
5. **Given** a user clicks the card image OR title OR "Chi tiết" link **when** the click fires **then** the app navigates to `/awards-information` and scrolls to the anchor whose id matches the card's slug (e.g. `#top-talent`).
6. **Given** a description longer than 2 lines **when** rendered **then** it is truncated with ellipsis and the full text is available via the card's `title` attribute / screen-reader label.

---

### User Story 3 - Sun\* Kudos promotion block (Priority: P2)

As a Sunner, I want a dedicated homepage block explaining the Sun\* Kudos movement with a "Chi tiết" CTA, so that even if I do not notice "ABOUT KUDOS" in the hero, I still have a second, larger entry point into the Kudos page.

**Why this priority**: Sun\* Kudos is new in SAA 2025 (ĐIỂM MỚI CỦA SAA 2025) and needs extra emphasis; however the page remains usable without it, so it is P2.

**Independent Test**: Scroll to the D1 block, verify title "Sun\* Kudos", kicker "Phong trào ghi nhận", descriptive paragraph, and a yellow "Chi tiết" button. Clicking the button navigates to `/sun-kudos`.

**Acceptance Scenarios**:

1. **Given** the D1 block **when** the page renders on desktop **then** the block is 1224×500px with the content column on the left (457×408) and the KUDOS watermark/background on the right.
2. **Given** the "Chi tiết" button **when** clicked **then** navigate to `/sun-kudos`.
3. **Given** a <768px viewport **when** the block renders **then** the decorative background image is hidden (or reduced to `background-position: right center` with opacity), the content stacks to full-width, and the KUDOS watermark is hidden.

---

### User Story 4 - Global navigation (Header + Footer) (Priority: P1)

As any authenticated user, I want persistent header and footer navigation with active-link indication so I can move between About SAA 2025, Awards Information, and Sun\* Kudos at any time — and log out, switch language, or check notifications.

**Why this priority**: Every screen in this app depends on this shared navigation; it is the backbone of the information architecture.

**Independent Test**: Each of the three top-level nav items (About SAA 2025, Awards Information, Sun\* Kudos) is rendered in both header and footer; the one matching the current route has the **selected** visual (Montserrat 700 14/20 ls:0.10 #FFEA9E + underline). The other two use normal styling and change on hover. Language, bell, and avatar controls each open their respective menus.

**Acceptance Scenarios**:

1. **Given** the current route is `/about-saa-2025` **when** the header renders **then** the "About SAA 2025" link shows the selected state, the others show the default state.
2. **Given** the user hovers an inactive nav link **when** the hover fires **then** the link text becomes `#FFEA9E` with a subtle background (`rgba(255,255,255,0.10)`).
3. **Given** the current-route link is clicked **when** the click fires **then** the browser scrolls to the top of the page (no navigation).
4. **Given** the user clicks the language button **when** the menu opens **then** "VN" / "EN" options are selectable and switch the interface language using the existing Login `LanguageSelector` pattern.
5. **Given** the user clicks the avatar button **when** the menu opens **then** options "Profile", "Sign out", and (admin role only) "Admin Dashboard" are visible; clicking "Sign out" invalidates the Supabase session and returns to `/`.
6. **Given** the user has unread notifications **when** the header renders **then** a red badge (#D4271D, 8×8) appears on the bell icon; clicking the bell opens a notification panel (panel spec is out of scope for this screen).
7. **Given** the user clicks the logo **when** the click fires **then** the browser navigates to `/about-saa-2025` (or scrolls to top if already there).
8. **Given** the footer **when** the page renders **then** links (About SAA 2025, Awards Information, Sun\* Kudos, Tiêu chuẩn chung) mirror header behaviour; copyright "Bản quyền thuộc về Sun\* © 2025" is visible and non-interactive.

---

### User Story 5 - Quick-action widget button (Priority: P3)

As a Sunner, I want a floating quick-action pill button (bottom-right) so that common actions (write Kudos, view SAA rules) are always one click away without scrolling back to the top.

**Why this priority**: Useful accelerator but the page is fully functional without it. The destinations for the inner icons are still TBD (flagged in SCREENFLOW.md), so implementation of click behaviour is deferred until those are confirmed.

**Independent Test**: At all viewports the widget renders pinned bottom-right; it does not obstruct the footer when the user scrolls to the absolute bottom.

**Acceptance Scenarios**:

1. **Given** any scroll position **when** the page renders **then** the widget sits `position: fixed; right: 32px; bottom: 96px` on desktop.
2. **Given** the user hovers the widget **when** the hover fires **then** the pill scales to 1.05 and the background transitions to hover colour.
3. **Given** the widget is clicked **when** the click fires **then** a menu opens (contents TBD — MUST be flagged with a TODO and `console.warn` stub in implementation).
4. **Given** the footer is in view **when** the widget would overlap the footer **then** the widget is hidden (or its `bottom` offset is increased to keep footer-link clickable).

---

### User Story 6 - Long-form "Root Further" narrative (Priority: P2)

As a Sunner new to SAA, I want to read the "Root Further" campaign story directly on the homepage, so I understand the concept and intent of this year's event without being redirected to a separate page.

**Why this priority**: Important for brand storytelling but non-blocking for navigation or awards discovery.

**Independent Test**: The B4 block below the hero displays the multi-paragraph narrative plus the centered pull-quote "A tree with deep roots fears no storm (Cây sâu bền rễ, bão giông chẳng nề - Ngạn ngữ Anh)".

**Acceptance Scenarios**:

1. **Given** the B4 block **when** rendered on desktop **then** it displays at 1152px max-width, body text uses Montserrat 400 16/24 ls:0.5 #FFFFFF, and the quote is centered with slight emphasis.
2. **Given** a ≤768px viewport **when** rendered **then** body text reduces to 14/22 and padding-x to 16.
3. **Given** the user selects text **when** selection occurs **then** copy-paste preserves paragraph structure (no forced `&nbsp;`, no CSS column hacks).

---

### Edge Cases

- **Countdown reaches exactly 0**: all three tiles render `00`, "Coming soon" hides, and optionally an "Event is live!" state fires (out of scope for now — keep tiles at `00`).
- **Event start date passed in unparsable format** (e.g. missing env var or bad ISO): render tiles as `--` and log a warning; do NOT crash the page.
- **User on the homepage clicks "About SAA 2025"**: scroll to top smoothly (no network).
- **Supabase session expires while the page is open**: the next navigation click MUST redirect to `/` (rely on existing `proxy.ts` middleware; no additional client check needed).
- **User has no avatar image** (currently default for all): avatar button shows the generic user icon SVG.
- **Network is offline**: header/footer + static content still render (RSC); countdown freezes at last known values; language switch fails gracefully (keep current locale).
- **Award card description longer than 2 lines**: the CSS MUST truncate with ellipsis via `-webkit-line-clamp: 2` and set `title={fullDescription}` on the card so screen readers and pointer hover read the full copy. A `min-height` on the description slot MUST reserve exactly 2 lines (48px at 16/24) so rows stay aligned even if one card is single-line.
- **Widget button + chat/notification panel open simultaneously**: widget MUST remain clickable; stacking order `z-index: 20` beats card hovers but sits below modals (z:50).

---

## UI/UX Requirements *(from Figma)*

Full visual specifications — colors, typography, spacing, component states — live in [design-style.md](./design-style.md). The summary below covers the navigation and interaction behaviours that drive implementation decisions.

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| `A1_Header` (`2167:9091`) | Global header with logo, 3 nav links, language selector, bell, avatar | Click logo → scroll to top; click nav link → navigate or scroll; hover → highlight; active link → underline + gold; click language → open VN/EN menu; click bell → open notifications panel (out of scope); click avatar → open Profile / Sign out / Admin Dashboard menu |
| `3.5_Keyvisual` hero | Background image + gradients + ROOT FURTHER title + countdown + event info + 2 CTAs | Static visual; CTAs clickable |
| `B1_Countdown` (`2167:9035`) | Coming-soon subtitle + 3 countdown tiles | Auto-update every 60s (client); hide subtitle when t=0 |
| `B3_Call-To-Action` (`2167:9062`) | Two buttons — "ABOUT AWARDS" and "ABOUT KUDOS" — rendered with **identical visual treatment** (same `<HeroCtaButton>` component). Both default to outlined (10% yellow fill, gold border, white text) and turn solid yellow (black text) on hover/focus. The Figma reference deliberately shows B3.1 in hover state and B3.2 in normal state to demonstrate both states side-by-side. | Click → navigate |
| `B4_content` (`5001:14827`) | Multi-paragraph campaign narrative + centered quote | Static; text-selectable |
| `C1_Header` (`2167:9069`) | Caption "Sun* annual awards 2025" + 1px divider + section title "Hệ thống giải thưởng" (no descriptor — see design-style.md §C1 spec correction) | Static |
| `C2_Award list` (`5005:14974`) | Grid of 6 award cards | Click image / title / "Chi tiết" → navigate to `/awards-information#<slug>`; hover → lift + glow |
| `D1_Sunkudos` (`3390:10349`) | Promo block: "Phong trào ghi nhận" kicker + "Sun\* Kudos" title + body description (starts with "ĐIỂM MỚI CỦA SAA 2025…") + small yellow "Chi tiết" button. Decorative "Sun\* S + KUDOS" logo asset fills the right half (not pure text — it's a raster/SVG logo image under the `MM_MEDIA_Logo/Kudos` node). | Click "Chi tiết" → navigate to `/sun-kudos` |
| `6_Widget Button` (`5022:15169`) | Floating quick-action pill | Click → open quick-action menu (TBD) |
| `7_Footer` (`5001:14800`) | Global footer with logo, 4 links, copyright | Same interactions as header; no controls; click logo → scroll to top |

### Navigation Flow

- **From**: `/` (Login screen, `GzbNeVGJHz`) on successful OAuth callback, or direct URL entry on an authenticated session.
- **To**:
  - `/awards-information` — clicked "ABOUT AWARDS" CTA, any of the 6 award cards (with hash anchor), header/footer "Awards Information" link.
  - `/sun-kudos` — clicked "ABOUT KUDOS" CTA, D1 "Chi tiết" button, header/footer "Sun\* Kudos" link.
  - `/profile` — avatar dropdown → "Profile" (TBD screen).
  - `/admin` — avatar dropdown → "Admin Dashboard" (admin-only; TBD screen).
  - `/` (Login) — avatar dropdown → "Sign out" after Supabase session invalidation.
- **Triggers**: All navigation edges are listed in `.momorph/SCREENFLOW.md` (updated 2026-04-22).

### Visual Requirements

- **Responsive breakpoints**: Mobile <768px, Tablet 768–1279px, Desktop ≥1280px. Specifics: see [design-style.md — Responsive Specifications](./design-style.md#responsive-specifications).
- **Animations / Transitions**: see [design-style.md — Animation & Transitions](./design-style.md#animation--transitions).
- **Accessibility**: WCAG 2.1 AA compliant.
  - Keyboard tab order follows logical reading order: logo → header nav links → language → bell → avatar → (hero:) hero CTAs → (body:) award cards (in DOM order) → each card's "Chi tiết" link → Kudos "Chi tiết" → widget button → footer logo → footer nav links.
  - All interactive elements ≥48px hit target (verified: header 56px, CTAs 60px, card links 56px, avatar/bell 40px × but tap-target inflated via `::before` overlay).
  - Focus rings visible: `2px solid #FFEA9E` with `outline-offset: 2px` on all interactive elements.
  - Images have `alt` attributes; decorative visuals (hero BG, Kudos logomark background) have `aria-hidden="true"` and empty `alt=""`.
  - **Countdown**: wrapped in `<div aria-live="polite" aria-atomic="true">` so screen readers politely announce each minute tick. The explicit `role="timer"` is NOT used (limited AT support per WAI-ARIA 1.1); the live region pattern is equivalent for NVDA/JAWS/VoiceOver.
  - **Dropdowns** (language, avatar): `aria-haspopup="menu"` on trigger, `aria-expanded` syncs with open state; first menu item receives focus on open; `Escape` closes and returns focus to trigger.
  - **Hover-only actions** (card lift, widget scale) MUST have a visible `:focus-visible` equivalent so keyboard users see the same cue.
  - **Color contrast verified WCAG 2.1 AA**: #FFFFFF on #00101A = 18.7:1; #FFEA9E on #00101A = 14.8:1; #00101A on #FFEA9E = 14.8:1.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The page MUST render server-side (React Server Component) by default. Only `<Countdown>`, `<HeaderNav>` (for active-route detection), `<LanguageSelector>` (reused), `<NotificationButton>`, `<AvatarMenu>`, and `<WidgetButton>` MAY be Client Components.
- **FR-002**: The system MUST redirect unauthenticated visitors to `/` (Login). This is enforced by the existing `proxy.ts` middleware — **no duplicate guard in the page is required**.
- **FR-003**: The countdown target date MUST come from `process.env.NEXT_PUBLIC_SAA_EVENT_START` (ISO-8601). If the variable is missing or unparsable, the tiles MUST render `--` and a `console.warn` MUST be logged.
- **FR-004**: The countdown MUST update at most once per 60 seconds on the client. The initial HTML MUST be server-rendered with the correct values to avoid a layout shift.
- **FR-005**: All 6 award cards MUST render from a single typed list (e.g. `AWARDS: readonly AwardSpec[]` in `lib/awards.ts`) so adding / removing a category requires only one file change.
- **FR-006**: Clicking an award card, "Chi tiết" link, or hero "ABOUT AWARDS" CTA MUST navigate to `/awards-information` with the correct hash anchor (`#<slug>`) — implementers MUST use `next/link` (not `<a>`) so client-side navigation works.
- **FR-006a**: The two hero CTA buttons ("ABOUT AWARDS", "ABOUT KUDOS") MUST share a single `<HeroCtaButton>` implementation. Default state is outlined (`rgba(255,234,158,0.10)` fill, `#998C5F` border, `#FFFFFF` text, `#FFFFFF` icon); `:hover` and `:focus-visible` MUST switch to solid yellow (`#FFEA9E` fill, no border, `#00101A` text, `#00101A` icon). The apparent primary/secondary distinction in the Figma frame is a state demo — the two buttons are NOT different variants.
- **FR-007**: The header MUST visually indicate the current route (`/about-saa-2025` → "About SAA 2025" selected). Implementation SHOULD use `usePathname()` from `next/navigation` in a Client `<HeaderNav>` component.
- **FR-008**: Clicking the currently selected header or footer link MUST smooth-scroll to the top of the page instead of triggering a network navigation.
- **FR-009**: The avatar dropdown MUST show "Admin Dashboard" only if the user's Supabase JWT `role` claim includes `"admin"`. Derivation of this claim is out of scope for this screen — receive via a server-side `getUserRole()` helper that returns `'user' | 'admin'`.
- **FR-010**: The "Sign out" action MUST call `supabase.auth.signOut()` then redirect to `/`.
- **FR-011**: The language selector MUST reuse the existing Login `<LanguageSelector>` implementation — no duplicate code.
- **FR-012**: All localised strings MUST reside in `i18n/messages/vi.json` and `i18n/messages/en.json` under a `home` namespace.
- **FR-013**: Widget button clicks MUST open a menu; the menu's destinations are TBD (flagged in SCREENFLOW.md) — implementer MUST stub the handler with a `console.warn` and still render the pill.

### Technical Requirements

- **TR-001**: Page first-contentful-paint (FCP) MUST be ≤ 1.5s on a throttled Moto G4 (Slow 4G). Award card images MUST use `next/image` with `priority` on above-the-fold items (hero BG only; cards are below the fold).
- **TR-002**: Respect Constitution §II — all colors/spacing MUST be CSS variables declared in `app/globals.css` and consumed via `var()` / Tailwind `bg-[var(--token)]` utilities. No hard-coded hex in JSX.
- **TR-003**: Respect Constitution §V — no secrets in client bundles. `NEXT_PUBLIC_SAA_EVENT_START` is safe to expose (it is the event date, not a credential).
- **TR-004**: Respect Constitution §III (TDD) — tests MUST be authored (and MUST fail-then-pass) for:
  - `<Countdown>` — SSR-to-client hydration stability, 60s tick, missing env fallback
  - `<CountdownTile>` — zero-padding, `--` fallback
  - `<HeaderNav>` — active-link detection via `usePathname()`, selected state class, current-link click scrolls-to-top without navigation
  - `<HeroCtaButton>` — renders in default outlined state; `:hover` and `:focus-visible` flip to filled yellow; click navigates via `router.push`
  - `<AwardCard>` — title/description/image/slug rendering, hash-anchor href, 2-line clamp with `min-height: 48px`
  - `<AvatarMenu>` — admin-only "Admin Dashboard" item, focus-trap, Escape/outside-click, sign-out redirect
  - `<NotificationButton>` — badge shown only when `count > 0`; fetch error hides badge silently
  - `<WidgetButton>` — fixed positioning at all viewports; click triggers stub handler with `console.warn`
  - `<KudosCtaButton>` — small-size variant, navigation to `/sun-kudos`
  - `<KudosLogomark>` — renders image asset with correct `aria-label`
  - Page-level RSC — authenticated-only render (401 redirect-loop regression), seeded session shows all sections, unauthenticated path redirects via `proxy.ts`
  - E2E (Playwright): Login → Homepage → click any Award card → assert URL contains `/awards-information#<slug>`; Login → Homepage → avatar menu → Sign out → back at `/`
- **TR-005**: All icons MUST be React components under `components/icons/` returning `<svg>` elements. No raw `<img>` for icons, no SVG file imports.
- **TR-006**: The countdown MUST NOT introduce a hydration mismatch — SSR renders using `new Date()` at request time, and the client re-hydrates with the same value then starts ticking.
- **TR-007**: `<AvatarMenu>` MUST trap focus and close on `Escape` / outside click — reuse the pattern from the existing `<LanguageSelector>`.
- **TR-008**: Respect Constitution §II — TypeScript strict mode. NO `any` type without an inline comment justifying why narrowing is impossible. All component props MUST have explicit TS interfaces; all server helper return types MUST be explicitly annotated.
- **TR-009**: The avatar dropdown MUST be anchored below the avatar button (default placement: `top: 48px; right: 0`) and collision-check so it never overflows the viewport right edge. Use the same positional pattern as `<LanguageSelector>` — absolute-positioned inside a relatively-positioned wrapper.
- **TR-010**: Z-index scale MUST follow the design-style.md Z-index table — no ad-hoc values in JSX.

### Key Entities

- **AwardSpec** (compile-time constant): `{ id: string; titleKey: string; descriptionKey: string; image: string; slug: string }` × 6
- **User session** (from Supabase `auth.getUser()`): `{ id: string; email: string; role: 'user' | 'admin' }` — only the `role` is consumed directly.
- **Event metadata** (from env var): `{ startAt: ISOString }` — read once on the server; passed to `<Countdown>` as a prop.

---

## Data Requirements

### Display fields

This page renders **no user input fields** (all user-writable state is server-sourced or navigation-only). The display fields consumed are:

| Field | Source | Format / Validation | Fallback |
|-------|--------|----------------------|----------|
| Countdown remainder | `NEXT_PUBLIC_SAA_EVENT_START` env var, computed against server `new Date()` on RSC render | ISO-8601 `YYYY-MM-DDTHH:mm:ss±HH:mm` parseable by `new Date()`. MUST be in the future for a live countdown; past timestamps collapse tiles to `00`. | Parse failure → tiles render `--`, `console.warn("Invalid NEXT_PUBLIC_SAA_EVENT_START")`, "Comming soon" subtitle (Figma typo with two m's preserved verbatim) hidden |
| Event date ("Thời gian" value) | Static i18n key `home.event.date_value` — default VN: `"26/12/2025"` | Free-form localised string — NOT parsed, displayed as-is | N/A (static) |
| Event venue ("Địa điểm" value) | Static i18n key `home.event.location_value` — default VN: `"Âu Cơ Art Center"` | Free-form localised string | N/A |
| Livestream note | Static i18n key `home.event.livestream_note` — default VN: `"Tường thuật trực tiếp qua sóng Livestream"` | Free-form localised string | N/A |
| Hero title | Static — may be rendered as SVG asset (see design-style.md) | N/A | N/A |
| "Root Further" narrative (B4) | Static i18n keys `home.about.body_p1 … body_pN`, `home.about.quote`, `home.about.quote_source` | Free-form paragraphs, preserves newlines | N/A |
| Award card title (×6) | Static i18n keys `home.awards.<slug>.title` | Free-form localised string; MAY include parentheses (e.g. "MVP (Most Valuable Person)") | N/A |
| Award card description (×6) | Static i18n keys `home.awards.<slug>.description` | Free-form localised string. Rendering MUST `-webkit-line-clamp: 2` with 48px min-height. | N/A |
| Award card image (×6) | Static asset at `/public/assets/home/awards/<slug>.png` (bundled; see Dependencies) | 1:1 aspect-ratio PNG, transparent or on-dark background, ≥ 336×336 intrinsic | Build MUST fail if any asset is missing |
| Kudos kicker ("Phong trào ghi nhận") | Static i18n key `home.kudos.kicker` | Free-form | N/A |
| Kudos title ("Sun\* Kudos") | Static i18n key `home.kudos.title` | Free-form | N/A |
| Kudos description | Static i18n key `home.kudos.description` | Free-form; begins with "ĐIỂM MỚI CỦA SAA 2025" in default VN copy; NOT split into a separate kicker | N/A |
| User role | Supabase session `app_metadata.role` (via `getUserRole()` helper) | `'user' \| 'admin'`; any other value MUST be treated as `'user'` | Missing → `'user'` |
| Unread notifications count | `GET /api/notifications/unread-count` (or stub → `0`) | `{ count: number }`, `count ≥ 0` | Fetch error → badge hidden (no error UI) |

### Listed award slugs (i18n key → slug → target anchor)

| i18n key | Slug | Target |
|----------|------|--------|
| `home.awards.top-talent.title` / `.description` | `top-talent` | `/awards-information#top-talent` |
| `home.awards.top-project.title` / `.description` | `top-project` | `/awards-information#top-project` |
| `home.awards.top-project-leader.title` / `.description` | `top-project-leader` | `/awards-information#top-project-leader` |
| `home.awards.best-manager.title` / `.description` | `best-manager` | `/awards-information#best-manager` |
| `home.awards.signature-2025-creator.title` / `.description` | `signature-2025-creator` | `/awards-information#signature-2025-creator` |
| `home.awards.mvp.title` / `.description` | `mvp` | `/awards-information#mvp` |

---

## State Management

This page is predominantly **stateless**: it is a React Server Component rendering static content plus a handful of Client Components for live behaviour. No React Query / SWR / Redux / Zustand store is required.

### Local state (per-component)

| Component | State | Type | Transitions |
|-----------|-------|------|-------------|
| `<Countdown>` (Client) | `{ days, hours, minutes }` | `{ days: number \| '--', hours: number \| '--', minutes: number \| '--' }` | Initialised from SSR-rendered value (to prevent hydration mismatch) → `setInterval(60_000)` recomputes from `targetDate` vs `Date.now()` |
| `<HeaderNav>` (Client) | Active pathname | derived from `usePathname()` | Updates on route change (next/navigation) |
| `<AvatarMenu>` (Client) | `isOpen: boolean` | local `useState` | Toggled by click / `Escape` / outside-click; reuses LanguageSelector pattern |
| `<LanguageSelector>` (Client, reused from Login) | `isOpen: boolean` | local `useState` | Same pattern as `<AvatarMenu>` |
| `<NotificationButton>` (Client) | `{ unreadCount: number, isPanelOpen: boolean }` | local `useState` + fetch hook | Count fetched on mount; panel open/close toggled by click (panel contents out of scope) |
| `<WidgetButton>` (Client) | `isMenuOpen: boolean` | local `useState` | Click toggle; menu destinations TBD — stubbed |

### Global / shared state

| Slice | Source | Consumers | Notes |
|-------|--------|-----------|-------|
| Authenticated user (id, email, role) | Supabase SSR `supabase.auth.getUser()` in root layout / page | Page-level RSC (to compute `isAdmin` for `<AvatarMenu>`) | Already propagated as a prop via React tree; no React context needed |
| Active locale | `next-intl` `getLocale()` in RSC, `useLocale()` in Client | All i18n text | Reuse Login's infrastructure |
| Pathname | `next/navigation` `usePathname()` in Client | `<HeaderNav>`, `<FooterNav>` | Only in Client islands |

### Loading states

| Trigger | UI |
|---------|----|
| Initial page load | SSR HTML arrives fully rendered (countdown pre-computed). No client skeleton required. |
| `GET /api/notifications/unread-count` in flight | Bell icon renders without a badge until resolution. No spinner, no layout shift. |
| `<AvatarMenu>` → "Sign out" click | Menu item disabled + "Signing out…" label; blocks re-click while promise pending. |
| Language switch (reused behaviour) | No spinner — `router.refresh()` after cookie write (matches Login pattern). |

### Error states

| Error | UX |
|-------|-----|
| `NEXT_PUBLIC_SAA_EVENT_START` missing / unparsable | Tiles render `--`; "Comming soon" hidden; `console.warn` — page remains fully interactive. |
| Unread-count fetch fails (network/5xx) | Badge hidden silently; no toast (non-blocking). |
| `signOut()` throws | Inline error message below avatar menu ("Could not sign out — try again"); Supabase session state unchanged. |
| Clicking a nav link whose destination page is not yet deployed | Falls through to Next.js 404 page — not this screen's concern. |

No empty-state illustrations are required: all sections contain static content or 6 statically configured cards.

---

## API Dependencies

Predicted endpoints. Status "New" means the endpoint does not yet exist in `.momorph/contexts/api-docs.yaml`.

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `supabase.auth.getUser()` | — | Verify session on RSC render (already used on Login) | Exists (Supabase SDK) |
| `supabase.auth.signOut()` | — | Sign out from avatar menu | Exists (Supabase SDK) |
| `GET /api/notifications/unread-count` | GET | Returns `{ count: number }` for the bell badge | **New** — can be stubbed to `0` until backend ships |
| `GET /api/user/role` | GET | Returns `{ role: 'user' \| 'admin' }` — used to conditionally show Admin Dashboard | **New** — can read JWT `app_metadata.role` directly from Supabase SSR session instead (preferred) |

No database writes are performed on this page. No form submissions.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: ≥ 95% of authenticated users land on the homepage within 2 seconds of completing OAuth callback (measured via Real User Monitoring on `/auth/callback` → `/about-saa-2025`).
- **SC-002**: Click-through rate on "ABOUT AWARDS" + any award card ≥ 40% of homepage visits (event funnel analytics).
- **SC-003**: Click-through rate on "ABOUT KUDOS" + D1 "Chi tiết" ≥ 15% of homepage visits.
- **SC-004**: Lighthouse accessibility score ≥ 95 on desktop & mobile.
- **SC-005**: All 31 tests from Login remain green after shared `<Header>`/`<Footer>` extensions; new Homepage test suite ≥ 20 tests across unit (Vitest) and integration (Vitest + a live Supabase test project) — with at least one E2E flow (Playwright) covering Login → Homepage → any Award card → Awards Information placeholder page.

---

## Out of Scope

- **Notifications panel content** — the bell button opens a panel whose internals are not defined in this Figma frame. Only the button, badge, and open/close toggle are in scope here.
- **Profile page**, **Admin Dashboard page**, **Awards Information page**, **Sun\* Kudos page** — linked from this screen but specified in their own future `.momorph/specs/` entries.
- **Widget button menu items** — destinations TBD.
- **Notification push / realtime** — the badge is static (from HTTP count endpoint) in v1.
- **Internationalisation beyond VN / EN** — only these two locales are supported (matches Login).
- **Image CMS** — award card thumbnails are bundled static assets (`/public/assets/home/awards/*.png`) in v1; admin-editable uploads are not in scope.

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [x] Screen flow documented (`.momorph/SCREENFLOW.md` — updated 2026-04-22 to include Homepage SAA)
- [x] Login screen spec (`GzbNeVGJHz-Login/spec.md`) exists — provides session check, `<Header>`, `<Footer>`, `<LanguageSelector>`, hero-BG pattern to build on.
- [x] Design style documented (`./design-style.md`)
- [ ] **Final route confirmed** (currently `/about-saa-2025` — alternative is `/`). Resolves `TODO(POST_AUTH_REDIRECT)` in the Login spec and SCREENFLOW open-questions list. Implementation MUST NOT start until this is answered.
- [ ] API specifications for unread-count + user-role — either defined in `.momorph/contexts/api-docs.yaml` or approved to read directly from the Supabase JWT.
- [x] **Countdown font supplied** — `public/fonts/DSEG7Classic-Bold.woff2` (DSEG7-Classic Bold, SIL OFL — open-source 7-segment LCD font swapped in for Figma's proprietary `Digital Numbers`). Wired via `next/font/local` in `app/layout.tsx` exposing `var(--font-digital)`. License preserved at `public/fonts/DSEG-LICENSE.txt`. See design-style.md §Notes "Countdown font swap" for rationale.
- [ ] Hero "ROOT FURTHER" wordmark exported from Figma as SVG (see design-style.md §B.0 note) OR design confirms the web-font fallback is acceptable.
- [ ] Award category images finalised (`/public/assets/home/awards/top-talent.png`, `top-project.png`, `top-project-leader.png`, `best-manager.png`, `signature-2025-creator.png`, `mvp.png`) and the hero BG image for this screen (`/public/assets/home/hero-bg.jpg`).
- [ ] Sun\* Kudos promo background image (`/public/assets/home/kudos-bg.png`) and the Kudos logomark SVG (`/public/assets/home/kudos-logomark.svg` — red Sun\* "S" mark + gold "KUDOS" wordmark).
- [ ] Widget pencil & SAA-logo icon SVGs supplied.
- [ ] **Final copy for 5 of 6 award card descriptions** — the Figma reference shows placeholder/repeated copy for Top Project Leader, Best Manager, Signature 2025 - Creator, Top Project, and MVP cards. Only Top Talent has confirmed description: "Vinh danh top cá nhân xuất sắc trên mọi phương diện". Content team MUST supply localised copy for the other 5 + EN translations for all 6.
- [ ] **Full VN body copy for B4 "Root Further" narrative** (~1090px tall block) + the centered pull-quote "A tree with deep roots fears no storm / Cây sâu bền rễ, bão giông chẳng nề — Ngạn ngữ Anh". EN translations required.
- [ ] Kudos block body copy confirmation (current VN draft in design-style.md §D2 Content).

---

## Notes

- The existing `<Header>` (`components/ui/header.tsx`) from Login currently hosts only the logo + a single slot for `<LanguageSelector>`. This screen requires it to grow into a full 3-link nav with an `isActive` state-aware link component and an `<AvatarMenu>` + `<NotificationButton>`. Implementers SHOULD refactor `<Header>` into `<Header>` (layout) + `<HeaderNav>` (links) + `<HeaderControls>` (right-side bell/lang/avatar), not duplicate.
- **`NEXT_PUBLIC_SAA_EVENT_START`** should be set to `2025-12-26T18:30:00+07:00` (Asia/Ho_Chi_Minh) per the Figma event metadata.
- The hero background image for this screen is DIFFERENT from the Login hero BG — the Login version shows colorful waves on the right; this screen shows a root-inspired illustration behind the "ROOT FURTHER" title. Both reuse the same gradient overlay pattern.
- The navigation destinations `/awards-information`, `/sun-kudos`, `/profile`, `/admin` are all stubs today. Implementation of this screen MUST NOT assume they exist — any click in tests should mock `router.push`. The linked screens will be implemented in subsequent MoMorph cycles.
- The dropdown-profile node in Figma (`721:5223`) is referenced by `A1.8_Button-IC` but lives outside this frame; its design details will be captured when we specify the `Dropdown-profile` screen separately.
