import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { type FC, useMemo } from 'react';
import { LieuxPage } from '@/features/lieux-inclusion-numerique/lieux.page';
import { provide } from '@/libraries/injection';
import { hrefWithSearchParams, URL_SEARCH_PARAMS } from '@/libraries/next';
import { buildExportUrl, fetchAllLieux } from '../api';

const PAGE_SIZE = 24;

export const Page: FC = () => {
  const search = useSearch({ from: '/lieux' });
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);
  const currentPage = search.page;

  provide(URL_SEARCH_PARAMS, searchParams);

  const { data } = useQuery({
    queryKey: ['lieux', 'all', currentPage, searchParams.toString()],
    queryFn: () => fetchAllLieux(currentPage, PAGE_SIZE, searchParams)
  });

  return (
    <LieuxPage
      totalLieux={data?.total ?? 0}
      pageSize={PAGE_SIZE}
      curentPage={currentPage}
      lieux={data?.lieux ?? []}
      mapHref={hrefWithSearchParams('/')(searchParams, ['page'])}
      exportHref={buildExportUrl('/lieux/exporter', searchParams)}
    />
  );
};
