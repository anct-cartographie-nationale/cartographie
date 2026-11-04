import type { ReactNode } from 'react';
import type { LieuListItem } from '@/libraries/inclusion-numerique-api';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { LieuListLink } from './lieu-list-link';

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
          <LieuListLink
            id={id}
            href={hrefWithSearchParams(`/${region}/${departement}/lieux/${id}`)(searchParams, ['page'])}
            lieu={lieu}
            size={size}
          />
        </li>
      )
    )}
  </ul>
);
