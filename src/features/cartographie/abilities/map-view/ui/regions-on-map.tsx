import { MatomoAction, MatomoCategory, trackEvent } from '@/libraries/analytics';
import type { Region } from '@/libraries/collectivites';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { Link, useSearchParams } from '@/libraries/nextjs/shim';
import { ClusterMarker } from '@/libraries/ui/map/markers';

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
      prefetch={false}
      aria-label={`${nom} : ${nombreLieux} lieux`}
      onClick={() => trackEvent({ category: MatomoCategory.NAVIGATION, action: MatomoAction.REGION_SELECT, name: nom })}
    >
      <ClusterMarker title={`Région ${nom}`} isMuted={selectedRegion != null && selectedRegion.code !== code} {...localisation}>
        {nombreLieux}
      </ClusterMarker>
    </Link>
  ));
};
