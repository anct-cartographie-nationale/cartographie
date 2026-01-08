# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cartographie nationale des lieux d'inclusion numérique - A Next.js application that displays digital inclusion locations across France. Data is sourced from the ANCT (Agence Nationale de la Cohésion des Territoires) DataSpace API.

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start development server (http://localhost:3000) with Turbopack
pnpm build            # Production build
pnpm test             # Run Vitest tests in watch mode
pnpm test -- --run    # Run tests once
pnpm test -- <file>   # Run specific test file
pnpm biome:fix        # Auto-fix linting and formatting issues
pnpm biome:ci         # Check for linting/formatting errors (CI mode)
```

## Architecture

### Directory Structure

- `src/app/` - Next.js App Router pages with two layout groups:
  - `(with-map)/` - Pages with interactive map (regions, departments navigation)
  - `(full-page)/` - Full page views (lieux lists, fiche lieu details)
- `src/features/` - Domain-specific modules:
  - `cartographie/` - Map components, markers, clustering, geo utilities
  - `lieux-inclusion-numerique/` - Location details, filters, lists
  - `collectivites-territoriales/` - Regions/departments data and utilities
  - `address/` - Address search using BAN (Base Adresse Nationale)
  - `brand/` - Logos and layout components
- `src/libraries/` - Shared utilities:
  - `ui/` - Reusable UI primitives and blocks (using DaisyUI/Tailwind)
  - `injection/` - Dependency injection via `piqure` library
  - `reactivity/` - RxJS-based reactive streams
  - `form/` - Form handling with @tanstack/react-form
- `src/external-api/` - External API clients (inclusion-numerique API)
- `src/styles/` - CSS modules for components and DSFR (Design System FR) overrides

### Key Patterns

**Dependency Injection**: Uses `piqure` library for DI. Inject dependencies via `inject(KEY)` pattern. See `src/libraries/injection/container.ts`.

**Reactive Data Flow**: Map data uses RxJS observables for reactive updates. Key streams in `src/features/cartographie/lieux/streams/`:
- `boundingBox$` - Current map viewport
- `zoom$` - Current zoom level
- `lieux$` - Locations with clustering via `mutable-supercluster`

**API Client**: External API calls go through `inclusionNumeriqueFetchApi()` in `src/external-api/inclusion-numerique/`. Uses PostgREST query format.

**Path Alias**: Use `@/` prefix to import from `src/` directory.

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

- `INCLUSION_NUMERIQUE_API_TOKEN` - API token for ANCT DataSpace
- `NEXT_PUBLIC_BASE_PATH` - Base path for deployment (e.g., `/cartographie` for GitHub Pages)
- `NEXT_ASSET_PREFIX` - Asset prefix for deployment
