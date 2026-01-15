import { skipToken, useQuery } from '@tanstack/react-query';
import { useParams, useSearch } from '@tanstack/react-router';
import type { FC } from 'react';
import { type Region, regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { LieuxPage } from '@/features/lieux-inclusion-numerique/lieux.page';
import { provide } from '@/libraries/injection';
import { hrefWithSearchParams, URL_SEARCH_PARAMS } from '@/libraries/next';
import { fetchRegionLieux } from '../api';

const PAGE_SIZE = 24;

export const Page: FC = () => {
  const { region: regionSlug } = useParams({ from: '/$region/lieux' });
  const search: { page?: number } = useSearch({ from: '/$region/lieux' });
  const currentPage = Number(search.page) || 1;

  const searchParams = new URLSearchParams(search as Record<string, string>);
  provide(URL_SEARCH_PARAMS, searchParams);

  const region: Region | undefined = (regions as Region[]).find(regionMatchingSlug(regionSlug));

  const { data } = useQuery({
    queryKey: ['lieux', 'region', regionSlug, currentPage],
    queryFn: region ? () => fetchRegionLieux(region.slug, currentPage, PAGE_SIZE) : skipToken
  });

  if (!region) {
    return <div>Région non trouvée</div>;
  }

  return (
    <LieuxPage
      totalLieux={data?.total ?? 0}
      pageSize={PAGE_SIZE}
      curentPage={currentPage}
      lieux={data?.lieux ?? []}
      breadcrumbsItems={[{ label: 'France', href: hrefWithSearchParams('/')(searchParams, ['page']) }, { label: region.nom }]}
      mapHref={hrefWithSearchParams(`/${region.slug}`)(searchParams, ['page'])}
      exportHref={hrefWithSearchParams(`/${region.slug}/lieux/exporter`)(searchParams, ['page'])}
    />
  );
};
