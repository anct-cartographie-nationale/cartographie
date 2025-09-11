import type { ReactNode } from 'react';
import { DEPARTEMENTS_ROUTE, inclusionNumeriqueFetchApi, REGIONS_ROUTE } from '@/api/inclusion-numerique';
import { addNombreLieux } from '@/api/inclusion-numerique/transfer/add-nombre-lieux';
import ClientLayout from '@/app/(with-map)/client.layout';
import type { Departement } from '@/features/collectivites-territoriales/departement';
import departements from '@/features/collectivites-territoriales/departements.json';
import type { Region } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';

type LayoutProps = {
  children: ReactNode;
};

const Layout = async ({ children }: LayoutProps) => {
  const regionRouteResponse = await inclusionNumeriqueFetchApi(REGIONS_ROUTE);
  const departementRouteResponse = await inclusionNumeriqueFetchApi(DEPARTEMENTS_ROUTE);

  return (
    <ClientLayout
      regions={addNombreLieux<Region>(regionRouteResponse)(regions)}
      departements={addNombreLieux<Departement>(departementRouteResponse)(departements)}
    >
      {children}
    </ClientLayout>
  );
};

export default Layout;
