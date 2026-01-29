import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { FC, ReactNode } from 'react';
import { MapProvider } from 'react-map-gl/maplibre';
import { Navbar } from '@/features/brand/use-cases/layout';
import { ThemeProvider } from '@/libraries/ui/theme/providers/theme.provider';

type WebComponentLayoutProps = {
  children: ReactNode;
};

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 1 } } });

export const WebComponentLayout: FC<WebComponentLayoutProps> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute='data-theme' defaultTheme='light' enableSystem disableTransitionOnChange>
      <MapProvider>
        <div className='h-full flex flex-col'>
          <Navbar />
          {children}
        </div>
      </MapProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
