# Design Style: Sun* Kudos – Live board

**Frame ID**: `MaZUn5xHXZ` (node `2940:13431`)
**Frame Name**: `Sun* Kudos - Live board`
**Figma Link**: https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C/?node-id=2940-13431
**Frame Image**: [assets/frame.png](./assets/frame.png) *(export locally — see [assets/README.md](./assets/README.md))*
**Extracted At**: 2026-04-29 *(spec structure re-synced to Figma file `9ypp4enmFmdK3YAFJLIu6C`; for authoritative deltas use MoMorph Figma tools or REST export — see below)*

---

## Source of truth & design refresh

- **Canonical file**: Figma Design `9ypp4enmFmdK3YAFJLIu6C`, frame node **`2940:13431`** / screen id `MaZUn5xHXZ`.
- **Rerun a full pixel/token dump**: In Cursor, use **`momorph.specs`** (Figma MCP: `get_frame`, `list_frame_styles`, `list_design_items`, etc.) against the node above, then paste results into this file and `spec.md`.
- **REST fallback**: `GET https://api.figma.com/v1/files/9ypp4enmFmdK3YAFJLIu6C/nodes?ids=2940-13431` with header `X-Figma-Token: <personal access token>`.
- **Frame screenshot**: Export PNG from Figma or MoMorph image pipeline into `assets/frame.png` and reference it here.

> Source data (original extraction): `list_frame_styles` (691 nodes) and `list_design_items` for the Live board frame. Design tokens use the existing Figma variable naming `--Details-*` so theming (other than Awards 2025 dark theme) can be added later without re-mapping.

---

## Design Tokens

### Colors

The palette is intentionally narrow: dark navy backgrounds, **gold (`#FFEA9E`)** as the primary brand accent, **cream (`#FFF8E1`)** for KUDO cards, and red `#D4271D` for hashtag emphasis + notification dot. No green/blue success/warning tokens are used by this screen.

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| `--color-bg-app` (`--Details-Background`) | `#00101A` | 100% | Page background; dark text on cream cards |
| `--color-bg-panel` (`--Details-Container-2`) | `#00070C` | 100% | Right-panel surfaces (`D.1`, `D.3`) |
| `--color-bg-header` | `#101417` | 80% | Sticky `Header` translucent fill |
| `--color-cover-overlay` | `rgba(0,0,0,0.70)` | 70% | Banner cover scrim |
| `--color-banner-grad-stop` | `rgba(9,36,50,0.50)` | 50% | Hero banner gradient stop |
| `--color-brand-gold` (`--Details-Text-Primary-1`) | `#FFEA9E` | 100% | Headings, gold borders, CTA fills (`D.1.8 mở quà`), highlight card 4px border |
| `--color-brand-gold-hover` (`--Details-ButtonSecondary-Hover`) | `#FFEA9E` | 40% | Secondary button hover fill |
| `--color-brand-gold-soft` (`--Details-SecondaryButton-Normal`) | `#FFEA9E` | 10% | Secondary button idle fill (Ghi nhận, Tìm kiếm sunner, hashtag/phòng-ban dropdowns) |
| `--color-brand-cream` (`--Details-PrimaryButton-Hover`) | `#FFF8E1` | 100% | KUDO card body (B.3, C.3/5/6/7) |
| `--color-shelf-cream` | `#FFF3C6` | 100% | Award shelf wash |
| `--color-border-gold` (`--Details-Border`) | `#998C5F` | 100% | Default 1px border on panels & buttons |
| `--color-divider-gold` | `#FFEA9E` | 100% | 1px gold divider lines (overlapping with text-primary token) |
| `--color-divider-dark` | `#2E3940` | 100% | Dark divider on right-panel cards (`D.1.5`) |
| `--color-text-primary` | `#FFFFFF` | 100% | Default body text on dark surfaces (sender/receiver names) |
| `--color-text-on-cream` | `#00101A` | 100% | Body text on cream KUDO cards |
| `--color-text-muted` | `#999999` | 100% | Departments (`CECV2`), timestamps, dot dividers |
| `--color-text-warm-light` | `#DBD1C1` | 100% | Hero "KUDOS" wordmark |
| `--color-accent-red` | `#D4271D` | 100% | Hashtag text in highlight card; notification badge dot |
| `--color-accent-red-hot` | `#F17676` | 100% | "Hot" sender highlight (top leaderboard row) |
| `--color-text-footer` | `#FFFFFF` | 60% | Footer copyright text (`rgba(255,255,255,0.60)`) |

### Typography

Family is **Montserrat 700** for almost all UI text. Hero wordmark is **SVN-Gotham**; footer uses **Montserrat Alternates**.

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing | Sample |
|------------|-------------|------|--------|-------------|----------------|--------|
| `--text-display` | SVN-Gotham | 139.78px | 400 | 34.95px ¹ | -13% | Hero "KUDOS" |
| `--text-h1` | Montserrat | 57px | 700 | 64px | -0.25px | "HIGHLIGHT KUDOS", "ALL KUDOS" |
| `--text-h2` | Montserrat | 36px | 700 | 44px | 0 | "Hệ thống ghi nhận và cảm ơn", "388 KUDOS" |
| `--text-stat-lg` | Montserrat | 32px | 700 | 40px | 0 | Top stat numbers |
| `--text-h3` | Montserrat | 28px | 700 | 36px | 0 | Carousel page label |
| `--text-stat-md` | Montserrat | 24px | 700 | 32px | 0 | "Sun* Annual Awards 2025", `1.000` heart count |
| `--text-body-emphasis` | Montserrat | 22px | 700 | 28px | 0 | "Số Kudos bạn nhận được:" |
| `--text-body` | Montserrat | 20px | 700 | 32px | 0 | Kudo post content |
| `--text-meta` | Montserrat | 16px | 700 | 24px | 0.5px | Hashtag chip text, timestamp `10:00 - 10/30/2025` |
| `--text-nav-link` | Montserrat | 16px | 700 | 24px | 0.15px | Header nav links |
| `--text-caption` | Montserrat | 14px | 700 | 20px | 0.10px | Department label `CECV2`, B.7.4 activity line |
| `--text-footer` | Montserrat Alternates | 16px | 700 | 24px | 0% | "Bản quyền thuộc về Sun* © 2025" |
| `--text-badge-lg` | Montserrat | 12.82px | 700 | 17px | 0.092px | "Legend Hero" badge |
| `--text-badge-md` | Montserrat | 11.64px | 700 | 16.63px | 0.083px | "Super Hero" |
| `--text-badge-sm` | Montserrat | 11.40px | 700 | 16.29px | 0.081px | "New Hero" |
| `--text-multiplier` | Montserrat | 17.54px | 700 | 23.39px | 0 | Carousel "x2" pill |

> ¹ `34.95px` is the Figma absolute `lineHeightPx` value for the 139.78px display type — it is unusually low (≈ 25% of font size) and is likely a Figma quirk in how SVN-Gotham's internal metrics are exported. In CSS, start with `line-height: normal` (or `1`) and verify visually; do **not** set `34.95px` verbatim.

### Spacing

Canonical scale derived from token frequency in the frame:

| Token Name | Value | Usage |
|------------|-------|-------|
| `--spacing-2xs` | 2px | Tight icon gaps |
| `--spacing-xs` | 4px | Chip → label, icon → text |
| `--spacing-sm` | 8px | Button label ↔ icon |
| `--spacing-base` | 10px | Panel inner stack (`D.1`, `D.3`) |
| `--spacing-md` | 12px | Header vertical pad |
| `--spacing-lg` | 16px | **Default** card gap & padding (KUDO post inner) |
| `--spacing-xl` | 24px | Section gap, KUDO post header pad |
| `--spacing-2xl` | 32px | Larger section gap |
| `--spacing-3xl` | 40px | KUDO post outer padding |
| `--spacing-4xl` | 64px | Header inner block gap |
| `--spacing-hero` | 80px | Hero block padding |
| `--spacing-page-x` | 144px | Header / page horizontal gutter |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| `--radius-xs` | 4px | Carousel arrow buttons (B.2.1, B.2.2) |
| `--radius-sm` | 8px | `D.1.8 Button mở quà` (gold filled CTA) |
| `--radius-md` | 12px | Small chips |
| `--radius-lg` | 16px | Medium cards |
| `--radius-card` | 24px | **KUDO post card** (C.3, C.5, C.6, C.7) |
| `--radius-pill-md` | 48px | Hashtag chip / outline pill |
| `--radius-pill-lg` | 64px | "Ghi nhận" / "Tìm kiếm sunner" capsule CTAs |
| `--radius-full` | 100px | Avatars, dots |
| `--border-thin` | 1px solid `#998C5F` | Default panel & button border |
| `--border-thin-gold` | 1px solid `#FFEA9E` | Inner gold accent line |
| `--border-strong-gold` | 4px solid `#FFEA9E` | Highlight card outer border (`B.3_KUDO - Highlight`) |
| `--border-avatar` | 1.869px solid `#FFFFFF` | All `MM_MEDIA_Avatar` rings |

### Shadows / Effects

The design uses **flat fills + 1px gold borders** for elevation — there are no `BOX_SHADOW` or `BACKGROUND_BLUR` effects on cards. Only badge text glows and overlay opacities exist.

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-text-glow` | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` | Glowing nav title text |
| `--shadow-text-halo` | `0 0 1.3px #FFFFFF` | "Legend Hero" badge labels |
| `--shadow-text-drop-sm` | `0 0.386px 1.543px #000000` | "Rising Hero" badge labels |
| `--gradient-cover-vertical` | `linear-gradient(0deg, rgba(9,36,50,0.50), rgba(0,0,0,0))` | Banner image overlay |
| `--gradient-cover-diag` | `linear-gradient(25deg, #00101A 14.74%, rgba(0,19,32,0))` | Hero diagonal fade |
| `--gradient-mask-left` | `linear-gradient(90deg, var(--color-bg-app), transparent)` | Carousel left fade mask |
| `--gradient-mask-right` | `linear-gradient(270deg, var(--color-bg-app), transparent)` | Carousel right fade mask |

> If a backdrop-blur is desired on the sticky header, add it explicitly (e.g. `backdrop-filter: blur(12px)`) — the Figma export only carries the translucent fill, not a blur effect.

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| max-width | 1440px | Desktop frame width |
| page-padding-x | 144px | Header / sections gutter |
| page-padding-y (hero) | 80px | Hero vertical padding |
| section-gap | 32–40px | Vertical gap between B / C / D blocks |

### Grid / Flex Layout

| Property | Value | Notes |
|----------|-------|-------|
| Hero | flex column, gap 24px, padding 80px 144px | KUDOS title + subtitle + CTA row |
| Highlight (B) | flex column, gap 24px | Header → carousel → slide bar → **then** B.6 caption + B.7 board (same vertical stack in implementation) |
| Main content row | grid 2fr / 1fr (≥1024px) | Left = `C_All kudos`, Right = `D_Thống menu phải` |
| KUDO post (C.3) | flex column, gap 16px, padding 40px 40px 16px | Cream card |
| Right panel | flex column, gap 24px | Stats card → leaderboard list |

### Layout Structure (ASCII)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ HEADER (h: 80px, bg: rgba(16,20,23,0.80), pad: 12px 144px, gap-x: 238)       │
│  [LOGO]  [Nav×3 gap 64]                  [Lang VN][Bell•][Profile]   gap 16  │
├──────────────────────────────────────────────────────────────────────────────┤
│ HERO / Bìa  (cover image + diagonal gradient)                                │
│  pad 80 144   gap 24                                                         │
│   "KUDOS" (display 139.78)                                                   │
│   "Hệ thống ghi nhận và cảm ơn" (h2 36/44)                                   │
│   ┌──────── A.1 Ghi nhận pill (h:72, radius:64)──────────────────┐           │
│   │ [pen] Hôm nay, bạn muốn gửi lời cảm ơn …                     │           │
│   └──────────────────────────────────────────────────────────────┘           │
│   ┌── Tìm kiếm sunner pill (w:381 h:72, radius:64) ──┐                       │
│   │ [search] Tìm kiếm                                │                       │
│   └──────────────────────────────────────────────────┘                       │
├──────────────────────────────────────────────────────────────────────────────┤
│ B_Highlight  (gap 24)                                                        │
│   B.1 header  (subtitle "Sun* Annual Awards 2025" + h1 "HIGHLIGHT KUDOS")    │
│                       [#Hashtag ▾]   [Phòng ban ▾]                           │
│                                                                              │
│   B.2  ┌◀ B.2.1 ┐  B.3 KUDO – Highlight (cream, border 4px gold)  ┌ B.2.2 ▶┐ │
│        │  80×80 │   ┌─────────────────────────────────────────┐   │ 80×80 │ │
│        │ radius │   │ Avatar →  Avatar      hh:mm – DD/MM/YYYY│   │       │ │
│        │  4px   │   │ Sender    Receiver    Content (≤3 lines)│   │       │ │
│        └────────┘   │ Hashtags  ♥ 10  Copy link  Xem chi tiết │   └───────┘ │
│                     └─────────────────────────────────────────┘              │
│   B.5 slide   ◀  2/5  ▶                                                      │
│   B.6 "Sun* Annual Awards 2025 / SPOTLIGHT BOARD"                            │
│   B.7 ┌──────────────────────────────────────────────────────────┐           │
│       │  B.7.3 [🔍 Tìm kiếm] (top-left)     B.7.1 "388 KUDOS" (center top)   │
│       │        … name cloud + mesh / ribbons …                     │           │
│       │  B.7.4 activity rail (bottom-left)   B.7.5 expand (bottom-right)     │
│       └──────────────────────────────────────────────────────────┘           │
├────────────────────────────────────────────────┬─────────────────────────────┤
│  C_All kudos          (max-w ≈ 760)            │  D_Thống menu phải (max-w  │
│   C.1 "Sun* Annual Awards 2025 / ALL KUDOS"    │      ≈ 422, gap 24)         │
│   C.2 Card list (gap 24)                       │  ┌── D.1 Stats card ──────┐ │
│    ┌── C.3_KUDO Post (cream, radius 24, pad 40)┤  │ pad 24, bg #00070C,    │ │
│    │ Sender → Receiver       hh:mm – DD/MM/YYYY│  │ border 1px #998C5F     │ │
│    │ Content (≤5 lines)                        │  │ • Số Kudos nhận: 25     │ │
│    │ [img][img][img]   (≤5 thumbs)             │  │ • Số Kudos đã gửi: 25   │ │
│    │ #IDOL GIỚI TRẺ                            │  │ ───── divider ─────     │ │
│    │ ♥ 10        Copy link                     │  │ • Số tim: 1.000         │ │
│    └───────────────────────────────────────────┤  │ • Secret box mở: 25     │ │
│    C.5 / C.6 / C.7  (same component, repeats)  │  │ • Secret box chưa: 25   │ │
│       … infinity scroll …                      │  │ [ Mở quà ] (gold 8px)   │ │
│                                                │  └────────────────────────┘ │
│                                                │  ┌── D.3 Leaderboard ─────┐ │
│                                                │  │ "10 SUNNER NHẬN QUÀ…"  │ │
│                                                │  │ ▢ Avatar  Name          │ │
│                                                │  │ ▢ Avatar  Name          │ │
│                                                │  │  …                      │ │
│                                                │  └────────────────────────┘ │
│                                                │  D.4 hashtag chip (in-card) │
├────────────────────────────────────────────────┴─────────────────────────────┤
│ FOOTER  "Bản quyền thuộc về Sun* © 2025"  (Montserrat Alternates 16/24)      │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Header (mms_A_Header)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `2940:13433` | – |
| width | 1440 | – |
| height | 80 | `height: 80px` |
| padding | 12px 144px | `padding: var(--spacing-md) var(--spacing-page-x)` |
| background | `rgba(16,20,23,0.80)` | `background: var(--color-bg-header)` |
| border | none | – |
| layout | flex row, gap 238 between left/right cluster | `display:flex; justify-content:space-between` |
| inner-gap (nav links) | 64px | `gap: var(--spacing-4xl)` |
| inner-gap (right cluster) | 16px | `gap: var(--spacing-lg)` |
| nav link text | `--text-nav-link` (Montserrat 16/24, 0.15px) | – |
| notification dot | 8×8 circle | `background: var(--color-accent-red)` |

### Hero CTA — A.1 Button ghi nhận (primary outline pill)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `2940:13449` | – |
| width | 738 | – |
| height | 72 | `height: 72px` |
| padding | 24 / 16 | `padding: 16px 24px` |
| gap | 8 (icon → text) | `gap: var(--spacing-sm)` |
| background | `rgba(255,234,158,0.10)` | `background: var(--color-brand-gold-soft)` |
| border | 1px solid `#998C5F` | `border: 1px solid var(--color-border-gold)` |
| border-radius | 64px | `border-radius: var(--radius-pill-lg)` |
| text | Montserrat 700 / 16 / 24 | `font: 700 16px/24px Montserrat` |
| color | `#FFFFFF` | `color: var(--color-text-primary)` |
| icon | `MM_MEDIA_Pen` (left) | – |

**States:**

| State | Property | Value |
|-------|----------|-------|
| Hover | background | `rgba(255,234,158,0.40)` (`--color-brand-gold-hover`) |
| Active | background | `rgba(255,234,158,0.40)` + slight scale-down |
| Focus | outline | `2px solid var(--color-brand-gold)`, offset 2px |
| Disabled | opacity 0.40, cursor not-allowed |

### Hero CTA — Tìm kiếm sunner (pill)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `2940:13450` | – |
| width | 381 | – |
| height | 72 | – |
| padding | 24 / 16 | – |
| background | `rgba(255,234,158,0.10)` | – |
| border | 1px solid `#998C5F` | – |
| border-radius | 64px | – |
| icon | `MM_MEDIA_Search` (left) | – |
| text | Montserrat 700 / 16 / 24 | – |

States: same as A.1.

### Filter Buttons — B.1.1 Hashtag / B.1.2 Phòng ban

| Property | Value |
|----------|-------|
| **Node IDs** | `2940:13459` / `2940:13460` |
| height | 72 (matches hero CTA) |
| padding | 16 |
| gap | 8 |
| background | `rgba(255,234,158,0.10)` |
| border | 1px solid `#998C5F` |
| border-radius | 48px (`--radius-pill-md`) |
| icon | dropdown chevron (right) |

**States:** Hover → `rgba(255,234,158,0.40)`. **Active (filter applied)** → keep `--color-brand-gold-hover` background until cleared.

### Carousel arrow — B.2.1 Lùi / B.2.2 Tiến

| Property | Value |
|----------|-------|
| **Node IDs** | `2940:13470` / `2940:13468` |
| size | 80 × 80 |
| padding | 10 |
| background | `rgba(0,0,0,0)` (transparent) |
| border | none |
| border-radius | 4px |

**States:** Hover → bg `rgba(255,234,158,0.10)`. Disabled → opacity 0.40, cursor not-allowed (used at first/last slide).

### Highlight card — B.3 KUDO – Highlight

| Property | Value |
|----------|-------|
| **Node ID** | `2940:13465` |
| width | 528 (auto height) |
| padding | 24 / 24 / 16 / 24 |
| gap (vertical) | 16 |
| background | `#FFF8E1` (`--color-brand-cream`) |
| border | **4px solid `#FFEA9E`** (`--border-strong-gold`) |
| border-radius | 16px (`--radius-lg`) |
| typography (content) | `--text-body` (Montserrat 20/32) |
| typography (hashtags) | Montserrat 700 / 16 / 24 / 0.5 — color `#D4271D` |
| timestamp | Montserrat 700 / 16 / 24 — color `#999999` |

### KUDO Post card — C.3 / C.5 / C.6 / C.7

| Property | Value |
|----------|-------|
| **Node IDs** | `3127:21871`, `3127:22053`, `3127:22375`, `3127:22439` |
| width | 680 |
| height | 749 (auto when content shorter) |
| padding | 40 / 40 / 16 / 40 |
| gap (vertical) | 16 |
| background | `#FFF8E1` |
| border | none |
| border-radius | 24px (`--radius-card`) |
| content typography | Montserrat 700 / 20 / 32 — color `#00101A` |
| timestamp | Montserrat 700 / 16 / 24 — color `#999999` |
| sender / receiver name | Montserrat 700 / 22 / 28 — color `#00101A` |
| department | Montserrat 700 / 14 / 20 — color `#999999` |

### Stat panel — D.1 Thống kê tổng quát

| Property | Value |
|----------|-------|
| **Node ID** | `2940:13489` |
| padding | 24 |
| gap | 10 |
| background | `#00070C` (`--color-bg-panel`) |
| border | 1px solid `#998C5F` |
| border-radius | 16 |
| label typography | Montserrat 700 / 22 / 28 — color `#FFFFFF` |
| value typography | Montserrat 700 / 32 / 40 — color `#FFEA9E` (counters) |
| divider (`D.1.5`) | 1px `#2E3940` rectangle |

### Mở quà CTA — D.1.8 (gold filled)

| Property | Value |
|----------|-------|
| **Node ID** | `2940:13497` |
| width | 374 |
| height | 60 |
| padding | 16 |
| gap | 8 |
| background | `#FFEA9E` (solid gold) |
| border | none |
| border-radius | 8px (`--radius-sm`) |
| text | Montserrat 700 / 16 / 24 — color `#00101A` |

**States:** Hover → background `rgba(255,234,158,0.80)`. Disabled → opacity 0.40 + cursor not-allowed (used when no unopened secret box).

### Leaderboard panel — D.3 10 SUNNER NHẬN QUÀ

| Property | Value |
|----------|-------|
| **Node ID** | `2940:13510` |
| padding | 24 / 16 / 24 / 24 |
| gap | 10 |
| background | `#00070C` |
| border | 1px solid `#998C5F` |
| border-radius | 16 |
| row item (D.3.2) | flex row gap 12, avatar 64×64 + name + gift desc |

### Hearts action — C.4.1 / B.4.4

| Property | Value |
|----------|-------|
| **Node ID** | `I3127:21871;256:5175` |
| width | 101 |
| height | 32 |
| layout | row, gap 4 |
| icon size | 32 × 32 |
| count typography | Montserrat 700 / 24 / 32 — color `#00101A` (on cream) |

**States:**

| State | Heart fill | Heart stroke |
|-------|-----------|---------------|
| Inactive | none / outline | `#999999` |
| Active (liked) | `#D4271D` | none |
| Hover | scale 1.05, ease-out 150ms | – |
| Disabled (sender) | opacity 0.40 + cursor not-allowed | – |

### "Xem chi tiết" link — B.4.4 (Highlight card only)

> This action appears alongside Hearts and Copy link **only** in the Highlight card (`B.4.4_Action`); it is absent from the All Kudos card (`C.4`).

| Property | Value |
|----------|-------|
| type | inline text link / button |
| typography | Montserrat 700 / 14 / 20 (`--text-caption`) |
| color (default) | `#FFEA9E` (`--color-brand-gold`) |
| color (hover) | `#FFFFFF` |
| decoration | underline on hover |
| cursor | pointer |
| min hit target | 48 × 48px (wrap in a padded button if needed) |

### Hashtag chip — B.4.3 / C.3.7 / D.4

| Property | Value |
|----------|-------|
| **Node ID** | `I3127:21871;2234:33038` (sample) |
| typography | Montserrat 700 / 16 / 24 / 0.5px |
| color (highlight card B.4.3) | `#D4271D` |
| color (post card C.3.7) | `#00101A` |
| max per line | 5 (overflow truncates `…`) |
| gap between tags | 29.9 ≈ 30 |

### "Xem thêm" Load More button — C.2 pagination

| Property | Value | CSS |
|----------|-------|-----|
| layout | centered block, margin-top 24px | `mt-6 flex justify-center` |
| width | auto (min-width 200px) | – |
| height | 48px (meets 48px hit target) | `h-12` |
| padding | 12px 32px | `py-3 px-8` |
| background | `rgba(255,234,158,0.10)` | `bg-[var(--color-brand-gold-soft)]` |
| border | 1px solid `#998C5F` | `border border-[var(--color-border-gold)]` |
| border-radius | 48px | `rounded-[48px]` |
| text | Montserrat 700 / 16 / 24 — `#FFEA9E` | `font-bold text-base text-[var(--color-brand-gold)]` |

**States:**

| State | Changes |
|-------|---------|
| Hover | background `rgba(255,234,158,0.40)` |
| Loading | button disabled, spinner icon replaces left of label |
| Error | label changes to "Thử lại", border-color `#D4271D` |
| Exhausted | button hidden (`display: none`) |

### Image Lightbox — `<ImageLightbox />` (C.3.6 fullscreen)

Built on **`@radix-ui/react-dialog`**. Overlay is dark; images are centered and constrained to viewport.

| Property | Value | CSS |
|----------|-------|-----|
| Overlay bg | `rgba(0,0,0,0.90)` | `bg-black/90` |
| Image max-size | `90vw × 90vh` | `max-w-[90vw] max-h-[90vh] object-contain` |
| Close button | top-right, 48×48, `×` icon | `absolute top-4 right-4 w-12 h-12` |
| Close icon color | `#FFFFFF` | – |
| Prev / Next (if ≥ 2 images) | left/right edge, 48×48 chevron buttons | same style as carousel arrows (transparent, gold chevron) |
| Counter | "2 / 5" caption below image | `--text-caption`, `--color-text-muted` |
| Focus trap | Yes — via Radix Dialog | – |
| Keyboard | Esc → close; ← / → → cycle images | – |
| Close triggers | Esc, click overlay, click close button | – |

### Avatars (MM_MEDIA_Avatar)

| Property | Value |
|----------|-------|
| size | 64 × 64 |
| border-radius | 100% (ELLIPSE) |
| border | 1.869px solid `#FFFFFF` |
| image | profile photo from gmail |

---

## Component Hierarchy with Styles

```
LiveBoard (bg: --color-bg-app #00101A)
├── Header  (h:80, bg: rgba(16,20,23,.80), pad: 12 144)
│   ├── LOGO  (instance — atom)
│   ├── Frame 488 / NavLinks  (gap 64)
│   │   └── NavButton ×3       (text: --text-nav-link)
│   └── Frame 482 / RightCluster (gap 16)
│       ├── LanguageDropdown (button, 1px gold border)
│       ├── NotificationButton (transparent, dot #D4271D 8×8)
│       └── ProfileButton (avatar 32×32)
├── Hero / Bìa  (pad: 80 144, gap 24, gradient cover)
│   ├── KUDOS wordmark        (text: --text-display, color #DBD1C1)
│   ├── Subtitle               (text: --text-h2)
│   ├── A.1 Ghi nhận pill     (738×72, radius 64, soft-gold + 1px gold)
│   └── Tìm kiếm sunner pill  (381×72, radius 64, soft-gold + 1px gold)
├── B_Highlight  (gap 24)
│   ├── B.1 header
│   │   ├── Subtitle "Sun* Annual Awards 2025"  (--text-stat-md)
│   │   ├── Title "HIGHLIGHT KUDOS"             (--text-h1, #FFEA9E)
│   │   ├── B.1.1 Hashtag dropdown   (radius 48, soft-gold + 1px gold)
│   │   └── B.1.2 Phòng ban dropdown (same)
│   ├── B.2 carousel
│   │   ├── B.2.1 ←  (80×80, radius 4, transparent)
│   │   ├── B.2.2 →  (same)
│   │   └── B.2.3 carousel content
│   ├── B.3 Highlight card  (cream, border 4px gold, gap 16, pad 24/24/16/24)
│   │   ├── B.3.2 Sender info  (avatar 64 + name --text-body-emphasis + dept --text-caption)
│   │   ├── B.3.4 arrow icon
│   │   ├── B.3.6 Receiver info
│   │   └── B.4 Content
│   │       ├── B.4.1 timestamp     (--text-meta, #999999)
│   │       ├── B.4.2 content       (--text-body, color #00101A, max 3 lines)
│   │       ├── B.4.3 hashtag list  (--text-meta, color #D4271D, max 5/line)
│   │       └── B.4.4 action  (♥ count + Copy link + Xem chi tiết)
│   ├── B.5 slide bar  (B.5.1 prev | "2/5" --text-h3 | B.5.3 next)
│   ├── B.6 "Sun* Annual Awards 2025 / SPOTLIGHT BOARD"
│   └── B.7 Spotlight canvas (see **§ Spotlight Board canvas (B.7)**)
│       ├── B.7.1 Total counter (`{count} KUDOS`) — centered, `--text-h2` scale, `--color-text-primary` on canvas
│       ├── B.7.3 Search pill + `MM_MEDIA_Search` — **top-left** (`Tìm kiếm` placeholder)
│       ├── B.7.4 Activity rail — **bottom-left**, `--text-caption` / 14–16px bold white; lines: `{time} {receiver} đã nhận được một Kudos mới`
│       ├── B.7.5 Fullscreen / expand control — **bottom-right**, white icon on transparent hit 48×48
│       └── Word-cloud: names `--color-text-primary`; optional featured node `--color-accent-red` (#D4271D)
├── Main row  (grid 2fr/1fr, gap 32)
│   ├── C_All kudos
│   │   ├── C.1 "Sun* Annual Awards 2025 / ALL KUDOS"
│   │   └── C.2 List (gap 24, infinity scroll)
│   │       └── C.3 / C.5 / C.6 / C.7 KUDO Post
│   │           (cream, radius 24, pad 40 40 16 40, gap 16)
│   │           ├── C.3.1 Sender info-block
│   │           ├── C.3.2 Sent icon
│   │           ├── C.3.3 Receiver info-block
│   │           ├── C.3.4 Time           (--text-meta, #999)
│   │           ├── C.3.5 Content        (--text-body, max 5 lines)
│   │           ├── C.3.6 Image gallery  (≤5 thumbs)
│   │           ├── C.3.7 Hashtag list
│   │           └── C.4 actions
│   │               ├── C.4.1 Hearts     (101×32, gray inactive / red active)
│   │               └── C.4.2 Copy link  (text link)
│   └── D_Thống menu phải (gap 24)
│       ├── D.1 Stats card  (panel #00070C, border 1px #998C5F, radius 16, pad 24, gap 10)
│       │   ├── D.1.2 / D.1.3 / D.1.4    (label 22/28 + value 32/40)
│       │   ├── D.1.5 divider rectangle  (1px #2E3940)
│       │   ├── D.1.6 / D.1.7 secret box stats
│       │   └── D.1.8 Mở quà             (374×60, gold solid, radius 8)
│       └── D.3 Leaderboard panel
│           ├── D.3.1 title "10 SUNNER NHẬN QUÀ MỚI NHẤT"
│           └── D.3.2 … D.3.6 list rows  (avatar + name + gift desc)
└── Footer  (--text-footer, color rgba(255,255,255,0.6))
```

> **Hoạt động mới nhất (Thông báo content):** chỉ **B.7.4** trong canvas Spotlight — không có thêm hộp ticker dưới D.3.

---

## Spotlight Board canvas (B.7) — Figma layout & tokens

> **Khác biệt so với bản spec cũ:** Tài liệu trước chỉ mô tả toolbar một hàng (counter + pan/zoom + search). Frame Figma **Sun\* Kudos – Live board** mô tả canvas B.7 như một **khối tối** có trang trí (lưới/constellation, dải màu), **ô tìm kiếm góc trên-trái**, **luồng hoạt động góc dưới-trái**, **counter căn giữa phía trên**, **nút mở rộng toàn màn hình góc dưới-phải**, và **đám mây tên** ở giữa.

### Canvas container

| Token / property | Value | Notes |
|------------------|-------|-------|
| Fill base | `var(--color-spotlight-canvas-base)` | `#00070C` — trùng `--color-bg-panel` / Figma `--Details-Container-2` |
| Border | `var(--border-kudos-panel)` | `1px solid #998C5F` |
| Radius | `var(--radius-kudos-card)` | 24px |
| Min height | `var(--spotlight-board-min-height)` | `min(420px, 52vh)` — có thể tinh chỉnh theo frame |
| Decorative mesh | `var(--spotlight-mesh-line)` | Trắng ~8% — đường lưới/hình chiếu mô phỏng constellation |
| Ribbon wash | `var(--spotlight-ribbon-warm)`, `var(--spotlight-ribbon-teal)` | Gradient góc dưới (cam/nâu + teal) như ảnh thiết kế |

**Tài nguyên Figma (tùy chọn, độ chính xác pixel):** Nếu frame dùng illustration raster/SVG cho galaxy + wave, export vào `public/assets/kudos/` và thêm lớp `background-image` — token CSS hiện tại dùng gradient làm lớp fallback không phụ thuộc asset.

### Vùng tương tác (absolute trong canvas)

| Mã | Vị trí | Nội dung | Token chữ / icon |
|----|--------|----------|------------------|
| **B.7.3** | `top-left` (padding ~24px) | Pill tìm kiếm + icon `MM_MEDIA_Search` 24px, màu `var(--color-cta-bg)` | Placeholder `Tìm kiếm`; `--text-nav-link` 16/24; nền `--color-kudos-pill-idle`; viền `--color-kudos-border` |
| **B.7.1** | Top center (dưới padding) | `{count} KUDOS` | `--text-h2` scale (28–36px); màu **`var(--color-text-primary)`** trên nền tối frame mới |
| **B.7.4** | `bottom-left` | 4–6 dòng hoạt động mới nhất | `--color-text-primary` body; thời gian có thể dùng `--color-kudos-text-timestamp`; format giờ kiểu `8:30PM` (`formatKudosActivityTime`) |
| **B.7.5** | `bottom-right` | Nút fullscreen (mũi tên góc) | Icon `currentColor` = `var(--color-text-primary)`; vùng bấm tối thiểu 48×48 |
| Cloud | Center / fill | Tên sunner, kích thước biến thiên | Mặc định trắng; **nổi bật** (hot) `var(--color-accent-red)` |

### Hoạt động (B.7.4) — chỉ trong canvas Spotlight

Copy mẫu giống **Thông báo content** (`08:30PM Nguyễn Bá Chức đã nhận được một Kudos mới`). Dữ liệu lấy từ **`/api/kudos?page=1`** (N bản ghi đầu; component `SpotlightActivityFeed`). Đồng bộ **`kudos.new`** qua WS (dedup ~1s) **nên** áp dụng cho rail này trong backlog — **không** render thêm hộp ticker dưới **D.3** (đã gộp vào B.7.4).

### Pan / zoom

Trên frame tham chiếu, điều khiển **mở rộng** (B.7.5) thay cho nút “Bật pan/zoom” nổi cùng hàng search. **Pan/zoom** tương tác trên canvas (D3) được giữ trong backlog **T102** và có thể gắn sau khi fullscreen hoặc trong chế độ toàn màn hình.

---

## Responsive Specifications

### Breakpoints

*(Aligned with constitution §IV: mobile ≥ 360px, tablet ≥ 768px, desktop ≥ 1280px)*

| Name | Min Width | Max Width | 2-col main row? |
|------|-----------|-----------|-----------------|
| Mobile | 360px | 767px | No — single column |
| Tablet | 768px | 1279px | No — single column, right panel stacks below |
| Desktop | 1280px | 1440px | **Yes** — `C` (2fr) + `D` (1fr) |
| Wide | 1441px | ∞ | Yes — capped at max-width 1440px |

### Responsive Changes

#### Mobile (< 768px)

| Component | Changes |
|-----------|---------|
| Header | padding-x: 16px; nav links collapse → hamburger drawer |
| Hero pad | 32px 16px |
| KUDOS wordmark | 64px (scale down) |
| A.1 / Tìm kiếm sunner | width 100%; stack vertically, gap 12 |
| B_Highlight card | width 100%, padding 16; arrows hidden; swipe gestures enabled |
| B.7 Spotlight canvas | stack vertical: search → counter → cloud; keep activity rail + expand; reduce `min-height` if needed |
| Main row | single column; right panel accordion collapsed below feed |
| C.3 KUDO Post | padding 16px; image gallery wraps to 2 cols |
| D.1 Stats card | grid-cols-2 on metric rows |
| "Xem thêm" button | width 100% |

#### Tablet (768 – 1279px)

| Component | Changes |
|-----------|---------|
| Header | padding-x: 32px |
| Hero pad | 48px 32px |
| Main row | single column; right panel stacks below feed (not accordion) |
| C.3 KUDO Post | padding 24px |
| "Xem thêm" button | width auto, centered |

#### Desktop (≥ 1280px)

| Component | Changes |
|-----------|---------|
| Container | max-width 1440px, centered |
| Main row | 2-column grid (≈ 760px / 422px) with 32px gap |
| Hero pad | 80px 144px |
| "Xem thêm" button | width auto, centered |

---

## Icon Specifications

All icons use the shared **Icon Component** (no inline SVG / `<img>` tags). Source files live under the `MM_MEDIA_*` Figma family.

| Icon Name | Size | Color | Usage |
|-----------|------|-------|-------|
| `MM_MEDIA_Pen` | 32 × 32 | `#FFEA9E` | Ghi nhận button prefix; D.4 hashtag chip prefix |
| `MM_MEDIA_Search` | 32 × 32 | `#FFEA9E` | Tìm kiếm sunner button prefix; B.7.3 |
| `MM_MEDIA_Heart` | 32 × 32 | `#999999` (inactive) / `#D4271D` (active) | C.4.1, B.4.4 |
| `MM_MEDIA_Copy` | 24 × 24 | `#999999` | C.4.2 copy-link |
| `MM_MEDIA_Open Gift` | 24 × 24 | `#00101A` | D.1.8 button |
| `MM_MEDIA_ChevronRight` / `Left` | 24 × 24 | `#FFEA9E` | Carousel arrows (B.2.1/2, B.5.1/3) |
| `MM_MEDIA_ChevronDown` | 16 × 16 | `#FFEA9E` | Filter dropdowns |
| `MM_MEDIA_Bell` | 24 × 24 | `#FFFFFF` | Header notification |
| `MM_MEDIA_Globe` (Lang) | 24 × 24 | `#FFFFFF` | Language dropdown |
| `MM_MEDIA_PanZoom` | 24 × 24 | `#FFEA9E` | B.7.2 pan/zoom toggle |
| `MM_MEDIA_ArrowSent` | 32 × 32 | `#FFEA9E` | B.3.4, C.3.2 sender→receiver indicator |
| `Badge/Dot` | 8 × 8 | `#D4271D` | Header bell unread badge |

---

## Loading & Skeleton States

All four regions load independently. Use the following skeleton specs so the loading shell matches the real layout.

| Region | Skeleton element | bg color | shimmer | Shape |
|--------|-----------------|-----------|---------|-------|
| `B_Highlight` carousel | 1 card placeholder | `#0D1E29` | yes | same dimensions as B.3 (528 × ~350) |
| `B_Highlight` arrows | prev/next disabled | opacity 0.20 | no | – |
| `C_All kudos` feed | 3 card placeholders | `#0D1E29` | yes | `680 × 200` rounded-3xl |
| `D.1` stat rows | 5 inline blocks | `#0D1E29` | yes | width 60%, height 24px, radius 4px |
| `D.3` leaderboard rows | 5 row stubs | `#0D1E29` | yes | avatar 64×64 circle + 2 rect bars |
| `B.7.1` counter | dash `—` | no skeleton — use placeholder text | – |
| Header counters (avatar, bell badge) | dash `—` | no skeleton | – |

**Shimmer animation** (shared across all skeletons):
```css
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}
.skeleton {
  background: linear-gradient(
    90deg,
    #0D1E29 25%,
    #1A2E3D 50%,
    #0D1E29 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

**Empty states** (after load, no data):

| Region | Copy | Treatment |
|--------|------|-----------|
| `C_All kudos` (0 posts) | `Hiện tại chưa có Kudos nào.` | Center in feed area; `--text-body`, `--color-text-muted`; include `Ghi nhận` CTA |
| `D.3` leaderboard (0 rows) | `Chưa có dữ liệu` | Center in panel; `--text-caption`, `--color-text-muted` |
| `B_Highlight` carousel (0 **highlight** items after load) | *carousel + B.1 heading + filters hidden* | Do not show an empty carousel. **B.6 / B.7 Spotlight** (`SPOTLIGHT BOARD` + word cloud) **remain visible** — they are not gated on highlight count. |
| `B.7` Spotlight (0 kudos) | `0 KUDOS` counter + empty cloud | Show counter at 0; replace cloud with message |
| "Xem thêm" loading (fetching next page) | button shows spinner, disabled state | Triggered by button click |
| WS reconnecting | `Đang kết nối lại…` banner | Top of `C_All kudos`, `--text-caption`, `--color-text-muted`, auto-dismiss on reconnect |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| All buttons | background-color | 150ms | ease-in-out | Hover / focus |
| A.1 / Tìm kiếm sunner | transform (scale 0.98) | 100ms | ease-out | Active |
| Filter dropdown | opacity, transform-y | 150ms | ease-out | Toggle |
| Carousel slide | transform-x | 400ms | ease-in-out | Prev/next or auto-advance |
| Carousel auto-advance | – | 5s interval | – | Pauses on hover/focus; **does not wrap** past last slide (aligned with B.2.2 disabled at last) |
| Heart toggle | scale 1.0 → 1.2 → 1.0 | 250ms | spring | Click |
| Heart fill | color | 150ms | ease-out | Click |
| Toast "Link copied" | opacity, translate-y | 200ms | ease-out | Copy click; auto-dismiss 2s |
| B.7.4 activity rail (lines append / refetch) | opacity | 200ms | ease-out | New rows or poll refresh |
| Real-time post insertion | opacity, height | 300ms | ease-out | WS push |
| Card hover (KUDO post) | translate-y(-2) | 200ms | ease-out | Hover (subtle) |
| Avatar hover preview | opacity, transform-y | 150ms | ease-out | Hover ≥ 300ms |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Header | `2940:13433` | `h-20 px-36 bg-[rgba(16,20,23,0.8)] flex justify-between items-center` | `<KudosHeader />` |
| KUDOS hero wordmark | (text node in `A_KV Kudos`) | `font-svn-gotham text-[140px] text-[#DBD1C1]` | `<HeroWordmark />` |
| A.1 Ghi nhận button | `2940:13449` | `h-18 px-6 rounded-full bg-[rgba(255,234,158,0.1)] border border-[#998C5F] hover:bg-[rgba(255,234,158,0.4)]` | `<KudosComposeTrigger />` |
| Tìm kiếm sunner | `2940:13450` / `2940:14833` | same as A.1 with `w-[381px]` | `<SunnerSearchTrigger />` |
| B.1.1 Hashtag dropdown | `2940:13459` | `h-18 px-4 rounded-[48px] bg-[rgba(255,234,158,0.1)] border border-[#998C5F]` | `<HashtagFilter />` |
| B.1.2 Phòng ban dropdown | `2940:13460` | same | `<DepartmentFilter />` |
| Carousel arrow | `2940:13470` / `2940:13468` | `w-20 h-20 rounded bg-transparent hover:bg-[rgba(255,234,158,0.1)]` | `<CarouselArrow direction="prev|next" />` |
| Highlight card | `2940:13465` | `bg-[#FFF8E1] border-4 border-[#FFEA9E] rounded-2xl p-6 pb-4` | `<KudosHighlightCard />` |
| KUDO Post card | `3127:21871` | `bg-[#FFF8E1] rounded-3xl p-10 pb-4` | `<KudosPostCard />` |
| Heart action | `I3127:21871;256:5175` | `inline-flex items-center gap-1` heart icon-button | `<HeartButton />` |
| Copy link | `I3127:21871;256:5216` | `text-[#00101A] underline-offset-2 hover:underline` | `<CopyLinkButton />` |
| Stat panel | `2940:13489` | `bg-[#00070C] border border-[#998C5F] rounded-2xl p-6 space-y-2.5` | `<KudosStatsPanel />` |
| Mở quà CTA | `2940:13497` | `h-15 w-[374px] rounded-lg bg-[#FFEA9E] text-[#00101A]` | `<OpenGiftButton />` |
| Leaderboard panel | `2940:13510` | `bg-[#00070C] border border-[#998C5F] rounded-2xl p-6 space-y-2.5` | `<TopGiftRecipientsPanel />` |
| Hashtag chip | `I3127:21871;2234:33038` | `text-[#D4271D] font-bold text-base tracking-wide` | `<HashtagChip />` |
| Avatar | `MM_MEDIA_Avatar` | `w-16 h-16 rounded-full ring-2 ring-white` | `<UserAvatar />` |
| Notification dot | (in header bell) | `absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#D4271D]` | `<NotificationBadge />` |
| Spotlight board | `2940:14174` | §B.7 tokens + absolute zones | `<SpotlightBoard />`, `<SpotlightActivityFeed />`, `SpotlightSearch variant="board"` |
| "Xem thêm" button | (C.2 bottom) | `h-12 px-8 rounded-[48px] bg-[...gold-soft] border border-[...gold] font-bold text-base text-[...gold]` | `<LoadMoreButton />` |
| Image lightbox | (C.3.6 fullscreen) | `bg-black/90 fixed inset-0 z-50 flex items-center justify-center` | `<ImageLightbox />` (Radix Dialog) |

---

## Notes

- All colors **MUST** use the `--Details-*` CSS variables — and corresponding Tailwind config entries — to keep parity with the Figma variable contract. Hard-coding raw hex values in component files is **FORBIDDEN** (constitution §II design-token gate).
- All icons **MUST** be rendered through the project `<Icon name="…" />` component — no inline `<svg>` or `<img>` tags.
- Fonts **MUST** be loaded via `next/font` (constitution §II). Use `next/font/google` for `Montserrat` and `Montserrat Alternates`; use `next/font/local` for `SVN-Gotham` (custom/licensed font — commit font files to the project or provide via environment-injected asset path). No external `<link>` font imports.
- Load only the weights actually used: Montserrat `700` (primary), Montserrat Alternates `700` (footer only). Load SVN-Gotham `400` for the hero wordmark. Avoid loading unused weights to keep the bundle lean.
- Ensure WCAG AA: gold-on-dark (`#FFEA9E` on `#00101A`) contrast ratio ≈ 7.5:1 ✓; white-on-dark (`#FFFFFF` on `#00101A`) ≈ 18:1 ✓; muted gray (`#999999` on `#00101A`) ≈ 3.3:1 ✗ — restrict `--color-text-muted` to timestamps, dividers, and non-informational captions only.
- KUDO cards have **no shadow** — preserve the flat-with-border look. Do not add `box-shadow` for "depth".
- The Highlight card uses a **4px gold border**, not a shadow, as its primary elevation cue.
- Carousel masks (`Frame 527/528`) are pure CSS gradients — no JS needed.
- The Spotlight word-cloud (B.7) is a custom data-viz; treat as a contained `<canvas>` or D3 SVG component, not a styled list.
- All interactive elements MUST have a minimum hit target of **48 × 48 px** (Material Design 3 / constitution §IV). Use padding or a transparent pseudo-element wrapper to enlarge visually small targets (e.g. the 32×32 heart icon, the 24×24 copy icon) without changing visual size.
