# Feature Specification: Language Dropdown (Dropdown — Ngôn ngữ)

**Frame ID**: `hUyaaugye2` (root node `721:4942`)
**Frame Name**: `Dropdown-ngôn ngữ`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Figma Link**: https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C?node-id=hUyaaugye2
**Created**: 2026-04-27
**Last Reviewed**: 2026-04-29 (Q6 amended — EN flag is the UK Union Jack matching the Figma visual rendering, not the literal `GB-NIR` layer name). Prior review: 2026-04-27 (`momorph.reviewspecify` × 2 — width arithmetic corrected, State Management section added, persistence locked to `PUT /api/users/me`, 1 px highlight inset locked, `next-intl` chosen, anchored panel on mobile, all i18n bundles shipped with initial JS)
**Status**: Reviewed and confirmed — ready for `momorph.plan`
**Route**: N/A — overlay component, rendered in-place by every authenticated screen header (per `.momorph/SCREENFLOW.md` "In-page Overlays — Language Dropdown")
**Reference screenshot**: [`./assets/frame.png`](./assets/frame.png)

---

## Overview

The **Language Dropdown** is a small, anchored overlay that lets an authenticated user
switch the application's display language between **Tiếng Việt (`vi`, default)** and
**English (`en`)**. It is triggered by the header `VN ▾` / language button on every
authenticated page (Homepage SAA, Awards Information, Sun* Kudos, Profile, Admin
Dashboard) and renders as a dark, gold-bordered panel containing two stacked rows: one
per supported locale. The currently active locale is visually distinguished by a
yellow-tinted background highlight.

Selecting a row updates the global locale and re-renders all i18n strings in place; it
does **NOT** change the route. Closing the overlay is supported via outside-click,
`Escape`, selecting an item, or re-clicking the trigger button. The component is purely
client-driven UI state on top of the project's `next-intl` context — no page reload,
no route change, and (because both locale bundles ship with the initial JS payload —
FR-014) no server fetch on switch. After every successful switch, a fire-and-forget
`PUT /api/users/me { locale }` persists the preference to `users.locale` (FR-011).

Visual specifications — exact dimensions, colours, typography, padding, hover/focus
treatments, anchoring rules, and Figma node IDs — are documented in
[`./design-style.md`](./design-style.md).

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Authenticated user switches the application from Vietnamese to English (Priority: P1)

A logged-in user is reading any authenticated page in Vietnamese (the default locale).
They open the language menu from the header, select **EN**, and immediately see every
on-page string re-rendered in English without losing their place on the page or being
asked to log in again.

**Why this priority**: This is the core purpose of the dropdown and the only
externally-visible language affordance in the app. Without it, English-speaking users
cannot consume the product. It is also a documented dependency of every other
authenticated screen (Homepage SAA, Awards Information, …) per `.momorph/SCREENFLOW.md`.

**Independent Test**: Start an authenticated session on `/about-saa-2025` (Homepage SAA)
in `vi`. Click the header language button. Click `EN`. Verify all visible page strings
switch to English, the dropdown closes, and the URL is unchanged.

**Acceptance Scenarios**:

1. **Given** an authenticated user on any page (Homepage SAA, Awards Information, …)
   with locale `vi`, **When** they click the header language button, **Then** the
   dropdown panel renders anchored beneath/aligned with the trigger button, listing
   exactly two rows in this order: `VN` (selected — yellow-tinted background) and `EN`
   (default — transparent background).
2. **Given** the dropdown is open with `vi` selected, **When** the user clicks the `EN`
   row, **Then** (a) the active locale becomes `en`, (b) all visible i18n strings on
   the page re-render in English, (c) the dropdown closes, and (d) the URL/route does
   NOT change.
3. **Given** the dropdown was opened from the Homepage SAA header, **When** the user
   selects `EN` and the dropdown closes, **Then** subsequently re-opening the dropdown
   from the same header MUST show `EN` as the selected row (yellow-tinted) and `VN` as
   the default row (transparent). The "selected" treatment follows the active locale,
   not a hard-coded item.
4. **Given** an authenticated user clicks the language button on any other in-scope
   page (Awards Information, Sun* Kudos, Profile, Admin Dashboard), **When** the
   dropdown opens, **Then** it MUST render with identical content, dimensions, and
   styling as on Homepage SAA — only the anchor position differs.
5. **Given** the dropdown is open, **When** the user clicks the same locale that is
   already active (e.g. clicks `VN` while `vi` is the active locale), **Then** the
   dropdown closes silently with no locale change, no i18n re-render, and no API
   request.

---

### User Story 2 — User dismisses the language dropdown without changing locale (Priority: P1)

The user opens the language dropdown by accident (or to confirm the current locale)
and wants to close it without committing a change. They MUST be able to dismiss it via
multiple standard idioms — outside click, `Escape`, or re-clicking the trigger.

**Why this priority**: Dismissibility is part of the basic UX contract for any overlay
and is required for the component to be considered functional. A non-dismissible
overlay actively blocks the page; this is also a Constitution §IV WCAG 2.1 AA
requirement.

**Independent Test**: Open the dropdown, perform each dismissal action (outside click,
`Escape` key, re-click trigger), and verify each closes the overlay without changing
locale.

**Acceptance Scenarios**:

1. **Given** the dropdown is open, **When** the user clicks anywhere outside the panel
   and outside the trigger button, **Then** the dropdown closes and locale is unchanged.
2. **Given** the dropdown is open, **When** the user presses `Escape`, **Then** the
   dropdown closes, locale is unchanged, and keyboard focus returns to the trigger
   button (per WCAG 2.1.2 No Keyboard Trap).
3. **Given** the dropdown is open, **When** the user clicks the same trigger button
   that opened it, **Then** the dropdown closes (toggle behaviour), locale is
   unchanged, and focus remains on the trigger.

---

### User Story 3 — Keyboard-only user navigates and selects a locale (Priority: P2)

A keyboard-only or screen-reader user MUST be able to operate the language dropdown
with the keyboard alone, in a way that screen readers correctly announce the menu's
state and the active selection.

**Why this priority**: Required for WCAG 2.1 AA compliance per Constitution §V and for
inclusive access; secondary to the core "switch the language" flow because most users
will use a pointer device. Demoted from P1 to P2 because the P1 stories already pin
down the visible behaviour and the underlying menu library (Radix / Headless UI) gets
most of this for free; we still need a story to lock in the keyboard contract.

**Independent Test**: With the keyboard only, focus the trigger button, open the
menu via `Enter` / `Space`, navigate between rows with `↑` / `↓`, select with `Enter`,
and verify the locale changes and focus returns to the trigger.

**Acceptance Scenarios**:

1. **Given** keyboard focus is on the trigger button, **When** the user presses `Enter`
   or `Space`, **Then** the dropdown opens and focus moves to the currently active
   locale row (`VN` if locale is `vi`, `EN` if locale is `en`).
2. **Given** the dropdown is open and focus is on the active row, **When** the user
   presses `↓` (or `↑`), **Then** focus moves to the other row (the menu has only two
   items so `↓` and `↑` both wrap between them).
3. **Given** focus is on a row, **When** the user presses `Enter` or `Space`, **Then**
   that row is selected, the dropdown closes, the locale switches, and focus returns
   to the trigger button.
4. **Given** the dropdown is open, **When** assistive technology inspects the panel,
   **Then** the panel exposes `role="menu"` (or `role="listbox"`), each row exposes
   `role="menuitemradio"` (or `role="option"`) with `aria-checked` (or `aria-selected`)
   set to `true` only on the currently active locale, and the trigger button reports
   `aria-haspopup="menu"` and `aria-expanded` matching open state.

---

### User Story 4 — User's language preference persists across sessions (Priority: P3)

When the same user signs out and signs back in (or returns in a new browser tab),
the application opens in the locale they last selected, not the default `vi`.

**Why this priority**: Quality-of-life improvement that is not blocking for MVP — a
session-only locale is acceptable for v1. **P3** because the dropdown still works
without it. Persistence target is now locked: `PUT /api/users/me { locale }` writing
to the `users.locale` column.

**Independent Test**: Sign in, switch to `EN`, sign out, sign back in, observe the
default locale is `EN`. The browser MUST read the persisted value from the user
record on hydration.

**Acceptance Scenarios**:

1. **Given** an authenticated user with `users.locale = "en"`, **When** they reload
   any authenticated page, **Then** the application renders in `en` and the dropdown
   shows `EN` as the selected row.
2. **Given** an authenticated user with `users.locale = NULL` (or absent), **When**
   they first load the application, **Then** the active locale defaults to `vi` per
   the project's i18n default.
3. **Given** the user changes locale via the dropdown, **When** the change is
   committed (selection click), **Then** the new locale MUST be persisted (a)
   immediately for the current session via the `next-intl` context, and (b) durably
   via `PUT /api/users/me { locale }` writing to `users.locale`. The PUT MUST be
   fire-and-forget — failure does NOT block the in-session locale switch.

---

### Edge Cases

- **Persistence call failure** (`PUT /api/users/me` returns 4xx/5xx): The client-side
  locale switch MUST succeed regardless. The persistence failure MUST be silently
  logged (not toasted) so the user is not blocked. On the next successful change, the
  client retries persistence.
- **Pre-auth use** (e.g. on the Login screen): Out of scope. The Login screen has its
  own language switch that is not this overlay (per `.momorph/SCREENFLOW.md`
  "Group: In-page Overlays — Language Dropdown — Triggered From: Header language
  button on every authenticated page" — the Login page does NOT have the
  authenticated header).
- **Repeated rapid clicks** on the trigger button: Toggle behaviour MUST debounce
  open/close transitions so the panel does not visually flash. Recommended: animate
  using CSS transitions (per `design-style.md` "Animation & Transitions") rather than
  imperative state thrash.
- **`prefers-reduced-motion: reduce`**: The open/close transition MUST disable any
  `transform: translateY` motion and reduce the `opacity` transition to ≤ 60ms — see
  `design-style.md` "Animation & Transitions".
- **Locale change while a sibling overlay is open** (e.g. avatar dropdown): Opening
  the language dropdown MUST close any other anchored overlay in the header
  (single-open invariant). This is a header-shell concern, not a dropdown concern,
  but the dropdown MUST emit an `onOpen` event the header can hook into.
- **Hydration mismatch on first paint**: Because `users.locale` is read server-side
  before the client hydrates, the rendered locale MUST match between SSR and CSR
  to avoid React hydration warnings. The `next-intl` provider MUST be configured at
  the root layout, sourced from `users.locale` (or `vi` if NULL).

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| `A_Dropdown-List` (panel) | Outer 122 × 124 px dark panel, gold border, 8px radius, 6px padding, anchored to trigger button. | Open / close (toggle on trigger click; close on outside click, `Escape`, item select). |
| `A.1` Selected item (`tiếng Việt`) | Yellow-tinted (20% α) highlight (108 × 56, 1 px inset on each side from the 110 × 56 row) with VN flag + `VN` label. Represents the **currently active locale** — NOT hard-coded to VN. | Click → select locale; hover → bg α bumps; focus → 2 px gold outline. |
| `A.2` Default item (`tiếng Anh`) | Transparent 110 × 56 row with the UK Union Jack flag + `EN` label. Represents the **other (non-active) locale**. | Click → select locale, switch app to `en`; hover → 10 %-α yellow tint; focus → 2 px gold outline. |
| Flag icons | 24 × 24 boxes with the visible flag at 20 × 15 centred. VN: `componentId 178:1019`. EN: UK Union Jack (matching the visual rendering of the Figma source's `GB-NIR` instance). | Decorative — pointer-events handled by the parent row. |
| Locale label | Montserrat 16px / 700 / 24px line-height, white, letter-spacing 0.15px. Renders the 2-letter code (`VN` or `EN`). | None directly; pointer-events handled by the parent row. |

> See [`./design-style.md`](./design-style.md) for exact dimensions, hex values,
> Tailwind-class mappings, anchoring placement, and per-state visual treatments.

### Navigation Flow

- **From**: Header language button (`A1.7` on Homepage SAA; equivalent button on
  Awards Information, Sun* Kudos, Profile, Admin Dashboard) on any authenticated page.
- **To**: No route change. Selecting an item updates the active i18n locale in
  the global context and re-renders the calling page in the new locale.
- **Triggers**:
  - **Open**: Click on the header language button.
  - **Close — without selection**: Outside click, `Escape`, re-click on the trigger
    button.
  - **Close — with selection**: Click on either row; or keyboard `Enter` / `Space` on a
    focused row.

### Visual Requirements

- **Responsive breakpoints** (per Constitution §IV) — anchored 122 × 124 px floating
  panel at every breakpoint. Layout is fixed; only the trigger button's position in
  the header changes per breakpoint (header concern, not the dropdown's).
  - **Mobile** (≥ 360 px), **Tablet** (≥ 768 px), **Desktop** (≥ 1280 px): identical
    anchored panel.
- **Animations / Transitions**: 150 ms `opacity` + 4 px `translateY` slide on open
  (`ease-out`) and close (`ease-in`); 120 ms `background-color` ease-in-out on row
  hover/focus. Honour `prefers-reduced-motion: reduce`. (Approved 2026-04-27 —
  see `design-style.md`.)
- **Accessibility** (WCAG 2.1 AA):
  - Trigger: `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`.
  - Panel: `role="menu"` (or `role="listbox"`).
  - Rows: `role="menuitemradio"` (or `role="option"`) with `aria-checked` on the
    active locale.
  - Each row's accessible name MUST include the human-readable locale name, not just
    the code (e.g. `aria-label="Tiếng Việt (Vietnamese)"` even when the visible label
    is `VN`).
  - Focus visible: 2 px solid `#FFEA9E` outline at 1 px offset on the focused row;
    contrast against `#00070C` panel background ≈ 16:1 (✅).
  - Touch targets: each row is 56 px tall (≥ 48 px minimum per Material Design 3
    referenced in Constitution §IV).

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render the language dropdown as a single shared component
  (`<LanguageMenu />`) reused by every authenticated header — Homepage SAA, Awards
  Information, Sun* Kudos, Profile, Admin Dashboard. Per-page duplicates are FORBIDDEN.
- **FR-002**: System MUST list exactly two locale rows in this fixed order: `VN`
  (Tiếng Việt, code `vi`) first, then `EN` (English, code `en`). The order MUST NOT
  change based on the active locale.
- **FR-003**: System MUST style the row matching the **currently active locale** with
  the "selected" treatment (yellow `rgba(255, 234, 158, 0.20)` background, `2px`
  border-radius). The other row MUST use the default (transparent) treatment.
- **FR-004**: Users MUST be able to switch the active locale by clicking either row.
  Selection MUST (a) update the global i18n context, (b) trigger the calling page to
  re-render with the new locale's strings, (c) close the dropdown, and (d) NOT change
  the URL/route.
- **FR-005**: System MUST close the dropdown on each of: row selection, outside-click,
  `Escape` key, re-click on the trigger button. After dismissal-without-selection,
  keyboard focus MUST return to the trigger button.
- **FR-006**: System MUST be operable by keyboard alone: trigger opens with `Enter` /
  `Space`; arrow keys move between rows (with wrap, since there are only two);
  `Enter` / `Space` selects; `Escape` dismisses.
- **FR-007**: System MUST expose ARIA attributes (`role`, `aria-checked` /
  `aria-selected`, `aria-haspopup`, `aria-expanded`, `aria-controls`) so screen
  readers correctly announce the menu's state and the active locale. (See
  Acceptance Scenario US3.4.)
- **FR-008**: System MUST anchor the panel to the trigger button with the right edge
  of the panel aligned to the right edge of the trigger and a 4 px gap below the
  trigger. (See `design-style.md` "Anchoring & Open / Close Behaviour".)
- **FR-009**: System MUST default to `vi` when the active locale is unknown
  (first-load, no saved preference, hydration mismatch).
- **FR-010**: When the locale is changed, the change MUST be reflected immediately
  (≤ 100 ms) in the `next-intl` context. Persistence to the server (`PUT /api/users/me`)
  MUST happen asynchronously and MUST NOT block the locale switch (see FR-011).
- **FR-011**: System MUST persist the user's preferred locale to `users.locale` via
  `PUT /api/users/me { locale }` after every successful locale switch. The PUT is
  fire-and-forget — failure MUST NOT block the in-session locale switch and MUST NOT
  show a user-facing error. On hydration, the active locale MUST be sourced from
  `users.locale` if present, else default to `vi`. (P3 — see User Story 4.)
- **FR-012**: System MUST render the English row with the **United Kingdom Union
  Jack** flag (matching the visual rendering in the Figma design — note that the
  source layer name `GB-NIR — Northern Ireland` is misleading; the rendered
  glyph is the standard Union Jack) and the Vietnamese row with `VN — Vietnam`
  (`componentId 178:1019`). The flag asset MUST visually match what the Figma
  design displays, irrespective of the source layer name.
- **FR-013**: System MUST honour `prefers-reduced-motion: reduce` by disabling the
  open/close translation animation and reducing transition durations to ≤ 60 ms.
- **FR-014**: Translation bundles for both `vi` and `en` MUST ship with the initial
  JS payload — no runtime fetch on locale switch. This guarantees a synchronous
  re-render and removes the loading-state edge case entirely.
- **FR-015**: The yellow "selected" highlight MUST render at 108 × 56 (1 px inset
  on each side of the 110 × 56 row), matching Figma source. Full-width highlights
  are NOT permitted.

### Technical Requirements

- **TR-001 (Constitution §I — Clean Code)**: The dropdown MUST live in a single
  PascalCase React component file (e.g. `components/LanguageMenu.tsx`) with the row
  renderer as a colocated subcomponent or a separate file
  (`components/LanguageMenuItem.tsx`). Business logic (the locale-switch action) MUST
  live in a service or context module, not inside the component.
- **TR-002 (Constitution §II — RSC default + `'use client'` only when required)**:
  This component MUST be a Client Component (`'use client'`) because it manages
  open/close state and listens for keyboard / outside-click events. No server-only
  logic should be added to it.
- **TR-003 (Constitution §II — Tailwind + Design Tokens)**: All colour, spacing, and
  typography values MUST consume CSS variables (`--color-details-container-2`,
  `--color-details-border`, `--color-selected-bg`, etc.) declared in the global
  stylesheet. Hard-coded raw colour / spacing values in the component file are
  FORBIDDEN.
- **TR-004 (Constitution §II — `next/font`)**: The `Montserrat` font used for the
  locale labels MUST be loaded via `next/font` and be the same font instance already
  used elsewhere in the project (Homepage / Awards Information).
- **TR-005 (Constitution §IV — accessibility)**: The component MUST satisfy WCAG 2.1
  AA: visible focus ring, role/state ARIA attributes, no keyboard traps, contrast
  ratios ≥ 4.5:1 for text and ≥ 3:1 for non-text focus indicators.
- **TR-006 (Constitution §III — TDD)**: A failing Vitest unit/component test suite
  covering FR-001 through FR-007, FR-009, FR-014, and FR-015 MUST be written,
  reviewed, and committed before the component implementation lands. A failing
  Playwright E2E test asserting US1 Acceptance Scenario 2 (click EN → strings
  re-render in English synchronously) MUST be in the same PR.
- **TR-007 (Constitution §V — Security)**: The `PUT /api/users/me` endpoint
  (FR-011) MUST validate the `locale` body against the Zod schema
  `z.object({ locale: z.enum(["vi", "en"]) })` at the API boundary, per
  Constitution §V "Input validation". Reject unknown values with HTTP 400 — never
  write them to `users.locale`. Authorize via the existing Supabase server-client
  session (write only the authenticated user's own row).
- **TR-008**: Performance — opening the dropdown MUST NOT trigger a network
  request. Locale switching is synchronous (FR-014); the `PUT /api/users/me` call
  fires after the visual change and does NOT gate it. Open-to-paint MUST be
  ≤ 100 ms.
- **TR-009 (Constitution §IV — source-of-truth navigation)**: Because this
  component causes NO route change, no `SCREENFLOW.md` Navigation Graph entry is
  required for the per-row clicks. The trigger-button → overlay edge IS in
  `SCREENFLOW.md` and MUST be honoured.
- **TR-010 (i18n library)**: The implementation MUST use **`next-intl`** as the
  i18n provider (`useLocale()`, `useTranslations()`, `setLocale()` / equivalent).
  Both `vi` and `en` message catalogues MUST be imported eagerly into the root
  layout so they ship with the initial JS bundle (FR-014). The `next-intl`
  middleware MUST seed the active locale from `users.locale` (server-read on the
  authenticated request).

### Key Entities

This feature adds one persistent column. It interacts with:

- **`users.locale`** *(NEW — see FR-011)*: A nullable `text` column on the existing
  `users` table, constrained to `IN ('vi', 'en')` (DB-level CHECK or enum type).
  NULL → fall back to `vi` on read. Updated by `PUT /api/users/me` after every
  successful locale switch. MUST be added in a Supabase migration during
  `momorph.database`; the migration MUST also include an RLS policy permitting the
  authenticated user to UPDATE their own row's `locale` column (Constitution §II
  "Row Level Security").
- **`Locale` (in-memory)**: Discriminated union `"vi" | "en"`. Held by `next-intl`
  provider state. Initialised from `users.locale` (server-read on first paint),
  else `"vi"`.

---

## State Management

### Local component state (`<LanguageMenu />`)

| State | Type | Initial | Purpose |
|-------|------|---------|---------|
| `isOpen` | `boolean` | `false` | Whether the panel is rendered. Toggled by trigger click; reset to `false` on outside click, `Escape`, item selection, route change. |
| `anchorEl` | `HTMLElement \| null` | `null` | DOM reference to the trigger button. Used to compute panel placement (`top: calc(100% + 4px); right: 0`). |
| `focusedIndex` | `0 \| 1` | `0` (or index of active locale on open) | Which row currently holds keyboard focus. Drives the visual focus ring and the `aria-activedescendant` pointer. |

> No `pendingLocale` state is needed because translation bundles ship with the
> initial JS payload (FR-014) — locale switches are synchronous; there is no
> in-flight window.

### Global state (shared across all callers of `<LanguageMenu />`)

| State | Store | Read / Write | Purpose |
|-------|-------|--------------|---------|
| `locale` | `next-intl` provider context (`useLocale()` / `setLocale()`) | Read + Write | Active display locale. Single source of truth for which row receives the "selected" treatment (FR-003) and which strings the application renders. |
| `user.locale` | `useSession()` / `/api/users/me` cache (TanStack Query) | Write (FR-011) | Server-persisted preferred locale. Updated fire-and-forget after each successful `setLocale`. |
| `headerOverlay` | header-shell context (or zustand slice) | Write | Single-open invariant — the language dropdown publishes "I am opening" when its trigger fires, so the header can close the avatar dropdown / floating widget overlay (Edge Cases — "Locale change while a sibling overlay is open"). |

### Error / empty states

| State | When | UI Treatment |
|-------|------|--------------|
| **Error** (`PUT /api/users/me` persistence failure) | Server-persistence call rejects after a successful client-side switch. | NO user-facing surface (silent log only). Locale change is preserved client-side via `next-intl` context. Retry on next selection. |
| **Empty** | N/A — the list is fixed at exactly two items (`vi`, `en`). | — |
| **Loading** | N/A — bundles ship with initial JS (FR-014); no fetch on switch. | — |

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/users/me` | PUT | Persist `{ locale }` in `users.locale` so the preference survives sign-out (User Story 4 / FR-011). Fire-and-forget; failure MUST NOT block the client-side locale switch. Endpoint MUST validate `locale` against `["vi", "en"]` via Zod (TR-007). | New — required. To be added during `momorph.apispecs`. |
| `/api/users/me` | GET | Read `users.locale` (alongside other profile fields) on first paint so the `next-intl` provider can seed the initial locale before hydration. Already needed by Homepage SAA / Awards Information per `.momorph/SCREENFLOW.md`; this dropdown reuses the same call — no extra request. | Existing (predicted in SCREENFLOW). |
| Supabase `auth.getSession` | — | The dropdown only renders inside the authenticated header; the page already calls `getSession` for its own auth guard (per `.momorph/SCREENFLOW.md`). The dropdown reuses that result — it MUST NOT trigger an extra session check. | Supabase built-in (existing). |

> No `/api/i18n/:locale` endpoint is used — translation bundles ship with the
> initial JS payload (FR-014). The line in `.momorph/SCREENFLOW.md` "API Endpoints
> Summary" referencing `/api/i18n/:locale` is now stale for this dropdown's
> contract; the next `momorph.screenflow` pass should drop or repurpose it.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Time to switch locale ≤ **300 ms** end-to-end on a desktop connection
  (click → all visible strings rendered in new locale).
- **SC-002**: 100 % of visible page strings on every authenticated screen
  (Homepage SAA, Awards Information, Sun* Kudos, Profile, Admin Dashboard) MUST be
  i18n-keyed and re-render correctly when the locale changes. Hard-coded strings are
  a defect.
- **SC-003**: Component MUST achieve **zero violations** on automated accessibility
  audits (axe-core in Playwright) for the open-dropdown state, including focus order,
  contrast, role/state attributes.
- **SC-004**: The component MUST be reused on **every** authenticated header — there
  MUST be at most **one** `<LanguageMenu />` definition file in the codebase
  (verifiable by `grep`).
- **SC-005** *(persistence — P3)*: After signing out and signing back in, **100 %**
  of users see the locale they last chose. Persistence is server-side
  (`users.locale`) so the value survives across browsers and private windows — any
  miss indicates a defect (PUT silently failed and the retry path didn't fire).

---

## Out of Scope

- **Adding new locales** beyond `vi` / `en`. The rest of the project copy is
  scaffolded for two locales only. Adding a third locale is a separate feature with
  its own design and translation pipeline.
- **The pre-authentication language switch** on the Login screen. The Login page is
  rendered before the authenticated header exists and uses its own (separate)
  affordance. Out of scope for this dropdown.
- **Right-to-left (RTL) layout support**. Both supported locales (`vi`, `en`) are
  left-to-right. RTL handling is deferred until/unless an RTL locale is added.
- **Locale-aware routing** (e.g. `/vi/awards` vs `/en/awards`). The current routing
  is locale-agnostic; locale lives in i18n context only. Adding URL-segment locales
  is a future architecture decision.
- **Inline translation editing / admin tools**. Out of scope here; would belong to
  the Admin Dashboard.
- **Per-component locale overrides** (e.g. force a single block of the page into a
  different locale). Application-wide locale only.

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`) — confirms TS-strict,
      Tailwind tokens, RSC default, TDD, accessibility, security gates referenced
      throughout this spec.
- [ ] API specifications available (`.momorph/API.yml`) — `PUT /api/users/me` MUST
      be added during `momorph.apispecs` with a Zod-validated `locale` body
      (TR-007). The existing `GET /api/users/me` call MUST also return `locale`.
- [ ] Database design completed (`.momorph/database.sql`) — `users.locale` column
      (text, `IN ('vi','en')` CHECK, nullable) MUST be added in a migration during
      `momorph.database`. RLS policy MUST permit the authenticated user to UPDATE
      their own row's `locale` (Constitution §II).
- [x] Screen flow documented (`.momorph/SCREENFLOW.md`) — Language Dropdown overlay
      row added under "In-page Overlays" group (per the `momorph.screenflow`
      2026-04-27 run); navigation graph confirms VN/EN selection causes no route
      change. Note: SCREENFLOW.md still references `/api/i18n/:locale`; this is
      now stale (see API Dependencies note) and should be cleaned up on the next
      screenflow pass.
- [x] **i18n library locked: `next-intl`** — chosen for App Router compatibility,
      mature locale-segment / locale-context support, RSC-friendly translation
      readers, and active maintenance. Both `vi` and `en` catalogues import eagerly
      into the root layout (FR-014).

---

## Notes

- The Figma source frame stages the dropdown against a 215 × 304 px gray (`#696969`)
  canvas. **That gray surface is NOT part of the implementation** — it is a designer-
  side preview backdrop. Only the inner `A_Dropdown-List` (122 × 124 px) is rendered.
- The two TEXT nodes in the source are still labelled
  `Awards Information Navigation Links` (a copy-paste leftover). The actual rendered
  text MUST be the locale code (`VN` / `EN`); the screen-reader name MUST be the
  human-readable locale (`Tiếng Việt` / `English`). Layer-name cleanup is a designer
  follow-up tracked in `.momorph/SCREENFLOW.md` "Open Questions" (added by the
  `momorph.screenflow` 2026-04-27 run); it is not blocking implementation.
- The "selected" visual treatment must follow the active locale, not the row index.
  Implementations that hard-code the yellow tint to `A.1` will fail US1 Acceptance
  Scenario 3.
- Hover, focus, active, pressed, and motion timings in `design-style.md` were
  predicted during `momorph.specify` (the Figma source has no specs for these) and
  **approved by the user on 2026-04-27**. Values follow Material Design 3 / WCAG
  2.1 AA defaults — see "Resolved Clarifications" below.
- The `GB-NIR — Northern Ireland` flag instance shown for the English row in the
  Figma source is **retained as designed** (FR-012). No asset substitution.
- Where this spec and `.momorph/SCREENFLOW.md` overlap (the overlay's place in the
  navigation graph), `SCREENFLOW.md` is authoritative for navigation; this document
  is authoritative for behavioural and visual requirements.

---

## Resolved Clarifications *(2026-04-27 — closed during `momorph.reviewspecify`)*

### Business Logic
- **Q1 — Persistence target**: ✅ **`users.locale` column via `PUT /api/users/me`** (DB-backed). Drives FR-011, TR-007, Key Entities, and the new database/API dependency rows.
- **Q2 — Active-row click behaviour**: ✅ **Silent no-op** (US1 Acceptance Scenario 5 stands as written) — no re-fetch or force-refresh.

### Design / Visual
- **Q3 — Hover / focus / active / pressed colours**: ✅ **Predicted values approved** (see `design-style.md` per-state tables): selected row hover `rgba(255, 234, 158, 0.28)` / pressed `0.32`; default row hover `rgba(255, 234, 158, 0.10)` / pressed `0.18`; focus ring `2px solid #FFEA9E` at `1px` offset.
- **Q4 — Motion timings**: ✅ **Predicted values approved**: 150 ms `opacity` + 4 px `translateY` (`ease-out` open, `ease-in` close); 120 ms hover/focus crossfades; `prefers-reduced-motion: reduce` collapses motion to 60 ms.
- **Q5 — Highlight inset**: ✅ **Follow design** — selected highlight renders at **108 × 56** (1 px inset on each side of the 110 × 56 row). Locked as **FR-015**.
- **Q6 — English flag asset**: ✅ **UK Union Jack** — match the visual rendering of the Figma design. The Figma source layer is named `GB-NIR — Northern Ireland` but the rendered glyph is the standard Union Jack; FR-012 follows what the design actually displays. *(Updated 2026-04-29 after implementation review — the layer name was misleading.)*

### Technical
- **Q7 — i18n library**: ✅ **`next-intl`** (locked). See TR-010 and Dependencies. Both message catalogues import eagerly so they ship in the initial JS bundle.
- **Q8 — Mobile presentation**: ✅ **Anchored panel on every breakpoint** (mobile / tablet / desktop). No hamburger-drawer fallback. See "Visual Requirements — Responsive breakpoints".
- **Q9 — Bundle delivery model**: ✅ **Ship both locale bundles with initial JS** (no `/api/i18n/:locale` fetch on switch). Locked as **FR-014**. Justification: only two locales, modest catalogue size, deletes the loading-state edge case + a network round-trip + a failure mode entirely. Trade-off — a small bundle-size increase per session — is accepted.
