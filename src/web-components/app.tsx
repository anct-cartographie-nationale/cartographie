import { RouterProvider } from '@tanstack/react-router';
import { type FC, useMemo } from 'react';
import { provide } from '@/libraries/injection';
import { API_BASE_URL } from './api/api-base-url.key';
import { createAppRouter } from './router';

type AppProps = {
  apiUrl?: string;
};

export const App: FC<AppProps> = ({ apiUrl = '' }) => {
  provide(API_BASE_URL, apiUrl);

  const router = useMemo(() => createAppRouter(), []);

  return <RouterProvider router={router} />;
};
