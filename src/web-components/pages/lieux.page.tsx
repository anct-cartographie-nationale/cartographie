import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { type FC, useMemo } from 'react';
import { LieuxPage } from '@/features/lieux-inclusion-numerique';
import { provide } from '@/libraries/injection';
import { hrefWithSearchParams, URL_SEARCH_PARAMS } from '@/libraries/nextjs';
import { useFilteredSearchParams } from '@/shared/hooks';
import { buildExportUrl, fetchAllLieux } from '../api';

const PAGE_SIZE = 24;

export const Page: FC = () => {
  const search = useSearch({ from: '/lieux' });
  const baseSearchParams = useMemo(() => new URLSearchParams(search), [search]);
  const searchParams = useFilteredSearchParams(baseSearchParams);
  const currentPage = search.page;

  provide(URL_SEARCH_PARAMS, searchParams);

  const { data } = useQuery({
    queryKey: ['lieux', 'all', currentPage, searchParams.toString()],
    queryFn: () => fetchAllLieux(currentPage, PAGE_SIZE, searchParams)
  });

  return (
    <LieuxPage
      totalLieux={data?.totalLieux ?? 0}
      pageSize={PAGE_SIZE}
      currentPage={currentPage}
      lieux={data?.lieux ?? []}
      mapHref={hrefWithSearchParams('/')(searchParams, ['page'])}
      exportHref={buildExportUrl('/lieux/exporter', searchParams)}
    />
  );
};
