import type { ReactNode } from 'react';
import { Link } from '@/libraries/ui/primitives/link';
import { LieuCard } from './lieu-card';
import type { LieuListItem } from './lieu-list-item';

type LieuxListProps = {
  lieux: LieuListItem[];
  size?: 'md' | 'lg';
  className?: string;
};

export const LieuxList = ({ lieux, size = 'md', className }: LieuxListProps): ReactNode => (
  <ul className={className}>
    {lieux.map(
      ({ id, region, departement, ...lieu }): ReactNode => (
        <li key={id}>
          <Link className='no-underline' href={`/${region}/${departement}/lieux/${id}`}>
            <LieuCard className='hover:bg-base-300 h-full' {...lieu} size={size} />
          </Link>
        </li>
      )
    )}
  </ul>
);
