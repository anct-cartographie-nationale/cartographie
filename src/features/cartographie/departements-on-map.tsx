import Link from 'next/link';
import type { Departement } from '@/features/collectivites-territoriales/departement';
import { type Region, regionMatchingDepartement } from '@/features/collectivites-territoriales/region';
import { ClusterMarker } from './markers/cluster.marker';

export const DepartementsOnMap = ({
  regions,
  departements,
  selectedRegion
}: {
  regions: (Region & { nombreLieux: number })[];
  departements: (Departement & { nombreLieux: number })[];
  selectedRegion: Region | undefined;
}) =>
  departements.map(({ code, localisation, slug, nom, nombreLieux }) => (
    <Link href={`/${regions.find(regionMatchingDepartement({ code }))?.slug}/${slug}`} key={code}>
      <ClusterMarker title={`Département ${nom}`} isMuted={!selectedRegion?.departements.includes(code)} {...localisation}>
        {nombreLieux}
      </ClusterMarker>
    </Link>
  ));
