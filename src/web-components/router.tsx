import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { WebComponentLayout } from './layout';
import { WithMapLayout } from './layouts/with-map.layout';
import { HomePage } from './pages/home.page';
import { RegionPage } from './pages/region.page';

const rootRoute = createRootRoute({
  component: () => (
    <WebComponentLayout>
      <WithMapLayout />
    </WebComponentLayout>
  )
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage
});

const regionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$region',
  component: RegionPage
});

const routeTree = rootRoute.addChildren([homeRoute, regionRoute]);

export const createAppRouter = () =>
  createRouter({
    routeTree
  });

export type AppRouter = ReturnType<typeof createAppRouter>;

declare module '@tanstack/react-router' {
  interface Register {
    router: AppRouter;
  }
}
