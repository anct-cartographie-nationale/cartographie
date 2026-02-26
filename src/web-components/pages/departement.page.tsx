import { skipToken, useQuery } from '@tanstack/react-query';
import { useParams, useSearch } from '@tanstack/react-router';
import { type FC, useMemo } from 'react';
import { type Departement, departementMatchingSlug } from '@/features/collectivites-territoriales/departement';
import departements from '@/features/collectivites-territoriales/departements.json';
import { type Region, regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { DepartementLieuxPage } from '@/features/lieux-inclusion-numerique/departement-lieux.page';
import { hrefWithSearchParams } from '@/libraries/next';
import { buildExportUrl, fetchDepartementLieux } from '../api';
import { useBreadcrumbItems, useFilteredSearchParams } from '../hooks/use-filtered-search-params';

const PAGE_SIZE = 10;

export const Page: FC = () => {
  const { region: regionSlug, departement: departementSlug } = useParams({ from: '/with-map/$region/$departement' });
  const search = useSearch({ from: '/with-map/$region/$departement' });
  const baseSearchParams = useMemo(() => new URLSearchParams(search), [search]);
  const searchParams = useFilteredSearchParams(baseSearchParams);
  const currentPage = search.page;

  const region: Region | undefined = (regions as Region[]).find(regionMatchingSlug(regionSlug));
  const departement: Departement | undefined = departements.find(departementMatchingSlug(departementSlug));

  const { data } = useQuery({
    queryKey: ['lieux', 'departement', departement?.code, currentPage, searchParams.toString()],
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
    <DepartementLieuxPage
      totalLieux={data?.total ?? 0}
      pageSize={PAGE_SIZE}
      curentPage={currentPage}
      lieux={data?.lieux ?? []}
      region={region}
      departement={departement}
      breadcrumbsItems={breadcrumbsItems}
      exportHref={buildExportUrl(`/${region.slug}/${departement.slug}/lieux/exporter`, searchParams)}
    />
  );
};
