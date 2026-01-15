import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { WebComponentLayout } from './layout';
import { WithMapLayout } from './layouts/with-map.layout';
import { Page as DepartementPage } from './pages/departement.page';
import { Page as DepartementsPage } from './pages/departements.page';
import { Page as LieuxPage } from './pages/lieux.page';
import { Page as RegionLieuxPage } from './pages/region-lieux.page';
import { Page as RegionsPage } from './pages/regions.page';

const rootRoute = createRootRoute({
  component: () => (
    <WebComponentLayout>
      <Outlet />
    </WebComponentLayout>
  )
});

const withMapRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'with-map',
  component: WithMapLayout
});

const homeRoute = createRoute({
  getParentRoute: () => withMapRoute,
  path: '/',
  component: RegionsPage
});

const regionRoute = createRoute({
  getParentRoute: () => withMapRoute,
  path: '/$region',
  component: DepartementsPage
});

const departementRoute = createRoute({
  getParentRoute: () => withMapRoute,
  path: '/$region/$departement',
  component: DepartementPage
});

const lieuxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lieux',
  component: LieuxPage
});

const regionLieuxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$region/lieux',
  component: RegionLieuxPage
});

const routeTree = rootRoute.addChildren([
  withMapRoute.addChildren([homeRoute, regionRoute, departementRoute]),
  lieuxRoute,
  regionLieuxRoute
]);

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
