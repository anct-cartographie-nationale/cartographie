'use client';

import type { Params } from 'next/dist/server/request/params';
import { useParams } from 'next/navigation';
import { type ReactNode, useState } from 'react';
import { MapProvider } from 'react-map-gl/maplibre';
import { Cartographie } from '@/features/cartographie/cartographie';
import { type Departement, departementMatchingSlug } from '@/features/collectivites-territoriales/departement';
import { type Region, regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import { Button } from '@/libraries/ui/primitives/button';
import { cn } from '@/libraries/utils';

type ClientLayoutProps = {
  children: ReactNode;
  regions: (Region & { nombreLieux: number })[];
  departements: (Departement & { nombreLieux: number })[];
};

const REGION_PARAM = 'region';
const DEPARTEMENT_PARAM = 'departement';

const getParam = (params: Params) => (paramName: string) =>
  Array.isArray(params[paramName]) ? params[paramName][0] : params[paramName];

const ClientLayout = ({ children, regions, departements }: ClientLayoutProps) => {
  const params = useParams();
  const [showMap, setShowMap] = useState(false);

  return (
    <>
      <div className='flex flex-1 overflow-hidden'>
        <MapProvider>
          <div
            className={cn(
              'flex flex-col flex-wrap w-full transition-transform duration-200 ease-in-out lg:translate-x-0',
              showMap ? '-translate-x-full' : 'translate-x-0'
            )}
          >
            <div className='xl:w-165 lg:w-120 w-full h-full px-12 pt-8 pb-14 overflow-auto'>{children}</div>
            <Cartographie
              regions={regions}
              departements={departements}
              selectedRegion={regions.find(regionMatchingSlug(getParam(params)(REGION_PARAM)))}
              selectedDepartement={departements.find(departementMatchingSlug(getParam(params)(DEPARTEMENT_PARAM)))}
            />
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
