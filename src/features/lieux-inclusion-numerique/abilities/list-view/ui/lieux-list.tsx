import type { ReactNode } from 'react';
import type { LieuListItem } from '@/libraries/inclusion-numerique-api';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { Link } from '@/libraries/ui/primitives/link';
import { LieuCard } from './lieu-card';

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
            prefetch={false}
          >
            <LieuCard className='hover:bg-base-300 h-full' {...lieu} size={size} />
          </Link>
        </li>
      )
    )}
  </ul>
);
