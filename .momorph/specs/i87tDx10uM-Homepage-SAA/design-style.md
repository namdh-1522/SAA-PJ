# Design Style: Homepage SAA

**Frame ID**: `i87tDx10uM`
**Frame Name**: `Homepage SAA` (node `2167:9026`)
**Figma Link**: `https://www.figma.com/file/9ypp4enmFmdK3YAFJLIu6C/?node-id=2167:9026`
**Extracted At**: 2026-04-22

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| `--color-bg-dark` | #00101A | 100% | Page background, button text on yellow, solid gradient stops |
| `--color-bg-dark-alt` | #001320 | — | V-gradient mid stop (reused from Login) |
| `--color-bg-header` | #101417 | 80% | Header bar (rgba(16,20,23,0.8)) |
| `--color-cta-bg` | #FFEA9E | 100% | Primary CTA fill (ABOUT AWARDS, Chi tiết, Widget) |
| `--color-cta-bg-hover` | #FFE070 | 100% | Primary CTA hover (inherits from Login) |
| `--color-cta-bg-active` | #FFD740 | 100% | Primary CTA active (inherits from Login) |
| `--color-cta-text` | #00101A | 100% | Text on yellow buttons |
| `--color-accent-gold` | #FAE287 | 100% | Section titles, selected nav text, award glow border |
| `--color-accent-gold-alt` | #FFEA9E | 100% | CTA + section heading "Sun* Kudos" title, Top Talent card title (NOT used for card "Chi tiết" link — that link is white) |
| `--color-cta-outline-bg` | rgba(255,234,158,0.10) | 10% | Hero CTA outlined-state fill (default for both ABOUT AWARDS and ABOUT KUDOS) |
| `--color-cta-outline-border` | #998C5F | 100% | Hero CTA outlined-state border; avatar button border |
| `--color-text-primary` | #FFFFFF | 100% | Body copy, card descriptions, footer |
| `--color-text-muted` | #DBD1C1 | 100% | Kudos D2 block light description |
| `--color-divider` | #2E3940 | 100% | Section separators, C1 ruler line |
| `--color-status-unread` | #D4271D | 100% | Notification bell badge |
| `--color-overlay-shade` | rgba(0,0,0,0.25) | 25% | Card hover glow, shadow overlays |
| `--color-hover-surface` | rgba(255,255,255,0.10) | 10% | Language/avatar/bell hover state |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing | Usage |
|------------|-------------|------|--------|-------------|----------------|-------|
| `--text-nav-active` | Montserrat | 14px | 700 | 20px | 0.10px | Selected header nav item (`A1.2`) |
| `--text-nav` | Montserrat | 16px | 700 | 24px | 0.15px | Header nav normal/hover (`A1.3`, `A1.5`) |
| `--text-nav-lang` | Montserrat | 16px | 700 | 24px | 0.15px | Language selector "VN" (reused from Login) |
| `--text-hero-h1` | Montserrat | 200px | 400 | 200px | -4px | "ROOT FURTHER" hero title (display font) |
| `--text-hero-sub` | Montserrat | 24px | 700 | 32px | 0px | "Comming soon" subtitle (B1.2) — text preserves Figma typo (two m's) |
| `--text-countdown-num` | Digital Numbers (Figma) → **DSEG7-Classic Bold** (web) | 49.152px | 400 in Figma → 700 in DSEG7 (only weight available) | 64px (auto) | 0% | Countdown 2-digit numbers — see "Font swap" note in §Notes |
| `--text-countdown-label` | Montserrat | **24px** | 700 | **32px** | **0px** | "DAYS" / "HOURS" / "MINUTES" — verified against Figma nodes `2167:9042/9047/9052` |
| `--text-event-label` | Montserrat | 16px | **400** | 24px | 0.5px | "Thời gian:" / "Địa điểm:" labels — secondary text ("văn bản phụ") per design-items |
| `--text-event-value` | Montserrat | 16px | **700** | 24px | 0.5px | "26/12/2025" / "Âu Cơ Art Center" values — primary text ("văn bản chính") per design-items |
| `--text-event-livestream` | Montserrat | 16px | **700** | 24px | 0.5px | "Tường thuật trực tiếp..." note — verified against Figma node `2167:9061` (was incorrectly 400) |
| `--text-cta-btn` | Montserrat | 22px | 700 | 28px | 0px | Hero CTAs "ABOUT AWARDS" / "ABOUT KUDOS" (276×60) |
| `--text-cta-btn-sm` | Montserrat | 16px | 700 | 24px | 0.5px | Smaller inline CTAs ("Chi tiết" on card + D2.1 Kudos 127×56) |
| `--text-section-caption` | Montserrat | **24px** | **700** | **32px** | **0px** | "Sun* annual awards 2025" caption — verified against Figma node `2167:9070` (was incorrectly 16/24/500/0.15) |
| `--text-section-title` | Montserrat | 57px | 700 | 64px | -0.25px | "Hệ thống giải thưởng" section title |
| ~~`--text-section-desc`~~ | — | — | — | — | — | **REMOVED**: the "Các hạng mục sẽ được trao..." descriptor was a documentation artefact, not present in the Figma frame. C1 only contains the caption + divider + title (see §C1). |
| `--text-body-content` | Montserrat | 16px | 400 | 24px | 0.5px | B4 "Root Further" body paragraphs |
| `--text-body-quote` | Montserrat | 16px | 400 | 24px | 0.5px | "A tree with deep roots…" quote |
| `--text-card-title` | Montserrat | 24px | 400 | 32px | 0px | Award card titles (Top Talent, etc.) |
| `--text-card-desc` | Montserrat | 16px | 400 | 24px | 0.5px | Award card descriptions |
| `--text-card-link` | Montserrat | 16px | **500** | 24px | **0.15px** | "Chi tiết" link on cards — color **#FFFFFF** (white). Verified against Figma node `I2167:907x;214:1023;186:1439` (was incorrectly 700/0.5 and color #FFEA9E) |
| `--text-kudos-label` | Montserrat | **24px** | **700** | **32px** | **0px** | "Phong trào ghi nhận" kicker — verified against Figma node `I3390:10349;313:8421` (was incorrectly 16/24/500/0.15) |
| `--text-kudos-title` | Montserrat | 57px | 700 | 64px | -0.25px | "Sun* Kudos" D2 title |
| `--text-kudos-desc` | Montserrat | 16px | **700** | 24px | 0.5px | D2 body description — verified against Figma node `I3390:10349;313:8423` (was incorrectly 400). The "ĐIỂM MỚI CỦA SAA 2025" emphasis run uses the same 700 weight. |
| `--text-kudos-watermark` | SVN-Gotham | 96.16px | 400 | 24.04px | -13% | Big "KUDOS" watermark on D1 card |
| `--text-footer` | Montserrat Alternates | 16px | 700 | 24px | 0px | Copyright line (reused from Login) |
| `--text-footer-nav` | Montserrat | 16px | 700 | 24px | 0.15px | Footer link labels |

> **Note**: All hero/display font sizes (H1 200px, 57px section titles, 96px watermark) are design-file measurements. The implementation may scale these responsively using fluid typography (clamp) — see Responsive Specifications.

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| `--spacing-section-gap` | 120px | Gap between major sections (Hero → B4 → C → D) in "Bìa" container |
| `--spacing-content-px` | 144px | Page horizontal padding (matches Login) — desktop |
| `--spacing-content-max-w` | 1224px | Inner content max width (1512 − 2×144) |
| `--spacing-awards-gap` | 80px | Gap between C1 header and C2 list |
| `--spacing-card-grid-x` | 108px | Horizontal gap between award cards |
| `--spacing-card-grid-y` | 80px | Vertical gap between award card rows |
| `--spacing-card-gap` | 24px | Gap between card image and title/desc/link stack |
| `--spacing-countdown-gap` | 40px | Gap between countdown tiles (Days/Hours/Minutes) |
| `--spacing-tile-gap` | 14px | Gap inside tile (number → label) |
| `--spacing-cta-gap` | 40px | Gap between ABOUT AWARDS and ABOUT KUDOS |
| `--spacing-btn-px` | 24px | Primary button horizontal padding |
| `--spacing-btn-py` | 16px | Primary button vertical padding |
| `--spacing-btn-gap` | 4px | Gap between button text and icon (inherits Login) |
| `--spacing-hero-info-gap` | 8px | B2 inner label↔value gap |
| `--spacing-hero-info-row-gap` | 60px | B2 time↔location row gap |
| `--spacing-header-inner-gap` | 238px | Header outer gap between logo-group and controls |
| `--spacing-header-logo-gap` | 64px | Header logo ↔ nav links gap |
| `--spacing-header-nav-gap` | 24px | Gap between header nav links |
| `--spacing-header-controls-gap` | 16px | Gap between language/bell/avatar |
| `--spacing-footer-gap` | 80px | Footer logo ↔ nav ↔ copyright gap |
| `--spacing-footer-nav-gap` | 48px | Gap between footer links |
| `--spacing-kudos-content-gap` | 32px | D2 title block ↔ CTA gap |
| `--spacing-widget-right` | 32px | Widget button right offset (1512-1387-93=32) |
| `--spacing-widget-top` | 918px | Widget button top offset (as-designed; fixed in implementation) |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| `--radius-btn` | 8px | CTA buttons (B3.1, B3.2) |
| `--radius-tile` | 4px | Countdown tile, card image corners |
| `--radius-widget` | 100px | Widget button pill shape |
| `--radius-avatar` | 100px | Avatar icon, chevron button |
| `--radius-card` | 8px | Award card image frame |
| `--border-ruler` | 1px solid #2E3940 | C1 section divider |
| `--border-cta-outline` | 1px solid #998C5F | Hero CTA outlined state (default for both ABOUT AWARDS and ABOUT KUDOS) |
| `--border-avatar` | 1px solid #998C5F | Avatar icon button |

### Z-index Scale

All `z-index` values MUST come from this table — no ad-hoc numbers in JSX (enforced by TR-010 in spec.md).

| Token Name | Value | Layer | Usage |
|------------|-------|-------|-------|
| `--z-hero-bg` | 0 | Bottom | Hero background image |
| `--z-hero-overlay` | 1 | — | Hero H/V gradient overlays |
| `--z-main-content` | 2 | — | All scrollable page content (hero text, cards, Kudos, body) |
| `--z-header` | 10 | Sticky | Fixed header bar |
| `--z-widget` | 20 | Floating | Floating quick-action widget button |
| `--z-dropdown` | 30 | Popover | Language menu, avatar dropdown, notification panel |
| `--z-modal` | 50 | Overlay | Modal dialogs (none on this screen; reserved for future) |
| `--z-tooltip` | 60 | Top | Tooltips (none on this screen; reserved for future) |

### Shadows / Effects

| Token Name | Value | Usage |
|------------|-------|-------|
| `--shadow-card-hover` | 0 0 32px rgba(255,234,158,0.35) | Award card hover glow |
| `--shadow-widget` | 0 4px 12px rgba(0,0,0,0.25) | Floating widget button |
| `--shadow-cta-focus` | 0 0 0 2px #FFEA9E, 0 0 0 4px rgba(255,234,158,0.3) | CTA focus ring (inherits) |
| `--overlay-gradient-v` | linear-gradient(0deg, #00101A 22.48%, transparent 51.74%) | Hero vertical gradient (reused from Login) |
| `--overlay-gradient-h` | linear-gradient(90deg, #00101A 0%, #00101A 25.41%, transparent 100%) | Hero horizontal gradient (reused from Login) |

---

## Layout Specifications

### Frame

| Property | Value |
|----------|-------|
| Width | 1512px (Figma reference) |
| Height | 4480px (full scrollable page) |
| Background | #00101A |
| Inner content width | 1224px (centered, 144px horizontal padding) |

### Layout Structure (ASCII)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Homepage SAA (1512 × 4480, bg:#00101A)                                       │
│                                                                              │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ A1_Header (fixed top:0, w:1512, h:80, bg:rgba(16,20,23,0.8), z:10)       │ │
│ │ px:144, flex row justify-between · gap:238                               │ │
│ │ [Logo] [Nav: About SAA 2025 | Awards Info | Sun* Kudos]    [🌐VN][🔔][👤]│ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ ── 3.5_Keyvisual (hero group, w:1512, h:1392, starts at y:0, z:0) ──        │
│ [MM_MEDIA_Keyvisual BG — full-bleed image, object-fit:cover]                │
│ [Cover — gradient overlay z:1, full 1512×1480]                              │
│                                                                              │
│   (within content area px:144)                                               │
│   ┌──────────────────────────────────────────────────────────────────┐      │
│   │ Frame 487 (1224 × 596, flex col, gap:40)                         │      │
│   │  ROOT FURTHER (hero H1, Montserrat 400 200px / lh:200 / ls:-4)   │      │
│   │  ┌────────────────────────────────────────────────────────────┐  │      │
│   │  │ Frame 523 (1224 × 256, flex col, gap:16)                   │  │      │
│   │  │  B1_Countdown time (1224 × 176, flex col gap:16)           │  │      │
│   │  │   B1.2 "Coming soon" (Montserrat 700 24px/32lh #FFF)        │  │      │
│   │  │   B1.3_Countdown (429 × 128, flex row gap:40)              │  │      │
│   │  │     ┌─ Tile (116×128 gap:14 col) × 3 ─┐                    │  │      │
│   │  │     │ [20]  [20]  [20]                │                    │  │      │
│   │  │     │ DAYS  HOURS MINUTES             │                    │  │      │
│   │  │     └─────────────────────────────────┘                    │  │      │
│   │  │  B2_Thông tin sự kiện (637 × 64, flex col gap:8)           │  │      │
│   │  │    "Thời gian: 26/12/2025   Địa điểm: Âu Cơ Art Center"    │  │      │
│   │  │    "Tường thuật trực tiếp qua sóng Livestream"             │  │      │
│   │  └────────────────────────────────────────────────────────────┘  │      │
│   │  B3_Call-To-Action (570 × 60, flex row gap:40)                   │      │
│   │    [ABOUT AWARDS ↗]  [ABOUT KUDOS ↗]                             │      │
│   │     both 276×60 — shared <HeroCtaButton> component                │      │
│   │     normal=outlined (10% yellow, gold border, white text)         │      │
│   │     hover=filled yellow with black text                           │      │
│   └──────────────────────────────────────────────────────────────────┘      │
│                                                                              │
│   6_Widget Button (fixed pill 106×64, pos:fixed right:32 top:~918→bottom)   │
│                                                                              │
│ ── Bìa section gap: 120px ──                                                │
│                                                                              │
│   Frame 486 (1152 × 1219, y:899, flex col gap:32)                           │
│    Group 434 — ROOT FURTHER display (290 × 134)                              │
│    B4_content (1152 × 1090, y:1047)                                          │
│      Paragraphs describing "Root Further" philosophy                          │
│      "A tree with deep roots fears no storm" quote                            │
│                                                                              │
│ ── Bìa section gap: 120px ──                                                │
│                                                                              │
│   Hệ thống giải thưởng (1224 × 1353, y:2238, flex col gap:80)               │
│    C1_Header (1224 × 129, flex col gap:16)                                   │
│      "Sun* annual awards 2025" caption (Montserrat 700 24/32 #FFFFFF)       │
│      ─── 1px #2E3940 divider ───                                             │
│      Frame 488 (1224 × 64, flex row, single child)                           │
│        "Hệ thống giải thưởng" (Montserrat 700 57/64 ls:-0.25 #FAE287)       │
│    C2_Award list (1224 × 1144, GRID of 6 cards — 3 cols × 2 rows)           │
│      Each card: 336 × 504-528, flex col gap:24                               │
│        Image 336×336 (bordered, gold glow)                                   │
│        Title (Montserrat 400 24/32 #FFEA9E)                                  │
│        Description (Montserrat 400 16/24 ls:0.5 #FFFFFF)                     │
│        "Chi tiết ↗" link (88 × 56)                                           │
│                                                                              │
│ ── Bìa section gap: 120px ──                                                │
│                                                                              │
│   D1_Sunkudos (1224 × 500, y:3711)                                          │
│    [ MM_MEDIA_Kudos Background (1120 × 500) ]                                │
│    D2_Content (457 × 408 at x:260, y:3757, flex col gap:32)                 │
│      "Phong trào ghi nhận" kicker                                             │
│      "Sun* Kudos" title (Montserrat 700 57/64 #FFEA9E)                       │
│      Body description paragraph                                                │
│      [Chi tiết ↗] button (127 × 56, yellow)                                   │
│    KUDOS watermark (SVN-Gotham 96 #FFEA9E, centered in right half)          │
│                                                                              │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ 7_Footer (w:1512, y:4336)                                                │ │
│ │ Frame 488 (971×64 flex row gap:80)                                        │ │
│ │   [🔆 Logo 69×64]  [About SAA 2025 | Awards Info | Sun* Kudos | Tiêu...] │ │
│ │   "Bản quyền thuộc về Sun* © 2025" (Montserrat Alt 700 16/24)           │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### A — Header (`A1_Header` = `2167:9091`)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `2167:9091` | — |
| width | 1512px → `100vw` | `width: 100%` |
| height | 80px | `height: 80px` |
| padding | 12px 144px | `padding: var(--spacing-header-py) var(--spacing-content-px)` |
| background | rgba(16,20,23,0.8) | `background-color: var(--color-bg-header)` |
| display | flex row justify-between | `display: flex; flex-direction: row; justify-content: space-between; align-items: center` |
| gap | 238px | `gap: var(--spacing-header-inner-gap)` |
| position | fixed top:0 | `position: fixed; top: 0; z-index: 10` |

Logo + nav sub-group (`I2167:9091;186:2166` — 606×56, flex row gap:64):
- Logo (`A1.1_LOGO`, `I2167:9091;178:1033`): 52×48, clickable → scroll to top / home
- Nav (`Frame 476`, `I2167:9091;178:653`): 490×56, flex row gap:24
  - `A1.2` About SAA 2025 — **selected state**: Montserrat 700 14/20 ls:0.10 #FFEA9E + underline (pseudo-current)
  - `A1.3` Awards Information — hover state (design): bg on hover, Montserrat 700 16/24 ls:0.15 #FFFFFF
  - `A1.5` Sun* Kudos — normal state: same as A1.3 (no underline)

Controls (`Frame 482`, `I2167:9091;186:1601` — 220×56, flex row gap:16):
- `A1.7_Language` — 108×56 (same as Login)
- `A1.6_Notification` — 40×40 bell icon button
- `A1.8_Button-IC` avatar — 40×40 circular, border 1px #998C5F

### A1.6 — Notification Bell (`I2167:9091;186:2101`)

| Property | Value | CSS |
|----------|-------|-----|
| width | 40px | `width: 40px; height: 40px` |
| border-radius | 100px | `border-radius: var(--radius-avatar)` |
| Icon | bell SVG 24×24 #FFFFFF | — |
| Badge | 8×8 dot #D4271D (top-right when unread) | `position: absolute; top: 8px; right: 8px` |

**States:**
| State | Property | Value |
|-------|----------|-------|
| Default | background | transparent |
| Hover | background | rgba(255,255,255,0.10) |
| Active | background | rgba(255,255,255,0.12) |
| Focus | outline | 2px solid rgba(255,234,158,0.5) |

### A1.8 — Avatar Button (`I2167:9091;186:1597`)

| Property | Value | CSS |
|----------|-------|-----|
| width | 40px | `width: 40px; height: 40px` |
| border | 1px solid #998C5F | `border: var(--border-avatar)` |
| border-radius | 100px | `border-radius: var(--radius-avatar)` |
| Icon | user SVG 24×24 #FFFFFF | — |

States: same as Language selector in Login.

On click → open `Dropdown-profile` (`721:5223`) with options: **Profile**, **Sign out**, **Admin Dashboard** (admin role only).

---

### B — Hero Key Visual (`3.5_Keyvisual` = `2167:9027`)

Container: GROUP 1512×1392 at y=0, z-index:1, overlaps header.

`MM_MEDIA_Keyvisual BG` (`2167:9028`): RECTANGLE 1512×1392, full-bleed `background-image` with `background-size: cover`.

> **Hero BG architecture rule** — the keyvisual BG MUST be rendered as a **page-level decoration**, NOT scoped to the hero `<section>` element:
>
> ```tsx
> // app/about-saa-2025/page.tsx
> <div className="absolute inset-x-0 top-0 h-[1100px] z-[var(--z-hero-bg)] home-hero-bg pointer-events-none" />
> ```
>
> The `<HeroSection>` itself sizes **naturally to its content + py padding**. Why: the Figma artboard's 1392 px tall keyvisual extends ~600 px BELOW the Frame 487 content as decorative BG. If we wrap the BG inside `<HeroSection>` with a `min-h-[1100px]`, the section grows to 1100 px and creates a ~500 px empty hole between the CTAs and AboutBody. By moving the BG to a page-level absolute element with `h-[1100px]`, the artwork shows in the upper 1100 px of the viewport (matching Figma) AND the body sections start immediately after the hero content (matching the 120 px section gap from design). The body sections naturally cover the lower portion of the BG decoration with their dark `--color-bg-dark` background.

Overlays (stacked z:1):
- Horizontal gradient (`Cover`, `2167:9029` — 1512×1480): `linear-gradient(90deg, #00101A 0%, #00101A 25.41%, transparent 100%)` (same as Login) — ensures left readability
- Vertical gradient: `linear-gradient(0deg, #00101A 22.48%, transparent 51.74%)` — fades hero into body

Inner content (inside `Bìa → Frame 487`):

#### B.0 — "ROOT FURTHER" hero title (`Frame 482` = `2167:9032`)

| Property | Value |
|----------|-------|
| **Node ID** | `2167:9032` (container) |
| width | 1224px |
| height | 200px |
| Font (best estimate) | Montserrat (or a stylised display cut) 400 ~200px / line-height ~200 / letter-spacing ~-4px |
| Color | #FFFFFF |
| Text-transform | uppercase |

> Visual: two lines — "ROOT" and "FURTHER" — left-aligned.

> **⚠ Verify with design — font file unconfirmed.** The Figma `list_frame_styles` dump does NOT include a TEXT node at 200px inside this container, and the glyph shapes visible in the frame reference (distinctive cut-off "U" strokes, elongated geometric "R") do not match a standard Montserrat weight. The hero title is most likely rendered in Figma as **vector paths** (outlined text) rather than live text.
>
> **Implementation plan** — attempt one of the following, in priority order:
> 1. **Preferred**: export the hero wordmark as a single SVG asset from Figma (e.g. `/public/assets/home/hero-root-further.svg`) and render inside an `<svg>` with `role="img" aria-label="ROOT FURTHER"`. This preserves the designer's intent 1:1.
> 2. **Fallback**: render live `<h1>` with the font estimate above; if the visual regression check diverges > 5% against the frame.png reference, escalate to design for the exact font family / weight / licence.
>
> Either approach satisfies FR-001 (RSC-renderable) and accessibility (the wordmark is announced as "ROOT FURTHER").

#### B1 — Countdown (`2167:9035`)

| Property | Value |
|----------|-------|
| **Node ID** | `2167:9035` |
| width | 1224px |
| height | 176px |
| layout | flex col, gap:16 |

**B1.2 Subtitle** (`2167:9036`): "**Comming soon**" (Figma typo with two m's — preserve verbatim) — Montserrat 700 24/32 #FFFFFF (hidden when countdown reaches 0).

**B1.3 Countdown row** (`2167:9037`): 429×128, flex row gap:40, 3 tiles.

Each tile (`B1.3.1/2/3_Days/Hours/Minutes`, IDs `2167:9038/9043/9048`):

| Property | Value | CSS |
|----------|-------|-----|
| width × height | 116px × 128px | `width: 116px; height: 128px` |
| layout | flex column, gap:14 | `display: flex; flex-direction: column; gap: 14px` |
| Number box | 116×92 px | `background: rgba(255,234,158,0.10); border-radius: 4px;` **NO border, NO inset shadow, NO text-shadow / glow** (these were a polish drift in earlier impl — Figma node has none of them) |
| Number | "20" (2 digits, zero-padded) | Digital Numbers (Figma) → DSEG7-Classic Bold (web), 49.152px, color `#FFEA9E`, **letter-spacing: 0** (Figma value is `0%`; do NOT add tracking — DSEG7 already includes spacing within glyphs) |
| Label | DAYS / HOURS / MINUTES | Montserrat 700 24/32 ls:0 #FFFFFF, text-transform:uppercase (per the corrected `--text-countdown-label` token) |

#### B2 — Event Info (`2167:9053`)

| Property | Value |
|----------|-------|
| **Node ID** | `2167:9053` |
| width | 637px |
| height | 64px |
| layout | flex col, gap:8 |

Row 1 (`Frame 522`, `2167:9054` — 637×32, flex row gap:60):
- `Group 417` (220×32): "Thời gian: **26/12/2025**" — label regular, value bold
- `Group 418` (299×32): "Địa điểm: **Âu Cơ Art Center**" — label regular, value bold

Row 2 (`2167:9061` — 637×24): "Tường thuật trực tiếp qua sóng Livestream" — Montserrat **700** 16/24 ls:0.5 #FFFFFF (verified against Figma node `2167:9061`).

**Typography correction** — Per the design-items B2 description, labels are "**văn bản phụ**" (secondary text) and values are "**văn bản chính**" (primary text). The earlier "label=700 / value=400" inversion was a documentation bug.

| Run | Font | Size | Weight | Line-height | Letter-spacing | Color |
|-----|------|------|--------|-------------|----------------|-------|
| Label "Thời gian:" / "Địa điểm:" | Montserrat | 16px | **400** | 24px | 0.5px | #FFFFFF |
| Value "26/12/2025" / "Âu Cơ Art Center" | Montserrat | 16px | **700** | 24px | 0.5px | #FFFFFF |
| Livestream note "Tường thuật trực tiếp..." | Montserrat | 16px | **700** | 24px | 0.5px | #FFFFFF |

**i18n keys**: `home.event.time_label`, `home.event.time_value`, `home.event.location_label`, `home.event.location_value`, `home.event.livestream_note`.

#### B3 — Call-to-Action (`2167:9062`)

Container: 570×60, flex row gap:40. **Two instances of the SAME button component** (`<HeroCtaButton>`) with different labels and navigation targets — NOT two different variants.

> **Important state interpretation** — The Figma frame deliberately shows B3.1 "ABOUT AWARDS" in **hover** state (yellow-filled) and B3.2 "ABOUT KUDOS" in **normal** state (outlined), per design-items note *"2 nút có hiển thị thay đổi theo state như nhau"* ("both buttons change display the same way by state"). Implementers MUST render a single variant with two states, not two separate primary/secondary variants.

**Shared dimensions** (both B3.1 `2167:9063` and B3.2 `2167:9064`):

| Property | Value | CSS |
|----------|-------|-----|
| width × height | 276px × 60px | `width: 276px; height: 60px` |
| padding | 16px 24px | `padding: var(--spacing-btn-py) var(--spacing-btn-px)` |
| border-radius | 8px | `border-radius: var(--radius-btn)` |
| display | flex row items-center · gap:8 | `display: inline-flex; gap: 8px` |
| Text font | Montserrat 700 22/28 ls:0 | — |
| Icon | 24×24 up-arrow (`MM_MEDIA_Up`) | inherit `color` from text |

**Shared states** (applied equally to both buttons):

| State | Background | Border | Text color | Icon color |
|-------|------------|--------|-----------|------------|
| **Normal / Default** | `rgba(255,234,158,0.10)` | `1px solid #998C5F` | `#FFFFFF` | `#FFFFFF` |
| **Hover** | `#FFEA9E` | none (or `1px solid transparent`) | `#00101A` | `#00101A` |
| **Active / Pressed** | `#FFD740` | none | `#00101A` | `#00101A` |
| **Focus-visible** | same as current state | + outline `2px solid #FFEA9E; outline-offset: 2px` | — | — |
| **Disabled** | `rgba(255,234,158,0.10)` + opacity `0.5` | `1px solid #998C5F` | `#FFFFFF` | `#FFFFFF`; `cursor: not-allowed` |

Transitions: `background-color 150ms ease-in-out, color 150ms ease-in-out, border-color 150ms ease-in-out`.

The Figma "primary yellow" variant (`#FFEA9E` filled, black text) seen in B3.1 corresponds to the **hover** state above. The Figma "outlined" variant in B3.2 corresponds to the **normal** state.

---

### B4.0 — "ROOT FURTHER" sub-heading (`Group 434` = `3204:10153`)

A second, smaller instance of the "ROOT FURTHER" wordmark positioned ABOVE the body paragraphs (below the hero).

| Property | Value |
|----------|-------|
| **Node ID** | `3204:10153` (GROUP) |
| Figma bounding box | 290px × 134px (~2.16:1 aspect) |
| **Implementation size** | **width: 290 px** (auto-height ≈ 119 px, preserves the visible-text 2.44:1 aspect ratio after the empty right whitespace is CSS-cropped out) |
| position | absolute, y:881 (relative to `Bìa` container) |
| Alignment | **horizontally centered** within `Frame 486` (1152 wide) — implementation: `<div class="flex justify-center w-full">…</div>` plus `mx-auto` on the mark element itself |
| **Spacing above** (page-level) | top-padding of the body container `pt-[40px] md:pt-[60px]` (reduced from the prior `80/120px` so the mark sits closer to the hero per stakeholder request 2026-04-26) |

> **Implementation note** — the source asset `/public/assets/home/hero-root-further.png` is 1224 × 200, but the actual "ROOT FURTHER" text only occupies the LEFT ~40% of the canvas (text bounds 488 × 200, aspect 2.44:1). The empty right whitespace is CSS-cropped via `background-image` + `background-size` scaling so the visible-text rectangle exactly fills the container. We size the container to **290 wide × ~119 tall** which matches the Figma bounding-box width directly and keeps the text reading clearly without distortion. The mark is rendered ~half the previous (580px) implementation per a 2026-04-26 stakeholder request to reduce visual weight above the body paragraphs.

**i18n context**: decorative/logomark — no translatable text; `alt="ROOT FURTHER"` for AT announcement.

---

### B4 — Root Further Content (`5001:14827`)

| Property | Value |
|----------|-------|
| **Node ID** | `5001:14827` (GROUP) |
| width × height | 1152px × 1090px |
| position | absolute, x:180, y:1047 |

Multiple paragraph text runs (Montserrat 400 16/24 ls:0.5 #FFFFFF) wrapping a centered "A tree with deep roots…" quote. Typography cascade:

| Region | Style |
|--------|-------|
| Body paragraphs (p1–p3, p4–p5) | Montserrat 400 16/24 ls:0.5 #FFFFFF · **`text-align: justify`** · `max-width: 1152px` (NOT left-aligned — Figma uses justified text per the dense narrative layout) |
| Centered quote "A tree with deep roots fears no storm" | Montserrat 400 16/24 ls:0.5 #FFFFFF · italic, centered |
| Quote source "(Cây sâu bền rễ, bão giông chẳng nề — Ngạn ngữ Anh)" | Montserrat 400 14/20 ls:0.5 muted (`var(--color-text-muted)`) · centered |

**Narrative order — IMPORTANT**: paragraphs MUST render in this exact sequence per the Figma reference:

1. **body_p1** — "Đứng trước bối cảnh thay đổi như vũ bão của thời đại AI…"
2. **body_p2** — "Lấy cảm hứng từ sự đa dạng năng lực, khả năng phát triển linh hoạt…"
3. **body_p3** — "Vượt ra khỏi nét nghĩa bề mặt, 'Root Further' chính là hành trình…"
4. **Quote + quote_source** — centered, italic
5. **body_p4** — "Trước giông bão, chỉ những tán cây có bộ rễ đủ mạnh…" (continues AFTER the quote)
6. **body_p5** — "Không ai biết trước ấn sâu trong 'lòng đất' của ngành công nghệ…"

> **Spec correction**: the earlier draft only documented "body_p1 … body_pN" without ordering, and the implementation only rendered p1–p3 + quote — paragraphs **p4 and p5 (which appear AFTER the quote in the Figma)** were dropped. The corrected `<AboutBody>` MUST render the quote in the MIDDLE of the narrative, with p4 and p5 below it.

**i18n keys**: `home.about.body_p1`, `home.about.body_p2`, `home.about.body_p3`, `home.about.body_p4`, `home.about.body_p5`, `home.about.quote`, `home.about.quote_source`.

> **Note**: The full localised body copy for this block is not yet available. Implementers should stub the keys with the placeholder text visible in `frame.png` and mark them for content-team review. See the spec.md Dependencies checklist.

---

### C — Awards Section (`2167:9068` container, `2167:9069` header, `5005:14974` list)

#### C1 — Awards Section Header (`2167:9069`)

| Property | Value |
|----------|-------|
| width × height | 1224px × 129px |
| layout | flex col gap:16 |

Structure:
1. Caption: "Sun* annual awards 2025" — **Montserrat 700 24/32 ls:0 #FFFFFF** (verified against Figma node `2167:9070`; was incorrectly spec'd as 500 16/24 ls:0.15)
2. Divider: 1px × 1224, #2E3940
3. Frame 488 (`2167:9072`, 1224×64, flex row gap:32) — **single child** in Figma:
   - Title: "Hệ thống giải thưởng" — **Montserrat 700 57/64 ls:-0.25 #FAE287** (637 wide; node `2167:9073`)

> **Spec correction (2026-04-26)**: an earlier draft included a second child in Frame 488 — the descriptor "Các hạng mục sẽ được trao giải theo TOP những người xuất sắc nhất." Re-verifying against Figma (`get_node 2167:9072`) confirms Frame 488 has **only one child** (`2167:9073`, the "Hệ thống giải thưởng" title). The descriptor text was a documentation artefact, NOT present in the design — implementation MUST NOT render it.

#### C2 — Award Cards Grid (`5005:14974`)

Grid: 3 columns × 2 rows, 6 cards total.
- Horizontal gap: 108px (1224 − 3×336 = 216, ÷ 2 = 108)
- Vertical gap: 80px
- Card width: 336px; card height: 504–528px

Card base (e.g. `C2.1_Top Talent Award`, `2167:9075`):

| Property | Value |
|----------|-------|
| width × height | 336 × 504 (fixed content) |
| layout | flex col gap:24 |
| padding | 0 |

Sub-components (via named instances):

**C2.1.1 Picture-Award** (`I2167:9075;214:1019`): 336×336 square image with gold glow border.

| Property | Value |
|----------|-------|
| border-radius | 8px |
| border | 1px solid rgba(250,226,135,0.60) |
| box-shadow | 0 0 32px rgba(255,234,158,0.35) |

**C2.1.2 Title** (`I2167:9075;214:1021`): 336×32 — Montserrat 400 24/32 **#FFEA9E**.

**C2.1.3 Description** (`I2167:9075;214:1022`): 336×48 (2-line clamp + ellipsis) — Montserrat 400 16/24 ls:0.5 #FFFFFF.

**C2.1.4 "Chi tiết" link** (`I2167:9075;214:1023`): 88×56 button.

| Property | Value | CSS |
|----------|-------|-----|
| layout | flex row gap:4 items-center | — |
| Text | "Chi tiết" Montserrat **500** 16/24 ls:**0.15** **#FFFFFF** | — |
| Icon | 24×24 up-arrow **#FFFFFF** | — |

> **Spec correction**: earlier draft said weight 700 / ls:0.5 and color `#FFEA9E`. Verified against Figma node `I2167:9075;214:1023;186:1439` which uses **500 / 0.15 / #FFFFFF**. The card "Chi tiết" link is **white**, NOT yellow — the gold accent only applies to the card title (`#FFEA9E`). The corrected `--text-card-link` token in §Design Tokens reflects the typography; the color is documented inline because it differs from the Kudos D2.1 button (which sits on a yellow filled background and uses `#00101A` text).

**Card States:**

| State | Property | Value |
|-------|----------|-------|
| Default | transform | none; border-opacity: 60% |
| Hover | transform | translateY(-4px); box-shadow: 0 0 48px rgba(255,234,158,0.55) |
| Focus (tab) | outline | 2px solid #FFEA9E on image |
| Active | transform | translateY(-2px) |

All 6 cards use the **same** structure; only title, description, image, and target slug differ:

| Card | ID | Title | Slug |
|------|-----|-------|------|
| Top Talent | `2167:9075` | Top Talent | `#top-talent` |
| Top Project | `2167:9076` | Top Project | `#top-project` |
| Top Project Leader | `2167:9077` | Top Project Leader | `#top-project-leader` |
| Best Manager | `2167:9079` | Best Manager | `#best-manager` |
| Signature 2025 - Creator | `2167:9080` | Signature 2025 - Creator | `#signature-2025-creator` |
| MVP (Most Valuable Person) | `2167:9081` | MVP | `#mvp` |

All cards navigate to `/awards-information{slug}`.

---

### D — Sun* Kudos Promo Block (`3390:10349`)

| Property | Value |
|----------|-------|
| **Node ID** | `3390:10349` |
| width × height | 1224px × 500px |
| layout | flex col, gap:10 |
| inner content width | 1120px (group `I3390:10349;313:8415`) |

**Background** (`I3390:10349;313:8416` — `MM_MEDIA_Kudos Background`): 1120×500, decorative gradient + KUDOS asset image, border-radius 8–24px (verified during implementation).

**D2 Content** (`I3390:10349;313:8419` — 457×408 at x:260 relative, flex col gap:32):

- "Phong trào ghi nhận" kicker (**Montserrat 700 24/32 ls:0 #FFFFFF** — verified against Figma node `I3390:10349;313:8421`; was incorrectly spec'd as 500 16/24 ls:0.15)
- "Sun\* Kudos" title (Montserrat 700 57/64 ls:-0.25 #FFEA9E)
- Description paragraph (**Montserrat 700 16/24 ls:0.5 #FFFFFF**, 457×192 — verified against Figma node `I3390:10349;313:8423`; was incorrectly spec'd as weight 400). Full VN source copy from the Figma text run:
  > **ĐIỂM MỚI CỦA SAA 2025** Hoạt động ghi nhận và cảm ơn đồng nghiệp - lần đầu tiên được diễn ra dành cho tất cả Sunner. Hoạt động sẽ được triển khai vào tháng 11/2025, khuyến khích người Sun\* chia sẻ những lời ghi nhận, cảm ơn đồng nghiệp trên hệ thống do BTC công bố. Đây sẽ là chất liệu để Hội đồng Heads tham khảo trong quá trình lựa chọn người đạt giải.

  The first 5 words "**ĐIỂM MỚI CỦA SAA 2025**" are rendered **bolder or in small-caps** (font-weight 700 or style-run override) to draw attention — this is **a run inside the same paragraph**, NOT a separate `<p>` or semantic kicker. In i18n, encode this by wrapping the emphasis in markup (e.g. `<strong>ĐIỂM MỚI CỦA SAA 2025</strong> Hoạt động...`) and rely on `next-intl`'s rich-text support to render it.
- **D2.1 "Chi tiết" button** (`I3390:10349;313:8426` — 127×56, yellow filled):
  - bg: `#FFEA9E`, border-radius: 8, padding 16×24, gap:8
  - text: "Chi tiết" **Montserrat 700 16/24** `#00101A` (smaller than hero CTAs because the pill is only 127×56; the 127-wide width fits ~52px of 16px text + 24px icon + 8px gap + 48px padding ≈ 132px). Icon: 24×24 up-arrow `#00101A`.
  - States inherit the shared `<HeroCtaButton>` state model (normal=outlined, hover=yellow-filled) — but because this button is rendered in **hover / default filled** state in the design, its "at-rest" styling mirrors the hover/filled yellow. This is a separate `<KudosCtaButton>` or a `<HeroCtaButton size="sm" variant="filled">` (pick one during implementation; the former is simpler).

**KUDOS brand mark** (`MM_MEDIA_Logo/Kudos`, `I3390:10349;329:2948`): 364×72, positioned in the right half of the block. This is **NOT pure typography** — it is a composite **logo asset** (SVG or raster) consisting of:
- Red/orange stylised "S" mark (Sun\* brand lockup variant)
- Gold "KUDOS" wordmark next to it

The Figma font stamp on this node reports SVN-Gotham 400 96.16px / lh:24.04 / ls:-13% as the baseline font of the wordmark layer, but in the live implementation this block MUST be rendered as a **static image asset** (e.g. `/public/assets/home/kudos-logomark.svg`) — NOT reconstructed from live text — because:
1. `SVN-Gotham` is not a licensed web font and MUST NOT be loaded at runtime.
2. The red "S" is part of the Sun\* brand lockup and needs the exact vector paths.

Aria: render inside a `<div role="img" aria-label="Sun* Kudos logo">` with the decorative SVG/image inside.

---

### 6 — Widget Button (`5022:15169`)

Floating quick-action button, positioned with `position: fixed`.

| Property | Value | CSS |
|----------|-------|-----|
| width × height | 106px × 64px (pill) | — |
| background | #FFEA9E | `background: var(--color-cta-bg)` |
| border-radius | 100px | `border-radius: var(--radius-widget)` |
| padding | 16px | — |
| display | flex row gap:8 items-center | — |
| position | fixed bottom ~64px right ~32px (desktop) | `position: fixed; bottom: 96px; right: 32px; z-index: 20` |
| Icon (left) | `icon viết kudos` — pencil SVG 24×24 #00101A | — |
| Separator | "/" character | Montserrat 700 24/24 #00101A |
| Icon (right) | `icon thể lệ saa` — SAA logo SVG 24×24 | — |
| box-shadow | 0 4px 12px rgba(0,0,0,0.25) | `box-shadow: var(--shadow-widget)` |

**On click**: opens quick-action menu (exact destinations TBD — flagged in SCREENFLOW.md).

**States**: same color progression as CTA buttons (hover/active/focus).

---

### 7 — Footer (`5001:14800`)

| Property | Value |
|----------|-------|
| **Node ID** | `5001:14800` |
| width | 1512px |
| padding | 40px 144px (inherits Login-style) |
| border-top | 1px solid #2E3940 |
| display | flex row justify-between items-center | 
| position | relative (bottom of page) |

Inner structure (`Frame 488`, `I5001:14800;342:1407` — 971×64 flex row gap:80):
- `7.1 LOGO` (`I5001:14800;342:1408`): 69×64 Sun* logo (clickable → scroll top)
- `Frame 476` (`I5001:14800;342:1409` — 822×64 flex row gap:48):
  - `7.2 About SAA 2025` link (Montserrat 700 16/24 ls:0.15 #FFFFFF)
  - `7.3 Awards Information` link
  - `7.4 Sun* Kudos` link
  - `7.5 Tiêu chuẩn chung` link (`I5001:14800;1161:9487`)

Copyright (`I5001:14800;342:1413`): 275×11 at right — "Bản quyền thuộc về Sun* © 2025" (Montserrat Alternates 700 16/24 #FFFFFF).

Link states: default #FFFFFF; hover/selected text-color #FFEA9E + underline (mirror header A1.x).

---

## Component Hierarchy with Styles

```
Homepage (min-h-screen, bg:#00101A, relative)
├── A1_Header (fixed top:0 w-full h:80 bg:rgba(16,20,23,0.8) z:10)
│   ├── Logo (52×48)
│   ├── Nav: About SAA 2025 (selected) | Awards Information | Sun* Kudos
│   └── Controls: Language(108×56) | Bell(40×40) | Avatar(40×40 rounded-full)
│
├── Hero (3.5_Keyvisual, absolute inset:0 z:0 w:full h:1392)
│   ├── BG image (object-cover)
│   ├── H-gradient overlay z:1
│   └── V-gradient overlay z:1
│
├── Main (relative z:2, pt:88px, px:144, flex col gap:120)
│   │
│   ├── Frame 487 (hero content, 1224 flex col gap:40)
│   │   ├── H1 "ROOT FURTHER" (Montserrat 200px)
│   │   ├── Frame 523 (flex col gap:16)
│   │   │   ├── B1_Countdown time (flex col gap:16)
│   │   │   │   ├── B1.2 "Coming soon" (24/32 700 #FFF)
│   │   │   │   └── B1.3 (flex row gap:40) × 3 tiles (116×128 col gap:14)
│   │   │   │       └── Tile: [2-digit number Digital-Numbers 49px #FFEA9E] / [LABEL 16/24 700 0.5ls]
│   │   │   └── B2_Event Info (flex col gap:8)
│   │   │       ├── Row (flex row gap:60): Time | Location
│   │   │       └── Livestream note
│   │   └── B3_CTA (flex row gap:40)
│   │       ├── ABOUT AWARDS (276×60 bg:#FFEA9E radius:8)
│   │       └── ABOUT KUDOS (276×60 border:1 #998C5F radius:8)
│   │
│   ├── Frame 486 (1152 flex col gap:32)
│   │   ├── Group 434 "ROOT FURTHER" heading
│   │   └── B4_content — body paragraphs + quote
│   │
│   ├── Awards (flex col gap:80)
│   │   ├── C1 Header (flex col gap:16)
│   │   │   ├── Caption "Sun* annual awards 2025"
│   │   │   ├── Divider 1px #2E3940
│   │   │   └── Title row: "Hệ thống giải thưởng" (single title — no descriptor)
│   │   └── C2 Award Grid (3 cols × 2 rows gap: 108/80)
│   │       └── Card × 6 (flex col gap:24)
│   │           ├── Image 336×336 (radius:8, gold glow)
│   │           ├── Title (24/32 400 #FFEA9E)
│   │           ├── Description (16/24 400 0.5ls 2-line clamp)
│   │           └── "Chi tiết" link (88×56)
│   │
│   └── D1_Sunkudos (1224×500 background card)
│       ├── D2_Content (457×408 left-side, flex col gap:32)
│       │   ├── Kicker "Phong trào ghi nhận"
│       │   ├── Title "Sun* Kudos" (57/64 700 #FFEA9E)
│       │   ├── Description paragraph
│       │   └── D2.1 "Chi tiết" button (127×56 bg:#FFEA9E)
│       └── KUDOS watermark (SVN-Gotham 96 right side)
│
├── 6_Widget Button (position:fixed right:32 bottom:96 z:20, 106×64 bg:#FFEA9E radius:100)
│
└── 7_Footer (relative, w-full, py:40 px:144, border-top:1 #2E3940)
    ├── Frame 488 (flex row gap:80)
    │   ├── Logo 69×64
    │   └── Nav (flex row gap:48): About SAA 2025 | Awards Info | Sun* Kudos | Tiêu chuẩn chung
    └── Copyright (Montserrat Alt 700 16/24 #FFF)
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
| Header | padding: 12px 16px; hamburger menu replaces nav links; `About SAA / Awards / Kudos` collapse into slide-out drawer |
| Hero H1 "ROOT FURTHER" | `clamp(72px, 18vw, 200px)` / line-height 1 |
| Countdown | row gap:16; tile 88×96; number 40px |
| B2 Event info | stacks column; row gap:8 |
| B3 CTA | flex col gap:16; buttons full-width max-w:320 |
| B4 body | font-size 14/22; padding-x 16 |
| Awards section title | clamp(32px, 8vw, 57px) |
| Awards grid | 1 column stacked; card 100% wide; image maintains aspect-ratio 1:1 |
| D1 Kudos | background image hidden; content full-width; no watermark |
| Widget button | bottom:24 right:16, size 88×56 |
| Footer | flex col gap:16; text-align:center |

#### Tablet (768 – 1279px)

| Component | Changes |
|-----------|---------|
| Header | padding: 12px 48px |
| Hero H1 | clamp(120px, 16vw, 200px) |
| Countdown | tile 108×120; gap:24 |
| Awards grid | **2 columns** × 3 rows |
| Main content width | 100% minus 48px padding |
| Footer | padding: 40px 48px; nav gap: 32 |
| Widget button | bottom:48 right:24 |

#### Desktop (≥ 1280px)

Matches Figma reference (1512 design width). Content centered with max-width 1224px.

---

## Icon Specifications

All icons MUST be rendered as **SVG Icon Components** (not `<img>`):

| Icon | Node ID (instance) | Size | Color | Usage |
|------|--------------------|------|-------|-------|
| Up-arrow (↗) | `MM_MEDIA_Up` (child of B3.1/B3.2/C2.x.4/D2.1) | 24×24 | #00101A (on yellow) / #FFFFFF (on dark, including card "Chi tiết" links) | CTA buttons, card "Chi tiết" links |
| Bell | inside `A1.6_Notification` | 24×24 | #FFFFFF | Header notification |
| User | inside `A1.8_Button-IC` | 24×24 | #FFFFFF | Header avatar button |
| Chevron-down | inside `A1.7_Language` (reused) | 24×24 | #FFFFFF | Language selector |
| VN Flag | inside `A1.7_Language` (reused) | 20×15 | — | Language selector |
| Pencil (viết) | inside `6_Widget` | 24×24 | #00101A | Widget left icon |
| SAA logo | inside `6_Widget` | 24×24 | original SVG | Widget right icon |
| Sun* logo | `A1.1_LOGO` / `7.1_LOGO` | 52×48 / 69×64 | original SVG | Header / Footer logo |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Header nav link | color, text-decoration | 150ms | ease-in-out | Hover |
| CTA buttons (B3.1, B3.2, D2.1) | background-color, border-color | 150ms | ease-in-out | Hover/Active |
| Award card | transform, box-shadow | 200ms | ease-out | Hover/Focus |
| Language dropdown | opacity, transform | 150ms | ease-out | Toggle |
| Avatar dropdown | opacity, transform | 150ms | ease-out | Toggle |
| Widget button | transform (scale 1.05) | 150ms | ease-out | Hover |
| Countdown tile number | opacity fade on tick | 200ms | ease-in-out | Value change |
| Notification badge | scale 1 → 1.2 → 1 | 300ms | spring | New notification |

---

## Implementation Mapping

> **Note**: All raw hex values MUST be declared as CSS variables in `app/globals.css` and consumed via `var()` / Tailwind `bg-[var(--token)]` utilities (per Constitution §II).

| Design Element | Figma Node ID | Tailwind Classes (suggested) | React Component |
|----------------|---------------|------------------------------|-----------------|
| Page root | `2167:9026` | `relative min-h-screen bg-[var(--color-bg-dark)] overflow-x-hidden` | `<HomePage>` (RSC) |
| Header | `2167:9091` | `fixed top-0 w-full h-20 flex items-center justify-between px-36 bg-[var(--color-bg-header)] z-10 md:px-12 sm:px-4` | `<Header>` (reuse, add nav) |
| Header Nav | `I2167:9091;178:653` | `flex items-center gap-6` | `<HeaderNav>` (Client — needs active-link detection) |
| Nav link selected | `I2167:9091;186:1579` | `text-[var(--color-accent-gold-alt)] underline underline-offset-8 decoration-2` | `<NavLink isActive>` |
| Nav link normal | `I2167:9091;186:1593` | `text-[var(--color-text-primary)] hover:text-[var(--color-accent-gold-alt)]` | `<NavLink>` |
| Notification | `I2167:9091;186:2101` | `relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10` | `<NotificationButton>` (Client) |
| Avatar button | `I2167:9091;186:1597` | `w-10 h-10 rounded-full border border-[#998C5F] flex items-center justify-center hover:bg-white/10` | `<AvatarMenu>` (Client — dropdown) |
| Hero BG | `2167:9028` | `absolute inset-0 z-0 bg-cover bg-center` | `<HeroBackground>` (reuse `login-hero-bg` pattern) |
| Hero gradients | `2167:9029` | absolute inset-0 z-[1] (H + V) | reuse from Login |
| Hero H1 "ROOT FURTHER" | `2167:9032` | `text-[200px] leading-none tracking-[-4px] font-normal text-white sm:text-[clamp(72px,18vw,200px)]` | `<HeroTitle>` |
| Countdown | `2167:9037` | `flex flex-row gap-10` | `<Countdown targetDate={ISO}>` (Client) |
| Countdown tile | `2167:9038` | `flex flex-col gap-[14px] w-[116px] h-32 items-center` | `<CountdownTile value label>` |
| Event info | `2167:9053` | `flex flex-col gap-2` | `<EventInfo>` (RSC) |
| Hero CTA (ABOUT AWARDS / ABOUT KUDOS) — same component, 2 instances | `2167:9063` and `2167:9064` | `inline-flex items-center gap-2 w-[276px] h-[60px] px-6 py-4 rounded-lg font-bold text-[22px] leading-7 transition-colors border bg-[rgba(255,234,158,0.10)] border-[var(--color-cta-outline-border)] text-white hover:bg-[var(--color-cta-bg)] hover:text-[var(--color-cta-text)] hover:border-transparent focus-visible:outline-2 focus-visible:outline-[var(--color-cta-bg)] focus-visible:outline-offset-2` | `<HeroCtaButton href children>` (shared) |
| B4 body text | `5001:14827` | `prose prose-invert text-base leading-6 text-white max-w-[1152px]` | `<AboutBody>` |
| Awards section title | `2167:9073` | `text-[57px] leading-16 tracking-[-0.25px] font-bold text-[var(--color-accent-gold)]` | `<SectionTitle>` |
| Award card | `2167:9075-9081` | `flex flex-col gap-6 w-[336px] group` | `<AwardCard>` |
| Award card image | `I...;214:1019` | `aspect-square rounded-lg border border-[rgba(250,226,135,0.60)] shadow-[0_0_32px_rgba(255,234,158,0.35)] group-hover:shadow-[0_0_48px_rgba(255,234,158,0.55)]` | `<AwardImage>` |
| Award card grid | `5005:14974` | `grid grid-cols-3 gap-x-[108px] gap-y-20 md:grid-cols-2 sm:grid-cols-1` | `<AwardList>` |
| Chi tiết link | `I...;214:1023` | `inline-flex items-center gap-1 text-[var(--color-text-primary)] font-medium text-base leading-6 tracking-[0.15px]` | `<DetailLink>` |
| Sun* Kudos block | `3390:10349` | `relative w-full max-w-[1224px] h-[500px] rounded-xl overflow-hidden bg-[url('/assets/home/kudos-bg.png')] bg-cover` | `<KudosPromo>` |
| Kudos brand mark (right half) | `I3390:10349;329:2948` | `absolute right-8 top-1/2 -translate-y-1/2 w-[364px] h-[72px]` | `<KudosLogomark>` — renders `/assets/home/kudos-logomark.svg` |
| Kudos CTA "Chi tiết" | `I3390:10349;313:8426` | `inline-flex items-center gap-2 w-[127px] h-14 px-6 py-4 bg-[var(--color-cta-bg)] hover:bg-[var(--color-cta-bg-hover)] active:bg-[var(--color-cta-bg-active)] rounded-lg text-[var(--color-cta-text)] font-bold text-base leading-6` | `<KudosCtaButton>` (dedicated — smaller text size; always-filled default state) |
| Footer | `5001:14800` | `flex items-center justify-between w-full px-36 py-10 border-t border-[var(--color-divider)]` | `<Footer>` (extend from Login) |
| Widget button | `5022:15169` | `fixed right-8 bottom-24 w-[106px] h-16 px-4 flex items-center gap-2 bg-[var(--color-cta-bg)] rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.25)] z-20 hover:scale-105 transition-transform` | `<WidgetButton>` (Client) |

---

## Notes

- `<Header>` and `<Footer>` components already exist from the Login screen; they MUST be extended with menu/nav support rather than duplicated. Add an `isActive` prop to nav links so the selected state renders with `#FFEA9E` + underline.
- The hero BG image, H-gradient, and V-gradient reuse the `.login-hero-bg` CSS pattern — factor these into a shared `.hero-bg` class in `globals.css`.
- **Countdown target date** MUST come from an env variable (e.g. `NEXT_PUBLIC_SAA_EVENT_START`) as ISO-8601. The server MUST render initial HTML with the pre-calculated values; the client then re-hydrates and ticks every 60s.
- **Countdown font swap** — Figma uses `Digital Numbers` (Style-7 proprietary, not free-for-commercial-use). The web implementation uses **DSEG7-Classic Bold** ([keshikan/DSEG](https://github.com/keshikan/DSEG), SIL Open Font License) as the closest open-source 7-segment LCD equivalent. Font file: `public/fonts/DSEG7Classic-Bold.woff2` (5 KB), license preserved at `public/fonts/DSEG-LICENSE.txt`. Loaded via `next/font/local` in `app/layout.tsx` and exposed as `var(--font-digital)`. Visual difference vs. the original Figma font is negligible at the 49 px display size — both are uppercase-only, monospace, 7-segment style with rounded corners.
- All color contrasts verified WCAG 2.1 AA: #FFFFFF on #00101A = 18.7:1 ✓; #FFEA9E on #00101A = 14.8:1 ✓; #00101A on #FFEA9E = 14.8:1 ✓.
- Icons MUST live under `components/icons/` as individual React components returning `<svg>` elements (no raw SVG files or `<img>` tags).
