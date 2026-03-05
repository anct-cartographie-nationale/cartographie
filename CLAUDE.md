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
- `src/features/` - Domain-specific modules (each follows `abilities/`+`infrastructure/`+`domain/` pattern):
  - `cartographie/` - Map display, search, controls
  - `lieux-inclusion-numerique/` - Location details, filters, lists, export
  - `collectivites-territoriales/` - Regions/departments resolution and stats
  - `brand/` - Logos and layout components
- `src/libraries/` - Shared utilities:
  - `ui/` - Reusable UI primitives and blocks (using DaisyUI/Tailwind)
  - `injection/` - Dependency injection via `piqure` library
  - `reactivity/` - RxJS-based reactive streams
  - `form/` - Form handling with @tanstack/react-form
  - `next-shim/` - Shims for Next.js APIs when building web components (`.wc.tsx` variants): Link, Image, useSearchParams, etc.
- `src/libraries/inclusion-numerique-api/` - API client for ANCT DataSpace
- `src/styles/` - CSS modules for components and DSFR (Design System FR) overrides

### Key Patterns

**Dependency Injection**: Uses `piqure` library for DI with a contract-based pattern:

```
src/libraries/injection/
├── container.ts        # inject(), provide(), provideLazy(), key()
├── keys/               # Injection contracts (typed symbols)
│   ├── api-base-url.key.ts
│   ├── navbar-config.key.ts
│   └── ...
├── providers/          # Root-level providers
│   └── config.provider.tsx
└── with-injectable.ts  # Lazy loading for server actions
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

**Available keys:**
- `API_BASE_URL` - Base URL for API calls (`/api` for Next.js, external URL for WC)
- `NAVBAR_CONFIG` - Branding configuration (logo, app name, help link)
- `MAP_CONFIG` - Map initial view configuration
- `TERRITOIRE_FILTER` - Geographic filter for data

**Providers:**
- Next.js: `ConfigProvider` in `src/app/layout.tsx` reads from `process.env`
- Web Components: `app.tsx` injects from custom element attributes

**Reactive Data Flow**: Map data uses RxJS observables for reactive updates. Key streams in `src/features/lieux-inclusion-numerique/infrastructure/streams/`:
- `boundingBox$` - Current map viewport
- `zoom$` - Current zoom level
- `lieux$` - Locations with clustering via `mutable-supercluster`
- Use `useTap(observable$, callback)` hook for side effects (e.g., map interactions)

**API Client**: External API calls go through `inclusionNumeriqueFetchApi()` in `src/libraries/inclusion-numerique-api/`. Uses PostgREST query format. Server-side only (requires API token).

**Path Alias**: Use `@/` prefix to import from `src/` directory.

**File Replacement for Web Components**: The Vite build uses a custom plugin (`vite-plugin-file-replacement.ts`) that automatically resolves `.wc.tsx` files when they exist. This is used for Next.js-specific shims (e.g., `navigation.wc.tsx` replaces `navigation.tsx` to use `@tanstack/react-router` instead of `next/navigation`). For configuration differences, prefer using dependency injection over file replacement.

**Environment Variables**: Split into `env.client.ts` (NEXT_PUBLIC_* variables, usable client-side) and `env.server.ts` (server-only variables like API tokens). Web components use `env.client.wc.ts` with empty defaults.

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

## Environment Variables

**Required:**
- `INCLUSION_NUMERIQUE_API_TOKEN` - API token for ANCT DataSpace
- `NEXT_PUBLIC_APP_NAME` - Application name displayed in navbar and page titles

**Deployment:**
- `NEXT_PUBLIC_BASE_PATH` - Base path for deployment (e.g., `/cartographie` for GitHub Pages)
- `NEXT_ASSET_PREFIX` - Asset prefix for deployment
