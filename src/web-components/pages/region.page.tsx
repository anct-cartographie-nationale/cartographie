import { useParams } from '@tanstack/react-router';
import type { FC } from 'react';
import { DepartementsPage } from '@/features/cartographie/departements.page';
import departements from '@/features/collectivites-territoriales/departements.json';
import { matchingDepartementsFrom, type Region, regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';

export const RegionPage: FC = () => {
  const { region: regionSlug } = useParams({ from: '/$region' });
  const region = (regions as Region[]).find(regionMatchingSlug(regionSlug));

  if (!region) {
    return <div>Région non trouvée</div>;
  }

  return (
    <DepartementsPage totalLieux={0} region={region} departements={departements.filter(matchingDepartementsFrom(region))} />
  );
};
