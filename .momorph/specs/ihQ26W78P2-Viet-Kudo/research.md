# Research: Viết Kudo

**Frame**: `ihQ26W78P2-Viet-Kudo`
**Date**: 2026-04-29
**Spec**: `specs/ihQ26W78P2-Viet-Kudo/spec.md`

---

## Purpose

Findings from analysis of the existing my-app codebase, used to inform the implementation plan for the Viết Kudo feature. Notes which existing patterns to leverage and which new components must be authored.

---

## Codebase Analysis

### Existing Patterns Identified

#### Component Patterns

| Pattern | Location | Relevance |
|---------|----------|-----------|
| Compose trigger (Live Board) | [components/kudos/hero/KudosComposeTrigger.tsx](components/kudos/hero/KudosComposeTrigger.tsx) | Already mounted in Live Board hero; currently routes to `/kudos/new` (TODO). Will be retargeted to open the modal. |
| Sunner search trigger | [components/kudos/hero/SunnerSearchTrigger.tsx](components/kudos/hero/SunnerSearchTrigger.tsx) | Reference pattern for a button that opens a separate search overlay screen — same shape needed for the recipient picker (B.2). |
| Hashtag chip | [components/kudos/feed/HashtagChip.tsx](components/kudos/feed/HashtagChip.tsx) | Reusable for the F.2 Tag Group chips inside the modal. |
| Avatar / user info | [components/kudos/shared/UserInfoBlock.tsx](components/kudos/shared/UserInfoBlock.tsx), [components/kudos/shared/AvatarHoverPreview.tsx](components/kudos/shared/AvatarHoverPreview.tsx) | Reusable for the Bìa preview card recipient block. |
| Star tier badge | [components/kudos/shared/StarTierBadge.tsx](components/kudos/shared/StarTierBadge.tsx) | Reusable for Bìa "huy hiệu" rendering. |
| Live Board container | [components/kudos/KudosLiveBoard.tsx](components/kudos/KudosLiveBoard.tsx) | Will host the modal mount point and the Bìa background overlay. |
| Locale strings | [messages/vi.json](messages/vi.json), [messages/en.json](messages/en.json) | All user-facing strings MUST go here under `kudos.compose.*`. |
| Skeleton / error boundary | [components/kudos/shared/KudosSkeleton.tsx](components/kudos/shared/KudosSkeleton.tsx), [components/kudos/shared/KudosSectionErrorBoundary.tsx](components/kudos/shared/KudosSectionErrorBoundary.tsx) | Use for image-thumbnail loading states and modal-level error containment. |

#### API Patterns

| Pattern | Location | Relevance |
|---------|----------|-----------|
| Auth-gated route handler | [app/api/kudos/route.ts](app/api/kudos/route.ts), [app/api/sunners/route.ts](app/api/sunners/route.ts) | Identical scaffold: `createClient()` → `getUser()` → 401 if absent → Zod parse → query. New `POST /api/kudos` handler must match this exact pattern. |
| Zod request schemas | [lib/kudos/schemas.ts](lib/kudos/schemas.ts) | Add `KudosCreateBodySchema` and `MediaUploadResponseSchema` here, exported alongside existing schemas. |
| ILIKE escape helper | [app/api/sunners/route.ts](app/api/sunners/route.ts) | Already exists for the recipient autocomplete — no change needed. |
| Snake-case → camelCase mapping | [lib/kudos/queries.ts](lib/kudos/queries.ts) `mapViewRowToKudos` | Establishes the convention: DB rows are snake_case, API responses are camelCase. New POST insert must respect this and either return the created Kudo via the same mapper or return only `{ id }`. |
| Hashtag list endpoint | [app/api/hashtags/route.ts](app/api/hashtags/route.ts) | Already returns the list — reuse for the inline F.3 dropdown picker. |

#### Testing Patterns

| Pattern | Location | Relevance |
|---------|----------|-----------|
| Vitest config | [vitest.config.ts](vitest.config.ts) | Already configured with happy-dom + testing-library. Use for unit/integration tests of the modal, hooks, and schema validators. |
| Playwright config | [playwright.config.ts](playwright.config.ts) | Already configured. Add a new e2e spec under [tests/](tests/) covering the compose → submit happy path. |
| Integration tests against real Supabase | (constitution III) | Mocking the DB is forbidden. Integration tests for `POST /api/kudos` must run against the local Supabase test instance. |

---

## Reusable Components

### Components to Leverage

| Component | Path | Usage in Feature |
|-----------|------|------------------|
| `@radix-ui/react-dialog` Dialog | npm dependency | Root modal primitive — provides `<Dialog.Root>`, `<Dialog.Portal>`, `<Dialog.Overlay>`, `<Dialog.Content>` with built-in focus trap, Escape handling, and `aria-modal`. |
| `HashtagChip` | [components/kudos/feed/HashtagChip.tsx](components/kudos/feed/HashtagChip.tsx) | F.2 Tag Group selected chips. |
| `UserInfoBlock` | [components/kudos/shared/UserInfoBlock.tsx](components/kudos/shared/UserInfoBlock.tsx) | Bìa preview card recipient block. |
| `StarTierBadge` | [components/kudos/shared/StarTierBadge.tsx](components/kudos/shared/StarTierBadge.tsx) | Bìa "Huy hiệu + Sao" row. |
| `KudosSectionErrorBoundary` | [components/kudos/shared/KudosSectionErrorBoundary.tsx](components/kudos/shared/KudosSectionErrorBoundary.tsx) | Wrap modal content to catch render errors. |
| `KudosSkeleton` | [components/kudos/shared/KudosSkeleton.tsx](components/kudos/shared/KudosSkeleton.tsx) | Image thumbnail loading skeleton. |

### Hooks to Leverage

| Hook | Path | Usage in Feature |
|------|------|------------------|
| `useTranslations` | `next-intl` (npm) | All user-visible Vietnamese strings. Add a new `kudos.compose` namespace. |
| `useRouter` | `next/navigation` | Triggering navigation to `Tìm kiếm sunner` (recipient picker), header links. |
| `useQuery`, `useMutation` | `@tanstack/react-query` | Hashtag list cache; submit mutation with optimistic update of feed cache. |

### Services to Leverage

| Service | Path | Usage in Feature |
|---------|------|------------------|
| Supabase server client | [lib/supabase/server.ts](lib/supabase/server.ts) (`createClient`) | All authenticated route handlers. |
| Supabase browser client | [lib/supabase/](lib/supabase/) | Image upload via Supabase Storage from the browser (faster — bypasses our Node API for file bytes). |
| TanStack Query client | (existing provider in `app/providers/`) | Add new query keys: `['kudos-hashtags']` (already exists), `['kudos-create']` (mutation). |

---

## Integration Points

### APIs to Connect

| API Endpoint | Method | Current Status | Notes |
|--------------|--------|----------------|-------|
| `/api/kudos` | GET | Exists ([route.ts](app/api/kudos/route.ts)) | Read-only feed; no change. |
| `/api/kudos` | POST | **New** | Add to same route file (Next.js App Router supports multiple verbs in one `route.ts`). Must validate `KudosCreateBodySchema`, insert into `kudos` table, link rows in `kudos_hashtags` and `kudos_images` join tables, then return the created `{ id }`. |
| `/api/sunners?q=` | GET | Exists ([route.ts](app/api/sunners/route.ts)) | Used by the **Tìm kiếm sunner** overlay (separate screen). Modal does not call this directly. |
| `/api/hashtags` | GET | Exists ([route.ts](app/api/hashtags/route.ts)) | Used by the inline F.3 dropdown picker. |
| `/api/users/me` | GET | Exists in [app/api/me/](app/api/me/) | Used to populate Bìa "sender" placeholder when not anonymous (already cached by Live Board). |
| `/api/media/upload` | POST | **New** | Wraps Supabase Storage SDK; validates file type/size; returns `{ url }`. Alternative: upload directly from the browser to Supabase Storage and skip this route. |

### Database Entities

| Entity | Table | Status | Notes |
|--------|-------|--------|-------|
| `kudos` | `kudos` | Exists | Add `title` column (varchar(100), NOT NULL) and `is_anonymous` column (boolean, default false) — both new for this feature. RLS policy must allow INSERT only when `auth.uid() = sender_id`. |
| `kudos_hashtags` | `kudos_hashtags` | Likely exists (referenced by `kudos_with_stats` view via `hashtag_names`) | Verify in supabase/migrations. Add INSERT RLS policy: only the kudos sender can attach hashtags to their own kudos. |
| `kudos_images` | `kudos_images` | Likely exists (referenced by `image_urls` column) | Same RLS rule. |
| `profiles` | `profiles` | Exists | Read-only from this feature (recipient lookup, sender avatar). |

### External Services

| Service | Purpose | Integration Method |
|---------|---------|--------------------|
| Supabase Storage | Image attachment uploads | `@supabase/supabase-js` browser SDK; bucket `kudos-images` (public-read for display, signed-URL or auth-only for write). |
| Supabase Realtime / WS | Live feed refresh | Already wired by Live Board (`lib/kudos/realtime.ts`); after successful POST the new row will be broadcast and TanStack Query cache invalidated. |

---

## Potential Challenges

### Technical Challenges

| Challenge | Impact | Proposed Solution |
|-----------|--------|-------------------|
| **Rich-text editor + @-mentions + character formatting** | High | Use **Tiptap** (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-mention`). Tiptap is the canonical Next.js + React 19 RTE; it's framework-agnostic and storage-format-agnostic (we'll persist the JSON document). The mention extension needs an `items` source — wire to `/api/sunners?q=`. |
| **Bìa preview card outside modal DOM** | Med | Use a separate React component mounted as a sibling to the Dialog Portal. Both the modal and the preview share state through a `<KudoComposeContext>` provider rendered above them. CSS: `display: none` below `lg:` breakpoint. |
| **Per-file immediate image upload + retry/error per thumbnail** | Med | Each thumbnail is its own component with local upload state (`{ status, url?, error? }`). The parent only collects URLs once `status === 'success'`. Use `AbortController` so removing a thumbnail mid-upload cancels the request. |
| **Inline hashtag dropdown anchored to button** | Low | `@radix-ui/react-popover` (already in the Radix family — adding it is consistent with existing dialog use). Or a manual portal + `useFloating` from `@floating-ui/react`. Prefer Radix Popover for keyboard a11y. |
| **Discard-confirmation when navigating away** | Med | Two layers: (a) Next.js App Router `useBeforeUnload` for tab close; (b) intercept all in-app navigation via a custom hook that wraps `router.push` with a confirmation Dialog when `formIsDirty`. The existing header components do not currently have this guard, so a small change to the header avatar/nav clicks may be required, OR the modal can register a `popstate` listener that intercepts before navigation completes. |
| **Live Bìa update on every keystroke** | Low | Title is short (≤100 chars), no debounce needed. The Bìa subscribes to the same Context provider as the form, so React's natural reconciliation handles it. |
| **Modal opens via a route change today** | Low | Existing `KudosComposeTrigger` does `router.push('/kudos/new')`. Switch to a state-driven `open` prop on the modal mounted inside `KudosLiveBoard`. This unblocks the design's "click trigger → modal appears overlaying the board" interaction without a hard navigation. |

### Integration Challenges

| Challenge | Impact | Proposed Solution |
|-----------|--------|-------------------|
| Returning to modal from Tìm kiếm sunner overlay with the recipient pre-filled | Med | The Tìm kiếm sunner screen (`3jgwke3E8O`) hasn't been implemented yet. Until it is, the recipient picker may need to be a temporary inline autocomplete. Coordinate with that screen's plan: it should accept a `?returnTo=/kudos&recipientField=true` query param and route back via `router.replace` with a recipient ID in the URL or session storage. |
| RLS policies on `kudos` INSERT | High | Add migration with `CREATE POLICY "kudos_insert_own" ON kudos FOR INSERT WITH CHECK (auth.uid() = sender_id)`. Same for `kudos_hashtags` and `kudos_images`. |
| Anonymous mode privacy | High | When `is_anonymous = true`, the read query (`kudos_with_stats` view) MUST mask `sender_*` columns to non-admin users. Update view definition as part of the migration. The sender themselves and admins still see the real sender. |

---

## Recommendations

### Architecture Recommendations

1. **State-driven modal, not route-driven** — open/close the modal via a state lifted into `KudosLiveBoard` (or a small `useKudoComposeStore` Zustand-style provider). The TODO in `KudosComposeTrigger` is removed; the trigger toggles the modal directly.
2. **Tiptap for rich-text** — battle-tested, React-first, supports all six toolbar actions natively, and has a first-party `Mention` extension for the `@-mention` requirement.
3. **Browser-direct upload to Supabase Storage** — avoid round-tripping image bytes through our Node API; use Supabase JS browser client. The `/api/media/upload` route remains as a thin helper that returns a signed upload URL only if direct upload is judged risky.
4. **Single Context provider for modal + Bìa** — one provider in `KudosLiveBoard.tsx` that exposes `{ formState, setField, recipient, isOpen, ... }` to both the modal and the Bìa preview, ensuring real-time sync.
5. **Zod schemas as the single source of truth** — `KudosCreateBodySchema` is consumed by the form (via `react-hook-form` resolver — to be installed) AND the API route. No drift between client and server validation.

### Implementation Recommendations

1. **Start with the API + DB migration (vertical slice from the bottom)** — without `POST /api/kudos`, US1 cannot be tested end-to-end. Add the migration, RLS policies, route, and a Vitest integration test against the local Supabase instance — all before any UI.
2. **Leverage existing Radix Dialog usage** — even though the Live Board doesn't use Dialog yet, Radix is already in the dependency tree, so no new dependency cost.
3. **Avoid building a custom RTE** — Tiptap saves weeks of work and is well-tested for accessibility/IME (Vietnamese input).
4. **Keep the Bìa preview lightweight** — read-only view of form state; do not duplicate styles. Reuse existing card components from the Live Board feed where possible.

### Testing Recommendations

1. **Focus on**:
   - Form validation logic (unit; pure functions on the schema).
   - The `useKudoCompose` state hook (unit; behavioral).
   - `POST /api/kudos` against a real Supabase test instance (integration; per constitution).
   - The full happy path: open modal → select recipient → fill all fields → submit → verify Live Board feed updated (e2e Playwright).
2. **Mock**:
   - `next/navigation` for unit tests of components that call `router.push`.
   - Supabase Storage upload in unit/component tests (real upload only in e2e).
3. **E2E scenarios**:
   - Submit a kudos to a fixture user; verify the post appears.
   - Submit anonymously; verify sender info is masked on the feed.
   - Validation: blocked submit when title is empty.
   - Discard confirmation on header nav click while form is dirty.

---

## Files to Review Before Implementation

### Must Read

- [ ] [lib/kudos/queries.ts](lib/kudos/queries.ts) — understand `mapViewRowToKudos` and the camelCase API contract.
- [ ] [app/api/kudos/route.ts](app/api/kudos/route.ts) — match the auth/Zod scaffold exactly.
- [ ] [components/kudos/KudosLiveBoard.tsx](components/kudos/KudosLiveBoard.tsx) — find the mount point for the modal and Bìa.
- [ ] [components/kudos/hero/KudosComposeTrigger.tsx](components/kudos/hero/KudosComposeTrigger.tsx) — replace its `router.push` with modal-open behavior.
- [ ] [supabase/migrations/](supabase/migrations/) — see how RLS policies are written today; mirror that style for the new migration.
- [ ] [.momorph/constitution.md](.momorph/constitution.md) — full re-read; design-token gate, RLS gate, and TDD gate all apply.

### Recommended

- [ ] [lib/kudos/realtime.ts](lib/kudos/realtime.ts) — confirm whether new INSERTs are auto-broadcast (likely yes).
- [ ] [messages/vi.json](messages/vi.json) — namespace pattern for adding `kudos.compose.*` strings.
- [ ] [tests/](tests/) — existing Playwright spec patterns.

---

## Open Questions

- [ ] Will the **Tìm kiếm sunner overlay screen** (`3jgwke3E8O`) be implemented before this feature, or do we need a temporary inline autocomplete fallback inside the modal?
- [ ] Is the **Supabase Storage bucket** for kudos images already provisioned, and what is its naming convention?
- [ ] Are images stored with public URLs or signed URLs? (impacts `image_urls` column vs. signed-URL fetcher)
- [ ] Should the inline hashtag picker support typing to filter, or only click-to-select from a fixed list? (Spec is silent; design suggests click-to-select.)

---

## Notes

- The codebase is in good shape — most foundational pieces (auth, Zod patterns, query mapper, Live Board scaffold) already exist. The bulk of new work is UI: the modal itself, the rich-text editor wiring, the image upload component, and the Bìa preview card. The backend additions are limited and well-scoped.
- The currently-empty `'/kudos/new'` route (referenced as a TODO in the trigger) should be removed once the modal pattern is in place. Alternatively, keep `/kudos/new` as a deep-link route that simply opens the modal on top of the Live Board page — Next.js App Router's intercepting routes (`(.)kudos/new`) make this idiomatic, but it adds complexity. **Recommend deferring the deep-link variant** to a future iteration.
