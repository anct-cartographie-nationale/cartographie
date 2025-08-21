import type { ReactNode } from 'react';
import type { Departement } from '@/features/collectivites-territoriales/departement';
import type { Region } from '@/features/collectivites-territoriales/region';
import { Link } from '@/libraries/ui/primitives/link';
import { LieuCard } from './lieu-card';

type LieuxListProps = {
  lieux: {
    id: string;
    nom: string;
    commune: string;
    departement: Departement;
    region: Region;
    distance?: number;
    isOpen?: boolean;
    isByAppointment?: boolean;
    isFranceServices?: boolean;
    isConum?: boolean;
  }[];
};

export const LieuxList = ({ lieux }: LieuxListProps): ReactNode => (
  <ul className='flex flex-col gap-2'>
    {lieux.map(
      ({ id, region, departement, ...lieu }): ReactNode => (
        <li key={id}>
          <Link className='no-underline' href={`/${region.slug}/${departement.slug}/lieux/${id}`}>
            <LieuCard className='hover:bg-base-300' {...lieu} />
          </Link>
        </li>
      )
    )}
  </ul>
);
