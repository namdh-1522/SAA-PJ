# Design Style: Dropdown Phòng ban

**Frame**: `WXK5AYB_rG` → root node `721:5684` → `A_Dropdown-List` `563:8027`.

All values below were extracted via `mcp__momorph.list_frame_styles` for the Figma frame.

## Container — `A_Dropdown-List` (`563:8027`)

| Property        | Value                                  | Token (existing project var)            |
| --------------- | -------------------------------------- | --------------------------------------- |
| `width`         | min 103 px, hugs trigger width         | —                                       |
| `padding`       | 6 px (all sides)                       | —                                       |
| `display`       | `flex` column                          | —                                       |
| `align-items`   | `flex-start`                           | —                                       |
| `background`    | `#00070C`                              | `var(--color-kudos-bg-panel)`           |
| `border`        | `1px solid #998C5F`                    | `var(--border-kudos-panel)`             |
| `border-radius` | `8px`                                  | `var(--radius-sm)`                      |
| `position`      | `absolute` below trigger, `right: 0`   | —                                       |
| `z-index`       | popover layer                          | `var(--z-kudos-tooltip)` (≥ feed cards) |

## Item — `A.x_Phòng ban x` (`186:1426` component set)

| Property        | Value                          | Token                                 |
| --------------- | ------------------------------ | ------------------------------------- |
| `width`         | `100%` of panel                | —                                     |
| `height`        | `56 px`                        | —                                     |
| `padding`       | `16 px`                        | `var(--spacing-lg)` (16px)            |
| `gap`           | `4 px` (icon ↔ label)          | —                                     |
| `display`       | `flex` row, items-center       | —                                     |
| `border-radius` | `4 px`                         | `var(--radius-xs)`                    |
| `text-align`    | `left` (justify-start)         | —                                     |

### Label typography

| Property         | Value                                              |
| ---------------- | -------------------------------------------------- |
| `font-family`    | Montserrat                                         |
| `font-size`      | `16 px`                                            |
| `font-weight`    | 700                                                |
| `line-height`    | `24 px` (150 %)                                    |
| `letter-spacing` | `0.5 px`                                           |
| `color`          | `#FFFFFF` (`var(--color-text-primary)`)            |

### Active item state (`A.1_Phòng ban 1` instance)

| Property                              | Value                                                            | Token                                |
| ------------------------------------- | ---------------------------------------------------------------- | ------------------------------------ |
| `background`                          | `rgba(255, 234, 158, 0.10)`                                      | `var(--color-kudos-pill-idle)`       |
| label `text-shadow`                   | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287`                    | `var(--text-shadow-active)`          |

### Hover state (inactive items)

The Figma frame doesn't show a hover state explicitly, so re-use the same pattern as the existing `KudosFilters` hashtag pill: on hover, set background to `rgba(255, 234, 158, 0.10)` (`var(--color-kudos-pill-idle)`) without the active text-shadow. On focus-visible, add a 2 px outline at `var(--color-cta-bg)`.

## Trigger pill (lives on the parent screen)

The trigger is the same pill we already render in `KudosFilters.tsx` for the hashtag dropdown — same `wrapClass` / `wrapStyle` / chevron icon. Selected dept name (or "Tất cả phòng ban" when null) sits on the left, chevron on the right.

## Layout map

```
[ trigger pill: "CECV2 ▾" ]                                           ← right-aligned in
                                                                       Highlight section header
└── absolute popover (right-aligned to trigger)
    ┌────────────────────────────────────────┐
    │  CEVC2  ◀ active (gold-soft bg + glow) │  ← row 56 px, padding 16
    │  CEVC3                                 │
    │  CEVC4                                 │
    │  CEVC1                                 │
    │  OPD                                   │
    │  Infra                                 │
    └────────────────────────────────────────┘
```

## Implementation mapping

| Figma node          | DOM / Tailwind                                                                     | React component                  |
| ------------------- | ---------------------------------------------------------------------------------- | -------------------------------- |
| `563:8027` panel    | `<ul role="listbox">` with `bg-[#00070C] border-[#998C5F] rounded-[8px] p-[6px]`   | `<KudosDropdownPanel>` (private) |
| `186:1426` set item | `<li role="option">` with `h-14 px-4 rounded-[4px] text-white text-[16px]/24`     | `<KudosDropdownItem>` (private)  |
| Active item         | adds `bg-[var(--color-kudos-pill-idle)]` + `text-shadow: var(--text-shadow-active)` | conditional class                |
