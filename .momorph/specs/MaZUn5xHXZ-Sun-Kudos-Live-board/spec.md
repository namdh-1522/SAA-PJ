# Feature Specification: Sun* Kudos – Live Board

**Frame ID**: `MaZUn5xHXZ` (Figma node `2940:13431`)
**Frame Name**: `Sun* Kudos - Live board`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Figma Link**: https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C/?node-id=2940-13431
**Frame Image**: [assets/frame.png](./assets/frame.png)
**Design Style**: [design-style.md](./design-style.md)
**Created**: 2026-04-26
**Last reviewed**: 2026-04-29 (layout/stack: B_Highlight + Spotlight; B.7 toolbar; header token — see `design-style.md` §Source of truth)
**Last Figma diff check**: 2026-04-29 — `list_frame_spec_diffs(MaZUn5xHXZ)` returned 49 / 52 items unchanged; the 3 deltas were trivial MoMorph metadata-field cleanups with **no behavioural impact**: `B.1.1 ButtonHashtag` and `B.1.2 Button Phong ban` had their source `User Action` (`on_click`) and `Destination` (the dropdown frame ids) cleared, and `C.4 Button` had `Default Value` normalised to `""`. The on-click navigation behaviour for both filter buttons is documented in this spec's *Screen Components* table and remains correct.
**Status**: Draft

---

## Overview

The **Sun\* Kudos – Live Board** is the central, real-time recognition dashboard inside the Sun\* Annual Awards 2025 (SAA) app. It is the first screen authenticated users land on, aggregating the company-wide stream of "Kudos" (peer-to-peer thank-you / recognition posts) and orchestrating the act of writing one, finding a colleague, and exploring trending recognitions.

The board has **four coordinated regions**:

1. **Hero / Bìa** — the brand banner with two primary CTAs (`Ghi nhận` + `Tìm kiếm sunner`).
2. **B_Highlight / Spotlight Board** — featured Kudos carousel (B.1–B.5) with hashtag + department filters, slide pagination; **B.6–B.7** `SPOTLIGHT BOARD` with total counter, **B.7.2** pan/zoom control, **B.7.3** sunner search, and the interactive word cloud.
3. **C_All kudos feed** — paginated list of every public Kudos post with sender / receiver info, content, image attachments, hashtags, hearts, and copy-link.
4. **D_Thống menu phải / Right panel** — personal stats card (received, sent, hearts, secret boxes opened/total + "Mở quà" CTA) and the "10 Sunner nhận quà mới nhất" leaderboard. **Luồng hoạt động / Thông báo content** không còn ở đây — chỉ trong **B.7.4** (canvas Spotlight).

The board is the *hub* of the Kudos feature — it aggregates and routes users to compose (`Viết Kudo`), search (`Tìm kiếm sunner`), detail (`View Kudo`), profile (own / others), and the secret-box flow.

**Target users**: All authenticated Sun\* sunners (employees) participating in SAA 2025. **Admins** see the same board with extended controls in a future iteration (out of scope here).

**Business context**: Drives daily engagement with the recognition program; the more public the recognitions, the higher the cultural multiplier. Heart counts on "special days" are configured by admins to double-weight participation.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — View the live recognition feed (Priority: P1)

A signed-in sunner opens the Live Board and immediately sees the company-wide Kudos feed update in real time, with featured Kudos in the carousel, an "ALL KUDOS" list below, and their own personal stats on the right. They can react, copy a link, and open any Kudo for detail without leaving the page.

**Why this priority**: This is the program's daily-active surface. Without it, there is no "live" in Live Board — users would not see what their colleagues recognised them for, and engagement collapses.

**Independent Test**: Authenticate as a regular user, navigate to `/kudos` (or post-login `/`); verify the Hero, Highlight, All Kudos, and Right Panel sections render with seeded data; verify a new Kudo posted by another user appears at the top of the feed without a manual refresh.

**Acceptance Scenarios**:

1. **Given** the user is authenticated and the feed has ≥ 1 highlight + ≥ 5 posts, **When** the Live Board loads, **Then** all four regions render within 2.5s and the highlight carousel auto-advances every 5s (configurable).
2. **Given** the user is on the Live Board, **When** another sunner publishes a new public Kudo, **Then** the new post is inserted at the top of `C_All kudos` with a 300ms fade/translate animation and the Spotlight counter increments.
3. **Given** the user clicks the heart icon on any KUDO Post, **When** the click is registered, **Then** the heart turns from gray (`#999999`) to red (`#D4271D`), the counter increments by 1 optimistically, and the change is persisted to `/api/kudos/:id/likes`.
4. **Given** the user clicks **Copy link** on a KUDO Post, **When** the click is registered, **Then** the post URL (`/kudos/:id`) is copied to the clipboard and a toast `Link copied — ready to share!` appears for 2s.
5. **Given** any one of the four regions fails to load (e.g. `/highlights` returns 500), **When** the page renders, **Then** that region shows a section-scoped retry message and the other three render normally.

---

### User Story 2 — Compose a new Kudo from the hero (Priority: P1)

A sunner who wants to thank a colleague clicks the prominent `Ghi nhận` pill in the hero, lands on the `Viết Kudo` screen with a pre-focused recipient field, and after submitting returns to the Live Board where their post is visible at the top of the feed.

**Why this priority**: Writing Kudos is the *only* content-generation action of the entire SAA Kudos program; if this CTA is hard to reach, the funnel collapses upstream of all engagement.

**Independent Test**: Click `A.1_Button ghi nhận` (`2940:13449`) → confirm navigation to `/kudos/new` (frame `ihQ26W78P2`); after submit, confirm the new post appears at the top of `C_All kudos` (the writer is also `D.1.3` "Số Kudos đã gửi" +1).

**Acceptance Scenarios**:

1. **Given** the user is on the Live Board, **When** they click `Ghi nhận`, **Then** the app navigates to the Kudos compose screen with focus on the recipient picker.
2. **Given** the user successfully publishes a Kudo and returns to the Live Board, **When** the board re-renders, **Then** the new Kudo appears at the top of `C_All kudos` and `D.1.3 Số Kudos đã gửi` increments by 1 without a hard reload.
3. **Given** the user is unauthenticated and visits `/kudos`, **When** the route loads, **Then** the user is redirected to `Login` (`/`).

---

### User Story 3 — Filter the feed by hashtag or department (Priority: P2)

A sunner exploring the program drops down `B.1.1 #Hashtag` or `B.1.2 Phòng ban` to scope the highlight carousel + the All Kudos feed to a single filter. The selection persists in the URL so the view can be shared.

**Why this priority**: P2 because it improves discovery but the unfiltered feed is already valuable; should ship in MVP+1 if pressed.

**Independent Test**: With ≥ 2 hashtags and ≥ 2 departments seeded, open the dropdown, select one value, verify both `B_Highlight` and `C_All kudos` update, pagination resets to page 1, and the URL contains `?hashtag=<id>` or `?dept=<id>`.

**Acceptance Scenarios**:

1. **Given** the feed is unfiltered, **When** the user selects a hashtag, **Then** both Highlight and All Kudos request `/api/kudos?hashtag=:tag`, the dropdown shows an active state until cleared, and the URL is updated to `?hashtag=:tag`.
2. **Given** a hashtag filter is active, **When** the user clicks the same hashtag chip inside any KUDO Post, **Then** the filter is preserved (no toggle off), and pagination remains stable.
3. **Given** a hashtag and a department filter are both active, **When** the user clears one (e.g. via "All hashtags"), **Then** only the cleared filter is removed; the other persists.
4. **Given** an applied filter returns 0 results, **When** the feed renders, **Then** `C_All kudos` shows the empty state `Hiện tại chưa có Kudos nào.` and the **highlight carousel** is hidden when there are no matching highlights (B.1/B.2 empty); the Spotlight board (B.6/B.7) continues to render.

---

### User Story 4 — View personal stats and open a secret box (Priority: P2)

A sunner glancing at the right panel sees how many Kudos they have received, sent, the number of hearts collected, and how many secret boxes are unopened. When ≥ 1 box is unopened, the gold `Mở quà` CTA is enabled and routes to the `Open secret box` flow.

**Why this priority**: Drives a return-engagement loop (boxes accumulate from receiving Kudos). Useful, but the feed must work first.

**Independent Test**: Seed a user with `kudosReceived=25, kudosSent=25, hearts=1000, secretBoxOpened=25, secretBoxClosed=25`; verify all five values render exactly; click `D.1.8` and verify navigation to frame `1466:7676`.

**Acceptance Scenarios**:

1. **Given** the user has ≥ 1 unopened secret box, **When** the right panel renders, **Then** `D.1.8 Button mở quà` is enabled (solid gold `#FFEA9E`) and clicking it navigates to `Open secret box - chưa mở`.
2. **Given** the user has 0 unopened secret boxes, **When** the right panel renders, **Then** `D.1.8` is **disabled** (opacity 0.40, cursor not-allowed) and clicks are no-ops.
3. **Given** the user opens a secret box during the same session, **When** they return to the board, **Then** `D.1.6 Số Secret Box đã mở` increments by 1 and `D.1.7 Số Secret Box chưa mở` decrements by 1 *without* a full page reload.

---

### User Story 5 — Explore the Spotlight word cloud (Priority: P3)

A sunner browses the `B.7 Spotlight` board, hovers a sunner node to see their name + time-of-Kudos tooltip, clicks to open the Kudos detail, toggles `Pan/Zoom`, and uses `B.7.3` to find a colleague by name within the cloud.

**Why this priority**: P3 — this is a wow-factor visualization that complements the program but is not the path to first value.

**Independent Test**: Open the board with ≥ 50 Kudos seeded; verify "388 KUDOS" counter, hover-tooltip, click-to-detail, pan-and-zoom toggle, and search input (max 100 chars).

**Acceptance Scenarios**:

1. **Given** the Spotlight has loaded, **When** the user hovers a sunner node, **Then** a tooltip with their name and the time of their most recent Kudos appears within 150ms.
2. **Given** the user types a name in `B.7.3 Tìm kiếm sunner`, **When** the input length exceeds 100 chars, **Then** further input is blocked and the focus ring remains.
3. **Given** the Spotlight has 0 Kudos, **When** the section renders, **Then** an empty state replaces the cloud and the counter reads `0 KUDOS`.

---

### User Story 6 — React in real time without refreshing (Priority: P2)

A sunner watching the board sees **B.7.4** (Spotlight canvas, bottom-left) list recent "received a new Kudos" lines and watches heart counts increment when colleagues like the same post.

**Why this priority**: P2 — strong engagement amplifier, but the static board is functional without it.

**Independent Test**: Open two browser sessions as different users; like a post in session A; verify session B's heart count increments via WS within 1.5s; publish a new Kudo in session A; verify session B's **B.7.4 activity rail** and feed both update (rail may refresh via poll until WS is wired to `SpotlightActivityFeed`).

**Acceptance Scenarios**:

1. **Given** WS `/ws/kudos` is connected, **When** another user likes a post, **Then** the count on that post updates within 1.5s without reload, and any optimistic local state is reconciled.
2. **Given** WS receives `kudos.new`, **When** the event arrives, **Then** the post is prepended to the feed and **B.7.4** reflects the new event once the activity query refreshes or WS invalidates it.
3. **Given** identical events arrive within ~1s (deduplication), **When** **B.7.4** renders, **Then** only one entry is shown for that burst.

---

### Edge Cases

- **Long content** — KUDO Post `C.3.5_Content` truncates at **5 lines** with `…`; Highlight `B.4.2_Nội dung` truncates at **3 lines** with `…`. Click on truncated content opens the detail page.
- **Many hashtags** — both `B.4.3` and `C.3.7` show **up to 5 hashtags per line**; overflow truncates with `…`.
- **Many image attachments** — `C.3.6` shows **up to 5 thumbnails**, left-aligned, in a single horizontal row; clicking any thumbnail opens fullscreen.
- **Sender self-like** — a sunner CANNOT heart their own Kudo; the heart button is **disabled** (opacity 0.40) for posts where `sender = currentUser`.
- **Special days** — admin-configurable days double the heart award (each click adds **2** instead of **1**); un-hearting subtracts the exact same amount; DB must distinguish normal vs special-day hearts so reverts subtract the correct value.
- **Empty Highlight** — when `/highlights` returns **0** featured items, **hide only** the highlight carousel block (B.1 filters + B.2–B.5). **Keep** B.6 / B.7 Spotlight visible.
- **Empty leaderboard** — when fewer than 10 gift recipients exist, render available rows; when 0, show `Chưa có dữ liệu`.
- **Carousel edges** — `B.2.1` is disabled at slide 1; `B.2.2` at last slide. Auto-advance increments until the last slide then **holds** (no wrap to slide 1). Auto-advance pauses on hover/focus.
- **Filter cascade** — selecting Hashtag or Phòng ban filters BOTH `B_Highlight` and `C_All kudos` simultaneously and resets pagination to page 1.
- **Hover preview** — hovering a sender or receiver avatar / name (B.3.x, C.3.x, D.3.x) shows the `Hover Avatar info user` (`Bf5XiTE7AO`) overlay after a 300ms delay; clicking the same area routes to the user's profile.
- **Star tier tooltip** — hovering the star count next to a name shows a tooltip whose copy depends on tier: 1★ = "đã nhận được 10 Kudos…", 2★ = "20 Kudos…", 3★ = "50 Kudos…".
- **Auth expiry** — any 401 response from the data layer redirects to `Login` and clears local state.
- **Load more loading state** — when the user clicks "Xem thêm" and the next page is being fetched, the button shows a loading spinner and is disabled; on error it shows a retry label. The button is hidden (not disabled) once all pages are consumed.
- **Load more pagination reset** — changing any filter MUST discard all loaded pages and restart from page 1, collapsing the visible list back to the first page result.
- **Network disconnection** — if the WS disconnects, an unobtrusive inline banner ("Đang kết nối lại…") appears at the top of `C_All kudos`; it auto-dismisses when the WS reconnects.
- **Source-data caveat** — the `B.2.1` and `B.2.2` arrow IDs in `list_design_items` carry swapped descriptions (`Button lùi` vs `Button tiến`). Implementation MUST follow the visual / behavioural meaning (left = previous, right = next), not the field name.

---

## UI/UX Requirements *(from Figma)*

> Visual specifications — colors, typography, spacing, component states — are documented in [design-style.md](./design-style.md). The list below describes *what* each component is and *what it does*; refer to design-style.md for *how it looks*.

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| **Header** (`2940:13433`) | Sticky app header: logo, 3 nav links (Awards Information, Hệ thống giải, Thể lệ), language dropdown, notification button (with red dot when unread), profile avatar | Click logo → home; click nav → routes; click bell → opens `Tất cả thông báo` (`6-1LRz3vqr`); click profile → `Dropdown-profile` (`z4sCl3_Qtk`); click VN → `Dropdown-ngôn ngữ` (`hUyaaugye2`) |
| **Hero / Bìa** (`2940:13434`) | Full-bleed banner with KUDOS wordmark, subtitle "Hệ thống ghi nhận và cảm ơn", and 2 CTAs | – |
| **A.1 Button ghi nhận** (`2940:13449`) | Primary "Write Kudo" CTA pill with pen icon and placeholder text | Click → navigate to `Viết Kudo` (`ihQ26W78P2`) |
| **Tìm kiếm sunner — Hero trigger** (`2940:13450`) | CTA pill in the hero banner (pen icon replaced by search icon) | Click → opens sunner search overlay; no text input on this node — it is a trigger |
| **Tìm kiếm sunner — B.7.3 input** (`2940:14833`) | Text search input inside the Spotlight board (maxLength 100, optional) | Type / Enter / magnifier click → query `/api/sunners?q=...`; focus ring on focus |
| **B.1.1 ButtonHashtag** (`2940:13459`) | Hashtag filter dropdown trigger | Click → opens hashtag dropdown (frame `1002:13013` / route `JWpsISMAaM`); select → applies `?hashtag=` filter to B + C |
| **B.1.2 Button Phòng ban** (`2940:13460`) | Department filter dropdown trigger | Click → opens department dropdown (frame `721:5684` / route `WXK5AYB_rG`); select → applies `?dept=` filter to B + C |
| **B.2.1 / B.2.2 Carousel arrows** (`2940:13470` / `2940:13468`) | Previous / next chevron round buttons | Click → switch active highlight; disabled at edges |
| **B.3 KUDO – Highlight** (`2940:13465`) | Featured Kudo card (cream + 4px gold border): sender → receiver, timestamp, content (≤3 lines), hashtags (red), heart count, copy link, "Xem chi tiết" | Click body → `View Kudo` (`onDIohs2bS`); click avatar/name → `Profile người khác` / `Profile bản thân`; hover avatar → preview overlay; click hashtag chip → set filter; click heart → like / unlike; click copy → clipboard + toast |
| **B.5 Slide bar** (`2940:13471`) | `< 2/5 >` carousel pagination | Click prev / next; disabled at edges |
| **B.6 Header Giải thưởng** (`2940:13476`) | Section header "Sun\* Annual Awards 2025 / SPOTLIGHT BOARD" | Static |
| **B.7 Spotlight canvas** (`2940:14174`) | Dark decorated board: mesh/ribbon washes (`--color-spotlight-canvas-base` + tokens in `design-style.md` §B.7), **B.7.1** counter top-center, **B.7.3** search top-left, **B.7.4** activity rail bottom-left, **B.7.5** fullscreen bottom-right, center word-cloud | Click name → profile; search → `/api/sunners?q=…`; activity line → `View Kudo`; fullscreen → native fullscreen API (exit on second click) |
| **B.7.4 Activity rail** | Latest Kudos lines (seed from `/api/kudos`, format `{time} {receiver} đã nhận được một Kudos mới`) | Same copy pattern as **Thông báo content**; optional WS sync (see FR-014 backlog) |
| **B.7.5 Fullscreen control** | Expand-corner icon, 48×48 target, `var(--color-text-primary)` | Toggle browser fullscreen on canvas |
| **B.7.3 Tìm kiếm sunner** (`2940:14833`) | Search pill **top-left** inside canvas + `MM_MEDIA_Search` (see `SpotlightSearch` `variant="board"`) | Type → query `/api/sunners?q=...`; max 100 chars |
| **B.7.2 Pan/Zoom** (`3007:17479`) | *Deferred / in-canvas (T102)* — không còn nút pill độc lập cùng hàng search trên frame tham chiếu; có thể gộp sau khi fullscreen hoặc zoom canvas D3 | – |
| **C.1 Header Giải thưởng** (`2940:14221`) | Section header "Sun\* Annual Awards 2025 / ALL KUDOS" | Static |
| **C.3 KUDO Post** (`3127:21871`) | Public Kudos card (cream, radius 24): sender + receiver info, time, content (≤5 lines), image gallery (≤5), hashtags, heart, copy link | Same interactions as B.3 (minus "Xem chi tiết") |
| **C.4.1 Hearts** (`I3127:21871;256:5175`) | Heart button + count | Click → optimistic toggle; disabled when sender = currentUser |
| **C.4.2 Copy link** (`I3127:21871;256:5216`) | Copy permalink button | Click → `navigator.clipboard.writeText(url)` + toast |
| **D.1 Thống kê tổng quát** (`2940:13489`) | Personal stats card (5 metrics + Mở quà) | Click card body → `Profile bản thân` (`3FoIx6ALVb`) |
| **D.1.8 Button mở quà** (`2940:13497`) | Solid-gold "Open Gift" CTA | Click → `Open secret box - chưa mở` (`J3-4YFIpMM`); disabled when no unopened boxes |
| **D.3 10 Sunner nhận quà** (`2940:13510`) | Top-10 gift recipients leaderboard | Click row → `Profile người khác` (`w4WUvsJ9KI`); hover → preview |
| **D.4 Hashtag chip** | In-card hashtag (cream surface, dark text) | Click → set filter |
| **Thông báo content** *(alias của **B.7.4**)* | Hoạt động mới nhất trên canvas Spotlight (copy kiểu `"08:30PM … đã nhận được một Kudos mới"`) | Không còn panel ticker dưới D.3; read-only links → `View Kudo` |
| **Footer** | "Bản quyền thuộc về Sun* © 2025" | Static |

### Navigation Flow

- **Incoming**: from `Login` (`GzbNeVGJHz`) on success, header LOGO from any screen, notification tap-through, deep link `/kudos`.
- **Outgoing**: see [SCREENFLOW.md](../../contexts/SCREENFLOW.md) — 15 distinct outgoing edges (Viết Kudo, View Kudo, Tìm kiếm sunner, Profile bản thân, Profile người khác, Open secret box, Tất cả thông báo, dropdowns × 4, header nav targets × 3).
- **Back behaviour**: detail screens push browser history; back returns to the same scroll position and preserves applied filters.
- **Deep-link support**: `?hashtag=:tag&dept=:id&page=:n` is reflected in URL on filter / pagination changes.

### Visual Requirements

- **Responsive breakpoints**: Mobile (<768px) — single column, right panel collapses to accordion below feed. Tablet (768–1279px) — single column, right panel stacks below feed. Desktop (≥1280px) — 2-column main row (`C` 2fr / `D` 1fr). (Aligns with constitution §IV: desktop ≥ 1280px.)
- **Animations / transitions**: see [design-style.md](./design-style.md) → "Animation & Transitions" section. Key behaviours: 5s carousel auto-advance with hover/focus pause, 300ms fade-in for real-time post insertions, 250ms heart toggle pulse, 200ms toast fade.
- **Accessibility (WCAG AA)**:
  - Color contrast for all body text + CTAs ≥ 4.5:1 (gold on dark passes; muted gray restricted to timestamps/dividers).
  - Skip link to `C_All kudos` for keyboard users.
  - Carousel arrows reachable by Tab; Enter activates; ←/→ keys navigate when carousel has focus.
  - All `C.3` cards rendered as `<article>` with `aria-label` "{sender} → {receiver}: {time}".
  - `aria-live="polite"` on the **B.7.4** activity container (when WS-driven updates land) and on the toast region.
  - Hit targets ≥ 48 × 48 px on all interactive elements (Material Design 3 / constitution §IV minimum).
  - Focus trap within any opened dropdown / overlay; Esc closes.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST authenticate-gate the Live Board; unauthenticated requests redirect to `Login` (`/`).
- **FR-002**: System MUST render four independent regions (Hero, Highlight, All Kudos, Right panel); each region MUST tolerate failure of the others (no region blocks paint of the others).
- **FR-003**: System MUST load the All Kudos feed paginated (`limit=20`) with a **"Xem thêm" (Load More) button** at the bottom of the list; pagination resets to page 1 when filters change. The button is hidden when all pages are exhausted.
- **FR-004**: System MUST stream new Kudos via WebSocket (`/ws/kudos`) and prepend `kudos.new` events to the feed within 1.5s.
- **FR-005**: System MUST update heart counts via WS `kudos.liked` events and reconcile optimistic local state.
- **FR-006**: Users MUST be able to like / unlike each Kudo exactly once; sender MUST NOT be able to like their own Kudo.
- **FR-007**: On "special days" (admin-configured), each like adds 2 to the kudos sender's heart total; un-liking subtracts the exact same amount (1 or 2).
- **FR-008**: Users MUST be able to copy a Kudo's permalink to the clipboard; a `Link copied — ready to share!` toast MUST appear for 2s.
- **FR-009**: Users MUST be able to filter both Highlight + All Kudos by `hashtag` and / or `dept`; both filters compose; URL MUST reflect the active filter set.
- **FR-010**: Users MUST be able to open the Kudos compose flow via the hero `Ghi nhận` CTA (US2).
- **FR-011**: Users MUST be able to navigate to a sender / receiver profile by clicking their avatar or name; hover shows a 300ms-delayed preview overlay.
- **FR-012**: System MUST display personal stats (received, sent, hearts, secret boxes opened, secret boxes closed) and update them in-session when an action changes them (e.g. opening a box).
- **FR-013**: System MUST disable `D.1.8 Mở quà` when `secretBoxClosed = 0` (visual: opacity 0.40 + cursor not-allowed).
- **FR-014**: System MUST surface latest-Kudos **activity lines** in **B.7.4** (`SpotlightActivityFeed`): initially from **`/api/kudos?page=1`** (trimmed list); when wired to WS, each `kudos.new` MUST update or invalidate that rail so it stays consistent with the feed. Identical events arriving within ~1s MUST be deduplicated. No duplicate "ticker" block under the right-panel leaderboard (D.3).
- **FR-014b**: `C.3.6` image thumbnails MUST open in a fullscreen modal lightbox (`<ImageLightbox />`) built on **Radix UI Dialog** (`@radix-ui/react-dialog`). The lightbox must support: Esc to close, click-outside to close, keyboard arrow keys to cycle images (when ≥ 2 attachments), and `aria-modal="true"` with focus trap.
- **FR-015**: System MUST truncate Highlight content at 3 lines and All Kudos content at 5 lines with a trailing `…`; both truncated states are clickable to open detail.
- **FR-016**: System MUST limit hashtag display to 5 per line per card and image attachments to 5 thumbnails per card with overflow `…`.
- **FR-017**: System MUST handle empty states: All Kudos → `Hiện tại chưa có Kudos nào.`, Right panel lists → `Chưa có dữ liệu`, Highlight carousel (0 featured items) → hide B.1–B.5 only; **Spotlight (B.6–B.7) MUST remain**.
- **FR-018**: System MUST support deep links `/kudos?hashtag=…&dept=…&page=…` and restore filter + pagination from the URL on first paint.
- **FR-019**: System MUST emit analytics events on screen view, filter applied, card click, like toggled, link copied, compose started, sunner search opened, open-gift clicked.
- **FR-020**: System MUST localize all visible strings via `next-intl`; the language is selectable from the header `Language` dropdown (`hUyaaugye2`).

### Technical Requirements

- **TR-001 (Performance)**: Time-to-interactive ≤ 2.5s on a fresh navigation from Login (P95, desktop, broadband). LCP ≤ 1.8s. Avoid blocking paint on the slowest of the four data streams.
- **TR-002 (Real-time)**: WS connection MUST auto-reconnect with exponential backoff (max 30s). On reconnect, SHOULD reconcile any missed events via `since=:lastTs` query.
- **TR-003 (Auth)**: All API calls MUST include the Supabase session JWT; 401 responses redirect to `/login`.
- **TR-004 (Caching)**: TanStack Query for `/highlights`, `/kudos`, `/users/me/stats`, `/sunners/top`, `/hashtags`, `/departments` with stale-while-revalidate (5 min) and per-user keying.
- **TR-005 (Accessibility)**: WCAG AA compliance for all visible text + interactive elements; Lighthouse a11y score ≥ 95.
- **TR-006 (i18n)**: All user-facing strings live in `messages/{locale}/kudos.json`; default locale `vi`, fallback `en`.
- **TR-007 (Icons)**: All icons rendered via the shared `<Icon name="…" />` component — no inline SVG / `<img>` tags.
- **TR-008 (Theme)**: All colors must use `--Details-*` CSS variables to preserve parity with Figma variables.
- **TR-009 (Optimistic UI)**: Heart toggle is optimistic; rolled back on API failure with a toast.
- **TR-010 (Mobile / Responsive)**: Right panel becomes an accordion below the feed at <768px; carousel uses swipe gestures. 2-column layout triggers at ≥1280px (constitution §IV). Minimum supported width: 360px (mobile).
- **TR-011 (RLS)**: RLS MUST be enabled on all Supabase tables (`kudos`, `hearts`, `secret_boxes`, `notifications`). Application-layer guards alone are insufficient (constitution §V).
- **TR-012 (RSC / Client boundary)**: Pages and layouts default to React Server Components. `'use client'` MUST only be added to components that require browser APIs or interactivity: `<AllKudosFeed />` (infinity scroll + WS), `<HeartButton />`, `<CopyLinkButton />`, `<HighlightCarousel />`, `<SpotlightBoard />`, `<HashtagFilter />`, `<DepartmentFilter />`. Static regions (`<Header />`, `<Hero />`, `<Footer />`) should be RSC where possible.
- **TR-013 (Imports)**: All cross-folder imports MUST use the `@/*` root-relative path alias. Deep relative paths (`../../..`) are FORBIDDEN (constitution §I).
- **TR-014 (Font loading)**: `next/font` MUST be used to load `Montserrat`, `Montserrat Alternates`, and `SVN-Gotham`. No external `<link>` font imports (constitution §II). `SVN-Gotham` is a custom font — load via `next/font/local`.
- **TR-015 (Design tokens)**: Hard-coding raw color / spacing / radius values in component files is FORBIDDEN. All values MUST be declared as CSS variables consumed via Tailwind utilities (constitution §II). The `--Details-*` variable set in `design-style.md` maps 1-to-1 to Tailwind config entries.

### Key Entities *(if feature involves data)*

- **User (Sunner)**: id, name, email, avatar (Google), department, role (regular / admin), starTier (0–3), createdAt.
- **Kudos**: id, senderId, receiverId, content (text), images (≤5 URLs), hashtags (string[]), createdAt, heartCount, hearts (Heart[]), isHighlight (bool, derived), department (denormalised receiver dept).
- **Heart**: id, kudosId, userId, weight (1 | 2), createdAt — `weight=2` on admin-configured special days; one Heart per (kudosId, userId).
- **Hashtag**: id, label, slug, useCount, isTrending (derived).
- **Department**: id, name, slug.
- **SecretBox**: id, ownerId, awardedFor (kudosId | event), opened (bool), openedAt, contentRef.
- **Notification**: id, userId, type, payload, readAt, createdAt.
- **TickerEvent**: id, type (`kudos.new` | `kudos.liked` | `secretBox.opened`), payload, ts.

Relationships:
- `Kudos.senderId → User.id`, `Kudos.receiverId → User.id`.
- `Heart.kudosId → Kudos.id`, `Heart.userId → User.id`, unique `(kudosId, userId)`.
- `SecretBox.ownerId → User.id`.
- `Hashtag` is many-to-many with `Kudos` via a join table.

### State Management

#### Local Component State

| State | Type | Initial | Owned By |
|-------|------|---------|----------|
| `highlightIndex` | `number` | `0` | `<HighlightCarousel />` |
| `feedPage` | `number` | `1` | `<AllKudosFeed />` — increments on "Xem thêm" click; resets to 1 on filter change |
| `activeHashtag` | `string \| null` | URL `?hashtag` or `null` | `useFilters()` hook |
| `activeDept` | `string \| null` | URL `?dept` or `null` | `useFilters()` hook |
| `likedMap` | `Record<string, boolean>` | `{}` | `<HeartButton />` (optimistic) |
| `copyToastVisible` | `boolean` | `false` | `<CopyLinkButton />` |
| `isSearchOverlayOpen` | `boolean` | `false` | `<SunnerSearchTrigger />` |
| `spotlightPanZoom` | `boolean` | `false` | `<SpotlightBoard />` |

#### Global / Server State (TanStack Query)

| Key | Source | Staletime | Notes |
|-----|--------|-----------|-------|
| `['kudos', 'highlights', filters]` | `/api/kudos/highlights` | 5 min | Invalidated on WS `kudos.new` |
| `['kudos', 'feed', page, filters]` | `/api/kudos` | 5 min | Appended on infinity scroll; invalidated on new WS post |
| `['kudos', 'total']` | `/api/kudos/stats/total` | 5 min | Incremented on WS `kudos.new` |
| `['users', 'me']` | `/api/users/me` | session | Auth-scoped; keyed per user ID |
| `['users', 'me', 'stats']` | `/api/users/me/stats` | 2 min | Invalidated on `secretBox.opened` WS event |
| `['sunners', 'top']` | `/api/sunners/top` | 10 min | Top 10 gift recipients |
| `['hashtags', 'trending']` | `/api/hashtags` | 10 min | Dropdown + filter options |
| `['departments']` | `/api/departments` | 1 hr | Static-ish; rarely changes |
| `['notifications', 'unread']` | `/api/notifications?unread=true` | 1 min | Header bell badge |

#### WebSocket Store (`wsStore`)

| Channel | Events | Subscribers |
|---------|--------|-------------|
| `/ws/kudos` | `kudos.new` → prepend feed + increment total; `kudos.liked` → update heartCount on card; `secretBox.opened` → invalidate `users/me/stats` | Feed + carousel/highlight consumers; right panel (stats); **B.7.4** when wired |

> Filter state (`activeHashtag`, `activeDept`, `feedPage`) is the single source of truth for both Highlight and All Kudos — managed by a single `useFilters()` hook that syncs with URL search params.

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/users/me` | GET | Current user (header avatar + right-panel context) | Predicted (new) |
| `/api/users/me/stats` | GET | Personal totals: kudos received, sent, hearts, boxes open/closed | Predicted (new) |
| `/api/kudos` | GET | Paginated public feed (`?page&limit&hashtag&dept`) for `C_All kudos`; page 1 also seeds **B.7.4** (`SpotlightActivityFeed`) | Predicted (new) |
| `/api/kudos/highlights` | GET | Featured Kudos for `B_Highlight` carousel (filterable by hashtag/dept) | Predicted (new) |
| `/api/kudos/stats/total` | GET | Global counter `388 KUDOS` for `B.7.1` | Predicted (new) |
| `/api/kudos/:id` | GET | Single Kudo detail (used by `View Kudo`) | Predicted (new) |
| `/api/kudos/:id/likes` | POST / DELETE | Like / unlike a Kudo (response `{liked: bool, count: number}`) | Predicted (new) |
| `/api/sunners/top?limit=10&metric=gift` | GET | "10 Sunner nhận quà mới nhất" leaderboard for `D.3` | Predicted (new) |
| `/api/sunners?q=…` | GET | Sunner search results (used by hero, B.7.3) | Predicted (new) |
| `/api/hashtags?scope=trending` | GET | Hashtag dropdown options + chip cloud | Predicted (new) |
| `/api/departments` | GET | Department dropdown options | Predicted (new) |
| `/api/notifications?unread=true` | GET | Unread count → header bell badge | Predicted (new) |
| `/api/me/secret-boxes/next` | GET | Next unopened secret box (drives `Open secret box`) | Predicted (new) |
| `/ws/kudos` | WebSocket | Subscribe `kudos.new`, `kudos.liked`, `secretBox.opened` for the current user | Predicted (new) |

> All endpoints are **predicted** based on the UI; confirm contract with backend during the planning phase. WebSocket schema must define event envelope `{ type, ts, payload }` with payload typed per event.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Time-to-interactive on the Live Board ≤ 2.5s (P95, desktop, broadband).
- **SC-002**: Real-time event propagation (`kudos.new`, `kudos.liked`) ≤ 1.5s end-to-end (P95).
- **SC-003**: Hero `Ghi nhận` CTA conversion ≥ 8% of unique visitors per day during the SAA campaign.
- **SC-004**: Daily-active users (DAU) on the Live Board reach ≥ 60% of the active sunner population during the campaign window.
- **SC-005**: Filter usage (any hashtag / dept selection) reaches ≥ 15% of unique sessions per day.
- **SC-006**: Heart-toggle reliability — server-confirmed mismatch with optimistic UI ≤ 0.5% of click events.
- **SC-007**: Lighthouse a11y score ≥ 95 on the Live Board route.
- **SC-008**: Zero "blank page" failures: with any one of `/highlights`, `/kudos`, `/me/stats`, `/sunners/top` failing, the other three regions still render successfully ≥ 99% of the time.

---

## Out of Scope

- **Admin-only controls** (configuring special days, moderating Kudos, banning users) — separate Admin board.
- **Kudos compose / detail pages** — covered by `Viết Kudo` (`ihQ26W78P2`) and `View Kudo` (`onDIohs2bS`) specs.
- **Open secret box flow** — covered by `Open secret box - chưa mở` (`J3-4YFIpMM`).
- **Profile pages** (`Profile bản thân` `3FoIx6ALVb`, `Profile người khác` `w4WUvsJ9KI`) — separate specs.
- **Notification list** (`Tất cả thông báo` `6-1LRz3vqr`) — separate spec.
- **Mobile native apps** — separate `[iOS] Sun*Kudos` frames; this spec is web only.
- **Analytics dashboard / reports** — out of scope.
- **Email digest of received Kudos** — future enhancement.
- **SSR for the real-time feed** — WS-connected regions (feed hearts, future B.7.4 WS) are inherently client-side; RSC handles static shell; SSR of the full personalised right panel is a future optimisation.

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`) — endpoints listed above are PREDICTED; backend confirmation required
- [ ] Database design completed (`.momorph/database.sql`) — Key Entities listed above
- [x] Screen flow documented (`.momorph/contexts/SCREENFLOW.md`)
- [x] Screen-level discovery doc (`.momorph/contexts/screen_specs/sun-kudos-live-board.md`)
- [x] Design style document ([design-style.md](./design-style.md))
- [ ] Login screen contract finalized (`.momorph/specs/GzbNeVGJHz-Login`) — drives the redirect contract
- [ ] Compose / Detail screen specs (`Viết Kudo`, `View Kudo`) — receive navigation from this board
- [ ] Open Secret Box screen spec (`J3-4YFIpMM`) — receives navigation from `D.1.8`
- [ ] Shared `<Icon />` component library
- [ ] Supabase Realtime channel `/ws/kudos` provisioned
- [ ] `next-intl` keys in `messages/{vi,en}/kudos.json`

---

## Notes

- **Source-data caveat**: `list_design_items` does not include the Header (`mms_A_Header`), the Hero KUDOS title text node, the Footer, **B.7.4** activity copy (historically conflated with `Thông báo content`), the `D.2` "10 SUNNER CÓ SỰ THĂNG HẠNG MỚI NHẤT" list, or per-variant differences for `C.5/6/7`. These were inferred from the screen-flow discovery doc + the rendered Figma image. Pull `get_frame_node_tree` if a deeper extraction is needed during implementation.
- **Naming swap**: The arrow IDs in `B.2` (`2940:13470` and `2940:13468`) carry mismatched description / name fields in the source data ("Button lùi" vs "Button tiến"). Use the visual / behavioural meaning when implementing.
- **No drop-shadows**: All cards rely on flat fills + 1px gold borders for elevation. Do not add `box-shadow` for "depth" — it breaks the design language.
- **Hashtag color shifts by surface**: red `#D4271D` on cream highlight cards, dark `#00101A` on cream post cards. This is intentional contrast.
- **Filter cascade is non-trivial**: hashtag and department filters must compose, persist in URL, propagate to BOTH highlight and feed, and reset pagination atomically. Treat as a single `useFilters()` hook.
- **Auto-advance carousel** must pause on hover and on `:focus-within` for keyboard users; resume on blur after a 2s grace period.
- **Card-level optimism**: heart and copy-link should never block on the network; rollback on error with a toast.
- **Real-time / cache reconciliation**: when a WS event arrives, update both the active TanStack query cache AND any optimistic mutation state — never trust just one side.
- **Same-component `D.4` placement caveat**: in `list_design_items`, `D.4_hashtag` lives *inside* `C.3_KUDO Post`, not as a separate hashtag cloud under `D`. The "hashtag cloud" mentioned in the screen-flow doc is rendered per-card, not as a panel — implement accordingly.
- **Route**: Canonical route is `/kudos` (confirmed). The contexts-level `SCREENFLOW.md` entry `/sun-kudos` should be treated as stale and updated.
- **`SVN-Gotham` loading**: Custom/licensed font — load via `next/font/local` pointing to a committed font file. Never use a public CDN link (constitution §II + §V).
- **Desktop breakpoint**: 2-column layout triggers at ≥ 1280px (constitution §IV). Tablet range is 768–1279px (single column).
- **D.2 "10 SUNNER CÓ SỰ THĂNG HẠNG MỚI NHẤT"**: Referenced in the D parent description but no `D.2.x` nodes were returned by `list_design_items`. Treat as **TBD** — confirm existence and layout with the design team before implementation. Do not block implementation of D.1 and D.3.
- **Lightbox**: Image fullscreen uses `<ImageLightbox />` built on `@radix-ui/react-dialog`. Add `@radix-ui/react-dialog` to approved dependencies if not already present (constitution §II: new dependencies require team approval + Technology Stack update).
- **Activity / WS**: **B.7.4** SHOULD eventually subscribe to `kudos.new` on `/ws/kudos` (same channel as the feed) for instant updates; polling-only MVP is acceptable until then.
