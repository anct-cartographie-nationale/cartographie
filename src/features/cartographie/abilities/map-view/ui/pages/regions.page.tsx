'use client';

import type { ReactNode } from 'react';
import type { Region } from '@/libraries/collectivites';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { Link, useSearchParams } from '@/libraries/nextjs/shim';
import { ButtonLink } from '@/libraries/ui/primitives/button-link';
import { useMapInitialLocation } from './use-map-initial-location';

export const RegionsPage = ({
  totalLieux,
  regions,
  children
}: {
  totalLieux: number;
  regions: Region[];
  children?: ReactNode;
}): ReactNode => {
  const urlSearchParams = useSearchParams();
  const searchParams: URLSearchParams = new URLSearchParams(urlSearchParams);

  useMapInitialLocation();

  return (
    <>
      {children}
      <h2 className='font-bold uppercase text-xs text-base-title mb-3'>Filtrer par région</h2>
      <div className='flex flex-wrap gap-1.5'>
        {regions.map(({ nom, slug, code }) => (
          <Link
            href={hrefWithSearchParams(slug)(searchParams, ['page'])}
            key={code}
            prefetch={false}
            className='tag badge-primary badge-soft'
          >
            {nom}
          </Link>
        ))}
      </div>
      <div className='pt-16 pb-8'>
        <ButtonLink
          className='border-base-200'
          kind='btn-outline'
          color='btn-primary'
          href={hrefWithSearchParams('/lieux')(searchParams)}
        >
          Afficher la liste des {totalLieux} lieux
        </ButtonLink>
      </div>
    </>
  );
};
