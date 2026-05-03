# Design Style: Countdown - Prelaunch page

**Frame ID**: `2268:35127`
**Frame Name**: `Countdown - Prelaunch page`
**Figma Link**: https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C/?node-id=2268:35127
**Extracted At**: 2026-04-26

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| `--color-bg-dark` | `#00101A` | 100% | Page solid background, gradient solid stop (reused from Login/Homepage) |
| `--color-bg-dark-soft` | `#00121D` | 46% | Mid-stop of the diagonal cover gradient |
| `--color-bg-dark-air` | `#001320` | 0% | End-stop of the diagonal cover gradient (transparent on the right side) |
| `--color-text-primary` | `#FFFFFF` | 100% | Headline ("Sự kiện sẽ bắt đầu sau"), unit labels ("DAYS"/"HOURS"/"MINUTES"), digit numerals |
| `--color-tile-border` | `#FFEA9E` | 50% effective | Digit-tile gold border (`0.75px solid #FFEA9E` rendered at `opacity: 0.5` on the parent rectangle) |
| `--color-tile-fill-top` | `#FFFFFF` | 100% (gradient start) | Digit-tile glass fill — gradient top stop |
| `--color-tile-fill-bottom` | `rgba(255,255,255,0.10)` | 10% (gradient end) | Digit-tile glass fill — gradient bottom stop |
| `--color-tile-rect-opacity` | — | 50% | Composite opacity applied to the tile rectangle (the gradient × this opacity yields the visible "frosted" surface) |

> The tile rectangle uses the Figma variables `--Details-Text-Primary-1: #FFEA9E` (border) and
> `--Details-Text-Secondary-1: #FFFFFF` (gradient top). Re-declare these as `--color-tile-border`
> and `--color-tile-fill-top` in `app/globals.css` (Constitution §II — no hard-coded hex in JSX).

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing | Usage |
|------------|-------------|------|--------|-------------|----------------|-------|
| `--text-prelaunch-headline` | Montserrat | 36px | 700 | 48px | 0px | "Sự kiện sẽ bắt đầu sau" headline (node `2268:35137`) — center-aligned, `#FFFFFF` |
| `--text-prelaunch-digit` | Digital Numbers (Figma) → **DSEG7-Classic Bold** (web) | 73.728px (round to `74px` if needed for sub-pixel rendering) | 400 in Figma → 700 in DSEG7 (only weight available) | n/a (rendered ~95px tall by glyph metrics) | 0% | Single digit "0"–"9" or `-` inside each tile (nodes `I…;186:2617`) — color `#FFFFFF`. **Visually centered** in the tile (each glyph is ~59 px wide × ~95 px tall inside a 76.8 × 122.88 tile). Implementation MUST use `display: flex; align-items: center; justify-content: center` on the digit's container — do **not** rely on Figma's reported `text-align: left`, because the Figma `text-align` only applies inside the 59-px glyph box (which is itself absolute-positioned to be centered in the tile). Use a flex-centered `<span>` inside the tile and you will reproduce the intended visual. |
| `--text-prelaunch-label` | Montserrat | 36px | 700 | 48px | 0px | Unit labels "DAYS"/"HOURS"/"MINUTES" (nodes `2268:35143` / `…48` / `…53`) — `#FFFFFF`, uppercase (text-content already uppercase in Figma; do **not** add `text-transform: uppercase` — it is unnecessary and could re-uppercase translations) |

> **Font swap (same as Homepage SAA)** — Figma uses the proprietary "Digital Numbers" font for
> the LCD-style digits. The web build MUST use **DSEG7-Classic Bold** (SIL OFL, already shipped at
> `public/fonts/DSEG7Classic-Bold.woff2` and exposed as `var(--font-digital)` via `next/font/local`
> in `app/layout.tsx`). Visual difference is negligible at this 73.7 px display size.

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| `--spacing-prelaunch-page-px` | 144px | Outer page horizontal padding (Bìa container, desktop) |
| `--spacing-prelaunch-page-py` | 96px | Outer page vertical padding (Bìa container, desktop) |
| `--spacing-prelaunch-section-gap` | 120px | Bìa column gap (between Frame 487 and any future siblings — currently a single child, but the gap is set in Figma) |
| `--spacing-prelaunch-frame-487-gap` | 60px | Gap inside Frame 487 |
| `--spacing-prelaunch-frame-523-gap` | 24px | Gap inside Frame 523 (between centered countdown blocks) |
| `--spacing-prelaunch-headline-gap` | 24px | Gap between headline ("Sự kiện sẽ bắt đầu sau") and the timer row inside `Countdown time` (`2268:35136`) |
| `--spacing-prelaunch-units-gap` | 60px | Horizontal gap between Days, Hours, Minutes columns (`Time` row, `2268:35138`) |
| `--spacing-prelaunch-unit-stack-gap` | 21px | Vertical gap between the 2-digit row and its label ("DAYS"/"HOURS"/"MINUTES") inside each unit (`1_Days`, `2_Hours`, `3_Minutes`) |
| `--spacing-prelaunch-digits-gap` | 21px | Gap between the 2 digit tiles within one unit (`Frame 485`) |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| `--radius-tile` | `12px` | Digit-tile rectangle corners |
| `--border-tile` | `0.75px solid #FFEA9E` | Digit-tile rectangle border (rendered at `opacity: 0.5` via the parent rectangle) |

### Shadows / Effects

| Token Name | Value | Usage |
|------------|-------|-------|
| `--blur-tile-backdrop` | `blur(24.96px)` | Digit-tile `backdrop-filter` — frosts whatever sits behind the tile (the keyvisual BG) |
| `--overlay-prelaunch-cover` | `linear-gradient(18deg, #00101A 15.48%, rgba(0,18,29,0.46) 52.13%, rgba(0,19,32,0.00) 63.41%)` | Diagonal cover overlay (node `2268:35130`) — keeps the bottom-left side dark for legibility while letting the keyvisual show through on the upper-right |

### Z-index Scale

| Token Name | Value | Layer | Usage |
|------------|-------|-------|-------|
| `--z-bg-image` | 0 | Bottom | `MM_MEDIA_BG Image` |
| `--z-bg-cover` | 1 | — | `Cover` gradient overlay |
| `--z-content` | 2 | — | `Bìa` container (headline + timer) |

> No fixed/sticky elements on this screen. No header, no footer, no modal. Z is shallow.

---

## Layout Specifications

### Frame

| Property | Value |
|----------|-------|
| Width | 1512px (Figma reference) |
| Height | 1077px |
| Background | `#00101A` |
| Inner content padding | 96px (top/bottom) × 144px (left/right) — applied to `Bìa` |

### Layout Structure (ASCII)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Countdown - Prelaunch page (1512 × 1077, bg:#00101A)                         │
│                                                                              │
│ [MM_MEDIA_BG Image — 1512×1077, full-bleed, z:0]                             │
│ [Cover — 1512×1077, linear-gradient(18deg, #00101A → transparent), z:1]      │
│                                                                              │
│   Bìa (1512×456, py:96 px:144, flex col gap:120, items-center, z:2)         │
│     Frame 487 (1512×264, flex col gap:60, items-flex-start)                  │
│       Frame 523 (1512×264, flex col gap:24, items-flex-start, justify:center)│
│         Countdown time (1512×264, flex col gap:24, items-center)             │
│           ┌────────────────────────────────────────────────────┐             │
│           │ "Sự kiện sẽ bắt đầu sau" — Montserrat 700 36/48 #F │             │
│           ├────────────────────────────────────────────────────┤             │
│           │ Time (644×192, flex row gap:60, items-center)      │             │
│           │  ┌──────┐  ┌──────┐  ┌──────┐                      │             │
│           │  │ Days │  │ Hrs  │  │ Mins │  each 175×192 col gap:21           │
│           │  │ □ □  │  │ □ □  │  │ □ □  │  Frame 485 row gap:21              │
│           │  │ DAYS │  │HOURS │  │MINUTE│  Montserrat 700 36/48 #FFF         │
│           │  └──────┘  └──────┘  └──────┘                      │             │
│           └────────────────────────────────────────────────────┘             │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

Each digit tile (Group 5 / Group 4):
  77 × 123 INSTANCE wrapper (positions the tile in the 2-digit row gap)
  ↳ Rectangle 1 — 76.8 × 122.88 — radius 12, border 0.75px #FFEA9E, opacity 0.5,
                  background linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.10) 100%),
                  backdrop-filter: blur(24.96px)
  ↳ "0" — Digital Numbers 73.728px / ≈95 lh / #FFFFFF / left-align inside the tile
```

> **Centering note** — `Frame 487` (`flex-col`, items `flex-start`) is 1512 px wide, the same as the
> page; `Frame 523`, `Countdown time` are also 1512 wide with `align-items: center`. Net effect:
> the headline and the 644 px-wide `Time` row sit horizontally centered in the 1224-wide content area
> (1512 − 2×144). Implementation uses `mx-auto` on the inner content stack (max-width 644 + the labels
> overflow on either side as designed).
>
> **Wrapper-collapse note** — Figma stacks four wrappers (`Bìa` → `Frame 487` → `Frame 523` → `Countdown time`) before the actual content. Three of them carry only a `gap` value with a single child (Frame 487 has 60 px gap with 1 child, Frame 523 has 24 px gap with 1 child, Countdown time has 24 px gap with 2 children). Implementation MAY collapse `Frame 487` and `Frame 523` since their `gap` is unused (no siblings to space). Render as: `Bìa (gap:120 — but only 1 child too) → Countdown time (gap:24 between headline and Time row) → [headline, Time row]`. The 120/60 gaps survive only as forward-compatibility (in case a sibling section is added later); preserving them as Tailwind classes is fine but not required.

---

## Component Style Details

### Page Container — `Bìa` (`2268:35131`)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `2268:35131` | — |
| width | 100vw (1512 in Figma) | `width: 100%` |
| height | hug content (~456px in Figma) | `min-height: 100vh` (so the screen fully covers the viewport) |
| padding | 96px 144px | `padding: var(--spacing-prelaunch-page-py) var(--spacing-prelaunch-page-px)` |
| display | flex col, items-center, justify-center | `display: flex; flex-direction: column; align-items: center; justify-content: center` |
| gap | 120px | `gap: var(--spacing-prelaunch-section-gap)` |
| position | relative (so absolute BG/cover layer behind) | `position: relative; z-index: var(--z-content)` |

### Background Layer — `MM_MEDIA_BG Image` (`2268:35129`)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `2268:35129` | — |
| dimensions | 1512 × 1077 (full-bleed) | `position: absolute; inset: 0` |
| image source | **Reuse** `/public/assets/home/hero-bg.jpg` — same "Root Further" root illustration as the `/about-saa-2025` Homepage. No new export required. | `url('/assets/home/hero-bg.jpg')` |
| sizing (Figma raw) | `background-size: 109.392% 216.017%`, `background-position: -142px -789.753px` (literal Figma value relative to the 1512 × 1077 frame). | — |
| sizing (implementation) | The Homepage already uses `background-size: cover; background-position: right top` (`.home-hero-bg` class). For the prelaunch page, the Figma shows the illustration positioned toward the upper-right quadrant, matching `right top` well. **Reuse the same CSS class** (or the same `cover` + `right top` values) — verify against the Figma frame visually; if the focal point drifts, adjust to `center 30%` as a fallback. | reuse `.home-hero-bg` or `background-image: url('/assets/home/hero-bg.jpg'); background-size: cover; background-position: right top` |
| z-index | 0 | `z-index: var(--z-bg-image)` |

### Cover Gradient — `Cover` (`2268:35130`)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `2268:35130` | — |
| dimensions | 1512 × 1077 (full-bleed) | `position: absolute; inset: 0` |
| background | `linear-gradient(18deg, #00101A 15.48%, rgba(0,18,29,0.46) 52.13%, rgba(0,19,32,0.00) 63.41%)` | `background: var(--overlay-prelaunch-cover)` |
| pointer-events | none | `pointer-events: none` |
| z-index | 1 | `z-index: var(--z-bg-cover)` |

### Headline — `Awards Information Navigation Links` text (`2268:35137`)

> ⚠ The Figma layer is named "Awards Information Navigation Links" but its `character` value is
> `Sự kiện sẽ bắt đầu sau`. The mis-named layer is a Figma copy-paste artefact — implementation uses
> the actual character content, not the layer name.

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `2268:35137` | — |
| width (Figma raw) | 1512px (the text element spans the full frame width with `text-align: center`) | — |
| width (implementation) | `auto` / `max-content`; let the parent flex column center it via `align-items: center` | `width: auto` |
| height | 48px | `line-height: 48px` |
| font | Montserrat 700 36/48 / ls 0 | `font-family: var(--font-montserrat); font-weight: 700; font-size: 36px; line-height: 48px; letter-spacing: 0` |
| color | `#FFFFFF` | `color: var(--color-text-primary)` |
| text-align | center | `text-align: center` |
| element | `<h1>` | semantic landmark for screen readers |

### Countdown Timer Row — `Time` (`2268:35138`)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `2268:35138` | — |
| width | 644px (hug) | `width: max-content` (or `w-fit`) |
| height | 192px | — |
| display | flex row | `display: flex; flex-direction: row` |
| align-items | center | `align-items: center` |
| gap | 60px | `gap: var(--spacing-prelaunch-units-gap)` |

### Countdown Unit — `1_Days` / `2_Hours` / `3_Minutes` (`2268:35139` / `…44` / `…49`)

A single component, 3 instances. Width and height are identical across all three; only the
label text differs.

| Property | Value | CSS |
|----------|-------|-----|
| **Node IDs** | `2268:35139`, `2268:35144`, `2268:35149` | — |
| width × height | 175px × 192px | `width: 175px; height: 192px` |
| layout | flex column, items-flex-start, justify-center | `display: flex; flex-direction: column; align-items: flex-start; justify-content: center` |
| gap | 21px | `gap: var(--spacing-prelaunch-unit-stack-gap)` |

#### Digit-pair row — `Frame 485` (`2268:35140` / `…45` / `…50`)

| Property | Value | CSS |
|----------|-------|-----|
| width × height | 175px × 123px | — |
| display | flex row | `display: flex; flex-direction: row` |
| align-items | center | — |
| gap | 21px | `gap: var(--spacing-prelaunch-digits-gap)` |

#### Single digit tile — `Group 5` / `Group 4` (instances of `186:2619`)

The instance wrapper (e.g. `2268:35141`) is **77 × 123** with `position: absolute` in Figma — it
exists only to position the tile inside the row. In implementation, render each tile as a single
`<div>` (no extra wrapper): the tile rectangle and the digit text are siblings, with the digit
absolutely positioned over the rectangle.

##### Rectangle (tile background) — `I…;186:2616`

| Property | Value | CSS |
|----------|-------|-----|
| width × height | 76.8px × 122.88px | `width: 76.8px; height: 122.88px` |
| border | 0.75px solid `#FFEA9E` | `border: 0.75px solid var(--color-tile-border)` |
| opacity | 0.5 (applied to the rectangle, dimming both the gradient fill and the border) | `opacity: 0.5` |
| background | `linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.10) 100%)` | `background: linear-gradient(180deg, var(--color-tile-fill-top) 0%, var(--color-tile-fill-bottom) 100%)` |
| border-radius | 12px | `border-radius: var(--radius-tile)` |
| backdrop-filter | `blur(24.96px)` | `backdrop-filter: var(--blur-tile-backdrop); -webkit-backdrop-filter: var(--blur-tile-backdrop)` |

> **Implementation tip** — applying `opacity: 0.5` on the rectangle dims the gradient AND the
> border AND the backdrop-blur layer in lockstep. This is what produces the visible "ghosted"
> tile look. Do NOT split into separate elements with their own opacities — the composite
> matters.

##### Digit text — `I…;186:2617`

| Property | Value | CSS |
|----------|-------|-----|
| width × height | ~59 × 95 in Figma (single-glyph metrics) — implementation lets the glyph occupy the natural box | — |
| position | absolute over the tile rectangle | `position: absolute; inset: 0; display: flex; align-items: center; justify-content: center` |
| font-family | Digital Numbers → **DSEG7-Classic Bold** (web) | `font-family: var(--font-digital), monospace` |
| font-size | 73.728px (Figma value); `74px` is acceptable for browsers that snap to integer pixel grids | `font-size: 73.728px` (or `font-size: clamp(40px, 8vw, 73.728px)` for fluid) |
| font-weight | 400 (Figma) → 700 (DSEG7 — the open-source font only ships a single weight, "Bold") | `font-weight: 700` |
| color | `#FFFFFF` | `color: var(--color-text-primary)` |
| letter-spacing | 0% | `letter-spacing: 0` |
| character set | `'0' .. '9'` and the fallback `'-'` | one character per tile |
| z-index | above the rectangle | (default — sibling rendered after, no explicit z needed) |

> **Alignment note** — Figma reports `text-align: left` on the glyph TEXT element, but the
> TEXT element is absolutely positioned inside the tile such that its 59-px box is centered.
> Because the 59-px box is the glyph's own bounds, `text-align` is irrelevant — the visual
> is "glyph centered in tile". Implementation MUST flex-center the digit; do not copy
> `text-align: left` literally or the digit will sit on the left edge of the tile.

#### Unit label — `DAYS` / `HOURS` / `MINUTES` (`2268:35143` / `…48` / `…53`)

| Property | Value | CSS |
|----------|-------|-----|
| width | hug (DAYS=103, HOURS=138, MINUTES=173) | `width: auto` |
| height | 48px | — |
| font | Montserrat 700 36/48 / ls 0 | `font-family: var(--font-montserrat); font-weight: 700; font-size: 36px; line-height: 48px; letter-spacing: 0` |
| color | `#FFFFFF` | `color: var(--color-text-primary)` |
| text-align | left | `text-align: left` (the labels are left-aligned to the first digit's leading edge — see Figma `position.startX` matching the unit container's start) |
| element | `<span>` | nested under the unit `<div>`, NOT a heading |

> **Label-to-digits alignment** — in Figma each label's `startX` matches its parent unit's
> `startX` (i.e. the label is left-aligned to the leftmost digit tile, not centered under the
> two-tile pair). Preserve this in implementation: `align-items: flex-start` on the unit's
> column, label uses default left alignment.

---

## Component Hierarchy with Styles

```
PrelaunchPage (relative, min-h-screen, bg-[var(--color-bg-dark)], overflow-hidden)
├── BgImage (absolute inset-0 z-0 home-hero-bg)  ← reuses /assets/home/hero-bg.jpg
├── CoverGradient (absolute inset-0 z-[1] bg-[linear-gradient(18deg,#00101A_15.48%,rgba(0,18,29,0.46)_52.13%,rgba(0,19,32,0)_63.41%)] pointer-events-none)
└── Bìa (relative z-[2] flex flex-col items-center justify-center min-h-screen px-36 py-24 gap-[120px])
    └── PrelaunchCountdown (flex flex-col items-center gap-6)
        ├── Headline <h1> "Sự kiện sẽ bắt đầu sau" (Montserrat 700 36/48 #FFF text-center)
        └── Time (flex flex-row gap-[60px] items-center)
            ├── CountdownUnit DAYS (flex flex-col gap-[21px] w-[175px] h-48)
            │   ├── DigitPair (flex flex-row gap-[21px])
            │   │   ├── DigitTile [tens]
            │   │   └── DigitTile [ones]
            │   └── Label <span>DAYS</span> (Montserrat 700 36/48 #FFF)
            ├── CountdownUnit HOURS (same shape, label "HOURS")
            └── CountdownUnit MINUTES (same shape, label "MINUTES")

DigitTile (relative w-[76.8px] h-[122.88px] rounded-[var(--radius-tile)])
├── Rectangle (absolute inset-0 rounded-[var(--radius-tile)] border-[0.75px] border-[var(--color-tile-border)]
│              bg-gradient-to-b from-white to-white/10 opacity-50 backdrop-blur-[24.96px])
└── Digit <span> (absolute inset-0 flex items-center justify-center font-[var(--font-digital)] text-[73.728px] text-white)
```

---

## Responsive Specifications

### Breakpoints

| Name | Min Width | Max Width |
|------|-----------|-----------|
| Mobile | 0 | 767px |
| Tablet | 768px | 1279px |
| Desktop | 1280px | ∞ |

### Responsive Changes

#### Mobile (< 768px)

| Component | Changes |
|-----------|---------|
| Bìa padding | `py-12 px-4` (48 / 16) |
| Headline | `clamp(20px, 5.5vw, 36px)` / line-height 1.2 |
| Section gap (Bìa) | 64px (was 120) |
| Time row gap | 24px (was 60) |
| Unit width | `auto` (was 175 fixed) |
| Unit stack gap | 12px (was 21) |
| Digit-pair gap | 8px (was 21) |
| Digit tile | `52 × 84` |
| Digit text | `clamp(36px, 9vw, 50px)` |
| Label | Montserrat 700 20/28 |

#### Tablet (768 – 1279px)

| Component | Changes |
|-----------|---------|
| Bìa padding | `py-20 px-12` (80 / 48) |
| Headline | 32/44 |
| Time row gap | 40px |
| Digit tile | `64 × 102` |
| Digit text | 60px |
| Digit-pair gap | 14px |
| Unit stack gap | 16px |
| Label | Montserrat 700 28/36 |

#### Desktop (≥ 1280px)

Matches Figma reference (1512 design width). Headline 36/48, digit tile 76.8 × 122.88, digit
text 73.728px, gaps 60 / 21 / 21, label 36/48.

---

## Icon Specifications

This screen has **no icons** — it is text-only beyond the keyvisual BG.

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Digit text | (optional) opacity 0 → 1 | 200ms | ease-in-out | Value tick (once per minute). MUST be skipped under `prefers-reduced-motion: reduce`. |
| BG image | (none) | — | — | Static. |

> No hover, focus, active, or click states because the screen has zero interactive elements.

---

## Accessibility

| Concern | Implementation |
|---------|----------------|
| Heading structure | The headline uses `<h1>`; it is the only heading on the page. No nested `<h2>+`. |
| Live region | The countdown wrapper element MUST be `<div aria-live="polite" aria-atomic="true">` so screen readers announce each tick. The `role="timer"` attribute is OPTIONAL and not required (AT support is uneven; the live region is the canonical pattern). |
| Decorative imagery | `MM_MEDIA_BG Image` and `Cover` gradient overlay both render with `aria-hidden="true"` and (for the image) `alt=""`. They MUST NOT be announced. |
| Keyboard focus | No interactive elements ⇒ no focus rings; `Tab` skips through the page without visibly stopping. No skip-link is required. |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` MUST suppress the optional 200 ms digit fade animation. |
| Color contrast (verified) | White (`#FFFFFF`) on `#00101A` (page background, left side after gradient) = **18.7 : 1** — passes WCAG AA & AAA for both normal and large text. |
| Color contrast (to verify in implementation) | The white digit numerals sit over a translucent glass tile (gradient white→white-10 % at composite opacity 0.5) — the visible color directly under the digit depends on the keyvisual region (dark BG region: ~`#788A95` composite, contrast vs white ≈ 3.5 : 1; bright keyvisual region: variable). The digit is positioned in the lower half of the tile where the gradient is mostly transparent, so most pixels behind the digit are the BG image plus a thin white sheen. Implementation MUST verify with an automated contrast audit; if the digit fails 4.5 : 1 in any region, increase the tile gradient's bottom stop opacity from 10 % to 20 %, or add a faint inner overlay (`background: rgba(0,16,26,0.20)`) on the rectangle. |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind Classes (suggested) | React Component |
|----------------|---------------|------------------------------|-----------------|
| Page root | `2268:35127` | `relative min-h-screen w-full bg-[var(--color-bg-dark)] overflow-hidden` | `<PrelaunchPage>` (RSC) |
| BG image | `2268:35129` | `absolute inset-0 z-0 home-hero-bg` (reuse existing `.home-hero-bg` class from `app/globals.css`) | `<PrelaunchBackground>` (decorative `<div role="presentation" aria-hidden="true">`) |
| Cover gradient | `2268:35130` | `absolute inset-0 z-[1] pointer-events-none bg-[linear-gradient(18deg,#00101A_15.48%,rgba(0,18,29,0.46)_52.13%,rgba(0,19,32,0)_63.41%)]` | `<PrelaunchCover>` |
| Bìa container | `2268:35131` | `relative z-[2] flex flex-col items-center justify-center min-h-screen px-36 py-24 gap-[120px] sm:px-4 sm:py-12 sm:gap-16 md:px-12 md:py-20` | `<PrelaunchPage>` body |
| Headline | `2268:35137` | `text-white font-bold text-[36px] leading-[48px] text-center sm:text-[clamp(20px,5.5vw,36px)]` | `<h1>` inside `<PrelaunchCountdown>` |
| Time row | `2268:35138` | `flex flex-row gap-[60px] items-center sm:gap-6 md:gap-10` | `<CountdownTimer>` (Client component — owns `setInterval`) |
| Countdown unit | `2268:35139` / `…44` / `…49` | `flex flex-col gap-[21px] items-start w-[175px] h-48 sm:w-auto sm:h-auto sm:gap-3 md:gap-4` | `<CountdownUnit label="DAYS\|HOURS\|MINUTES" value=…>` |
| Digit-pair row | `2268:35140` / `…45` / `…50` | `flex flex-row gap-[21px] sm:gap-2 md:gap-3.5` | `<DigitPair value="00">` |
| Digit tile | `2268:35141` etc. | `relative w-[76.8px] h-[122.88px] rounded-[12px] sm:w-[52px] sm:h-[84px] md:w-16 md:h-[102px]` | `<DigitTile char="0">` |
| Tile rectangle | `I…;186:2616` | `absolute inset-0 rounded-[12px] border-[0.75px] border-[var(--color-tile-border)] bg-gradient-to-b from-white to-white/10 opacity-50 backdrop-blur-[24.96px]` | (sub-element of `<DigitTile>`) |
| Digit text | `I…;186:2617` | `absolute inset-0 flex items-center justify-center text-white text-[73.728px] sm:text-[clamp(36px,9vw,50px)] md:text-[60px]` + `font-[var(--font-digital)]` | (sub-element of `<DigitTile>`) |
| Label | `2268:35143` / `…48` / `…53` | `text-white font-bold text-[36px] leading-[48px] sm:text-[20px] md:text-[28px]` | `<span>` inside `<CountdownUnit>` |

---

## Notes

- **Component architecture (Q6 resolved — fork)**: Use a dedicated `<PrelaunchCountdown>`
  component. The glass-card tiles, larger font size, and white-only palette here are visually
  distinct enough from the Homepage yellow/gold countdown that sharing one component would
  require a complex variant API. Fork the component and add a `// TODO: extract shared useCountdown
  hook with <PrelaunchCountdown> and <HomepageCountdown> visual variants` comment for future
  consolidation.
- **Font asset is shared**: do NOT add a second copy of `DSEG7Classic-Bold.woff2`. The
  `var(--font-digital)` binding from Homepage is reused.
- **Keyvisual asset** (Q4 resolved — reuse Homepage asset): use the existing
  `/public/assets/home/hero-bg.jpg`. This is the same "Root Further" root illustration as
  `/about-saa-2025`. The prelaunch page MUST NOT maintain its own copy. Reuse the `.home-hero-bg`
  CSS class from `app/globals.css` (`cover` + `right top`) or apply the same property values
  inline — verify visually against the Figma frame; if the focal point drifts, change
  `background-position` to `center 30%`.
- **Color contrast**: white digit on glass tile sits over the keyvisual root illustration —
  on the bright (right) side of the BG the contrast may dip below 4.5:1. Verify in
  implementation; if low, increase tile rectangle's gradient bottom stop opacity from 10% to
  15–20% to provide a slightly darker base, or apply a thin solid `#00101A` 20% inner overlay
  on the tile.
- **No hard-coded hex in JSX** (Constitution §II) — all `#FFEA9E`, `#FFFFFF`, `#00101A` etc.
  declared above MUST be in `app/globals.css` as CSS variables consumed via `var()` /
  `bg-[var(--token)]`. The arbitrary-value Tailwind classes shown in the Implementation
  Mapping table (e.g. `bg-[linear-gradient(18deg,...)]`) are acceptable for the gradient
  overlay since it is a screen-specific token; if the gradient is reused on another screen,
  promote it to a CSS variable.
- **Icons** — none on this screen.
- **Accessibility** — see the dedicated Accessibility section above.
- **Tailwind v4 vs raw px** — `text-[36px]` and `w-[76.8px]` are valid Tailwind v4 arbitrary
  values; they compile cleanly. Sub-pixel widths like `76.8px` work in modern browsers but
  may render slightly differently between Chromium / WebKit / Firefox at < 1× DPR. If you see
  fringing, round to `77px` and accept a 0.2-px width drift versus the Figma value.
