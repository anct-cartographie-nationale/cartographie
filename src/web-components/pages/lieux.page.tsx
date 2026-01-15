import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import type { FC } from 'react';
import { LieuxPage } from '@/features/lieux-inclusion-numerique/lieux.page';
import { provide } from '@/libraries/injection';
import { hrefWithSearchParams, URL_SEARCH_PARAMS } from '@/libraries/next';
import { fetchAllLieux } from '../api';

const PAGE_SIZE = 24;

export const Page: FC = () => {
  const search: { page?: number } = useSearch({ from: '/lieux' });
  const currentPage = Number(search.page) || 1;

  const searchParams = new URLSearchParams(search as Record<string, string>);
  provide(URL_SEARCH_PARAMS, searchParams);

  const { data } = useQuery({
    queryKey: ['lieux', 'all', currentPage],
    queryFn: () => fetchAllLieux(currentPage, PAGE_SIZE)
  });

  return (
    <LieuxPage
      totalLieux={data?.total ?? 0}
      pageSize={PAGE_SIZE}
      curentPage={currentPage}
      lieux={data?.lieux ?? []}
      mapHref={hrefWithSearchParams('/')(searchParams, ['page'])}
      exportHref={hrefWithSearchParams('/lieux/exporter')(searchParams, ['page'])}
    />
  );
};
