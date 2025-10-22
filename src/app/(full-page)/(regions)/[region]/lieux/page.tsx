import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  codeInseeStartWithFilterTemplate,
  inclusionNumeriqueFetchApi,
  LIEU_LIST_FIELDS,
  LIEUX_ROUTE,
  type LieuxRouteOptions
} from '@/external-api/inclusion-numerique';
import { toLieuListItem } from '@/external-api/inclusion-numerique/transfer/toLieuListItem';
import { appendCollectivites } from '@/features/collectivites-territoriales/append-collectivites';
import { type Region, regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { applyFilters } from '@/features/lieux-inclusion-numerique/apply-filters';
import { LieuxPage } from '@/features/lieux-inclusion-numerique/lieux.page';
import { filtersSchema } from '@/features/lieux-inclusion-numerique/validations';
import { asCount, combineOrFilters, countFromHeaders, filterUnion } from '@/libraries/api/options';
import { provide } from '@/libraries/injection';
import { hrefWithSearchParams, URL_SEARCH_PARAMS } from '@/libraries/next';
import { appPageTitle } from '@/libraries/utils';
import { pageSchema } from '@/libraries/utils/page.schema';

type PageProps = {
  params: Promise<{ region: string }>;
  searchParams?: Promise<{ page: string }>;
};

export const generateStaticParams = async () => regions.map(({ slug }: Region) => ({ region: slug }));

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const slug: string = (await params).region;
  const region: Region | undefined = regions.find(regionMatchingSlug(slug));

  if (!region) return notFound();

  return {
    title: appPageTitle('Liste des lieux', region.nom),
    description: `Consultez la liste de tous les lieux d'inclusion numérique de la région ${region.nom}.`
  };
};

const Page = async ({ params: paramsPromise, searchParams: searchParamsPromise }: PageProps) => {
  const [params, searchParams] = await Promise.all([paramsPromise, searchParamsPromise]);
  const urlSearchParams: URLSearchParams = new URLSearchParams(searchParams);
  provide(URL_SEARCH_PARAMS, urlSearchParams);

  const region: Region | undefined = regions.find(regionMatchingSlug(params.region));
  const curentPage = pageSchema.parse(searchParams?.page);
  const limit = 24;

  if (!region) return notFound();

  const filter = {
    and: combineOrFilters(
      filterUnion(region.departements)(codeInseeStartWithFilterTemplate),
      applyFilters(filtersSchema.parse(searchParams))
    )
  };

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
        { label: region.nom }
      ]}
      mapHref={hrefWithSearchParams(`/${region.slug}`)(urlSearchParams, ['page'])}
    />
  );
};

export default Page;
