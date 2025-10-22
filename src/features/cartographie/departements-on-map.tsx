import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { Departement } from '@/features/collectivites-territoriales/departement';
import { type Region, regionMatchingDepartement } from '@/features/collectivites-territoriales/region';
import { hrefWithSearchParams } from '@/libraries/next';
import { ClusterMarker } from './markers/cluster.marker';

export const DepartementsOnMap = ({
  regions,
  departements,
  selectedRegion
}: {
  regions: (Region & { nombreLieux: number })[];
  departements: (Departement & { nombreLieux: number })[];
  selectedRegion: Region | undefined;
}) => {
  const searchParams = useSearchParams();
  const urlSearchParams: URLSearchParams = new URLSearchParams(searchParams);

  return departements.map(({ code, localisation, slug, nom, nombreLieux }) => (
    <Link
      href={hrefWithSearchParams(`/${regions.find(regionMatchingDepartement({ code }))?.slug}/${slug}`)(urlSearchParams)}
      key={code}
    >
      <ClusterMarker title={`Département ${nom}`} isMuted={!selectedRegion?.departements.includes(code)} {...localisation}>
        {nombreLieux}
      </ClusterMarker>
    </Link>
  ));
};
