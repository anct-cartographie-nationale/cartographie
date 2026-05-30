// Côté Next.js, le tracking Matomo (init + pageviews) est géré par
// `src/instrumentation-client.ts` (initMatomoBrowser + onRouterTransition).
// Ce composant n'existe que comme base du file-replacement : le build web
// component le remplace par `matomo-tracker.wc.tsx`, qui pilote le tracking via
// `@tanstack/react-router` (l'API instrumentation-client étant propre à Next).
export const MatomoTracker = (): null => null;
