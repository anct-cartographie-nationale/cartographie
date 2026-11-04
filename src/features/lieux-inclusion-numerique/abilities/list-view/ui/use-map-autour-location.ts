'use client';

import { useMemo } from 'react';
import { filter, map, withLatestFrom } from 'rxjs';
import { forgetUserMapCentre, isSameCentre, lastUserMapCentre$, map$, setZoom } from '@/libraries/map';
import { useTap } from '@/libraries/reactivity/Subscribe';
import { highlightCommune } from '@/shared/ui/highlight-decoupage-administratif';

const AUTOUR_ZOOM = 13;

const isDefined = <T>(value: T | undefined): value is T => value !== undefined;

export const useMapAutourLocation = ({ lat, lng, commune }: { lat: number; lng: number; commune?: string | undefined }) => {
  const mapToMoveToLocation$ = useMemo(
    () =>
      map$.pipe(
        filter(isDefined),
        withLatestFrom(lastUserMapCentre$),
        filter(([, lastUserCentre]) => !isSameCentre(lastUserCentre, { lat, lng })),
        map(([target]) => ({ target, center: [lng, lat] as [number, number], commune }))
      ),
    [lat, lng, commune]
  );

  useTap(mapToMoveToLocation$, ({ target, center, commune: communeToHighlight }) => {
    forgetUserMapCentre();
    setZoom(AUTOUR_ZOOM);
    target.flyTo({ center, zoom: AUTOUR_ZOOM, duration: 400 });
    if (communeToHighlight && target.isStyleLoaded()) highlightCommune(target, communeToHighlight);
  });
};
