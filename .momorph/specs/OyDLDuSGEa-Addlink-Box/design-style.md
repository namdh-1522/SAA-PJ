# Design Style: Add link Box

**Frame**: `OyDLDuSGEa` → root `1002:12917` → `Add link box` `1002:12682`.

All values below were extracted via `mcp__momorph.list_frame_styles` for the Figma frame.

## Container — `Add link box` (`1002:12682`)

| Property        | Value                                  | Token                                    |
| --------------- | -------------------------------------- | ---------------------------------------- |
| `width`         | `752 px` (max), responsive shrink      | `min(752px, calc(100vw - 32px))`         |
| `padding`       | `40 px`                                | `var(--spacing-kudos-compose-padding)`   |
| `gap`           | `32 px` (between rows)                 | `var(--spacing-kudos-compose-gap)`       |
| `display`       | `flex` column                          | —                                        |
| `align-items`   | `flex-start`                           | —                                        |
| `border-radius` | `24 px`                                | `var(--radius-kudos-compose-modal)`      |
| `background`    | `#FFF8E1` (kudos cream)                | `var(--color-kudos-compose-modal-bg)`    |
| `position`      | centered modal, above compose modal    | `z-index: var(--z-modal) + 1`            |

The container reuses the same tokens as `KudoComposeModal` so the two surfaces look like the same dialog family.

## A — Title `Thêm đường dẫn` (`I1002:12682;1002:12500`)

| Property         | Value                                              |
| ---------------- | -------------------------------------------------- |
| `font-family`    | Montserrat                                         |
| `font-size`      | `32 px`                                            |
| `font-weight`    | 700                                                |
| `line-height`    | `40 px`                                            |
| `color`          | `#00101A` (`var(--color-kudos-compose-text)`)      |
| `text-align`     | left                                               |

Reuses `var(--text-kudos-compose-title-*)` tokens already used by the compose modal title (only difference: title is left-aligned here vs centered in the parent).

## B / C — Field rows (label + input)

Same flex-row layout as the existing compose fields but with the label INLINE on the left (not stacked above the input):

| Property        | Value                          |
| --------------- | ------------------------------ |
| row `display`   | `flex` row                     |
| row `align-items` | `center`                     |
| row `gap`       | `16 px`                        |
| label width     | `auto` (hugs text)             |

### Label (`B.1_Title`, `C.1_Title`)

| Property         | Value                                              |
| ---------------- | -------------------------------------------------- |
| `font-family`    | Montserrat                                         |
| `font-size`      | `22 px`                                            |
| `font-weight`    | 700                                                |
| `line-height`    | `28 px`                                            |
| `color`          | `#00101A`                                          |

Labels: "Nội dung" (B.1), "URL" (C.1).

### Text input (`B.2_Text box`, `C.2_Text box`)

| Property         | Value                                                       | Token                                |
| ---------------- | ----------------------------------------------------------- | ------------------------------------ |
| `flex`           | `1 0 0` (fills remaining row width)                          | —                                    |
| `height`         | `56 px`                                                     | —                                    |
| `padding`        | `16 px 24 px`                                               | —                                    |
| `border`         | `1 px solid #998C5F`                                        | `var(--color-kudos-compose-border)`  |
| `background`    | `#FFF`                                                      | `var(--color-kudos-compose-input-bg)` |
| `border-radius`  | `8 px`                                                      | `var(--radius-kudos-compose-input)`  |

The URL input has a trailing link icon (`MM_MEDIA_Link`, 24×24) inside the input on the right side. Reuses the inline `LinkIcon` SVG already declared in `RichTextEditor.tsx`.

## D — Footer buttons row

| Property        | Value                          |
| --------------- | ------------------------------ |
| row `display`   | `flex` row                     |
| row `align-items` | `flex-start`                 |
| row `gap`       | `24 px`                        |

### D.1 — Hủy / Cancel (`I1002:12682;1002:12544`)

| Property        | Value                                                          | Token                                       |
| --------------- | -------------------------------------------------------------- | ------------------------------------------- |
| `padding`       | `16 px 40 px`                                                  | —                                           |
| `gap`           | `8 px` (label ↔ icon)                                          | —                                           |
| `border`        | `1 px solid #998C5F`                                           | `var(--color-kudos-compose-border)`         |
| `background`   | `rgba(255, 234, 158, 0.10)`                                    | `var(--color-kudos-compose-secondary-btn-bg)` |
| `border-radius` | `4 px`                                                         | `var(--radius-kudos-compose-cancel-btn)`    |
| label           | "Hủy" — Montserrat 16/24 700, `letter-spacing: 0.15px`, `#00101A` | `var(--text-kudos-compose-body-*)`        |
| trailing icon   | close X 24×24, currentColor                                    | inline SVG (see Implementation mapping)     |

Identical to the existing `ActionsFooter` cancel button — same tokens, same hover behavior.

### D.2 — Lưu / Save (`I1002:12682;1002:12545`)

| Property        | Value                                                          | Token                                    |
| --------------- | -------------------------------------------------------------- | ---------------------------------------- |
| `flex`          | `1 0 0` (fills the rest of the row)                             | —                                        |
| `height`        | `60 px`                                                        | —                                        |
| `padding`       | `16 px`                                                        | —                                        |
| `gap`           | `8 px` (label ↔ icon)                                          | —                                        |
| `background`    | `#FFEA9E` (gold)                                               | `var(--color-kudos-compose-primary-btn)` |
| `border-radius` | `8 px`                                                         | `var(--radius-kudos-compose-input)`      |
| label           | "Lưu" — Montserrat 22/28 700, `#00101A`                         | —                                        |
| trailing icon   | link chain 24×24, currentColor                                 | reuse `RichTextEditor`'s `LinkIcon` SVG  |
| disabled state  | `background: rgba(255, 234, 158, 0.4)`, `opacity: 0.6`         | mirrors `ActionsFooter` submit button    |

## Implementation mapping

| Figma node                | DOM / Tailwind                                                                      | Component                  |
| ------------------------- | ----------------------------------------------------------------------------------- | -------------------------- |
| `1002:12682` container    | Radix `<Dialog.Content>` styled like the compose modal                              | `<KudoLinkDialog>`         |
| `A_Title`                 | `<Dialog.Title>` 32/40 700 left-aligned                                              | inside `<KudoLinkDialog>`  |
| `B_Text` / `C_Link` rows  | `<label class="flex flex-row items-center gap-4">` + `<input>`                       | inline                     |
| `B.2` Nội dung input      | `<input type="text">` with text token, w-full inside flex-1 wrapper                  | inline                     |
| `C.2` URL input           | `<input type="url">` with trailing `LinkIcon` inside an input wrapper                | inline                     |
| `D.1_Button Huỷ`          | `<button>` with cancel tokens (mirrors `ActionsFooter`)                              | inline                     |
| `D.2_Button Lưu`          | `<button>` with primary tokens (mirrors `ActionsFooter` submit)                      | inline                     |
