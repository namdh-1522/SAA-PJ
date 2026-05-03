# Screen: Sun* Kudos - Live board

## Screen Info

| Property | Value |
|----------|-------|
| **Figma Frame ID** | `MaZUn5xHXZ` (node `2940:13431`) |
| **Figma Link** | https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C/?node-id=2940-13431 |
| **Screen Group** | Kudos / Main Application |
| **Status** | discovered |
| **Discovered At** | 2026-04-26 |
| **Last Updated** | 2026-04-29 |

---

## Description

The **Sun\* Kudos – Live board** is the central live dashboard of the Sun\* Kudos
recognition system inside the SAA (Sun\* Annual Awards) 2025 app. It aggregates,
in real time, the company-wide stream of "Kudos" (peer-to-peer thank-you / praise
posts) and presents three coordinated regions:

1. **Top hero / Bìa** — Brand banner with two primary CTAs: write a Kudos
   ("Ghi nhận") and find a colleague ("Tìm kiếm sunner").
2. **Highlight / Spotlight Board (`B_Highlight`)** — Carousel of featured
   Kudos with hashtag / department filters; **stacked with** `SPOTLIGHT BOARD`
   (counter **B.7.1**, pan/zoom **B.7.2**, search **B.7.3**, word cloud). When
   there are no featured items, the carousel + filter header are omitted; Spotlight
   stays visible. Detailed token/spec: `.momorph/specs/MaZUn5xHXZ-Sun-Kudos-Live-board/design-style.md`.
3. **All Kudos feed (`C_All kudos`)** — Paginated list of every public Kudos
   post with sender / receiver info, content, hashtags, hearts and copy-link
   actions.
4. **Right-side personal panel (`D_Thống menu phải`)** — Personal stats for
   the logged-in user (Kudos received, Kudos sent, hearts, secret boxes
   opened/unopened, "open gift" CTA) plus a "10 Sunner nhận quà" leaderboard
   and a hashtag cloud. **Recent "Thông báo content" activity** lives only in
   **B.7.4** (Spotlight canvas), not under D.3.

The screen is the entry point most users land on after login; it is the source
of navigation to the Kudos compose flow, the Sunner search, and individual
Kudos detail / open-gift screens.

---

## Navigation Analysis

### Incoming Navigations (From)

| Source Screen | Trigger | Condition |
|---------------|---------|-----------|
| Login (`GzbNeVGJHz`) | Successful Google OAuth → POST_AUTH_REDIRECT | Authenticated |
| Header LOGO (any screen) | Click logo | Authenticated |
| Header nav link "Sun\* Kudos" / "ALL KUDOS" | Click | Authenticated |
| Notification (`D_jgDqvIc8`) → "đã nhận được một Kudos mới" | Tap notification | Authenticated |

### Outgoing Navigations (To)

| Target Screen | Trigger Element | Node ID | Confidence | Notes |
|---------------|-----------------|---------|------------|-------|
| Viết Kudo (`ihQ26W78P2`) | `A.1_Button ghi nhận` ("Ghi nhận / Write Kudo") | `2940:13449` | high | Clear instance name + pen icon (`MM_MEDIA_Pen`) — primary "create Kudos" CTA |
| Tìm kiếm sunner (search Sunner overlay) | `Tìm kiếm sunner` button (top) | `2940:13450` | high | Explicit text + search icon (`MM_MEDIA_Search`) |
| Tìm kiếm sunner (in Spotlight) | `B.7.3_Tìm kiếm sunner` | (in `B.7_Spotlight`) | high | Same destination; secondary entry point |
| Homepage SAA (`i87tDx10uM`) | Header nav link `Awards Information Navigation Links` (1st) | `I2940:13433;186:1579` | medium | Generic text — likely the SAA / Awards landing page |
| Hệ thống giải (`zFYDgyj_pD`) | Header nav link `Awards Information Navigation Links` (2nd) | `I2940:13433;186:1587` | medium | Header nav targets are the Awards / About links shared with Login |
| Thể lệ (`b1Filzi9i6`) | Header nav link (3rd) | `I2940:13433;186:1593` | medium | Inferred — common header set across SAA |
| Dropdown-ngôn ngữ (`hUyaaugye2`) | `Language` instance ("VN") | `I2940:13433;186:1696` | high | Reuses the same language dropdown component as Login |
| Notification list / `Tất cả thông báo` (`6-1LRz3vqr`) | `Notification` icon w/ `Badge/Dot` | `I2940:13433;186:2101` | high | Bell icon with unread dot — opens notifications |
| Dropdown-profile (`z4sCl3_Qtk`) | Profile / avatar button (right of header) | `I2940:13433;186:1597` | medium | Header rightmost icon button — convention is profile menu |
| Dropdown Hashtag filter (`JWpsISMAaM`) | `B.1.1_ButtonHashtag` | inside `B.1_header` | high | "ButtonHashtag" name + dropdown chevron |
| Dropdown Phòng ban (`WXK5AYB_rG`) | `B.1.2_Button Phong ban` | inside `B.1_header` | high | "Phòng ban" = department dropdown |
| KUDO - Highlight (`n56Yyp7Klu`) detail | `B.3_KUDO - Highlight` card click / `B.3.4_Icon mũi tên` arrow | inside `B_Highlight` | medium | Arrow icon suggests "view details" |
| (carousel control, not navigation) | `B.2.1_Button lùi`, `B.2.2_Button tiến` | inside `B_Highlight` | high | In-page carousel prev / next |
| (carousel control, not navigation) | `B.5.1_Button lùi`, `B.5.3_Button tiến` | inside `B.5_slide` | high | Spotlight slide controls |
| View Kudo (`onDIohs2bS`) | `C.3_KUDO Post` card body click | each `C.3*` instance | medium | Posts are typically tappable for detail |
| Profile người khác (`w4WUvsJ9KI`) | `C.3.1_Thông tin người gửi` / `C.3.3_Thông tin người nhận` (avatar / name) | inside each post | medium | Sender / receiver avatar standard pattern |
| Hover Avatar info user (`Bf5XiTE7AO`) | Hover on sender / receiver avatar | inside post header | high | Existing dedicated hover overlay design |
| (in-page reaction, not navigation) | `C.4.1_Hearts` heart button | `C.4_Button` | high | Like / unlike in place |
| (in-page action, not navigation) | `C.4.2_Copy link button` | `C.4_Button` | high | Copies post URL to clipboard |
| Profile bản thân (`3FoIx6ALVb`) | `D.1_Thống kê tổng quat` summary card | right panel | medium | Personal stats often deep-link to own profile |
| Open secret box - chưa mở (`J3-4YFIpMM`) | `D.1.8_Button mở quà` ("Open Gift") | right panel | high | Explicit gift-open CTA + `MM_MEDIA_Open Gift` |
| Profile người khác (`w4WUvsJ9KI`) | `D.3.x_Thông tin Sunner nhận quà` rows | "10 SUNNER nhận quà" leaderboard | medium | Each row is a sunner avatar + name |
| Dropdown Hashtag filter (`JWpsISMAaM`) | `D.4_hashtag` cloud chip click | right panel | medium | Hashtag click typically filters the feed |
| `/` (Login on logo, when unauth) or refresh | `LOGO` instance | `I2940:13433;178:1033` | medium | Logo click = home (Live board itself when authed) |

### Navigation Rules

- **Back behavior**: Browser back / system back — most actions open modals or
  push routed sub-screens that return here.
- **Deep link support**: Yes — `/kudos` (or `/` post-auth). Hashtag and
  department filters should be query-stringable (`?hashtag=...&dept=...`).
- **Auth required**: **Yes**. Unauthenticated users MUST be redirected to
  `Login` (`/`).

---

## Component Schema

### Layout Structure

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER (mms_A_Header)                                           │
│  [LOGO] [NavLinks ×3]              [Lang VN][Bell•][Profile]     │
├──────────────────────────────────────────────────────────────────┤
│  KEYVISUAL (full-bleed background) + Bìa                         │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │  KUDOS  —  Hệ thống ghi nhận và cảm ơn                   │   │
│   │  [Ghi nhận]  [Tìm kiếm sunner]                           │   │
│   └──────────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────────┤
│  B_Highlight  (SPOTLIGHT BOARD)                                  │
│   B.1_header [#hashtag ▾] [Phòng ban ▾]                          │
│   B.2 [<]  HIGHLIGHT KUDOS                              [>]      │
│   B.3 [Sender → Receiver]   B.4 Content + Hashtags + Action      │
│   B.5  [<] ●●●○○○ slide indicator [>]                            │
│   B.7  … B.7.1 counter, B.7.3 search, B.7.4 activity, B.7.5 fullscreen, cloud │
├──────────────────────────────────┬───────────────────────────────┤
│  C_All kudos (ALL KUDOS feed)    │  D_Thống menu phải            │
│   C.1 Header                     │   D.1 Thống kê tổng quát       │
│   C.2 List of C.3_KUDO Post      │     • Số Kudos nhận: 25        │
│      ┌────────────────────────┐  │     • Số Kudos đã gửi          │
│      │ Sender → Receiver  10:00│  │     • Số tim: 1.000           │
│      │ Content text...         │  │     • Secret box opened/total │
│      │ [image]  [#hashtag]    │  │     • [Open Gift]              │
│      │ [♥]              [link] │  │   D.3 10 SUNNER nhận quà       │
│      └────────────────────────┘  │   D.4 Hashtag cloud            │
│      ... pagination ...          │                                │
├──────────────────────────────────┴───────────────────────────────┤
│  FOOTER  Bản quyền thuộc về Sun* © 2025                          │
└──────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
Sun* Kudos - Live board (FRAME)
├── Keyvisual (Organism — background)
├── Header (Organism)
│   ├── LOGO (Atom)
│   ├── Frame 476 — NavLinks (Molecule)
│   │   ├── Button[1] "Awards Information Navigation Links"
│   │   ├── Button[2] "Awards Information Navigation Links"
│   │   └── Button[3] "Awards Information Navigation Links"
│   └── Frame 482 — Header actions (Molecule)
│       ├── Language dropdown trigger (Molecule)
│       ├── Notification (Atom + Badge/Dot)
│       └── Profile button (Atom)
├── Bìa (Organism — hero)
│   ├── A_KV Kudos (KUDOS title + subtitle "Hệ thống ghi nhận và cảm ơn")
│   └── Button chuc nang (Molecule)
│       ├── A.1_Button ghi nhận (Atom: "Ghi nhận") → Viết Kudo
│       └── Tìm kiếm sunner (Atom) → Search overlay
├── B_Highlight / SPOTLIGHT BOARD (Organism)
│   ├── B.1_header (Molecule)
│   │   ├── B.1.1_ButtonHashtag (Atom)
│   │   └── B.1.2_Button Phong ban (Atom)
│   ├── B.2 carousel (Molecule)
│   │   ├── B.2.1_Button lùi (Atom)
│   │   ├── B.2.2_Button tiến (Atom)
│   │   └── B.2.3_content HIghlight KUDO (text)
│   ├── B.3_KUDO - Highlight (Organism)
│   │   ├── B.3.2_Thông tin người gửi (Molecule — avatar + name + dept)
│   │   ├── B.3.4_Icon mũi tên (Atom — arrow)
│   │   └── B.3.6_Thông tin người nhận (Molecule)
│   ├── B.4_Nội dung lời cảm ơn (Organism)
│   │   ├── B.4.1_Thời gian đăng (Atom — timestamp)
│   │   ├── B.4.2_Nội dung (Atom — text)
│   │   ├── B.4.3_Hashtag (Molecule — list of chips)
│   │   └── B.4.4_Action (Molecule — heart / share)
│   ├── B.5_slide (Molecule — pagination)
│   │   ├── B.5.1_Button lùi
│   │   ├── B.5.2_số trang (e.g. "x2" / dots)
│   │   └── B.5.3_Button tiến
│   ├── B.6_Header Giải thưởng (Atom)
│   └── B.7_Spotlight (Molecule)
│       ├── B.7.1_388 KUDOS (Atom — counter)
│       ├── B.7.3_Tìm kiếm sunner (Atom)
│       ├── B.7.4_Activity rail (Molecule — latest received lines)
│       ├── B.7.5_Fullscreen (Atom)
│       └── Word cloud (Organism)
│       *(B.7.2 pan/zoom — deferred / in-canvas)*
├── C_All kudos (Organism)
│   ├── C.1_Header Giải thưởng (Atom — "ALL KUDOS")
│   └── C.2_Danh sách lời cảm ơn (Organism)
│       └── C.3_KUDO Post (Organism, repeated — C.3, C.5, C.6, C.7…)
│           ├── C.3.1_Thông tin người gửi (Molecule)
│           ├── C.3.2_Icon sent (Atom)
│           ├── C.3.3_Thông tin người nhận (Molecule)
│           ├── C.3.4_Time (Atom — "10:00 - 10/30/2025")
│           ├── C.3.5_Content (Atom — text)
│           ├── C.3.6_Image đính kèm (Atom — optional image)
│           ├── C.3.7_Hash tag (Molecule)
│           └── C.4_Button (Molecule)
│               ├── C.4.1_Hearts (Atom — like)
│               └── C.4.2_Copy link button (Atom)
└── D_Thống menu phải / Right panel (Organism)
    ├── D.1_Thống kê tổng quat (Molecule)
    │   ├── D.1.2_Số kudos nhận được
    │   ├── D.1.3_Số kudos đã gửi
    │   ├── D.1.4_Số tim
    │   ├── D.1.6_Số secret box đã mở
    │   ├── D.1.7_Số secret box chưa mở
    │   └── D.1.8_Button mở quà (Open Gift)
    ├── D.3_10 SUNNER nhận quà (Organism — leaderboard)
    │   └── D.3.{2..6}_Thông tin Sunner nhận quà (Molecule, ×5+)
    └── D.4_hashtag (Molecule — chip cloud)
```

> Hoạt động mới nhất (Thông báo content): chỉ **B.7.4** trong `B.7_Spotlight`, không node riêng dưới D.

### Main Components

| Component | Type | Node ID | Description | Reusable |
|-----------|------|---------|-------------|----------|
| Header | Organism | `2940:13433` | App header (logo, nav, language, notif, profile) | Yes (shared with Login / Homepage SAA) |
| Keyvisual | Organism | `2940:13432` | Full-bleed background image with overlay | Yes |
| Bìa / Hero | Organism | `2940:13434` | KUDOS title + 2 primary CTAs | No |
| A.1_Button ghi nhận | Atom | `2940:13449` | "Write Kudo" primary CTA | Yes (button variant) |
| Tìm kiếm sunner | Atom | `2940:13450` | "Search Sunner" CTA | Yes |
| B_Highlight / Spotlight Board | Organism | (`B_Highlight`) | Featured Kudo carousel + filters + counter | No |
| B.1.1_ButtonHashtag | Atom | (`B.1.1_ButtonHashtag`) | Hashtag dropdown trigger | Yes |
| B.1.2_Button Phong ban | Atom | (`B.1.2_Button Phong ban`) | Department dropdown trigger | Yes |
| C_All kudos feed | Organism | (`C_All kudos`) | Paginated list of Kudos posts | No |
| C.3_KUDO Post (card) | Organism | (`C.3_KUDO Post`) | Single Kudos card (sender / receiver / content / hashtags / actions) | Yes |
| C.4.1_Hearts | Atom | (`C.4.1_Hearts`) | Heart / like toggle button | Yes |
| C.4.2_Copy link button | Atom | (`C.4.2_Copy link button`) | Copy permalink to clipboard | Yes |
| D_Thống menu phải | Organism | (`D_Thống menu phải`) | Right-side personal panel | No |
| D.1_Thống kê tổng quat | Molecule | (`D.1_Thống kê tổng quat`) | Personal stats card (5 metrics + open-gift) | No |
| D.1.8_Button mở quà | Atom | (`D.1.8_Button mở quà`) | "Open Gift" CTA → secret box | Yes |
| D.3_10 SUNNER nhận quà | Organism | (`D.3_10 SUNNER nhận quà`) | Top 10 sunners leaderboard | No |
| D.4_hashtag | Molecule | (`D.4_hashtag`) | Hashtag cloud / filter chips | Yes |
| B.7.4 Activity rail | Molecule | (in `B.7_Spotlight`) | Latest Kudos received lines (Thông báo content pattern) | No |
| Notification ticker | — | *removed from D panel* | Superseded by **B.7.4** | — |
| Footer | Organism | (footer text) | "Bản quyền thuộc về Sun* © 2025" | Yes |

---

## Form Fields (If Applicable)

The Live board is a **read-mostly dashboard** — it has no real form. The only
input-like controls are filter triggers and inline action buttons. All authoring
of Kudos happens on the dedicated `Viết Kudo` screen.

| "Field" | Type | Required | Validation | Placeholder |
|---------|------|----------|------------|-------------|
| Hashtag filter | dropdown (multi/single) | No | Must be from server-side hashtag list | "#Hashtag" |
| Department (Phòng ban) filter | dropdown | No | Must be from server-side department list | "Phòng ban" |
| (search) Sunner | overlay search input | No | min 1 char to query | "Tìm kiếm sunner" |

---

## API Mapping

### On Screen Load

| API | Method | Purpose | Response Usage |
|-----|--------|---------|----------------|
| `/api/users/me` | GET | Current user (for header avatar + personal stats) | Hydrate header profile menu and `D.1_*` stats |
| `/api/kudos/highlights` | GET | List of featured / spotlight Kudos for `B_Highlight` carousel | Drive `B.3` cards + `B.5` slide indicators |
| `/api/kudos?sort=newest&page=1&limit=20` | GET | Paginated public Kudos feed for `C_All kudos`; first page also drives **B.7.4** | Render `C.3_KUDO Post` cards + `SpotlightActivityFeed` |
| `/api/kudos/stats/total` | GET | Global counter "388 KUDOS" (`B.7.1`) | Display total kudos count |
| `/api/users/me/stats` | GET | Personal totals: kudos received, kudos sent, hearts, secret boxes opened/total | `D.1_*` metrics |
| `/api/sunners/top?limit=10&metric=gift` | GET | "10 SUNNER nhận quà" leaderboard | `D.3_*` rows |
| `/api/hashtags?scope=trending` | GET | Hashtag cloud / available filters | `D.4_hashtag`, `B.1.1` options |
| `/api/departments` | GET | Department list for `B.1.2` filter | Phòng ban dropdown |
| `/api/notifications?unread=true` | GET | Unread badge (`Badge/Dot`) | Header bell badge |

### On User Action

| Action | API | Method | Request Body | Response |
|--------|-----|--------|--------------|----------|
| Apply hashtag filter | `/api/kudos?hashtag=:tag` | GET | — | Filtered list |
| Apply department filter | `/api/kudos?dept=:id` | GET | — | Filtered list |
| Carousel next / prev | (client-side only — uses preloaded `/highlights`) | — | — | — |
| Like (Hearts) | `/api/kudos/:id/likes` | POST / DELETE | `{}` | `{liked: bool, count: number}` |
| Copy link | client-side `navigator.clipboard.writeText` | — | — | Toast "Đã sao chép" |
| Open card → detail | `/api/kudos/:id` | GET | — | Kudos detail (used by `View Kudo`) |
| Click "Ghi nhận" | navigation only → `/kudos/new` | — | — | — |
| Click "Tìm kiếm sunner" | navigation / opens overlay → `/api/sunners?q=...` | GET | — | Sunner list |
| Click "Mở quà" | navigation → `Open secret box` flow; `/api/me/secret-boxes/next` | GET | — | Next unopened box |
| Pagination | `/api/kudos?page=:n` | GET | — | Page n |
| Real-time updates | `/ws/kudos` | WebSocket | (subscribe `kudos.new`, `kudos.liked`) | Push new posts / heart counts |

### Error Handling

| Error Code | Message | UI Action |
|------------|---------|-----------|
| 401 | Session expired | Redirect to `Login` |
| 403 | No permission | Show 403 (`Error page - 403`) |
| 404 (kudo) | Kudo not found | Remove card, toast |
| 422 | Invalid filter value | Reset filter, toast |
| 500 / network | Server error | Inline retry on each section + global toast |

---

## State Management

### Local State

| State | Type | Initial | Purpose |
|-------|------|---------|---------|
| highlightIndex | number | 0 | Active spotlight slide |
| feedPage | number | 1 | Pagination cursor for All Kudos |
| activeHashtag | string \| null | null | Selected hashtag filter |
| activeDept | string \| null | null | Selected department filter |
| likedMap | `Record<kudoId, bool>` | `{}` | Local optimistic-like state |
| copyToastVisible | boolean | false | Copy-link toast |
| isSearchOverlayOpen | boolean | false | Sunner search overlay |

### Global State (If Applicable)

| State | Store | Read/Write | Purpose |
|-------|-------|------------|---------|
| user | authStore (Supabase session) | Read | Header, personal panel |
| locale | i18nStore | Read/Write | Language selector |
| notificationsUnread | notifStore | Read/Write | Bell badge |
| kudosCache | kudosStore (React Query) | Read/Write | Feed + highlights cache |
| spotlightActivity | React Query (`spotlight-activity-feed`) | Read | **B.7.4** lines from `/api/kudos?page=1`; WS invalidation optional |

---

## UI States

### Loading State
- `B_Highlight`: skeleton card + disabled prev/next buttons.
- `C_All kudos`: 3–5 skeleton `C.3_KUDO Post` placeholders.
- `D.1` stats: skeleton numbers.
- `D.3` leaderboard: skeleton rows.
- Header counters: dash (`—`) until `/users/me/stats` resolves.

### Error State
- Section-scoped: each block (B, C, D) shows its own retry message — one
  failing block must not blank the whole page.
- Global toast for unexpected errors.

### Success State
- Posts animate in (real-time push via WS).
- Like button toggles with subtle pulse.
- Copy-link shows "Đã sao chép" toast.

### Empty State
- All Kudos: "Chưa có Kudos nào" placeholder + "Ghi nhận" CTA.
- Highlights: hide the entire `B_Highlight` block when 0 spotlights.
- Top sunners: hide section when leaderboard empty.
- Hashtag cloud: hide when no trending tags.

---

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Focus management | Skip-link to "All Kudos" feed; focus trap in any opened dropdown / overlay |
| Keyboard navigation | Carousel prev/next reachable by Tab; Enter on card opens detail; Esc closes overlays |
| Screen reader | Each `C.3_KUDO Post` exposes `<article>` with sender → receiver as accessible label; **B.7.4** uses `aria-label` and may use `aria-live="polite"` when WS-driven |
| Error announcement | `aria-live="polite"` on toast container |
| Color contrast | WCAG AA on all text/CTAs (re-use design tokens) |
| Hit targets | Heart / copy / pagination ≥ 40×40 px |

---

## Responsive Behavior

| Breakpoint | Layout Changes |
|------------|----------------|
| Mobile (<768px) | Single column. Order: Hero → Highlight → All Kudos → Right panel collapsed into accordion. Mobile uses dedicated `[iOS] Sun*Kudos` frames. |
| Tablet (768–1024px) | Hero full width; Highlight full width; All Kudos and Right panel stack. |
| Desktop (≥1024px) | Two-column main area: All Kudos (≈ 2fr) + Right panel (≈ 1fr) — as designed. |

---

## Analytics Events (Optional)

| Event | Trigger | Properties |
|-------|---------|------------|
| screen_view | On mount | `{screen: "kudos_live_board"}` |
| kudos_filter_applied | Hashtag / dept change | `{hashtag, dept}` |
| kudos_card_clicked | C.3 card click | `{kudo_id}` |
| kudos_like_toggled | Heart click | `{kudo_id, liked}` |
| kudos_link_copied | Copy link click | `{kudo_id}` |
| kudos_compose_started | "Ghi nhận" click | — |
| sunner_search_opened | "Tìm kiếm sunner" click | `{source: "hero" \| "spotlight"}` |
| open_gift_clicked | D.1.8 click | `{remaining_boxes}` |

---

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| --color-primary | (per `design-style.md`) | "Ghi nhận", "Mở quà" CTAs |
| --color-accent-heart | red / pink | C.4.1 heart |
| --color-bg-overlay | dark gradient | Keyvisual cover |
| --radius-card | 12–16px | Kudos card corners |
| --spacing-section | 32–48px | Vertical gap between B / C / D blocks |
| --shadow-card | soft | Kudos card elevation |

(Defer exact values to `list_frame_styles` during deep analysis.)

---

## Implementation Notes

### Dependencies
- **Routing**: Next.js App Router (`/kudos` or `/`).
- **Auth**: Supabase session — Live board is auth-gated.
- **Data**: TanStack Query for `/highlights`, `/kudos`, `/users/me/stats`, leaderboard.
- **Realtime**: Supabase Realtime channel (or WS) for new Kudos + likes; **B.7.4** may subscribe later (currently poll + shared feed WS for prepend).
- **i18n**: `next-intl` (existing `i18n/` and `messages/` folders).
- **UI**: Tailwind + shared atoms (`Header`, `Language` dropdown, `Notification`, `Profile dropdown`) reused from Login / Homepage SAA.

### Special Considerations
- The board has **three independent data streams** — render each block
  optimistically; do not block paint waiting for the slowest one.
- The `B_Highlight` carousel must support both manual (prev/next, slide
  pagination) and auto-advance (configurable, pausable on hover).
- Heart button is optimistic + reconciled — collisions handled on
  realtime echo.
- Personal stats (`D.1`) and the "open gift" badge must update live when a
  secret box is opened in the same session (no full reload).
- Right panel is heavy on personal data — gate behind auth and cache per user.
- **B.7.4** (Thông báo content pattern) should de-duplicate identical events within ~1s when WS-driven.

---

## Analysis Metadata

| Property | Value |
|----------|-------|
| Analyzed By | Screen Flow Discovery (`/momorph.screenflow`) |
| Analysis Date | 2026-04-26 |
| Needs Deep Analysis | Yes |
| Confidence Score | High (structure) / Medium (exact navigation targets) |

### Next Steps
- [ ] Run `list_frame_design_items` for exact spec-level descriptions of each `C.3_KUDO Post` variant (`C.3`, `C.5`, `C.6`, `C.7`).
- [ ] Run `list_frame_styles` to extract typography / colors / shadows.
- [ ] Confirm header nav targets (Awards info, Hệ thống giải, Thể lệ) with the Login screen header — they share the same component.
- [ ] Confirm right-side avatar / profile button → `Dropdown-profile` (`z4sCl3_Qtk`) vs `Dropdown-profile Admin` (`54rekaCHG1`) by role.
- [ ] Validate API endpoint contracts with backend (especially WS schema for feed + future **B.7.4** sync).
- [ ] Run `/momorph.specify` next to produce a feature-ready `spec.md` for this screen.
