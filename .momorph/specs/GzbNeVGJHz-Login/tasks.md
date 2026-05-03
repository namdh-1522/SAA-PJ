# Tasks: Login

**Frame**: `GzbNeVGJHz-Login`
**Prerequisites**: plan.md ✅ spec.md ✅ design-style.md ✅
**Total tasks**: 49 | **US1**: 16 | **US2**: 8 | **Polish**: 6

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no blocking dependency on incomplete tasks)
- **[Story]**: User story this belongs to (US1, US2)
- **|**: Primary file affected by this task
- Checkpoints (⚠️ / ✅) are verification steps, not code tasks

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization — must complete before any foundation work.

- [x] T001 Install app dependencies (`npm install @supabase/supabase-js @supabase/ssr next-intl`) | package.json
- [x] T00X Create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL=http://localhost:3000`, `NEXT_PUBLIC_POST_AUTH_URL=/dashboard` (never commit — add to .gitignore) | .env.local
- [x] T00X Update `next.config.ts`: wrap default export with `createNextIntlPlugin('./i18n/request.ts')`; add `images.remotePatterns` for Supabase storage hostname | next.config.ts
- [x] T00X [P] Download Figma media assets to `public/assets/login/` using `get_media_files` per plan.md Phase 0 asset table (site-logo.png, root-further-logo.png, google.svg, vn-flag.svg, chevron-down.svg). Hero BG must be sourced manually from Figma (node `662:14389`) → `public/assets/login/images/hero-bg.jpg` | public/assets/login/

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Core infrastructure required by ALL user stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

### Test Tooling

- [x] T00X [P] Install Vitest + unit test dependencies (`npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event`) | package.json
- [x] T00X [P] Install Playwright (`npm install -D @playwright/test && npx playwright install chromium`) | package.json
- [x] T00X [P] Create `vitest.config.ts` with `environment: 'jsdom'`, `globals: true`, `setupFiles`, and path alias `@/*` → `./` | vitest.config.ts
- [x] T00X [P] Create `playwright.config.ts` with `baseURL: 'http://localhost:3000'`, `webServer` launch config, and `chromium` project | playwright.config.ts

### Supabase Clients

- [x] T00X [P] Create `lib/supabase/client.ts`: export `createBrowserClient(url, key)` — used in `'use client'` components only | lib/supabase/client.ts
- [x] T0XX [P] Create `lib/supabase/server.ts`: export async `createServerClient()` using `cookies()` from `next/headers` — used in RSC and route handlers (NOT middleware) | lib/supabase/server.ts
- [x] T0XX [P] Create `lib/supabase/middleware.ts`: export `createMiddlewareClient(request: NextRequest, response: NextResponse)` using `@supabase/ssr` — reads `request.cookies.getAll()`, writes updated session to both `request` and `response` cookies via `.set()`. Bidirectional write is required for session refresh to propagate | lib/supabase/middleware.ts
- [x] T0XX Create `middleware.ts` at project root: use `createMiddlewareClient` from `lib/supabase/middleware.ts`; call `supabase.auth.getUser()`; guard: no user + not `/` or `/auth/callback` → redirect to `/`; guard: user + path `/` → redirect to `process.env.NEXT_PUBLIC_POST_AUTH_URL`; **ALWAYS return the `response` object** (not `NextResponse.next()`) so cookie updates propagate; matcher excludes `/_next/static`, `/_next/image`, `/favicon.ico` | middleware.ts

### Styling & Fonts

- [x] T0XX [P] Update `app/globals.css`: remove Geist font vars and dark-mode body overrides; add ALL CSS variable tokens from `design-style.md` — colors (9), border, border-radius (2), spacing-header (3), spacing-main (4), spacing-button (2), spacing-footer (2), typography (4 groups × 3-4 props), transitions (3). See plan.md Phase 1.5 for complete `:root { }` block | app/globals.css
- [x] T0XX [P] Update `app/layout.tsx`: replace Geist font imports with `Montserrat` (weight: 700, subsets: latin+vietnamese, variable: --font-montserrat) and `Montserrat_Alternates` (same, variable: --font-montserrat-alt) from `next/font/google`; apply both font variables to `<html>`; set `lang="vi"`; wrap `<body>` children with `<NextIntlClientProvider messages={messages}>` where messages come from `await getMessages()` | app/layout.tsx

### i18n

- [x] T0XX [P] Create `i18n/request.ts`: `getRequestConfig` reads `NEXT_LOCALE` cookie via `await cookies()`, falls back to first segment of `Accept-Language` header, defaults to `'vi'`; returns `{ locale, messages: (await import('../messages/${locale}.json')).default }`. Supported locales: `['vi', 'en']` | i18n/request.ts
- [x] T0XX [P] Create `messages/vi.json` with all i18n keys: `login.tagline`, `login.cta`, `login.error.oauth_failed`, `login.error.cookies_required`, `footer.copyright` (see plan.md Phase 1.7 for exact Vietnamese string values) | messages/vi.json
- [x] T0XX [P] Create `messages/en.json` with the same key structure as `messages/vi.json`; mark values as `"[TODO: EN translation]"` pending Q1 confirmation | messages/en.json

### Types

- [x] T0XX [P] Create `types/auth.ts`: re-export `User` and `Session` from `@supabase/supabase-js`; add `export type AuthError = { code: string; description?: string }` | types/auth.ts

### Checkpoint

- [x] T0XX Run `tsc --noEmit && npx eslint .` — verify zero TypeScript errors and zero lint errors before proceeding to user story phases ⚠️

---

## Phase 3: User Story 1 — Google OAuth Sign-In (Priority: P1) 🎯 MVP

**Goal**: Unauthenticated users can see the Login page and authenticate via Google OAuth. Authenticated users are redirected away. Errors surface with dismissible notifications.

**Independent Test**: Navigate to `/`; page renders with hero, brand logo, tagline, and CTA button. Click "LOGIN With Google" → browser navigates to Google OAuth. Visit `/?auth_error=true` → error banner appears and is dismissible.

### TDD — Write Tests First (must FAIL before implementing)

- [x] T0XX [P] [US1] Write unit tests for `GoogleLoginButton`: renders button with text; `isLoading` set on click; `signInWithOAuth` called with correct args; button disabled during loading; when `navigator.cookieEnabled = false`, does NOT call `signInWithOAuth` and shows `cookies_required` error | tests/unit/login/google-login-button.test.tsx
- [x] T0XX [P] [US1] Write unit tests for `AuthErrorBanner`: renders banner when `?auth_error=true` in URL; hidden when param absent; clicking dismiss calls `router.replace('/')` to clear param | tests/unit/login/auth-error-banner.test.tsx
- [x] T0XX [P] [US1] Write unit tests for auth callback handler: `exchangeCodeForSession` called with code param; redirects 302 to `NEXT_PUBLIC_POST_AUTH_URL` on success; `error=access_denied` → 302 to `/` (silent, no auth_error); other error → 302 to `/?auth_error=true`; no params → 302 to `/?auth_error=true` | tests/unit/login/auth-callback.test.ts
- [x] T0XX [P] [US1] Write integration tests for `/auth/callback` route: GET `?code=valid` → 302 to post-auth URL; GET `?error=access_denied` → 302 to `/`; GET `?error=server_error` → 302 to `/?auth_error=true`; GET (no params) → 302 to `/?auth_error=true` | tests/integration/auth/callback-route.test.ts
- [x] T0XX [P] [US1] Write E2E test spec: page loads at `/`; hero image visible; CTA button visible with text "LOGIN With Google"; button click triggers navigation to accounts.google.com; visiting `/?auth_error=true` renders error banner; dismissing banner navigates to `/` cleanly | tests/e2e/login/login.spec.ts
- [x] T0XX [US1] ⚠️ Run `npx vitest run tests/unit/login tests/integration/auth && npx playwright test tests/e2e/login/login.spec.ts` — **verify ALL tests FAIL** (Red phase gate — do NOT proceed to implementation until tests are failing)

### Implementation (after T025 confirms Red phase)

- [x] T0XX [P] [US1] Implement `app/auth/callback/route.ts` (GET handler): branch 1 `error === 'access_denied'` → `redirect('/')` silently; branch 2 any other `error` → `redirect('/?auth_error=true')`; branch 3 `code` present → `exchangeCodeForSession(code)` → success: `redirect(NEXT_PUBLIC_POST_AUTH_URL)`, failure: `redirect('/?auth_error=true')`; fallback → `redirect('/?auth_error=true')` | app/auth/callback/route.ts
- [x] T0XX [P] [US1] Implement `components/login/auth-error-banner.tsx` (`'use client'`): `useSearchParams()` to read `auth_error`; show dismissible banner with `useTranslations('login')('error.oauth_failed')`; `role="alert"` for screen readers; dismiss via `useRouter().replace('/')` | components/login/auth-error-banner.tsx
- [x] T0XX [P] [US1] Implement `components/icons/google-icon.tsx`: inline SVG from `public/assets/login/icons/google.svg` as a typed React component; props: `{ className?: string; width?: number; height?: number }` defaulting to 24×24 | components/icons/google-icon.tsx
- [x] T0XX [P] [US1] Implement `components/icons/chevron-down-icon.tsx`: inline SVG from `public/assets/login/icons/chevron-down.svg`; 24×24 default | components/icons/chevron-down-icon.tsx
- [x] T0XX [P] [US1] Implement `components/icons/vn-flag-icon.tsx`: inline SVG from `public/assets/login/icons/vn-flag.svg`; 20×15 default (per design-style icon spec) | components/icons/vn-flag-icon.tsx
- [x] T0XX [P] [US1] Implement `components/ui/footer.tsx` (RSC): `absolute bottom-0`, full-width, `border-t border-[var(--color-divider)]`, `py-10 px-[90px]`, `flex justify-between items-center`; copyright text via `const t = await getTranslations('footer'); t('copyright')` (RSC uses `getTranslations` — NOT `useTranslations`) | components/ui/footer.tsx
- [x] T0XX [P] [US1] Implement `components/ui/header.tsx` (RSC): `fixed top-0 w-full h-20 z-10 flex items-center justify-between px-36 bg-[var(--color-bg-header)]`; left: `<Link href="/"><Image src="/assets/login/logos/site-logo.png" width={52} height={48} alt="SAA 2025" /></Link>`; right: `{children}` slot for LanguageSelector (passed from page.tsx) | components/ui/header.tsx
- [x] T0XX [US1] Implement `components/login/google-login-button.tsx` (`'use client'`): import `GoogleIcon` from T028; `useTranslations('login')`; `isLoading` state; on click: check `navigator.cookieEnabled` (if false: set `errorMessage = t('error.cookies_required')`, return); set `isLoading = true`; call `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: env.NEXT_PUBLIC_SITE_URL + '/auth/callback' } })`; loading styles: `opacity-70 cursor-wait disabled:pointer-events-none`; `aria-label="Login with Google"` | components/login/google-login-button.tsx
- [x] T0XX [US1] Update `app/page.tsx` (RSC): session check via `createServerClient` → `supabase.auth.getUser()` → if user: `redirect(NEXT_PUBLIC_POST_AUTH_URL)`; render: `<Header>`, hero `<Image src=".../hero-bg.jpg" fill priority objectPosition="-440px -217.975px" alt="" className="object-cover z-0">`, H-gradient `<div aria-hidden>`, V-gradient `<div aria-hidden>`, `<main>` with brand logo `<Image>` (451×200), tagline `<p>`, `<AuthErrorBanner>`, `<GoogleLoginButton>`, `<Footer>`; all images use `next/image`; import from T027, T031, T032, T033 | app/page.tsx
- [x] T0XX [US1] ✅ Run `npx vitest run tests/unit/login tests/integration/auth && npx playwright test tests/e2e/login/login.spec.ts` — **verify ALL US1 tests PASS** (Green phase)

**Checkpoint**: User Story 1 complete and independently testable. Run `npm run build` — zero errors.

---

## Phase 4: User Story 2 — Language Selection (Priority: P2)

**Goal**: Users can switch the interface language via the header dropdown. Locale persists in cookie across reloads. No URL change occurs.

**Independent Test**: Click "VN" button in header → dropdown opens with available locales. Select a locale → all visible text updates. Reload → selected locale persists.

### TDD — Write Tests First (must FAIL before implementing)

- [x] T0XX [P] [US2] Write unit tests for `LanguageSelector`: renders "VN" label + flag + chevron by default; click opens dropdown (`isOpen = true`); click outside closes dropdown; selecting locale writes `NEXT_LOCALE` cookie and calls `router.refresh()`; dropdown has `aria-haspopup="listbox"` and correct `aria-expanded` state | tests/unit/login/language-selector.test.tsx
- [x] T0XX [P] [US2] Write integration tests for locale switch: after `NEXT_LOCALE=en` cookie is set, `getRequestConfig` resolves locale as `'en'`; messages returned are from `messages/en.json` | tests/integration/i18n/locale-switch.test.ts
- [x] T0XX [US2] ⚠️ Run `npx vitest run tests/unit/login/language-selector tests/integration/i18n` — **verify US2 tests FAIL** (Red phase gate)

### Implementation (after T038 confirms Red phase)

- [x] T0XX [US2] Implement `components/login/language-selector.tsx` (`'use client'`): import `VnFlagIcon` (T030) and `ChevronDownIcon` (T029); `useState<boolean>` for `isOpen`; read `NEXT_LOCALE` cookie on mount via `document.cookie` for `currentLocale` (default `'vi'`); locale list: `[{ code: 'vi', label: 'VN', Flag: VnFlagIcon }]` (extend when Q1 resolved); on select: `document.cookie = \`NEXT_LOCALE=${selected}; path=/; max-age=31536000\``; `router.refresh()` via `useRouter` from `next/navigation`; button styles: transparent default → `rgba(255,255,255,0.08)` hover → `rgba(255,255,255,0.12)` active; `var(--transition-lang)` transition; `aria-haspopup="listbox"` `aria-expanded={isOpen}` | components/login/language-selector.tsx
- [x] T0XX [US2] Update `app/page.tsx`: pass `<LanguageSelector />` as child to `<Header>` (wires the dropdown into the header slot) | app/page.tsx
- [x] T0XX [US2] Update `messages/vi.json` and `messages/en.json` with any new i18n keys required by LanguageSelector (e.g. `nav.language_label`) | messages/vi.json, messages/en.json
- [x] T0XX [US2] ✅ Run `npx vitest run tests/unit/login/language-selector tests/integration/i18n` — **verify ALL US2 tests PASS** (Green phase)

**Checkpoint**: User Stories 1 & 2 complete. Language selector works end-to-end.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Responsive layout, accessibility, performance, and security hardening across all components.

- [x] T0XX [P] Apply responsive styles per `design-style.md` Responsive Specifications section: mobile (`px-4` header/main/footer, brand logo `max-w-[280px]`, tagline `text-base leading-7`, CTA `w-full max-w-[320px]`) and tablet (`px-12` header/main/footer, tagline `text-lg`) breakpoints using Tailwind `md:` / `lg:` prefixes | app/page.tsx, components/ui/header.tsx, components/ui/footer.tsx
- [x] T0XX [P] Accessibility pass: add `role="alert"` to `AuthErrorBanner`; verify `aria-label="Login with Google"` on CTA; add `aria-label="Go to homepage"` on logo link; test full Tab order through header → CTA → footer; verify focus rings visible on all interactive elements | components/login/auth-error-banner.tsx, components/login/google-login-button.tsx, components/ui/header.tsx
- [x] T0XX [P] Performance audit: run `npx lighthouse http://localhost:3000 --only-categories=performance` and verify score ≥ 90 on desktop; confirm `next/image` `priority` prop on hero BG; verify hero BG has long `Cache-Control` via `next.config.ts` headers config if needed | next.config.ts
- [x] T0XX [P] Security audit: open browser DevTools → Application tab → verify no Supabase tokens in localStorage or sessionStorage; verify session cookie has `HttpOnly` flag in Network tab; run `npm audit` and fix any critical/high findings | —
- [x] T0XX Run `tsc --noEmit && npx eslint . && npm run build` — final zero-error verification before marking feature complete | —
- [x] T0XX Code cleanup: remove unused Vercel defaults from `app/page.tsx`; remove Geist font references; confirm no `console.log` or `// TODO` comments remain in production code | app/page.tsx, app/layout.tsx

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
  └─> Phase 2 (Foundation) — BLOCKS all user stories
        ├─> Phase 3 (US1) — MVP; can start immediately after Foundation
        │     └─> Phase 4 (US2) — depends on Phase 3 (header slot from T032)
        │           └─> Phase 5 (Polish) — depends on both stories complete
        └─> (Phase 4 can start in parallel with Phase 3 if staffed)
```

### Within User Story 1

```
T020-T024 (write tests) → T025 (confirm FAIL)
  → T026-T032 (parallel impl batch) → T033 (login button needs T028)
    → T034 (page.tsx needs T027, T031, T032, T033) → T035 (confirm PASS)
```

### Within User Story 2

```
T036-T037 (write tests) → T038 (confirm FAIL)
  → T039 (selector, needs T029+T030) → T040 (wire into page) → T041 (i18n keys)
    → T042 (confirm PASS)
```

### Parallel Opportunities

| Group | Parallel Tasks | Notes |
|-------|---------------|-------|
| Phase 2 test tooling | T005, T006, T007, T008 | All independent |
| Phase 2 infra | T009, T010, T011 | Independent Supabase client files |
| Phase 2 config | T013, T014, T015, T016, T017, T018 | All independent files |
| US1 test writing | T020, T021, T022, T023, T024 | Different test files |
| US1 impl batch 1 | T026, T027, T028, T029, T030, T031, T032 | All independent files |
| US2 test writing | T036, T037 | Different test files |
| Polish | T043, T044, T045, T046 | Independent concerns |

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete **Phase 1** (T001–T004)
2. Complete **Phase 2** (T005–T019)
3. Complete **Phase 3 US1** (T020–T035) — Login page fully functional
4. **STOP and VALIDATE**: OAuth flow works end-to-end; tests pass; Lighthouse ≥ 90
5. Resolve open Q4 (`POST_AUTH_REDIRECT`) before going to production

### Incremental Delivery

1. Phase 1 + 2 → foundation ready
2. Phase 3 (US1) → Login page ships with Google OAuth
3. Phase 4 (US2) → Language switching added
4. Phase 5 → Polish and hardening

### Open Prerequisites (must resolve before shipping)

| Blocker | Needed By | Status |
|---------|-----------|--------|
| Supabase project URL + anon key | T002, Phase 2 | ❌ Pending |
| Google OAuth credentials in Supabase | Phase 3 E2E | ❌ Pending |
| Hero background image | T004, T034 | ❌ Pending (not in get_media_files) |
| Q1 — Available languages beyond VN | T039, T040 | ❌ Open |
| Q4 — `POST_AUTH_REDIRECT` URL | T002, T026 | ❌ Open |

---

## Notes

- Mark tasks complete as you go: change `- [ ]` to `- [x]`
- Commit after each logical group (e.g., after all Phase 2 tasks, after T035 green phase)
- The TDD checkpoints T025 and T035 are **gates** — do not skip them
- `[P]` tasks within the same phase can be assigned to different agents / team members
- If Q1 or Q4 remain unresolved, stub them with constants and document the TODO inline
