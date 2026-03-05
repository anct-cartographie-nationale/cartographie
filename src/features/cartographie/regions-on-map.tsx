import type { Region } from '@/features/collectivites-territoriales/region';
import { MatomoAction, MatomoCategory, trackEvent } from '@/libraries/analytics';
import { hrefWithSearchParams } from '@/libraries/next';
import { Link, useSearchParams } from '@/libraries/next-shim';
import { ClusterMarker } from './markers/cluster.marker';

export const RegionsOnMap = ({
  regions,
  selectedRegion
}: {
  regions: (Region & { nombreLieux: number })[];
  selectedRegion: Region | undefined;
}) => {
  const urlSearchParams = useSearchParams();
  const searchParams: URLSearchParams = new URLSearchParams(urlSearchParams);

  return regions.map(({ code, localisation, slug, nom, nombreLieux }) => (
    <Link
      href={hrefWithSearchParams(`/${slug}`)(searchParams, ['page'])}
      key={code}
      onClick={() => trackEvent({ category: MatomoCategory.NAVIGATION, action: MatomoAction.REGION_SELECT, name: nom })}
    >
      <ClusterMarker title={`Région ${nom}`} isMuted={selectedRegion != null && selectedRegion.code !== code} {...localisation}>
        {nombreLieux}
      </ClusterMarker>
    </Link>
  ));
};
