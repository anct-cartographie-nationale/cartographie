'use client';

import type { ReactNode } from 'react';
import { load$ } from '@/libraries/map';
import { Subscribe } from '@/libraries/reactivity/Subscribe';

type LieuxCountProps = {
  totalLieux: number;
};

export const LieuxCount = ({ totalLieux }: LieuxCountProps): ReactNode => (
  <Subscribe to$={load$}>
    {(isLoading) => (
      <h1 className='font-bold uppercase text-xs text-base-title'>
        {isLoading ? 'Chargement des lieux...' : <>{totalLieux} lieux trouvés</>}
      </h1>
    )}
  </Subscribe>
);
