# Tasks: Viết Kudo

**Frame**: `ihQ26W78P2-Viet-Kudo`
**Prerequisites**: plan.md ✓, spec.md ✓, design-style.md ✓, research.md ✓

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this belongs to (US1, US2, US3, US4, US5, US6, US7)
- **|**: File path affected by this task

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependency approval, design tokens, i18n scaffolding

- [ ] T001 Approve and install Tiptap stack: `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-mention`, `@tiptap/extension-character-count` | package.json
- [ ] T002 Install `react-hook-form` + `@hookform/resolvers` for form validation | package.json
- [ ] T003 Install `@radix-ui/react-popover` for inline hashtag dropdown | package.json
- [x] T004 [P] Add design tokens for compose modal (`--color-modal-bg`, `--color-border`, `--color-required`, `--color-primary-btn`, `--radius-modal`, `--radius-image`, etc.) per design-style.md | app/globals.css
- [ ] T005 [P] Download Figma media icons (toolbar B/I/S/#/🔗/", IC_Down, MM_MEDIA_Close, MM_MEDIA_Send, IC_Image, MM_MEDIA_Close Tiny) using `mcp__momorph__get_media_files` | public/icons/kudos/
- [x] T006 [P] Add `kudos.compose.*` translation keys (Vietnamese) for all field labels, placeholders, hints, error messages, and toasts | messages/vi.json
- [x] T007 [P] Add `kudos.compose.*` translation keys (English) | messages/en.json
- [x] T008 [P] Create empty `components/kudos/compose/` folder with subfolders `fields/`, `atoms/`, `hooks/` | components/kudos/compose/

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Database schema, RLS policies, Storage bucket, Zod schemas, query helpers, and the new `POST /api/kudos` route — required by ALL user stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 Write Vitest integration test (TDD: must FAIL before T010) asserting `kudos.title` column exists, NOT NULL, varchar(100); `is_anonymous` column exists, default false; INSERT RLS rejects foreign sender_id | lib/kudos/queries.test.ts
- [x] T010 Write Supabase migration: `ALTER TABLE kudos ADD COLUMN title varchar(100) NOT NULL`, `ADD COLUMN is_anonymous boolean NOT NULL DEFAULT false`, RLS INSERT policies on `kudos`, `kudos_hashtags`, `kudos_images`, update `kudos_with_stats` view to mask `sender_*` when `is_anonymous=true` for non-owner non-admin viewers | supabase/migrations/{timestamp}_kudos_compose.sql
- [x] T011 [P] Add Supabase Storage bucket `kudos-images` (public read, authenticated write) with object-path policy `${user_id}/${random_uuid}.${ext}` | supabase/migrations/{timestamp}_kudos_images_bucket.sql
- [x] T012 [P] Add `KudosCreateBodySchema` (Zod) covering recipientId, title (1–100 chars), content (rich-text JSON), hashtagIds (1–5 items), imageUrls (0–5 URLs), isAnonymous boolean | lib/kudos/schemas.ts
- [x] T013 [P] Add `MediaUploadResponseSchema` (Zod) validating `{ url: string, path: string }` | lib/kudos/schemas.ts
- [x] T014 [P] Add `KudoCreateInput` and `KudoComposeFormState` types | types/kudos.ts
- [x] T015 Write Vitest schema tests for `KudosCreateBodySchema` (happy + each rejection case: empty title, 101-char title, 6 hashtags, 6 images, missing recipientId) | lib/kudos/schemas.test.ts
- [x] T016 Implement `createKudo(supabase, senderId, payload)` query helper performing transactional insert into `kudos` + `kudos_hashtags` + `kudos_images`; returns `{ id, createdAt }` | lib/kudos/queries.ts
- [x] T017 Write Vitest integration test for `createKudo` against local Supabase: happy insert, RLS rejection when senderId != auth.uid, hashtag join row count, image join row count | lib/kudos/queries.test.ts
- [x] T018 Write Vitest integration test (TDD) for `POST /api/kudos`: 201 + body, 401 unauthed, 400 invalid payload | app/api/kudos/route.test.ts
- [x] T019 Add `POST` export to existing route handler — auth via `createClient()` + `getUser()`, parse via `KudosCreateBodySchema`, call `createKudo`, return 201 | app/api/kudos/route.ts

**Checkpoint**: Foundation ready — backend can be exercised end-to-end via curl/test; user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Submit a Kudo to a teammate (Priority: P1) 🎯 MVP

**Goal**: A logged-in user can open the modal from the Live Board, fill in all required fields, click Gửi, and see the new Kudo appear on the feed.

**Independent Test**: Open Live Board → click "Ghi nhận" → fill recipient (fallback inline autocomplete acceptable) + title + body + hashtag → click Gửi → assert new card appears on feed within 2s.

### Frontend (US1)

- [x] T020 [P] [US1] Create atom `<FormLabel required={boolean}>{children}</FormLabel>` rendering label + red `*` when `required` per design-style.md B.1/C.Label/F.1 | components/kudos/compose/atoms/FormLabel.tsx
- [x] T021 [P] [US1] Create atom `<CharCounter current={n} max={100} />` with red color when `n === max` | components/kudos/compose/atoms/CharCounter.tsx
- [x] T022 [US1] Create `<KudoComposeProvider>` exposing `{ isOpen, open, close, formMethods, recipient, setRecipient }` via React Context using `react-hook-form`'s `useForm` with `KudosCreateBodySchema` resolver | components/kudos/compose/KudoComposeProvider.tsx
- [x] T023 [US1] Implement `useKudoCompose` hook: orchestrates form submit via TanStack `useMutation` calling `POST /api/kudos`; on success closes modal, invalidates `['kudos-feed']` + `['kudos-stats']`, fires success toast | components/kudos/compose/hooks/useKudoCompose.ts
- [x] T024 [P] [US1] Implement `<RecipientField />` (B): label + click-to-open trigger that routes to Tìm kiếm sunner overlay; if overlay screen unavailable, ship temporary inline autocomplete using `/api/sunners?q=` with 300ms debounce (TODO comment to remove once `3jgwke3E8O` ships) | components/kudos/compose/fields/RecipientField.tsx
- [x] T025 [P] [US1] Implement `<DanhHieuField />` (C): label + 514px-fixed input + hint + char-counter; max 100 chars hard-blocked at input | components/kudos/compose/fields/DanhHieuField.tsx
- [x] T026 [US1] Implement `<RichTextEditor />` (D + E): Tiptap editor with `StarterKit` only (Bold for now; full toolbar deferred to US4); RHF `Controller` integration; @-mention placeholder hint (E.1) | components/kudos/compose/fields/RichTextEditor.tsx
- [x] T027 [US1] Implement minimal `<HashtagField />` (F) — supports a single chip (multi-select picker comes in US7); enables form validity when ≥1 hashtag is selected | components/kudos/compose/fields/HashtagField.tsx
- [x] T028 [US1] Implement `<ActionsFooter />` (I): Hủy + Gửi buttons with disabled-until-valid logic from `formMethods.formState.isValid`; loading spinner on Gửi during submit | components/kudos/compose/fields/ActionsFooter.tsx
- [x] T029 [US1] Implement `<KudoComposeModal />` using Radix `<Dialog>` with focus trap, Escape, overlay; lays out A → B → C → editor → F → I per design-style.md ASCII diagram | components/kudos/compose/KudoComposeModal.tsx
- [x] T030 [US1] Mount `<KudoComposeProvider>` + `<KudoComposeModal />` inside the Live Board container | components/kudos/KudosLiveBoard.tsx
- [x] T031 [US1] Replace `router.push('/kudos/new')` TODO with `useKudoCompose().open()` to open the modal in-place | components/kudos/hero/KudosComposeTrigger.tsx

### Tests (US1)

- [ ] T032 [P] [US1] Vitest: `useKudoCompose` happy path with mocked mutation + cache invalidation assertions | components/kudos/compose/hooks/useKudoCompose.test.ts
- [ ] T033 [P] [US1] Vitest: `<DanhHieuField />` renders, accepts input, blocks 101st char, counter color flips at 100 | components/kudos/compose/fields/DanhHieuField.test.tsx
- [ ] T034 [P] [US1] Vitest: `<KudoComposeModal />` open/close, focus trap, Escape closes | components/kudos/compose/KudoComposeModal.test.tsx
- [ ] T035 [US1] Playwright e2e: open modal → fill all required fields → submit → assert new card on Live Board within 2s | tests/kudos/compose.spec.ts

**Checkpoint**: User Story 1 complete — minimum viable Kudo can be submitted end-to-end.

---

## Phase 4: User Story 7 - Add hashtag categories to the Kudo (Priority: P1)

**Goal**: Users can add 1–5 hashtag chips via an inline dropdown anchored under the "+ Hashtag" button; chips are individually removable; "+ Hashtag" hidden at 5.

**Independent Test**: Click "+ Hashtag" → dropdown opens → click a tag → chip appears → repeat to 5 → "+ Hashtag" disappears → click `×` on a chip → chip removed → "+ Hashtag" reappears.

### Frontend (US7)

- [ ] T036 [P] [US7] Implement `<HashtagPicker />` using Radix `<Popover>`: anchored under trigger, populates from `useQuery(['kudos-hashtags'])`, click-to-select, outside-click closes | components/kudos/compose/fields/HashtagPicker.tsx
- [ ] T037 [US7] Extend `<HashtagField />` to multi-select: render selected as `<HashtagChip />` (reuse `components/kudos/feed/HashtagChip.tsx`) with `×` button; show "+ Hashtag" trigger only when `selected.length < 5` | components/kudos/compose/fields/HashtagField.tsx

### Tests (US7)

- [ ] T038 [P] [US7] Vitest: `<HashtagPicker />` opens, lists tags, click adds chip, outside-click closes | components/kudos/compose/fields/HashtagPicker.test.tsx
- [ ] T039 [P] [US7] Vitest: `<HashtagField />` enforces max 5; `×` removes; "+ Hashtag" hides/shows at boundary | components/kudos/compose/fields/HashtagField.test.tsx
- [ ] T040 [US7] Playwright e2e: add 5 hashtags → trigger hides → remove one → trigger reappears | tests/kudos/compose.spec.ts

**Checkpoint**: User Stories 1 & 7 complete — full hashtag workflow available.

---

## Phase 5: User Story 2 - Form validation blocks incomplete submission (Priority: P1)

**Goal**: Gửi button is disabled until all required fields are valid; field-level errors render inline; submit attempt with empty required field highlights the first invalid field.

**Independent Test**: Open modal → leave required fields empty → confirm Gửi disabled → fill some but not all → confirm Gửi still disabled → fill all → Gửi enabled with #FFEAA9 background.

### Frontend (US2)

- [ ] T041 [P] [US2] Add `<FieldError />` atom that renders RHF errors with red border + linked `aria-describedby` message; reusable across all fields | components/kudos/compose/atoms/FieldError.tsx
- [ ] T042 [US2] Wire `<FieldError />` into all 4 required fields (RecipientField, DanhHieuField, RichTextEditor, HashtagField) using `formState.errors` from `useFormContext` | components/kudos/compose/fields/RecipientField.tsx, DanhHieuField.tsx, RichTextEditor.tsx, HashtagField.tsx
- [ ] T043 [US2] Add scroll-to-and-focus first invalid field on submit attempt with empty required fields | components/kudos/compose/hooks/useKudoCompose.ts

### Tests (US2)

- [ ] T044 [P] [US2] Vitest: `<FieldError />` renders red border + message when error prop present | components/kudos/compose/atoms/FieldError.test.tsx
- [ ] T045 [US2] Playwright e2e: empty submit → red borders on all 4 required fields, focus on RecipientField | tests/kudos/compose.spec.ts

**Checkpoint**: User Stories 1, 7, 2 complete — invalid submissions are prevented and surfaced.

---

## Phase 6: User Story 3 - Cancel / discard the Kudo (Priority: P1)

**Goal**: Hủy button, Escape key, and backdrop click all close the modal; if any field is dirty, a discard-confirmation dialog appears; pristine forms close silently.

**Independent Test**: Type some content → click Hủy → confirmation dialog → confirm → modal closes, no API call. Repeat with Escape and backdrop click. Open with no input → click Hủy → modal closes silently.

### Frontend (US3)

- [ ] T046 [P] [US3] Implement `<DiscardConfirmDialog />` using Radix `<Dialog>` with "Bạn có muốn hủy không?" + Confirm/Cancel buttons | components/kudos/compose/atoms/DiscardConfirmDialog.tsx
- [ ] T047 [US3] Implement `useUnsavedChangesGuard` hook: registers `beforeunload` listener for tab close; intercepts in-app navigation (header link clicks) when `formState.isDirty` is true | components/kudos/compose/hooks/useUnsavedChangesGuard.ts
- [ ] T048 [US3] Wire guard into all close paths in `<KudoComposeModal />` (Hủy click, Escape, overlay click); skip guard when `!isDirty` | components/kudos/compose/KudoComposeModal.tsx

### Tests (US3)

- [ ] T049 [P] [US3] Vitest: `useUnsavedChangesGuard` fires confirmation when dirty; passes through when pristine | components/kudos/compose/hooks/useUnsavedChangesGuard.test.ts
- [ ] T050 [US3] Playwright e2e: dirty form + Hủy → confirmation appears → Confirm closes; Cancel keeps modal | tests/kudos/compose.spec.ts
- [ ] T051 [US3] Playwright e2e: pristine modal + Hủy → silent close, no confirmation | tests/kudos/compose.spec.ts

**Checkpoint**: All P1 user stories (US1, US2, US3, US7) complete — feature is shippable as MVP.

---

## Phase 7: User Story 4 - Apply rich-text formatting to the message (Priority: P2)

**Goal**: All 6 toolbar actions (Bold, Italic, Strike, Numbered list, Link, Quote) work; @-mentions trigger sunner suggestions; "Tiêu chuẩn cộng đồng" link opens in a new tab.

**Independent Test**: Type text → select → click Bold → text bolds + button toggles active. Repeat for each action. Type `@` → suggestion list of sunners appears.

### Frontend (US4)

- [ ] T052 [P] [US4] Implement `<EditorToolbar />` with 6 buttons (Bold/Italic/Strike/Number/Link/Quote) calling Tiptap's `chain().toggleBold()` etc.; first button has `border-radius: 8px 0 0 0` per design-style.md | components/kudos/compose/fields/EditorToolbar.tsx
- [ ] T053 [P] [US4] Add Tiptap extensions to editor: `@tiptap/extension-link` with input dialog, blockquote/strikethrough/orderedList from StarterKit, character count | components/kudos/compose/fields/RichTextEditor.tsx
- [ ] T054 [US4] Add `@tiptap/extension-mention` configured with `items` source calling `/api/sunners?q=`; render suggestions as a popover anchored to caret | components/kudos/compose/fields/RichTextEditor.tsx
- [ ] T055 [P] [US4] Implement `<CommunityStandardsLink />` (D.7) with `target="_blank" rel="noopener noreferrer"` linking to community standards page | components/kudos/compose/fields/CommunityStandardsLink.tsx
- [ ] T056 [US4] Wire `<CommunityStandardsLink />` into the toolbar row (right-aligned via `ml-auto`) | components/kudos/compose/fields/EditorToolbar.tsx
- [ ] T057 [US4] Add HTML sanitizer in `compose-utils.ts` ensuring Tiptap output JSON is safe before submit; reject `<script>` and `javascript:` URLs | lib/kudos/compose-utils.ts

### Tests (US4)

- [ ] T058 [P] [US4] Vitest: `<EditorToolbar />` each button toggles correct Tiptap mark/node | components/kudos/compose/fields/EditorToolbar.test.tsx
- [ ] T059 [P] [US4] Vitest: `compose-utils.ts` sanitizer strips `<script>` and `javascript:` URLs from pasted content | lib/kudos/compose-utils.test.ts
- [ ] T060 [US4] Playwright e2e: type, select, bold; type `@` and select a mention | tests/kudos/compose.spec.ts

**Checkpoint**: User Story 4 complete — full rich-text editor functional.

---

## Phase 8: User Story 5 - Attach images to the Kudo (Priority: P2)

**Goal**: User can attach 0–5 images, each uploaded immediately to Supabase Storage; thumbnails show loading/success/error states; individual remove works; max-5 hides "+ Image".

**Independent Test**: Click "+ Image" → file picker → select 1 image → thumbnail with spinner appears → upload completes → URL stored in form state. Click `×` → thumbnail removed.

### Frontend (US5)

- [ ] T061 [P] [US5] Implement `useImageUpload` hook: accepts `File`, validates type (`jpeg|png|gif|webp`) + size (≤5 MB) client-side, uploads via Supabase Storage browser client to `kudos-images` bucket with key `${user_id}/${uuid}.${ext}`, returns `{ status, url, error }` reactive state; supports cancellation via AbortController | components/kudos/compose/hooks/useImageUpload.ts
- [ ] T062 [P] [US5] Implement `<ImageThumbnail />` (G.2–G.5): 80×80px white card with `border-radius: 18px`, displays uploaded image or skeleton/spinner during upload, error badge on failure with retry, `×` button removes (cancels in-flight upload) | components/kudos/compose/fields/ImageThumbnail.tsx
- [ ] T063 [US5] Implement `<ImageUploadField />` (G): label + thumbnails row + "+ Image" button (98×48px); hides "+ Image" when 5 thumbnails staged; accepts `multiple` file input | components/kudos/compose/fields/ImageUploadField.tsx
- [ ] T064 [US5] Wire successful upload URLs into `formMethods` `imageUrls` field array | components/kudos/compose/hooks/useKudoCompose.ts
- [ ] T065 [US5] Mount `<ImageUploadField />` in `<KudoComposeModal />` between hashtag and anonymous toggle | components/kudos/compose/KudoComposeModal.tsx

### Tests (US5)

- [ ] T066 [P] [US5] Vitest: `useImageUpload` rejects oversize/wrong-type files; returns URL on success; AbortController cancels mid-flight | components/kudos/compose/hooks/useImageUpload.test.ts
- [ ] T067 [P] [US5] Vitest: `<ImageThumbnail />` state machine renders correct UI for loading/success/error | components/kudos/compose/fields/ImageThumbnail.test.tsx
- [ ] T068 [US5] Playwright e2e: attach 1 valid image → upload completes → submit → image renders on Live Board card | tests/kudos/compose.spec.ts
- [ ] T069 [US5] Playwright e2e: attach 5 images → "+ Image" hidden; remove one → "+ Image" reappears | tests/kudos/compose.spec.ts

**Checkpoint**: User Story 5 complete — image attachments fully working.

---

## Phase 9: User Story 6 - Send Kudo anonymously (Priority: P2)

**Goal**: User can toggle anonymous checkbox; submitted Kudo has `is_anonymous=true`; Live Board card masks sender identity for non-owner non-admin viewers.

**Independent Test**: Open modal → check anonymous toggle → submit → log in as a different user → view Live Board → assert sender name/avatar are masked on the new card.

### Frontend (US6)

- [ ] T070 [P] [US6] Implement `<AnonymousToggle />` (H): 24×24px Radix `<Checkbox>` with `border-radius: 4px`, checked-state background `#FFEAA9`; label "Gửi lời cám ơn và ghi nhận ẩn danh" | components/kudos/compose/fields/AnonymousToggle.tsx
- [ ] T071 [US6] Wire `isAnonymous` into form state and POST payload | components/kudos/compose/hooks/useKudoCompose.ts
- [ ] T072 [US6] Mount `<AnonymousToggle />` between content area and actions footer in `<KudoComposeModal />` | components/kudos/compose/KudoComposeModal.tsx

### Tests (US6)

- [ ] T073 [P] [US6] Vitest integration: query `kudos_with_stats` view as user A for an anonymous kudos sent by user B; assert `sender_name` and `sender_avatar_url` are NULL/masked | lib/kudos/queries.test.ts
- [ ] T074 [US6] Playwright e2e: send anonymous kudos → log in as recipient → assert Live Board card hides sender identity | tests/kudos/compose.spec.ts

**Checkpoint**: All user stories complete.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Bìa preview card, responsive variants, accessibility, error UX, translations, cleanup.

- [ ] T075 [P] Implement `<KudoPreviewCard />` (Bìa, `520:11607`): subscribes to `KudoComposeProvider` context, displays recipient avatar/name/badges and live-typed title; `display: none` below `lg:` breakpoint | components/kudos/compose/KudoPreviewCard.tsx
- [ ] T076 [P] Mount `<KudoPreviewCard />` in `<KudosLiveBoard />` as a sibling of the modal portal (overlay layer); hidden on mobile/tablet via Tailwind `hidden lg:block` | components/kudos/KudosLiveBoard.tsx
- [ ] T077 [P] Responsive: mobile bottom-sheet variant (`border-radius: 16px 16px 0 0`, `width: 100vw`, `padding: 24px`); tablet centered 600px; full-width Gửi on mobile per design-style.md responsive table | components/kudos/compose/KudoComposeModal.tsx
- [ ] T078 [P] Disable ALL form fields (not just Gửi) during submit via `formMethods.formState.isSubmitting` per FR-009 | components/kudos/compose/fields/RecipientField.tsx, DanhHieuField.tsx, RichTextEditor.tsx, HashtagField.tsx, ImageUploadField.tsx, AnonymousToggle.tsx
- [ ] T079 [P] Implement error toast on submit failure preserving form state ("Gửi thất bại — vui lòng thử lại.") | components/kudos/compose/hooks/useKudoCompose.ts
- [ ] T080 [P] Accessibility audit: tab order, `aria-required`/`aria-invalid` on required fields, `role="dialog"` + `aria-modal="true"` + `aria-labelledby` on modal, focus-visible outlines, screen-reader-only labels for icon-only buttons | components/kudos/compose/**/*.tsx
- [ ] T081 [P] Verify color contrast meets WCAG AA via axe-core in Playwright e2e | tests/kudos/compose-a11y.spec.ts
- [ ] T082 [P] Complete and review all `kudos.compose.*` translation keys in vi/en; ensure no hardcoded Vietnamese strings remain in components | messages/vi.json, messages/en.json
- [ ] T083 [P] Add Tiptap document → safe-HTML render path on the Live Board card consumer side (so anonymous kudos render correctly) | components/kudos/feed/KudosPostContent.tsx
- [ ] T084 Cleanup: remove the `// TODO(nav): /kudos/new not yet shipped` comment from KudosComposeTrigger; remove any orphan `app/kudos/new/` route stub if present | components/kudos/hero/KudosComposeTrigger.tsx, app/kudos/new/
- [ ] T085 Performance: verify Tiptap bundle is tree-shaken (run `npm run build` and inspect chunk sizes); document in PR | (verification only)
- [ ] T086 Security review: confirm Tiptap stores JSON (not raw HTML); confirm sanitizer rejects script/javascript: URLs; confirm RLS policies block cross-user INSERT | (review only)
- [ ] T087 Update `.momorph/SCREENFLOW.md` "Next Steps" — mark Viết Kudo (`ihQ26W78P2`) implementation as done | .momorph/SCREENFLOW.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately. All tasks T004–T008 are parallel; T001–T003 are sequential because each modifies package.json.
- **Foundation (Phase 2)**: Depends on Setup completion — BLOCKS all user stories.
  - T009 (failing test) → T010 (migration) → T011 (storage bucket — parallelizable to T010)
  - T012, T013, T014 parallel (different scopes within `lib/kudos/schemas.ts` and `types/kudos.ts`)
  - T015 depends on T012/T013
  - T016 depends on T010
  - T017 depends on T016
  - T018 (failing test) → T019 (route handler)
- **User Stories (Phase 3+)**: All depend on Foundation completion.
  - **US1 (Phase 3)** is the MVP and is independently testable.
  - **US7 (Phase 4)** depends on US1 (extends `<HashtagField />`).
  - **US2 (Phase 5)** depends on US1 (adds error rendering to existing fields).
  - **US3 (Phase 6)** depends on US1 (intercepts modal close).
  - **US4 (Phase 7)** depends on US1 (extends `<RichTextEditor />`).
  - **US5 (Phase 8)** depends on US1 + Storage bucket (T011).
  - **US6 (Phase 9)** depends on US1 + view migration (T010).
- **Polish (Phase 10)**: Depends on all desired user stories being complete.

### Within Each User Story

- Tests for backend changes (Phase 2) MUST be written and FAIL before implementation (TDD per constitution III).
- Atoms before fields; fields before modal; modal before mount-point wiring.
- Hooks (services) before components that consume them.
- Story complete and shippable before moving to next priority.

### Parallel Opportunities

- All Setup tasks marked [P] (T004–T008) can run in parallel.
- All Foundational tasks marked [P] (T011–T014) can run in parallel.
- **Within US1**: T020 + T021 (atoms), then T024 + T025 (fields RecipientField + DanhHieuField), then in parallel with T026/T027/T028, the unit tests T032 + T033 + T034.
- **Across user stories**: US7, US2, US3, US4, US5, US6 can each be developed by different engineers in parallel once US1 ships, since they touch independent files (with the exception of T042 which adds error rendering to fields owned by US1 — coordinate via PR review).
- **Polish phase**: T075–T083 are all parallel.

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 (Setup) + Phase 2 (Foundation).
2. Complete Phase 3 (US1) only.
3. **STOP and VALIDATE**: Verify e2e happy path works end-to-end.
4. Demo to stakeholders; deploy to staging if approved.

### Incremental Delivery

1. **Sprint 1**: Setup + Foundation + US1 — Demo: minimum viable Kudo submission.
2. **Sprint 2**: US7 + US2 + US3 — Demo: complete P1 set with proper hashtag picker, validation UX, and discard guard.
3. **Sprint 3**: US4 — Demo: rich-text formatting and @-mentions.
4. **Sprint 4**: US5 + US6 — Demo: image attachments + anonymous send.
5. **Sprint 5**: Polish (Bìa preview, responsive, a11y, i18n) — Demo: production-ready.

---

## Notes

- Commit after each task or logical group; conventional-commits format (`feat:`, `test:`, `refactor:`).
- Run Vitest before moving to next phase (`npm run test`); run Playwright before each PR (`npm run test:e2e`).
- Update `spec.md` if requirements change during implementation; do not let code drift from spec silently.
- Mark tasks complete as you go: `[x]`.
- The fallback inline-autocomplete in T024 is a known TODO; remove once Tìm kiếm sunner overlay (`3jgwke3E8O`) ships.
- Per constitution §III: every PR landing a phase MUST include the corresponding tests written first — code without matching tests will be rejected at review.
