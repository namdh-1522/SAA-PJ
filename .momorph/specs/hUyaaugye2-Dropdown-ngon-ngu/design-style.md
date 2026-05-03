# Design Style: Dropdown — Ngôn ngữ (Language Menu)

**Frame ID**: `hUyaaugye2` (root node `721:4942`)
**Frame Name**: `Dropdown-ngôn ngữ`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Figma Link**: https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C?node-id=hUyaaugye2
**Extracted At**: 2026-04-27
**Last Reviewed**: 2026-04-29 (Q6 amended — EN flag is the UK Union Jack matching the Figma visual rendering, not the literal `GB-NIR` layer name). Prior review: 2026-04-27 (`momorph.reviewspecify` × 2 — width arithmetic corrected; predicted hover / focus / motion tokens **approved**; selected-highlight inset locked at 1 px per side per design)
**Reference screenshot**: [`./assets/frame.png`](./assets/frame.png)

---

## Overview

This design captures the **Language Menu overlay** that opens when the user clicks the
header `VN ▾` / language button on any authenticated screen (Homepage SAA, Awards
Information, etc., per `.momorph/SCREENFLOW.md`). It is a small, dark, anchored dropdown
listing the two supported locales — **VN** (Tiếng Việt) and **EN** (English) — with the
current locale rendered in a yellow-tinted "selected" state.

The frame's outer canvas is a 215 × 304 px gray staging surface (`#696969`) used by the
designer to preview the dropdown against a neutral background. **The 215 × 304 gray area
is NOT part of the implementation** — it is the Figma canvas. The implementation surface
is the inner `A_Dropdown-List` (122 × 124 px), which is the actual menu component.

---

## Design Tokens

### Colors

| Token Name | Hex / RGBA | Opacity | Usage |
|------------|------------|---------|-------|
| `--color-details-container-2` | `#00070C` | 100% | Dropdown panel background (near-black) |
| `--color-details-border` | `#998C5F` | 100% | Dropdown panel border (1px, brand-gold) |
| `--color-brand-yellow` | `#FFEA9E` | 100% | Brand-yellow source for selected highlight |
| `--color-selected-bg` | `rgba(255, 234, 158, 0.20)` | 20% | Selected item background (yellow @ 20% α) |
| `--color-text-on-dark` | `#FFFFFF` | 100% | All locale labels (`VN`, `EN`) |
| `--color-canvas-staging` | `#696969` | 100% | Figma preview canvas — **NOT** an app token |

> Tokens above MUST be added to (or mapped onto) the global CSS variable layer per
> Constitution §II "Tailwind CSS v4 + Design Tokens". `--color-details-container-2` and
> `--color-details-border` already appear in the Figma file's variable set — keep the
> same names in the codebase to preserve the design ↔ code mapping.

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| `--text-locale-label` | Montserrat | 16px | 700 | 24px | 0.15px (≈ `0.009em`) |

> Single text style across the dropdown — used by both `VN` and `EN` labels. Font is
> Montserrat (already used elsewhere in the project per the Awards Information design
> style); ensure it is loaded via `next/font` per Constitution §II.

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| `--spacing-dropdown-padding` | `6px` | Panel inner padding (outer container) |
| `--spacing-item-padding-x` | `16px` | Per-item horizontal padding |
| `--spacing-item-padding-y` | `16px` | Per-item vertical padding |
| `--spacing-item-icon-gap` | `4px` | Gap between flag icon and text within an item |
| `--spacing-item-row-gap` | `2px` | Gap between the icon-+-label group and the right-edge content (designer-set; visually negligible because each item is `space-between`) |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| `--radius-dropdown` | `8px` | Outer panel corner |
| `--radius-item` | `4px` | Per-item corner (inner `Frame 485` / `Content`) |
| `--radius-selected-bg` | `2px` | Yellow-tint selected highlight box |
| `--border-width-panel` | `1px` | Outer panel stroke |

### Shadows

> The Figma frame does **not** apply a drop shadow to the dropdown panel itself
> (panel `effects` array is empty / pass-through). The dark panel background sits on
> the page and relies on its border + colour contrast to read as elevated.
>
> If, during implementation, the parent header background is the same dark navy as
> `#00070C`, an OPTIONAL subtle elevation shadow MAY be added (`0 4px 12px
> rgba(0,0,0,0.45)`) for depth — but this is NOT in the source design.

---

## Layout Specifications

### Dropdown Panel (`A_Dropdown-List`)

| Property | Value | Notes |
|----------|-------|-------|
| `width` | `122px` | Bounding box (Figma `endX − startX`). Border is drawn ON the bounding edge (no extra space added), so the inner content area is `122 − 2 × 6px padding = 110px` wide. |
| `height` | `124px` | Bounding box. Inner content area is `124 − 2 × 6px padding = 112px` tall — exactly fits two 56px rows. |
| `padding` | `6px` | All sides |
| `background` | `#00070C` | `--color-details-container-2` |
| `border` | `1px solid #998C5F` | `--color-details-border`; drawn inside the bounding box (Figma "inside stroke" semantics — does NOT add to bounding dimensions) |
| `border-radius` | `8px` | `--radius-dropdown` |
| `display` | `flex` | |
| `flex-direction` | `column` | Items stack vertically |
| `align-items` | `flex-start` | (Stretch is equivalent here since each row is 110px wide = full inner width.) |
| `gap` | `0` | Items are flush-stacked (`56px + 56px = 112px` — exactly matches inner height). |
| `position` | `absolute` | Anchored to language button; placement detail below |

### Item — Selected (`A.1` Tiếng Việt)

| Property | Value | Notes |
|----------|-------|-------|
| `width` | `108px` | A 1 px inset on each side of the 110 px row width — a deliberate decorative inset on the yellow highlight. **Locked** by spec FR-015; full-width highlights are NOT permitted. |
| `height` | `56px` | |
| `background` | `rgba(255, 234, 158, 0.20)` | `--color-selected-bg` (yellow @ 20%) |
| `border-radius` | `2px` | `--radius-selected-bg` |
| `display` | `flex` | |
| `flex-direction` | `row` | Icon + label inline |
| `align-items` | `center` | |
| `padding` | `0` | The yellow highlight is a flat box; padding lives on the inner `Frame 485` |
| `position` | `absolute` | (Designer used absolute positioning inside the panel; in code, treat as a flex child of the panel.) |

### Item — Default (`A.2` Tiếng Anh)

| Property | Value | Notes |
|----------|-------|-------|
| `width` | `110px` | Matches the panel inner content width (`122 − 2 × 6 = 110`). Use `100%` in implementation. |
| `height` | `56px` | |
| `background` | `transparent` | Default state has no fill |
| `border-radius` | `0` (item) / `4px` (inner `Content` frame) | `--radius-item` |
| `display` | `flex` | |
| `align-items` | `center` | |
| `justify-content` | `center` | (Frame-level; inner `Content` row uses `space-between`) |
| `padding` | `0` (item) / `16px` (inner `Content` frame) | |

> **Width canonical**: The dropdown's inner content area is **110 × 112 px** (= `122 − 12`
> by `124 − 12`, after 6 px padding). `A.2` (default row) fills that width exactly
> (110 × 56). `A.1`'s yellow highlight is **108 × 56** — a 1 px inset on each side
> from the row width, **locked** by spec FR-015. This is a deliberate decorative
> inset, not a Figma artefact. Implementation MUST render the highlight at 108 px
> (centred horizontally inside the 110 px row).

### Inner Item Content Frame (shared — `Frame 485` / `Content`)

| Property | Value | Notes |
|----------|-------|-------|
| `width` | `100%` of item | On `A.1`, the parent yellow-highlight box is 108 px wide so the inner frame inherits 108 px; on `A.2`, both row and inner frame are 110 px. |
| `height` | `56px` | |
| `padding` | `16px` | All sides |
| `display` | `flex` | |
| `flex-direction` | `row` | |
| `align-items` | `center` | |
| `justify-content` | `space-between` | Pushes flag-+-label to the left, leaves space on the right |
| `gap` | `2px` | Designer-set; visually invisible because of `space-between` |
| `border-radius` | `4px` | `--radius-item` |

### Flag + Label Group (`Frame 485` inner — left-aligned cluster)

| Property | Value | Notes |
|----------|-------|-------|
| `width` | `~52–53px` | Hug-content |
| `height` | `24px` | |
| `display` | `flex` | |
| `flex-direction` | `row` | |
| `align-items` | `center` | |
| `gap` | `4px` | Between flag and label |

### Flag Icon (`IC` instance)

| Property | Value | Notes |
|----------|-------|-------|
| `width` | `24px` | Component bounding box |
| `height` | `24px` | |
| Visible flag | `20 × 15px` | Centred inside the 24×24 box (transparent margins) |
| `Component ID` (VN row) | `178:1019` | `componentSetId` `178:1020` — `VN — Vietnam` |
| `Component ID` (EN row) | `178:967` | `componentSetId` `178:1020` — Figma source layer is named `GB-NIR — Northern Ireland` but renders the **UK Union Jack** glyph. Implementation matches the rendered design (Union Jack), per spec FR-012. |

### Locale Label (text)

| Property | Value | Notes |
|----------|-------|-------|
| `width` | Hug-content (`24–25px`) | `VN` is 25px; `EN` is 24px |
| `height` | `24px` | |
| `font-family` | `Montserrat` | |
| `font-size` | `16px` | |
| `font-weight` | `700` | |
| `line-height` | `24px` | |
| `letter-spacing` | `0.15px` | |
| `text-align` | `center` | (Per source — but visually each label is centred within its own bounding box, not within the row) |
| `color` | `#FFFFFF` | `--color-text-on-dark` |

---

## Layout Structure (ASCII)

```
                             (anchored under header language button)
                                        ▼
┌──────────────────────────────────────────┐  ← A_Dropdown-List (panel)
│ ┌──────────────────────────────────────┐ │     w: 122px, h: 124px
│ │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │ │     border: 1px #998C5F
│ │  ░  ▰▰  VN                          ░  │ │     bg: #00070C
│ │  ░  (flag)              [ A.1 ]     ░  │ │     radius: 8px
│ │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │ │     padding: 6px
│ │      ↑ selected (yellow @ 20%, r 2px) │ │     inner content area: 110 × 112 px
│ │                                       │ │
│ │      ▰▰  EN                           │ │     each row:
│ │      (flag)              [ A.2 ]      │ │       w: 110px (= 100% of inner)
│ │                                       │ │       h: 56px
│ │      ↑ default (transparent)          │ │       padding (inner): 16px
│ └──────────────────────────────────────┘ │       icon-label gap: 4px
└──────────────────────────────────────────┘     content frame radius: 4px
```

---

## Component Style Details

### `A` — Dropdown Panel (`A_Dropdown-List`)

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `525:11713` | — |
| **Component ID** | `362:6179` (`componentSet 563:8216`) | — |
| `width` | hug (≈ 122px) | `w-fit` (or fixed `w-[122px]`) |
| `padding` | 6px | `p-1.5` (Tailwind v4 with custom spacing) or `p-[6px]` |
| `background` | `#00070C` | `bg-[var(--color-details-container-2)]` |
| `border` | `1px solid #998C5F` | `border border-[var(--color-details-border)]` |
| `border-radius` | `8px` | `rounded-lg` |
| `display` | `flex` + `column` | `flex flex-col` |
| `align-items` | `flex-start` | `items-start` |
| `gap` | `0` | (default) |
| `position` | absolute, anchored to trigger | `absolute top-[calc(100%+4px)] right-0` (header anchor) |
| `z-index` | above page content | `z-50` |

**States:**

| State | Changes |
|-------|---------|
| Closed | `display: none` / unmounted (anchor button shows `VN ▾` only) |
| Open | Rendered as above; receives focus on first interactive item |
| Focus-trapped (when keyboard-opened) | `Tab` cycles between items; `Escape` closes; `outline: none` on panel itself, focus shown on items |

---

### `A.1` — Selected Item (Tiếng Việt)

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `I525:11713;362:6085` | — |
| **Component ID** | `186:1692` (`componentSet 186:1695`) | — |
| `width` | 110px (canonical) — source uses 108px (1px inset) | `w-full` (child of panel) |
| `height` | 56px | `h-14` |
| `background` | `rgba(255, 234, 158, 0.20)` | `bg-[var(--color-selected-bg)]` |
| `border-radius` | `2px` | `rounded-[2px]` (Tailwind v4 — explicit since `rounded-sm` is `4px` in v4) |
| `padding` | `16px` (on inner `Frame 485`) | `p-4` |
| `display` | flex row, `space-between` | `flex flex-row items-center justify-between` |
| `gap` | `2px` (legacy; effectively unused due to `space-between`) | — |
| `cursor` | `pointer` | `cursor-pointer` |

**Inner left cluster — flag + label:**

| Property | Value | CSS |
|----------|-------|-----|
| `display` | flex row | `flex flex-row items-center` |
| `gap` | `4px` | `gap-1` |

**Flag icon** (`IC` — VN):

| Property | Value |
|----------|-------|
| Component | `VN - Vietnam` (`componentId` `178:1019`) |
| Box size | `24 × 24` |
| Visible flag | `20 × 15` centred |
| Implementation | `<Icon name="flag-vn" size={24} />` (per Constitution §II — icons MUST be in `<Icon />` component, not raw `<img>`/SVG) |

**Label** (`VN`):

| Property | Value | CSS |
|----------|-------|-----|
| `font` | Montserrat 16/24 700 | `font-bold text-base leading-6` |
| `letter-spacing` | `0.15px` | `tracking-[0.15px]` |
| `color` | `#FFFFFF` | `text-white` |

**States** (approved 2026-04-27):

| State | Property | Value |
|-------|----------|-------|
| Default (selected, current locale) | `background` | `rgba(255, 234, 158, 0.20)` |
| Hover (when re-selecting current) | `background` | `rgba(255, 234, 158, 0.28)` |
| Focus (keyboard) | `outline` | `2px solid #FFEA9E`, `outline-offset: 1px` (WCAG 2.1 AA, Constitution §IV) |
| Active / Pressed | `background` | `rgba(255, 234, 158, 0.32)` |

---

### `A.2` — Default Item (Tiếng Anh)

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `I525:11713;362:6128` | — |
| **Component ID** | `186:1694` (`componentSet 186:1695`) | — |
| `width` | 110px (= panel inner width) | `w-full` |
| `height` | 56px | `h-14` |
| `background` | `transparent` | (none) |
| `border-radius` | `0` (outer) / `4px` (inner `Content` frame) | `rounded-[4px]` on inner |
| `padding` | `0` (outer) / `16px` (inner `Content`) | `p-4` on inner |
| `display` | flex row, `justify-content: center` (outer) / `space-between` (inner) | `flex flex-row items-center justify-between` |
| `cursor` | `pointer` | `cursor-pointer` |

**Inner left cluster — flag + label:**

| Property | Value | CSS |
|----------|-------|-----|
| `display` | flex row | `flex flex-row items-center` |
| `gap` | `4px` | `gap-1` |

**Flag icon** (`IC` — EN row):

| Property | Value |
|----------|-------|
| Source component | `GB-NIR — Northern Ireland` (`componentId` `178:967`, `componentSet 178:1020`) — **layer name is misleading; the rendered glyph in Figma is the UK Union Jack** |
| Implementation asset | UK Union Jack (matches the rendered design — spec FR-012) |
| Box size | `24 × 24` |
| Visible flag | `20 × 15` centred |
| Implementation | `<UkFlagIcon width={20} height={15} />` |

**Label** (`EN`):

| Property | Value | CSS |
|----------|-------|-----|
| `font` | Montserrat 16/24 700 | `font-bold text-base leading-6` |
| `letter-spacing` | `0.15px` | `tracking-[0.15px]` |
| `color` | `#FFFFFF` | `text-white` |

**States** (approved 2026-04-27):

| State | Property | Value |
|-------|----------|-------|
| Default | `background` | `transparent` |
| Hover | `background` | `rgba(255, 234, 158, 0.10)` (half-strength of the selected highlight — provides affordance without colliding with the "selected" cue) |
| Focus (keyboard) | `outline` | `2px solid #FFEA9E`, `outline-offset: 1px` (WCAG 2.1 AA) |
| Active / Pressed | `background` | `rgba(255, 234, 158, 0.18)` |
| When selected (i.e. user is currently on EN locale) | matches `A.1` style | `bg-[var(--color-selected-bg)]`, `rounded-[2px]`, 108 × 56 (1 px inset on each side per FR-015) |

> The `A.1` / `A.2` distinction in the source is **state**, not **identity**: whichever
> locale is the active app locale receives the `selected` styling. The `A.1` source
> happens to show VN selected because VN is the default. Implementation MUST swap
> states based on the live locale.

---

## Component Hierarchy with Styles

```
A_Dropdown-List           (panel: bg #00070C, border 1px #998C5F, radius 8px, p 6px,
│                           flex-col, items-start)
├── A.1 tiếng Việt        (selected → bg rgba(255,234,158,0.20), radius 2px, h 56px)
│   └── Frame 485         (h 56, p 16, flex-row, items-center, justify-between, radius 4px)
│       └── Cluster        (flex-row, items-center, gap 4px)
│           ├── IC (VN flag)  (24×24 box, visible 20×15)
│           └── Text "VN"     (Montserrat 16/24 700, color #fff, letter-spacing 0.15px)
│
└── A.2 tiếng Anh        (default → bg transparent, h 56px)
    └── Content           (h 56, p 16, flex-row, items-center, justify-between, radius 4px)
        └── Cluster        (flex-row, items-center, gap 4px)
            ├── IC (UK Union Jack)  (24×24 box, visible 20×15)  — matches Figma's rendered glyph (FR-012)
            └── Text "EN"     (Montserrat 16/24 700, color #fff, letter-spacing 0.15px)
```

---

## Anchoring & Open / Close Behaviour

The dropdown is an **overlay**, not a routed page (per `.momorph/SCREENFLOW.md` —
"In-page Overlays — Language Menu"). It MUST:

1. Anchor to its trigger button (the header `VN ▾` / language button on Homepage SAA,
   Awards Information, and any other authenticated page).
2. Open downward and right-aligned with the trigger (matches Figma source positioning).
3. Close on:
   - Selecting either item.
   - Clicking outside the panel.
   - Pressing `Escape`.
   - Trigger button being clicked again (toggle).
4. Have `position: absolute` (or `fixed` if the trigger lives in a sticky header) with
   sufficient `z-index` to overlay page content.
5. Animate open/close — see Animation table below.

Recommended placement (relative to trigger):

```
top:  calc(100% + 4px)       /* 4px gap below the trigger button */
right: 0                     /* aligns the right edge of the panel with the right edge of the trigger */
```

---

## Responsive Specifications

The dropdown is a fixed-size component — its dimensions do **not** scale with
viewport size. The trigger button's position in the header is what changes across
breakpoints. The dropdown remains an anchored 122 × 124 px floating panel on every
breakpoint (locked by spec — Q8 resolved 2026-04-27).

### Breakpoints (per Constitution §IV)

| Name | Min Width | Behaviour |
|------|-----------|-----------|
| Mobile | 360px | Anchored 122 × 124 panel, positioned relative to the mobile-layout trigger button. |
| Tablet | 768px | Identical to desktop. |
| Desktop | 1280px | Source design — anchored 122 × 124 panel. |

---

## Icon Specifications

| Icon Name | Size | Source Component | Notes |
|-----------|------|------------------|-------|
| `flag-vn` | `24 × 24` (visible flag `20 × 15`, centred) | `componentId 178:1019` (`VN — Vietnam`) | Use as designed |
| `flag-uk` | `24 × 24` (visible flag `20 × 15`, centred) | `componentId 178:967` (Figma source layer is named `GB-NIR — Northern Ireland`; rendered glyph is the UK Union Jack) | Implementation matches the **rendered glyph** (Union Jack) per spec FR-012, not the source layer name |

Each flag is implemented as its own component file (matching the existing
project pattern of `vn-flag-icon.tsx`, etc.) under [components/icons/](../../../components/icons/).

---

## Animation & Transitions

Approved 2026-04-27. Aligned with Material Design 3 per Constitution §IV.

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Panel | `opacity`, `transform: translateY(-4px → 0)` | `150ms` | `ease-out` (open) / `ease-in` (close) | Open / close |
| Item | `background-color` | `120ms` | `ease-in-out` | Hover / focus |
| Item | `outline` | `0ms` (immediate) | — | Keyboard focus |

`prefers-reduced-motion: reduce` MUST disable the translate; the opacity transition
collapses to `60ms` for state clarity (spec FR-013).

---

## Accessibility

- Trigger button MUST expose `aria-haspopup="menu"`, `aria-expanded` (true/false), and
  `aria-controls` referencing the panel id.
- Panel root MUST be `role="menu"` (or `role="listbox"` if implemented as a select).
- Each item MUST be `role="menuitem"` (or `role="option"`), with `aria-checked` /
  `aria-current="true"` on the active locale.
- Items MUST be reachable via `Tab` (or roving `↑`/`↓` arrow keys for menu pattern).
- Focus visible state MUST satisfy WCAG 2.1 AA — outline at minimum 2px, contrast ≥ 3:1
  against the panel background (`#00070C` → use `#FFEA9E` outline).
- Color-only signalling is NOT acceptable for the selected state — the implementation
  MUST also expose `aria-current` / `aria-checked` so screen readers announce it.
- Trigger label and item labels SHOULD include the locale name in addition to the code
  (e.g., `aria-label="Tiếng Việt (Vietnamese)"` even though the visible label is `VN`).

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS | React Component |
|----------------|---------------|----------------|-----------------|
| Dropdown panel | `525:11713` (component `362:6179`) | `flex flex-col p-1.5 rounded-lg border border-[var(--color-details-border)] bg-[var(--color-details-container-2)] absolute z-50` | `<LanguageMenu />` |
| Selected item (VN) | `I525:11713;362:6085` (component `186:1692`) | `w-full h-14 p-4 flex items-center justify-between rounded-[2px] bg-[var(--color-selected-bg)] cursor-pointer` | `<LanguageMenuItem locale="vi" selected />` |
| Default item (EN) | `I525:11713;362:6128` (component `186:1694`) | `w-full h-14 p-4 flex items-center justify-between rounded-[4px] cursor-pointer hover:bg-[rgba(255,234,158,0.10)]` | `<LanguageMenuItem locale="en" />` |
| Flag (VN) | `I525:11713;362:6085;…;178:1010` (component `178:1019`) | `w-6 h-6` | `<Icon name="flag-vn" size={24} />` |
| Flag (EN row — UK Union Jack) | `I525:11713;362:6128;…;178:946` (component `178:967` — source layer name `GB-NIR`, but renders Union Jack) | `w-[20px] h-[15px]` | `<UkFlagIcon width={20} height={15} />` |
| Locale label | `I…;186:1439` | `font-bold text-base leading-6 tracking-[0.15px] text-white` | `<span>{code}</span>` |

---

## Notes

- All colours MUST live as CSS variables (Constitution §II "Design Tokens"). The two
  Figma-named variables — `Details-Container-2` and `Details-Border` — already follow
  this convention; mirror those names verbatim into the project's global stylesheet.
- The 215 × 304 gray staging area is a **Figma canvas**, not an implementation surface.
  Discard it.
- The "selected" styling (yellow @ 20% bg + 2 px radius, 108 × 56 inset 1 px per side
  inside the 110 × 56 row) MUST follow the **active locale**, not be hard-coded to VN.
  Switch the highlight whenever the locale changes.
- The EN row's flag is the **UK Union Jack** (matches the rendered glyph in the
  Figma design — see spec FR-012). Note: the Figma source layer is named
  `GB-NIR — Northern Ireland` but renders the Union Jack; implementation matches
  the rendered design, not the misleading layer name.
- Hover / focus / active / pressed values, plus open / close motion timings, were
  predicted during `momorph.specify` and **approved by the user on 2026-04-27**
  (see [`./spec.md`](./spec.md) → "Resolved Clarifications" Q3 + Q4). Locked.
- All interactive elements MUST be keyboard-navigable and meet WCAG 2.1 AA contrast —
  text on `#00070C` (`#FFFFFF`) → 21:1 (✅), focus outline on `#00070C` (`#FFEA9E`) →
  ≈ 16:1 (✅).
