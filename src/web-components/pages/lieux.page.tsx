import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { type FC, useMemo } from 'react';
import { LieuxPage } from '@/features/lieux-inclusion-numerique';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { useFilteredSearchParams } from '@/shared/hooks';
import { buildExportUrl, fetchAllLieux } from '../api';

const PAGE_SIZE = 24;

export const Page: FC = () => {
  const search = useSearch({ from: '/lieux' });
  const baseSearchParams = useMemo(() => new URLSearchParams(search), [search]);
  const searchParams = useFilteredSearchParams(baseSearchParams);
  const currentPage = search.page;

  const { data } = useQuery({
    queryKey: ['lieux', 'all', currentPage, searchParams.toString()],
    queryFn: () => fetchAllLieux(currentPage, PAGE_SIZE, searchParams)
  });

  return (
    <LieuxPage
      totalLieux={data?.totalLieux ?? 0}
      pageSize={PAGE_SIZE}
      searchParams={searchParams}
      currentPage={currentPage}
      lieux={data?.lieux ?? []}
      mapHref={hrefWithSearchParams('/')(searchParams, ['page'])}
      exportHref={buildExportUrl('/lieux/exporter', searchParams)}
    />
  );
};
