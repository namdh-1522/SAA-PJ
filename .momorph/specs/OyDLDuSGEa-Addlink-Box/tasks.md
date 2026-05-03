# Tasks: Add link Box

## Phase 1 — Component

- [x] T001 Implement `<KudoLinkDialog>` (Radix Dialog: title + Nội dung + URL + Hủy/Lưu, allow-list validation, error surface) | components/kudos/compose/fields/KudoLinkDialog.tsx

## Phase 2 — i18n

- [x] T002 Add `kudos.compose.fields.link.*` keys to both locales; remove the now-unused `toolbar_link_prompt` key | messages/vi.json, messages/en.json

## Phase 3 — Wiring

- [x] T003 Replace `window.prompt()` in the `link` toolbar action with `<KudoLinkDialog>`; preserve the saved selection range and reuse the existing `createLink` / `insertHTML` flow | components/kudos/compose/fields/RichTextEditor.tsx

## Phase 4 — Tests

- [x] T004 [P] Unit test for `KudoLinkDialog` (open / Lưu success / invalid URL error / Hủy / save disabled when URL empty) | tests/unit/kudos/kudo-link-dialog.test.tsx

## Phase 5 — Polish

- [x] T005 Run `npx tsc --noEmit` and `vitest run tests/unit/kudos/` and confirm no regression
