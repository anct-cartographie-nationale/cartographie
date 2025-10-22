import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  inclusionNumeriqueFetchApi,
  LIEU_LIST_FIELDS,
  LIEUX_ROUTE,
  type LieuxRouteOptions
} from '@/external-api/inclusion-numerique';
import { toLieuListItem } from '@/external-api/inclusion-numerique/transfer/toLieuListItem';
import { appendCollectivites } from '@/features/collectivites-territoriales/append-collectivites';
import { type Departement, departementMatchingSlug } from '@/features/collectivites-territoriales/departement';
import departements from '@/features/collectivites-territoriales/departements.json';
import { type Region, regionMatchingDepartement, regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { applyFilters } from '@/features/lieux-inclusion-numerique/apply-filters';
import { LieuxPage } from '@/features/lieux-inclusion-numerique/lieux.page';
import { filtersSchema } from '@/features/lieux-inclusion-numerique/validations';
import { asCount, countFromHeaders } from '@/libraries/api/options';
import { provide } from '@/libraries/injection';
import { hrefWithSearchParams, URL_SEARCH_PARAMS } from '@/libraries/next';
import { appPageTitle } from '@/libraries/utils';
import { pageSchema } from '@/libraries/utils/page.schema';

type PageProps = {
  params: Promise<{ region: string; departement: string }>;
  searchParams?: Promise<{ page: string }>;
};

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const slug: string = (await params).departement;
  const departement: Departement | undefined = departements.find(departementMatchingSlug(slug));

  if (!departement) return notFound();

  return {
    title: appPageTitle('Liste des lieux', departement.nom),
    description: `Consultez la liste de tous les lieux d'inclusion numérique du département ${departement.nom}.`
  };
};

export const generateStaticParams = () =>
  departements.map((departement: Departement) => {
    const region: Region | undefined = regions.find(regionMatchingDepartement(departement));
    if (!region) return null;

    return {
      region: region.slug,
      departement: departement.slug
    };
  });

const Page = async ({ params: paramsPromise, searchParams: searchParamsPromise }: PageProps) => {
  const [params, searchParams] = await Promise.all([paramsPromise, searchParamsPromise]);
  const urlSearchParams: URLSearchParams = new URLSearchParams(searchParams);
  provide(URL_SEARCH_PARAMS, urlSearchParams);

  const regionSlug: string = params.region;
  const departementSlug: string = params.departement;
  const curentPage = pageSchema.parse(searchParams?.page);
  const limit = 24;

  const region: Region | undefined = regions.find(regionMatchingSlug(regionSlug));
  const departement: Departement | undefined = departements.find(departementMatchingSlug(departementSlug));

  if (!region || !departement) return notFound();

  const filter = { code_insee: `like.${departement.code}%`, ...applyFilters(filtersSchema.parse(searchParams)) };

  const [lieux] = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
    paginate: { limit, offset: (curentPage - 1) * limit },
    select: [...LIEU_LIST_FIELDS, 'telephone'],
    filter,
    order: ['nom', 'asc']
  });

  const [, headers] = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, ...asCount<LieuxRouteOptions>({ filter }));

  return (
    <LieuxPage
      totalLieux={countFromHeaders(headers)}
      pageSize={limit}
      curentPage={curentPage}
      lieux={lieux.map((lieu) => toLieuListItem(new Date())(appendCollectivites(lieu)))}
      breadcrumbsItems={[
        { label: 'France', href: hrefWithSearchParams('/')(urlSearchParams, ['page']) },
        { label: region.nom, href: hrefWithSearchParams(`/${region.slug}`)(urlSearchParams, ['page']) },
        { label: departement.nom }
      ]}
      mapHref={hrefWithSearchParams(`/${region.slug}/${departement.slug}`)(urlSearchParams, ['page'])}
    />
  );
};

export default Page;
