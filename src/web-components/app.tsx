import { RouterProvider } from '@tanstack/react-router';
import { type FC, useMemo } from 'react';
import { NAVBAR_CONFIG } from '@/features/brand/injection';
import { MAP_CONFIG } from '@/features/cartographie/injection';
import { MATOMO_CONFIG } from '@/libraries/analytics';
import { provide } from '@/libraries/injection';
import { invalidateMapLocationIfChanged, THEME_COLORS } from '@/libraries/map';
import { Toaster } from '@/libraries/ui/blocks/toaster';
import { API_BASE_URL } from '@/shared/injection/keys/api-base-url.key';
import { SITE_URL } from '@/shared/injection/keys/site-url.key';
import { TERRITOIRE_FILTER, type TerritoireType } from '@/shared/injection/keys/territoire-filter.key';
import { getThemeColors } from '@/shared/ui';
import { createAppRouter } from './router';

type AppProps = {
  apiUrl?: string;
  siteUrl?: string;
  logoUrl?: string;
  appName?: string;
  helpUrl?: string;
  helpLabel?: string;
  latitude?: number;
  longitude?: number;
  zoom?: number;
  territoireType?: string;
  territoires?: string;
  routeInitiale?: string;
  matomoUrl?: string;
  matomoSiteId?: string;
};

export const App: FC<AppProps> = ({
  apiUrl = '',
  siteUrl,
  logoUrl,
  appName,
  helpUrl,
  helpLabel,
  latitude,
  longitude,
  zoom,
  territoireType,
  territoires,
  routeInitiale,
  matomoUrl,
  matomoSiteId
}) => {
  useMemo(() => {
    provide(API_BASE_URL, apiUrl);
    provide(SITE_URL, siteUrl);
    provide(NAVBAR_CONFIG, { logoUrl, appName, helpUrl, helpLabel, homeUrl: routeInitiale });
    provide(MAP_CONFIG, { latitude, longitude, zoom });
    provide(TERRITOIRE_FILTER, {
      type: territoireType as TerritoireType | undefined,
      codes: territoires
        ?.split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    });
    provide(MATOMO_CONFIG, { url: matomoUrl, siteId: matomoSiteId });
    provide(THEME_COLORS, getThemeColors);
  }, [
    apiUrl,
    siteUrl,
    logoUrl,
    appName,
    helpUrl,
    helpLabel,
    routeInitiale,
    latitude,
    longitude,
    zoom,
    territoireType,
    territoires,
    matomoUrl,
    matomoSiteId
  ]);

  invalidateMapLocationIfChanged({ latitude, longitude, zoom });

  const router = useMemo(() => createAppRouter(routeInitiale), [routeInitiale]);

  return (
    <>
      <Toaster directionY='toast-top' directionX='toast-center' />
      <RouterProvider router={router} />
    </>
  );
};
