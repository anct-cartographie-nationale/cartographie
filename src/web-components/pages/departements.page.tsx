import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import type { FC } from 'react';
import { DepartementsPage } from '@/features/cartographie/departements.page';
import departements from '@/features/collectivites-territoriales/departements.json';
import { matchingDepartementsFrom, type Region, regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { fetchRegionTotalLieux } from '../api';

export const Page: FC = () => {
  const { region: regionSlug } = useParams({ from: '/$region' });
  const region = (regions as Region[]).find(regionMatchingSlug(regionSlug));

  const { data: totalLieux = 0 } = useQuery({
    queryKey: ['stats', 'region', regionSlug],
    queryFn: () => fetchRegionTotalLieux(regionSlug),
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
