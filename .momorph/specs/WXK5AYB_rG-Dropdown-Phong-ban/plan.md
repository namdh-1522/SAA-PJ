# Implementation Plan: Dropdown Phòng ban

**Frame**: `WXK5AYB_rG-Dropdown-Phong-ban`
**Spec**: `spec.md`
**Created**: 2026-05-03

## Constitution Compliance

| Requirement                  | Constitution Rule                              | Status                                  |
| ---------------------------- | ---------------------------------------------- | --------------------------------------- |
| TypeScript strict            | All new files                                  | ✅ Compliant                            |
| Atomic Design                | Component lives under `components/kudos/highlight/` colocated with the consumer | ✅ Compliant |
| Design tokens                | Reuses `var(--color-kudos-pill-idle)`, `var(--color-kudos-bg-panel)`, `var(--text-shadow-active)` | ✅ Compliant |
| Client-only state            | `'use client'`; no server-component imports    | ✅ Compliant                            |
| A11y                         | `role="combobox"` / `listbox` / `option`, keyboard nav, focus-visible outline | ✅ Compliant |
| No new dependencies          | Reuses click-outside pattern from `avatar-menu.tsx`; no Radix add | ✅ Compliant |

## Architecture Decisions

- **Custom popover instead of Radix DropdownMenu / Popover**: project doesn't yet have these packages installed and the avatar menu already implements the same click-outside / Esc pattern by hand. Adding a Radix package for one dropdown would be over-investment.
- **Trigger pill stays in `KudosFilters.tsx`**: only the dropdown body is extracted. The hashtag select keeps its native `<select>` (no design change requested).
- **Active state**: applied conditionally via `aria-selected` data binding rather than via a class swap, so screen readers + visual diff are sourced from the same flag.
- **Listbox semantics**: `role="combobox"` on trigger, `role="listbox"` on the panel `<ul>`, `role="option"` on each `<li>`, `aria-activedescendant` on the listbox while open.

## Project Structure

### New files

| File                                                                                | Purpose                                              |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `components/kudos/highlight/KudosDeptDropdown.tsx`                                  | Trigger pill + popover panel + items                 |
| `tests/unit/kudos/kudos-dept-dropdown.test.tsx`                                     | Render + open/close + select + a11y unit tests       |
| `.momorph/specs/WXK5AYB_rG-Dropdown-Phong-ban/spec.md`                              | Feature spec (this iteration)                        |
| `.momorph/specs/WXK5AYB_rG-Dropdown-Phong-ban/design-style.md`                      | Visual / token map                                   |
| `.momorph/specs/WXK5AYB_rG-Dropdown-Phong-ban/plan.md`                              | This file                                            |
| `.momorph/specs/WXK5AYB_rG-Dropdown-Phong-ban/tasks.md`                             | Ordered task list                                    |

### Modified files

| File                                                | Change                                                                  |
| --------------------------------------------------- | ----------------------------------------------------------------------- |
| `components/kudos/highlight/KudosFilters.tsx`       | Replace native `<select>` for departments with `<KudosDeptDropdown>`    |

### Existing tokens reused (no CSS variable additions needed)

- `--color-kudos-bg-panel: #00070C`
- `--color-kudos-pill-idle: rgba(255, 234, 158, 0.10)`
- `--color-kudos-border: #998C5F`
- `--text-shadow-active: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` (verify presence; if missing, add to `globals.css`)
- `--radius-sm: 8px`, `--radius-xs: 4px`

## Implementation Approach

### Phase 1 — Component
1. Build `KudosDeptDropdown` with controlled `isOpen` state, click-outside + Esc dismissal (mirrors `avatar-menu.tsx`).
2. Render the trigger pill with the SAME class set used by the existing hashtag pill in `KudosFilters` so the two filters look identical when closed.
3. Render the popover list inside an `absolute` element positioned `top-full right-0 mt-2`.
4. Each row: `<li role="option" aria-selected={isActive}>`. Active state applies the gold-soft bg + text-shadow via inline style (we don't need a new utility class).
5. Keyboard: ↑/↓ moves focused index, Enter/Space selects, Esc closes. Focus moves into the panel on open and back to the trigger on close.

### Phase 2 — Wiring
1. In `KudosFilters.tsx`, swap the dept `<div className={wrapClass}><select>…</select>…</div>` block for `<KudosDeptDropdown departments={departments} value={dept} onChange={setDept} />`.

### Phase 3 — Tests
1. Unit test (Vitest + RTL): renders trigger; clicking trigger opens the panel; clicking an item calls `onChange(code)` and closes the panel; Esc closes; the active item has `aria-selected="true"`.

### Phase 4 — Visual verification
Use the existing Playwright diagnostic at `tests/e2e/kudos/diagnose-render.spec.ts` to capture a screenshot of the open dropdown and visually compare against the Figma frame (active row glow, panel border, item layout).

## Testing Strategy

| Type        | Focus                                              | Coverage                                  |
| ----------- | -------------------------------------------------- | ----------------------------------------- |
| Unit (RTL)  | Open / close / select / Esc / a11y attributes      | All branches in `KudosDeptDropdown`       |
| Integration | None new — reuses `useKudosFilters` (already covered) | n/a                                    |
| E2E         | Visual snapshot via the existing diagnose test     | Hero + open dropdown screenshot           |

## Risk Assessment

| Risk                                              | Impact | Mitigation                                                                 |
| ------------------------------------------------- | ------ | -------------------------------------------------------------------------- |
| Click-outside can race with React's onClick path  | Medium | Use `mousedown` listener (matches `avatar-menu.tsx`) so click-outside fires before the new click resolves |
| Focus management broken on iOS Safari             | Low    | Use `setTimeout(focus, 0)` after panel open                                 |
| Active text-shadow var missing in some pages      | Low    | Add a fallback inline shadow if the var is undefined                        |

## Open Questions

- None — all values come from the Figma frame and existing tokens.
