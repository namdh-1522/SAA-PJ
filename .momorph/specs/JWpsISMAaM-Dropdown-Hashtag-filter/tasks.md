# Tasks: Dropdown Hashtag filter

## Phase 1 — Component

- [x] T001 Implement `<KudosHashtagDropdown>` (trigger pill + popover panel + items, click-outside, Esc, keyboard nav, `#`-prefixed row labels) | components/kudos/highlight/KudosHashtagDropdown.tsx

## Phase 2 — Wiring

- [x] T002 Replace native `<select>` for hashtags in `KudosFilters.tsx` with `<KudosHashtagDropdown>`; gate on `hashtags.length > 0` | components/kudos/highlight/KudosFilters.tsx

## Phase 3 — Tests

- [x] T003 [P] Add unit test for `KudosHashtagDropdown` (open / close / select / Esc / a11y / `#`-prefixed labels / clear-all) | tests/unit/kudos/kudos-hashtag-dropdown.test.tsx

## Phase 4 — Polish

- [x] T004 Run `npx tsc --noEmit` and `npm run test -- tests/unit/kudos/kudos-hashtag-dropdown.test.tsx` and confirm no regression
