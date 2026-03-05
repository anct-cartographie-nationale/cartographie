import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  appendCollectivites,
  type Departement,
  departementMatchingSlug,
  departements,
  type Region,
  regionMatchingDepartement,
  regions,
  withDepartement,
  withRegion
} from '@/features/collectivites-territoriales';
import { DepartementLieuxPage } from '@/features/lieux-inclusion-numerique';
import { asCount, countFromHeaders } from '@/libraries/api/options';
import {
  applyFilters,
  filtersSchema,
  inclusionNumeriqueFetchApi,
  LIEU_LIST_FIELDS,
  LIEUX_ROUTE,
  type LieuxRouteOptions
} from '@/libraries/inclusion-numerique-api';
import { toLieuListItem } from '@/libraries/inclusion-numerique-api/transfer/to-lieu-list-item';
import { page, withSearchParams } from '@/libraries/next/page';
import { appPageTitle, pageSchema } from '@/libraries/utils';

type PageProps = {
  params: Promise<{ region: string; departement: string }>;
  searchParams?: Promise<{ page: string }>;
};

export const generateStaticParams = () =>
  departements.map((departement: Departement) => {
    const region: Region | undefined = regions.find(regionMatchingDepartement(departement));
    return region ? { region: region.slug, departement: departement.slug } : null;
  });

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const departement: Departement | undefined = departements.find(departementMatchingSlug((await params).departement));
  return departement
    ? {
        title: appPageTitle(departement.nom),
        description: `Consultez les lieux d'inclusion numérique du département ${departement.nom}.`
      }
    : notFound();
};

export default page
  .withAll(withRegion(), withDepartement(), withSearchParams<{ page: string }>())
  .render(async ({ region, departement, searchParams }) => {
    const curentPage = pageSchema.parse(searchParams?.page);
    const limit = 10;

    const filter = { 'adresse->>code_insee': `like.${departement.code}%`, ...applyFilters(filtersSchema.parse(searchParams)) };

    const [[lieux], [, headers]] = await Promise.all([
      inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
        paginate: { limit, offset: (curentPage - 1) * limit },
        select: LIEU_LIST_FIELDS,
        filter,
        order: ['nom', 'asc']
      }),
      inclusionNumeriqueFetchApi(LIEUX_ROUTE, ...asCount<LieuxRouteOptions>({ filter }))
    ]);

    return (
      <DepartementLieuxPage
        totalLieux={countFromHeaders(headers)}
        pageSize={limit}
        curentPage={curentPage}
        lieux={lieux.map((lieu) => toLieuListItem(new Date())(appendCollectivites(lieu)))}
        region={region}
        departement={departement}
      />
    );
  });
