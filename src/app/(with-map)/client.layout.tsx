'use client';

import type { Params } from 'next/dist/server/request/params';
import { useParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { MapProvider } from 'react-map-gl/maplibre';
import { Cartographie } from '@/features/cartographie/cartographie';
import { type Departement, departementMatchingSlug } from '@/features/collectivites-territoriales/departement';
import { type Region, regionMatchingSlug } from '@/features/collectivites-territoriales/region';

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

  return (
    <div className='flex flex-1 overflow-hidden'>
      <MapProvider>
        <div className='w-165 px-12 pt-8 pb-14 overflow-auto'>{children}</div>
        <Cartographie
          regions={regions}
          departements={departements}
          selectedRegion={regions.find(regionMatchingSlug(getParam(params)(REGION_PARAM)))}
          selectedDepartement={departements.find(departementMatchingSlug(getParam(params)(DEPARTEMENT_PARAM)))}
        />
      </MapProvider>
    </div>
  );
};

export default ClientLayout;
