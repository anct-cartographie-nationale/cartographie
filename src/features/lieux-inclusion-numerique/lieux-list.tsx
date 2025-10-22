import type { ReactNode } from 'react';
import { hrefWithSearchParams } from '@/libraries/next';
import { Link } from '@/libraries/ui/primitives/link';
import { LieuCard } from './lieu-card';
import type { LieuListItem } from './lieu-list-item';

type LieuxListProps = {
  lieux: LieuListItem[];
  searchParams: URLSearchParams;
  size?: 'md' | 'lg';
  className?: string;
};

export const LieuxList = ({ lieux, size = 'md', searchParams, className }: LieuxListProps): ReactNode => (
  <ul className={className}>
    {lieux.map(
      ({ id, region, departement, ...lieu }): ReactNode => (
        <li key={id}>
          <Link
            className='no-underline'
            href={hrefWithSearchParams(`/${region}/${departement}/lieux/${id}`)(searchParams, ['page'])}
          >
            <LieuCard className='hover:bg-base-300 h-full' {...lieu} size={size} />
          </Link>
        </li>
      )
    )}
  </ul>
);
