# Spec: Dropdown Hashtag filter

**Frame ID**: `JWpsISMAaM` (root node `721:5580`)
**Frame Name**: `Dropdown Hashtag filter`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Parent Screen**: Sun* Kudos – Live Board (`MaZUn5xHXZ`) — used as filter `B.1.1 Hashtag` inside the Highlight Kudos section header.

## Overview

A floating list dropdown that lets the user filter the Kudos feed and Highlight carousel by hashtag. Shows all hashtags returned by `GET /api/hashtags` plus an "All hashtags" option. Replaces the native `<select>` currently used for the hashtag filter so we can render the active item with the design's gold-glow text-shadow — something native `<option>` cannot deliver. Mirrors the already-built `<KudosDeptDropdown>` (Figma `WXK5AYB_rG`); the only differences are the data source (hashtags vs. departments) and the `#` prefix on each row label.

## User Stories

### US1 — Filter Kudos by hashtag [P1]

**As a** Sun* employee browsing the Kudos board
**I want to** pick a hashtag from a dropdown
**So that** the Highlight carousel and All Kudos feed only show kudos tagged with that hashtag.

**Acceptance Scenarios**

- **Open**: Click on the trigger pill → the dropdown panel opens directly under the trigger, list of hashtags visible (each prefixed with `#`).
- **Select**: Click any hashtag row → the URL updates (`?hashtag=<name>`), the panel closes, the trigger label changes to `#<name>`, and the feed/highlight queries refetch with the new filter (no full page reload).
- **Clear**: Click the "Tất cả hashtag" row → `?hashtag` is removed from the URL and all hashtags are shown again.
- **Active state**: The currently-selected row in the open panel has a gold-soft background `rgba(255,234,158,0.10)` AND a gold-glow text-shadow `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287`.
- **Click-outside / Esc**: Clicking outside the panel or pressing `Esc` closes it without changing the selection.
- **Keyboard**: `↑/↓` move focus through items, `Enter`/`Space` select the focused item, `Tab` cycles to the next focusable trigger.

## UI Components

- `<KudosHashtagDropdown>` — Client Component. Trigger pill (matches existing `KudosFilters` department pill) + popover list. Reuses pill styling tokens (`--color-kudos-pill-idle`, `--color-kudos-border`).
- Internal panel — the floating list, `role="listbox"`.
- Internal item — each row, `role="option"`, `aria-selected` reflects active state.

See `design-style.md` for visual values.

## Data Requirements

- Hashtags: from `GET /api/hashtags` (existing). Each row contains `{ id, name, usageCount }`.
- Active value: `hashtag` from URL `?hashtag=<name>` (existing `useKudosFilters`).

## API Requirements

No new endpoints. Existing `/api/hashtags` and the filter integration in `useKudosFilters` are sufficient.

## State Management

- Local `isOpen` state for the popover (controlled inside `KudosHashtagDropdown`).
- Active value comes from the URL via `useKudosFilters().hashtag`.
- TanStack Query keeps the hashtag list cached (`['kudos-hashtags']`).

## Edge cases

- **0 hashtags returned** → the trigger pill is hidden (mirrors the dept dropdown gating in `KudosFilters`).
- **Long hashtag name** → trigger label truncates with ellipsis; panel rows wrap onto two lines if needed (max-width matches the panel).
- **Mobile (< 768px)** → trigger spans full width of its filter row; panel uses the same min-width as the trigger (right-aligned within the section header).

## Accessibility

- Trigger: `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`.
- Panel: `role="listbox"`, `aria-label="Hashtag"`.
- Each row: `role="option"`, `aria-selected={isActive}`.
- Focus management: focus moves into the panel on open, returns to trigger on close.
- Esc closes; click-outside closes.
