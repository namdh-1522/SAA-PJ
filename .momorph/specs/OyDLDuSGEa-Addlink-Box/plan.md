# Implementation Plan: Add link Box

**Frame**: `OyDLDuSGEa-Addlink-Box`
**Spec**: `spec.md`
**Created**: 2026-05-03

## Constitution Compliance

| Requirement                  | Constitution Rule                              | Status                                  |
| ---------------------------- | ---------------------------------------------- | --------------------------------------- |
| TypeScript strict            | All new files                                  | ✅ Compliant                            |
| Atomic Design                | Component lives under `components/kudos/compose/fields/` colocated with the editor that owns it | ✅ Compliant |
| Design tokens                | Reuses `var(--color-kudos-compose-*)`, `var(--radius-kudos-compose-*)`, `var(--spacing-kudos-compose-*)` already defined for the parent compose modal | ✅ Compliant |
| Client-only state            | `'use client'`; no server-component imports    | ✅ Compliant                            |
| A11y                         | Radix `Dialog` provides `role="dialog"`, focus trap, Esc, backdrop click | ✅ Compliant |
| No new dependencies          | Reuses `@radix-ui/react-dialog` already used by `KudoComposeModal` | ✅ Compliant |
| Sanitiser parity             | URL allow-list mirrors `lib/kudos/sanitize-content.ts:SAFE_HREF` | ✅ Compliant |

## Architecture Decisions

- **Stacked Radix Dialog over the compose modal** — Radix supports nested dialogs; we open a second `Dialog.Root` from inside `RichTextEditor`. Stacking gives us focus-trap + Esc + backdrop-close for free without re-implementing them. The link dialog gets `z-index: calc(var(--z-modal) + 1)` so it always paints above the compose modal's overlay.
- **Owner = `RichTextEditor`** — the saved selection range that `execCommand('createLink')` / `execCommand('insertHTML')` needs lives in the editor. Lifting state to the modal would mean re-introducing prop drilling for a private detail. The dialog stays a sibling rendered inside the editor's tree.
- **No new icon files** — reuse the inline `LinkIcon` SVG already declared in `RichTextEditor.tsx` and add a small inline `CloseIcon` SVG for the Cancel button (matches the pattern: small, 14–24 px, `currentColor`, no extra files for one-off icons).
- **Save flow reuses `execCommand`** — same approach the existing `prompt`-based path uses. We just swap the `prompt` for the modal's two values; the insert logic (selectedText vs `insertHTML`) is unchanged.
- **No new Provider** — the dialog is local to one editor instance; lifting it to a context would over-architect for a single consumer.

## Project Structure

### New files

| File                                                                       | Purpose                                              |
| -------------------------------------------------------------------------- | ---------------------------------------------------- |
| `components/kudos/compose/fields/KudoLinkDialog.tsx`                        | The styled dialog (title + 2 fields + cancel/save)   |
| `tests/unit/kudos/kudo-link-dialog.test.tsx`                                | Unit tests: open/close/select/save/invalid URL       |
| `.momorph/specs/OyDLDuSGEa-Addlink-Box/spec.md`                             | Feature spec                                         |
| `.momorph/specs/OyDLDuSGEa-Addlink-Box/design-style.md`                     | Visual / token map                                   |
| `.momorph/specs/OyDLDuSGEa-Addlink-Box/plan.md`                             | This file                                            |
| `.momorph/specs/OyDLDuSGEa-Addlink-Box/tasks.md`                            | Ordered task list                                    |

### Modified files

| File                                                | Change                                                                  |
| --------------------------------------------------- | ----------------------------------------------------------------------- |
| `components/kudos/compose/fields/RichTextEditor.tsx` | Replace `window.prompt()` in the `link` toolbar action with `KudoLinkDialog` open/close + onSave handler |
| `messages/vi.json` and `messages/en.json`            | Add link-dialog strings (`title`, `content_label`, `url_label`, `url_placeholder`, `url_invalid`, `actions.cancel`, `actions.save`) |

### Existing tokens reused (no CSS variable additions needed)

- `--color-kudos-compose-modal-bg` (cream)
- `--color-kudos-compose-text` (`#00101A`)
- `--color-kudos-compose-border` (`#998C5F`)
- `--color-kudos-compose-input-bg` (`#FFF`)
- `--color-kudos-compose-secondary-btn-bg` (cancel pill)
- `--color-kudos-compose-primary-btn` (`#FFEA9E`)
- `--color-kudos-compose-primary-btn-hover`, `--color-kudos-compose-secondary-btn-bg-hover`
- `--color-kudos-compose-required` (error red)
- `--radius-kudos-compose-modal`, `--radius-kudos-compose-input`, `--radius-kudos-compose-cancel-btn`
- `--spacing-kudos-compose-padding`, `--spacing-kudos-compose-gap`
- `--text-kudos-compose-title-*`, `--text-kudos-compose-body-*`
- `--z-modal`

## Implementation Approach

### Phase 1 — Component
1. Build `KudoLinkDialog` with props `{ open, onOpenChange, initialContent, initialUrl, onSave }`.
2. Render Radix `<Dialog.Root open={open} onOpenChange={onOpenChange}>` with `Dialog.Portal`, `Dialog.Overlay`, `Dialog.Content`.
3. Local state: `contentValue` (seeded from `initialContent`), `urlValue` (seeded from `initialUrl`), `urlError` (`null` until Save).
4. Reset state when `open` flips from false → true so reopening clears stale input.
5. Save button disabled until `urlValue.trim()` is non-empty.
6. On Save: trim URL, run `^(?:https?:|mailto:|\/|#)/i` allow-list. If invalid, set `urlError` and keep dialog open. If valid, call `onSave({ content, url })` and close.

### Phase 2 — Wiring
1. In `RichTextEditor.tsx`:
   - Add `const [linkDialog, setLinkDialog] = useState<{ open: boolean; selectedText: string; savedRange: Range | null }>({ open: false, selectedText: '', savedRange: null })`.
   - Replace the `case 'link'` block: snapshot the selection (same logic as today), then `setLinkDialog({ open: true, selectedText, savedRange })` instead of calling `prompt()`.
   - Render `<KudoLinkDialog>` at the bottom of the editor, with `onSave({ content, url })` that:
     1. Refocus the editor and restore the saved range.
     2. If the editor had a selection (`savedRange` non-collapsed AND `selectedText.length > 0`), run `execCommand('createLink', false, url)`.
     3. Otherwise insert `<a href="...">{content || url}</a>` via `execCommand('insertHTML', ...)`.
     4. Close the dialog and call `handleInput()` to flush the new HTML into form state.

### Phase 3 — i18n
1. Add `kudos.compose.fields.link.title`, `content_label`, `content_placeholder`, `url_label`, `url_placeholder`, `url_invalid`, `actions.cancel`, `actions.save` to both `vi.json` and `en.json`.
2. Drop the now-unused `toolbar_link_prompt` key from both files (the prompt-based flow is replaced).

### Phase 4 — Tests
1. Unit test (Vitest + RTL): renders dialog open with seeded content; type URL; click Lưu → onSave called with `{ content, url }`; click Hủy → onOpenChange(false) with no save; invalid URL → error appears, onSave NOT called; save disabled when URL empty.

### Phase 5 — Validation
1. `npx tsc --noEmit`
2. `vitest run tests/unit/kudos/`
3. (Manual smoke) open compose modal → Link toolbar → dialog appears, type → save → link inserted.

## Testing Strategy

| Type        | Focus                                              | Coverage                                  |
| ----------- | -------------------------------------------------- | ----------------------------------------- |
| Unit (RTL)  | Open / save / invalid URL / cancel / a11y attrs    | All branches in `KudoLinkDialog`          |
| Integration | Editor toolbar wiring covered by existing rich-text editor manual flow + unit covers the dialog contract | n/a (no contract tests for editor)   |
| E2E         | Out of scope for this iteration                    | —                                         |

## Risk Assessment

| Risk                                                       | Impact | Mitigation                                                                 |
| ---------------------------------------------------------- | ------ | -------------------------------------------------------------------------- |
| Selection lost when Radix focus-traps the dialog            | Medium | Snapshot the `Range` BEFORE calling `setLinkDialog({ open: true })`; restore via `selection.removeAllRanges() + addRange(savedRange)` on save (same trick the existing `prompt()` flow uses). |
| Stacked Radix dialogs interfere with each other             | Low    | Radix supports nested dialogs out of the box. The link dialog has its own portal & higher z-index. Esc closes the topmost dialog only. |
| Server-side sanitiser rejects edge-case URLs we accept here | Low    | Allow-list regex is identical to `SAFE_HREF` in `sanitize-content.ts`; if either changes, both must update together. |
| User pastes a URL into Nội dung instead of URL              | Low    | Doesn't matter — Nội dung is freeform display text; sanitiser strips tags from it on the server.   |

## Open Questions

- None — all visual values come from the Figma frame and existing tokens; the sanitiser allow-list is already specified in `lib/kudos/sanitize-content.ts`.
