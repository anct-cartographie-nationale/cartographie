'use client';

import type { Params } from 'next/dist/server/request/params';
import { useParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { MapProvider } from 'react-map-gl/maplibre';
import { Cartographie } from '@/features/cartographie/cartographie';
import { regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';

const REGION_PARAM = 'region';

const getParam = (params: Params) => (paramName: string) =>
  Array.isArray(params[paramName]) ? params[paramName][0] : params[paramName];

const Layout = ({ children }: { children: ReactNode }) => {
  const params = useParams();

  return (
    <div className='flex flex-1 overflow-hidden'>
      <MapProvider>
        <div className='w-165 px-12 pt-8 pb-14 overflow-auto'>{children}</div>
        <Cartographie selectedRegion={regions.find(regionMatchingSlug(getParam(params)(REGION_PARAM)))} />
      </MapProvider>
    </div>
  );
};

export default Layout;
