import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { Region } from '@/features/collectivites-territoriales/region';
import { hrefWithSearchParams } from '@/libraries/next';
import { ClusterMarker } from './markers/cluster.marker';

export const RegionsOnMap = ({
  regions,
  selectedRegion
}: {
  regions: (Region & { nombreLieux: number })[];
  selectedRegion: Region | undefined;
}) => {
  const searchParams = useSearchParams();
  const urlSearchParams: URLSearchParams = new URLSearchParams(searchParams);

  return regions.map(({ code, localisation, slug, nom, nombreLieux }) => (
    <Link href={hrefWithSearchParams(`/${slug}`)(urlSearchParams)} key={code}>
      <ClusterMarker title={`Région ${nom}`} isMuted={selectedRegion != null && selectedRegion.code !== code} {...localisation}>
        {nombreLieux}
      </ClusterMarker>
    </Link>
  ));
};
