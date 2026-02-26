import { RouterProvider } from '@tanstack/react-router';
import { type FC, useMemo } from 'react';
import {
  API_BASE_URL,
  MAP_CONFIG,
  NAVBAR_CONFIG,
  provide,
  TERRITOIRE_FILTER,
  type TerritoireType
} from '@/libraries/injection';
import { Toaster } from '@/libraries/ui/blocks/toaster';
import { createAppRouter } from './router';

type AppProps = {
  apiUrl?: string;
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
};

export const App: FC<AppProps> = ({
  apiUrl = '',
  logoUrl,
  appName,
  helpUrl,
  helpLabel,
  latitude,
  longitude,
  zoom,
  territoireType,
  territoires,
  routeInitiale
}) => {
  provide(API_BASE_URL, apiUrl);
  provide(NAVBAR_CONFIG, { logoUrl, appName, helpUrl, helpLabel, homeUrl: routeInitiale });
  provide(MAP_CONFIG, { latitude, longitude, zoom });
  provide(TERRITOIRE_FILTER, {
    type: territoireType as TerritoireType | undefined,
    codes: territoires
      ?.split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  });

  const router = useMemo(() => createAppRouter(routeInitiale), [routeInitiale]);

  return (
    <>
      <Toaster directionY='toast-top' directionX='toast-center' />
      <RouterProvider router={router} />
    </>
  );
};
