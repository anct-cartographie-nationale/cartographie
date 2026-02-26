import { skipToken, useQuery } from '@tanstack/react-query';
import { useParams, useSearch } from '@tanstack/react-router';
import { type FC, useMemo } from 'react';
import { type Region, regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { LieuxPage } from '@/features/lieux-inclusion-numerique/lieux.page';
import { provide } from '@/libraries/injection';
import { hrefWithSearchParams, URL_SEARCH_PARAMS } from '@/libraries/next';
import { buildExportUrl, fetchRegionLieux } from '../api';
import { useBreadcrumbItems, useFilteredSearchParams } from '../hooks/use-filtered-search-params';

const PAGE_SIZE = 24;

export const Page: FC = () => {
  const { region: regionSlug } = useParams({ from: '/$region/lieux' });
  const search = useSearch({ from: '/$region/lieux' });
  const baseSearchParams = useMemo(() => new URLSearchParams(search), [search]);
  const searchParams = useFilteredSearchParams(baseSearchParams);
  const currentPage = search.page;

  provide(URL_SEARCH_PARAMS, searchParams);

  const region: Region | undefined = (regions as Region[]).find(regionMatchingSlug(regionSlug));

  const { data } = useQuery({
    queryKey: ['lieux', 'region', regionSlug, currentPage, searchParams.toString()],
    queryFn: region ? () => fetchRegionLieux(region.slug, currentPage, PAGE_SIZE, searchParams) : skipToken
  });

  const breadcrumbsItems = useBreadcrumbItems([
    { label: 'France', href: hrefWithSearchParams('/')(searchParams, ['page']) },
    { label: region?.nom ?? '' }
  ]);

  if (!region) {
    return <div>Région non trouvée</div>;
  }

  return (
    <LieuxPage
      totalLieux={data?.total ?? 0}
      pageSize={PAGE_SIZE}
      curentPage={currentPage}
      lieux={data?.lieux ?? []}
      breadcrumbsItems={breadcrumbsItems}
      mapHref={hrefWithSearchParams(`/${region.slug}`)(searchParams, ['page'])}
      exportHref={buildExportUrl(`/${region.slug}/lieux/exporter`, searchParams)}
    />
  );
};
