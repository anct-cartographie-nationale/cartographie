# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cartographie nationale des lieux d'inclusion numérique - A Next.js application that displays digital inclusion locations across France. Data is sourced from the ANCT (Agence Nationale de la Cohésion des Territoires) DataSpace API.

The project has two build targets:
- **Next.js app**: Full web application with SSR
- **Web Components**: Embeddable `<cartographie-inclusion-numerique>` custom element built with Vite

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start Next.js dev server (http://localhost:3000) with Turbopack
pnpm dev:wc           # Start Vite dev server for web components
pnpm build            # Production build (Next.js)
pnpm build:wc         # Build web components library (outputs to dist-wc/)
pnpm test             # Run Vitest tests in watch mode
pnpm test -- --run    # Run tests once
pnpm test -- <file>   # Run specific test file
pnpm code:check        # Auto-fix linting and formatting issues
pnpm biome:ci         # Check for linting/formatting errors (CI mode)
```

## Architecture

### Directory Structure

- `src/app/` - Next.js App Router pages with two layout groups:
  - `(with-map)/` - Pages with interactive map (regions, departments navigation)
  - `(full-page)/` - Full page views (lieux lists, fiche lieu details)
- `src/web-components/` - Vite-based web components build (uses @tanstack/react-router)
  - `index.ts` - Entry point, defines `<cartographie-inclusion-numerique>` custom element
  - `demo/` - Development HTML page for testing the web component
- `src/features/` - Domain-specific modules (`abilities/` + `injection/` pattern):
  - `cartographie/` - Map display, search, controls
  - `lieux-inclusion-numerique/` - Location details, filters, lists, export
  - `collectivites-territoriales/` - Regions/departments resolution and stats
  - `brand/` - Logos and layout components
- `src/shared/` - Shared cross-feature code:
  - `injection/keys/` - Shared injection keys (API_BASE_URL, TERRITOIRE_FILTER)
  - `injection/providers/` - Shared providers
  - `hooks/` - Shared React hooks
  - `ui/` - Shared UI utilities (theme-colors, highlight-decoupage-administratif)
- `src/libraries/` - Shared utilities:
  - `ui/` - Reusable UI primitives and blocks (using DaisyUI/Tailwind)
  - `injection/` - Dependency injection via `piqure` library
  - `reactivity/` - RxJS-based reactive streams
  - `form/` - Form handling with @tanstack/react-form
  - `nextjs/shim/` - Shims for Next.js APIs when building web components (`.wc.tsx` variants): Link, Image, useSearchParams, etc.
- `src/libraries/inclusion-numerique-api/` - API client for ANCT DataSpace
- `src/styles/` - CSS modules for components and DSFR (Design System FR) overrides

### Key Patterns

**Dependency Injection**: Uses `piqure` library for DI with a contract-based pattern:

```
src/libraries/injection/
├── container.ts        # inject(), provide(), provideLazy(), key()
└── with-injectable.ts  # Lazy loading for server actions

src/shared/injection/
├── keys/               # Injection contracts (typed symbols)
│   ├── api-base-url.key.ts
│   ├── territoire-filter.key.ts
│   └── ...
└── providers/          # Root-level providers
```

**Usage pattern:**
```typescript
// 1. Define a contract (key)
export const API_BASE_URL = key<string>('api-base-url');

// 2. Provide at root level
provide(API_BASE_URL, '/api');  // or provideLazy() for deferred

// 3. Consume anywhere
const baseUrl = inject(API_BASE_URL);
```

**Available keys** (in `src/shared/injection/keys/`):
- `API_BASE_URL` - Base URL for API calls (`/api` for Next.js, external URL for WC)
- `TERRITOIRE_FILTER` - Geographic filter for data

Feature-specific keys are in their respective `injection/` folders (e.g., `NAVBAR_CONFIG` in `src/features/brand/injection/`).

**Providers:**
- Next.js: `ConfigProvider` in `src/app/layout.tsx` reads from `process.env`
- Web Components: `app.tsx` injects from custom element attributes

**Reactive Data Flow**: Map data uses RxJS observables for reactive updates. Key streams in `src/libraries/map/streams/`:
- `boundingBox$` - Current map viewport
- `zoom$` - Current zoom level
- `map$` - MapLibre map instance
- Use `useTap(observable$, callback)` hook for side effects (e.g., map interactions)

**API Client**: External API calls go through `inclusionNumeriqueFetchApi()` in `src/libraries/inclusion-numerique-api/`. Uses PostgREST query format. Server-side only (requires API token).

**Path Alias**: Use `@/` prefix to import from `src/` directory.

**File Replacement for Web Components**: The Vite build uses a custom plugin (`vite-plugin-file-replacement.ts`) that automatically resolves `.wc.tsx` files when they exist. This is used for Next.js-specific shims (e.g., `navigation.wc.tsx` replaces `navigation.tsx` to use `@tanstack/react-router` instead of `next/navigation`).

**When to use File Replacement vs Dependency Injection:**

| Use Case | Approach | Reason |
|----------|----------|--------|
| Navigation hooks (`useRouter`, `usePathname`) | File replacement | Zero runtime cost, tree-shaking, high-frequency calls |
| Link component | File replacement | Static resolution, better bundling |
| Configuration values (API URLs, feature flags) | Dependency injection | Runtime flexibility, explicit contracts |
| Analytics config | Dependency injection | Already using `MATOMO_CONFIG` key |
| Environment variables | File replacement | Different defaults per build target |

**Current `.wc` files:**
- `src/libraries/nextjs/shim/*.wc.tsx` - Navigation adapters (Next.js → TanStack Router)
- `src/libraries/analytics/*.wc.ts` - Analytics with DI for config
- `src/env.client.wc.ts` - Empty defaults for web components

**Guidelines:**
- Use file replacement for **frequently-called hooks** that need zero overhead
- Use dependency injection for **configuration** that varies by environment
- Both approaches are valid; choose based on performance needs

**Environment Variables**: Split into `env.client.ts` (NEXT_PUBLIC_* variables, usable client-side) and `env.server.ts` (server-only variables like API tokens). Web components use `env.client.wc.ts` with empty defaults.

### Feature Structure

Features follow this structure:

```
src/features/[feature-name]/
├── index.ts                # Public API (barrel export)
├── injection/              # Optional - only if feature has DI keys
│   ├── index.ts
│   └── [name].key.ts
└── abilities/
    └── [ability-name]/
        ├── index.ts        # Re-exports
        ├── query/          # Optional - Data fetching, RxJS streams
        ├── presenter/      # Optional - Business logic transformations
        └── ui/             # React components
            ├── index.ts
            ├── sections/   # Optional - Component groups
            └── pages/      # Optional - Multiple pages
```

**Injection directory**: Only required when the feature needs injectable configuration (e.g., `MAP_CONFIG`, `NAVBAR_CONFIG`, `LIEUX_CACHE`). Features without shared state or configuration (like `collectivites-territoriales`) don't need it.

**File naming conventions:**

| Type | Pattern | Example |
|------|---------|---------|
| React components | PascalCase | `LieuxList.tsx` |
| Pages | `{name}.page.tsx` | `lieux.page.tsx` |
| Presenters | `{entity}.presenter.ts` | `opening-hours.presenter.ts` |
| RxJS streams | `{entity}.stream.ts` | `lieux.stream.ts` |
| DI keys | `{name}.key.ts` | `lieux-cache.key.ts` |

Validation: `pnpm lint:architecture`

### Route Structure

The app uses geographic hierarchy: `/[region]/[departement]/...`
- Map views: `/(with-map)/(regions)/`, `/(with-map)/(regions)/[region]/`, `/(with-map)/(regions)/[region]/[departement]/`
- List views: `/(full-page)/(regions)/lieux/`, `/(full-page)/(regions)/[region]/[departement]/lieux/`
- Detail views: `/(full-page)/(regions)/[region]/[departement]/lieux/[id]/`

## Code Style

- Biome for linting/formatting (single quotes, semicolons, no trailing commas)
- Strict TypeScript configuration with `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- Conventional Commits required (feat:, fix:, chore:, etc.)
- Branch prefixes: `feat/`, `fix/`, `chore/`, `docs/`, etc.

## Testing Strategy

The project follows the **"humble object" pattern**: business logic is extracted into pure functions in `src/libraries/`, which are thoroughly tested. React components are kept as thin presentational shells that don't require unit tests.

**What IS tested (23 test files):**
- API transformations (`to-lieu-details`, `to-lieu-list-item`)
- Filter logic (`apply-filters`, `apply-territoire-filter`)
- Presenters (`opening-hours.presenter` - 31 test cases)
- Utilities (`arraysEqual`, `noEmptyString`, `geographic-distance`, etc.)

**What is NOT unit tested (by design):**
- React components - they're presentational, logic is extracted to utilities
- Hooks - most are thin wrappers around extracted logic

**Rationale:**
- Components like `LieuCard`, `LieuxList` are pure JSX rendering props
- Logic that could be tested (e.g., `arraysEqual`, `noEmptyString`) is already in `libraries/utils/` and tested there
- Testing components would duplicate JSX structure with no added value

**When to add component tests:**
- Only if a component contains complex conditional logic that can't be extracted
- For E2E user flows, prefer Playwright over component tests

Run tests: `pnpm test` (watch mode) or `pnpm test -- --run` (single run)

## Environment Variables

**Required:**
- `INCLUSION_NUMERIQUE_API_TOKEN` - API token for ANCT DataSpace
- `NEXT_PUBLIC_APP_NAME` - Application name displayed in navbar and page titles

**Deployment:**
- `NEXT_PUBLIC_BASE_PATH` - Base path for deployment (e.g., `/cartographie` for GitHub Pages)
- `NEXT_ASSET_PREFIX` - Asset prefix for deployment
