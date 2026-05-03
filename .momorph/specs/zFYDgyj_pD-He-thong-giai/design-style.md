# Design Style: Hệ thống giải thưởng SAA 2025 (Awards Information)

**Frame ID**: `zFYDgyj_pD` (root node `313:8436`)
**Frame Name**: `Hệ thống giải`
**Figma Link**: https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C?node-id=zFYDgyj_pD
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Extracted At**: 2026-04-26
**Frame Dimensions**: 1440 × 6410 px (single long-scroll desktop frame)
**Reference Image**: [assets/frame.png](./assets/frame.png)

---

## Design Tokens

> Tokens follow the constitution rule (Principle II): all values MUST be declared as CSS variables and consumed via Tailwind v4 utility classes — never hard-coded inside components.

### Colors

| Token Name                    | Hex Value                                         | Opacity | Usage                                                                |
| ----------------------------- | ------------------------------------------------- | ------- | -------------------------------------------------------------------- |
| `--color-bg-page`             | `#00101A`                                         | 100%    | Page background (root frame)                                         |
| `--color-bg-page-deep`        | `#001320`                                         | 0–100%  | Cover-gradient stop (only inside the keyvisual fade)                 |
| `--color-bg-header`           | `#101417`                                         | 80%     | Sticky header background (`rgba(16, 20, 23, 0.8)`)                   |
| `--color-accent-primary`      | `#FFEA9E`                                         | 100%    | "Details-Text-Primary-1" — section headings, active nav, CTA fill    |
| `--color-accent-glow`         | `#FAE287`                                         | 100%    | Glow component of award-image and active-nav text shadows            |
| `--color-text-on-dark`        | `#FFFFFF`                                         | 100%    | Body text, inactive nav labels, value figures, captions              |
| `--color-divider`             | `#2E3940`                                         | 100%    | "Details-Divider" — 1 px section/list/footer separators              |
| `--color-shadow-glow`         | `rgba(250, 226, 135, 1)` / `#FAE287`              | 100%    | Glow color used in `box-shadow`/`text-shadow` (see effects below)    |
| `--color-shadow-drop`         | `rgba(0, 0, 0, 0.25)`                             | 25%     | Drop shadow under award images                                       |

**Notes**
- The page is dark-mode only on this frame. Light-mode tokens are out of scope.
- `--color-accent-primary` (`#FFEA9E`) is the brand-yellow used for ALL prominent text and the CTA. It is NOT used for body copy.
- The keyvisual cover applies `linear-gradient(0deg, #00101A -4.23%, rgba(0, 19, 32, 0.00) 52.79%)` over the photographic banner.

### Typography

All text on this frame uses **Montserrat 700 (Bold)**. There are no other weights or families on the frame.

| Token Name                | Font Family | Size | Weight | Line Height | Letter Spacing | Usage                                               |
| ------------------------- | ----------- | ---- | ------ | ----------- | -------------- | --------------------------------------------------- |
| `--text-display-1`        | Montserrat  | 57px | 700    | 64px        | -0.25px        | Page title "Hệ thống giải thưởng SAA 2025" (yellow) |
| `--text-headline-1`       | Montserrat  | 36px | 700    | 44px        | 0              | Award value figure ("7.000.000 VNĐ" etc.)           |
| `--text-headline-2`       | Montserrat  | 24px | 700    | 32px        | 0              | Card title, "Số lượng giải thưởng:", "Giá trị …:"   |
| `--text-subtitle-1`       | Montserrat  | 24px | 700    | 32px        | 0              | Eyebrow "Sun* Annual Awards 2025"                   |
| `--text-body-1`           | Montserrat  | 16px | 700    | 24px        | 0.5px          | Award description (justified)                       |
| `--text-label-1`          | Montserrat  | 14px | 700    | 20px        | 0.25px         | Side-menu nav items (active + inactive)             |
| `--text-caption-1`        | Montserrat  | 14px | 700    | 20px        | 0.10px         | "cho mỗi giải thưởng" caption                       |

**Special text effect — active nav label & award titles:**
- `text-shadow: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287;`

### Spacing

| Token Name        | Value | Usage                                                 |
| ----------------- | ----- | ----------------------------------------------------- |
| `--spacing-1`     | 4px   | Icon-to-label inside nav-item                         |
| `--spacing-2`     | 8px   | CTA inner gap (icon ↔ label inside D2.1 Chi tiết)     |
| `--spacing-4`     | 16px  | Default block gap (title stack, nav padding, value row) |
| `--spacing-6`     | 24px  | Inter-block gap inside an award card column           |
| `--spacing-8`     | 32px  | D.x card vertical gap (title-block ↔ qty ↔ value)     |
| `--spacing-10`    | 40px  | Image ↔ content gap inside an award row               |
| `--spacing-20`    | 80px  | Side-menu ↔ list gap; gap between adjacent award rows |
| `--spacing-24`    | 96px  | Main vertical container padding (top/bottom)          |
| `--spacing-30`    | 120px | Gap between major page sections (hero / title / B / Sunkudos) |
| `--spacing-36`    | 144px | Main container horizontal padding (1440 grid)         |

### Border & Radius

| Token Name           | Value                  | Usage                                              |
| -------------------- | ---------------------- | -------------------------------------------------- |
| `--radius-xs`        | 4px                    | Inactive nav item hover surface, CTA button        |
| `--radius-md`        | 16px                   | Award content panel (right column)                 |
| `--radius-lg`        | 24px                   | Award image frame (`D.x.1_Picture-Award`)          |
| `--border-width`     | 1px                    | Section dividers, footer top border                |
| `--border-width-img` | 0.955px                | Award image border (rounded to 1 px in CSS)        |
| `--border-color-accent` | `#FFEA9E`           | Active nav bottom border, image border             |
| `--border-color-divider` | `#2E3940`           | All horizontal rules between blocks                |

### Shadows & Effects

| Token Name              | Value                                                            | Usage                                              |
| ----------------------- | ---------------------------------------------------------------- | -------------------------------------------------- |
| `--shadow-award-image`  | `0 4px 4px 0 rgba(0,0,0,0.25), 0 0 6px 0 #FAE287`                | Glow under award images (`mix-blend-mode: screen`) |
| `--text-shadow-active`  | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287`                    | Active nav label, yellow titles                    |
| `--filter-glow-active`  | `drop-shadow(0 0 1px rgba(250, 226, 135, 0.5))`                  | Active side-nav item outer glow (haloes SVG icon + text glyphs alpha) — single 1px drop-shadow at 50% alpha per stakeholder feedback 2026-04-27 (initial draft was 6+2px @ 100%; iterated down to ~1/3, then softened color) |
| `--backdrop-blur-card`  | `blur(32px)`                                                     | Right-column award content panel                   |

---

## Layout Specifications

### Container

| Property            | Value         | Notes                                                                  |
| ------------------- | ------------- | ---------------------------------------------------------------------- |
| `width`             | 1440 px       | Desktop reference width — Figma frame width                            |
| `padding-block`     | 96 px         | Top + bottom padding of "Bìa" main flex frame                          |
| `padding-inline`    | 144 px        | Left + right padding of "Bìa" main flex frame                          |
| Inner content width | 1152 px       | 1440 − 2 × 144                                                         |
| `display`           | flex          | `flex-direction: column`, `align-items: flex-start`                    |
| `gap`               | 120 px        | Between top-level sections (Title `A` → Awards `B` → Sunkudos `D1`)    |

### Header (shared instance — id `313:8440`)

| Property         | Value                                |
| ---------------- | ------------------------------------ |
| height           | 80 px                                |
| padding          | 12px 144px                           |
| background       | `rgba(16, 20, 23, 0.8)` (`#101417` 80%) — sits on top of keyvisual    |
| flex             | row, `space-between`, `align: center`, gap 238px between left/right groups |
| layered          | `z-index: 1`, absolute over the keyvisual cover gradient              |

### Keyvisual (`3_Keyvisual`, id `313:8437`)

| Property         | Value                                                   |
| ---------------- | ------------------------------------------------------- |
| width × height   | 1440 × 547 px                                           |
| position         | `top: 80px` (under the header)                          |
| Cover gradient   | `linear-gradient(0deg, #00101A -4.23%, rgba(0,19,32,0) 52.79%)` overlay (1440×627 rectangle id `313:8439`) |
| accessibility    | `alt="Keyvisual Sun* Annual Award 2025"`                |

#### ROOT FURTHER mark overlay (inside keyvisual)

The "ROOT FURTHER" brand logo (same asset as the Homepage hero: `/assets/home/hero-root-further.png`, 1224×200 px source) is rendered **inside** the keyvisual area, overlaid on the background image and gradient. It is rendered via the shared `<RootFurtherMark size="xl" />` component.

| Property         | Value                                                         |
| ---------------- | ------------------------------------------------------------- |
| Asset            | `/assets/home/hero-root-further.png` (1224 × 200 px source)  |
| Component        | `<RootFurtherMark size="xl" />`                               |
| Horizontal pos   | Left-aligned, same padding as main content (`px-4 md:px-12 xl:px-36`) |
| Vertical pos     | ~120 px from the top of the keyvisual container (`pt-[120px]`) |
| alt text         | "ROOT FURTHER"                                                |
| Accessibility    | Visible (`role="img"`) — not hidden                           |

### Footer (shared instance — id `354:4323`)

| Property         | Value                                       |
| ---------------- | ------------------------------------------- |
| width            | 1440 px                                     |
| padding          | 40px 90px                                   |
| border-top       | 1px solid `#2E3940`                         |
| flex             | row, `space-between`, `align: center`       |
| top-of-frame Y   | 6266 px (frame total height 6410 px)        |

### Layout Structure (ASCII)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Page (W: 1440, bg: #00101A)                                             │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  Header (H:80, padding:12 144, bg:#101417/80, z:1, sticky overlay)  │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  Keyvisual (W:1440, H:547) + cover gradient (W:1440, H:627)        │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌── Bìa (padding: 96 144, gap: 120) ─────────────────────────────────┐  │
│  │                                                                    │  │
│  │  ┌── A_Title (1152, gap: 16, vertical) ────────────────────────┐   │  │
│  │  │  "Sun* Annual Awards 2025" (24/32, white, centered)          │   │  │
│  │  │  ─── 1px #2E3940 ─────────────────────────────────────────── │   │  │
│  │  │  "Hệ thống giải thưởng SAA 2025" (57/64, #FFEA9E, centered)  │   │  │
│  │  └──────────────────────────────────────────────────────────────┘   │  │
│  │                                                                    │  │
│  │  ┌── B_Hệ thống giải thưởng (1152 × 4833, flex row, gap 80) ──┐    │  │
│  │  │ ┌── C_Menu list (178 × 448, sticky) ─┐  ┌── D_Awards (853) ─────────┐ │  │
│  │  │ │ C.1 Top Talent       [active]       │  │  D.1 [img◀ ── content▶]  │ │  │
│  │  │ │ C.2 Top Project                     │  │  ── 1px #2E3940 ──        │ │  │
│  │  │ │ C.3 Top Project Leader              │  │  D.2 [content◀ ── img▶]  │ │  │
│  │  │ │ C.4 Best Manager                    │  │  ── 1px #2E3940 ──        │ │  │
│  │  │ │ C.5 Signature 2025                  │  │  D.3 [img◀ ── content▶]  │ │  │
│  │  │ │ C.6 MVP                             │  │  ── 1px #2E3940 ──        │ │  │
│  │  │ │                                     │  │  D.4 [content◀ ── img▶]  │ │  │
│  │  │ │                                     │  │  ── 1px #2E3940 ──        │ │  │
│  │  │ │                                     │  │  D.5 [img◀ ── content▶]  │ │  │
│  │  │ │                                     │  │  ── 1px #2E3940 ──        │ │  │
│  │  │ │                                     │  │  D.6 [content◀ ── img▶]  │ │  │
│  │  │ └─────────────────────────────────────┘  └───────────────────────────┘ │  │
│  │  └────────────────────────────────────────────────────────────────┘ │  │
│  │                                                                    │  │
│  │  ┌── D1_Sunkudos (1152 × 500, two-column GROUP) ────────────────────┐ │  │
│  │  │  ┌── D2_Content (W:470) ──┐         ┌── Kudos image + logo ──┐    │ │  │
│  │  │  │  Eyebrow                │         │  ~272 × 219 image       │   │ │  │
│  │  │  │  Title "Sun* Kudos"     │         │  + Group 380 (KUDOS    │   │ │  │
│  │  │  │  Description            │         │    logo overlay)        │   │ │  │
│  │  │  │  Button "Chi tiết" ───▶ │         │                         │   │ │  │
│  │  │  └─────────────────────────┘         └─────────────────────────┘   │ │  │
│  │  └─────────────────────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌── Footer (H:auto, padding: 40 90, border-top: 1px #2E3940) ───────┐   │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

### Award row (D.1–D.6) sub-structure — alternating (zig-zag) pattern

The six award rows alternate the **horizontal direction** of their inner row:

| Row  | Wrapper Frame | Direction       | Picture column   | Content column   |
| ---- | ------------- | --------------- | ---------------- | ---------------- |
| D.1  | Frame 506     | **image LEFT**  | left (336 × 336) | right (480 wide) |
| D.2  | Frame 507     | **image RIGHT** | right (336 × 336)| left (480 wide)  |
| D.3  | Frame 506     | **image LEFT**  | left             | right            |
| D.4  | Frame 507     | **image RIGHT** | right            | left             |
| D.5  | Frame 506     | **image LEFT**  | left             | right            |
| D.6  | Frame 507     | **image RIGHT** | right            | left             |

Both wrappers are `display: flex; flex-direction: row; gap: 40px;` — the only difference is the source order of `Picture-Award` and `Content`. In CSS this is most easily implemented by giving every odd-indexed card (`D.2`, `D.4`, `D.6`) `flex-direction: row-reverse`, OR by passing a `direction` prop to a single `<AwardCard />` component.

```
Image-LEFT pattern (D.1, D.3, D.5 — Frame 506)        Image-RIGHT pattern (D.2, D.4, D.6 — Frame 507)
┌── D.x (W:856, gap: 80 between rows) ───────┐         ┌── D.x (W:856, gap: 80 between rows) ───────┐
│  ┌── Frame 506 (W:856, H:550, gap:40) ──┐  │         │  ┌── Frame 507 (W:856, H:550, gap:40) ──┐  │
│  │ ┌── Picture-Award ─┐ ┌── Content ──┐ │  │         │  │ ┌── Content ──┐ ┌── Picture-Award ─┐ │  │
│  │ │  336 × 336       │ │  W:480       │ │  │         │  │ │  W:480       │ │  336 × 336       │ │  │
│  │ │  glow + screen   │ │  blur, gap:32│ │  │         │  │ │  blur, gap:32│ │  glow + screen   │ │  │
│  │ │                  │ │              │ │  │         │  │ │              │ │                  │ │  │
│  │ │  Awards-Name     │ │  Title       │ │  │         │  │ │  Title       │ │  Awards-Name     │ │  │
│  │ │  overlay         │ │  Description │ │  │         │  │ │  Description │ │  overlay         │ │  │
│  │ │                  │ │  ── 1px ──   │ │  │         │  │ │  ── 1px ──   │ │                  │ │  │
│  │ │                  │ │  Số lượng    │ │  │         │  │ │  Số lượng    │ │                  │ │  │
│  │ │                  │ │  ── 1px ──   │ │  │         │  │ │  ── 1px ──   │ │                  │ │  │
│  │ │                  │ │  Giá trị     │ │  │         │  │ │  Giá trị     │ │                  │ │  │
│  │ └──────────────────┘ └──────────────┘ │  │         │  │ └──────────────┘ └──────────────────┘ │  │
│  └───────────────────────────────────────┘  │         │  └───────────────────────────────────────┘  │
│  ── 1px #2E3940 between adjacent cards ──── │         │  ── 1px #2E3940 between adjacent cards ──── │
└─────────────────────────────────────────────┘         └─────────────────────────────────────────────┘
```

**Visual continuity rule**: regardless of direction, the **Content** column is always rendered with the same internal vertical order (Title → Description → Divider → Quantity → Divider → Value), and the **Picture-Award** column always uses the same 336 × 336 frame with the glow shadow and overlaid `Awards-Name`. Only the horizontal placement of those two columns flips.

---

## Component Style Details

### 1. Page Title — `A_Title hệ thống giải thưởng`

| Property        | Value             | CSS                                                |
| --------------- | ----------------- | -------------------------------------------------- |
| **Node ID**     | `313:8453`        | —                                                  |
| width           | 1152px            | `width: 100%` (within container)                   |
| layout          | flex column, gap 16px, align flex-start | `flex flex-col gap-4 items-start`                  |

**Eyebrow text** (`313:8454`) — `Sun* Annual Awards 2025`

| Property | Value | CSS |
| -------- | ----- | --- |
| typography | `--text-subtitle-1` | `font-bold text-2xl/8 tracking-normal` |
| color | `#FFFFFF` | `text-white` |
| text-align | center | `text-center` |
| width | 1152px | full row |

**Divider** (`313:8455`)

| Property | Value | CSS |
| -------- | ----- | --- |
| height | 1px | `h-px` |
| background | `#2E3940` | `bg-[--color-divider]` |

**Page title** (`313:8457`) — `Hệ thống giải thưởng SAA 2025`

| Property | Value | CSS |
| -------- | ----- | --- |
| typography | `--text-display-1` (Montserrat 57/700/64) | `font-bold text-[57px] leading-[64px] tracking-[-0.25px]` |
| color | `#FFEA9E` | `text-[--color-accent-primary]` |
| text-align | center | `text-center` |
| height | 64px | — |

---

### 2. Side Navigation — `C_Menu list`

| Property        | Value                                       | CSS                                                     |
| --------------- | ------------------------------------------- | ------------------------------------------------------- |
| **Node ID**     | `313:8459`                                  | —                                                       |
| width           | 178px                                       | `w-[178px] sticky top-[112px]`                          |
| height          | 448px (auto by content; 6 items × varies)   | —                                                       |
| layout          | flex column, gap 16px                       | `flex flex-col gap-4 items-start`                       |
| position        | sticky on scroll within `B`                 | `sticky top-[112px]` (header 80 + 32 visual gap)        |
| **Sticky parent constraint** | NO ancestor between this `<aside>` and `<html>` may use `overflow: hidden` / `overflow-x: hidden` / `overflow-y: hidden`. The page root wrapper must use **`overflow-x-clip`** (clip preserves sticky; hidden creates an implicit scroll container that breaks it). | see plan.md "Sticky-positioning gotcha" |

#### Nav Item — Active (e.g. `C.1`)

| Property        | Value (Node `313:8460`)                                | CSS                                                       |
| --------------- | ------------------------------------------------------ | --------------------------------------------------------- |
| width           | content-driven (≈ 139 px for "Top Talent")             | `w-fit` (no `w-[...]` — let label drive)                  |
| height          | 56 px (matches inactive item — meets 48 × 48 touch target) | `h-14`                                                |
| padding         | 16px                                                   | `p-4`                                                     |
| gap             | 4px                                                    | `gap-1`                                                   |
| display         | flex row, `align-items: center`                        | `flex items-center`                                       |
| border-bottom   | 1px solid `#FFEA9E`                                    | `border-b border-[--color-accent-primary]`                |
| background      | none                                                   | —                                                         |
| icon            | 24×24                                                  | `w-6 h-6`                                                 |
| label typography | Montserrat 14/700, line 20, letter 0.25px             | `font-bold text-sm leading-5 tracking-[0.25px]`           |
| label color     | `#FFEA9E`                                              | `text-[--color-accent-primary]`                           |
| label text-shadow | `0 4px 4px rgba(0,0,0,.25), 0 0 6px #FAE287`         | `[text-shadow:--text-shadow-active]`                      |
| **outer glow (icon + label)** | `drop-shadow(0 0 1px rgba(250, 226, 135, 0.5))` — subtle yellow halo around the rendered shape of the SVG icon AND the text glyphs (per the 2026-04-27 stakeholder reference image, iterated to a faint 1px / 50%-alpha pass). Implemented as a CSS `filter` on the `<a>`; `drop-shadow` follows the alpha channel of children (icon strokes + text glyphs), unlike `box-shadow` which traces the bounding box. | `[filter:var(--filter-glow-active)]` |

#### Nav Item — Inactive (e.g. `C.2`)

| Property        | Value (Node `313:8461`)                  | CSS                                                       |
| --------------- | ---------------------------------------- | --------------------------------------------------------- |
| width           | 146px                                    | `w-[146px]` (or fluid)                                    |
| height          | 56px                                     | `h-14`                                                    |
| padding         | 16px                                     | `p-4`                                                     |
| gap             | 4px                                      | `gap-1`                                                   |
| border-radius   | 4px                                      | `rounded`                                                 |
| background      | transparent                              | —                                                         |
| label color     | `#FFFFFF`                                | `text-white`                                              |
| label typography | Montserrat 14/700/20, letter 0.25px     | `font-bold text-sm leading-5 tracking-[0.25px]`           |

**States:** *(locked-in defaults — 2026-04-26)*

| State    | Property         | Value                                                                |
| -------- | ---------------- | -------------------------------------------------------------------- |
| Default  | color, border    | white text, no border-bottom                                         |
| Hover    | background       | `rgba(255, 234, 158, 0.08)` (subtle yellow tint)                     |
| Active   | color, border-b, text-shadow | `#FFEA9E`, `1px solid #FFEA9E`, glow shadow                  |
| Focus    | outline          | `2px solid #FFEA9E`, `outline-offset: 2px`                           |
| Disabled | n/a              | (always enabled — anchor to existing section)                        |

---

### 3. Award Card — `D.x` (Top Talent / Top Project / …)

> Layout repeats six times **with alternating horizontal direction** (zig-zag — see § "Award row sub-structure" above). Only content data and direction differ.

| Property        | Value (Node `313:8467` for D.1)             | CSS                                                       |
| --------------- | ------------------------------------------- | --------------------------------------------------------- |
| **Node ID**     | `313:8467` (D.1), `313:8468` (D.2), `313:8469` (D.3), `313:8470` (D.4), `313:8471` (D.5), `313:8510` (D.6) | — |
| width           | 856px                                       | `w-full max-w-[856px]`                                    |
| height          | 631px (auto with description content)       | —                                                         |
| layout          | flex column, gap 80px (between cards via parent) | `flex flex-col`                                      |
| inner row — odd cards (D.1/D.3/D.5)  | Frame 506: `flex flex-row gap-10 items-start` (image LEFT, content RIGHT) | `flex flex-row gap-10 items-start` |
| inner row — even cards (D.2/D.4/D.6) | Frame 507: `flex flex-row-reverse gap-10 items-start` (image RIGHT, content LEFT) | `flex flex-row-reverse gap-10 items-start` |
| inner row size  | 856 × 550px                                 | —                                                         |
| trailing divider | 853×1px, `#2E3940` (between cards only)    | `border-b border-[--color-divider]`                       |

> Implementation pattern: `<AwardCard direction={index % 2 === 0 ? 'image-left' : 'image-right'} />` — drives a single Tailwind class swap (`flex-row` ↔ `flex-row-reverse`). Children DOM order stays the same; only the visual placement flips.

#### 3a. Award Image — `D.x.1_Picture-Award`

| Property            | Value (Node `I313:8467;214:2525`)                         | CSS                                                              |
| ------------------- | --------------------------------------------------------- | ---------------------------------------------------------------- |
| width × height      | 336 × 336 px                                              | `w-[336px] h-[336px]`                                            |
| display             | flex column, items center, justify center                 | `flex flex-col items-center justify-center`                      |
| padding             | 149.864px 53.455px (centers overlay name)                 | `pt-[150px] pb-[150px] px-[53px]`                                |
| box-shadow          | `0 4px 4px 0 rgba(0,0,0,.25), 0 0 6px 0 #FAE287`          | `shadow-[--shadow-award-image]`                                  |
| mix-blend-mode      | screen                                                    | `mix-blend-screen`                                               |
| inner Rectangle border | 0.955px solid `#FFEA9E`                                | `ring-[1px] ring-[--color-accent-primary]`                       |
| inner Rectangle radius | 24px                                                   | `rounded-3xl`                                                    |
| inner Rectangle bg | award image (cover, no-repeat)                             | `bg-cover bg-center`                                             |
| overlay name        | `Awards-Name` (instance, e.g. `I313:8467;214:2525;214:666`) — **NOT live text**: the instance wraps a single child `Rectangle` (e.g. `I313:8467;214:2525;214:666;10:951`) whose only style is `background: url(<image>)`. The visible "TOP TALENT" / "TOP PROJECT" / etc. wording is **baked into the raster image asset**, so the implementation MUST render it as a separate `<img>` (or background image), not as styled HTML text. Per-card overlay sizes vary: D.1 = 221 × 35 (one line), D.2 = 232 × 35, D.3 = 232 × 64 (two-line, "TOP PROJECT LEADER"). | implement as an `<img>` overlaid on the award image, absolutely positioned centered, with `alt` set to the award title |

#### 3b. Award Content Panel — `D.x.2_Content`

| Property            | Value (Node `I313:8467;214:2526`)                         | CSS                                                              |
| ------------------- | --------------------------------------------------------- | ---------------------------------------------------------------- |
| flex                | column, items flex-start                                  | `flex flex-col items-start`                                      |
| gap                 | 32px                                                      | `gap-8`                                                          |
| border-radius       | 16px                                                      | `rounded-2xl`                                                    |
| backdrop-filter     | blur(32px)                                                | `backdrop-blur-[32px]`                                           |
| width               | 480px (max content) — fills remaining 856 − 336 − 40      | `w-[480px]`                                                      |

**Children of `D.x.2_Content` (top → bottom):**

1. Title + Description block (`I313:8467;214:2527`, 480 × 248, flex column gap 24px)
   - Title row (`214:2528`, gap 16px, height 32px): icon 24×24 + Title text
     - Title text (`214:2530`): Montserrat 24/700/32, color `#FFEA9E`
   - Description (`214:2531`): width 480, Montserrat 16/700/24, letter 0.5px, color `#FFFFFF`, `text-align: justify`
2. Divider (`214:2532`, 480 × 1, `#2E3940`)
3. Quantity row (`214:2533`, 433 × 44, flex row gap 16px):
   - "Số lượng" frame (`214:3552`, 107 × 44, gap 8): diamond icon + label
   - Diamond icon (`214:2535`, 24 × 24)
   - Label (`214:2536`): Montserrat 24/700/32, color `#FFEA9E`
   - Trailing values (e.g. `10`, `Đơn vị` / `02`, `Tập thể`) — same yellow 24/700 token
4. Divider (`214:2539`, 480 × 1, `#2E3940`)
5. Value block (`214:2540`, 480 × 128, flex column gap 24):
   - Title row (`214:2542`, 274 × 32, gap 16): license icon + "Giá trị giải thưởng:" 24/700/32 yellow
   - Value figure (`214:2545` → `214:2546`, 281 × 44): "7.000.000 VNĐ" Montserrat 36/700/44 white
   - Caption (`214:2547`, 478 × 20): "cho mỗi giải thưởng" Montserrat 14/700/20, letter 0.1px, white

**Per-card content reference (read-only display values):**

| Card | Node ID    | Wrapper   | Direction   | Title (VN)                       | Quantity            | Value (VNĐ)                                      |
| ---- | ---------- | --------- | ----------- | -------------------------------- | ------------------- | ------------------------------------------------ |
| D.1  | `313:8467` | Frame 506 | image-LEFT  | Top Talent                       | 10 — Đơn vị         | 7.000.000 (cho mỗi giải thưởng)                  |
| D.2  | `313:8468` | Frame 507 | image-RIGHT | Top Project                      | 02 — Tập thể        | 15.000.000 (cho mỗi giải thưởng)                 |
| D.3  | `313:8469` | Frame 506 | image-LEFT  | Top Project Leader               | 03 — Cá nhân        | 7.000.000                                        |
| D.4  | `313:8470` | Frame 507 | image-RIGHT | Best Manager                     | 01 — Cá nhân        | 10.000.000                                       |
| D.5  | `313:8471` | Frame 506 | image-LEFT  | Signature 2025 - Creator         | 01                  | 5.000.000 (cá nhân) / 8.000.000 (tập thể)        |
| D.6  | `313:8510` | Frame 507 | image-RIGHT | MVP (Most Valuable Person)       | 01                  | 15.000.000                                       |

---

### 4. Sun* Kudos Promo Block — `D1_Sunkudos`

| Property        | Value (Node `335:12023`)                  | CSS                                                         |
| --------------- | ----------------------------------------- | ----------------------------------------------------------- |
| width × height  | 1152 × 500 px                             | `w-full max-w-[1152px] h-[500px]`                           |
| **layout**      | **Two-column visual** (text-block LEFT, image+logo RIGHT) — Figma authored as a `GROUP` with absolute children, but the implementation MUST be a flex row | `flex flex-row items-center justify-between` |
| inner gap       | ~ 64–96 px (auto from `justify-between` over 1152 wide); the Figma source places `D2_Content` at x ≈ 65–535 and the image at x ≈ 757–1028 (within the 1152-wide block) | — |

> The Figma node `335:12023` is a `GROUP`, not an auto-layout frame, so its `flex-direction: column` style is incidental and MUST NOT be honoured. Re-author as a horizontal flex row on the implementation side.

#### 4a. Content (`D2_Content`, `I335:12023;313:8419`)

| Property        | Value                                | CSS                                  |
| --------------- | ------------------------------------ | ------------------------------------ |
| width × height  | 470 × 408 px                         | `w-[470px]`                          |
| placement       | LEFT half of the Sun* Kudos block (x ≈ 65–535 inside the 1152 block) | — |
| flex            | column, gap 32px                     | `flex flex-col gap-8 justify-center` |
| children        | text block (457 × 320) — eyebrow + title + description; then CTA wrapper (470 × 56) — "Chi tiết" button | —                            |

#### 4a-bis. Image + Logo (`Frame 367` `I335:12023;313:8417` + `Group 380` `I335:12023;329:2948`)

> **Locked decision (2026-04-26)**: implement as **two separate layers** — Frame 367 as a static `<img>` (decorative) and Group 380 as the inline `<KudosLogo />` SVG component (the same wordmark used elsewhere in the app). Rationale: better accessibility, smaller asset surface, and the SVG can be re-coloured for state changes; design can override later if they prefer a single composed asset.

| Property        | Value                                            | CSS / React                                                 |
| --------------- | ------------------------------------------------ | ----------------------------------------------------------- |
| placement       | RIGHT half of the Sun* Kudos block (x ≈ 757–1028 inside the 1152 block) | wrapper: `relative w-[374px] h-[219px]`           |
| Frame 367       | 272 × 219 px decorative image; positioned at the back of the cluster | `<img src={kudosImageUrl} alt="" aria-hidden="true" class="w-[272px] h-[219px] absolute right-0 top-0" />` |
| Group 380       | 374 × 72 px KUDOS wordmark overlay — overlaps Frame 367 vertically centered | `<KudosLogo class="w-[374px] h-[72px] absolute right-0 top-1/2 -translate-y-1/2" aria-label="Sun* Kudos" />` |
| accessibility   | Image is decorative; the logo carries the accessible name "Sun* Kudos" so the block announces once | as above (`alt=""` + `aria-hidden` on the image; `aria-label` on the SVG logo) |

#### 4b. CTA Button — `D2.1_Button-IC` ("Chi tiết")

| Property        | Value (Node `I335:12023;313:8426`)    | CSS                                                       |
| --------------- | ------------------------------------- | --------------------------------------------------------- |
| width × height  | 127 × 56 px (auto-hug content)        | `inline-flex items-center`                                |
| padding         | 16px                                  | `px-4 py-4`                                               |
| gap             | 8px                                   | `gap-2`                                                   |
| border-radius   | 4px                                   | `rounded`                                                 |
| background      | `#FFEA9E`                             | `bg-[--color-accent-primary]`                             |
| label typography | Montserrat 14/700/20 (token `--text-label-1`) | `font-bold text-sm leading-5`                       |
| label color     | `#00101A` (dark page bg, for AA contrast on yellow) | `text-[--color-bg-page]`                       |
| icon            | 24×24                                 | `w-6 h-6`                                                 |

**States:** *(locked-in defaults — 2026-04-26)*

| State    | Property             | Value                                                  |
| -------- | -------------------- | ------------------------------------------------------ |
| Default  | bg / color           | `#FFEA9E` / `#00101A`                                  |
| Hover    | bg                   | `#FFE177` (≈ −5 % L on `#FFEA9E`)                      |
| Active   | bg                   | `#F6D85C`                                              |
| Focus    | outline              | `2px solid #FFEA9E`, `outline-offset: 2px`             |
| Disabled | opacity              | `0.5`, `cursor: not-allowed`                           |

> Figma does not expose interaction variants for this instance. The values above were chosen to match the brand-yellow accent token (`#FFEA9E`) with proportional darkening for hover/active and an accent-colored focus ring. Override with official tokens if/when design publishes them.

---

### 5. Section Divider (reused 7×)

| Property     | Value         | CSS                                  |
| ------------ | ------------- | ------------------------------------ |
| height       | 1 px          | `h-px`                               |
| background   | `#2E3940`     | `bg-[--color-divider]`               |
| width        | 100% of column it sits in (480, 853, 1152) | full width                  |

---

## Component Hierarchy with Styles

```
Screen (bg: --color-bg-page = #00101A)
├── Header (h: 80, px: 144, py: 12, bg: rgba(16,20,23,0.8))      [shared instance — see Homepage spec]
├── Keyvisual (W:1440, H:547, top:80) + cover gradient (H:627)
│
└── Bìa (px: 144, py: 96, gap: 120, flex-col)
    │
    ├── A_Title (W:1152, gap: 16, flex-col)
    │   ├── Eyebrow "Sun* Annual Awards 2025" (--text-subtitle-1, color: #FFFFFF, center)
    │   ├── Divider (1px #2E3940)
    │   └── Page Title "Hệ thống giải thưởng SAA 2025" (--text-display-1, color: #FFEA9E, center)
    │
    ├── B_Hệ thống giải thưởng (W:1152, gap: 80, flex-row, justify-between)
    │   │
    │   ├── C_Menu list (W:178, sticky, gap: 16, flex-col)
    │   │   ├── C.1 Top Talent             [active: text #FFEA9E, border-b 1px, glow]
    │   │   ├── C.2 Top Project            [inactive: text white, radius:4]
    │   │   ├── C.3 Top Project Leader
    │   │   ├── C.4 Best Manager
    │   │   ├── C.5 Signature 2025 - Creator
    │   │   └── C.6 MVP
    │   │
    │   └── D._Awards list (W:853, gap: 80, flex-col)
    │       ├── D.1 Top Talent             [Frame 506 — image LEFT  | content RIGHT]
    │       ├── ── divider 1px #2E3940 ──
    │       ├── D.2 Top Project            [Frame 507 — content LEFT | image RIGHT]
    │       ├── ── divider 1px #2E3940 ──
    │       ├── D.3 Top Project Leader     [Frame 506 — image LEFT  | content RIGHT]
    │       ├── ── divider 1px #2E3940 ──
    │       ├── D.4 Best Manager           [Frame 507 — content LEFT | image RIGHT]
    │       ├── ── divider 1px #2E3940 ──
    │       ├── D.5 Signature 2025 - Creator [Frame 506 — image LEFT  | content RIGHT]
    │       ├── ── divider 1px #2E3940 ──
    │       └── D.6 MVP                    [Frame 507 — content LEFT | image RIGHT]
    │
    └── D1_Sunkudos (W:1152, H:500, flex-row, items-center, justify-between)
        ├── D2_Content (W:470, flex-col, gap:32)
        │   ├── Text block — eyebrow + title + description
        │   └── Button "Chi tiết" (W:127, H:56, bg #FFEA9E, radius 4)
        └── Image cluster — Frame 367 (272×219) + Group 380 (KUDOS logo overlay)
└── Footer (W:1440, px:90, py:40, border-t 1px #2E3940)             [shared instance]
```

---

## Responsive Specifications

> The Figma frame is **desktop-only (1440)**. Tablet/mobile values below are **locked-in defaults (2026-04-26)** chosen to satisfy the constitution Principle IV breakpoint requirement (mobile ≥ 360, tablet ≥ 768, desktop ≥ 1280). They are based on the desktop spacing scale halved/two-thirds at each breakpoint, with the zig-zag dropped on mobile (always image-on-top). Override locally if design later publishes mobile / tablet frames.

### Breakpoints

| Name     | Min Width  | Max Width  |
| -------- | ---------- | ---------- |
| Mobile   | 360 px     | 767 px     |
| Tablet   | 768 px     | 1279 px    |
| Desktop  | 1280 px    | ∞          |

### Responsive Changes

#### Mobile (< 768 px)

| Component               | Changes                                                                 |
| ----------------------- | ----------------------------------------------------------------------- |
| Bìa container           | `padding: 48px 16px`, `gap: 64px`                                       |
| Page title `A`          | `font-size: 32px`, `line-height: 40px`                                  |
| `B` row → column        | `flex-direction: column`; menu becomes a horizontal scrollable tab strip |
| `C_Menu list`           | sticky **top** strip (height 56), nav items horizontal-scroll           |
| Award row (`D.x`)       | `flex-direction: column` for ALL rows — desktop zig-zag is dropped on mobile; image full-width (square aspect 1:1) is always above content |
| Award content panel     | `width: 100%`                                                           |
| Award title             | `font-size: 20px / 28px`                                                |
| Value figure            | `font-size: 28px / 36px`                                                |
| `D1_Sunkudos`           | `flex-direction: column`, image stacks above text                       |
| CTA "Chi tiết"          | `width: 100%`                                                           |

#### Tablet (768 – 1279 px)

| Component               | Changes                                                                 |
| ----------------------- | ----------------------------------------------------------------------- |
| Bìa container           | `padding: 72px 48px`, `gap: 96px`                                       |
| `B` layout              | retain row (menu 160 + list flex-1), gap 48                             |
| Page title              | `font-size: 44px / 52px`                                                |
| Award image             | scale to 280 × 280, with content panel filling remainder                |

#### Desktop (≥ 1280 px) — Figma source

Use the values exactly as captured above (1152 inner width, 144 px gutter, 96 px page padding-y).

---

## Icon Specifications

All glyphs are 24 × 24 instances of MoMorph media components. They MUST be implemented as a single `<Icon>` React component (per constitution Principle IV) that maps a name to an inline `<svg>`.

| Icon Component (logical name) | Figma Source                          | Size  | Color                       | Usage                                       |
| ----------------------------- | ------------------------------------- | ----- | --------------------------- | ------------------------------------------- |
| `<Icon name="target" />`      | `MM_MEDIA_Target`                     | 24×24 | `#FFEA9E` (active) / `#FFFFFF` (inactive) | Side menu nav-item leading icon |
| `<Icon name="diamond" />`     | `MM_MEDIA_Diamond` (`214:2535`)        | 24×24 | `#FFEA9E`                   | "Số lượng giải thưởng" label                |
| `<Icon name="license" />`     | `MM_MEDIA_License` (`214:2543`)        | 24×24 | `#FFEA9E`                   | "Giá trị giải thưởng" label                 |
| `<Icon name="chevron-right" />` | `IC` (`I335:12023;313:8426;186:1766`) | 24×24 | `#00101A`                   | "Chi tiết" CTA trailing icon                |

> ALL icons MUST be SVG via the shared `<Icon>` component. Inline `<svg>` and `<img>` tags are forbidden (see "Notes").

---

## Animation & Transitions

| Element                  | Property                       | Duration | Easing       | Trigger                  |
| ------------------------ | ------------------------------ | -------- | ------------ | ------------------------ |
| Side-menu nav item       | color, border-bottom, text-shadow | 200ms | ease-in-out | Hover, active state change |
| Page scroll → menu sync  | scroll-position observer       | n/a      | n/a          | IntersectionObserver on `D.x` headings; updates active item |
| Anchor click             | `scroll-behavior: smooth`      | 400ms    | ease-out     | Click on `C.x` item      |
| "Chi tiết" CTA           | background-color               | 150ms    | ease-in-out  | Hover                    |
| Award image              | transform: scale(1.02)         | 250ms    | ease-out     | (Optional) hover         |

---

## Implementation Mapping

| Design Element            | Figma Node ID  | Tailwind / CSS Class                                                                            | React Component                                |
| ------------------------- | -------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Page Title block          | `313:8453`     | `flex flex-col gap-4 w-full`                                                                    | `<AwardsPageTitle />`                          |
| Title eyebrow             | `313:8454`     | `text-2xl font-bold leading-8 text-white text-center`                                           | inside `<AwardsPageTitle />`                   |
| Title main heading        | `313:8457`     | `text-[57px] font-bold leading-[64px] tracking-[-0.25px] text-[--color-accent-primary] text-center` | inside `<AwardsPageTitle />`                |
| Side menu container       | `313:8459`     | `sticky top-28 flex flex-col gap-4 w-[178px]`                                                   | `<AwardsSideNav />`                            |
| Active nav item           | `313:8460`     | `flex items-center gap-1 p-4 border-b border-[--color-accent-primary]`                          | `<AwardsSideNav.Item active />`                |
| Inactive nav item         | `313:8461` (–`313:8465`) | `flex items-center gap-1 p-4 rounded`                                                | `<AwardsSideNav.Item />`                       |
| Awards list container     | `313:8466`     | `flex flex-col gap-20 w-[853px] divide-y divide-[--color-divider]`                              | `<AwardList />`                                |
| Award row (image-left, D.1/D.3/D.5)  | `313:8467` / `313:8469` / `313:8471` (Frame 506) | `flex flex-row gap-10 items-start`         | `<AwardCard direction="image-left" />`         |
| Award row (image-right, D.2/D.4/D.6) | `313:8468` / `313:8470` / `313:8510` (Frame 507) | `flex flex-row-reverse gap-10 items-start` | `<AwardCard direction="image-right" />`        |
| Award image frame         | `I*;214:2525`  | `flex items-center justify-center w-[336px] h-[336px] rounded-3xl ring-1 ring-[--color-accent-primary] mix-blend-screen shadow-[--shadow-award-image]` | `<AwardImage />` |
| Award content panel       | `I*;214:2526`  | `flex flex-col gap-8 w-[480px] rounded-2xl backdrop-blur-[32px]`                                | `<AwardContent />`                             |
| Quantity row              | `I*;214:2533`  | `flex items-center gap-4 w-full`                                                                | `<AwardContent.Quantity />`                    |
| Value block               | `I*;214:2540`  | `flex flex-col gap-6 w-full`                                                                    | `<AwardContent.Value />`                       |
| Section divider           | `*;214:2532` etc. | `h-px w-full bg-[--color-divider]`                                                           | `<Divider />`                                  |
| Sunkudos promo            | `335:12023`    | `flex flex-row items-center justify-between w-full max-w-[1152px] h-[500px]`                    | `<KudosPromo />`                               |
| "Chi tiết" CTA            | `I*;313:8426`  | `inline-flex items-center gap-2 px-4 py-4 rounded bg-[--color-accent-primary] text-[--color-bg-page]` | `<Button variant="cta">`                |
| Header (shared)           | `313:8440`     | reuse from Homepage SAA — `<AppHeader />`                                                       | `<AppHeader />`                                |
| Footer (shared)           | `354:4323`     | reuse from Homepage SAA — `<AppFooter />`                                                       | `<AppFooter />`                                |

---

## Notes

- All colors and effects are wired through CSS variables (Tailwind v4 `@theme` block) per constitution Principle II — components MUST NOT hard-code raw hex values.
- All icons MUST use the shared `<Icon>` React component. Inline `<svg>` files and `<img>` tags for icons are FORBIDDEN.
- Award image fills (the photographic backgrounds of D.1.1–D.6.1) are placeholders in Figma (`url(<path-to-image>)`). Source assets MUST be supplied by the design team or fetched from `/api/awards`.
- The award image uses `mix-blend-mode: screen`; verify it remains legible against the dark page background — it does on `#00101A`, but a fallback solid-color background is required for browsers that fail blending (rare).
- The frame includes no validated input fields and no submit actions. All interactivity is read-only display + anchor navigation + a single CTA to Sun* Kudos (`/kudos`).
- Hover/focus/active state values for the CTA and inactive nav item are locked-in defaults (see § 2 and § 4b "States" tables). Figma does not expose interaction variants — the values were chosen to match the brand-yellow accent. Override locally if design later publishes official tokens.
- WCAG AA contrast checks at the design tokens above:
  - `#FFEA9E` text on `#00101A` background → contrast ratio 16.8 : 1 ✅
  - `#FFFFFF` text on `#00101A` background → 19.4 : 1 ✅
  - `#00101A` text on `#FFEA9E` button → 16.8 : 1 ✅
  - All exceed AA minimums (4.5 : 1 for normal text, 3 : 1 for large).

---

## Resolved Defaults *(decisions baked into this document — 2026-04-26)*

> Each item below started as an Open Question after `momorph.reviewspecify`. They have been resolved with locked-in defaults so that planning and implementation can proceed without blocking on design follow-up. If design later overrides any of them, the change is local — update the referenced section and ship.

- **Q1 — `Awards-Name` overlay typography** — *resolved by Figma data*. The overlay is a raster image asset, not live text — the `Awards-Name` instance contains a single `Rectangle` whose only style is `background: url(<image>)`. There is no typography to document. Each award supplies its own pre-rendered overlay asset (size varies per card; see § 3a).
- **Q2 — Sun* Kudos image asset structure** — *locked: two separate layers*. Frame 367 = decorative `<img>` with `aria-hidden="true"`; Group 380 = inline `<KudosLogo />` SVG with `aria-label="Sun* Kudos"`. See § 4a-bis. Rationale: better accessibility, smaller asset surface, the SVG is reusable on other Sun* Kudos surfaces, and it can be re-coloured for state changes.
- **Q3 — Hover / focus / active state colors** — *locked: brand-tinted defaults*. Inactive nav item hover = `rgba(255, 234, 158, 0.08)`; CTA hover = `#FFE177`; CTA active = `#F6D85C`; focus ring everywhere = `2px solid #FFEA9E` with `outline-offset: 2px`; CTA disabled = `opacity: 0.5; cursor: not-allowed`. See § 2 and § 4b. Values were chosen to match the accent token `#FFEA9E` with proportional luminance shifts. Override with official Sun* design-system tokens if/when published.
- **Q4 — Mobile / tablet breakpoint values** — *locked: extrapolated table*. Tablet retains the two-column layout with reduced gutter; mobile collapses to a single column with image-on-top for every award (zig-zag dropped); side menu becomes a horizontal scrollable strip below the header on mobile. See § Responsive for the full table. Override per-component if design publishes mobile / tablet frames.
- **Q5 — Sun* Kudos route** — *locked: `/kudos`*. The "Chi tiết" CTA navigates to `/kudos` (recorded in `SCREENFLOW.md`). The destination screen still needs Figma discovery and a spec, but the URL is fixed so this page can ship. Rename in one place (i18n constant / route config) if design picks a different path.
- **Q6 — `Awards-Name` i18n binding** — *resolved by Figma data*. The overlay is baked into the raster asset (see Q1), so it is **not i18n-bound**. The award `name` (used for the right-hand title row) remains i18n-bound; the overlay artwork does not change with locale.
