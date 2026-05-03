# Design Style: Login

**Frame ID**: `GzbNeVGJHz`
**Frame Name**: `Login`
**Figma Link**: `https://www.figma.com/file/9ypp4enmFmdK3YAFJLIu6C/?node-id=662:14387`
**Extracted At**: 2026-04-21

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| `--color-bg-dark` | #00101A | 100% | Page background, H-gradient solid stops |
| `--color-bg-header` | #0B0F12 | 80% | Header bar background |
| `--color-cta-bg` | #FFEA9E | 100% | "LOGIN With Google" button fill (default) |
| `--color-cta-bg-hover` | #FFE070 | 100% | "LOGIN With Google" button fill (hover) |
| `--color-cta-bg-active` | #FFD740 | 100% | "LOGIN With Google" button fill (active/pressed) |
| `--color-cta-text` | #00101A | 100% | "LOGIN With Google" button text |
| `--color-text-primary` | #FFFFFF | 100% | Tagline, footer copy, language label |
| `--color-divider` | #2E3940 | 100% | Footer top border |
| `--color-bg-dark-alt` | #001320 | 100% | V-gradient mid-stop (rgba(0,19,32)) |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| `--text-nav-lang` | Montserrat | 16px | 700 | 24px | 0.15px |
| `--text-tagline` | Montserrat | 20px | 700 | 40px | 0.5px |
| `--text-cta` | Montserrat | 22px | 700 | 28px | 0px |
| `--text-footer` | Montserrat Alternates | 16px | 700 | 24px | 0px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| `--spacing-header-px` | 144px | Header horizontal padding |
| `--spacing-header-py` | 12px | Header vertical padding |
| `--spacing-header-gap` | 238px | Header flex gap (logo ↔ language) |
| `--spacing-main-px` | 144px | Main section horizontal padding |
| `--spacing-main-py` | 96px | Main section vertical padding |
| `--spacing-hero-gap` | 120px | Defined on `mms_B_Bìa` (single child — effectively unused at this level) |
| `--spacing-content-gap` | 80px | Gap between brand logo and tagline+button block (`Frame 487`) — the operative gap |
| `--spacing-tagline-btn` | 24px | Gap: tagline → CTA button |
| `--spacing-footer-px` | 90px | Footer horizontal padding |
| `--spacing-footer-py` | 40px | Footer vertical padding |
| `--spacing-btn-px` | 24px | CTA button horizontal padding |
| `--spacing-btn-py` | 16px | CTA button vertical padding |
| `--spacing-content-pl` | 16px | Content sub-section left indent |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| `--radius-btn` | 8px | Login CTA button |
| `--radius-lang` | 4px | Language selector button |
| `--border-footer` | 1px solid #2E3940 | Footer top border |

### Shadows

No box-shadow effects are defined for this frame.

---

## Layout Specifications

### Frame

| Property | Value |
|----------|-------|
| Width | 1440px |
| Height | 1024px |
| Background | #00101A |

### Layout Structure (ASCII)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Login Page (1440×1024, bg: #00101A)                                     │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  mms_A_Header (w:1440, h:80, px:144, bg:rgba(11,15,18,0.8), z:10) │  │
│  │  flex row · justify-between · items-center · gap:238px            │  │
│  │  ┌─────────────────┐                     ┌──────────────────────┐ │  │
│  │  │ mms_A.1_Logo    │                     │ mms_A.2_Language     │ │  │
│  │  │ 52×48 img       │                     │ 108×56               │ │  │
│  │  │                 │                     │ [🇻🇳 VN ▾] r:4px    │ │  │
│  │  └─────────────────┘                     └──────────────────────┘ │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  [mms_C_Keyvisual — pos:absolute, inset:0, z:0 — full-screen BG image]  │
│  [Rectangle 57  — pos:absolute, inset:0, z:1 — H gradient overlay]      │
│    linear-gradient(90deg, #00101A 0%, #00101A 25.41%, transparent 100%) │
│  [Cover — pos:absolute, inset:0, z:1 — V gradient overlay]              │
│    linear-gradient(0deg, #00101A 22.48%, transparent 51.74%)            │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  mms_B_Bìa (pos:absolute top:88, w:1440, h:845, px:144, py:96)    │  │
│  │  flex col · gap:120px                                             │  │
│  │  ┌──────────────────────────────────────────────────────────────┐ │  │
│  │  │  Frame 487 (w:1152, h:653, flex col, gap:80px)               │ │  │
│  │  │  ┌────────────────────────────────────────────────────────┐  │ │  │
│  │  │  │  mms_B.1_Key Visual (w:1152, h:200)                    │  │ │  │
│  │  │  │  └─ Root Further Logo image (w:451, h:200, ratio:115/51)│  │ │  │
│  │  │  └────────────────────────────────────────────────────────┘  │ │  │
│  │  │                          ↕ gap:80px                          │ │  │
│  │  │  ┌────────────────────────────────────────────────────────┐  │ │  │
│  │  │  │  Frame 550 (w:496, h:164, flex col, gap:24px, pl:16)   │  │ │  │
│  │  │  │  ┌──────────────────────────────────────────────────┐  │  │ │  │
│  │  │  │  │  mms_B.2_content (w:480, h:80)                   │  │  │ │  │
│  │  │  │  │  "Bắt đầu hành trình của bạn cùng SAA 2025.      │  │  │ │  │
│  │  │  │  │   Đăng nhập để khám phá!"                        │  │  │ │  │
│  │  │  │  │  Montserrat 700 20px / lh:40px / ls:0.5px #FFF   │  │  │ │  │
│  │  │  │  └──────────────────────────────────────────────────┘  │  │ │  │
│  │  │  │                      ↕ gap:24px                        │  │ │  │
│  │  │  │  ┌──────────────────────────────────────────────────┐  │  │ │  │
│  │  │  │  │  mms_B.3_Login                                   │  │  │ │  │
│  │  │  │  │  └─ Button (w:305, h:60, bg:#FFEA9E, r:8)        │  │  │ │  │
│  │  │  │  │     px:24 · py:16 · flex row · items-center      │  │  │ │  │
│  │  │  │  │     ┌───────────────────────────┐ ┌──────────┐   │  │  │ │  │
│  │  │  │  │     │ "LOGIN With Google "      │ │ Google   │   │  │  │ │  │
│  │  │  │  │     │ Montserrat 700 22px #00101A│ │ icon 24² │   │  │  │ │  │
│  │  │  │  │     └───────────────────────────┘ └──────────┘   │  │  │ │  │
│  │  │  │  └──────────────────────────────────────────────────┘  │  │ │  │
│  │  │  └────────────────────────────────────────────────────────┘  │ │  │
│  │  └──────────────────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  mms_D_Footer (pos:absolute bottom:0, w:1440, py:40, px:90)       │  │
│  │  border-top: 1px solid #2E3940                                    │  │
│  │  "Bản quyền thuộc về Sun* © 2025"  ·  Montserrat Alt 700 16px    │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### A — Header (`mms_A_Header`)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `662:14391` | — |
| width | 1440px | `width: 100%` |
| height | 80px | `height: 80px` |
| padding | 12px 144px | `padding: 12px 144px` |
| background | rgba(11, 15, 18, 0.8) | `background-color: rgba(11,15,18,0.8)` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| justify-content | space-between | `justify-content: space-between` |
| align-items | center | `align-items: center` |
| gap | 238px | `gap: 238px` |
| position | fixed | `position: fixed; top: 0` |
| z-index | 10 | `z-index: 10` |

---

### A.1 — Logo (`mms_A.1_Logo`)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I662:14391;186:2166` | — |
| width | 52px | `width: 52px` |
| height | 56px | `height: 56px` |
| display | flex row | `display: flex; flex-direction: row` |
| align-items | center | `align-items: center` |
| gap | 64px | `gap: 64px` |

Inner logo image (`I662:14391;178:1033`):

| Property | Value |
|----------|-------|
| width | 52px |
| height | 48px |
| object-fit | cover |

---

### A.2 — Language Selector (`mms_A.2_Language`)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I662:14391;186:1601` | — |
| width | 108px | `width: 108px` |
| height | 56px | `height: 56px` |
| display | flex row | `display: flex; flex-direction: row` |
| align-items | center | `align-items: center` |
| gap | 16px | `gap: 16px` |

Inner Button (`I662:14391;186:1696;186:1821`):

| Property | Value | CSS |
|----------|-------|-----|
| width | 108px | `width: 108px` |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| border-radius | 4px | `border-radius: 4px` |
| display | flex row | `display: flex; flex-direction: row` |
| justify-content | space-between | `justify-content: space-between` |
| align-items | center | `align-items: center` |
| gap | 2px | `gap: 2px` |

Text "VN":

| Property | Value |
|----------|-------|
| font-family | Montserrat |
| font-size | 16px |
| font-weight | 700 |
| line-height | 24px |
| letter-spacing | 0.15px |
| color | #FFFFFF |

**States:**

| State | Property | Value |
|-------|----------|-------|
| Default | background | transparent |
| Hover | background | rgba(255, 255, 255, 0.08) |
| Active | background | rgba(255, 255, 255, 0.12) |
| Focus | outline | 2px solid rgba(255, 234, 158, 0.5) |

---

### B.1 — Brand Key Visual (`mms_B.1_Key Visual`)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `662:14395` | — |
| width | 1152px | `width: 100%` |
| height | 200px | `height: 200px` |
| display | flex col | `display: flex; flex-direction: column` |
| gap | 24px | `gap: 24px` |

Inner brand logo (`2939:9548`):

| Property | Value |
|----------|-------|
| width | 451px |
| height | 200px |
| aspect-ratio | 115 / 51 |
| object-fit | cover |

---

### B.2 — Tagline (`mms_B.2_content`)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `662:14753` | — |
| width | 480px | `width: 480px` |
| height | 80px | `min-height: 80px` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 20px | `font-size: 20px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 40px | `line-height: 40px` |
| letter-spacing | 0.5px | `letter-spacing: 0.5px` |
| color | #FFFFFF | `color: #ffffff` |
| text-align | left | `text-align: left` |

Content (i18n key: `login.tagline`):
> "Bắt đầu hành trình của bạn cùng SAA 2025.\nĐăng nhập để khám phá!"

---

### B.3 — Login CTA Button (`662:14426`)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `662:14426` | — |
| width | 305px | `width: 305px` |
| height | 60px | `height: 60px` |
| padding | 16px 24px | `padding: 16px 24px` |
| background | #FFEA9E | `background-color: var(--color-cta-bg)` |
| border-radius | 8px | `border-radius: var(--radius-btn)` |
| display | flex row | `display: flex; flex-direction: row` |
| align-items | center | `align-items: center` |
| justify-content | flex-start | `justify-content: flex-start` |
| gap | 4px | `gap: 4px` |
| cursor | pointer | `cursor: pointer` |

Button text "LOGIN With Google":

| Property | Value |
|----------|-------|
| font-family | Montserrat |
| font-size | 22px |
| font-weight | 700 |
| line-height | 28px |
| letter-spacing | 0px |
| color | #00101A |

Google Icon (`I662:14426;186:1766`):

| Property | Value |
|----------|-------|
| width | 24px |
| height | 24px |

**States:**

| State | Property | Value |
|-------|----------|-------|
| Default | background | #FFEA9E |
| Hover | background | #FFE070 |
| Active | background | #FFD740 |
| Focus | outline | 2px solid #FFEA9E; outline-offset: 2px |
| Disabled | background | #9CA3AF; cursor: not-allowed |
| Loading | opacity | 0.7; cursor: wait |

---

### C — Background (`mms_C_Keyvisual`)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `662:14388` | — |
| width | 1441px | `width: 100%` |
| height | 1022px | `height: 100%` |
| position | absolute | `position: absolute; inset: 0` |
| z-index | 0 | `z-index: 0` |
| object-position | -440px -217.975px | (via `next/image` objectPosition prop) |
| object-fit | cover | `object-fit: cover` |

Gradient overlays applied on top:

| Layer | CSS Value | Direction |
|-------|-----------|-----------|
| H gradient (`662:14392`) | `linear-gradient(90deg, #00101A 0%, #00101A 25.41%, rgba(0,16,26,0) 100%)` | Left → right; solid dark for first 25%, fades to transparent |
| V gradient (`662:14390`) | `linear-gradient(0deg, #00101A 22.48%, rgba(0,19,32,0) 51.74%)` | Bottom → top (0deg = upward); solid dark at bottom, transparent by ~52% up |

---

### D — Footer (`mms_D_Footer`)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `662:14447` | — |
| width | 1440px | `width: 100%` |
| padding | 40px 90px | `padding: 40px 90px` |
| border-top | 1px solid #2E3940 | `border-top: 1px solid var(--color-divider)` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| justify-content | space-between | `justify-content: space-between` |
| position | absolute bottom | `position: absolute; bottom: 0` |

Copyright text:

| Property | Value |
|----------|-------|
| font-family | Montserrat Alternates |
| font-size | 16px |
| font-weight | 700 |
| line-height | 24px |
| letter-spacing | 0px |
| color | #FFFFFF |
| text-align | center |
| width | 275px |

Content (i18n key: `footer.copyright`): "Bản quyền thuộc về Sun* © 2025"

---

## Component Hierarchy with Styles

```
Login (1440×1024, bg:#00101A, relative)
├── mms_C_Keyvisual (absolute inset:0 z:0 — hero BG image, object-cover)
├── Rectangle 57 (absolute inset:0 z:1 — H-gradient overlay)
├── Cover (absolute inset:0 z:1 — V-gradient overlay)
├── mms_A_Header (fixed top:0 w:full h:80 px:144 bg:rgba(11,15,18,0.8) z:10)
│   ├── mms_A.1_Logo (w:52 h:56 flex-row gap:64 items-center)
│   │   └── LOGO image (52×48 object-cover)
│   └── mms_A.2_Language (w:108 h:56 flex-row gap:16 items-center)
│       └── Button (w:108 h:56 p:16 r:4 flex-row justify-between items-center gap:2)
│           ├── [VN Flag 20×15] + "VN" (Montserrat 700 16px #FFF ls:0.15px)
│           └── Chevron-down icon (24×24 #FFF)
├── mms_B_Bìa (absolute top:88 w:1440 h:845 px:144 py:96 flex-col gap:120)
│   └── Frame 487 (w:1152 h:653 flex-col gap:80)
│       ├── mms_B.1_Key Visual (w:1152 h:200 flex-col gap:24)
│       │   └── Root Further logo image (w:451 h:200 aspect:115/51 object-cover)
│       └── Frame 550 (w:496 h:164 flex-col gap:24 pl:16)
│           ├── mms_B.2_content (w:480 h:80 Montserrat 700 20px #FFF lh:40px ls:0.5px)
│           └── mms_B.3_Login (w:305 h:60 flex-row gap:40 — single child, gap unused)
│               └── Button (w:305 h:60 bg:var(--color-cta-bg) r:8 px:24 py:16 flex-row items-center gap:4)
│                   ├── "LOGIN With Google" (Montserrat 700 22px #00101A lh:28px)
│                   └── Google SVG icon (24×24)
└── mms_D_Footer (absolute bottom:0 w:full py:40 px:90 border-t:1px #2E3940 flex justify-between)
    └── "Bản quyền thuộc về Sun* © 2025" (Montserrat Alternates 700 16px #FFF lh:24px w:275 text-center)
```

---

## Responsive Specifications

### Breakpoints

| Name | Min Width | Max Width |
|------|-----------|-----------|
| Mobile | 0px | 767px |
| Tablet | 768px | 1279px |
| Desktop | 1280px | ∞ |

### Responsive Changes

#### Mobile (< 768px)

| Component | Changes |
|-----------|---------|
| Header | padding: 12px 16px; gap: auto (space-between) |
| Brand logo | width: 100%; max-width: 280px; height: auto |
| Tagline | font-size: 16px; line-height: 28px; width: 100% |
| Login CTA | width: 100%; max-width: 320px |
| Main section | padding: 80px 16px 96px |
| Footer | padding: 24px 16px; text-align: center |

#### Tablet (768px – 1279px)

| Component | Changes |
|-----------|---------|
| Header | padding: 12px 48px |
| Main section | padding: 96px 48px |
| Brand logo | max-width: 360px; height: auto |
| Tagline | font-size: 18px |
| Footer | padding: 40px 48px |

#### Desktop (≥ 1280px)

Matches Figma frame exactly (1440px reference width).

---

## Icon Specifications

| Icon Name | Node ID | Size | Color | Usage |
|-----------|---------|------|-------|-------|
| Google | `I662:14426;186:1766` | 24×24 | SVG original | Login CTA button |
| Chevron-down | `I662:14391;186:1696;186:1821;186:1441` | 24×24 | #FFFFFF | Language selector |
| VN Flag | `I662:14391;186:1696;186:1821;186:1709` | 20×15 | — | Language selector |

All icons MUST be rendered as SVG Icon Components — not `<img>` tags.

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Login CTA Button | background-color | 150ms | ease-in-out | Hover / Active |
| Language Selector | background-color | 150ms | ease-in-out | Hover / Active |
| Language Dropdown | opacity, transform | 150ms | ease-out | Toggle open/close |

---

## Implementation Mapping

> **Note**: All raw hex values below MUST be defined as CSS variables in `app/globals.css`
> (see Design Tokens section above) and consumed via Tailwind `var()` utilities. The Tailwind
> arbitrary-value syntax shown uses `var(--token)` form for constitution compliance.

| Design Element | Figma Node ID | Tailwind Classes | React Component |
|----------------|---------------|-----------------|-----------------|
| Page root | `662:14387` | `relative min-h-screen bg-[var(--color-bg-dark)] overflow-hidden` | `<LoginPage>` |
| Header | `662:14391` | `fixed top-0 w-full h-20 flex items-center justify-between px-36 bg-[var(--color-bg-header)] z-10` | `<Header>` |
| Logo | `I662:14391;186:2166` | `flex items-center w-[52px] h-14` | `<Logo>` |
| Language selector | `I662:14391;186:1601` | `flex items-center gap-4 w-[108px] h-14` | `<LanguageSelector>` |
| Lang button | `I662:14391;186:1696;186:1821` | `flex justify-between items-center w-[108px] h-14 p-4 rounded-[var(--radius-lang)] hover:bg-white/8 focus:outline focus:outline-2 focus:outline-[rgba(255,234,158,0.5)]` | `<button>` |
| Hero BG image | `662:14388` | `absolute inset-0 w-full h-full object-cover z-0` | `<Image>` (next/image, priority) |
| H gradient | `662:14392` | `absolute inset-0 z-[1] bg-[linear-gradient(90deg,var(--color-bg-dark)_0%,var(--color-bg-dark)_25.41%,transparent_100%)]` | `<div aria-hidden>` |
| V gradient | `662:14390` | `absolute inset-0 z-[1] bg-[linear-gradient(0deg,var(--color-bg-dark)_22.48%,transparent_51.74%)]` | `<div aria-hidden>` |
| Main wrapper | `662:14393` | `absolute top-[88px] w-full px-36 py-24 flex flex-col` | `<main>` |
| Brand logo | `2939:9548` | `w-[451px] h-[200px] object-cover` | `<Image>` (next/image) |
| Tagline | `662:14753` | `text-[var(--color-text-primary)] font-bold text-xl leading-10 tracking-[0.5px] w-[480px]` | `<p>` |
| CTA button wrapper | `662:14425` | `flex flex-row` | `<div>` |
| CTA button | `662:14426` | `flex items-center gap-1 px-6 py-4 bg-[var(--color-cta-bg)] hover:bg-[var(--color-cta-bg-hover)] active:bg-[var(--color-cta-bg-active)] rounded-[var(--radius-btn)] w-[305px] h-[60px] cursor-pointer transition-colors duration-150 focus:outline focus:outline-2 focus:outline-[var(--color-cta-bg)] focus:outline-offset-2` | `<GoogleLoginButton>` (Client) |
| CTA text | `I662:14426;186:1568` | `font-bold text-[22px] leading-7 text-[var(--color-cta-text)]` | `<span>` |
| Google icon | `I662:14426;186:1766` | `w-6 h-6 flex-shrink-0` | `<GoogleIcon>` (SVG) |
| Footer | `662:14447` | `absolute bottom-0 w-full flex items-center justify-between px-[90px] py-10 border-t border-[var(--color-divider)]` | `<Footer>` |
| Footer text | `I662:14447;342:1413` | `text-[var(--color-text-primary)] font-bold text-base leading-6 text-center w-[275px]` | `<p>` |
