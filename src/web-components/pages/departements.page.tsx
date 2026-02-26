import { useQuery } from '@tanstack/react-query';
import { useParams, useSearch } from '@tanstack/react-router';
import { type FC, useMemo } from 'react';
import { DepartementsPage } from '@/features/cartographie/departements.page';
import departements from '@/features/collectivites-territoriales/departements.json';
import { filterDepartementsByTerritoire } from '@/features/collectivites-territoriales/filter-by-territoire';
import { matchingDepartementsFrom, type Region, regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { inject, TERRITOIRE_FILTER } from '@/libraries/injection';
import { hrefWithSearchParams } from '@/libraries/next';
import { fetchRegionTotalLieux } from '../api';
import { useBreadcrumbItems, useFilteredSearchParams } from '../hooks/use-filtered-search-params';

export const Page: FC = () => {
  const { region: regionSlug } = useParams({ from: '/with-map/$region' });
  const search = useSearch({ strict: false }) as Record<string, string>;
  const baseSearchParams = useMemo(() => new URLSearchParams(search), [search]);
  const searchParams = useFilteredSearchParams(baseSearchParams);
  const territoireFilter = inject(TERRITOIRE_FILTER);

  const region = (regions as Region[]).find(regionMatchingSlug(regionSlug));

  const { data: totalLieux = 0 } = useQuery({
    queryKey: ['stats', 'region', regionSlug, searchParams.toString()],
    queryFn: () => fetchRegionTotalLieux(regionSlug, searchParams),
    enabled: !!region
  });

  const breadcrumbsItems = useBreadcrumbItems([
    { label: 'France', href: hrefWithSearchParams('/')(searchParams) },
    { label: region?.nom ?? '' }
  ]);

  if (!region) {
    return <div>Région non trouvée</div>;
  }

  const regionDepartements = departements.filter(matchingDepartementsFrom(region));
  const territoireFilteredDepartements = filterDepartementsByTerritoire({
    territoire_type: territoireFilter.type,
    territoires: territoireFilter.codes
  });
  const filteredDepartements = regionDepartements.filter((d) =>
    territoireFilteredDepartements.some((td) => td.code === d.code)
  );

  return (
    <DepartementsPage
      totalLieux={totalLieux}
      region={region}
      departements={filteredDepartements}
      breadcrumbsItems={breadcrumbsItems}
    />
  );
};
