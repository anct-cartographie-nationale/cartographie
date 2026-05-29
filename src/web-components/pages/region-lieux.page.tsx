import { skipToken, useQuery } from '@tanstack/react-query';
import { useParams, useSearch } from '@tanstack/react-router';
import { type FC, useMemo } from 'react';
import { LieuxPage } from '@/features/lieux-inclusion-numerique';
import { type Region, regionMatchingSlug, regions } from '@/libraries/collectivites';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { useFilteredSearchParams } from '@/shared/hooks';
import { buildExportUrl, fetchRegionLieux } from '../api';
import { useBreadcrumbItems } from '../breadcrumb/use-breadcrumb-items';

const PAGE_SIZE = 24;

export const Page: FC = () => {
  const { region: regionSlug } = useParams({ from: '/$region/lieux' });
  const search = useSearch({ from: '/$region/lieux' });
  const baseSearchParams = useMemo(() => new URLSearchParams(search), [search]);
  const searchParams = useFilteredSearchParams(baseSearchParams);
  const currentPage = search.page;

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
      totalLieux={data?.totalLieux ?? 0}
      pageSize={PAGE_SIZE}
      searchParams={searchParams}
      currentPage={currentPage}
      lieux={data?.lieux ?? []}
      breadcrumbsItems={breadcrumbsItems}
      mapHref={hrefWithSearchParams(`/${region.slug}`)(searchParams, ['page'])}
      exportHref={buildExportUrl(`/${region.slug}/lieux/exporter`, searchParams)}
    />
  );
};
