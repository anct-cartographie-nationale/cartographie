'use client';

import dynamic from 'next/dynamic';
import { type ReactNode, useState } from 'react';
import type { Departement, Region } from '@/libraries/collectivites';
import { Button } from '@/libraries/ui/primitives/button';
import { cn } from '@/libraries/utils';

const LazyMap = dynamic(
  async () => {
    const [{ MapProvider }, { Cartographie }, { LieuxOnMap }] = await Promise.all([
      import('react-map-gl/maplibre'),
      import('@/features/cartographie'),
      import('@/features/lieux-inclusion-numerique')
    ]);

    const CartographieWithProvider = ({
      regions,
      departements,
      children,
      showMap
    }: {
      regions: (Region & { nombreLieux: number })[];
      departements: (Departement & { nombreLieux: number })[];
      children: ReactNode;
      showMap: boolean;
    }) => (
      <MapProvider>
        <div
          className={cn(
            'flex lg:flex-row flex-col lg:flex-nowrap flex-wrap w-full transition-transform duration-200 ease-in-out lg:translate-x-0',
            showMap ? '-translate-x-full' : 'translate-x-0'
          )}
        >
          <div className='lg:w-165 w-full h-full px-12 pt-8 pb-14 overflow-auto'>{children}</div>
          <Cartographie regions={regions} departements={departements} lieuxSlot={<LieuxOnMap />} />
        </div>
      </MapProvider>
    );

    return CartographieWithProvider;
  },
  { ssr: false, loading: () => <div className='w-full h-full bg-base-300 animate-pulse' /> }
);

type ClientLayoutProps = {
  children: ReactNode;
  regions: (Region & { nombreLieux: number })[];
  departements: (Departement & { nombreLieux: number })[];
};

const ClientLayout = ({ children, regions, departements }: ClientLayoutProps) => {
  const [showMap, setShowMap] = useState(false);

  return (
    <>
      <div className='flex flex-1 overflow-hidden'>
        <LazyMap regions={regions} departements={departements} showMap={showMap}>
          {children}
        </LazyMap>
      </div>
      <Button className='lg:hidden' color='btn-primary' scale='btn-lg' onClick={() => setShowMap(!showMap)}>
        {showMap ? 'Masquer' : 'Afficher'} la carte
      </Button>
    </>
  );
};

export default ClientLayout;
