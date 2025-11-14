import type { Metadata } from 'next';
import {
  inclusionNumeriqueFetchApi,
  LIEU_LIST_FIELDS,
  LIEUX_ROUTE,
  type LieuxRouteOptions
} from '@/external-api/inclusion-numerique';
import { toLieuListItem } from '@/external-api/inclusion-numerique/transfer/to-lieu-list-item';
import { appendCollectivites } from '@/features/collectivites-territoriales/append-collectivites';
import { applyFilters } from '@/features/lieux-inclusion-numerique/apply-filters';
import { LieuxPage } from '@/features/lieux-inclusion-numerique/lieux.page';
import { filtersSchema } from '@/features/lieux-inclusion-numerique/validations';
import { asCount, countFromHeaders } from '@/libraries/api/options';
import { provide } from '@/libraries/injection';
import { hrefWithSearchParams, URL_SEARCH_PARAMS } from '@/libraries/next';
import { appPageTitle } from '@/libraries/utils';
import { pageSchema } from '@/libraries/utils/page.schema';

type PageProps = {
  searchParams?: Promise<{ page: string }>;
};

export const generateMetadata = async (): Promise<Metadata> => ({
  title: appPageTitle('Liste des lieux', 'France'),
  description: "Consultez la liste de tous les lieux d'inclusion numérique de France."
});

const Page = async ({ searchParams: searchParamsPromise }: PageProps) => {
  const searchParams = await searchParamsPromise;
  const urlSearchParams: URLSearchParams = new URLSearchParams(searchParams);
  provide(URL_SEARCH_PARAMS, urlSearchParams);

  const curentPage: number = pageSchema.parse(searchParams?.page);
  const limit = 24;
  const filter = applyFilters(filtersSchema.parse(searchParams));

  const [, headers] = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, ...asCount<LieuxRouteOptions>({ filter }));

  const [lieux] = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
    paginate: { limit, offset: (curentPage - 1) * limit },
    select: [...LIEU_LIST_FIELDS, 'telephone'],
    filter,
    order: ['nom', 'asc']
  });

  return (
    <LieuxPage
      totalLieux={countFromHeaders(headers)}
      pageSize={limit}
      curentPage={curentPage}
      lieux={lieux.map((lieu) => toLieuListItem(new Date())(appendCollectivites(lieu)))}
      mapHref={hrefWithSearchParams('/')(urlSearchParams, ['page'])}
      exportHref={hrefWithSearchParams(`/lieux/exporter`)(urlSearchParams, ['page'])}
    />
  );
};

export default Page;
