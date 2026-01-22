import { RouterProvider } from '@tanstack/react-router';
import { type FC, useMemo } from 'react';
import { API_BASE_URL, NAVBAR_CONFIG, provide } from '@/libraries/injection';
import { Toaster } from '@/libraries/ui/blocks/toaster';
import { createAppRouter } from './router';

type AppProps = {
  apiUrl?: string;
  logoUrl?: string;
  appName?: string;
  helpUrl?: string;
  helpLabel?: string;
};

export const App: FC<AppProps> = ({ apiUrl = '', logoUrl, appName, helpUrl, helpLabel }) => {
  provide(API_BASE_URL, apiUrl);
  provide(NAVBAR_CONFIG, { logoUrl, appName, helpUrl, helpLabel });

  const router = useMemo(() => createAppRouter(), []);

  return (
    <>
      <Toaster directionY='toast-top' directionX='toast-center' />
      <RouterProvider router={router} />
    </>
  );
};
