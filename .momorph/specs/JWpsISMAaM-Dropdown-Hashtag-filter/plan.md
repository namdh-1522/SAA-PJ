# Implementation Plan: Dropdown Hashtag filter

**Frame**: `JWpsISMAaM-Dropdown-Hashtag-filter`
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
| No new dependencies          | Mirrors the click-outside / Esc pattern already proven in `KudosDeptDropdown` and `avatar-menu.tsx` | ✅ Compliant |

## Architecture Decisions

- **Same custom popover pattern as `KudosDeptDropdown`**: the dept dropdown (Figma `WXK5AYB_rG`) already implements every interaction this hashtag dropdown needs (open/close, click-outside, Esc, keyboard nav, active-row glow). We mirror the file structure rather than introducing a new abstraction.
- **No shared base component yet**: extracting a generic `<KudosListDropdown<T>>` would be premature — there are only two consumers, the data shapes are different (`Hashtag` vs `Department`), and the row label rendering differs (`#<name>` vs `<name>`). The duplication is small and obvious; if a third consumer appears, then refactor.
- **Trigger pill stays in `KudosFilters.tsx`**: only the dropdown body is extracted. The native `<select>` for hashtag is removed entirely (no design needs it).
- **Active state**: applied conditionally via `aria-selected` data binding rather than via a class swap, so screen readers + visual diff are sourced from the same flag.
- **Listbox semantics**: `role="combobox"` on trigger, `role="listbox"` on the panel `<ul>`, `role="option"` on each `<li>`.

## Project Structure

### New files

| File                                                                                | Purpose                                              |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `components/kudos/highlight/KudosHashtagDropdown.tsx`                               | Trigger pill + popover panel + items                 |
| `tests/unit/kudos/kudos-hashtag-dropdown.test.tsx`                                  | Render + open/close + select + a11y unit tests       |
| `.momorph/specs/JWpsISMAaM-Dropdown-Hashtag-filter/spec.md`                         | Feature spec (this iteration)                        |
| `.momorph/specs/JWpsISMAaM-Dropdown-Hashtag-filter/design-style.md`                 | Visual / token map                                   |
| `.momorph/specs/JWpsISMAaM-Dropdown-Hashtag-filter/plan.md`                         | This file                                            |
| `.momorph/specs/JWpsISMAaM-Dropdown-Hashtag-filter/tasks.md`                        | Ordered task list                                    |

### Modified files

| File                                                | Change                                                                  |
| --------------------------------------------------- | ----------------------------------------------------------------------- |
| `components/kudos/highlight/KudosFilters.tsx`       | Replace native `<select>` for hashtags with `<KudosHashtagDropdown>`    |

### Existing tokens reused (no CSS variable additions needed)

- `--color-kudos-bg-panel: #00070C`
- `--color-kudos-pill-idle: rgba(255, 234, 158, 0.10)`
- `--color-kudos-border: #998C5F`
- `--text-shadow-active: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` (already verified for the dept dropdown)
- `--radius-sm: 8px`, `--radius-xs: 4px`

## Implementation Approach

### Phase 1 — Component
1. Build `KudosHashtagDropdown` with controlled `isOpen` state, click-outside + Esc dismissal (mirrors `KudosDeptDropdown`).
2. Render the trigger pill with the same class set used by the dept dropdown so the two filters look identical when closed.
3. Render the popover list inside an `absolute` element positioned `top-full right-0 mt-2`.
4. Each row: `<li role="option" aria-selected={isActive}>`. Active state applies the gold-soft bg + text-shadow via inline style.
5. Row label is `#${hashtag.name}` (the leading `#` is part of the label, not the data value — `value=null` selects "All hashtags").
6. Keyboard: ↑/↓ moves focused index, Enter/Space selects, Esc closes. Focus moves into the panel on open and back to the trigger on close.

### Phase 2 — Wiring
1. In `KudosFilters.tsx`, swap the hashtag `<div className={wrapClass}><select>…</select>…</div>` block for `<KudosHashtagDropdown hashtags={hashtags} value={hashtag} onChange={setHashtag} />`. Gate on `hashtags.length > 0` to mirror the dept dropdown's gating.

### Phase 3 — Tests
1. Unit test (Vitest + RTL): renders trigger; clicking trigger opens the panel; clicking an item calls `onChange(name)` and closes the panel; Esc closes; the active item has `aria-selected="true"`; "Tất cả hashtag" calls `onChange(null)`.

### Phase 4 — Validation
1. Run `npx tsc --noEmit` and `npm run test -- tests/unit/kudos/kudos-hashtag-dropdown.test.tsx` (and the wider unit suite as a regression sweep).

## Testing Strategy

| Type        | Focus                                              | Coverage                                  |
| ----------- | -------------------------------------------------- | ----------------------------------------- |
| Unit (RTL)  | Open / close / select / Esc / a11y attributes      | All branches in `KudosHashtagDropdown`    |
| Integration | None new — reuses `useKudosFilters` (already covered) | n/a                                    |
| E2E         | Existing Highlight diagnostic Playwright spec covers the section header — no new spec required for this iteration | — |

## Risk Assessment

| Risk                                              | Impact | Mitigation                                                                 |
| ------------------------------------------------- | ------ | -------------------------------------------------------------------------- |
| Click-outside can race with React's onClick path  | Medium | Use `mousedown` listener (matches `KudosDeptDropdown`) so click-outside fires before the new click resolves |
| Two near-identical components drift over time     | Low    | If a 3rd dropdown lands, extract a shared `<KudosListDropdown<T>>` then. Keep the diff between this file and `KudosDeptDropdown` minimal |
| Focus management broken on iOS Safari             | Low    | Use `requestAnimationFrame(focus)` after panel open (already does)         |

## Open Questions

- None — all values come from the Figma frame and existing tokens.
