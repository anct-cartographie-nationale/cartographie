import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { zodSearchValidator } from '@tanstack/router-zod-adapter';
import { WebComponentLayout } from './layout';
import { WithMapLayout } from './layouts/with-map.layout';
import { Page as DepartementPage } from './pages/departement.page';
import { Page as DepartementLieuxPage } from './pages/departement-lieux.page';
import { Page as DepartementsPage } from './pages/departements.page';
import { Page as LieuPage } from './pages/lieu.page';
import { Page as LieuRedirectPage } from './pages/lieu-redirect.page';
import { Page as LieuxPage } from './pages/lieux.page';
import { Page as RegionLieuxPage } from './pages/region-lieux.page';
import { Page as RegionsPage } from './pages/regions.page';
import { paginationSearchSchema } from './search-params.schema';

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
  component: DepartementPage,
  validateSearch: zodSearchValidator(paginationSearchSchema)
});

const lieuxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lieux',
  component: LieuxPage,
  validateSearch: zodSearchValidator(paginationSearchSchema)
});

const lieuRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lieux/$id',
  component: LieuRedirectPage
});

const regionLieuxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$region/lieux',
  component: RegionLieuxPage,
  validateSearch: zodSearchValidator(paginationSearchSchema)
});

const departementLieuxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$region/$departement/lieux',
  component: DepartementLieuxPage,
  validateSearch: zodSearchValidator(paginationSearchSchema)
});

const lieuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$region/$departement/lieux/$id',
  component: LieuPage
});

const routeTree = rootRoute.addChildren([
  withMapRoute.addChildren([homeRoute, regionRoute, departementRoute]),
  lieuxRoute,
  lieuRedirectRoute,
  regionLieuxRoute,
  departementLieuxRoute,
  lieuRoute
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
