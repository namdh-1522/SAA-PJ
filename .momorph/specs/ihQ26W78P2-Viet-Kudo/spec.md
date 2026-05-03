# Feature Specification: Viết Kudo

**Frame ID**: `ihQ26W78P2`
**Frame Name**: `Viết Kudo`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-04-27
**Status**: Draft

---

## Overview

"Viết Kudo" is a modal dialog that allows any authenticated user to compose and send a Kudo — a public appreciation message directed at a teammate. The form collects five pieces of information:

1. **Người nhận** (Recipient) — searchable dropdown that opens the "Tìm kiếm sunner" overlay.
2. **Danh hiệu** (Title/Badge) — required free-text field for a custom recognition title (e.g., "Người truyền động lực cho tôi") that becomes the headline of the Kudo card.
3. **Nội dung** (Body) — rich-text editor with formatting toolbar (Bold, Italic, Strikethrough, Numbered list, Link, Quote) and @-mention support.
4. **Hashtag** — required multi-tag picker (1–5 tags selected from a predefined list).
5. **Image** (optional) — up to 5 image attachments.

Additional controls: anonymous send toggle, Cancel (Hủy), and Submit (Gửi). While the modal is open, a live **"Bìa" preview card** is visible in the background behind the modal, reflecting the selected recipient's avatar/badges and the typed Danh hiệu title in real time. The submitted Kudo is posted to the Sun Kudos Live Board visible to all platform members.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Submit a Kudo to a teammate (Priority: P1)

A logged-in user opens the "Viết Kudo" modal (triggered from the Live Board's "Ghi nhận" CTA), fills in all required fields (recipient, danh hiệu/title, message body, at least one hashtag), and clicks "Gửi" to post the Kudo publicly.

**Why this priority**: This is the core feature of the screen — without it, the entire Kudo workflow does not exist.

**Independent Test**: Open the modal, fill all required fields (recipient, title, body, hashtag), click Gửi. Verify a new Kudo card appears on the Live Board.

**Acceptance Scenarios**:

1. **Given** the modal is open with all fields empty, **When** the user clicks the "Người nhận" search field, **Then** the Tìm kiếm sunner overlay opens and the user can search for and select a recipient.

2. **Given** a recipient is selected, **When** the user returns to the modal, **Then** the recipient's name appears in the search field and the "Bìa" preview card in the background updates to show the recipient's avatar and badges.

3. **Given** a recipient is selected, **When** the user types in the Danh hiệu field, **Then** the "Bìa" preview card updates in real time to reflect the typed title.

4. **Given** all required fields (Người nhận, Danh hiệu, Nội dung, Hashtag) are filled, **When** the user clicks "Gửi", **Then** the form submits via `POST /api/kudos`, a loading state is shown on the button and all form fields are disabled, the modal closes on success, and the new Kudo card appears on the Live Board.

5. **Given** the submission succeeds, **When** the modal closes, **Then** the Live Board feed refreshes (via WebSocket event or re-fetch) to show the new Kudo card.

---

### User Story 2 - Form validation blocks incomplete submission (Priority: P1)

The "Gửi" button must be disabled — and inline error cues must appear — whenever required fields are empty or invalid, preventing accidental empty submissions.

**Why this priority**: Prevents garbage data in the system; part of the same P1 critical path as the happy submission.

**Independent Test**: Leave required fields empty and attempt to click Gửi. Verify the button is disabled and error states are visible on invalid fields.

**Acceptance Scenarios**:

1. **Given** the modal is open with no fields filled, **When** the user views the modal, **Then** the "Gửi" button is visually disabled (opacity 0.6, cursor not-allowed).

2. **Given** the user clicks "Gửi" without filling "Người nhận", **Then** a red border appears on the search input and an error message is shown below it.

3. **Given** the "Danh hiệu" text field is empty, **When** the user attempts to submit, **Then** a red border appears on the Danh hiệu input and a validation message is shown below it.

4. **Given** the message textarea is empty, **When** the user attempts to submit, **Then** a red border appears on the textarea and validation is shown.

5. **Given** no hashtag has been added, **When** the user attempts to submit, **Then** the Hashtag field shows a validation error.

6. **Given** all required fields (Người nhận, Danh hiệu, Nội dung, ≥1 Hashtag) are valid, **When** the user reviews the form, **Then** the "Gửi" button is fully enabled and styled with background #FFEAA9.

---

### User Story 3 - Cancel / discard the Kudo (Priority: P1)

Users must be able to safely exit the modal without submitting, discarding any partially filled content.

**Why this priority**: Without a working cancel path, users can get stuck in the modal.

**Independent Test**: Open modal, type content, click Hủy. Verify modal closes and no data was submitted.

**Acceptance Scenarios**:

1. **Given** the modal is open with content typed, **When** the user clicks "Hủy", **Then** the modal closes without any API call, and all form data is cleared.

2. **Given** the modal is open, **When** the user presses the Escape key or clicks the backdrop overlay, **Then** the modal closes (same discard behavior as Hủy).

---

### User Story 4 - Apply rich-text formatting to the message (Priority: P2)

Users can apply Bold, Italic, Strikethrough, Numbered List, Link, and Blockquote formatting to selected text within the message textarea using the toolbar.

**Why this priority**: Enhances the expressiveness of Kudos; secondary to the core submit flow but expected from the toolbar being in the design.

**Independent Test**: Open modal, type text, select it, click Bold. Verify text renders bold in the textarea.

**Acceptance Scenarios**:

1. **Given** text is selected in the textarea, **When** the user clicks the Bold (B) toolbar button, **Then** the selected text is wrapped in bold formatting and the button appears in its active/toggled state.

2. **Given** Bold is active, **When** the user clicks Bold again, **Then** the bold formatting is removed from the selection.

3. **Given** no text is selected, **When** the user clicks Italic (I), **Then** subsequent typed characters appear in italic.

4. **Given** the user clicks the Link icon, **When** a URL is entered in the dialog, **Then** the selected text becomes a hyperlink.

5. **Given** the user types `@` followed by a teammate's name, **When** matching names appear as suggestions, **Then** selecting a suggestion inserts an @-mention token in the message.

---

### User Story 5 - Attach images to the Kudo (Priority: P2)

Users can optionally attach up to 5 images to the Kudo using the file picker. Thumbnails appear inline and can be individually removed.

**Why this priority**: Image attachments enrich Kudos but are not required for core functionality.

**Independent Test**: Click "+ Image", select a file. Verify thumbnail appears. Click × on thumbnail, verify it disappears.

**Acceptance Scenarios**:

1. **Given** the modal is open, **When** the user clicks "+ Image", **Then** the OS file picker opens.

2. **Given** the user selects an image file, **When** the file is accepted, **Then** an 80×80px thumbnail (border-radius: 18px) appears in the image row and `POST /api/media/upload` is called immediately; a loading indicator is shown on the thumbnail until the URL is returned.

3. **Given** the upload succeeds, **When** the URL is returned from the server, **Then** the thumbnail's loading indicator disappears and the URL is appended to the `imageUrls` state.

4. **Given** one or more images are uploaded, **When** the user clicks the × button on a thumbnail, **Then** that thumbnail is removed from the UI and its URL is removed from `imageUrls`.

5. **Given** 5 images are already uploaded, **When** the user views the form, **Then** the "+ Image" button is hidden.

6. **Given** a file larger than 5 MB or of an unsupported type is selected, **When** the picker returns, **Then** an error toast is shown and the image is not uploaded.

7. **Given** an upload fails mid-flight, **When** the API call returns an error, **Then** an error badge appears on the failed thumbnail with retry/remove options; other staged uploads continue independently.

---

### User Story 6 - Send Kudo anonymously (Priority: P2)

A user can toggle the "Gửi ẩn danh" checkbox so that the Kudo appears on the Live Board without revealing their identity to colleagues (though the platform records the sender internally).

**Why this priority**: Privacy-sensitive use case requested by the product team; the checkbox is always visible in the design.

**Independent Test**: Check the anonymous toggle, submit. Verify that the posted Kudo shows no sender name on the Live Board.

**Acceptance Scenarios**:

1. **Given** the modal is open, **When** the user checks "Gửi lời cám ơn và ghi nhận ẩn danh", **Then** the checkbox shows a filled/checked state and an optional anonymous-name field may appear.

2. **Given** the toggle is checked and the form is submitted, **When** the API receives the request, **Then** `anonymous: true` is included in the payload and the Live Board card does not display the sender's identity.

3. **Given** the toggle is unchecked (default), **When** the form is submitted, **Then** the sender's real name is visible on the Kudo card.

---

### User Story 7 - Add hashtag categories to the Kudo (Priority: P1)

Users must add at least one hashtag to categorize the Kudo. They can add up to 5 hashtags from a dropdown picker. Each added hashtag appears as a removable chip.

**Why this priority**: Hashtag is a required field; it drives category filtering on the Live Board.

**Independent Test**: Click "+ Hashtag", select a tag. Verify chip appears. Click × on chip, verify it disappears. Add 5 tags, verify the button is hidden.

**Acceptance Scenarios**:

1. **Given** the modal is open, **When** the user clicks "+ Hashtag", **Then** an inline dropdown opens directly beneath the button showing available hashtags from `GET /api/hashtags`.

2. **Given** the dropdown is open, **When** the user clicks outside the dropdown, **Then** the dropdown closes without selection.

3. **Given** a hashtag is selected from the dropdown, **When** the user clicks the option, **Then** the dropdown closes and a chip with the hashtag text and a `×` button appears in the Tag Group area.

4. **Given** a chip is visible, **When** the user clicks `×` on it, **Then** the chip is removed.

5. **Given** 5 hashtag chips are already in the list, **When** the user views the field, **Then** the "+ Hashtag" button is hidden.

6. **Given** no hashtag is added, **When** the user attempts to submit, **Then** a validation error is shown on the Hashtag field.

---

### Edge Cases

- What happens when no recipient is selected and the user opens Tìm kiếm sunner but cancels without selecting? → B.2 field remains empty; "Gửi" button stays disabled.
- What happens when the API call to `POST /api/kudos` fails? → Show an error toast ("Gửi thất bại — vui lòng thử lại."); keep the modal open with all data preserved.
- What if the user pastes text into Danh hiệu that exceeds 100 characters? → Truncate at 100, show the counter at `100/100` in red, and briefly highlight the counter to signal truncation.
- What if the user's internet connection drops mid-upload of an image? → Show an error badge on the failed thumbnail; offer retry or remove option.
- What happens when the user navigates away via a header link, the browser back button, or attempts to close the tab while ANY field has been modified? → Show a discard confirmation dialog ("Bạn có muốn hủy không?") before navigating away. If the form is pristine (all fields empty/initial), navigate silently.
- What happens if the Bìa preview card fails to load recipient data? → Show placeholder avatar; Bìa is display-only and must not block form submission.
- What if the hashtag API returns an empty list? → Show "Không có hashtag nào" in the picker; the "+ Hashtag" button should still be enabled but the picker shows the empty state.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Node ID | Description | Interactions |
|-----------|---------|-------------|--------------|
| A. Modal Title | I520:11647;520:9870 | "Gửi lời cám ơn và ghi nhận đến đồng đội" — centered heading | None (static) |
| B. Người nhận | I520:11647;520:9871 | Required field row for selecting a recipient | Click to open Tìm kiếm sunner overlay |
| B.1 Label | I520:11647;520:9872 | "Người nhận *" label | None |
| B.2 Search Input | I520:11647;520:9873 | Dropdown-style input showing selected recipient name; click opens Tìm kiếm sunner overlay | Click: navigate to Tìm kiếm sunner (`3jgwke3E8O`) |
| C. Danh hiệu (Frame 552) | I520:11647;1688:10448 | Required free-text field row (label + input + hint); the typed value becomes the headline of the Kudo card and updates the Bìa preview in real time | Type: update live preview |
| C.Label | I520:11647;1688:10436 | "Danh hiệu *" label | None |
| C.Input | I520:11647;1688:10437 | Free-text input (514px wide) with placeholder; hint below: "Dành tặng một danh hiệu cho đồng đội" | Type to fill recognition title |
| C.Hint | I520:11647;1688:10447 | Hint text "Dành tặng một danh hiệu cho đồng đội" with live `n/100` character counter on the right | None (static text + dynamic counter) |
| D. Toolbar | I520:11647;520:9877 | 6-button rich-text formatting bar (B, I, S, #, Link, Quote) + "Tiêu chuẩn cộng đồng" link | Click to toggle format |
| D.1 Bold | I520:11647;520:9881 | Bold toggle button | Click: toggle bold |
| D.2 Italic | I520:11647;662:11119 | Italic toggle button | Click: toggle italic |
| D.3 Strikethrough | I520:11647;662:11213 | Strikethrough toggle button | Click: toggle strike |
| D.4 Number | I520:11647;662:10376 | Numbered list toggle | Click: toggle numbered list |
| D.5 Link | I520:11647;662:10507 | Insert/edit link | Click: open link dialog |
| D.6 Quote | I520:11647;662:10647 | Blockquote toggle | Click: toggle blockquote |
| D.7 Tiêu chuẩn cộng đồng | I520:11647;3053:11619 | "Community standards" text link in toolbar row | Click: open community standards page in **new tab** (`target="_blank"`); modal remains open |
| E. Textarea | I520:11647;520:9886 | Rich-text content area with @-mention support | Type, paste, @-mention |
| E.1 Hint | I520:11647;520:9887 | Hint: `Bạn có thể "@ + tên" để nhắc tới đồng nghiệp khác` | None (static) |
| F. Hashtag | I520:11647;520:9890 | Required hashtag chip group (max 5) | Click + to add, × to remove |
| F.1 Hashtag Label | I520:11647;520:9891 | "Hashtag *" label | None |
| F.2 Tag Group | I520:11647;662:8595 | Tag chips + "+ Hashtag" button | Click `×` on chip to remove; click "+ Hashtag" to open inline dropdown picker |
| F.3 + Hashtag Button | I520:11647;662:8911 | "+ Hashtag" button that opens the inline dropdown | Click: open inline dropdown of available hashtags |
| G. Image Upload | I520:11647;520:9896 | Optional image attachments (max 5, 80×80px thumbnails) | Click + to add, × to remove |
| G.1 Image Label | I520:11647;520:9897 | "Image" label | None |
| G.2–G.5 Thumbnails | I520:11647;662:9197 etc. | Uploaded image thumbnails with remove button | Click × to remove |
| G.6 Add Image Button | I520:11647;662:9132 | "+ Image / Tối đa 5" button | Opens OS file picker |
| H. Anonymous Toggle | I520:11647;520:14099 | Checkbox: "Gửi lời cám ơn và ghi nhận ẩn danh" | Click to check/uncheck |
| I. Actions | I520:11647;520:9905 | Footer with Hủy and Gửi buttons | Click to cancel / submit |
| I.1 Hủy | I520:11647;520:9906 | Secondary cancel button | Click: close modal, discard |
| I.2 Gửi | I520:11647;520:9907 | Primary submit button (disabled until required fields valid) | Click: validate and POST |
| Bìa (Background) | 520:11607 | Live preview card in background showing recipient avatar, badges, Danh hiệu title. Updates in real time. **Visible only on desktop ≥ 1024px**, hidden on mobile/tablet. | None (display only) |

For complete visual specifications of each component (colors, typography, dimensions, states), see [design-style.md](./design-style.md).

### Navigation Flow

- **From**: Sun Kudos Live Board (`MaZUn5xHXZ`) — triggered by clicking "Ghi nhận" CTA (`A.1_Button ghi nhận`)
- **To (success)**: Live Board (modal closes, new Kudo card appears in feed)
- **To (cancel)**: Live Board (modal closes, no change)
- **To (recipient search)**: **Tìm kiếm sunner overlay** (`3jgwke3E8O`) — clicking B.2 search input navigates to a dedicated sunner search screen; selection returns the user to this modal with the recipient pre-filled
- **To (hashtag picker)**: Inline dropdown anchored under "+ Hashtag" — no navigation
- **To (community standards)**: Opens the community standards page in a **new browser tab** (`target="_blank"`); current modal/draft remains intact
- **To (header links)**: Header navigation links (VN/EN toggle, bell, avatar) trigger the draft-discard confirmation dialog if any field is modified
- **Triggers**:
  - Click "Ghi nhận" on Live Board → opens this modal
  - Click B.2 search input → navigate to Tìm kiếm sunner
  - Click "Gửi" → validate → POST → dismiss on success
  - Click "Hủy" or Escape → dismiss modal, discard data

### Visual Requirements

- Responsive breakpoints: mobile (≥ 360px), tablet (≥ 768px), desktop (≥ 1024px) per constitution
- On mobile: modal becomes a bottom sheet (border-radius 16px 16px 0 0, full width)
- Animations: modal opens/closes with opacity + scale transition (200ms ease-out)
- Accessibility:
  - All interactive elements meet WCAG 2.1 AA (touch target ≥ 48px per Material Design 3)
  - Required fields have `aria-required="true"`
  - Error states have `aria-invalid="true"` and a linked `aria-describedby` error message
  - Modal uses `role="dialog"`, `aria-modal="true"`, and traps focus

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to open the Tìm kiếm sunner overlay to search for and select a recipient; the selected recipient's name MUST populate the B.2 search field on return.
- **FR-002**: System MUST allow users to type a free-text "Danh hiệu" (recognition title) in the Danh hiệu input field; the typed value MUST update the "Bìa" preview card in real time.
- **FR-003**: System MUST prevent form submission when any required field (Người nhận, Danh hiệu, Nội dung, at least 1 Hashtag) is empty; the "Gửi" button MUST be disabled in this state.
- **FR-004**: Users MUST be able to apply Bold, Italic, Strikethrough, Numbered List, Link, and Blockquote formatting to the message text.
- **FR-005**: System MUST support @-mention of colleagues within the message body; typing `@` followed by a name MUST display a suggestion list.
- **FR-006**: System MUST allow users to add 1–5 hashtag chips; adding a 6th MUST be blocked and the "+ Hashtag" button MUST be hidden at 5 chips.
- **FR-007**: System MUST allow users to attach 0–5 images; the "+ Image" button MUST be hidden when 5 images are staged; each image MAY be removed individually.
- **FR-008**: System MUST support anonymous submission; when the anonymous checkbox is checked, `isAnonymous: true` MUST be included in the API payload.
- **FR-009**: System MUST show a loading state on the "Gửi" button and disable ALL form fields during API submission.
- **FR-010**: System MUST close the modal and reflect the new Kudo on the Live Board after a successful submission.
- **FR-011**: System MUST preserve form state (do not clear) if the API call fails, and MUST display an error toast ("Gửi thất bại — vui lòng thử lại.").
- **FR-012**: Clicking "Hủy" or pressing Escape MUST close the modal and discard all unsaved changes.
- **FR-013**: The "Bìa" (Kudo preview card) MUST display the selected recipient's avatar and badges; it MUST update its title text in real time as the user types in the Danh hiệu field.
- **FR-014**: The "Bìa" preview card MUST be visible only on viewports ≥ 1024px (desktop). On mobile and tablet viewports it MUST be hidden.
- **FR-015**: The Danh hiệu field MUST enforce a maximum of 100 characters. A live `{n}/100` character counter MUST be displayed in the C.Hint area; the input MUST block keystrokes (other than backspace/delete/navigation) once the limit is reached.
- **FR-016**: Clicking "+ Hashtag" MUST open an inline dropdown anchored beneath the button; selection adds a chip and closes the dropdown. Clicking outside the dropdown MUST close it without selection.
- **FR-017**: The "Tiêu chuẩn cộng đồng" link MUST open in a new browser tab using `target="_blank"` and `rel="noopener noreferrer"`; the modal and its current draft MUST remain intact.
- **FR-018**: Images MUST be uploaded immediately on file selection via `POST /api/media/upload`; the returned URL MUST be stored in `imageUrls` state. The final `POST /api/kudos` MUST send the array of returned URLs (not raw files). Removing a thumbnail MUST also remove its URL from `imageUrls`.
- **FR-019**: When the user attempts to navigate away (header link click, browser back, or window close) while ANY form field has been modified from its initial empty state, the system MUST display a confirmation dialog ("Bạn có muốn hủy không?"). On pristine forms, navigation MUST proceed silently.

### Technical Requirements

- **TR-001**: Recipient search MUST debounce input by 300ms before triggering `GET /api/sunners?q=` to avoid excess API calls.
- **TR-002**: Image upload MUST validate file type (jpeg, png, gif, webp) and maximum size (5 MB per file) client-side before staging.
- **TR-003**: All form input MUST be sanitized on the server side before storage (OWASP injection prevention, constitution §V).
- **TR-004**: The modal MUST use `createServerClient` for authenticated API calls; session tokens MUST be in HttpOnly cookies (constitution §II, §V).
- **TR-005**: The component MUST be implemented as a React Client Component (`'use client'`) since it requires interactivity; all data-fetching helpers MUST use server-side patterns where possible.
- **TR-006**: Rich-text content MUST be stored as sanitized HTML or a structured document format (e.g., Tiptap JSON) — raw HTML from untrusted input MUST NOT be stored directly.
- **TR-007**: All Tailwind classes MUST reference CSS variable design tokens; no raw hex values in component files (constitution §II design token gate).

### Key Entities *(feature involves data)*

- **Kudo**: `{ id, sender_id, recipient_id, title (danh hiệu), content (rich-text), hashtag_ids[], image_urls[], is_anonymous, created_at }` — created by this feature.
- **User / Sunner**: `{ id, name, avatar_url, department }` — referenced for recipient search and @-mentions.
- **Hashtag**: `{ id, name, color? }` — predefined tags fetched from API and displayed as chips.
- **Media / Image**: `{ url, kudo_id }` — uploaded and associated with the Kudo on submission.

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/sunners?q={query}` | GET | Search sunners for recipient picker (used by Tìm kiếm sunner overlay) | Predicted |
| `/api/hashtags` | GET | Fetch available hashtag list for picker; may be cached from Live Board load | Predicted |
| `/api/kudos` | POST | Create and publish the new Kudo | Predicted |
| `/api/media/upload` | POST | Upload image attachment(s); returns server URL | Predicted |
| `/api/users/me` | GET | Get current user to pre-populate sender info in Bìa preview; may be cached from Live Board | Predicted |

**Predicted POST `/api/kudos` payload:**
```json
{
  "receiverId": "string",
  "title": "string (danh hiệu — required)",
  "content": "string (rich-text HTML or Tiptap JSON)",
  "hashtags": ["string (hashtag ID)"],
  "images": ["string (uploaded image URL)"],
  "isAnonymous": false
}
```

---

## State Management

### Local Component State

| State | Type | Initial | Description |
|-------|------|---------|-------------|
| `selectedRecipient` | `User \| null` | `null` | Selected recipient object (set on return from Tìm kiếm sunner) |
| `title` | `string` | `""` | Danh hiệu free-text value; drives live Bìa preview update |
| `messageContent` | `string (rich-text)` | `""` | Rich-text body (HTML or Tiptap JSON) |
| `selectedHashtags` | `Hashtag[]` | `[]` | List of added hashtag chips (max 5) |
| `stagedImages` | `File[]` | `[]` | Staged image files pending upload (max 5) |
| `imageUrls` | `string[]` | `[]` | Server-returned URLs after each image is uploaded |
| `isAnonymous` | `boolean` | `false` | Anonymous toggle state |
| `isSubmitting` | `boolean` | `false` | Submission loading state; when `true` all form fields are disabled |
| `errors` | `Record<string, string>` | `{}` | Field-level validation errors keyed by field name |

### Global / Cache

- **Current user**: Read from Auth context or TanStack Query cache (`/api/users/me`) to populate sender info in Bìa preview.
- **Hashtag catalogue**: Cached via TanStack Query (`/api/hashtags`) — may be shared with Live Board's cache.
- **Kudo feed**: MUST be invalidated/refetched (or updated via WebSocket) after successful submission.
- Recipient search results are fetched by the Tìm kiếm sunner overlay screen — not managed in this modal's local state.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A submitted Kudo appears on the Live Board within 2 seconds of clicking "Gửi" under normal network conditions.
- **SC-002**: Recipient autocomplete returns results within 500ms of a debounced keystroke under normal network conditions.
- **SC-003**: Zero form submissions with empty required fields (validated at both client and server level).
- **SC-004**: Image upload handles files up to 5 MB without timeout or crash.
- **SC-005**: All interactive elements pass WCAG 2.1 AA keyboard navigation and focus management tests.

---

## Out of Scope

- Editing or deleting a submitted Kudo (separate feature).
- Real-time preview of the Kudo card as the user types (not in design).
- Recipient group / multi-recipient selection (design shows single recipient only).
- Emoji picker (not shown in toolbar design).
- Draft auto-save (not in design scope).

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`) — predicted endpoints defined above
- [ ] Database design completed (`.momorph/database.sql`)
- [x] Screen flow documented (`.momorph/SCREENFLOW.md` — updated by screenflow subagent 2026-04-27)

---

## Resolved Design Decisions

The following decisions were finalized based on Figma evidence and standard UX patterns. Each is reflected in the user stories, requirements, and edge cases above.

| # | Decision | Source / Rationale |
|---|----------|---------------------|
| 1 | **Hashtag picker is an inline dropdown** anchored under the "+ Hashtag" button. | Figma design item E states: *"Click '+ Hashtag': mở dropdown để thêm"*. No navigation occurs. |
| 2 | **"Tiêu chuẩn cộng đồng" link opens in a new browser tab** (`target="_blank" rel="noopener noreferrer"`). | The link is inside the editor toolbar — same-tab navigation would destroy the draft. New tab preserves modal state. |
| 3 | **Images are uploaded immediately per-file** via `POST /api/media/upload`. The returned URLs are stored in `imageUrls` state and attached to the final `POST /api/kudos`. | The thumbnails are rendered as already-uploaded items in Figma; per-file upload enables the per-thumbnail retry/error badge. |
| 4 | **Danh hiệu has a 100-character maximum** with a live `n/100` counter shown next to the hint text in the C.Hint area. | Input is 514px wide single-line; this is the visual-fit upper bound and prevents Bìa preview overflow. |
| 5 | **Bìa preview is visible on desktop only (≥ 1024px)** and hidden on mobile/tablet. | Figma frame is 1440px wide; the side-by-side layout only fits at desktop widths. |
| 6 | **A confirmation dialog appears when navigating away with a non-pristine form** ("Bạn có muốn hủy không?"). Pristine forms navigate silently. | Standard form UX; high-cost accidental loss is mitigated only when the user has actually entered data. |

---

## Notes

- The modal background color `#FFF8E1` matches the Sun Kudos brand palette (warm yellow/cream).
- The "Viết KUDO" component in Figma is an `INSTANCE` of a shared component (`520:11647`), meaning future design changes to the master component will propagate to this screen.
- The "Danh hiệu" field was present in the Figma layout (Frame 552, node `I520:11647;1688:10448`) but was not annotated as a design item by the MoMorph tool — it must be treated as a required field.
- The toolbar is visually joined with the textarea (shared border, split border-radius) — implement these as a single editor block for visual accuracy, not two separate elements with a gap.
- The Bìa (`520:11607`) is a sibling of the modal on the page — it sits to the right/behind of the modal card and is not inside the modal DOM hierarchy.
- Per screenflow analysis, the Live Board CTA ("Ghi nhận") is the confirmed trigger for this modal.
- Component letter references in the UI/UX table have been re-lettered (C = Danh hiệu, D = Toolbar, E = Textarea, F = Hashtag, G = Images, H = Anonymous, I = Actions) to account for the previously missing Danh hiệu field. The design-style.md uses the same updated lettering.
