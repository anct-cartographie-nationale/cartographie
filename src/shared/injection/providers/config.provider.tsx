'use client';

import { type FC, type PropsWithChildren, Suspense } from 'react';
import { NAVBAR_CONFIG } from '@/features/brand/injection';
import { provide } from '@/libraries/injection';
import { invalidateMapLocationIfChanged, THEME_COLORS } from '@/libraries/map';
import { useSearchParams } from '@/libraries/nextjs/shim';
import { getThemeColors } from '@/shared/ui';
import { API_BASE_URL } from '../keys/api-base-url.key';
import { MAP_CONFIG } from '../keys/map-config.key';
import { mapPositionSchema } from '../keys/map-position.schema';
import { TERRITOIRE_FILTER } from '../keys/territoire-filter.key';

const MapPositionProvider: FC<PropsWithChildren> = ({ children }) => {
  const searchParams = useSearchParams();
  const mapPosition = mapPositionSchema.parse(Object.fromEntries(searchParams));

  provide(MAP_CONFIG, mapPosition);
  invalidateMapLocationIfChanged(mapPosition);

  return <>{children}</>;
};

const MapPositionProviderFallback: FC<PropsWithChildren> = ({ children }) => {
  provide(MAP_CONFIG, {});
  return <>{children}</>;
};

export const ConfigProvider: FC<PropsWithChildren> = ({ children }) => {
  provide(API_BASE_URL, '/api');
  provide(NAVBAR_CONFIG, {
    logoUrl: '/images/app-logo.svg',
    appName: "Lieux d'inclusion numérique",
    helpLabel: 'Aide'
  });
  provide(TERRITOIRE_FILTER, {});
  provide(THEME_COLORS, getThemeColors);

  return (
    <Suspense fallback={<MapPositionProviderFallback>{children}</MapPositionProviderFallback>}>
      <MapPositionProvider>{children}</MapPositionProvider>
    </Suspense>
  );
};
