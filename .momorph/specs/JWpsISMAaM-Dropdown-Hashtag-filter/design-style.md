# Design Style: Dropdown Hashtag filter

**Frame**: `JWpsISMAaM` → root node `721:5580` → `A_Dropdown-List` `563:8026`.

All values below were extracted via `mcp__momorph.list_frame_styles` for the Figma frame.

## Container — `A_Dropdown-List` (`563:8026`)

| Property        | Value                                  | Token (existing project var)            |
| --------------- | -------------------------------------- | --------------------------------------- |
| `width`         | min ~135 px, hugs trigger width        | —                                       |
| `padding`       | 6 px (all sides)                       | —                                       |
| `display`       | `flex` column                          | —                                       |
| `align-items`   | `flex-start`                           | —                                       |
| `background`    | `#00070C`                              | `var(--color-kudos-bg-panel)`           |
| `border`        | `1px solid #998C5F`                    | `var(--border-kudos-panel)`             |
| `border-radius` | `8px`                                  | `var(--radius-sm)`                      |
| `position`      | `absolute` below trigger, `right: 0`   | —                                       |
| `z-index`       | popover layer                          | `var(--z-kudos-tooltip)` (≥ feed cards) |

## Item — `A.x_Tag x` (`186:1426` component set)

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
| label content    | `#<hashtag.name>` (literal `#` prefix per row)     |

### Active item state (`A.1_Tag1` instance)

| Property                              | Value                                                            | Token                                |
| ------------------------------------- | ---------------------------------------------------------------- | ------------------------------------ |
| `background`                          | `rgba(255, 234, 158, 0.10)`                                      | `var(--color-kudos-pill-idle)`       |
| label `text-shadow`                   | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287`                    | `var(--text-shadow-active)`          |

### Hover state (inactive items)

The Figma frame doesn't show a hover state explicitly, so re-use the same pattern as the existing `KudosDeptDropdown`: on hover, set background to `rgba(255, 234, 158, 0.10)` (`var(--color-kudos-pill-idle)`) without the active text-shadow. On focus-visible, add a 2 px outline at `var(--color-cta-bg)`.

## Trigger pill (lives on the parent screen)

The trigger is the same pill we already render in `KudosFilters.tsx` for the department dropdown — same `wrapClass` / `wrapStyle` / chevron icon. Selected hashtag (rendered as `#<name>`, or "Tất cả hashtag" when null) sits on the left, chevron on the right.

## Layout map

```
[ trigger pill: "#Dedicated ▾" ]                                       ← right-aligned in
                                                                        Highlight section header
└── absolute popover (right-aligned to trigger)
    ┌────────────────────────────────────────┐
    │  #Dedicated ◀ active (gold bg + glow)  │  ← row 56 px, padding 16
    │  #Inspring                             │
    │  #Dedicated                            │
    │  #Dedicated                            │
    │  #Inspring                             │
    │  #Inspring                             │
    └────────────────────────────────────────┘
```

## Implementation mapping

| Figma node          | DOM / Tailwind                                                                     | React component                  |
| ------------------- | ---------------------------------------------------------------------------------- | -------------------------------- |
| `563:8026` panel    | `<ul role="listbox">` with `bg-[#00070C] border-[#998C5F] rounded-[8px] p-[6px]`   | popover panel (private)          |
| `186:1426` set item | `<li role="option">` with `h-14 px-4 rounded-[4px] text-white text-[16px]/24`     | dropdown item (private)          |
| Active item         | adds `bg-[var(--color-kudos-pill-idle)]` + `text-shadow: var(--text-shadow-active)` | conditional class                |
