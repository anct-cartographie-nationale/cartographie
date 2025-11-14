import { headers } from 'next/headers';
import type { ReactNode } from 'react';
import ClientLayout from '@/app/(with-map)/client.layout';
import { inclusionNumeriqueFetchApi, LIEUX_ROUTE, type LieuxRouteOptions } from '@/external-api/inclusion-numerique';
import { type Departement, departementMatchingCode } from '@/features/collectivites-territoriales/departement';
import departements from '@/features/collectivites-territoriales/departements.json';
import type { Region } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { applyFilters } from '@/features/lieux-inclusion-numerique/apply-filters';
import { filtersSchema } from '@/features/lieux-inclusion-numerique/validations';
import { asCount, countFromHeaders } from '@/libraries/api/options';

type LayoutProps = {
  children: ReactNode;
};

const toRegionTotalCount =
  (departementsAvecTotaux: (Departement & { nombreLieux: number })[]) => (total: number, code: string) =>
    total + (departementsAvecTotaux.find(departementMatchingCode(code))?.nombreLieux ?? 0);

const Layout = async ({ children }: LayoutProps) => {
  const referer = (await headers()).get('referer');
  const searchParams = referer ? Object.fromEntries(new URL(referer).searchParams) : {};

  const departementsAvecTotaux: (Departement & { nombreLieux: number })[] = await Promise.all(
    departements.map(async (departement: Departement) => {
      const [_, headers] = await inclusionNumeriqueFetchApi(
        LIEUX_ROUTE,
        ...asCount<LieuxRouteOptions>({
          filter: { 'adresse->>code_insee': `like.${departement.code}*`, ...applyFilters(filtersSchema.parse(searchParams)) }
        })
      );

      return { ...departement, nombreLieux: countFromHeaders(headers) };
    })
  );

  const regionsAvecTotaux = regions.map((region: Region) => ({
    ...region,
    nombreLieux: region.departements.reduce(toRegionTotalCount(departementsAvecTotaux), 0)
  }));
  return (
    <ClientLayout regions={regionsAvecTotaux} departements={departementsAvecTotaux}>
      {children}
    </ClientLayout>
  );
};

export default Layout;
