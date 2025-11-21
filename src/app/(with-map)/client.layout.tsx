'use client';

import { type ReactNode, useState } from 'react';
import { MapProvider } from 'react-map-gl/maplibre';
import { Cartographie } from '@/features/cartographie/cartographie';
import type { Departement } from '@/features/collectivites-territoriales/departement';
import type { Region } from '@/features/collectivites-territoriales/region';
import { Button } from '@/libraries/ui/primitives/button';
import { cn } from '@/libraries/utils';

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
        <MapProvider>
          <div
            className={cn(
              'flex lg:flex-row flex-col lg:flex-nowrap flex-wrap w-full transition-transform duration-200 ease-in-out lg:translate-x-0',
              showMap ? '-translate-x-full' : 'translate-x-0'
            )}
          >
            <div className='lg:w-165 w-full h-full px-12 pt-8 pb-14 overflow-auto'>{children}</div>
            <Cartographie regions={regions} departements={departements} />
          </div>
        </MapProvider>
      </div>
      <Button className='lg:hidden' color='btn-primary' scale='btn-lg' onClick={() => setShowMap(!showMap)}>
        {showMap ? 'Masquer' : 'Afficher'} la carte
      </Button>
    </>
  );
};

export default ClientLayout;
