import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { WebComponentLayout } from './layout';
import { WithMapLayout } from './layouts/with-map.layout';
import { Page as DepartementPage } from './pages/departement.page';
import { Page as DepartementsPage } from './pages/departements.page';
import { Page as RegionsPage } from './pages/regions.page';

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
  component: RegionsPage
});

const regionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$region',
  component: DepartementsPage
});

const departementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$region/$departement',
  component: DepartementPage
});

const routeTree = rootRoute.addChildren([homeRoute, regionRoute, departementRoute]);

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
