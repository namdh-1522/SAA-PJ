# Tasks: Dropdown Phòng ban

## Phase 1 — Component

- [x] T001 Implement `<KudosDeptDropdown>` (trigger pill + popover panel + items) | components/kudos/highlight/KudosDeptDropdown.tsx
- [x] T002 Verify `--text-shadow-active` exists in `app/globals.css`; add if missing (gold glow `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287`) | app/globals.css

## Phase 2 — Wiring

- [x] T003 Replace native `<select>` for departments in `KudosFilters.tsx` with `<KudosDeptDropdown>` | components/kudos/highlight/KudosFilters.tsx

## Phase 3 — Tests

- [x] T004 [P] Add unit test for `KudosDeptDropdown` (open / close / select / Esc / a11y) | tests/unit/kudos/kudos-dept-dropdown.test.tsx

## Phase 4 — Polish

- [x] T005 Visual snapshot via Playwright diagnose test (open the dropdown, screenshot, compare with Figma `WXK5AYB_rG`) | tests/e2e/kudos/diagnose-render.spec.ts
- [x] T006 Run `npm run test` + `npx tsc --noEmit` and confirm no regression
