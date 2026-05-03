# Implementation Plan: Countdown - Prelaunch page

**Frame**: `8PJQswPZmU-Countdown-Prelaunch`
**Spec**: [spec.md](./spec.md)
**Design**: [design-style.md](./design-style.md)
**Created**: 2026-04-27

---

## Constitution Compliance

| Requirement | Constitution Rule | Status |
|-------------|-------------------|--------|
| TypeScript strict — no `any` | §II | ✅ All component props have explicit interfaces |
| `'use client'` only where interactivity required | §II | ✅ Only `<PrelaunchCountdown>` is a Client Component |
| CSS variables for all tokens — no raw hex in JSX | §II | ✅ All new tokens added to `app/globals.css` |
| `@/*` path alias | §II | ✅ Used throughout |
| `next/font` for typefaces | §II | ✅ DSEG7 binding already exists via `var(--font-digital)` |
| No new third-party dependencies | §II | ✅ Uses existing `Date`, `next-intl`, `next/font/local` |
| TDD — tests before implementation | §III | ✅ Phase 1 writes all tests; Phase 2 makes them pass |
| Mobile/tablet/desktop breakpoints | §IV | ✅ Responsive specs documented in design-style.md |
| Navigation from SCREENFLOW.md only | §IV | ✅ No links/buttons — pure holding page; gate in middleware |
| WCAG 2.1 AA | §IV | ✅ `<h1>`, `aria-live`, `aria-hidden`, no focus rings needed |
| `NEXT_PUBLIC_` only for safe-to-expose values | §V | ✅ `NEXT_PUBLIC_PRELAUNCH_END` is a date, not a credential |
| No secrets in version control | §V | ✅ Env var in `.env.local` only |

---

## Architecture Decisions

### Frontend

**RSC default**: `app/prelaunch/page.tsx` is a React Server Component. It reads `process.env.NEXT_PUBLIC_PRELAUNCH_END`, calls `parseEventStart()` once (compile-time), and renders the initial countdown values. It passes `targetISO` as a serialisable prop to the one Client island.

**Client island**: `components/prelaunch/prelaunch-countdown.tsx` owns `useState` + `setInterval(60_000)`. Initialised from SSR-rendered values via the `targetISO` prop to guarantee hydration match.

**Component fork — not shared**: The glass-card tile visual diverges significantly from the Homepage yellow tile. A shared variant API would add complexity for minimal gain. Fork into a dedicated `components/prelaunch/` namespace. Add a `// TODO: extract shared useCountdown hook` comment for future consolidation.

**Reuse from Homepage**: 
- `lib/event.ts` — `parseEventStart()` and `getInitialCountdown()` used as-is.
- `types/home.ts` — `CountdownValues` type reused.
- `.home-hero-bg` CSS class — applied directly to the BG layer div.

### Middleware (Gate)

Extend existing `proxy.ts` by prepending a prelaunch check **before** the Supabase auth block. The check:
1. Parses `NEXT_PUBLIC_PRELAUNCH_END` (delegates to a new, testable `lib/prelaunch/config.ts` helper).
2. If active: applies `NextResponse.rewrite(new URL('/prelaunch', request.url))` for every pathname outside the allowlist.
3. If inactive: skips; the rest of `proxy.ts` (auth gate) runs normally.
4. Post-cutoff guard: if gate is inactive **and** `pathname === '/prelaunch'`, return `NextResponse.redirect('/')` so the internal route is not directly reachable.

The `config.matcher` in `proxy.ts` already excludes `/_next/static`, `/_next/image`, `favicon.ico`, and `assets/`. The allowlist inside the gate adds `/auth/callback` and `/prelaunch` itself to prevent loops.

### i18n

Add `prelaunch` namespace to both `messages/vi.json` and `messages/en.json`:

```json
{
  "prelaunch": {
    "headline": "Sự kiện sẽ bắt đầu sau",
    "days_label": "DAYS",
    "hours_label": "HOURS",
    "minutes_label": "MINUTES",
    "page_title": "Sự kiện sẽ bắt đầu sau",
    "meta_description": "Sự kiện sẽ bắt đầu sau"
  }
}
```

---

## Project Structure

### New Files

| File | Purpose |
|------|---------|
| `app/prelaunch/page.tsx` | RSC — prelaunch page (reads env, passes `targetISO` to client island) |
| `components/prelaunch/prelaunch-countdown.tsx` | `'use client'` — owns `setInterval(60_000)`, renders units |
| `components/prelaunch/digit-tile.tsx` | Glass-card single-digit tile (pure presentational, no client directive) |
| `components/prelaunch/countdown-unit.tsx` | One countdown column: `DigitPair` (2 tiles) + label span |
| `lib/prelaunch/config.ts` | Parse `NEXT_PUBLIC_PRELAUNCH_END`; export `isPrelaunchActive()`; `console.warn` on bad value |
| `tests/unit/prelaunch/digit-tile.test.tsx` | DigitTile unit tests |
| `tests/unit/prelaunch/countdown-unit.test.tsx` | CountdownUnit unit tests |
| `tests/unit/prelaunch/prelaunch-countdown.test.tsx` | PrelaunchCountdown — tick, hydration, missing env fallback, no interactive elements |
| `tests/unit/prelaunch/prelaunch-page.test.tsx` | Page RSC — env-var present → tiles; env-var missing → `--` + warn (TR-004) |
| `tests/unit/lib/prelaunch-config.test.ts` | `parsePrelaunchEnd` / `isPrelaunchActive` unit tests |
| `tests/integration/middleware/prelaunch-gate.test.ts` | Gate rewrites, allowlist, post-cutoff passthrough |
| `tests/e2e/prelaunch/prelaunch.spec.ts` | Playwright — page renders with tiles; gate active; tiles freeze at 00 (Playwright testDir: `./tests/e2e`) |

### Modified Files

| File | Changes |
|------|---------|
| `proxy.ts` | Prepend prelaunch gate block; import from `lib/prelaunch/config.ts` |
| `app/globals.css` | Add prelaunch CSS tokens (spacing, z-index, tile border/blur vars) |
| `messages/vi.json` | Add `prelaunch` namespace |
| `messages/en.json` | Add `prelaunch` namespace |

### Dependencies

No new packages. All requirements are met by:

| Already in project | Used for |
|-------------------|----------|
| `next-intl` | `useTranslations('prelaunch')` in client component |
| `next/font/local` (DSEG7 binding) | `var(--font-digital)` on digit tiles |
| `lib/event.ts` | `parseEventStart`, `getInitialCountdown` |
| `types/home.ts` | `CountdownValues` |

---

## Implementation Approach

### Phase 0: Asset Verification *(~5 min)*

Verify that `public/assets/home/hero-bg.jpg` exists (it does — already confirmed). Verify `var(--font-digital)` is declared in `app/globals.css` (already exists from Homepage SAA). **No asset work needed.**

---

### Phase 1: Foundation + Tests *(TDD — write tests first)*

All tests in this phase MUST be written and confirmed failing before any implementation code is touched.

**1.1 — CSS tokens**  
Add to `app/globals.css` (`:root` block):

```css
/* Prelaunch page tokens — add to :root in app/globals.css */
--spacing-prelaunch-page-px: 144px;
--spacing-prelaunch-page-py: 96px;
--spacing-prelaunch-section-gap: 120px;
--spacing-prelaunch-units-gap: 60px;
--spacing-prelaunch-unit-stack-gap: 21px;
--spacing-prelaunch-digits-gap: 21px;
--color-tile-border: #FFEA9E;
--color-tile-fill-top: #FFFFFF;
--color-tile-fill-bottom: rgba(255, 255, 255, 0.10);
--radius-tile-prelaunch: 12px;          /* existing --radius-tile is 4px — different; new token required */
--blur-tile-backdrop: blur(24.96px);
--overlay-prelaunch-cover: linear-gradient(18deg, #00101A 15.48%, rgba(0,18,29,0.46) 52.13%, rgba(0,19,32,0.00) 63.41%);
/* Z-index: reuse existing --z-hero-bg(0) / --z-hero-overlay(1) / --z-main-content(2) — no new z tokens needed */
```

**1.2 — i18n keys**  
Add `prelaunch` namespace to `messages/vi.json` and `messages/en.json`.

**1.3 — `lib/prelaunch/config.ts`**  
Write `tests/unit/lib/prelaunch-config.test.ts` first:
- `parsePrelaunchEnd(undefined)` → `null`
- `parsePrelaunchEnd('not-a-date')` → `null` + `console.warn`
- `parsePrelaunchEnd('2026-06-07T18:30:00+07:00')` → valid `Date`
- `isPrelaunchActive(null)` → `false` (gate inactive when env missing)
- `isPrelaunchActive(pastDate)` → `false`
- `isPrelaunchActive(futureDate)` → `true`

Then implement:
```typescript
// lib/prelaunch/config.ts
export function parsePrelaunchEnd(iso: string | undefined): Date | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) {
    console.warn('Invalid NEXT_PUBLIC_PRELAUNCH_END')
    return null
  }
  return d
}

export function isPrelaunchActive(cutoff: Date | null): boolean {
  if (!cutoff) return false
  return Date.now() < cutoff.getTime()
}
```

---

### Phase 2: UI Components *(TDD — tests first)*

**2.1 — `<DigitTile>` component**  
Write `tests/unit/prelaunch/digit-tile.test.tsx` first:
- Renders the given character inside the tile
- Falls back to `-` when given `null` / `undefined`
- Has `aria-hidden="true"` (digit tiles are announced by the parent live region, not individually)
- Applies the correct Tailwind classes (`rounded-[var(--radius-tile-prelaunch)]`, `backdrop-blur`, etc.) — assert via `data-testid` + `className` snapshot or structural assertions

Then implement `components/prelaunch/digit-tile.tsx` (no `'use client'`):

```tsx
interface DigitTileProps { char: string | null | undefined }

export default function DigitTile({ char }: DigitTileProps) {
  const display = char ?? '-'
  return (
    <div
      className="relative w-[76.8px] h-[122.88px] rounded-[var(--radius-tile-prelaunch)]"
      aria-hidden="true"
    >
      {/* Glass rectangle — opacity:0.5 applied here dims gradient+border+blur together (per design spec) */}
      <div className="absolute inset-0 rounded-[var(--radius-tile-prelaunch)]
        border-[0.75px] border-[var(--color-tile-border)]
        bg-gradient-to-b from-[var(--color-tile-fill-top)] to-[var(--color-tile-fill-bottom)]
        opacity-50 backdrop-blur-[24.96px]"
      />
      {/* Digit — flex-centered per design (Figma text-align:left is an artefact; visual is centered) */}
      <span className="absolute inset-0 flex items-center justify-center
        text-[var(--color-text-primary)] text-[73.728px] font-bold leading-none"
        style={{ fontFamily: 'var(--font-digital)' }}
      >
        {display}
      </span>
    </div>
  )
}
```

> **Note on `-webkit-backdrop-filter`**: Tailwind v4's `backdrop-blur-[24.96px]` utility emits both `backdrop-filter` and `-webkit-backdrop-filter` automatically. Do **not** add an explicit `-webkit-backdrop-filter` Tailwind class — it is not valid Tailwind syntax and would be silently ignored.

**2.2 — `<CountdownUnit>` component**  
Write `tests/unit/prelaunch/countdown-unit.test.tsx` first:
- Given `value={6}` (number) and `label="DAYS"`, renders two `<DigitTile>` chars `'0'` and `'6'` plus a `<span>DAYS</span>`
- Given `value="--"`, renders two tiles showing `-` each
- Zero-pads: `value={9}` → tiles display `'0'` and `'9'`
- Caps: `value={100}` → tiles display `'9'` and `'9'`; `console.warn` is emitted (FR-004)
- `value={0}` → tiles display `'0'` and `'0'`

Then implement `components/prelaunch/countdown-unit.tsx`:

```tsx
interface CountdownUnitProps {
  value: number | '--'
  label: string
}

function pad(v: number | '--'): string {
  if (v === '--') return '--'
  if (v > 99) {
    console.warn(`Countdown value ${v} exceeds 99 — capping at 99`)
    return '99'
  }
  return String(v).padStart(2, '0')
}

export default function CountdownUnit({ value, label }: CountdownUnitProps) {
  const padded = pad(value)
  const [tens, ones] = padded === '--' ? ['-', '-'] : [padded[0], padded[1]]
  return (
    <div className="flex flex-col gap-[var(--spacing-prelaunch-unit-stack-gap)] items-start
      w-[175px] sm:w-auto">
      <div className="flex flex-row gap-[var(--spacing-prelaunch-digits-gap)]">
        <DigitTile char={tens} />
        <DigitTile char={ones} />
      </div>
      <span className="text-[var(--color-text-primary)] font-bold
        text-[36px] leading-[48px] sm:text-[20px] md:text-[28px]"
        style={{ fontFamily: 'var(--font-montserrat)' }}
      >
        {label}
      </span>
    </div>
  )
}
```

**2.3 — `<PrelaunchCountdown>` client component**  
Write `tests/unit/prelaunch/prelaunch-countdown.test.tsx` first:
- Given valid `targetISO`, renders 3 countdown units with correct initial values (mock `Date.now` via `vi.setSystemTime`)
- After 60 s tick (`vi.advanceTimersByTime(60_000)`), displayed values update
- Given `targetISO={undefined}`, all tiles display `-` (no crash, no error boundary)
- Headline `"Sự kiện sẽ bắt đầu sau"` is rendered as `<h1>` (FR-009)
- Wrapper `<div>` has `aria-live="polite"` and `aria-atomic="true"` (FR-010)
- **FR-005**: Render the full component and assert zero `<a>`, `<button>`, `<form>`, `<input>` elements in the subtree
- When `remaining ≤ 0`, tiles render `00 / 00 / 00` — no `router.push` or `window.location` call fires (FR-013); assert using `vi.spyOn(window, 'location', 'get')` or a simple mock

Then implement `components/prelaunch/prelaunch-countdown.tsx`:

```tsx
'use client'
// TODO: extract shared useCountdown hook with <HomepageCountdown> visual variants

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { parseEventStart, getInitialCountdown } from '@/lib/event'
import CountdownUnit from './countdown-unit'
import type { CountdownValues } from '@/types/home'

interface PrelaunchCountdownProps { targetISO: string | undefined }

export default function PrelaunchCountdown({ targetISO }: PrelaunchCountdownProps) {
  const t = useTranslations('prelaunch')
  const target = useMemo(() => parseEventStart(targetISO), [targetISO])
  const [values, setValues] = useState<CountdownValues>(() =>
    getInitialCountdown(new Date(), target)
  )

  useEffect(() => {
    if (!target) return
    function tick() { setValues(getInitialCountdown(new Date(), target)) }
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [target])

  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-[var(--color-text-primary)] font-bold text-[36px] leading-[48px] text-center"
          style={{ fontFamily: 'var(--font-montserrat)' }}>
        {t('headline')}
      </h1>
      <div
        aria-live="polite"
        aria-atomic="true"
        className="flex flex-row gap-[var(--spacing-prelaunch-units-gap)] items-center"
      >
        <CountdownUnit value={values.days} label={t('days_label')} />
        <CountdownUnit value={values.hours} label={t('hours_label')} />
        <CountdownUnit value={values.minutes} label={t('minutes_label')} />
      </div>
    </div>
  )
}
```

**2.4 — `app/prelaunch/page.tsx` RSC**

Write `tests/unit/prelaunch/prelaunch-page.test.tsx` first (TR-004 page-level test):
- Mock `process.env.NEXT_PUBLIC_PRELAUNCH_END = '2026-06-07T18:30:00+07:00'` → assert rendered HTML includes a non-`--` digit tile value
- Mock env-var missing → assert rendered HTML has `--` tiles + `console.warn` fired

Then implement the page. It renders three layers stacked (no separate component files for BG/Cover — inline divs are sufficient):

```tsx
import type { Metadata } from 'next'
import PrelaunchCountdown from '@/components/prelaunch/prelaunch-countdown'

export const metadata: Metadata = {
  title: 'Sự kiện sẽ bắt đầu sau',
  description: 'Sự kiện sẽ bắt đầu sau',
  robots: { index: false, follow: false },  // FR-012: noindex,nofollow
}

export default function PrelaunchPage() {
  const targetISO = process.env.NEXT_PUBLIC_PRELAUNCH_END

  return (
    <div className="relative min-h-screen w-full bg-[var(--color-bg-dark)] overflow-hidden">
      {/* BG image — reuses .home-hero-bg (same asset as /about-saa-2025) */}
      <div
        className="absolute inset-0 z-[var(--z-hero-bg)] home-hero-bg"
        role="presentation"
        aria-hidden="true"
      />
      {/* Diagonal cover gradient for legibility */}
      <div
        className="absolute inset-0 z-[var(--z-hero-overlay)] pointer-events-none"
        style={{ background: 'var(--overlay-prelaunch-cover)' }}
        aria-hidden="true"
      />
      {/* Content */}
      <div className="relative z-[var(--z-main-content)] flex min-h-screen items-center justify-center
        px-[var(--spacing-prelaunch-page-px)] py-[var(--spacing-prelaunch-page-py)]
        sm:px-4 sm:py-12 md:px-12 md:py-20">
        <PrelaunchCountdown targetISO={targetISO} />
      </div>
    </div>
  )
}
```

> **`<PrelaunchBackground>` / `<PrelaunchCover>` as components?** — Design-style.md lists them in the Implementation Mapping but both are simple decorative `<div>`s with zero props. Inlining them in the page is correct; do NOT create separate files for them.

---

### Phase 3: Middleware Gate

Write `tests/integration/middleware/prelaunch-gate.test.ts` first:
- `now < cutoff`, request `'/'` → rewrites to `/prelaunch` (URL rewrite, not redirect)
- `now < cutoff`, request `'/about-saa-2025'` → rewrites to `/prelaunch`
- `now < cutoff`, request `'/_next/static/...'` → passthrough (matcher excludes this)
- `now < cutoff`, request `'/prelaunch'` → passthrough (allowlist)
- `now < cutoff`, request `'/auth/callback'` → passthrough (allowlist)
- `now >= cutoff`, request `'/'` → passthrough (gate inactive; auth logic runs)
- `now >= cutoff`, request `'/prelaunch'` → redirect to `'/'`
- `NEXT_PUBLIC_PRELAUNCH_END` missing → gate inactive, passthrough

Then extend `proxy.ts`:

```typescript
import { parsePrelaunchEnd, isPrelaunchActive } from '@/lib/prelaunch/config'

const PRELAUNCH_ALLOWLIST = ['/prelaunch', '/auth/callback']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const cutoff = parsePrelaunchEnd(process.env.NEXT_PUBLIC_PRELAUNCH_END)

  // Prelaunch gate — runs before auth
  if (isPrelaunchActive(cutoff)) {
    if (!PRELAUNCH_ALLOWLIST.some(p => pathname.startsWith(p))) {
      return NextResponse.rewrite(new URL('/prelaunch', request.url))
    }
  } else if (pathname === '/prelaunch') {
    // Gate lifted — prelaunch route is no longer reachable
    return NextResponse.redirect(new URL('/', request.url))
  }

  // ... existing auth logic unchanged ...
}
```

---

### Phase 4: Polish & Accessibility

- Verify `@media (prefers-reduced-motion: reduce)` suppresses any digit-tick animation.
- Verify `<h1>` is the only heading; no `<nav>`, no `<footer>`.
- Confirm `console.warn('Invalid NEXT_PUBLIC_PRELAUNCH_END')` fires on bad env; assert in unit test.
- Confirm `<meta name="robots" content="noindex,nofollow">` is present in rendered HTML.
- Responsive smoke-test at 360px, 768px, 1280px breakpoints (Playwright).

---

## Testing Strategy

| Type | Location | Coverage Target | Focus |
|------|----------|-----------------|-------|
| Unit | `tests/unit/lib/prelaunch-config.test.ts` | 100 % | `parsePrelaunchEnd`, `isPrelaunchActive` |
| Unit | `tests/unit/prelaunch/digit-tile.test.tsx` | ≥ 80 % | Renders char, `-` fallback, `aria-hidden` |
| Unit | `tests/unit/prelaunch/countdown-unit.test.tsx` | ≥ 80 % | Splits digits, pads, caps at 99, warns |
| Unit | `tests/unit/prelaunch/prelaunch-countdown.test.tsx` | ≥ 80 % | Tick, hydration, `--` fallback, `<h1>`, `aria-live`, no interactive elements (FR-005), no redirect at zero (FR-013) |
| Unit | `tests/unit/prelaunch/prelaunch-page.test.tsx` | Key paths | Page RSC — valid env → tiles; missing env → `--` + warn (TR-004) |
| Integration | `tests/integration/middleware/prelaunch-gate.test.ts` | All gate paths | Rewrite while active; allowlist `/prelaunch` + `/auth/callback`; pass-through post-cutoff; redirect `/prelaunch` → `/` post-cutoff; inactive when env missing |
| E2E | `tests/e2e/prelaunch/prelaunch.spec.ts` | Critical paths | Page renders 6 tiles; gate redirects `/about-saa-2025` → prelaunch; tiles freeze at 00 when zero (no nav) |

**TDD order (per Constitution §III)**:  
`prelaunch-config.test.ts` → `digit-tile.test.tsx` → `countdown-unit.test.tsx` → `prelaunch-countdown.test.tsx` → `prelaunch-page.test.tsx` → `prelaunch-gate.test.ts` → implement each in the same order.

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Hydration mismatch (SSR days value ≠ client value) | High — visible flash on load | `<PrelaunchCountdown>` initialises state from `targetISO` prop (same as server); round to minute → SSR and client agree |
| `setInterval` drift > 1 min on slow devices | Low — off by ≤ 1 min | Acceptable; spec explicitly does not show seconds |
| Middleware loop (prelaunch rewrites `/prelaunch` → `/prelaunch`) | High — infinite rewrite | `PRELAUNCH_ALLOWLIST` explicitly contains `'/prelaunch'`; covered by integration test |
| BG `backdrop-filter` unsupported (old Safari / Firefox) | Low — visual only | Tile still shows gradient fill without blur; `@supports` fallback not required for v1 |
| Z-index token collision | ~~Medium~~ → **Resolved** | Existing tokens `--z-hero-bg/overlay/main-content` are reused; no new z tokens added |
| `76.8px` sub-pixel rendering drift across browsers | Low — ≤ 0.2 px | Round to `77px` if fringing observed; documented in design-style.md |

---

## Resolved Pre-Implementation Checks

These were open questions in the plan; all three are now resolved:

- [x] **Root layout** — `app/layout.tsx` renders only `{children}` (no `<Header>` / `<Footer>` injected). `app/prelaunch/page.tsx` works without a nested `layout.tsx`.
- [x] **Z-index tokens** — `app/globals.css` already defines `--z-hero-bg: 0`, `--z-hero-overlay: 1`, `--z-main-content: 2`. The prelaunch page layers follow the same depth order, so **reuse these existing tokens** in the prelaunch components (`BgImage` → `--z-hero-bg`, `CoverGradient` → `--z-hero-overlay`, `Bìa` → `--z-main-content`). Do **not** add new `--z-bg-image` / `--z-bg-cover` / `--z-content` tokens. Remove those names from the Phase 1 CSS block above.
- [x] **`--radius-tile`** — current value is `4px` (Homepage tile). The prelaunch tile requires `12px`. Add a separate `--radius-tile-prelaunch: 12px` token to `app/globals.css` — do not overwrite the existing `--radius-tile`.
