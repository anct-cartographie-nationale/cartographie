import type { Metadata } from 'next';
import { appendCollectivites } from '@/features/collectivites-territoriales';
import { LieuxPage } from '@/features/lieux-inclusion-numerique';
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
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { page, withSearchParams, withUrlSearchParams } from '@/libraries/nextjs/page';
import { appPageTitle, pageSchema } from '@/libraries/utils';

export const generateMetadata = async (): Promise<Metadata> => ({
  title: appPageTitle('Liste des lieux', 'France'),
  description: "Consultez la liste de tous les lieux d'inclusion numérique de France."
});

export default page
  .withAll(withSearchParams<{ page: string }>(), withUrlSearchParams())
  .render(async ({ searchParams, urlSearchParams }) => {
    const curentPage: number = pageSchema.parse(searchParams.page);
    const limit = 24;
    const filter = applyFilters(filtersSchema.parse(searchParams));

    const [[, headers], [lieux]] = await Promise.all([
      inclusionNumeriqueFetchApi(LIEUX_ROUTE, ...asCount<LieuxRouteOptions>({ filter })),
      inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
        paginate: { limit, offset: (curentPage - 1) * limit },
        select: [...LIEU_LIST_FIELDS, 'telephone'],
        filter,
        order: ['nom', 'asc']
      })
    ]);

    return (
      <LieuxPage
        totalLieux={countFromHeaders(headers)}
        pageSize={limit}
        curentPage={curentPage}
        lieux={lieux.map((lieu) => toLieuListItem(new Date())(appendCollectivites(lieu)))}
        mapHref={hrefWithSearchParams('/')(urlSearchParams, ['page'])}
        exportHref={hrefWithSearchParams('/lieux/exporter')(urlSearchParams, ['page'])}
      />
    );
  });
