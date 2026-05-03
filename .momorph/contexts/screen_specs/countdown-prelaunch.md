# Screen: Countdown - Prelaunch page

## Screen Info

| Property | Value |
|----------|-------|
| **Figma Frame ID** | `2268:35127` (screenId `8PJQswPZmU`) |
| **Figma Link** | https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C/?node-id=2268:35127 |
| **Screen Group** | Prelaunch / Marketing |
| **Status** | discovered |
| **Discovered At** | 2026-04-26 |
| **Last Updated** | 2026-04-26 |

---

## Description

A pre-launch holding screen shown to all visitors **before SAA 2025 goes live**. The page renders only the brand keyvisual background and a centered live countdown ("Sự kiện sẽ bắt đầu sau") down to **Days / Hours / Minutes** until the announcement window opens. There is **no header, footer, navigation, language switch, or login affordance** — it is intentionally minimal so the entire app surface is gated behind a single time-based check.

When the countdown reaches zero, the application transitions to the regular Login screen (`/`, `GzbNeVGJHz`) and the rest of the app becomes reachable. Until then, **every route serves this prelaunch page** (server middleware redirect) regardless of authentication state.

---

## Navigation Analysis

### Incoming Navigations (From)

| Source Screen | Trigger | Condition |
|---------------|---------|-----------|
| Any route on the site | Auto (middleware redirect) | `now() < NEXT_PUBLIC_PRELAUNCH_END` |
| Direct URL entry / bookmark / shared link | Auto | Same condition as above |

### Outgoing Navigations (To)

| Target Screen | Trigger Element | Node ID | Confidence | Notes |
|---------------|-----------------|---------|------------|-------|
| Login (`/`, `GzbNeVGJHz`) | Auto on countdown reaching 00:00:00 + first request after the cut-off | n/a (server-side) | high | The middleware that redirected the user here stops doing so once `now() ≥ NEXT_PUBLIC_PRELAUNCH_END`; the next navigation lands on the standard Login screen. |

### Navigation Rules

- **Back behavior**: N/A — there are no in-page navigation triggers. Browser back/forward returns to the prior off-site URL.
- **Deep link support**: No deep links inside the prelaunch page. ALL inbound paths (`/`, `/about-saa-2025`, `/awards-information`, `/sun-kudos`, `/auth/callback`, etc.) are rewritten or redirected to render this page during the prelaunch window.
- **Auth required**: No. The prelaunch page is publicly served and **bypasses** the Supabase session check; even authenticated users see only this screen until the cut-off.

---

## Component Schema

### Layout Structure

```
┌──────────────────────────────────────────────────────────────┐
│  [MM_MEDIA_BG Image — full-bleed keyvisual, dark roots art]  │
│  [Cover — diagonal gradient #00101A → transparent overlay]   │
│                                                              │
│              "Sự kiện sẽ bắt đầu sau"                        │
│                                                              │
│           ┌────┐ ┌────┐   ┌────┐ ┌────┐   ┌────┐ ┌────┐      │
│           │ 0  │ │ 0  │   │ 0  │ │ 5  │   │ 2  │ │ 0  │      │
│           └────┘ └────┘   └────┘ └────┘   └────┘ └────┘      │
│              DAYS            HOURS           MINUTES         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
CountdownPrelaunchPage (Screen)
├── HeroBackground (Atom — full-bleed image + overlay)
│   ├── BgImage (Atom)
│   └── CoverGradient (Atom)
└── PrelaunchCountdownBlock (Organism)
    ├── Headline ("Sự kiện sẽ bắt đầu sau") (Atom)
    └── CountdownTimer (Molecule)
        ├── CountdownUnit "DAYS" (Molecule)
        │   ├── DigitTile × 2 (Atom)
        │   └── UnitLabel (Atom)
        ├── CountdownUnit "HOURS" (Molecule)
        │   ├── DigitTile × 2 (Atom)
        │   └── UnitLabel (Atom)
        └── CountdownUnit "MINUTES" (Molecule)
            ├── DigitTile × 2 (Atom)
            └── UnitLabel (Atom)
```

### Main Components

| Component | Type | Node ID | Description | Reusable |
|-----------|------|---------|-------------|----------|
| MM_MEDIA_BG Image | Atom | `2268:35129` | Full-bleed keyvisual background (root illustration) | No (screen-specific asset) |
| Cover | Atom | `2268:35130` | Diagonal gradient overlay for left-side legibility | No |
| Bìa | Frame | `2268:35131` | Outer flex column, 96×144 padding, gap 120, centers everything | No |
| Frame 487 / 523 | Frame | `2268:35132` / `2268:35135` | Inner wrappers (gap 60 → gap 24) | No |
| Countdown time | Organism | `2268:35136` | Headline + 3-unit timer, vertically stacked, centered | No |
| Subtitle text | Atom | `2268:35137` | "Sự kiện sẽ bắt đầu sau" (Montserrat 700 36/48 #FFFFFF) | No |
| Time | Molecule | `2268:35138` | Row of 3 CountdownUnits, gap 60 | No |
| 1_Days / 2_Hours / 3_Minutes | Molecule | `2268:35139` / `2268:35144` / `2268:35149` | One countdown unit (2 digit tiles + label) | **Yes** — same `<CountdownUnit>` component, 3 instances |
| Frame 485 (digit-pair) | Molecule | `2268:35140` / `…45` / `…50` | Row of 2 DigitTile instances (gap 21) | Yes |
| Group 5 / Group 4 (digit tile) | Atom | `2268:35141` / `…42` etc. | Single 7-segment digit tile (76.8×122.88, rounded glass card) | Yes |
| Rectangle 1 (tile bg) | Atom | `I…;186:2616` | Glass-card rectangle: gradient white→10%, 0.75px gold border, 12px radius, backdrop-blur 24.96px, opacity 0.5 | Yes |
| Digit text | Atom | `I…;186:2617` | "Digital Numbers" 73.728px #FFFFFF — single character ("0"–"9") | Yes |
| DAYS / HOURS / MINUTES label | Atom | `2268:35143` / `…48` / `…53` | Montserrat 700 36/48 #FFFFFF uppercase | Yes |

---

## Form Fields (If Applicable)

N/A — this screen has zero input fields and zero interactive controls.

---

## API Mapping

### On Screen Load

| API | Method | Purpose | Response Usage |
|-----|--------|---------|----------------|
| — | — | None | Countdown target is read from build-time env var `NEXT_PUBLIC_PRELAUNCH_END`; no network request is required. |

### On User Action

| Action | API | Method | Request Body | Response |
|--------|-----|--------|--------------|----------|
| (none — page has no controls) | — | — | — | — |

### Error Handling

| Error Code | Message | UI Action |
|------------|---------|-----------|
| Missing or unparsable `NEXT_PUBLIC_PRELAUNCH_END` | (no UI message — `console.warn` only) | All 3 unit tiles render `--`; the page remains visible so users still see the brand. |
| Cut-off has already passed at request time | — | The middleware bypasses the rewrite — user lands on Login (`/`) directly. The prelaunch page is **not** served. |

---

## State Management

### Local State

| State | Type | Initial | Purpose |
|-------|------|---------|---------|
| `remaining` | `{ days: number \| '--', hours: number \| '--', minutes: number \| '--' }` | Computed at SSR from `NEXT_PUBLIC_PRELAUNCH_END − now()` | Drives all 6 digit tiles. |
| `tickIntervalId` | `ReturnType<typeof setInterval>` | `setInterval(60_000)` set on mount | Recomputes `remaining` once per minute. |

No global state, no server state, no cache.

### Global State (If Applicable)

N/A — page is intentionally stateless beyond the local tick. The "is the prelaunch active" decision is made by middleware (server-side) on every request, not by client state.

---

## UI States

### Loading State

- SSR renders the initial countdown values inline; no client skeleton or spinner.
- The dev/SSR HTML must match the first client render exactly to avoid hydration mismatch (compute target on server using request `Date.now()`; client uses the same target on mount and starts ticking).

### Error State

- If `NEXT_PUBLIC_PRELAUNCH_END` is missing or unparsable → tiles render `--` and a `console.warn("Invalid NEXT_PUBLIC_PRELAUNCH_END")` is logged. The headline remains visible.

### Success State (countdown reaches zero)

- The middleware stops redirecting; the next navigation lands on `/` (Login). On the still-mounted prelaunch page, all tiles display `00` until the user navigates.

### Empty State

- N/A.

---

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Live region | Wrap the timer in `<div aria-live="polite" aria-atomic="true">` so screen readers announce each minute tick. |
| Decorative imagery | BG image and cover gradient have `aria-hidden="true"` + empty `alt=""`. |
| No interactive elements | Skip-link not required; no focus traps; no keyboard handlers. |
| Color contrast | "Sự kiện sẽ bắt đầu sau" + DAYS/HOURS/MINUTES labels = `#FFFFFF` on the dark bg side (≥ 18.7:1). The digit numerals sit on a translucent white-tinted glass tile (opacity 0.5) — verify ≥ 4.5:1 against the local BG region during implementation; if low on the bright (right) side of the keyvisual, increase tile opacity or add a darker inner overlay. |
| Reduced motion | If `prefers-reduced-motion: reduce`, omit any number-flip animation; just swap the value. |

---

## Responsive Behavior

| Breakpoint | Layout Changes |
|------------|----------------|
| Mobile (<768px) | Headline `clamp(20px, 5.5vw, 36px)`, units gap → 24px, digit tile shrinks to ~52×84, label 20/28 |
| Tablet (768–1279px) | Headline 32/44, units gap → 40px, digit tile ~64×102, label 28/36 |
| Desktop (≥1280px) | Matches Figma reference (digit tile 76.8×122.88, gap 60, headline 36/48) |

---

## Analytics Events (Optional)

| Event | Trigger | Properties |
|-------|---------|------------|
| `prelaunch_view` | On mount | `{ remaining_minutes: number }` |
| `prelaunch_expired_client` | First client tick where `remaining ≤ 0` | `{ end_at: ISOString }` |

---

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-dark` | `#00101A` | Page background, gradient solid stop |
| `--color-text-primary` | `#FFFFFF` | Headline, unit labels, digits |
| `--color-tile-border` | `#FFEA9E` (0.75px, opacity 0.5) | Digit tile border |
| `--color-tile-fill-top` | `#FFFFFF` 100% | Tile gradient top |
| `--color-tile-fill-bottom` | `rgba(255,255,255,0.10)` | Tile gradient bottom |
| `--radius-tile` | `12px` | Digit tile corner radius |
| `--blur-tile` | `24.96px` | Tile `backdrop-filter: blur(...)` |
| `--font-digital` | "Digital Numbers" / **DSEG7-Classic Bold** (web fallback) | Digit numerals |

---

## Implementation Notes

### Dependencies

- Reuse the `<Countdown>` / `<CountdownTile>` patterns from the Homepage SAA spec (`i87tDx10uM`) — but the **visual** is different (glass-card tiles + larger Digital-Numbers font), so the prelaunch implementation MUST NOT directly reuse the Homepage component without restyling.
- Reuse the `var(--font-digital)` font binding established on the Homepage screen (`public/fonts/DSEG7Classic-Bold.woff2` via `next/font/local`).

### Special Considerations

- The "is the user in the prelaunch window" gate is **server-side**: implement as a Next.js middleware (or extend the existing `proxy.ts`) that rewrites/redirects every non-asset request to `/prelaunch` while `Date.now() < NEXT_PUBLIC_PRELAUNCH_END`.
- The prelaunch screen MUST itself be reachable when the gate is active (no infinite-redirect loop).
- The countdown shows **3** units (Days / Hours / Minutes) only — there is no Seconds tile, so a 60-second tick interval is sufficient. Do NOT add a Seconds field.
- The keyvisual asset for this screen is a **different image** from the Homepage hero BG (this one is the colourful root illustration, not the dark navy hero). Source it from the Figma `MM_MEDIA_BG Image` node.

---

## Analysis Metadata

| Property | Value |
|----------|-------|
| Analyzed By | Screen Flow Discovery (momorph.screenflow) |
| Analysis Date | 2026-04-26 |
| Needs Deep Analysis | No — screen is intentionally minimal; styles + node tree fully captured. |
| Confidence Score | High |

### Next Steps

- [x] Get detailed design items via `list_design_items`
- [x] Extract styles via `get_node` per countdown node
- [ ] Confirm `NEXT_PUBLIC_PRELAUNCH_END` value with stakeholder
- [ ] Confirm post-cutoff behaviour: redirect target is Login (`/`), not Homepage (`/about-saa-2025`)
- [ ] Decide whether to reuse the Homepage `<Countdown>` component (needs a `variant="prelaunch"`) or fork a dedicated `<PrelaunchCountdown>`
