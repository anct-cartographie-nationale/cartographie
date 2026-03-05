import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { FC, ReactNode } from 'react';
import { MapProvider } from 'react-map-gl/maplibre';
import { Navbar } from '@/features/brand/abilities/layout';
import { Geolocate, SearchAddress } from '@/features/cartographie';
import {
  BesoinsFilters,
  DisponibiliteFilters,
  DispositifsFilters,
  PublicCibleFilters,
  TerritoiresPrioritairesFilters
} from '@/features/lieux-inclusion-numerique';
import { MatomoTracker } from '@/libraries/analytics';
import { ThemeProvider } from '@/libraries/ui/theme/providers/theme.provider';
import { LoadStreamSync } from './components/load-stream-sync';

type WebComponentLayoutProps = {
  children: ReactNode;
};

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 1 } } });

export const WebComponentLayout: FC<WebComponentLayoutProps> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <MatomoTracker />
    <LoadStreamSync />
    <ThemeProvider attribute='data-theme' defaultTheme='light' enableSystem disableTransitionOnChange>
      <MapProvider>
        <div className='h-full flex flex-col'>
          <Navbar
            searchSlot={
              <div className='flex gap-2'>
                <SearchAddress className='sm:w-100 w-full pr-0' />
                <Geolocate />
              </div>
            }
            filtersSlot={
              <>
                <BesoinsFilters />
                <PublicCibleFilters />
                <DisponibiliteFilters />
                <DispositifsFilters />
                <TerritoiresPrioritairesFilters />
              </>
            }
          />
          {children}
        </div>
      </MapProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
