import type { Departement } from '@/features/collectivites-territoriales/departement';
import { type Region, regionMatchingDepartement } from '@/features/collectivites-territoriales/region';
import { hrefWithSearchParams } from '@/libraries/next';
import { Link, useSearchParams } from '@/libraries/next-shim';
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
  const urlSearchParams = useSearchParams();
  const searchParams: URLSearchParams = new URLSearchParams(urlSearchParams);

  return departements.map(({ code, localisation, slug, nom, nombreLieux }) => (
    <Link
      href={hrefWithSearchParams(`/${regions.find(regionMatchingDepartement({ code }))?.slug}/${slug}`)(searchParams, ['page'])}
      key={code}
    >
      <ClusterMarker title={`Département ${nom}`} isMuted={!selectedRegion?.departements.includes(code)} {...localisation}>
        {nombreLieux}
      </ClusterMarker>
    </Link>
  ));
};
