import { skipToken, useQuery } from '@tanstack/react-query';
import { useParams, useSearch } from '@tanstack/react-router';
import { type FC, useMemo } from 'react';
import {
  type Departement,
  departementMatchingSlug,
  departements,
  type Region,
  regionMatchingSlug,
  regions
} from '@/features/collectivites-territoriales';
import { LieuxPage } from '@/features/lieux-inclusion-numerique';
import { provide } from '@/libraries/injection';
import { hrefWithSearchParams, URL_SEARCH_PARAMS } from '@/libraries/next';
import { buildExportUrl, fetchDepartementLieux } from '../api';
import { useBreadcrumbItems, useFilteredSearchParams } from '../hooks/use-filtered-search-params';

const PAGE_SIZE = 24;

export const Page: FC = () => {
  const { region: regionSlug, departement: departementSlug } = useParams({ from: '/$region/$departement/lieux' });
  const search = useSearch({ from: '/$region/$departement/lieux' });
  const baseSearchParams = useMemo(() => new URLSearchParams(search), [search]);
  const searchParams = useFilteredSearchParams(baseSearchParams);
  const currentPage = search.page;

  provide(URL_SEARCH_PARAMS, searchParams);

  const region: Region | undefined = (regions as Region[]).find(regionMatchingSlug(regionSlug));
  const departement: Departement | undefined = departements.find(departementMatchingSlug(departementSlug));

  const { data } = useQuery({
    queryKey: ['lieux', 'departement', departement?.code, currentPage, PAGE_SIZE, searchParams.toString()],
    queryFn: departement ? () => fetchDepartementLieux(departement.code, currentPage, PAGE_SIZE, searchParams) : skipToken
  });

  const breadcrumbsItems = useBreadcrumbItems([
    { label: 'France', href: hrefWithSearchParams('/')(searchParams, ['page']) },
    { label: region?.nom ?? '', href: hrefWithSearchParams(`/${region?.slug}`)(searchParams, ['page']) },
    { label: departement?.nom ?? '' }
  ]);

  if (!region || !departement) {
    return <div>Page non trouvée</div>;
  }

  return (
    <LieuxPage
      totalLieux={data?.total ?? 0}
      pageSize={PAGE_SIZE}
      curentPage={currentPage}
      lieux={data?.lieux ?? []}
      breadcrumbsItems={breadcrumbsItems}
      mapHref={hrefWithSearchParams(`/${region.slug}/${departement.slug}`)(searchParams, ['page'])}
      exportHref={buildExportUrl(`/${region.slug}/${departement.slug}/lieux/exporter`, searchParams)}
    />
  );
};
