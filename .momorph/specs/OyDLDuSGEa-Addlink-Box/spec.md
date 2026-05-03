# Spec: Add link Box

**Frame ID**: `OyDLDuSGEa` (root node `1002:12917` → `Add link box` `1002:12682`)
**Frame Name**: `Addlink Box`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Parent Screen**: Viết Kudo modal (`ihQ26W78P2`) — opened by the **Link** button in the rich-text editor toolbar (currently uses `window.prompt`).

## Overview

Replace the browser-native `window.prompt(...)` link input in the Viết Kudo rich-text editor with a styled modal dialog ("Thêm đường dẫn" — "Add link"). The dialog asks for two values:

- **Nội dung** — visible link text (defaults to whatever the user has currently selected in the editor; required only when no text is selected).
- **URL** — destination URL. Must match the same `^(?:https?:|mailto:|\/|#)` allow-list used by `lib/kudos/sanitize-content.ts` (`SAFE_HREF`).

On **Lưu** ("Save"), the dialog inserts an `<a>` element into the editor's saved selection — preserving the existing flow:
- If text was selected → wrap it in `<a href="…">`.
- If no text was selected → insert `<a href="…">{contentValue || URL}</a>` at the caret.

On **Hủy** ("Cancel") or backdrop/Esc, close without changing the editor.

## User Stories

### US1 — Insert a link with custom display text [P1]

**As a** user composing a kudo
**I want to** click the link toolbar button, see a styled dialog, type a label and URL, and save
**So that** the link is inserted into the kudo with the label I chose, instead of the URL itself.

**Acceptance Scenarios**

- **Open** — Click the link toolbar button → the "Thêm đường dẫn" dialog opens above the compose modal. The editor's selection range is captured before the dialog opens.
- **Selection prefill** — If the user had selected text in the editor, that text is prefilled into "Nội dung" when the dialog opens.
- **Empty form** — If no text was selected, "Nội dung" starts empty and "URL" is empty. The Save button is disabled until URL is non-empty.
- **Save with selected text** — Save → the selected text becomes a link to the URL; the editor's content is updated and the dialog closes.
- **Save with no selection** — Save → an `<a>` is inserted at the caret with the "Nội dung" value as visible text (or the URL itself if Nội dung is empty).
- **Invalid URL** — On Save, if the URL doesn't match the `SAFE_HREF` allow-list (e.g. `javascript:…`), an inline error appears under the URL field; the dialog stays open and nothing is inserted.
- **Cancel / Esc / backdrop** — Closes the dialog without modifying editor content.

## UI Components

- `<KudoLinkDialog>` — Client Component. Radix `Dialog` rendered ON TOP of the existing compose modal (separate `Dialog.Root`, higher `z-index` than the compose modal).
- Internal: title (Thêm đường dẫn), Nội dung input, URL input with trailing link icon, Hủy + Lưu footer buttons.
- The dialog is owned by `RichTextEditor` (or a small sibling) since the editor holds the saved selection range that the inserted link needs.

See `design-style.md` for visual values.

## Data Requirements

- No backend involved. The dialog is pure client-side; the inserted `<a>` is part of the editor's `content` HTML and goes through the existing `sanitizeKudosContent` on the server when the kudo is submitted.

## API Requirements

None.

## State Management

- Local React state inside `KudoLinkDialog`:
  - `isOpen` — controlled by parent (the editor toolbar).
  - `contentValue`, `urlValue` — string state for the two inputs.
  - `urlError` — surfaced when the URL is rejected by the allow-list at Save time.
- The editor's saved selection (`Range`) lives in `RichTextEditor` and is restored before `execCommand('createLink')` / `execCommand('insertHTML')` runs.

## Edge cases

- **Empty Nội dung + empty URL** — Save disabled (URL is the gate; Nội dung is optional).
- **URL with leading/trailing whitespace** — trimmed before validation.
- **Selection lost while the dialog is open** — the saved range from `RichTextEditor` is the source of truth, not the live `window.getSelection()` (the dialog steals focus).
- **URL fails allow-list** — show inline error; do not close the dialog. Mirrors how the previous prompt-based flow silently rejected invalid URLs (this is now a louder, accessible error).
- **Reopening the dialog** — fields reset to the current selection (or empty) every time it opens; previous values are not retained between openings.

## Accessibility

- Radix `Dialog` provides `role="dialog"`, `aria-modal="true"`, focus trap, Esc-to-close, backdrop click-to-close.
- `Dialog.Title` is "Thêm đường dẫn".
- Each input has an associated `<label>`.
- URL error has `role="alert"` so screen readers announce it.
- Save button is `disabled` (with `aria-disabled`) until URL is non-empty.
