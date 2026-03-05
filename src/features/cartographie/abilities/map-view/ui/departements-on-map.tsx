import { MatomoAction, MatomoCategory, trackEvent } from '@/libraries/analytics';
import type { Departement } from '@/libraries/collectivites';
import { type Region, regionMatchingDepartement } from '@/libraries/collectivites';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { Link, useSearchParams } from '@/libraries/nextjs/shim';
import { ClusterMarker } from '@/libraries/ui/map/markers';

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
      onClick={() => trackEvent({ category: MatomoCategory.NAVIGATION, action: MatomoAction.DEPARTMENT_SELECT, name: nom })}
    >
      <ClusterMarker title={`Département ${nom}`} isMuted={!selectedRegion?.departements.includes(code)} {...localisation}>
        {nombreLieux}
      </ClusterMarker>
    </Link>
  ));
};
