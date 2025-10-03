import Link from 'next/link';
import type { Region } from '@/features/collectivites-territoriales/region';
import { ClusterMarker } from './markers/cluster.marker';

export const RegionsOnMap = ({
  regions,
  selectedRegion
}: {
  regions: (Region & { nombreLieux: number })[];
  selectedRegion: Region | undefined;
}) =>
  regions.map(({ code, localisation, slug, nom, nombreLieux }) => (
    <Link href={`/${slug}`} key={code}>
      <ClusterMarker title={`Région ${nom}`} isMuted={selectedRegion != null && selectedRegion.code !== code} {...localisation}>
        {nombreLieux}
      </ClusterMarker>
    </Link>
  ));
