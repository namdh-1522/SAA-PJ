# Implementation Plan: Viết Kudo

**Frame**: `ihQ26W78P2-Viet-Kudo`
**Date**: 2026-04-29
**Spec**: `specs/ihQ26W78P2-Viet-Kudo/spec.md`
**Research**: `specs/ihQ26W78P2-Viet-Kudo/research.md`

---

## Summary

A modal compose form, mounted over the Sun Kudos Live Board, that lets authenticated users send a peer recognition (Kudo) to a teammate. The form collects 5 fields (recipient, danh hiệu/title, rich-text body, hashtags, optional images) with anonymous-send and a desktop-only live "Bìa" preview card. Backend additions: a new `POST /api/kudos` handler, a Supabase migration adding `title` + `is_anonymous` columns with RLS policies, and a Supabase Storage bucket for image uploads. Frontend additions: a Radix Dialog modal, a Tiptap-based rich-text editor with a custom toolbar, an inline hashtag picker, a per-file immediate image uploader, and the Bìa preview card. Most foundational infra (auth, Zod, TanStack Query, Radix, Live Board mount point, header/feed components) is already present and reused.

---

## Technical Context

| Layer | Technology | Notes |
|-------|------------|-------|
| Language/Framework | TypeScript (strict) + Next.js 16.2.4 (App Router) | per constitution |
| UI Library | React 19.2.4 + Radix UI Dialog/Popover | Dialog already in deps; add Popover (`@radix-ui/react-popover`) |
| Rich-text editor | **Tiptap** (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-mention`, `@tiptap/extension-character-count`) | NEW dependency — see Constitution Compliance |
| Form management | `react-hook-form` + `@hookform/resolvers/zod` | NEW dependencies — see Constitution Compliance |
| Styling | Tailwind v4 + CSS variables | Tokens added to `app/globals.css` per design-style.md |
| Backend-as-a-Service | Supabase (Auth + Postgres + Storage) | Storage bucket `kudos-images` (NEW) |
| Validation | Zod (existing, shared between API + form) | Add `KudosCreateBodySchema` to [lib/kudos/schemas.ts](lib/kudos/schemas.ts) |
| Data fetching | TanStack Query (existing) | New keys: `['kudos-create']` (mutation), reuse `['kudos-hashtags']` and `['sunners-search']` |
| State Management | React Context + `useReducer` | Local to modal; no global store. |
| API Style | REST (Next.js Route Handlers) | Same scaffold as existing `route.ts` files |
| i18n | `next-intl` v4.9.1 | New namespace `kudos.compose.*` in `messages/{vi,en}.json` |
| Unit / Integration Tests | Vitest + happy-dom + @testing-library | Existing config in [vitest.config.ts](vitest.config.ts) |
| E2E Tests | Playwright | Existing config in [playwright.config.ts](playwright.config.ts) |

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin.*

- [x] **I. Clean Code & Source Organization** — feature-based folders under `app/`, `components/kudos/compose/`, `lib/kudos/`, `types/kudos.ts`. PascalCase for components, kebab-case for utilities. Single direction: route → service → repository.
- [x] **II. Tech Stack Best Practices** — RSC for non-interactive pieces (Bìa is fine as Client to subscribe to context, but it could be RSC if hoisted state into URL); Supabase server client for `POST /api/kudos`; RLS enabled on `kudos`, `kudos_hashtags`, `kudos_images`; design tokens via CSS variables.
- [x] **III. Test-First Development** — every user story below ships with tests written first. Real Supabase test instance for integration tests of `POST /api/kudos` (no DB mocks).
- [x] **IV. Platform UI & Navigation Guidelines** — responsive (mobile/tablet/desktop), Material Design 3 elevation/state-layer patterns, navigation strictly from `SCREENFLOW.md` (Hủy → Live Board, Gửi → Live Board, B.2 → Tìm kiếm sunner).
- [x] **V. Security First — OWASP** — Zod input validation; Supabase Auth + HttpOnly cookies (existing); parametrized queries via Supabase SDK; RLS policies on all writes; sanitize rich-text body before storage (Tiptap → JSON, server-side schema validation; rendering uses Tiptap's safe-HTML output).

**Violations / Pre-approval needed**:

| Violation | Justification | Alternative Rejected |
|-----------|---------------|----------------------|
| Add `@tiptap/*` dependencies (4 packages) | Building a rich-text editor with @-mention support from scratch is multi-week effort and risks IME bugs (Vietnamese input). Tiptap is the canonical React RTE and treeshakable. | Custom `contentEditable` editor — too much accessibility/IME risk; Slate.js — less React-19-ready; Lexical — heavier and Meta-controlled. |
| Add `react-hook-form` + `@hookform/resolvers` | Manual form state with `useReducer` would re-implement validation/touched/dirty/error flows that RHF provides for ~9KB. The discard-confirmation guard relies on `formState.isDirty`. | Plain `useState` + Zod manually — verbose and error-prone for 5-field form with cross-field validation. |
| Add `@radix-ui/react-popover` | Inline hashtag dropdown anchored to the "+" button needs proper focus trap, escape handling, and outside-click. Manual implementation is bug-prone. | `@floating-ui/react` — lower-level; Radix Popover composes with Dialog more cleanly. |

All three additions MUST be approved in the PR description per constitution §II ("New third-party dependencies MUST be approved by the team").

---

## Architecture Decisions

### Frontend Approach

- **Component pattern**: feature-folder + atomic. New folder [components/kudos/compose/](components/kudos/compose/) hosts the modal and its sub-components. Atoms (e.g., `CharCounter`, `RemoveChipButton`) live in `components/kudos/compose/atoms/`.
- **Styling**: Tailwind v4 utility classes referencing CSS variables defined in `app/globals.css` under a `kudos-compose` token group (e.g., `--color-modal-bg: #FFF8E1`). Hard-coded hex values are forbidden.
- **State management**:
  - Form: `react-hook-form` with a Zod resolver bound to `KudosCreateBodySchema`.
  - Open/close: lifted to `KudosLiveBoard.tsx` and passed via a new `<KudoComposeProvider>` context that exposes `{ isOpen, open(), close(), formMethods }`.
  - Live preview (Bìa): subscribes to the same context; reads `formMethods.watch('title')` and `formMethods.watch('recipient')`.
- **Data fetching**:
  - Hashtag list: `useQuery(['kudos-hashtags'])` — already exists.
  - Submit: `useMutation` calling `POST /api/kudos`; on success invalidate `['kudos-feed', ...]` and `['kudos-stats']`.
  - Image upload: per-thumbnail mutation calling `supabase.storage.from('kudos-images').upload(...)` directly from the browser; URL stored in form state.
- **Navigation**:
  - Hủy / Escape / outside click → `close()`.
  - Gửi → on success, `close()` + toast.
  - B.2 click → `router.push('/sunners/search?returnTo=/kudos&recipientField=true')` (target screen is the unimplemented Tìm kiếm sunner overlay; see open question #1 in research.md).
  - Header nav while dirty → discard-confirmation dialog.

### Backend Approach

- **API design**: REST Route Handlers in [app/api/kudos/route.ts](app/api/kudos/route.ts) (extend existing file with a `POST` export). Auth via existing pattern: `createClient()` → `getUser()` → 401 if absent. Zod-parse body. Insert in a Supabase transaction (Postgres function or sequential statements within a single RPC). Return `{ id, createdAt }`.
- **Data access**: Add `createKudo(supabase, sender_id, payload)` to [lib/kudos/queries.ts](lib/kudos/queries.ts). It performs:
  1. Insert into `kudos` (`title`, `content`, `sender_id`, `receiver_id`, `is_anonymous`).
  2. Bulk insert into `kudos_hashtags` (junction table).
  3. Bulk insert into `kudos_images` (junction table).
  4. Return the created kudos id.
- **Validation**: `KudosCreateBodySchema` (Zod) shared between the form resolver and the API route.
- **Database changes** (NEW migration `supabase/migrations/{timestamp}_kudos_compose.sql`):
  - `ALTER TABLE kudos ADD COLUMN title varchar(100) NOT NULL`.
  - `ALTER TABLE kudos ADD COLUMN is_anonymous boolean NOT NULL DEFAULT false`.
  - RLS: `CREATE POLICY "kudos_insert_own" ON kudos FOR INSERT WITH CHECK (auth.uid() = sender_id);`
  - RLS: equivalent INSERT policies on `kudos_hashtags` and `kudos_images` scoped by `kudos.sender_id`.
  - Update `kudos_with_stats` view to mask `sender_*` columns when `is_anonymous = true` and the viewer is not the sender or admin.
- **Storage**: Create Supabase Storage bucket `kudos-images` (public read, authed write). Bucket policy: only authenticated users can `INSERT`; objects keyed `${user_id}/${random_uuid}.${ext}`.

### Integration Points

- **Existing services**:
  - `createClient` from [lib/supabase/server.ts](lib/supabase/server.ts) — new POST handler.
  - `fetchKudosFeed` from [lib/kudos/queries.ts](lib/kudos/queries.ts) — invalidated on submit.
  - `KudosLiveBoard` — host component for the modal mount.
- **Shared components**: `HashtagChip`, `UserInfoBlock`, `StarTierBadge`, `KudosSectionErrorBoundary`, `KudosSkeleton` (see research.md).
- **API contracts**: published as Zod schemas in `lib/kudos/schemas.ts` — single source of truth for both client and server.

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/ihQ26W78P2-Viet-Kudo/
├── spec.md              # Feature specification (done)
├── design-style.md      # Design specifications (done)
├── plan.md              # This file
├── research.md          # Codebase findings (done)
├── tasks.md             # Generated by /momorph.tasks (next step)
└── assets/              # Frame screenshots
```

### Source Code (affected areas)

```text
# Frontend (new + modified)
app/
└── globals.css                                      # MOD: add design tokens for compose modal

components/kudos/
├── KudosLiveBoard.tsx                               # MOD: mount <KudoComposeModal /> + provider
├── compose/                                         # NEW directory
│   ├── KudoComposeProvider.tsx                      # NEW: context (isOpen, open, close, formMethods, recipient)
│   ├── KudoComposeModal.tsx                         # NEW: Radix Dialog root + layout
│   ├── KudoPreviewCard.tsx                          # NEW: Bìa (desktop only)
│   ├── fields/
│   │   ├── RecipientField.tsx                       # NEW: B (label + B.2 trigger)
│   │   ├── DanhHieuField.tsx                        # NEW: C (label + input + hint + counter)
│   │   ├── RichTextEditor.tsx                       # NEW: D toolbar + E textarea (Tiptap)
│   │   ├── EditorToolbar.tsx                        # NEW: D — toolbar buttons
│   │   ├── CommunityStandardsLink.tsx               # NEW: D.7 (target=_blank)
│   │   ├── HashtagField.tsx                         # NEW: F (label + tag group + picker)
│   │   ├── HashtagPicker.tsx                        # NEW: Radix Popover dropdown
│   │   ├── ImageUploadField.tsx                     # NEW: G (label + thumbnails + + Image button)
│   │   ├── ImageThumbnail.tsx                       # NEW: G.2–G.5 with per-file upload state
│   │   ├── AnonymousToggle.tsx                      # NEW: H
│   │   └── ActionsFooter.tsx                        # NEW: I (Hủy + Gửi)
│   ├── atoms/
│   │   ├── CharCounter.tsx                          # NEW: live n/100 counter
│   │   ├── FormLabel.tsx                            # NEW: label + required asterisk
│   │   └── DiscardConfirmDialog.tsx                 # NEW: dirty-form confirmation
│   └── hooks/
│       ├── useKudoCompose.ts                        # NEW: form orchestration (RHF + RQ mutation)
│       ├── useImageUpload.ts                        # NEW: per-file Supabase Storage upload
│       └── useUnsavedChangesGuard.ts                # NEW: tab-close + nav-intercept

components/kudos/hero/
└── KudosComposeTrigger.tsx                          # MOD: replace router.push with context.open()

lib/kudos/
├── schemas.ts                                       # MOD: + KudosCreateBodySchema, MediaUploadResponseSchema
├── queries.ts                                       # MOD: + createKudo()
└── compose-utils.ts                                 # NEW: tiptap-to-html sanitizer, default extensions

types/
└── kudos.ts                                         # MOD: + KudoCreateInput, KudoComposeFormState

messages/
├── vi.json                                          # MOD: + kudos.compose.* namespace
└── en.json                                          # MOD: + kudos.compose.* namespace

# Backend (new + modified)
app/api/
├── kudos/
│   └── route.ts                                     # MOD: + POST handler
└── media/
    └── upload/
        └── route.ts                                 # NEW (only if direct browser upload is rejected by review)

supabase/migrations/
└── {timestamp}_kudos_compose.sql                    # NEW: title col + is_anonymous col + RLS policies + view update

# Tests (new)
tests/
└── kudos/
    └── compose.spec.ts                              # NEW: Playwright e2e

# Co-located unit tests (Vitest)
components/kudos/compose/
├── KudoComposeModal.test.tsx
├── fields/DanhHieuField.test.tsx
├── fields/HashtagPicker.test.tsx
├── fields/ImageThumbnail.test.tsx
└── hooks/useKudoCompose.test.ts

lib/kudos/
├── schemas.test.ts                                  # zod schema unit tests
└── queries.test.ts                                  # createKudo integration tests (real Supabase)

app/api/kudos/
└── route.test.ts                                    # POST handler integration test (real Supabase)
```

---

## Implementation Strategy

### Phase Breakdown

#### Phase 0 — Asset Preparation (½ day)

- Download required Figma media assets (toolbar icons B/I/S/#/🔗/", IC_Down, MM_MEDIA_Close, MM_MEDIA_Send) into `public/icons/kudos/` using `mcp__momorph__get_media_files` or existing icon component if already present.
- Verify icon naming matches `components/ui/icons/` convention (PascalCase SVG components).
- If icons already exist (Live Board uses many), skip to Phase 1.

#### Phase 1 — Foundation: Schema, DB, API (1.5 days)

*Vertical slice from the bottom — without this, no UI work can be tested end-to-end.*

1. **Migration** (TDD: write integration test first that asserts `kudos.title` exists and RLS blocks foreign-sender INSERTs).
   - Add `title`, `is_anonymous` columns.
   - Add INSERT RLS policies on `kudos`, `kudos_hashtags`, `kudos_images`.
   - Update `kudos_with_stats` view to mask anonymous senders.
   - Provision Supabase Storage `kudos-images` bucket via migration SQL.
2. **Zod schema** (`KudosCreateBodySchema`) in `lib/kudos/schemas.ts` — covers all 5 fields with constraints from spec.
3. **`createKudo()`** in `lib/kudos/queries.ts` — transactional insert + return id.
4. **`POST /api/kudos`** route handler — match existing GET scaffold; auth → Zod parse → `createKudo` → 201.
5. **Vitest integration tests** against local Supabase: happy path, RLS rejection, Zod rejection.

#### Phase 2 — User Story 1 (P1): Submit a Kudo to a teammate (3 days)

*Smallest end-to-end vertical that delivers value.*

1. **`KudoComposeProvider`** + context wiring in `KudosLiveBoard.tsx`.
2. **`KudoComposeModal`** shell — Radix Dialog with focus trap, Escape, overlay.
3. **`RecipientField`** with router push to Tìm kiếm sunner (or temporary inline autocomplete fallback — see open question #1).
4. **`DanhHieuField`** with character counter.
5. **`RichTextEditor`** + minimal `EditorToolbar` (just Bold to start; full formatting deferred to US4).
6. **`HashtagField`** + `HashtagPicker` (Radix Popover) — load tags from existing `/api/hashtags`, select chips.
7. **`ActionsFooter`** with Hủy + Gửi (Gửi disabled-until-valid).
8. **`useKudoCompose`** hook wires form state + mutation + cache invalidation.
9. **Trigger update**: `KudosComposeTrigger` opens the modal.
10. **Vitest**: schema validation, `useKudoCompose` happy path with mocked mutation.
11. **Playwright e2e**: open → fill → submit → assert new card on Live Board.

**Stop and review** before Phase 3 — US1 alone is a viable MVP.

#### Phase 3 — User Stories 2 & 7 (P1): Validation & Hashtags (1.5 days)

1. **Validation UX**: error states on each field; disabled "Gửi" until all required valid; submit attempt highlights first invalid field.
2. **Hashtag dropdown polish**: outside-click to close, keyboard nav within Popover, max 5 enforcement, hide "+ Hashtag" at limit.
3. **Vitest**: each field's error rendering; max-5 enforcement.
4. **Playwright**: empty-submit attempt shows errors; max-5 hashtag attempt blocked.

#### Phase 4 — User Story 4 (P2): Rich-Text Formatting (1 day)

1. Wire all 6 toolbar actions (Bold, Italic, Strike, Numbered, Link, Quote) to Tiptap commands.
2. Add `Mention` extension wired to `/api/sunners?q=` for `@-mention` suggestions.
3. Add `Link` extension with input dialog.
4. Add `CommunityStandardsLink` (target=_blank).
5. **Vitest**: each toolbar command toggles correctly; mention suggestion appears.

#### Phase 5 — User Story 5 (P2): Image Attachments (1.5 days)

1. **`ImageUploadField`** — file input + preview row.
2. **`ImageThumbnail`** — per-file upload state (loading/success/error/retry).
3. **`useImageUpload`** — direct Supabase Storage upload with `AbortController` cancellation.
4. **`MediaUploadResponseSchema`** in `lib/kudos/schemas.ts` (validates server-returned URL shape).
5. **Vitest**: thumbnail state machine; size/type rejection.
6. **Playwright**: attach 1 image, submit, verify image renders on Live Board card.

#### Phase 6 — User Stories 3 & 6 (P1/P2): Cancel & Anonymous (1 day)

1. **`AnonymousToggle`** + payload pass-through.
2. **`useUnsavedChangesGuard`** — `beforeunload` listener + in-app nav intercept.
3. **`DiscardConfirmDialog`** — Radix Dialog confirming discard.
4. Backend: verify `kudos_with_stats` view masks anonymous senders correctly.
5. **Playwright**: anonymous submission verified on Live Board (sender hidden); dirty-form nav shows confirmation.

#### Phase 7 — Polish & Bìa Preview (1 day)

1. **`KudoPreviewCard`** (Bìa) — desktop-only live preview.
2. **Responsive**: mobile bottom-sheet variant; tablet width adjustments.
3. **a11y audit**: keyboard nav through all fields; screen-reader labels; focus management.
4. **Translations**: complete `kudos.compose.*` for both vi and en.
5. **Loading states**: spinner on Gửi; disable all fields during submit.
6. **Error toast**: API failure path; preserve form state.

### Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Tìm kiếm sunner overlay screen not built yet | High | High | Implement temporary inline autocomplete inside the modal as a fallback; leave a TODO to remove once `3jgwke3E8O` ships. |
| Tiptap bundle size impact | Medium | Low | Tree-shaken, ~50KB gzipped for our extension set. Acceptable; document in PR. |
| Supabase Storage RLS misconfiguration leaking images | Low | High | Integration test that verifies a non-owner cannot upload to another user's prefix; verify in PR review. |
| Anonymous-mode privacy leak via `kudos_with_stats` view | Medium | High | Integration test: query the view as user A for an anonymous kudo sent by user B; assert `sender_*` columns are null/masked. |
| Rich-text XSS via @-mentions or pasted HTML | Medium | High | Tiptap stores JSON; we never round-trip raw HTML from input → DB. Render via Tiptap's safe-HTML output on the consumer side (Live Board card). Add a unit test pasting `<script>` to ensure it's stripped. |
| Discard confirmation interferes with normal modal close | Low | Medium | Only intercept *external* navigations; the modal's own Hủy button/Escape bypasses the guard (clearing the form state first). |
| `react-hook-form` + Tiptap controlled-state edge cases | Medium | Medium | Use RHF's `Controller` wrapper for the editor field; `onChange` updates form state from Tiptap's `onUpdate` event. |

### Estimated Complexity

- **Frontend**: High (modal + editor + image upload + Bìa preview + responsive)
- **Backend**: Low (one new endpoint, one migration, one storage bucket)
- **Testing**: Medium (e2e flows + integration against real Supabase)

**Total estimate**: ~10 dev-days for one engineer (excluding code review and Tìm kiếm sunner integration once that screen ships).

---

## Integration Testing Strategy

### Test Scope

- [x] **Component/Module interactions**: KudoComposeModal ↔ KudoComposeProvider ↔ KudoPreviewCard live-update via Context.
- [x] **External dependencies**: Supabase Storage upload, Supabase Postgres RLS policies, `/api/sunners` for mention suggestions.
- [x] **Data layer**: `kudos`, `kudos_hashtags`, `kudos_images` INSERTs and the `kudos_with_stats` view.
- [x] **User workflows**: full compose → submit → Live Board refresh.

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Form submission triggers mutation; validation errors render; live Bìa updates. |
| Service ↔ Service | Yes | `useKudoCompose` ↔ TanStack Query ↔ `POST /api/kudos`; cache invalidation propagates to Live Board. |
| App ↔ External API | Yes | Image upload to Supabase Storage; `/api/sunners?q=` for mentions. |
| App ↔ Data Layer | Yes | RLS enforces sender == auth.uid(); anonymous masking in view. |
| Cross-platform | Yes | Mobile bottom-sheet vs. desktop modal; Bìa visibility breakpoint. |

### Test Environment

- **Environment type**: local Vitest (happy-dom) + local Supabase (Docker via `supabase start`) for integration tests; Playwright against `npm run dev` server with the same local Supabase.
- **Test data strategy**: Supabase `seed.sql` + per-test factory functions in `tests/factories/kudos.ts` (NEW).
- **Isolation approach**: each integration test wraps the DB in a transaction that's rolled back after assertions; e2e tests run against a freshly-seeded local DB.

### Mocking Strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| Supabase Postgres | **Real** (local instance) | Constitution III mandates no DB mocks. |
| Supabase Storage | Real in e2e; mocked in unit tests of `useImageUpload` | Real coverage at e2e level; unit tests focus on state machine. |
| `next/navigation` `useRouter` | Mocked in unit tests | Component tests don't need real navigation. |
| `next-intl` | Real (load actual `vi.json`) | Catches missing translation keys at test time. |

### Test Scenarios Outline

1. **Happy Path**
   - [ ] User opens modal → fills all required fields → submits → Live Board shows new card within 2s.
   - [ ] Anonymous submission hides sender on the Live Board card.
   - [ ] Image upload → submit → image renders on the new card.

2. **Error Handling**
   - [ ] `POST /api/kudos` returns 500 → toast appears, modal stays open with data.
   - [ ] Image upload fails → thumbnail shows error badge with retry.
   - [ ] Network drops mid-submit → user can retry without losing data.

3. **Edge Cases**
   - [ ] User attempts to add 6th hashtag → blocked, button hidden after 5.
   - [ ] User pastes 200 chars into Danh hiệu → truncated to 100, counter red.
   - [ ] User clicks header link with dirty form → discard confirmation appears.
   - [ ] User submits while anonymous → recipient sees the kudos, sender column masked for non-admins.
   - [ ] Foreign user attempts INSERT (RLS bypass attempt) → 403 from Postgres.

### Tooling & Framework

- **Test framework**: Vitest (unit + integration), Playwright (e2e).
- **Supporting tools**: `@testing-library/react`, `happy-dom`, `supabase` CLI for local stack.
- **CI integration**: existing CI runs `npm run test` (Vitest) + `npm run test:e2e` (Playwright); migration applied to ephemeral DB before e2e.

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Schemas + queries (lib) | 95%+ | High |
| Form hooks (useKudoCompose, useImageUpload) | 90%+ | High |
| Modal components | 80%+ | Medium |
| E2E happy paths | 100% of US1-US3 | High |
| E2E edge cases | 100% of edge-case list above | Medium |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved by stakeholders (this PR represents the approval)
- [x] `research.md` completed
- [x] API contracts defined (Zod schemas in `lib/kudos/schemas.ts`)
- [ ] Database migration drafted and reviewed
- [ ] Supabase Storage bucket `kudos-images` provisioned
- [ ] Three new dependencies (`@tiptap/*`, `react-hook-form`, `@radix-ui/react-popover`) approved by team

### External Dependencies

- **Tìm kiếm sunner overlay screen** (`3jgwke3E8O`) — the recipient picker target. If not shipped, we ship US1 with an inline autocomplete fallback.
- **Supabase Storage bucket** — must be provisioned before image upload work begins (Phase 5).
- **Hashtag list** — already populated in DB and served by `/api/hashtags`.

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate the task breakdown (`tasks.md`) from this plan.
2. **Review** `tasks.md` for parallelization opportunities (Phase 1 backend can run in parallel with Phase 0 asset prep; tests are co-located so testing happens within each phase).
3. **Begin** implementation in Phase 0 → Phase 1 order.

---

## Notes

- The existing TODO in [components/kudos/hero/KudosComposeTrigger.tsx](components/kudos/hero/KudosComposeTrigger.tsx) (`router.push('/kudos/new')`) will be removed in Phase 2; the modal pattern obviates the route.
- The Bìa preview card sits *behind* the modal in the same z-index layer but uses pointer-events: none so clicks pass through to the modal overlay. Implement carefully on desktop only.
- The decision to do per-file immediate uploads (Phase 5, FR-018) means the form's submit payload sends URLs (already-uploaded), not files. If the user cancels (Hủy) after uploads, the orphaned objects in Supabase Storage will need a periodic cleanup job — out of scope for this feature; tracked as a follow-up TODO.
- All translations should preserve Vietnamese as the default (vi) per the project's i18n strategy.
- Per constitution §III, every PR landing a Phase below MUST include the corresponding tests written first — code without matching tests will be rejected at review.
