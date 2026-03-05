import { useQuery } from '@tanstack/react-query';
import { useParams, useSearch } from '@tanstack/react-router';
import { type FC, useMemo } from 'react';
import { DepartementsPage } from '@/features/cartographie';
import {
  departements,
  filterDepartementsByTerritoire,
  matchingDepartementsFrom,
  type Region,
  regionMatchingSlug,
  regions
} from '@/libraries/collectivites';
import { inject } from '@/libraries/injection';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { useFilteredSearchParams } from '@/shared/hooks';
import { TERRITOIRE_FILTER } from '@/shared/injection';
import { fetchRegionTotalLieux } from '../api';
import { useBreadcrumbItems } from '../breadcrumb/use-breadcrumb-items';

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
