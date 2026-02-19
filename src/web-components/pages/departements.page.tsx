import { useQuery } from '@tanstack/react-query';
import { useParams, useSearch } from '@tanstack/react-router';
import { type FC, useMemo } from 'react';
import { DepartementsPage } from '@/features/cartographie/departements.page';
import departements from '@/features/collectivites-territoriales/departements.json';
import { matchingDepartementsFrom, type Region, regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { fetchRegionTotalLieux } from '../api';
import { useFilteredSearchParams } from '../hooks/use-filtered-search-params';

export const Page: FC = () => {
  const { region: regionSlug } = useParams({ from: '/with-map/$region' });
  const search = useSearch({ strict: false }) as Record<string, string>;
  const baseSearchParams = useMemo(() => new URLSearchParams(search), [search]);
  const searchParams = useFilteredSearchParams(baseSearchParams);

  const region = (regions as Region[]).find(regionMatchingSlug(regionSlug));

  const { data: totalLieux = 0 } = useQuery({
    queryKey: ['stats', 'region', regionSlug, searchParams.toString()],
    queryFn: () => fetchRegionTotalLieux(regionSlug, searchParams),
    enabled: !!region
  });

  if (!region) {
    return <div>Région non trouvée</div>;
  }

  return (
    <DepartementsPage
      totalLieux={totalLieux}
      region={region}
      departements={departements.filter(matchingDepartementsFrom(region))}
    />
  );
};
