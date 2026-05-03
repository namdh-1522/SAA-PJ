# Feature Specification: Login

**Frame ID**: `GzbNeVGJHz`
**Frame Name**: `Login`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-04-21
**Status**: Draft

---

## Overview

The Login screen is the single entry point for the SAA 2025 (Sun* Asia Awards 2025) platform. It
provides **Google OAuth as the only authentication method** via Supabase Auth. The page presents
a full-screen hero visual, a branded "Root Further" logo, a Vietnamese motivational tagline, and a
prominent "LOGIN With Google" CTA. A language selector in the header allows users to switch the
display language; the current default is Vietnamese (VN).

All platform content is gated behind authentication — users who are not signed in are always
redirected to this screen.

---

## User Scenarios & Testing

### User Story 1 — Google OAuth Sign-In (Priority: P1)

**As a** prospective SAA 2025 participant or visitor
**I want to** authenticate using my Google account
**So that** I can access the platform and explore SAA 2025 content

**Why this priority**: The entire application is gated behind authentication. Without this flow
there is no usable product.

**Independent Test**: Navigate to `/`, click "LOGIN With Google", complete the Google OAuth
consent screen, and verify the user is redirected to the post-login destination (dashboard).

#### Acceptance Scenarios

**Scenario 1: Happy path — successful OAuth**
- Given: The user is unauthenticated and on the Login page
- When: They click "LOGIN With Google"
- Then: They are redirected to the Google OAuth consent screen

**Scenario 2: OAuth completes successfully**
- Given: The user has completed Google OAuth consent
- When: Google redirects back to `/auth/callback` with a valid code
- Then: The server exchanges the code for a Supabase session, sets an HttpOnly session cookie,
  and redirects the user to TODO(POST_AUTH_REDIRECT)

**Scenario 3: User cancels OAuth**
- Given: The user was redirected to Google OAuth
- When: They cancel / deny consent and Google redirects back with an error
- Then: The user is returned to `/` (Login page) with no error message displayed

**Scenario 5: OAuth callback returns an error**
- Given: Google redirects to `/auth/callback?error=<code>&error_description=<msg>`
- When: The callback handler detects the `error` query parameter
- Then: The user is redirected to `/` with a generic error notification visible
  (e.g. `?auth_error=true`); the notification uses the i18n key `login.error.oauth_failed`

**Scenario 6: Supabase session exchange fails (server error)**
- Given: The `/auth/callback` route receives a valid code but `exchangeCodeForSession` fails
- When: A network or Supabase server error occurs
- Then: The user is redirected to `/` with the generic error notification visible

**Scenario 4: Already-authenticated redirect**
- Given: The user has an active Supabase session (valid cookie)
- When: They navigate to `/` or `/login`
- Then: They are automatically redirected to TODO(POST_AUTH_REDIRECT) without seeing the Login UI

---

### User Story 2 — Language Selection (Priority: P2)

**As a** user who prefers a non-Vietnamese UI
**I want to** switch the interface language via the header language selector
**So that** I can read the platform content in my preferred language

**Why this priority**: The platform ships with Vietnamese as the default. Language switching is a
usability enhancement but does not block access to the core product.

**Independent Test**: Click the language button showing "VN", verify available language options
appear, select one, and confirm visible text updates accordingly.

#### Acceptance Scenarios

**Scenario 1: Open language picker**
- Given: The user is on the Login page
- When: They click the "VN" language button in the header
- Then: Available language options are displayed (dropdown or modal)

**Scenario 2: Switch language**
- Given: The language picker is open
- When: The user selects a different language
- Then: All visible text on the Login page updates to the selected language

---

### Edge Cases

- What happens when Google OAuth token exchange fails (network error, invalid code)?
  → Return to Login page; display a generic i18n error notification.
- What happens on a browser with cookies disabled?
  → Supabase session cannot be stored; display a user-facing message asking them to enable
  cookies, rather than looping silently.
- What happens on mobile viewports (< 768 px)?
  → Layout adapts per responsive specifications in `design-style.md`.

---

## UI/UX Requirements

### Screen Components

| Component | Node ID | Description | Interactions |
|-----------|---------|-------------|--------------|
| Header (`mms_A_Header`) | `662:14391` | Fixed top bar, semi-transparent dark bg, logo left + language right | Static container |
| Logo (`mms_A.1_Logo`) | `I662:14391;186:2166` | Site logo (52×48 px) | Click → `/` |
| Language Selector (`mms_A.2_Language`) | `I662:14391;186:1601` | "VN" flag + label + chevron | Click → show language options |
| Hero BG (`mms_C_Keyvisual`) | `662:14388` | Full-screen key visual image | None (decorative) |
| H Gradient | `662:14392` | Left-to-transparent horizontal overlay | None (decorative) |
| V Gradient | `662:14390` | Bottom-to-transparent vertical overlay | None (decorative) |
| Brand Logo (`mms_B.1_Key Visual`) | `662:14395` | "Root Further" event brand (451×200 px) | None |
| Tagline (`mms_B.2_content`) | `662:14753` | Two-line Vietnamese tagline (i18n) | None |
| Login CTA (`mms_B.3_Login` → `662:14426`) | `662:14426` | "LOGIN With Google" button (305×60 px, #FFEA9E) | Click → Google OAuth |
| Error Notification | — | Inline banner or toast shown when `?auth_error=true` is in the URL; dismissible; uses i18n key `login.error.oauth_failed` | Dismiss → clears query param |
| Footer (`mms_D_Footer`) | `662:14447` | Copyright strip | None |

### Navigation Flow

- **Entry**: Any unauthenticated request to a protected route → redirect to Login
- **Exit (success)**: Google OAuth → `/auth/callback` → TODO(POST_AUTH_REDIRECT)
- **Exit (cancel)**: OAuth cancel → back to Login

See `.momorph/contexts/SCREENFLOW.md` for the full navigation graph.

### Visual Requirements

- See `design-style.md` for all pixel-accurate dimensions, colors, typography, and spacing.
- Layout ASCII diagram: `design-style.md` → Layout Structure section.
- **Responsive**: Mobile ≥ 360 px / Tablet ≥ 768 px / Desktop ≥ 1280 px (see design-style.md).
- **Transitions**: Button hover 150 ms ease-in-out; language dropdown 150 ms ease-out.
- **Accessibility**:
  - Login CTA MUST have `aria-label="Login with Google"`.
  - Language selector MUST have `aria-haspopup="listbox"` and `aria-expanded`.
  - All interactive elements MUST be keyboard-navigable (Tab + Enter/Space).
  - Color contrast MUST meet WCAG 2.1 AA (#FFEA9E on #00101A = 9.3:1 ✅).

---

## Requirements

### Functional Requirements

- **FR-001**: The system MUST render a "LOGIN With Google" button that initiates Supabase Google
  OAuth (`signInWithOAuth({ provider: 'google' })`).
- **FR-002**: The system MUST automatically redirect authenticated users away from the Login page
  to TODO(POST_AUTH_REDIRECT) before the page renders.
- **FR-003**: The OAuth callback route (`/auth/callback`) MUST exchange the Google authorization
  code for a Supabase session server-side and set an HttpOnly session cookie.
- **FR-004**: The system MUST display the Login page in Vietnamese by default; the header language
  selector MUST allow switching to other supported languages.
- **FR-005**: The header logo click MUST navigate to `/`.
- **FR-006**: The system MUST NOT store session tokens in `localStorage` or URL fragments.

### Technical Requirements

- **TR-001**: Google OAuth MUST use the Supabase SSR helper (`createServerClient` /
  `createBrowserClient` depending on context) per constitution Principle V.
- **TR-002**: The `/auth/callback` route handler MUST call
  `supabase.auth.exchangeCodeForSession(code)` server-side.
- **TR-003**: The Login page route MUST be a React Server Component; the "LOGIN With Google"
  button MUST be a `'use client'` component for its `onClick` handler only.
- **TR-004**: The hero background image MUST be rendered with `next/image` using `priority` and
  `fill` (or explicit `width`/`height`) to achieve Lighthouse Performance ≥ 90 on desktop.
- **TR-005**: All hardcoded text strings (tagline, footer copyright, button label) MUST be
  extracted into i18n keys before the feature is considered complete.

### Key Entities

- **Session**: Supabase Auth session — `access_token`, `refresh_token`, `expires_at`, `user`.
- **User**: `id` (UUID), `email`, `user_metadata.full_name`, `user_metadata.avatar_url`
  (populated from Google profile on first sign-in).

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| Supabase `auth.signInWithOAuth` | — (client SDK) | Redirect to Google consent screen; MUST pass `redirectTo: <origin>/auth/callback` | Supabase built-in |
| `/auth/callback` | GET | Receive `code` param, exchange for session server-side, set HttpOnly cookie, redirect to post-auth URL; on `error` param redirect to `/?auth_error=true` | New — required |
| Supabase `auth.getSession` (server) | — (server SDK) | Check existing session on page load; redirect authenticated users away from Login | Supabase built-in |
| `/api/auth/session` | GET (predicted) | Optional: expose session status for client hydration | New — predicted |

---

## State Management

### Local Component State

| Component | State | Type | Description |
|-----------|-------|------|-------------|
| `GoogleLoginButton` | `isLoading` | boolean | True from button click until browser navigates away; button shows opacity 0.7 + `cursor-wait`, text unchanged |
| `GoogleLoginButton` | `errorMessage` | string \| null | Populated from `?auth_error=true` URL param on mount; cleared on dismiss; drives error notification visibility |
| `LanguageSelector` | `isOpen` | boolean | Dropdown open/closed |
| `LanguageSelector` | `currentLocale` | string | Active locale code (e.g., `'vi'`) |

### Loading & Error State Behavior

| State | Visual Change |
|-------|---------------|
| `isLoading: true` | Button opacity → 0.7; cursor → `wait`; button text and icon unchanged; button is disabled (no re-click) |
| `errorMessage` set | Error notification banner appears above the CTA button; dismissible via ✕; uses i18n key `login.error.oauth_failed` |

### Global State

| State | Store | Description |
|-------|-------|-------------|
| `session` | Supabase Auth context / React Context | Current Supabase session; drives route guards |
| `locale` | i18n context / URL param | Selected language; shared across all screens |

### Cache

- Supabase session is stored in an HttpOnly cookie; no additional client-side caching needed.
- The hero background image MUST be cached via `next/image` with a long `Cache-Control` header.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: 100% of unauthenticated requests to protected routes result in a redirect to Login.
- **SC-002**: Google OAuth round-trip (button click → dashboard) completes in < 3 s on a stable
  connection (excludes Google's own server latency).
- **SC-003**: Zero session tokens or sensitive user data appear in `localStorage`,
  `sessionStorage`, cookies without `HttpOnly`, or URL fragments after login.
- **SC-004**: Lighthouse Performance score ≥ 90 on desktop for the Login page.

---

## Out of Scope

- Email/password authentication.
- Other OAuth providers (GitHub, Facebook, Apple, etc.).
- Manual user registration — Google OAuth creates accounts automatically.
- Password reset or account recovery flows.
- User profile editing.

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`) — not yet created
- [ ] Database design completed (`.momorph/database.sql`) — not yet created
- [x] Screen flow documented (`.momorph/contexts/SCREENFLOW.md`)
- [ ] i18n library selected and configured — required before hardcoded strings are extracted
- [ ] Post-auth redirect route defined — `TODO(POST_AUTH_REDIRECT)` blocks FR-002 and FR-003

---

## Notes

- **Context**: SAA 2025 = Sun* Asia Awards 2025; the "Root Further" brand is the awards identity.
- **Single auth method**: Only Google OAuth. No username/password, no magic links.
- **Language**: All visible text is Vietnamese by default. English (or other locales) are accessed
  via the language selector. All strings MUST be behind i18n keys before shipping.
- **Google icon**: `MM_MEDIA_Google` (node `I662:14426;186:1766`) MUST be an SVG Icon Component
  per frontend guidelines — not an `<img>` tag or an external URL.
- **Brand images** (`MM_MEDIA_Root Further Logo`, hero background) MUST be served as optimised
  static assets via `next/image` (see TR-004).
- **Frame image reference**: `https://momorph.ai/api/images/9ypp4enmFmdK3YAFJLIu6C/662:14387/127763e01fa1f7169aaf137bf06f7bb4.png`
