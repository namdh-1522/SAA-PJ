# Spec: Dropdown Phòng ban

**Frame ID**: `WXK5AYB_rG` (root node `721:5684`)
**Frame Name**: `Dropdown Phòng ban`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Parent Screen**: Sun* Kudos – Live Board (`MaZUn5xHXZ`) — used as filter `B.1.2 Phòng ban` inside the Highlight Kudos section header.

## Overview

A floating list dropdown that lets the user filter the Kudos feed and Highlight carousel by `department_code`. Shows all active departments returned by `GET /api/departments` plus an "All departments" option. Replaces the native `<select>` currently used for the department filter so we can render the active item with the design's gold-glow text-shadow — something native `<option>` cannot deliver.

## User Stories

### US1 — Filter Kudos by department [P1]

**As a** Sun* employee browsing the Kudos board
**I want to** pick a department from a dropdown
**So that** the Highlight carousel and All Kudos feed only show kudos for receivers in that department.

**Acceptance Scenarios**

- **Open**: Click on the trigger pill → the dropdown panel opens directly under the trigger, list of departments visible.
- **Select**: Click any department row → the URL updates (`?dept=<code>`), the panel closes, the trigger label changes to the selected department name, and the feed/highlight queries refetch with the new filter (no full page reload).
- **Clear**: Click the "Tất cả phòng ban" row → `?dept` is removed from the URL and all departments are shown again.
- **Active state**: The currently-selected row in the open panel has a gold-soft background `rgba(255,234,158,0.10)` AND a gold-glow text-shadow `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287`.
- **Click-outside / Esc**: Clicking outside the panel or pressing `Esc` closes it without changing the selection.
- **Keyboard**: `↑/↓` move focus through items, `Enter`/`Space` select the focused item, `Tab` cycles to the next focusable trigger.

## UI Components

- `<KudosDeptDropdown>` — Client Component. Trigger pill (matches existing `KudosFilters` hashtag pill) + popover list. Reuses pill styling tokens (`--color-kudos-pill-idle`, `--color-kudos-border`).
- `<KudosDropdownPanel>` (internal) — the floating list, `role="listbox"`.
- `<KudosDropdownItem>` (internal) — each row, `role="option"`, `aria-selected` reflects active state.

See `design-style.md` for visual values.

## Data Requirements

- Departments: from `GET /api/departments` (existing). Each row contains `{ id, code, name }`.
- Active value: `department_code` from URL `?dept=<code>` (existing `useKudosFilters`).

## API Requirements

No new endpoints. Existing `/api/departments` and the filter integration in `useKudosFilters` are sufficient.

## State Management

- Local `isOpen` state for the popover (controlled inside `KudosDeptDropdown`).
- Active value comes from the URL via `useKudosFilters().dept`.
- TanStack Query keeps the departments list cached (`['kudos-departments']`).

## Edge cases

- **0 departments returned** → the trigger pill is hidden (current `KudosFilters` already gates on `departments.length > 0`).
- **Long department name** → trigger label truncates with ellipsis; panel rows wrap onto two lines if needed (max-width matches the panel).
- **Mobile (< 768px)** → trigger spans full width of its filter row; panel uses the same min-width as the trigger (right-aligned within the section header).

## Accessibility

- Trigger: `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`.
- Panel: `role="listbox"`, `aria-label="Phòng ban"`.
- Each row: `role="option"`, `aria-selected={isActive}`.
- Focus management: focus moves into the panel on open, returns to trigger on close.
- Esc closes; click-outside closes.
