'use client';

import { useQuery } from '@tanstack/react-query';
import { Outlet, useSearch } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { MapProvider } from 'react-map-gl/maplibre';
import { Cartographie } from '@/features/cartographie';
import { LieuxOnMap } from '@/features/lieux-inclusion-numerique';
import { type Departement, departements, type Region, regions } from '@/libraries/collectivites';
import { Button } from '@/libraries/ui/primitives/button';
import { cn } from '@/libraries/utils';
import { useFilteredSearchParams } from '@/shared/hooks';
import { type AllStats, type DepartementWithCount, fetchAllStats, type RegionWithCount } from '../api';

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

  const defaultStats: AllStats = { regions: defaultRegions, departements: defaultDepartements };

  const { data: { regions: regionsWithCount, departements: departementsWithCount } = defaultStats } = useQuery({
    queryKey: ['stats', searchParams.toString()],
    queryFn: () => fetchAllStats(searchParams)
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
