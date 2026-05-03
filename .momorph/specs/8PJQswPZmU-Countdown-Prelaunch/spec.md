# Feature Specification: Countdown - Prelaunch page

**Frame ID**: `2268:35127`
**Frame Name**: `Countdown - Prelaunch page`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-04-26
**Status**: Draft

---

## Overview

The **Countdown - Prelaunch page** is the publicly served holding screen displayed to **every visitor** of the application during the SAA 2025 prelaunch window — i.e. the period between deployment and the public launch of the Login experience. It contains:

1. A full-bleed brand keyvisual (the "Root Further" coloured root illustration) with a diagonal `#00101A → transparent` cover gradient that keeps the upper-left quadrant dark for legibility.
2. A centered headline **"Sự kiện sẽ bắt đầu sau"** ("The event will start in").
3. A live countdown showing **Days / Hours / Minutes** (no Seconds, no header, no footer, no language switch, no login affordance) until the launch cut-off (`NEXT_PUBLIC_PRELAUNCH_END`).

When the cut-off passes, the server-side middleware that gates the application stops redirecting traffic here; the very next request lands on the regular Login screen (`/`, `GzbNeVGJHz`). The prelaunch page itself does not perform any client-side navigation — there are zero buttons, zero links, zero forms.

**Target users**: anyone visiting any URL on the SAA 2025 hostname during the prelaunch window — authenticated or not, internal Sun\* employees or external visitors who guess the URL. Authentication state is **ignored** here.

**Business context**: The prelaunch gate prevents partial / pre-release content from being scraped, screenshotted, or shared before the official announcement. A single env-driven date controls when the gate lifts, so coordinating launch with a marketing announcement is a one-line config change rather than a code deploy. The countdown also creates a small amount of brand presence (the keyvisual + the "Sự kiện sẽ bắt đầu sau" copy) so the URL is not a dead 404 to early visitors.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor sees the prelaunch holding page (Priority: P1)

As a visitor (any role, any auth state) requesting any URL during the prelaunch window, I am served the **Countdown - Prelaunch page** with the keyvisual BG, the "Sự kiện sẽ bắt đầu sau" headline, and a live Days/Hours/Minutes timer that visibly ticks at most once per minute, so that I understand the site is online but the experience is gated until the launch date.

**Why this priority**: This is the entire feature. Without it, prelaunch traffic either 404s or — worse — sees pre-release content before the cut-off.

**Independent Test**: With `NEXT_PUBLIC_PRELAUNCH_END` set to a future ISO-8601 timestamp, request `/`, `/about-saa-2025`, `/awards-information`, `/sun-kudos`, and `/random-typo`. All five MUST render the prelaunch HTML (same `<title>`, same headline, same 6 digit tiles). Wait 60 s in the browser and verify the displayed minute tile decremented by 1 without a full page reload.

**Acceptance Scenarios**:

1. **Given** `NEXT_PUBLIC_PRELAUNCH_END` is in the future **when** the visitor requests `/` **then** the page renders with the keyvisual BG, headline "Sự kiện sẽ bắt đầu sau", and three countdown units labelled DAYS / HOURS / MINUTES, each showing a 2-digit zero-padded value.
2. **Given** the prelaunch window is active **when** the visitor requests any other route (`/about-saa-2025`, `/awards-information`, `/sun-kudos`, `/foo`) **then** the server middleware rewrites/redirects to the prelaunch route — the visitor MUST see the prelaunch page, not the requested route.
3. **Given** the page is open **when** a full minute elapses on the client clock **then** the displayed `MINUTES` tile (or `HOURS` / `DAYS` if a minute / hour boundary is crossed) updates to the new value via a `setInterval(60_000)` recompute. No full page reload occurs.
4. **Given** an authenticated user with a valid Supabase session **when** they visit any URL during the prelaunch window **then** they ALSO see the prelaunch page; their session is not terminated, but it is not honoured for navigation purposes either.
5. **Given** the visitor uses keyboard navigation **when** they press Tab **then** focus does NOT visibly land on any element (there are no interactive elements). Screen readers announce the headline as a level-1 heading and the countdown as a polite live region.
6. **Given** the visitor's preference is `prefers-reduced-motion: reduce` **when** the minute tick fires **then** the digit value swaps without an opacity fade or flip animation.

---

### User Story 2 - Cut-off has passed; gate lifts (Priority: P1)

As a visitor requesting any URL **after** `NEXT_PUBLIC_PRELAUNCH_END`, the server middleware MUST stop redirecting; my request MUST resolve to the originally targeted route (Login `/` for unauthenticated visitors, `/about-saa-2025` for authenticated ones), so that the prelaunch page is invisible after launch with zero further configuration.

**Why this priority**: A prelaunch gate that doesn't lift is a launch incident. The lift behaviour is part of the feature, not a separate one.

**Independent Test**: Set `NEXT_PUBLIC_PRELAUNCH_END` to a past ISO-8601 timestamp, restart the server, request `/` — observe the regular Login screen, NOT the prelaunch page. Request `/about-saa-2025` while authenticated — observe the Homepage SAA, NOT the prelaunch page.

**Acceptance Scenarios**:

1. **Given** `NEXT_PUBLIC_PRELAUNCH_END < now()` at request time **when** an unauthenticated visitor requests `/` **then** the response is the Login screen (`GzbNeVGJHz` spec) — the prelaunch page is NOT rendered.
2. **Given** the cut-off has passed **when** an authenticated visitor requests `/about-saa-2025` **then** the response is the Homepage SAA — the prelaunch page is NOT rendered.
3. **Given** a visitor is currently looking at the prelaunch page (loaded just before the cut-off) **when** the cut-off passes during their session **then** the prelaunch page does NOT auto-redirect on the client; the existing tab continues to display `00 / 00 / 00`. **Only the next navigation or refresh** lands on the regular app. (No client-side polling — keeps the page truly static.)
4. **Given** the cut-off has passed **when** a visitor requests the prelaunch route directly (e.g. `/prelaunch`) **then** the response is a 404 OR a redirect to `/` — the prelaunch route MUST NOT remain reachable post-cutoff.

---

### User Story 3 - Misconfigured env var (Priority: P2)

As an operator, when `NEXT_PUBLIC_PRELAUNCH_END` is missing or unparsable, the page must degrade gracefully — render the keyvisual + headline + dashes (`--`) in all 6 digit tiles — rather than crash or display a stack trace, so that an env-var typo at deploy time doesn't take the marketing surface offline.

**Why this priority**: Failure mode for an ops mistake. Important for resilience but not a happy-path user experience.

**Independent Test**: Unset `NEXT_PUBLIC_PRELAUNCH_END`, request the prelaunch route — verify (a) the headline is visible, (b) all 6 tiles show `--`, (c) `console.warn("Invalid NEXT_PUBLIC_PRELAUNCH_END")` is logged, (d) no React error boundary triggered, (e) the page is still 200 OK.

**Acceptance Scenarios**:

1. **Given** `NEXT_PUBLIC_PRELAUNCH_END` is unset / empty / not a parseable ISO-8601 timestamp **when** the page renders **then** all 6 digit tiles display the literal `-` glyph (one per tile, ie. `-` `-` for Days, `-` `-` for Hours, `-` `-` for Minutes), the headline is visible, and the page returns HTTP 200.
2. **Given** the same misconfiguration **when** the page renders **then** a `console.warn` MUST be emitted with the message `Invalid NEXT_PUBLIC_PRELAUNCH_END` so operators can spot it in logs.
3. **Given** the env var is unparsable **when** the gate middleware runs **then** the gate MUST default to **inactive** — i.e. requests are forwarded to their original destinations rather than redirected to the prelaunch page. Rationale: a config typo MUST NOT lock the entire site behind a permanently broken countdown.

---

### Edge Cases

- **Cut-off reaches exactly 0** (countdown runs out while the page is open): all three tiles render `00` and the page stays put. No client-side redirect fires.
- **System clock skew**: countdown is computed against `Date.now()` (browser local). Skew of a few minutes is acceptable; users will see the value sync up after the next minute tick. The gate decision (server) uses `Date.now()` on the **server**, so the redirect honours real time, not the visitor's clock.
- **No JS available** (extreme edge — e.g. text browsers, accessibility scenarios): the SSR render includes the initial values inline, so even with JS off the user sees a static "X DAYS Y HOURS Z MINUTES" snapshot of the moment they loaded.
- **Hydration mismatch**: SSR computes `remaining` from `Date.now()` at request time; the client mount MUST reuse the same `targetDate` ISO and recompute (which yields effectively the same value, possibly off by a fraction of a second) — round to the minute when displaying so the displayed digits match.
- **Repeated prelaunch redirects**: if the gate accidentally redirects the prelaunch route back to itself, the middleware would loop. Allowlist the prelaunch path explicitly.
- **Static asset 304s during the gate**: `/_next/*`, `/favicon.ico`, `/public/*` MUST be excluded from the gate so the prelaunch page itself can render its CSS/JS bundles.
- **Visitor refreshes after `NEXT_PUBLIC_PRELAUNCH_END`**: the next request flows through the (now-passive) middleware and lands on `/` (Login) — see User Story 2, Scenario 3.

---

## UI/UX Requirements *(from Figma)*

Full visual specifications — colors, typography, spacing, and layout — live in [design-style.md](./design-style.md). The summary below covers behavioural decisions only.

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| `MM_MEDIA_BG Image` (`2268:35129`) | Full-bleed keyvisual background — coloured root illustration. Decorative. | None — `aria-hidden="true"`. |
| `Cover` gradient overlay (`2268:35130`) | Diagonal `#00101A → transparent` cover preserving left-side legibility. | None — `pointer-events: none; aria-hidden="true"`. |
| `Bìa` container (`2268:35131`) | Centered flex column with 96/144 padding and 120 px section gap. | Layout only. |
| Headline (`2268:35137`, "Sự kiện sẽ bắt đầu sau") | Montserrat 700 36/48 #FFFFFF, center-aligned, rendered as `<h1>`. | Static. |
| `Time` row (`2268:35138`) | Horizontal flex row of 3 countdown units, 60 px gap, items-center. | Static. |
| Countdown unit (`2268:35139` / `…44` / `…49`) | One unit = two digit tiles + a label ("DAYS", "HOURS", "MINUTES"). 175 × 192. | Auto-update once per minute via `setInterval(60_000)`. |
| Digit tile (Group 5/4 instances) | Single 76.8 × 122.88 glass-card (rounded 12 px, 0.75 px gold border @ 50 %, white→white/10 % gradient, backdrop-blur 24.96 px). Digit text "0"–"9" or "-". | Auto-update via parent unit's tick. |

### Navigation Flow

- **From**: Any URL on the application hostname — the server-side prelaunch gate (extension of `proxy.ts`) rewrites/redirects every non-asset request here while `Date.now() < NEXT_PUBLIC_PRELAUNCH_END`. There are no in-app entry points.
- **To**: Once the cut-off has passed, the gate is inactive — visitors flow to the originally requested route. From the prelaunch page itself, **no client-side navigation occurs**.
- **Triggers**: time only (`NEXT_PUBLIC_PRELAUNCH_END`). Not user action.

### Visual Requirements

- **Responsive breakpoints**: Mobile <768 px, Tablet 768–1279 px, Desktop ≥1280 px. Specifics: see [design-style.md — Responsive Specifications](./design-style.md#responsive-specifications).
- **Animations / Transitions**: minimal. The optional opacity fade on a value tick MUST be skipped under `prefers-reduced-motion: reduce`.
- **Accessibility**: WCAG 2.1 AA target.
  - Headline rendered as `<h1>`.
  - Countdown wrapped in `<div role="timer" aria-live="polite" aria-atomic="true">` so screen readers politely announce each minute tick. (Use `aria-live` over the bare `role="timer"` because AT support for `role="timer"` is uneven; the live-region pattern is well-supported on NVDA/JAWS/VoiceOver.)
  - Decorative BG + cover gradient: `aria-hidden="true"` and empty `alt=""`.
  - No interactive elements ⇒ no focus rings, no keyboard handlers, no skip-link required.
  - Color contrast: `#FFFFFF` on `#00101A` = 18.7 :1 (PASS). White digit on the glass tile sitting over the colourful side of the BG MAY drop below 4.5 :1 — verify in implementation; if low, increase the tile's bottom-stop opacity (currently 10 %) or add a faint inner overlay.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The page MUST render server-side (React Server Component) by default. Only the live `<CountdownTimer>` (the wrapper that owns the `setInterval`) is a Client Component.
- **FR-002**: The countdown target date MUST come from `process.env.NEXT_PUBLIC_PRELAUNCH_END` (ISO-8601). When missing or unparsable, two independent fallbacks apply:
  - **Gate-side (middleware)** — defaults to **inactive**: requests are forwarded to their original destinations. This prevents an env typo from locking the entire site behind a permanently broken countdown. (Most users will therefore NEVER see the prelaunch page in this state.)
  - **Page-side (when the prelaunch page IS rendered anyway** — e.g. dev environment, direct `/prelaunch` request, or a deployment that hard-wires this route): all 6 digit tiles render the literal `-` glyph (one per tile), the headline remains visible, and `console.warn("Invalid NEXT_PUBLIC_PRELAUNCH_END")` is emitted. No React error boundary triggers; the page returns 200 OK.
- **FR-003**: The countdown MUST update at most once per 60 seconds on the client. The initial HTML MUST be SSR-rendered with the correct values to avoid layout shift and hydration mismatch.
- **FR-004**: The countdown displays exactly **3 units**: Days, Hours, Minutes. NO Seconds tile. NO additional units. Each unit shows a 2-digit zero-padded integer, capped at `99` for Days (use `99` for any value `≥ 100` and log a warning).
- **FR-005**: The page MUST contain **zero interactive elements** — no `<a>`, no `<button>`, no `<form>`, no `<input>`, no language toggle, no logo link. Adding interactivity here is explicitly out of scope and breaks the "neutral holding page" intent.
- **FR-006**: The prelaunch gate MUST be implemented in the existing `proxy.ts` middleware (or a new middleware composed before it). The gate MUST:
  - **rewrite** (using `NextResponse.rewrite()` — URL bar stays on the original path; visitor does not see `/prelaunch` in the address bar) every request whose `pathname` is **not** in the allowlist to the prelaunch route, while `Date.now() < NEXT_PUBLIC_PRELAUNCH_END`;
  - allowlist the prelaunch route itself, `/_next/*`, `/favicon.ico`, `/public/*`, and any health-check endpoint (e.g. `/api/health`) to avoid loops and to keep static assets reachable;
  - become a no-op once the cut-off has passed — the next request hits its real destination with no further config change required.
- **FR-007**: The prelaunch route MUST NOT be reachable directly after the cut-off. Either return 404 or redirect to `/`.
- **FR-008**: All localized strings (currently only "Sự kiện sẽ bắt đầu sau", "DAYS", "HOURS", "MINUTES") MUST live in `i18n/messages/{vi,en}.json` under a `prelaunch` namespace, even though the prelaunch page does NOT itself expose a language switcher (Constitution & long-term-i18n consistency).
- **FR-009**: The headline element MUST be an `<h1>` — there is no other heading on the page, so the page-rank-1 heading slot belongs to it.
- **FR-010**: The countdown wrapper MUST be `<div aria-live="polite" aria-atomic="true">` so the minute tick is announced.
- **FR-011**: The countdown MUST round its display down to the minute (`Math.floor`) — never up. A 1m 59s remainder displays as `1` minute, never `2`.
- **FR-012**: The page MUST set `<title>` to the localised value of `prelaunch.headline` (e.g. `"Sự kiện sẽ bắt đầu sau"`). MUST set `<meta name="robots" content="noindex,nofollow">` so the prelaunch page is NOT indexed by search engines (otherwise the launch-day index could still serve the prelaunch page from cache). MUST set a minimal `<meta name="description">` value (the same as the headline). No Open Graph / Twitter Card metadata is required for v1.
- **FR-013**: When the countdown reaches zero on the client (`remaining ≤ 0`), the page MUST NOT auto-redirect (no `router.push('/')`, no `window.location.assign`). The tiles MUST display `00 / 00 / 00` and the page stays put. The **server-side gate** is the single source of truth for routing decisions — the client never participates.

### Technical Requirements

- **TR-001**: First-contentful-paint (FCP) MUST be ≤ 1.0 s on a throttled Moto G4 (Slow 4G). Because the page is RSC + a single keyvisual image + ~5 KB of font, this should be trivially achievable.
- **TR-002**: Respect Constitution §II — all colors / spacing / typography MUST be CSS variables in `app/globals.css` and consumed via `var()` / Tailwind `bg-[var(--token)]`. No hard-coded hex / px in JSX.
- **TR-003**: Respect Constitution §V — `NEXT_PUBLIC_PRELAUNCH_END` is safe to expose (a date is not a credential).
- **TR-004**: Respect Constitution §III (TDD) — tests MUST be authored (and MUST fail-then-pass) for:
  - `<PrelaunchCountdown>` Client Component — SSR-to-client hydration stability, 60 s tick, missing env fallback to `--`.
  - `<DigitTile>` — renders a single character; falls back to `-` when given `null`/`undefined`; computed font + glass styles match the design tokens.
  - `<CountdownUnit>` — renders 2 tiles + label; receives a 2-digit string (`"00"`–`"99"`) and splits it across the tiles.
  - Page-level RSC — env-var present → renders correct tile values; env-var missing → renders `--` + warning.
  - Middleware (gate) — `now < cutoff` rewrites `/`, `/about-saa-2025`, etc.; allowlists `/_next/*`, `/favicon.ico`, the prelaunch route itself; `now ≥ cutoff` is a pass-through; missing/unparsable env-var is treated as inactive.
  - E2E (Playwright): set the env, request `/`, assert prelaunch HTML; clear the env, request `/`, assert Login HTML.
- **TR-005**: The page MUST NOT introduce a hydration mismatch — SSR uses a single `targetDate` (parsed once from the env-var, frozen in the bundle), client mount uses the same value and starts ticking from the same baseline.
- **TR-006**: The page MUST NOT add new dependencies. Use the existing `Date` global, the existing `next-intl` setup, the existing `next/font/local` DSEG7 binding from Homepage SAA, and the existing `proxy.ts` middleware.
- **TR-007**: TypeScript strict — no `any` types without justifying inline comment. All component props have explicit interfaces.
- **TR-008**: The Z-index scale (`--z-bg-image: 0`, `--z-bg-cover: 1`, `--z-content: 2`) MUST come from the design-style.md table — no ad-hoc values.

### Key Entities

- **PrelaunchConfig** (compile-time constant from env): `{ targetDate: ISOString | null }`. Read once at SSR render; passed as a prop to the Client `<CountdownTimer>`.
- **CountdownRemaining**: `{ days: number | '--'; hours: number | '--'; minutes: number | '--' }` — local state inside `<CountdownTimer>`.
- No persistent entities, no database table, no API resource. The screen is pure presentation.

---

## Data Requirements

### Display fields

This page renders **no user input fields**. Display fields:

| Field | Source | Format / Validation | Fallback |
|-------|--------|----------------------|----------|
| Countdown remainder | `NEXT_PUBLIC_PRELAUNCH_END` env var, **confirmed value `2026-06-07T18:30:00+07:00`**, computed against server `Date.now()` on RSC render and re-computed every 60 s on the client | ISO-8601 `YYYY-MM-DDTHH:mm:ss±HH:mm` parseable by `new Date()`. | Parse failure → tiles render `--`, `console.warn("Invalid NEXT_PUBLIC_PRELAUNCH_END")`. |
| Headline | Static i18n key `prelaunch.headline` — default VN: `"Sự kiện sẽ bắt đầu sau"` | Free-form localised string | N/A |
| Unit labels | Static i18n keys `prelaunch.days_label`, `…hours_label`, `…minutes_label` — default VN: `"DAYS"` / `"HOURS"` / `"MINUTES"` (uppercase, English) | Free-form localised string | N/A — these are uppercase English in the Figma reference; translators MAY decide to localise them in `vi.json` (e.g. `"NGÀY"` / `"GIỜ"` / `"PHÚT"`) but that is a content decision, not an implementation gate. |
| Keyvisual BG asset | Shared static asset at `/public/assets/home/hero-bg.jpg` (already in repo — same image as `/about-saa-2025`) | full-bleed JPG, existing file | N/A — file already exists; no build guard needed |

### i18n keys

```jsonc
{
  "prelaunch": {
    "headline": "Sự kiện sẽ bắt đầu sau",
    "days_label": "DAYS",
    "hours_label": "HOURS",
    "minutes_label": "MINUTES"
  }
}
```

---

## State Management

This page is predominantly **stateless**: a single Client island (`<PrelaunchCountdown>`) owns the tick interval; everything else is RSC.

### Local state (per-component)

| Component | State | Type | Transitions |
|-----------|-------|------|-------------|
| `<PrelaunchCountdown>` (Client) | `{ days, hours, minutes }` | `{ days: number \| '--', hours: number \| '--', minutes: number \| '--' }` | Initialised from SSR-rendered values to prevent hydration mismatch → `setInterval(60_000)` recomputes from `targetDate` vs `Date.now()`; `setInterval` cleared on unmount. |

### Global / shared state

None. No React Query, no SWR, no Redux, no Zustand. No context. No cookies are read or written by the page.

### Loading / error states

| Trigger | UI |
|---------|----|
| Initial page load | SSR HTML arrives fully rendered (countdown pre-computed). No client skeleton. |
| `NEXT_PUBLIC_PRELAUNCH_END` missing/unparsable | Tiles render `--`; headline visible; `console.warn` — page remains 200 OK, no error boundary triggered. |
| Cut-off reached during session | Tiles freeze at `00`; no client redirect. |
| Cut-off passed at request time (visitor refreshes / new request) | Page is **not served** — the gate stops redirecting; visitor lands on the regular Login screen. |

No empty-state illustration is required: the page IS the empty state for the entire app.

---

## API Dependencies

Predicted endpoints. Status "None" means this screen does not require any.

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| (none) | — | The page is statically rendered; the countdown target is read from a build-time env var. There is no backend round-trip. | None |

No database reads. No database writes. No form submissions. Constitution §II RLS / §V security review do not apply because there is no user-supplied data and no authenticated context.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100 % of requests during the prelaunch window resolve to the prelaunch page (verified via a synthetic monitor hitting `/`, `/about-saa-2025`, `/awards-information`, `/sun-kudos`, and `/foo`).
- **SC-002**: Prelaunch page Lighthouse Performance ≥ 95, Accessibility ≥ 100, Best Practices ≥ 95 on desktop AND mobile profiles.
- **SC-003**: Within 5 minutes of `NEXT_PUBLIC_PRELAUNCH_END` passing, fresh requests no longer hit the prelaunch route (verified via the same synthetic monitor — auto-fails if any sample still returns prelaunch HTML).
- **SC-004**: 0 hydration warnings in the browser console during initial load (verified by a Playwright assertion that captures `console.warn`/`console.error` and asserts `0` warnings except the optional env-missing warning).
- **SC-005**: 0 layout shifts (CLS) — the countdown's SSR + client values match exactly.

---

## Out of Scope

- **Notification / email capture during prelaunch** — there is no "Notify me on launch" form on this screen. The current Figma frame intentionally omits it.
- **Language switcher** — no `<LanguageSelector>` is rendered. If marketing later requests one, it is a separate spec change.
- **Logo / branding header** — no Sun\* logo on this screen by design (the keyvisual itself is the brand surface).
- **Footer** — no footer at all. No copyright line. (The cut-off is short — typically days — so a long-running marketing footer was deemed unnecessary.)
- **Authentication** — even authenticated users see this screen. There is no "sign in to bypass" path.
- **Real-time tick at < 60 s** — Seconds are intentionally not displayed. A second-by-second countdown was rejected on the grounds that (a) it adds visual noise, (b) it produces unnecessary client work, (c) the precision is not useful at the day-scale we expect.
- **Per-route prelaunch overrides** — every route is gated equally. There is no "this one route is exempt" mechanism. Asset paths are excluded by pattern, not by per-route config.
- **Animated number flips / odometer transitions** — out of scope for v1; an optional 200 ms opacity fade on tick is allowed but the spec does not require it.

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [x] Screen flow documented (`.momorph/contexts/SCREENFLOW.md` — updated 2026-04-26 to include this screen)
- [x] Design style documented (`./design-style.md`)
- [x] Existing `proxy.ts` middleware (Login screen) to extend
- [x] Existing DSEG7-Classic Bold font binding from Homepage SAA — reuse `var(--font-digital)` and `public/fonts/DSEG7Classic-Bold.woff2`
- [x] **`NEXT_PUBLIC_PRELAUNCH_END` value confirmed by stakeholder**: `2026-06-07T18:30:00+07:00`. This is the gate-lift moment — the instant the prelaunch holding page stops being served and the SAA app becomes publicly accessible. `NEXT_PUBLIC_SAA_EVENT_START` (the actual award ceremony) is **one month later**: `2026-07-07T18:30:00+07:00`.
- [x] **Post-cut-off redirect target confirmed**: After `NEXT_PUBLIC_PRELAUNCH_END`, the gate becomes a no-op and `proxy.ts` resumes its normal behaviour — unauthenticated visitors hit the Login screen (`/`), authenticated visitors are forwarded to `/about-saa-2025`. No custom override is required.
- [x] **Keyvisual BG asset resolved**: reuse the existing `/public/assets/home/hero-bg.jpg` (same "Root Further" root illustration used on `/about-saa-2025`). No new export required. The prelaunch page references this shared asset directly; no copy is needed under `/public/assets/prelaunch/`.
- [x] **Prelaunch route path decided**: Use `NextResponse.rewrite()` so the URL bar stays on the original path (e.g. `/` remains `/` in the browser while the prelaunch HTML is served). The internal route is `/prelaunch`.
- [x] **Decision: dedicated `<PrelaunchCountdown>` fork** — the glass-tile visual is significantly different from the Homepage yellow-tile variant; sharing the same component would require a complex variant API for marginal reuse. Fork a dedicated `<PrelaunchCountdown>` and note the shared `useCountdown` hook opportunity in a TODO comment for future consolidation.

---

## Notes

- The Figma layer name `Awards Information Navigation Links` on the headline node (`2268:35137`) is a copy-paste artefact — the actual character content is `Sự kiện sẽ bắt đầu sau`. Implementers MUST use the character content, NOT the layer name, as the source of truth.
- The screen is single-locale by default (VN copy is in the Figma). The EN translation `"The event will start in"` is recommended; final value to be confirmed with content team.
- Because the screen has no header / footer / logo, accessibility tools that auto-compute landmarks may flag a missing `<nav>` and `<footer>`. This is intentional and MUST NOT be "fixed" by adding empty landmarks — an empty `<nav>` is worse than no `<nav>`.
- The `setInterval(60_000)` MUST be cleared on unmount via the standard `useEffect` cleanup pattern. The countdown component is not visible elsewhere in the app, so this is mostly defensive — but it is a Constitution §I cleanliness expectation.
- **Two countdown env vars (confirmed values)**:
  - `NEXT_PUBLIC_PRELAUNCH_END = 2026-06-07T18:30:00+07:00` — controls **when the gate lifts** — i.e. the moment the prelaunch holding page stops being served and the full SAA app opens to visitors.
  - `NEXT_PUBLIC_SAA_EVENT_START = 2026-07-07T18:30:00+07:00` — controls **when the actual award ceremony starts** — i.e. the target the post-launch Homepage SAA countdown (`i87tDx10uM`) counts down to. This is one month after the gate lift.
  These are **different** dates. The gap is intentional: visitors can sign in and explore the app during June before the ceremony in July. Implementation MUST NOT alias them to the same constant.
