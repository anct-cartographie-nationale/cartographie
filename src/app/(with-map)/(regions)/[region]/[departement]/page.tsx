import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  inclusionNumeriqueFetchApi,
  LIEU_LIST_FIELDS,
  LIEUX_ROUTE,
  type LieuxRouteOptions
} from '@/external-api/inclusion-numerique';
import { toLieuListItem } from '@/external-api/inclusion-numerique/transfer/to-lieu-list-item';
import { appendCollectivites } from '@/features/collectivites-territoriales/append-collectivites';
import { type Departement, departementMatchingSlug } from '@/features/collectivites-territoriales/departement';
import departements from '@/features/collectivites-territoriales/departements.json';
import { type Region, regionMatchingDepartement, regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { applyFilters } from '@/features/lieux-inclusion-numerique/apply-filters';
import { DepartementLieuxPage } from '@/features/lieux-inclusion-numerique/departement-lieux.page';
import { filtersSchema } from '@/features/lieux-inclusion-numerique/validations';
import { asCount, countFromHeaders } from '@/libraries/api/options';
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

const Page = async ({ params: paramsPromise, searchParams: searchParamsPromise }: PageProps) => {
  const [params, searchParams] = await Promise.all([paramsPromise, searchParamsPromise]);

  const regionSlug: string = params.region;
  const departementSlug: string = params.departement;
  const curentPage = pageSchema.parse(searchParams?.page);
  const limit = 10;

  const region: Region | undefined = regions.find(regionMatchingSlug(regionSlug));
  const departement: Departement | undefined = departements.find(departementMatchingSlug(departementSlug));

  if (!region || !departement) return notFound();

  const filter = { 'adresse->>code_insee': `like.${departement.code}%`, ...applyFilters(filtersSchema.parse(searchParams)) };

  const [lieux] = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
    paginate: { limit, offset: (curentPage - 1) * limit },
    select: LIEU_LIST_FIELDS,
    filter,
    order: ['nom', 'asc']
  });

  const [, headers] = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, ...asCount<LieuxRouteOptions>({ filter }));

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
};

export default Page;
