import { createMemoryHistory, createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { WebComponentLayout } from './layout';
import { AuvergneRhoneAlpesPage } from './pages/auvergne-rhone-alpes.page';
import { HomePage } from './pages/home.page';

const rootRoute = createRootRoute({
  component: () => (
    <WebComponentLayout>
      <Outlet />
    </WebComponentLayout>
  )
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage
});

const auvergneRhoneAlpesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auvergne-rhone-alpes',
  component: AuvergneRhoneAlpesPage
});

const routeTree = rootRoute.addChildren([homeRoute, auvergneRhoneAlpesRoute]);

export const createAppRouter = () =>
  createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/'] })
  });

export type AppRouter = ReturnType<typeof createAppRouter>;

declare module '@tanstack/react-router' {
  interface Register {
    router: AppRouter;
  }
}
