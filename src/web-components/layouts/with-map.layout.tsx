'use client';

import { useQuery } from '@tanstack/react-query';
import { Outlet, useSearch } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { MapProvider } from 'react-map-gl/maplibre';
import { Cartographie } from '@/features/cartographie';
import type { Departement, Region } from '@/features/collectivites-territoriales';
import { departements, regions } from '@/features/collectivites-territoriales';
import { LieuxOnMap } from '@/features/lieux-inclusion-numerique';
import { Button } from '@/libraries/ui/primitives/button';
import { cn } from '@/libraries/utils';
import { type DepartementWithCount, fetchDepartementsStats, fetchRegionsStats, type RegionWithCount } from '../api';
import { useFilteredSearchParams } from '../hooks/use-filtered-search-params';

const defaultRegions: RegionWithCount[] = (regions as Region[]).map((region) => ({
  ...region,
  nombreLieux: 0
}));

const defaultDepartements: DepartementWithCount[] = (departements as Departement[]).map((departement) => ({
  ...departement,
  nombreLieux: 0
}));

export const WithMapLayout = () => {
  const [showMap, setShowMap] = useState(false);
  const search = useSearch({ strict: false }) as Record<string, string>;
  const baseSearchParams = useMemo(() => new URLSearchParams(search), [search]);
  const searchParams = useFilteredSearchParams(baseSearchParams);

  const { data: regionsWithCount = defaultRegions } = useQuery({
    queryKey: ['stats', 'regions', searchParams.toString()],
    queryFn: () => fetchRegionsStats(searchParams)
  });

  const { data: departementsWithCount = defaultDepartements } = useQuery({
    queryKey: ['stats', 'departements', searchParams.toString()],
    queryFn: () => fetchDepartementsStats(searchParams)
  });

  return (
    <div className='flex flex-col h-full'>
      <div className='flex flex-1 overflow-hidden'>
        <MapProvider>
          <div
            className={cn(
              'flex lg:flex-row flex-col lg:flex-nowrap flex-wrap w-full transition-transform duration-200 ease-in-out lg:translate-x-0',
              showMap ? '-translate-x-full' : 'translate-x-0'
            )}
          >
            <div className='lg:w-165 w-full h-full px-12 pt-8 pb-14 overflow-auto'>{<Outlet />}</div>
            <Cartographie regions={regionsWithCount} departements={departementsWithCount} lieuxSlot={<LieuxOnMap />} />
          </div>
        </MapProvider>
      </div>
      <Button className='lg:hidden' color='btn-primary' scale='btn-lg' onClick={() => setShowMap(!showMap)}>
        {showMap ? 'Masquer' : 'Afficher'} la carte
      </Button>
    </div>
  );
};
