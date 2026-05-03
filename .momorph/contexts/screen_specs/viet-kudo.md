# Screen: Viết Kudo

## Screen Info

| Property | Value |
|----------|-------|
| **Figma Frame ID** | `ihQ26W78P2` (node `520:11602`) |
| **Figma Link** | https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C/?node-id=520-11602 |
| **Screen Group** | Kudos / Create |
| **Status** | discovered |
| **Discovered At** | 2026-04-27 |
| **Last Updated** | 2026-04-27 |

---

## Description

**Viết Kudo** ("Write Kudo") is a modal/overlay form that lets authenticated users compose and send a peer-to-peer recognition post (Kudo) to any colleague (Sunner).

The form appears as a centred card layered on top of the Sun\* Kudos – Live board. It collects five pieces of information:

1. **Người nhận** (Recipient) — searchable dropdown to find a Sunner.
2. **Danh hiệu** (Title / Badge label) — free-text field for a custom title that becomes the headline of the Kudo card (e.g., "Người truyền động lực cho tôi").
3. **Nội dung** (Body) — rich-text editor with a formatting toolbar (Bold, Italic, Strikethrough, Numbered list, Link, Quote) and an `@-mention` shortcut for tagging other colleagues.
4. **Hashtag** — multi-tag picker (max 5). Tags are selected from a predefined list and displayed as removable chips.
5. **Image** (optional) — up to 5 images can be uploaded; thumbnails with individual remove buttons are shown.

Additional controls:
- **Gửi lời cám ơn và ghi nhận ẩn danh** (Send anonymously) — checkbox that hides the sender's identity on the live board.
- **Hủy** ("Cancel") — discards the draft and returns to the Live board.
- **Gửi** ("Send") — submits the Kudo.

The background behind the modal shows the Live board with the Kudo cover/preview card (`Bìa`) which reflects the selected recipient's avatar, badges, and the typed title in real time.

---

## Navigation Analysis

### Incoming Navigations (From)

| Source Screen | Trigger | Condition |
|---------------|---------|-----------|
| Sun\* Kudos – Live board (`MaZUn5xHXZ`) | `A.1_Button ghi nhận` ("Ghi nhận / Write Kudo") CTA | Authenticated user |
| Sun\* Kudos – Live board (`MaZUn5xHXZ`) | Any other "Ghi nhận" secondary CTA on the board | Authenticated user |

### Outgoing Navigations (To)

| Target Screen | Trigger Element | Node ID | Confidence | Notes |
|---------------|-----------------|---------|------------|-------|
| Sun\* Kudos – Live board (`MaZUn5xHXZ`) | `H.1_Button` "Hủy" (Cancel + Close icon) | `I520:11647;520:9906` | high | Explicit cancel button with `MM_MEDIA_Close` icon — discards form |
| Sun\* Kudos – Live board (`MaZUn5xHXZ`) | `H.2_Button` "Gửi" (Send + arrow icon) — success | `I520:11647;520:9907` | high | Primary submit CTA with `MM_MEDIA_Send` icon — on success closes modal and refreshes feed |
| Tìm kiếm sunner (`3jgwke3E8O`) | `B.2_Search` dropdown ("Tìm kiếm" / recipient picker) | `I520:11647;520:9873` | high | Clicking the recipient dropdown opens the Sunner search overlay |
| (Hashtag picker overlay — TBD) | `E.2_Tag Group` → "+ Hashtag" button | `I520:11647;662:8911` | medium | Opens hashtag selection UI; may be inline or a separate overlay |
| (Community standards page — TBD) | `Tiêu chuẩn cộng đồng` link in toolbar | `I520:11647;3053:11619` | medium | "Community standards" text link — likely opens a policy page/modal |
| Header → Dropdown-ngôn ngữ (`hUyaaugye2`) | Language / VN button in header | `I520:11606;186:1696` | high | Shared header component — language switcher |
| Header → Notifications (`6-1LRz3vqr`) | Bell icon with `Badge/Dot` in header | `I520:11606;186:2101` | high | Shared header bell — opens notification list |
| Header → Dropdown-profile (`z4sCl3_Qtk`) | Avatar button (rightmost in header) | `I520:11606;186:1597` | medium | Shared header profile menu |
| Header → Homepage SAA (`i87tDx10uM`) | 1st nav link in header | `I520:11606;186:1579` | medium | Shared nav; navigates away from modal (will discard draft) |
| Header → Hệ thống giải (`zFYDgyj_pD`) | 2nd nav link in header | `I520:11606;186:1587` | medium | Shared nav |
| Header → Thể lệ | 3rd nav link in header | `I520:11606;186:1593` | medium | Shared nav |

---

## Component Schema

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  Header (shared, fixed top)                             │
│  ┌────────────────────────────────────────────────────┐ │
│  │  [Background: Live board + Cover/Keyvisual]        │ │
│  │  ┌──────────────────────────────────────────────┐  │ │
│  │  │  MODAL CARD (Viết KUDO instance)             │  │ │
│  │  │  A  Title: "Gửi lời cám ơn và ghi nhận..."  │  │ │
│  │  │  B  Người nhận *  [Search dropdown ▼]        │  │ │
│  │  │  C  Danh hiệu *   [Text input]               │  │ │
│  │  │     Hint text                                │  │ │
│  │  │  ── Rich Text Editor ──────────────────────  │  │ │
│  │  │  │ B I S  ≡  🔗  "  │ Tiêu chuẩn cộng đồng│  │ │
│  │  │  │ [text area]                              │  │ │
│  │  │  │ "@" mention hint                         │  │ │
│  │  │  ─────────────────────────────────────────  │  │ │
│  │  │  E  Hashtag *     [+ Hashtag  tối đa 5]     │  │ │
│  │  │  F  Image         [thumb×5]  [+ Image]      │  │ │
│  │  │  G  □ Gửi ẩn danh                           │  │ │
│  │  │  H  [Hủy ✕]                [Gửi ▷]         │  │ │
│  │  └──────────────────────────────────────────────┘  │ │
│  │  [Background right: Bìa (Kudo preview card)]       │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Component Hierarchy

| Level | Node ID | Name | Type | Notes |
|-------|---------|------|------|-------|
| Organism | `520:11647` | Viết KUDO | INSTANCE | Root modal component |
| Molecule | `I520:11647;520:9871` | B_Chọn người nhận | FRAME | Recipient row (label + search) |
| Atom | `I520:11647;520:9873` | B.2_Search | INSTANCE | Searchable dropdown; opens Sunner search |
| Atom | `I520:11647;520:9872` | B.1_Title | INSTANCE | "Người nhận *" label |
| Molecule | `I520:11647;1688:10448` | Frame 552 (Danh hiệu) | FRAME | Title/badge field row |
| Atom | `I520:11647;1688:10437` | Button (Danh hiệu input) | INSTANCE | Free-text input for custom title |
| Atom | `I520:11647;1688:10436` | Title label | INSTANCE | "Danh hiệu *" label |
| Atom | `I520:11647;1688:10447` | Hint text | TEXT | "Ví dụ: Người truyền động lực…" |
| Organism | `I520:11647;520:9874` | Content | FRAME | Main body: editor + suggestions |
| Molecule | `I520:11647;520:9875` | Nhập kudo | FRAME | Editor container |
| Molecule | `I520:11647;520:9876` | Nhập nội dung | FRAME | Toolbar + textarea |
| Molecule | `I520:11647;520:9877` | C_Chức năng (toolbar) | FRAME | Formatting toolbar |
| Atom | `I520:11647;520:9881` | C.1_bold | INSTANCE | Bold button (`MM_MEDIA_Bold`) |
| Atom | `I520:11647;662:11119` | C.2_italic | INSTANCE | Italic button (`MM_MEDIA_Italic`) |
| Atom | `I520:11647;662:11213` | C.3_Stroke | INSTANCE | Strikethrough (`MM_MEDIA_Strikethrough`) |
| Atom | `I520:11647;662:10376` | C.4_number | INSTANCE | Numbered list (`MM_MEDIA_Number List`) |
| Atom | `I520:11647;662:10507` | C.5_link | INSTANCE | Link button (`MM_MEDIA_Link`) |
| Atom | `I520:11647;662:10647` | C.6_quote | INSTANCE | Block quote (`MM_MEDIA_Quote`) |
| Atom | `I520:11647;3053:11619` | Tiêu chuẩn cộng đồng | FRAME/TEXT | Community standards link (text button) |
| Atom | `I520:11647;520:9886` | D_text filed | INSTANCE | Rich-text area |
| Atom | `I520:11647;520:9887` | D.1_Gợi ý | FRAME | "@-mention" hint |
| Molecule | `I520:11647;520:9890` | E_Frame 536 (Hashtag) | FRAME | Hashtag selection row |
| Atom | `I520:11647;520:9891` | E.1_Title | INSTANCE | "Hashtag *" label |
| Molecule | `I520:11647;662:8595` | E.2_Tag Group | FRAME | Container for selected tags + add button |
| Atom | `I520:11647;662:8911` | + Hashtag Button | INSTANCE | Opens hashtag picker (max 5) |
| Molecule | `I520:11647;520:9896` | F_Frame 537 (Image) | FRAME | Image upload row |
| Atom | `I520:11647;520:9897` | F.1_Title | INSTANCE | "Image" label |
| Atom | `I520:11647;662:9197` | F.2_Image … Image | INSTANCE×5 | Uploaded thumbnail + remove button (`MM_MEDIA_Close Tiny`) |
| Atom | `I520:11647;662:9132` | F.5_Frame 542 (+ Image) | FRAME | Add image CTA; max 5 total |
| Molecule | `I520:11647;520:14099` | G_Gửi ẩn danh | INSTANCE | Anonymous send checkbox + label |
| Molecule | `I520:11647;520:9905` | H_Frame 538 (Actions) | FRAME | Cancel + Send button row |
| Atom | `I520:11647;520:9906` | H.1_Button (Hủy) | INSTANCE | Cancel button (`MM_MEDIA_Close`) |
| Atom | `I520:11647;520:9907` | H.2_Button (Gửi) | INSTANCE | Submit button (`MM_MEDIA_Send`) |
| Organism | `520:11607` | Bìa (Kudo preview card) | FRAME | Live preview of Kudo card (background) |
| Molecule | `520:11608` | Frame 532 | FRAME | Card body |
| Molecule | `520:11609` | Infor | FRAME | Recipient info: avatar + name + badges |
| Atom | `520:11610` | MM_MEDIA_Avatar | ELLIPSE | Recipient avatar |
| Atom | `520:11612` | Name (Huỳnh Dương Xuân Nhật) | TEXT | Recipient display name |
| Atom | `520:11613` | Huy hiệu + Sao | FRAME | Badges row (CEVC3, Mầm non, star count) |
| Molecule | `520:11621` | Frame 511 | FRAME | Danh hiệu (badges) grid |
| Molecule | `520:11630` | Frame 530 | FRAME | Card footer with SAA branding + KUDOS label |

---

## Form Fields

| Field ID | Label | Type | Required | Validation | Notes |
|----------|-------|------|----------|------------|-------|
| B | Người nhận (Recipient) | Searchable dropdown | Yes (`*`) | Must select a valid Sunner | Opens Tìm kiếm sunner overlay |
| Danh hiệu | Danh hiệu (Title) | Text input | Yes (`*`) | Non-empty; displayed as Kudo headline | Hint: "Dành tặng một danh hiệu cho đồng đội" |
| D | Nội dung (Body) | Rich-text editor | Implied required | Community standards apply | Supports Bold, Italic, Strike, Numbered list, Link, Quote, @-mentions |
| E | Hashtag | Multi-tag picker | Yes (`*`) | 1–5 tags | "+ Hashtag" button opens picker; max 5 |
| F | Image | File upload | No | Max 5 images; each removable | "+ Image" CTA; shows thumbnails with close button |
| G | Gửi ẩn danh (Anonymous) | Checkbox | No | — | When checked, sender identity hidden on Live board |

---

## API Mapping

### On Load

| Endpoint | Method | Purpose | Notes |
|----------|--------|---------|-------|
| `GET /api/users/me` | GET | Pre-populate sender avatar/info in `Bìa` preview | Already fetched by Live board; pass via context |
| `GET /api/hashtags` | GET | Pre-load available hashtags for `E` picker | May be cached from Live board load |

### On User Action

| Trigger | Endpoint | Method | Payload | Purpose |
|---------|----------|--------|---------|---------|
| Type in `B.2_Search` | `GET /api/sunners?q={query}` | GET | `q` = search term | Sunner autocomplete results |
| Select recipient | (local update) | — | — | Update `Bìa` preview card with recipient info |
| Submit ("Gửi") | `POST /api/kudos` | POST | `{ receiverId, title, content, hashtags[], images[], isAnonymous }` | Create Kudo post |
| Upload image | `POST /api/media/upload` | POST | `multipart/form-data` | Upload image, receive URL |
| Remove image | (local state) | — | — | Remove thumbnail from UI |

---

## State Management

### Local State

| State Key | Type | Initial | Description |
|-----------|------|---------|-------------|
| `recipient` | `User \| null` | `null` | Selected recipient Sunner |
| `title` | `string` | `""` | Danh hiệu text |
| `content` | `string (rich HTML)` | `""` | Rich-text body |
| `hashtags` | `string[]` | `[]` | Selected hashtag IDs (max 5) |
| `images` | `File[]` | `[]` | Uploaded image files (max 5) |
| `imageUrls` | `string[]` | `[]` | Server-returned URLs after upload |
| `isAnonymous` | `boolean` | `false` | Anonymous send toggle |
| `isSubmitting` | `boolean` | `false` | Loading state while POST in flight |
| `errors` | `Record<fieldId, string>` | `{}` | Field-level validation errors |

### Global State Dependencies

| State | Source | Usage |
|-------|--------|-------|
| `currentUser` | Auth context / TanStack Query | Populate sender info in preview; attach `senderId` to POST payload |
| `hashtags` (catalogue) | TanStack Query cache (`/api/hashtags`) | Feed the hashtag picker dropdown |

---

## UI States

### Loading (Submitting)

- `H.2_Button` ("Gửi") shows a spinner/loading indicator.
- All form fields are disabled during submission.

### Error States

- **Field validation error**: Red outline + error message beneath the offending field (recipient missing, title empty, no hashtag selected).
- **API error (submit)**: Toast / inline error banner at top of modal. "Gửi thất bại — vui lòng thử lại."
- **Image upload error**: Error badge on the failed thumbnail; retry or remove option.
- **Sunner search empty state**: "Không tìm thấy sunner" in the dropdown list.

### Success State

- Modal closes after successful POST.
- Live board feed refreshes (via WS event or manual re-fetch) showing the new Kudo.
- Optional success toast: "Kudo đã được gửi thành công!"

### Empty / Initial State

- All fields empty with placeholder text.
- `Bìa` preview card shows placeholder avatar and empty badge areas.
- "Gửi" button is disabled until all required fields are valid.

---

## Analysis Metadata

| Property | Value |
|----------|-------|
| **Confidence** | High — complete node tree + visual frame obtained |
| **Complexity** | Medium — modal form with rich-text editor, image upload, and live preview |
| **Key Dependencies** | Tìm kiếm sunner overlay, Hashtag picker, `POST /api/kudos`, `POST /api/media/upload` |
| **Open Questions** | 1. Does the hashtag picker open inline or as a separate overlay? 2. Is the "Tiêu chuẩn cộng đồng" link a modal or external page? 3. Are images uploaded immediately on selection or batched with the POST? 4. Is the `Bìa` preview card always visible (side-by-side layout) or only on desktop? |
