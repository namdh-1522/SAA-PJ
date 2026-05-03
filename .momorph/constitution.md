<!--
SYNC IMPACT REPORT
==================
Version change: N/A → 1.0.0 (initial creation)

Modified principles: N/A (first-time setup)

Added sections:
  - I. Clean Code & Source Organization (new)
  - II. Tech Stack Best Practices — Next.js + Supabase (new)
  - III. Test-First Development — NON-NEGOTIABLE (new)
  - IV. Platform UI & Navigation Guidelines (new)
  - V. Security First — OWASP (new)
  - Technology Stack (new)
  - Development Workflow (new)
  - Governance (new)

Removed sections: N/A

Templates checked:
  ✅ .momorph/templates/plan-template.md — Constitution Compliance Check items map to all 5
     principles; no changes required.
  ✅ .momorph/templates/spec-template.md — Dependencies section already references
     constitution.md; no changes required.
  ✅ .momorph/templates/tasks-template.md — TDD flow (tests before implementation) and security
     hardening tasks already present; no changes required.

Follow-up TODOs:
  - TODO(PROJECT_NAME): "my-app" is the create-next-app placeholder. Replace with real name.
  - TODO(TEST_VERSIONS): Vitest and Playwright have not been added to package.json yet.
    Pin versions once installed.
  - TODO(DEPLOYMENT_PLATFORM): Deployment target (Vercel, self-hosted, etc.) not yet decided.
-->

# my-app Constitution

## Core Principles

### I. Clean Code & Source Organization

All code MUST follow single responsibility per file and the naming conventions established in
`.momorph/guidelines/backend.md` and `.momorph/guidelines/frontend.md`:

- **File naming**: kebab-case for non-component modules (e.g., `user-service.ts`);
  PascalCase for React components and classes (e.g., `UserCard.tsx`, `AuthService.ts`).
- **Folder structure**: feature-based pages under `app/`; shared utilities in `lib/`; types in
  `types/`; server actions in `actions/`; Supabase client helpers in `lib/supabase/`.
- **Code style**: 2-space indentation, ~100-character line width, single quotes, template literals
  for string interpolation; `const` and immutable patterns MUST be preferred over `let`/mutation.
- **Circular imports are FORBIDDEN.** Dependency direction MUST flow in one direction only:
  `route handlers → controllers → services → repositories / utilities`.
- Business logic MUST reside in service classes only; route handlers MUST NOT contain logic.
- DTOs MUST use `@Exclude()` for sensitive fields; no business logic is permitted in DTOs.

**Rationale**: Consistent, predictable structure reduces cognitive load and makes automated
tooling (linting, AI agents) reliable across the entire codebase.

### II. Tech Stack Best Practices — Next.js + Supabase

All features MUST leverage the approved stack using its idiomatic patterns:

- **React Server Components (RSC)**: default for all pages and layouts. `'use client'` MUST only
  be added when interactivity or browser-specific APIs are strictly required.
- **Supabase — server client**: `createServerClient` MUST be used for all authenticated or
  sensitive operations (API route handlers, server actions, RSC data fetching).
- **Supabase — browser client**: `createBrowserClient` is permitted only for public/anonymous
  reads where no user-specific data is involved.
- **Row Level Security (RLS)**: RLS MUST be enabled on every Supabase table. No table MUST rely
  solely on application-layer access guards.
- **Tailwind CSS v4 + Design Tokens**: all color, spacing, and typography values MUST be declared
  as CSS variables in the global stylesheet and consumed via Tailwind utility classes (e.g.,
  `bg-primary`, `text-brand-500`). Hard-coding raw values in component files is FORBIDDEN.
- **TypeScript strict mode** is non-negotiable. The `any` type MUST NOT be introduced without an
  inline comment explaining why narrowing to a concrete type is not possible.
- The `@/*` path alias (root-relative imports) MUST replace deep relative imports (`../../..`).
- `next/font` MUST be used for all typeface loading; no external `<link>` font imports.
- New third-party dependencies MUST be approved by the team before introduction and listed in
  the Technology Stack section below.

**Rationale**: Idiomatic use of each tool closes security gaps (RLS + server client), keeps
the client bundle lean, and ensures consistent visual output from design tokens.

### III. Test-First Development — NON-NEGOTIABLE

TDD MUST be followed for all new features and non-trivial bug fixes:

1. Author the test(s) for the target behaviour.
2. Obtain stakeholder / reviewer approval on the test scope.
3. Confirm the tests FAIL against the current code (Red).
4. Implement the minimum code to make them pass (Green).
5. Refactor while keeping all tests green.

Test scope:

- **Unit tests** (Vitest): service classes, utility functions, pure business logic.
- **Integration tests** (Vitest + Supabase test helpers): API route handlers, server actions,
  and Supabase queries MUST run against a real local Supabase instance or a dedicated test DB —
  mocking the database is PROHIBITED.
- **E2E tests** (Playwright): all critical user flows (authentication, primary happy paths,
  key error states).

Tests MUST be committed in the same PR as the implementation they cover.
A PR containing implementation but no tests MUST NOT be merged.

**Rationale**: Test-first surfaces design problems before implementation; real-DB integration
tests prevent mock/production divergence that has caused production incidents in the past.

### IV. Platform UI & Navigation Guidelines

UI MUST follow platform-appropriate design conventions and source-of-truth navigation rules:

- **Responsive web (primary platform)**: layouts MUST support mobile (≥ 360 px), tablet
  (≥ 768 px), and desktop (≥ 1280 px) breakpoints using Tailwind responsive utilities.
- **Design references**:
  - Material Design 3 principles inform component behaviour patterns: touch targets ≥ 48 px,
    elevation system, motion and state layers.
  - Human Interface Guidelines inform clarity, spatial hierarchy, and layout conventions.
- **Navigation MUST be derived from documentation — never guessed or hard-coded:**
  - Direct navigation (links, CTA buttons) MUST come from the `SCREENFLOW.md` Navigation Graph.
  - Logic-triggered navigation (form success/failure, API responses) MUST come from
    `group_specs/*.md` `businessLogic` or `apiEndpoints` sections.
  - Any interactive element whose destination cannot be found in either source MUST block
    implementation; the discrepancy MUST be reported to the team before code is written.
- **Accessibility**: all interactive elements MUST meet WCAG 2.1 AA contrast ratios and
  keyboard/focus management requirements.

**Rationale**: Source-of-truth navigation prevents URL drift between design and code; platform
guidelines ensure familiar, accessible UX across form factors.

### V. Security First — OWASP

All code MUST comply with OWASP Secure Coding Practices. The following rules are merge gates:

- **Input validation**: ALL user-supplied input MUST be validated and sanitized at system
  boundaries (API routes, server actions, form handlers) before processing or storage.
- **Authentication & authorization**: Supabase Auth MUST be the sole auth provider. Session
  tokens MUST be managed in HttpOnly cookies via Supabase SSR helpers. Storing tokens in
  `localStorage` or `sessionStorage` is FORBIDDEN.
- **Secrets management**: ALL credentials, API keys, and service URLs MUST be stored in
  environment variables (`.env.local`). Committing secrets to version control is FORBIDDEN.
  The `NEXT_PUBLIC_` prefix MUST only be used for values that are genuinely safe to expose
  publicly.
- **Injection prevention**: Supabase parameterized queries MUST be used exclusively. Raw SQL
  string concatenation is FORBIDDEN.
- **Sensitive data exposure**: API responses MUST NOT return password hashes, session tokens,
  or internal surrogate keys unless strictly required. DTOs MUST apply `@Exclude()`.
- **Dependency hygiene**: known vulnerable packages MUST be patched or replaced within
  5 business days of public disclosure. `npm audit` MUST run in CI and block merges on
  critical/high-severity findings.

**Rationale**: Supabase RLS + server-side client + HttpOnly cookies form a layered defence
that eliminates the most common Next.js authentication and injection vulnerabilities.

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.4 |
| UI Library | React | 19.2.4 |
| Language | TypeScript (strict) | ^5 |
| Styling | Tailwind CSS v4 + CSS variables | ^4 |
| Backend-as-a-Service | Supabase (Auth, Database, Storage) | latest stable |
| Server State / Cache | TanStack Query (`@tanstack/react-query`) | ^5 — approved for Sun* Kudos Live Board (8 API endpoints, pagination, stale-while-revalidate) |
| API Validation | Zod | ^3 — approved; replaces ad-hoc validation at API boundaries (§V mandate) |
| Accessible UI Primitives | `@radix-ui/react-dialog` | ^1 — approved for `ImageLightbox` (WAI-ARIA focus-trap; headlessui rejected due to React 19 uncertainty) |
| Linting | ESLint + eslint-config-next | ^9 |
| Unit / Integration Tests | Vitest | ^2.1.9 |
| E2E Tests | Playwright | ^1.59.1 |
| Deployment | TODO(DEPLOYMENT_PLATFORM) | — |

Any addition or removal of a dependency requires a PR updating this table and a brief
justification comment in the PR description.

## Development Workflow

- **Branching**: feature branches from `main` following the pattern
  `{type}/{short-description}` (e.g., `feat/user-auth`, `fix/supabase-rls-policy`).
- **Commits**: conventional commits format (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`,
  `chore:`). Every commit MUST be atomic and buildable.
- **CI gates** (all MUST pass before merge):
  - `tsc --noEmit` — zero type errors.
  - `eslint` — zero lint errors.
  - Unit + integration test suite — zero failures.
  - `npm audit` — no critical/high vulnerabilities.
- **Code review**: at least one peer approval is required. Reviewers MUST verify the
  Constitution Compliance Check in `plan-template.md` before approving.
- **TDD gate**: tests MUST be authored and reviewed before implementation begins (Principle III).
- **RLS gate**: every Supabase migration PR MUST include RLS policy definitions (Principle V).
- **Design token gate**: PRs MUST NOT introduce raw color/spacing values in components (Principle II).

## Governance

This constitution supersedes all other conventions, guidelines, and prior agreements.
Amendments require:

1. A PR updating this file with a clear description of the change and its rationale.
2. Peer review and approval by at least one senior contributor.
3. A migration plan for existing code that violates the new rule, included in the PR.
4. A version bump according to the policy below.

**Versioning policy**:
- **MAJOR**: backward-incompatible removal or redefinition of an existing principle.
- **MINOR**: new principle or section added; material expansion of existing guidance.
- **PATCH**: clarifications, wording improvements, typo corrections.

All PRs and code reviews MUST verify compliance with the five core principles.
The `.momorph/guidelines/` directory provides runtime guidance for agents and team members;
it is subordinate to this constitution and MUST NOT contradict it.

**Version**: 1.0.0 | **Ratified**: 2026-04-21 | **Last Amended**: 2026-04-21
