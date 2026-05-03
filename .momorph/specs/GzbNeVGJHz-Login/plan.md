# Implementation Plan: Login

**Frame**: `GzbNeVGJHz-Login`
**Date**: 2026-04-21
**Spec**: `specs/GzbNeVGJHz-Login/spec.md`

---

## Summary

Implement the SAA 2025 Login page — the platform's sole entry point — using Next.js App Router
(RSC-first), Supabase Google OAuth for authentication, Tailwind CSS v4 design tokens, and
`next-intl` for i18n. The page requires a Supabase SSR setup from scratch, a `/auth/callback`
route handler, a fixed header with language selector, a hero visual with gradient overlays, and
a Google OAuth CTA button with loading/error states.

---

## Technical Context

**Language/Framework**: TypeScript 5 (strict) / Next.js 16 App Router
**Primary Dependencies**: React 19, Tailwind CSS v4, `@supabase/ssr`, `@supabase/supabase-js`, `next-intl`
**Database**: Supabase (Auth only for this feature; no custom tables)
**Testing**: Vitest (unit + integration), Playwright (E2E)
**State Management**: React local state (`useState`), Supabase session via server cookies
**API Style**: Supabase built-in OAuth + custom Next.js route handler (`/auth/callback`)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] Follows project coding conventions (kebab-case files, PascalCase components, 2-space indent)
- [x] Uses approved libraries only — all new packages listed in Dependencies section below
- [x] Adheres to folder structure: pages in `app/`, utilities in `lib/`, components in `components/`
- [x] Meets security requirements: HttpOnly cookies via Supabase SSR, no tokens in localStorage
- [x] Follows testing standards: TDD — tests authored before implementation per Principle III

**Violations (if any)**:

| Violation | Justification | Alternative Rejected |
|-----------|---------------|---------------------|
| `next-intl` new dependency | No i18n library exists; TR-005 mandates i18n keys | Plain JSON dict without framework — lacks RSC support |
| `@supabase/supabase-js` + `@supabase/ssr` new dependencies | No Supabase client exists; auth is core to this feature | Manual fetch against Supabase REST — loses session management |

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based — `components/login/` for page-specific, `components/ui/` for layout-shared
- **RSC vs Client split**: `page.tsx`, `header.tsx`, `footer.tsx` → RSC. `GoogleLoginButton`, `LanguageSelector`, `AuthErrorBanner` → `'use client'` (require `onClick` / `useState`)
- **Styling Strategy**: Tailwind v4 utilities via CSS variables defined in `app/globals.css`. No inline raw hex values.
- **Data Fetching**: Session check via `createServerClient` in `page.tsx` (RSC); OAuth initiation in Client Component

### Backend Approach

- **API Design**: Single route handler `app/auth/callback/route.ts` (GET) — exchanges OAuth code for session; no custom REST API needed for this screen
- **Supabase Auth**: `signInWithOAuth({ provider: 'google', options: { redirectTo } })` called client-side; `exchangeCodeForSession(code)` called server-side in callback handler
- **Middleware**: `middleware.ts` at project root — refreshes Supabase session on every request and redirects unauthenticated users away from protected routes (and authenticated users away from `/`)

### Integration Points

- **Existing files to modify**: `app/layout.tsx` (fonts), `app/globals.css` (design tokens), `app/page.tsx` (becomes Login page)
- **Shared components**: `Header` and `Footer` will be reusable across future screens
- **Auth flow**: `GoogleLoginButton` → Supabase OAuth → Google → `/auth/callback` → `TODO(POST_AUTH_REDIRECT)`

---

## Project Structure

### Documentation (this feature)

```
.momorph/specs/GzbNeVGJHz-Login/
├── spec.md
├── design-style.md
├── plan.md              ← this file
└── assets/
```

### New Files to Create

| File | Purpose |
|------|---------|
| `app/auth/callback/route.ts` | OAuth callback: exchange code, set session cookie, redirect |
| `components/login/google-login-button.tsx` | `'use client'` — triggers OAuth, manages loading/error state |
| `components/login/language-selector.tsx` | `'use client'` — locale dropdown |
| `components/login/auth-error-banner.tsx` | `'use client'` — dismissible error notification |
| `components/ui/header.tsx` | RSC header (logo + language slot) |
| `components/ui/footer.tsx` | RSC footer (copyright) |
| `components/icons/google-icon.tsx` | SVG icon component |
| `components/icons/chevron-down-icon.tsx` | SVG icon component |
| `components/icons/vn-flag-icon.tsx` | SVG icon component |
| `lib/supabase/client.ts` | `createBrowserClient` helper |
| `lib/supabase/server.ts` | `createServerClient` helper (RSC / route handlers) — uses `next/headers` cookies |
| `lib/supabase/middleware.ts` | `createMiddlewareClient(req, res)` helper — req/res cookie bidirectional handling for session refresh |
| `middleware.ts` | Session refresh + auth route guards |
| `types/auth.ts` | Extended `User` / `Session` TypeScript types |
| `messages/vi.json` | Vietnamese i18n strings (default locale) |
| `messages/en.json` | English i18n strings (placeholder — awaiting Q1 answer) |
| `i18n/request.ts` | `next-intl` server-side locale config |
| `public/assets/login/logos/site-logo.png` | Downloaded from Figma (node `I662:14391;178:1033;178:1030`) |
| `public/assets/login/logos/root-further-logo.png` | Downloaded from Figma (node `2939:9548`) |
| `public/assets/login/icons/google.svg` | Downloaded from Figma (node `I662:14426;186:1766`) |
| `public/assets/login/icons/vn-flag.svg` | Downloaded from Figma (node `I662:14391;186:1696;186:1821;186:1709`) |
| `public/assets/login/icons/chevron-down.svg` | Downloaded from Figma (node `I662:14391;186:1696;186:1821;186:1441`) |

### Files to Modify

| File | Changes |
|------|---------|
| `app/page.tsx` | Replace default content with Login page RSC (session check + UI layout) |
| `app/layout.tsx` | Replace Geist fonts with Montserrat + Montserrat Alternates via `next/font/google`; set `lang="vi"`; wrap with `next-intl` `NextIntlClientProvider` |
| `app/globals.css` | Add all design token CSS variables from `design-style.md`; remove Geist font vars and default dark mode body overrides |
| `next.config.ts` | Wrap default export with `createNextIntlPlugin()`; add `next/image` `remotePatterns` for Supabase storage domain |

### Dependencies to Add

| Package | Version | Purpose |
|---------|---------|---------|
| `@supabase/supabase-js` | latest | Supabase JS client (Auth, DB) |
| `@supabase/ssr` | latest | Server-side session management for Next.js |
| `next-intl` | latest | i18n for App Router (RSC + Client Components) |

---

## Implementation Approach

### Phase 0: Asset Preparation

Download all Figma media assets and place in `public/assets/login/`:

| Asset | Figma Node | Target Path | Format |
|-------|-----------|-------------|--------|
| Site logo | `I662:14391;178:1033;178:1030` | `public/assets/login/logos/site-logo.png` | PNG |
| Root Further brand logo | `2939:9548` | `public/assets/login/logos/root-further-logo.png` | PNG |
| Google icon | `I662:14426;186:1766` | `public/assets/login/icons/google.svg` | SVG |
| VN flag | `I662:14391;186:1696;186:1821;186:1709` | `public/assets/login/icons/vn-flag.svg` | SVG |
| Chevron-down | `I662:14391;186:1696;186:1821;186:1441` | `public/assets/login/icons/chevron-down.svg` | SVG |

> **Note**: The hero background image (`mms_C_Keyvisual`, node `662:14389`) is not returned by
> `get_media_files`. Source it from the Figma file directly or use a placeholder until provided.
> Target path: `public/assets/login/images/hero-bg.jpg`.

SVG assets (`google.svg`, `vn-flag.svg`, `chevron-down.svg`) MUST be converted to typed React
SVG components in `components/icons/` — not served as static files or `<img>` tags.

---

### Phase 1: Foundation

**Purpose**: Project-wide infrastructure required by all subsequent phases.

#### 1.1 — Install dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr next-intl
```

#### 1.2 — Environment variables

Create `.env.local` (never commit):

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_POST_AUTH_URL=/dashboard
```

> `NEXT_PUBLIC_POST_AUTH_URL` uses `/dashboard` as a placeholder until `TODO(POST_AUTH_REDIRECT)` is
> resolved (see Q4). Update this value once the post-login destination is confirmed.

#### 1.3 — Supabase clients (`lib/supabase/`)

- `client.ts`: export `createBrowserClient` instance (used in Client Components only)
- `server.ts`: export async `createServerClient` using `cookies()` from `next/headers` (used in RSC and route handlers — NOT middleware)
- `middleware.ts`: export `createMiddlewareClient(request: NextRequest, response: NextResponse)` using `@supabase/ssr` middleware-specific cookie pattern — reads cookies from `request.cookies.getAll()` and writes updated session cookies to both `request` and `response` via `.set()`. This bidirectional write is required for Supabase session refresh to propagate correctly through Next.js middleware. The `server.ts` factory cannot be used here because `next/headers` is not available in middleware context.

#### 1.4 — Middleware (`middleware.ts`)

- Create `supabase` and `response` via `createMiddlewareClient(request, response)` from `lib/supabase/middleware.ts`
- Call `supabase.auth.getUser()` to refresh the session (this automatically writes updated session tokens back to the response cookies via the middleware client)
- **IMPORTANT**: Always return the `response` object (not `NextResponse.next()`) so the updated session cookies are included in the response
- Protected route guard: if `getUser()` returns no user and request is not for `/` or `/auth/callback` → redirect to `/`
- Authenticated user guard: if `getUser()` returns a user and request is for `/` → redirect to `process.env.NEXT_PUBLIC_POST_AUTH_URL`
- `matcher`: apply to all routes except `/_next/static`, `/_next/image`, `/favicon.ico`, and `/public/` static assets

#### 1.5 — Design tokens (`app/globals.css`)

Remove Geist vars and default dark-mode overrides. Add all CSS variables from `design-style.md`:

```css
:root {
  /* Colors */
  --color-bg-dark: #00101A;
  --color-bg-dark-alt: #001320;
  --color-bg-header: rgba(11, 15, 18, 0.8);
  --color-cta-bg: #FFEA9E;
  --color-cta-bg-hover: #FFE070;
  --color-cta-bg-active: #FFD740;
  --color-cta-text: #00101A;
  --color-text-primary: #FFFFFF;
  --color-divider: #2E3940;

  /* Border */
  --border-footer: 1px solid var(--color-divider);

  /* Border Radius */
  --radius-btn: 8px;
  --radius-lang: 4px;

  /* Spacing — Header */
  --spacing-header-px: 144px;
  --spacing-header-py: 12px;
  --spacing-header-gap: 238px;

  /* Spacing — Main */
  --spacing-main-px: 144px;
  --spacing-main-py: 96px;
  --spacing-content-gap: 80px;
  --spacing-tagline-btn: 24px;
  --spacing-content-pl: 16px;

  /* Spacing — Button */
  --spacing-btn-px: 24px;
  --spacing-btn-py: 16px;

  /* Spacing — Footer */
  --spacing-footer-px: 90px;
  --spacing-footer-py: 40px;

  /* Typography — Language label */
  --text-nav-lang-size: 16px;
  --text-nav-lang-weight: 700;
  --text-nav-lang-lh: 24px;
  --text-nav-lang-ls: 0.15px;

  /* Typography — Tagline */
  --text-tagline-size: 20px;
  --text-tagline-weight: 700;
  --text-tagline-lh: 40px;
  --text-tagline-ls: 0.5px;

  /* Typography — CTA Button */
  --text-cta-size: 22px;
  --text-cta-weight: 700;
  --text-cta-lh: 28px;

  /* Typography — Footer */
  --text-footer-size: 16px;
  --text-footer-weight: 700;
  --text-footer-lh: 24px;

  /* Transitions */
  --transition-btn: background-color 150ms ease-in-out;
  --transition-lang: background-color 150ms ease-in-out;
  --transition-dropdown: opacity 150ms ease-out, transform 150ms ease-out;
}
```

#### 1.6 — Font loading (`app/layout.tsx`)

Replace Geist with:

```ts
import { Montserrat, Montserrat_Alternates } from 'next/font/google'

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin', 'vietnamese'],
  weight: ['700'],
})
const montserratAlternates = Montserrat_Alternates({
  variable: '--font-montserrat-alt',
  subsets: ['latin', 'vietnamese'],
  weight: ['700'],
})
```

Set `<html lang="vi">` (default locale). Wrap body with `next-intl` provider.

#### 1.7 — i18n setup (`next-intl`)

**Locale routing strategy: "without i18n routing" (flat `app/`, cookie-based)**

`next-intl` supports two modes: *with i18n routing* (requires `app/[locale]/` directory) and
*without i18n routing* (flat `app/`, locale determined programmatically). This plan uses the
**without i18n routing** approach because:
- The spec requires "in-page language switch, no URL change"
- The `app/` directory stays flat — no `app/[locale]/page.tsx` restructure
- Locale is persisted via `NEXT_LOCALE` cookie; locale switching uses `router.refresh()`

**Required**: `next.config.ts` must wrap its default export with `createNextIntlPlugin()`:
```ts
import createNextIntlPlugin from 'next-intl/plugin'
const withNextIntl = createNextIntlPlugin('./i18n/request.ts')
export default withNextIntl(nextConfig)
```

- `i18n/request.ts`: `getRequestConfig` reads locale from `NEXT_LOCALE` cookie; falls back to
  `Accept-Language` header; defaults to `'vi'`:
  ```ts
  import { getRequestConfig } from 'next-intl/server'
  import { cookies, headers } from 'next/headers'

  const SUPPORTED = ['vi', 'en'] // extend when Q1 resolved

  export default getRequestConfig(async () => {
    const cookieStore = await cookies()
    const fromCookie = cookieStore.get('NEXT_LOCALE')?.value
    const fromHeader = (await headers()).get('accept-language')?.split(',')[0]?.split('-')[0]
    const locale = SUPPORTED.includes(fromCookie ?? '') ? fromCookie!
      : SUPPORTED.includes(fromHeader ?? '') ? fromHeader!
      : 'vi'
    return { locale, messages: (await import(`../messages/${locale}.json`)).default }
  })
  ```
- **No `i18n/routing.ts` needed** — `defineRouting` / `createNavigation` are only required for
  the "with i18n routing" mode. Locale switching in `LanguageSelector` uses a direct cookie write
  + `router.refresh()` instead (see Phase 3).
- `messages/vi.json`: add all i18n keys from spec:
  ```json
  {
    "login": {
      "tagline": "Bắt đầu hành trình của bạn cùng SAA 2025.\nĐăng nhập để khám phá!",
      "cta": "LOGIN With Google",
      "error": {
        "oauth_failed": "Đăng nhập thất bại. Vui lòng thử lại.",
        "cookies_required": "Trình duyệt của bạn đang chặn cookie. Vui lòng bật cookie để đăng nhập."
      }
    },
    "footer": { "copyright": "Bản quyền thuộc về Sun* © 2025" }
  }
  ```
- `messages/en.json`: placeholder keys (values TBD per Q1 clarification)

#### 1.8 — TypeScript types (`types/auth.ts`)

```ts
import type { User, Session } from '@supabase/supabase-js'
export type { User, Session }
export type AuthError = { code: string; description?: string }
```

**Checkpoint**: `npm run build` passes; `tsc --noEmit` zero errors; `eslint` zero warnings.

---

### Phase 2: US1 — Google OAuth Sign-In (P1 MVP)

**Goal**: Unauthenticated users see the Login page and can authenticate via Google OAuth.
**Independent Test**: Navigate to `/`, click "LOGIN With Google", verify OAuth redirect; after
callback, verify session cookie set and redirect to `TODO(POST_AUTH_REDIRECT)`.

#### TDD — Write tests first (must FAIL before implementing)

**Unit tests** (`tests/unit/login/`):
- `google-login-button.test.tsx`: renders button; clicking calls `signInWithOAuth`; `isLoading` state set on click; button disabled when loading; when `navigator.cookieEnabled` is `false`, shows `cookies_required` error without calling `signInWithOAuth`
- `auth-error-banner.test.tsx`: renders when `auth_error` param present; hidden when absent; dismiss clears param
- `auth-callback.test.ts`: `exchangeCodeForSession` called with code param; redirects to post-auth URL on success; redirects to `/?auth_error=true` on error/missing code

**Integration tests** (`tests/integration/auth/`):
- `callback-route.test.ts`:
  - GET `/auth/callback?code=<valid>` → session created, redirect 302 to `NEXT_PUBLIC_POST_AUTH_URL`
  - GET `/auth/callback?error=access_denied` → **silent** redirect 302 to `/` (no `auth_error` param — spec Scenario 3)
  - GET `/auth/callback?error=server_error` → redirect 302 to `/?auth_error=true`
  - GET `/auth/callback` (no params) → redirect 302 to `/?auth_error=true`

**E2E tests** (`tests/e2e/login/`):
- `login.spec.ts`: page renders; button click triggers Google OAuth navigation; `?auth_error=true` shows error banner; banner dismisses cleanly

#### Implementation tasks (after tests fail)

- **`app/auth/callback/route.ts`**: GET handler
  ```ts
  // 1. If error === 'access_denied' → silent redirect to '/'
  //    (user cancelled OAuth — Scenario 3: no error message shown)
  // 2. If error is any other value → redirect to '/?auth_error=true'
  //    (real server/provider error — Scenarios 5 & 6)
  // 3. If code present → exchangeCodeForSession(code)
  //    → success: redirect to process.env.NEXT_PUBLIC_POST_AUTH_URL
  //    → failure: redirect to '/?auth_error=true'
  // 4. Fallback (no code, no error) → redirect to '/?auth_error=true'
  ```

- **`components/login/auth-error-banner.tsx`** (`'use client'`):
  - Read `?auth_error` search param via `useSearchParams()`
  - Show dismissible banner with `login.error.oauth_failed` i18n string
  - Dismiss: `router.replace('/')` to clear param

- **`components/login/google-login-button.tsx`** (`'use client'`):
  - Import `createBrowserClient` from `lib/supabase/client.ts`
  - On click: set `isLoading = true`, call `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: process.env.NEXT_PUBLIC_SITE_URL + '/auth/callback' } })`
  - Loading state: opacity-70, cursor-wait, disabled (per design-style loading state)
  - Embed `<GoogleIcon>` SVG component (24×24)
  - i18n: `useTranslations('login').cta`
  - **Accessibility**: `aria-label="Login with Google"` (spec FR accessibility requirement)

- **`components/icons/google-icon.tsx`**: inline SVG from `public/assets/login/icons/google.svg`
- **`components/icons/chevron-down-icon.tsx`**: inline SVG from `chevron-down.svg`
- **`components/icons/vn-flag-icon.tsx`**: inline SVG from `vn-flag.svg`

- **`components/ui/header.tsx`** (RSC):
  - Fixed top bar: `position: fixed`, 80px height, semi-transparent dark bg
  - Left: `<Image>` site logo (52×48) wrapped in `<Link href="/">`
  - Right: `<LanguageSelector>` (client slot via `children` prop)

- **`components/ui/footer.tsx`** (RSC):
  - Absolute bottom, border-top
  - Copyright text via `const t = await getTranslations('footer'); t('copyright')` (RSC MUST use `getTranslations` async function, NOT `useTranslations` hook)

- **`app/page.tsx`** (RSC):
  - Server-side session check via `createServerClient` → redirect if authenticated
  - Read `?auth_error` → pass as prop to `<AuthErrorBanner>`
  - Render full layout: `<Header>`, hero BG `<Image>` (priority, fill), two gradient `<div>`, brand logo `<Image>`, tagline `<p>`, `<GoogleLoginButton>`, `<Footer>`
  - Hero BG `<Image>`: `priority fill objectPosition="-440px -217.975px"` (per design-style `object-position` spec)
  - All images use `next/image` with correct `alt` text (`alt=""` for decorative brand images, descriptive alt for functional ones)

**Checkpoint (US1 complete)**: All unit + integration tests pass; E2E login flow works end-to-end.

---

### Phase 3: US2 — Language Selection (P2)

**Goal**: Users can switch the UI language via the header dropdown.
**Independent Test**: Click language selector, change locale, verify all page text updates.

#### TDD — Write tests first

**Unit tests** (`tests/unit/login/language-selector.test.tsx`):
- Renders "VN" label and flag by default
- Click opens dropdown
- Selecting locale calls locale change handler
- Dropdown closes after selection

**Integration tests** (`tests/integration/i18n/`):
- `locale-switch.test.ts`: switching locale updates `next-intl` message context

#### Implementation tasks

- **`components/login/language-selector.tsx`** (`'use client'`):
  - `useState<boolean>` for `isOpen`
  - `useState<string>` for `currentLocale` (initialised from `NEXT_LOCALE` cookie or `'vi'`)
  - Renders current flag + locale code + chevron-down icon
  - Dropdown lists available locales (pending Q1 answer; default: `[{ code: 'vi', label: 'VN', FlagIcon: VnFlagIcon }]`)
  - On select: write `document.cookie = \`NEXT_LOCALE=${selected}; path=/; max-age=31536000\``; call `router.refresh()` from `useRouter` (`next/navigation`) to reload RSC with new locale — **do NOT use `next-intl` router API** (not applicable in "without i18n routing" mode)
  - States: default transparent, hover `rgba(255,255,255,0.08)`, active `rgba(255,255,255,0.12)`, focus outline `rgba(255,234,158,0.5)` — all with `var(--transition-lang)` transition
  - `aria-haspopup="listbox"`, `aria-expanded={isOpen}`

- **Update `messages/vi.json`** and **`messages/en.json`** with any new translation keys

**Checkpoint (US2 complete)**: Language selector functional; locale switch persists on reload.

---

### Phase 4: Polish & Cross-Cutting Concerns

- **Cookies-disabled handling**: In `components/login/google-login-button.tsx`, check `navigator.cookieEnabled` at the start of the click handler. If `false`, set `errorMessage` to i18n key `login.error.cookies_required` (do NOT call `signInWithOAuth`). Add `login.error.cookies_required` to `messages/vi.json` and `messages/en.json`. This surfaces the spec edge case with a user-facing message rather than a silent loop.
- **Responsive styles**: Apply `design-style.md` mobile/tablet breakpoints via Tailwind responsive prefixes (`md:`, `lg:`) on all layout components
- **Accessibility audit**: Verify `aria-label` on login button; tab order; focus rings; screen reader test with `role="alert"` on `<AuthErrorBanner>`
- **Performance**: Confirm `next/image` `priority` on hero BG; verify `Cache-Control` headers; run Lighthouse → target ≥ 90 desktop performance
- **Security audit**: Confirm no tokens in localStorage via browser devtools; verify HttpOnly cookie in Network tab; run `npm audit`
- **Code cleanup**: Remove default `app/page.tsx` Vercel content; remove unused Geist font variables

---

## Integration Testing Strategy

### Test Scope

- [x] **Component/Module interactions**: `GoogleLoginButton` ↔ Supabase `signInWithOAuth`; `AuthErrorBanner` ↔ URL params; callback route ↔ Supabase `exchangeCodeForSession`
- [x] **External dependencies**: Supabase Auth (local Supabase instance via `supabase start`)
- [x] **User workflows**: Full OAuth flow (E2E), error state flow (E2E), redirect guard (middleware unit test)

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Button click → OAuth call; error param → banner visible |
| Service ↔ Service | Yes | Callback route ↔ Supabase session exchange |
| App ↔ External API | Yes | `signInWithOAuth` → Google (E2E with mock or real) |
| App ↔ Data Layer | No | Auth only; no custom DB tables for this screen |
| Cross-platform | No | Web only |

### Test Environment

- **Environment type**: Local Supabase (`supabase start`) for integration; real Google OAuth for manual/staging E2E
- **Test data strategy**: Supabase local test user; mock `signInWithOAuth` in unit tests
- **Isolation approach**: Fresh session state per E2E test (clear cookies in `beforeEach`)

### Mocking Strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| Supabase client (unit) | Mock (`vi.mock`) | Unit tests must run without network |
| Supabase client (integration) | Real (local instance) | Per constitution Principle III — no DB mocking |
| Google OAuth (E2E) | Supabase local OAuth mock or test account | Real Google flow in staging only |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed
- [x] `spec.md` approved
- [x] `design-style.md` complete
- [ ] Supabase project created and env vars obtained
- [ ] Google OAuth credentials configured in Supabase dashboard
- [ ] Hero background image sourced (not in `get_media_files` output)
- [ ] `TODO(POST_AUTH_REDIRECT)` URL confirmed (blocks Phase 2 callback route)
- [ ] Available locales confirmed (Q1 — blocks Phase 3 language selector)

### External Dependencies

- Supabase project (Auth with Google provider enabled)
- Google Cloud OAuth 2.0 credentials (Client ID + Secret in Supabase Auth settings)
- Figma hero background image (to be provided separately)

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| `TODO(POST_AUTH_REDIRECT)` undefined | High | High | Use `/dashboard` as placeholder; update via env var `NEXT_PUBLIC_POST_AUTH_URL` |
| Hero BG image not available from `get_media_files` | Medium | Medium | Use a dark solid placeholder (`#00101A`) initially; swap when image provided |
| `next-intl` App Router setup complexity | Low | Medium | Use "without i18n routing" mode — flat `app/`, cookie-based locale, `createNextIntlPlugin()` in `next.config.ts`, no `[locale]` directory |
| Supabase SSR cookie conflict with Next.js | Low | Medium | Use separate `lib/supabase/middleware.ts` with bidirectional req/res cookie handler; `server.ts` for RSC only |
| `next/image` blocking Supabase Storage images | Low | Low | Add Supabase storage hostname to `remotePatterns` in `next.config.ts` before using any Supabase Storage URLs |
| Language selector locales unknown (Q1 open) | Medium | Low | Stub with VN only; extendable when Q1 answered |

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown from this plan
2. **Resolve** open prerequisites before Phase 1 starts:
   - Obtain Supabase project URL + anon key
   - Enable Google OAuth in Supabase dashboard
   - Confirm `POST_AUTH_REDIRECT` URL
   - Confirm available locales (Q1)
3. **Begin** Phase 0 asset download in parallel with Phase 1 dependency installation

---

## Open Questions

- [ ] **Q1**: What languages are available in the language selector beyond VN? (Blocks Phase 3)
- [x] **Q2**: Should OAuth cancel be silent? — **Resolved**: spec Scenario 3 is explicit (no error shown). Implemented as `access_denied` → silent redirect to `/`.
- [x] **Q3**: Is language preference persisted across reloads? — **Resolved**: stored in `NEXT_LOCALE` cookie (`max-age=31536000`). No URL param or localStorage (localStorage is FORBIDDEN for session data per constitution).
- [ ] **Q4**: What is `TODO(POST_AUTH_REDIRECT)`? (Blocks Phase 2 callback route)
