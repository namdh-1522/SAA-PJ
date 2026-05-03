# Design Style: Viết Kudo

**Frame ID**: `ihQ26W78P2`
**Frame Name**: `Viết Kudo`
**Figma Link**: https://www.figma.com/file/9ypp4enmFmdK3YAFJLIu6C?node-id=ihQ26W78P2
**Extracted At**: 2026-04-27

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-modal-bg | #FFF8E1 | 100% | Modal background (cream/yellow) |
| --color-text-primary | #00101A | 100% | Headings, labels, body text |
| --color-border | #998C5F | 100% | Input borders, button borders |
| --color-input-bg | #FFFFFF | 100% | Input/textarea backgrounds |
| --color-text-secondary | #999999 | 100% | Placeholder, hint text |
| --color-required | #CF1322 | 100% | Required asterisk (*) |
| --color-primary-btn | #FFEAA9 | 100% | Primary "Gửi" button background (gold) |
| --color-secondary-btn | rgba(255,234,158,0.10) | 10% | "Hủy" cancel button background |
| --color-page-bg | #00101A | 100% | Page background (dark navy) |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-modal-title | Montserrat | 32px | 700 | 40px | 0px |
| --text-label | Montserrat | 22px | 700 | 28px | 0px |
| --text-body | Montserrat | 16px | 700 | 24px | 0.15px |
| --text-required | Noto Sans JP | 16px | 700 | 20px | 0px |
| --text-hint | Montserrat | 14px | 400 | 20px | 0px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-modal-padding | 40px | Modal container inner padding |
| --spacing-modal-gap | 32px | Gap between modal sections |
| --spacing-section-gap | 24px | Gap between content sub-sections |
| --spacing-field-gap | 16px | Gap between label and input in a row |
| --spacing-input-px | 24px | Input horizontal padding |
| --spacing-input-py | 16px | Input vertical padding |
| --spacing-toolbar-px | 16px | Toolbar button horizontal padding |
| --spacing-toolbar-py | 10px | Toolbar button vertical padding |
| --spacing-btn-px | 40px | Cancel button horizontal padding |
| --spacing-btn-py | 16px | Button vertical padding |
| --spacing-action-gap | 24px | Gap between Hủy/Gửi buttons |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-modal | 24px | Modal container |
| --radius-input | 8px | Search input, submit button |
| --radius-toolbar-tl | 8px 0 0 0 | Toolbar top-left corners |
| --radius-textarea | 0 0 8px 8px | Textarea (bottom corners) |
| --radius-image | 18px | Image thumbnails |
| --radius-cancel-btn | 4px | Cancel button |
| --radius-checkbox | 4px | Anonymous checkbox |
| --border-default | 1px solid #998C5F | Input, button borders |
| --border-checkbox | 1px solid #999999 | Checkbox border |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| --shadow-modal | 0 20px 40px rgba(0,0,0,0.3) | Modal overlay shadow |

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| width | 752px | Fixed modal width |
| height | 1012px | Fixed modal height |
| padding | 40px | All sides |
| gap | 32px | Between sections |
| border-radius | 24px | Modal corners |
| background | #FFF8E1 | Cream/yellow |
| display | flex | Layout model |
| flex-direction | column | Vertical stack |

### Layout Structure (ASCII)

```
┌──────────────────────────────────────────────────────────────┐
│  Modal Container (752px × 1012px, p: 40px, gap: 32px)       │
│  background: #FFF8E1, border-radius: 24px                    │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  A. Title (672px × 80px, center, Montserrat 700 32px)  │  │
│  └────────────────────────────────────────────────────────┘  │
│                         ↕ gap: 32px                          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  B. Người nhận (672px × 56px, flex row, gap: 16px)     │  │
│  │  ┌──────────────┐  ┌────────────────────────────────┐  │  │
│  │  │ B.1 Label    │  │ B.2 Search Input (flex: 1)     │  │  │
│  │  │ 146 × 28px   │  │ h:56px, border: 1px #998C5F   │  │  │
│  │  └──────────────┘  └────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
│                         ↕ gap: 32px                          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  C. Danh hiệu (672px × 104px, 2 rows)                  │  │
│  │  ┌──────────────┐  ┌──────────────────────────────┐   │  │
│  │  │ C.Label      │  │ C.Input (514px × 56px)        │   │  │
│  │  │ 139 × 28px * │  │ border: 1px #998C5F, p:16 24 │   │  │
│  │  └──────────────┘  └──────────────────────────────┘   │  │
│  │  C.Hint: "Dành tặng một danh hiệu cho đồng đội"        │  │
│  │  (418px × 48px, Montserrat 700 16px, #999)             │  │
│  └────────────────────────────────────────────────────────┘  │
│                         ↕ gap: 32px                          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Content Area (672px × 444px, flex col, gap: 24px)     │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  Kudo Editor (672px, flex col, gap: 4px)         │  │  │
│  │  │  ┌────────────────────────────────────────────┐  │  │  │
│  │  │  │ D. Toolbar (40px h, flex row)              │  │  │  │
│  │  │  │  [B][I][S][#][🔗]["]   Tiêu chuẩn...      │  │  │  │
│  │  │  └────────────────────────────────────────────┘  │  │  │
│  │  │  ┌────────────────────────────────────────────┐  │  │  │
│  │  │  │ E. Textarea (672px, min-h:120, h:200px)    │  │  │  │
│  │  │  │  pl: 24px, bg: #FFF                        │  │  │  │
│  │  │  └────────────────────────────────────────────┘  │  │  │
│  │  │  ┌────────────────────────────────────────────┐  │  │  │
│  │  │  │ E.1 Hint (672px × 24px, flex row)          │  │  │  │
│  │  │  └────────────────────────────────────────────┘  │  │  │
│  │  └──────────────────────────────────────────────┘  │  │  │
│  │  ┌──────────────────────────────────────────────┐  │  │  │
│  │  │  F. Hashtag (672px × 48px, flex row, gap:16) │  │  │  │
│  │  │  ┌──────────┐  ┌──────────────────────────┐  │  │  │  │
│  │  │  │ F.1 Label│  │  F.2 Tag Group (548px)   │  │  │  │  │
│  │  │  └──────────┘  └──────────────────────────┘  │  │  │  │
│  │  └──────────────────────────────────────────────┘  │  │  │
│  │  ┌──────────────────────────────────────────────┐  │  │  │
│  │  │  G. Images (672px × 80px, flex row, gap:16)  │  │  │  │
│  │  │  [80×80] [80×80] [80×80] [+Image]            │  │  │  │
│  │  └──────────────────────────────────────────────┘  │  │  │
│  └────────────────────────────────────────────────────┘  │  │
│                         ↕ gap: 32px                          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  H. Anonymous Toggle (672px × 28px, flex row, gap:16)  │  │
│  │  [☐] Gửi lời cám ơn và ghi nhận ẩn danh               │  │
│  └────────────────────────────────────────────────────────┘  │
│                         ↕ gap: 32px                          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  I. Actions (672px × 60px, flex row, gap: 24px)        │  │
│  │  ┌──────────────┐  ┌──────────────────────────────┐   │  │
│  │  │  I.1 Hủy     │  │       I.2 Gửi (502px)        │   │  │
│  │  │  border+faint│  │       bg: #FFEAA9             │   │  │
│  │  └──────────────┘  └──────────────────────────────┘   │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘

Height check: 40px(pad) + 80(A) + 32 + 56(B) + 32 + 104(C) + 32 + 444(Content) + 32 + 28(H) + 32 + 60(I) + 40px(pad) = 1012px ✓
```

---

## Component Style Details

### A. Modal Title

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9870 | — |
| width | 672px | `width: 672px` |
| height | 80px | `height: 80px` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 32px | `font-size: 32px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 40px | `line-height: 40px` |
| text-align | center | `text-align: center` |
| color | #00101A | `color: var(--color-text-primary)` |

---

### B.1 Label (Người nhận)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9872 | — |
| width | 146px | `width: 146px` |
| height | 28px | `height: 28px` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| gap | 2px | `gap: 2px` |
| align-items | center | `align-items: center` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 22px | `font-size: 22px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 28px | `line-height: 28px` |
| Required * color | #CF1322 | `color: var(--color-required)` |

---

### B.2 Search Input (Người nhận)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9873 | — |
| flex | 1 0 0 | `flex: 1 0 0` |
| padding | 16px 24px | `padding: 16px 24px` |
| background | #FFFFFF | `background-color: white` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border)` |
| border-radius | 8px | `border-radius: var(--radius-input)` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| justify-content | space-between | `justify-content: space-between` |
| icon (dropdown) | 24×24px | Right-aligned dropdown icon |

**States:**
| State | Changes |
|-------|---------|
| Default | border: 1px solid #998C5F |
| Focus | border-color: #00101A, box-shadow: 0 0 0 2px rgba(0,16,26,0.15) |
| Error | border-color: #CF1322 |
| Filled | Shows selected user name text |

---

### C. Danh hiệu Field (Frame 552)

> **Note**: This component was present in the Figma layout but not annotated as a named design item in MoMorph. It is a required field and must be implemented.

#### C.Label — Danh hiệu Label

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;1688:10436 | — |
| width | 139px | `width: 139px` |
| height | 28px | `height: 28px` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| gap | 2px | `gap: 2px` |
| align-items | center | `align-items: center` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 22px | `font-size: 22px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 28px | `line-height: 28px` |
| color | #00101A | `color: var(--color-text-primary)` |
| Required * color | #CF1322 | `color: var(--color-required)` |

#### C.Input — Danh hiệu Text Input

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;1688:10437 | — |
| width | 514px | `width: 514px` |
| padding | 16px 24px | `padding: 16px 24px` |
| background | #FFFFFF | `background-color: white` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border)` |
| border-radius | 8px | `border-radius: var(--radius-input)` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| justify-content | space-between | `justify-content: space-between` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.15px | `letter-spacing: 0.15px` |
| placeholder color | #999999 | `color: var(--color-text-secondary)` |

**States:**
| State | Changes |
|-------|---------|
| Default | border: 1px solid #998C5F |
| Focus | border-color: #00101A, box-shadow: 0 0 0 2px rgba(0,16,26,0.15) |
| Error | border-color: #CF1322 |
| Filled | text color: #00101A |

#### C.Hint — Danh hiệu Hint Text + Character Counter

The hint area below the input is a flex row (`justify-content: space-between`) containing the static hint on the left and a live character counter on the right.

**Hint text (left):**

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;1688:10447 | — |
| width | 418px | `width: 418px` |
| height | 48px | `height: 48px` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.15px | `letter-spacing: 0.15px` |
| color | #999999 | `color: var(--color-text-secondary)` |
| text-align | left | `text-align: left` |
| Content | "Dành tặng một danh hiệu cho đồng đội" | — |

**Character counter (right):**

| Property | Value | CSS |
|----------|-------|-----|
| Format | `{n}/100` | — |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 14px | `font-size: 14px` |
| font-weight | 500 | `font-weight: 500` |
| color (default) | #999999 | `color: var(--color-text-secondary)` |
| color (at limit `n=100`) | #CF1322 | `color: var(--color-required)` |
| max | 100 | hard-blocked at input layer |

#### C. Frame Layout (672px × 104px)

```
┌─────────────────────────────────────────────────────────┐
│ Row 1 (h: 56px, flex row, align-items: center)          │
│  ┌─────────────────┐  ┌──────────────────────────────┐  │
│  │ Label (139px)   │  │ Input (514px × 56px)          │  │
│  │ "Danh hiệu *"   │  │ border: 1px #998C5F           │  │
│  └─────────────────┘  └──────────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│ Row 2 (h: 48px)                                         │
│  Hint: "Dành tặng một danh hiệu cho đồng đội"           │
│  (418px, Montserrat 700 16px, #999)                     │
└─────────────────────────────────────────────────────────┘
```

---

### D. Text Formatting Toolbar (Toolbar)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9877 | — |
| height | 40px | `height: 40px` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |

**Toolbar Button Node IDs:**

| Button | Node ID |
|--------|---------|
| Bold (B) | I520:11647;520:9881 |
| Italic (I) | I520:11647;662:11119 |
| Strikethrough (S) | I520:11647;662:11213 |
| Numbered list (#) | I520:11647;662:10376 |
| Link (🔗) | I520:11647;662:10507 |
| Quote (") | I520:11647;662:10647 |
| Tiêu chuẩn cộng đồng (text link) | I520:11647;3053:11619 |

**Toolbar Button Shared Style:**

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID (Bold example)** | I520:11647;520:9881 | — |
| height | 40px | `height: 40px` |
| padding | 10px 16px | `padding: 10px 16px` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border)` |
| background | transparent | `background: transparent` |
| border-radius (first) | 8px 0 0 0 | `border-radius: 8px 0 0 0` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |

**States:**
| State | Changes |
|-------|---------|
| Default | background: transparent |
| Active/Toggled | background: rgba(255,234,158,0.3) |
| Hover | background: rgba(255,234,158,0.2) |

---

### E. Rich Text Textarea

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9886 | — |
| height | 200px | `height: 200px` |
| min-height | 120px | `min-height: 120px` |
| align-self | stretch | `align-self: stretch` |
| padding-left | 24px | `padding-left: 24px` |
| background | #FFFFFF | `background-color: white` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border)` |
| border-radius | 0 0 8px 8px | `border-radius: 0 0 8px 8px` |
| display | flex | `display: flex` |
| align-items | flex-start | `align-items: flex-start` |

**States:**
| State | Changes |
|-------|---------|
| Placeholder | color: #999999 |
| Focus | border-color: #00101A |
| Error | border-color: #CF1322 |

---

### E.1 Hint Text (@-mention)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9887 | — |
| width | 672px | `width: 672px` |
| height | 24px | `height: 24px` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| justify-content | space-between | `justify-content: space-between` |
| align-items | center | `align-items: center` |
| font-size | 16px | `font-size: 16px` |
| color | #999999 | `color: var(--color-text-secondary)` |

---

### F. Hashtag Section

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9890 | — |
| width | 672px | `width: 672px` |
| height | 48px | `height: 48px` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| gap | 16px | `gap: 16px` |
| align-items | flex-start | `align-items: flex-start` |

**F.2 Tag Group:**

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;662:8595 | — |
| width | 548px | `width: 548px` |
| height | 48px | `height: 48px` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| gap | 8px | `gap: 8px` |
| align-items | center | `align-items: center` |

**Hashtag chip style (inferred):**

| State | Changes |
|-------|---------|
| Default | border: 1px solid #998C5F, border-radius: 999px, padding: 4px 12px |
| Active/Selected | background: #FFEAA9 |

---

### G. Image Thumbnails

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID (thumbnail)** | I520:11647;662:9197 | — |
| width | 80px | `width: 80px` |
| height | 80px | `height: 80px` |
| aspect-ratio | 1/1 | `aspect-ratio: 1 / 1` |
| background | #FFFFFF | `background: white` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border)` |
| border-radius | 18px | `border-radius: 18px` |

**Add Image Button:**

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;662:9132 | — |
| width | 98px | `width: 98px` |
| height | 48px | `height: 48px` |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| align-items | center | `align-items: center` |
| justify-content | center | `justify-content: center` |
| gap | 2px | `gap: 2px` |

---

### H. Anonymous Toggle

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:14099 | — |
| width | 672px | `width: 672px` |
| height | 28px | `height: 28px` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| gap | 16px | `gap: 16px` |
| align-items | center | `align-items: center` |

**Checkbox:**

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:14099;520:14097 | — |
| width | 24px | `width: 24px` |
| height | 24px | `height: 24px` |
| aspect-ratio | 1/1 | `aspect-ratio: 1 / 1` |
| background | #FFFFFF | `background: white` |
| border | 1px solid #999999 | `border: 1px solid var(--border-checkbox)` |
| border-radius | 4px | `border-radius: var(--radius-checkbox)` |

**States:**
| State | Changes |
|-------|---------|
| Unchecked | background: #FFF, border: 1px solid #999 |
| Checked | background: #FFEAA9, border: 1px solid #998C5F, shows checkmark |
| Hover | border-color: #998C5F |

---

### I.1 Cancel Button (Hủy)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9906 | — |
| padding | 16px 40px | `padding: 16px 40px` |
| background | rgba(255,234,158,0.10) | `background: var(--color-secondary-btn)` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border)` |
| border-radius | 4px | `border-radius: var(--radius-cancel-btn)` |
| align-self | stretch | `align-self: stretch` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| gap | 8px | `gap: 8px` |

**States:**
| State | Changes |
|-------|---------|
| Default | background: rgba(255,234,158,0.10) |
| Hover | background: rgba(255,234,158,0.25) |
| Active | background: rgba(255,234,158,0.40) |

---

### I.2 Submit Button (Gửi)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9907 | — |
| width | 502px | `width: 502px` |
| height | 60px | `height: 60px` |
| padding | 16px | `padding: 16px` |
| background | #FFEAA9 | `background: var(--color-primary-btn)` |
| border | none | `border: none` |
| border-radius | 8px | `border-radius: var(--radius-input)` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| justify-content | center | `justify-content: center` |
| gap | 8px | `gap: 8px` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-weight | 700 | `font-weight: 700` |
| color | #00101A | `color: var(--color-text-primary)` |

**States:**
| State | Changes |
|-------|---------|
| Default | background: #FFEAA9, cursor: pointer |
| Hover | background: #FFE08A |
| Active | background: #FFD55A |
| Disabled | background: rgba(255,234,158,0.4), cursor: not-allowed, opacity: 0.6 |

---

### Bìa — Live Preview Card (Background, Desktop Only)

The Bìa is a sibling element to the modal — rendered in the same overlay layer but positioned in the background, to the right of the centered modal. It is NOT inside the modal DOM. Visible only at viewport widths ≥ 1024px.

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 520:11607 | — |
| Position | Background, right-of-modal | `position: absolute` (within overlay) |
| Display (desktop) | block | `display: block` |
| Display (mobile/tablet) | none | `display: none` |

**Bìa Children (read-only display only):**

| Element | Node ID | Source data |
|---------|---------|-------------|
| Avatar | 520:11610 | `selectedRecipient.avatar_url` (placeholder if not selected) |
| Name (recipient) | 520:11612 | `selectedRecipient.name` |
| Badges row | 520:11613 | `selectedRecipient.badges[]` |
| Danh hiệu (preview) | (text inside Frame 511, `520:11621`) | `title` state (live-updated as user types) |
| SAA Footer / KUDOS label | 520:11630 | Static |

**Behavior:**
- When `selectedRecipient === null`, Bìa shows placeholder avatar and empty name/badge slots.
- When `title === ""`, Bìa shows the typed-title slot empty.
- Updates are real-time (no debounce) as the user types in C.Input or selects a recipient.

---

## Component Hierarchy with Styles

```
Modal (bg: #FFF8E1, w: 752px, h: 1012px, p: 40px, gap: 32px, radius: 24px)
├── A. Title (w: 672px, h: 80px, text: Montserrat 700 32px/40px, center)
│
├── B. Người nhận Row (w: 672px × 56px, flex row, gap: 16px)
│   ├── B.1 Label (w: 146px, Montserrat 700 22px/28px + red *)
│   └── B.2 Search Input (flex:1, h:56px, p:16px 24px, border: #998C5F, radius:8px)
│       └── Dropdown icon (24×24px, right-aligned)
│
├── C. Danh hiệu Row (w: 672px × 104px, 2 stacked rows)
│   ├── Row1: Label (139px, Montserrat 700 22px/28px + red *) + Input (514px × 56px, border:#998C5F, radius:8px)
│   └── Row2: Hint text (418×48px, Montserrat 700 16px/24px, #999)
│
├── Content (w: 672px × 444px, flex col, gap: 24px)
│   ├── Kudo Editor (flex col, gap: 4px)
│   │   ├── D. Toolbar (h: 40px, flex row — Bold/Italic/Strike/Number/Link/Quote + Tiêu chuẩn link)
│   │   ├── E. Textarea (h: 200px, min-h: 120px, pl: 24px, radius: 0 0 8px 8px)
│   │   └── E.1 Hint (h: 24px, Montserrat 16px, color: #999)
│   ├── F. Hashtag (flex row, gap: 16px)
│   │   ├── F.1 Label (w: 108px, Montserrat 700 22px)
│   │   └── F.2 Tag Group (w: 548px, flex row, gap: 8px — chips + "+ Hashtag")
│   └── G. Images (flex row, gap: 16px)
│       ├── G.1 Label (w: 74px, Montserrat 700 22px)
│       ├── G.2–G.5 Thumbnails (80×80px, radius: 18px, border: #998C5F)
│       └── G.6 Add Image Button (w: 98px, h: 48px)
│
├── H. Anonymous Toggle (flex row, gap: 16px)
│   ├── Checkbox (24×24px, radius: 4px, border: #999)
│   └── Label Text (Montserrat 700 22px/28px, color: #999)
│
└── I. Actions Footer (flex row, gap: 24px)
    ├── I.1 Hủy (p: 16px 40px, border: #998C5F, radius: 4px, bg: faint gold)
    └── I.2 Gửi (w: 502px, h: 60px, bg: #FFEAA9, radius: 8px)
```

---

## Responsive Specifications

### Breakpoints

| Name | Min Width | Max Width |
|------|-----------|-----------|
| Mobile | 0 | 767px |
| Tablet | 768px | 1023px |
| Desktop | 1024px | ∞ |

### Responsive Changes

#### Mobile (< 768px)

| Component | Changes |
|-----------|---------|
| Modal | width: 100vw, border-radius: 16px 16px 0 0 (bottom sheet), padding: 24px |
| Title | font-size: 22px, line-height: 28px |
| C. Danh hiệu Input | width: 100% (overrides 514px fixed) |
| C.Hint | width: 100% (counter remains right-aligned) |
| I.2 Gửi button | width: 100% |
| I.1 Hủy button | flex: 1 |
| **Bìa preview** | **`display: none`** |

#### Tablet (768px – 1023px)

| Component | Changes |
|-----------|---------|
| Modal | width: 600px, centered |
| Padding | 32px |
| C. Danh hiệu Input | width: 100% (full available width) |
| **Bìa preview** | **`display: none`** |

#### Desktop (≥ 1024px)

| Component | Changes |
|-----------|---------|
| Modal | width: 752px, centered with overlay |
| C. Danh hiệu Input | width: 514px (fixed per Figma) |
| **Bìa preview** | **`display: block`** — positioned to the right of the modal in the background overlay layer |

---

## Icon Specifications

| Icon Name | Size | Color | Usage |
|-----------|------|-------|-------|
| IC_Down (dropdown) | 24×24px | #998C5F | Dropdown arrow in search input |
| MM_MEDIA_Close | 24×24px | #00101A | Close/cancel icon in Hủy button |
| MM_MEDIA_Send | 24×24px | #00101A | Send icon in Gửi button |
| IC_Image | 24×24px | #998C5F | Add Image button icon |
| IC_Bold (B) | 24×24px | #00101A | Bold toolbar button |
| IC_Italic (I) | 24×24px | #00101A | Italic toolbar button |
| IC_Strike (S) | 24×24px | #00101A | Strikethrough toolbar button |
| IC_Number | 24×24px | #00101A | Numbered list toolbar button |
| IC_Link | 24×24px | #00101A | Insert link toolbar button |
| IC_Quote | 24×24px | #00101A | Blockquote toolbar button |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Modal | opacity, transform (scale) | 200ms | ease-out | Open/Close |
| Toolbar buttons | background-color | 150ms | ease-in-out | Hover/Toggle |
| Input | border-color | 150ms | ease-in-out | Focus |
| Gửi button | background-color | 150ms | ease-in-out | Hover/Disabled |
| Hủy button | background-color | 150ms | ease-in-out | Hover |
| Image thumbnail | opacity, x | 200ms | ease-out | Add/Remove |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Modal Container | 520:11647 (instance) | `bg-[#FFF8E1] rounded-3xl p-10 flex flex-col gap-8` | `<KudoModal />` |
| A. Modal Title | I520:11647;520:9870 | `text-[32px] font-bold text-center font-montserrat` | `<h2>` inside modal |
| B.1 Người nhận Label | I520:11647;520:9872 | `text-[22px] font-bold font-montserrat` | `<FormLabel required />` |
| B.2 Search Input | I520:11647;520:9873 | `border border-[#998C5F] rounded-lg px-6 py-4 bg-white flex justify-between items-center` | `<RecipientSearchTrigger />` |
| C.Label Danh hiệu | I520:11647;1688:10436 | `text-[22px] font-bold font-montserrat w-[139px]` | `<FormLabel required />` |
| C.Input Danh hiệu | I520:11647;1688:10437 | `w-[514px] border border-[#998C5F] rounded-lg px-6 py-4 bg-white` | `<Input name="title" />` |
| C.Hint Danh hiệu | I520:11647;1688:10447 | `text-base text-[#999] font-montserrat font-bold w-[418px] flex justify-between` | `<InputHint />` with `<CharCounter max={100} />` |
| D. Toolbar | I520:11647;520:9877 | `flex flex-row h-10` | `<EditorToolbar />` |
| D.1 Toolbar Btn Bold | I520:11647;520:9881 | `px-4 py-[10px] border border-[#998C5F] h-10 rounded-tl-lg` | `<ToolbarButton variant="bold" />` |
| D.7 Community Standards | I520:11647;3053:11619 | `text-sm text-[#998C5F] underline ml-auto` | `<CommunityStandardsLink />` |
| E. Textarea | I520:11647;520:9886 | `border border-[#998C5F] bg-white min-h-[120px] h-[200px] pl-6 rounded-b-lg` | `<RichTextarea />` |
| E.1 Hint (@-mention) | I520:11647;520:9887 | `text-base text-[#999] flex justify-between` | `<InputHint />` |
| F.1 Hashtag Label | I520:11647;520:9891 | `text-[22px] font-bold font-montserrat` | `<FormLabel required />` |
| F.2 Tag Group | I520:11647;662:8595 | `flex flex-row gap-2 flex-wrap` | `<TagGroup />` |
| F.3 + Hashtag Button | I520:11647;662:8911 | `border border-[#998C5F] rounded-full px-3 py-1 text-sm` | `<HashtagPickerTrigger />` (anchors inline `<HashtagDropdown />`) |
| G. Image Section | I520:11647;520:9896 | `flex flex-row gap-4 items-center` | `<ImageUpload />` |
| G.2 Image Thumbnail | I520:11647;662:9197 | `w-20 h-20 rounded-[18px] border border-[#998C5F] bg-white` | `<ImageThumbnail />` |
| H. Anonymous Toggle | I520:11647;520:14099 | `flex flex-row gap-4 items-center` | `<AnonymousToggle />` |
| H. Checkbox | I520:11647;520:14099;520:14097 | `w-6 h-6 rounded border border-[#999] bg-white` | `<Checkbox />` |
| I.1 Cancel Button | I520:11647;520:9906 | `px-10 py-4 border border-[#998C5F] rounded bg-[rgba(255,234,158,0.1)]` | `<Button variant="secondary">Hủy</Button>` |
| I.2 Submit Button | I520:11647;520:9907 | `w-[502px] h-[60px] bg-[#FFEAA9] rounded-lg flex items-center justify-center` | `<Button variant="primary">Gửi</Button>` |
| Bìa preview card | 520:11607 | `hidden lg:block absolute right-...` (desktop only) | `<KudoPreviewCard recipient={...} title={title} />` |

---

## Notes

- All colors MUST use CSS variables for theming support (Tailwind design token gate from constitution)
- Font stack: Montserrat (primary), Noto Sans JP (required marker)
- Load fonts via `next/font` (constitution requirement)
- Toolbar and Textarea share a border, creating a visually unified editor block (toolbar: `border-radius: 8px 0 0 0`; textarea: `border-radius: 0 0 8px 8px`)
- The Gửi (submit) button is disabled when any required field (Người nhận, **Danh hiệu**, Nội dung, ≥1 Hashtag) is empty
- The **Danh hiệu** field is hard-capped at 100 characters; counter color shifts to `#CF1322` when at the limit
- The **Bìa** preview card is positioned outside the modal DOM (overlay sibling); use `display: none` on viewports < 1024px
- The **+ Hashtag** dropdown is anchored inline beneath the button — implement with a portal/absolute-positioned popover within the modal, not a navigation
- The **Tiêu chuẩn cộng đồng** link uses `target="_blank" rel="noopener noreferrer"` to preserve the draft
- Image upload is **immediate per-file**: thumbnails show a loading state until `POST /api/media/upload` returns a URL
- Icons MUST use Icon Component, not raw SVG or `<img>` tags (constitution frontend guideline)
- Ensure color contrast meets WCAG AA (4.5:1) — #00101A on #FFF8E1 = ~16.6:1 ✅
