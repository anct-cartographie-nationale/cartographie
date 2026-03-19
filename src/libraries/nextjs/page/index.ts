// New pipe-based API

// Shared middlewares
export { withDerive, withFetch, withMap } from '../shared/middlewares';
// Utilities
export { applyProviders } from './apply-providers';
export { fromPage, use, wrap } from './builder';
export { redirectTo, render } from './execution';
// Middlewares
export {
  ClientBinder,
  withClientBinder,
  withPagination,
  withParams,
  withRequired,
  withSearchParams,
  withUrlSearchParams
} from './middlewares';
// Types
export type { PageBuilder, PageMiddleware } from './page';
// Legacy fluent API (backward compatibility)
export { page } from './page';
export type { PageProps, Provider, TypedMiddleware } from './types';
