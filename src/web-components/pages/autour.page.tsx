import { Page as toPage, PageSize as toPageSize } from '@arckit/resultset';
import { skipToken, useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { type FC, useMemo } from 'react';
import { autourBreadcrumbs, LieuxAutourPage } from '@/features/lieux-inclusion-numerique';
import { autourSchema, withoutAutourParams } from '@/libraries/inclusion-numerique-api/filters/autour';
import { useFilteredSearchParams } from '@/shared/hooks';
import { fetchLieuxAutour } from '../api';
import { useBreadcrumbItems } from '../breadcrumb/use-breadcrumb-items';

const PAGE_SIZE = 10;

export const Page: FC = () => {
  const search = useSearch({ from: '/with-map/autour' });
  const baseSearchParams = useMemo(() => new URLSearchParams(search as Record<string, string>), [search]);
  const searchParams = useFilteredSearchParams(baseSearchParams);
  const currentPage = search.page;
  const autour = autourSchema.safeParse(Object.fromEntries(baseSearchParams)).data;

  const { data } = useQuery({
    queryKey: ['lieux', 'autour', currentPage, searchParams.toString()],
    queryFn: autour ? () => fetchLieuxAutour(currentPage, PAGE_SIZE, searchParams) : skipToken
  });

  const filters = withoutAutourParams(searchParams);
  filters.delete('page');
  const breadcrumbsItems = useBreadcrumbItems(autour ? autourBreadcrumbs(autour, filters) : []);

  if (!autour) {
    return <div>Page non trouvée</div>;
  }

  return (
    <LieuxAutourPage
      paginated={{
        items: data?.lieux ?? [],
        totalItems: data?.totalLieux ?? 0,
        currentPage: toPage(currentPage),
        pageSize: toPageSize(PAGE_SIZE)
      }}
      autour={autour}
      breadcrumbsItems={breadcrumbsItems}
    />
  );
};
