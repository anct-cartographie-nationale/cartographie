'use client';

import type { ReactNode } from 'react';
import type { Departement, Region } from '@/libraries/collectivites';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { useSearchParams } from '@/libraries/nextjs/shim';
import type { BreadcrumbItem } from '@/libraries/ui/blocks/breadcrumbs';
import { Breadcrumbs } from '@/libraries/ui/blocks/breadcrumbs';
import { ButtonLink } from '@/libraries/ui/primitives/button-link';
import { Link } from '@/libraries/ui/primitives/link';
import { useMapRegionLocation } from './use-map-region-location';

export const DepartementsPage = ({
  region,
  departements,
  totalLieux,
  breadcrumbsItems,
  children
}: {
  region: Region;
  departements: Departement[];
  totalLieux: number;
  breadcrumbsItems?: BreadcrumbItem[];
  children?: ReactNode;
}): ReactNode => {
  const urlSearchParams = useSearchParams();
  const searchParams: URLSearchParams = new URLSearchParams(urlSearchParams);

  useMapRegionLocation(region);

  return (
    <>
      <Breadcrumbs
        items={breadcrumbsItems ?? [{ label: 'France', href: hrefWithSearchParams('/')(searchParams) }, { label: region.nom }]}
      />
      {children}
      <h2 className='font-bold uppercase text-xs text-base-title mb-3'>Filtrer par département</h2>
      <div className='flex flex-wrap gap-1.5'>
        {departements.map(({ code, slug, nom }) => (
          <Link
            href={hrefWithSearchParams(`/${region.slug}/${slug}`)(searchParams, ['page'])}
            key={code}
            prefetch={false}
            className='tag badge-primary badge-soft'
          >
            ({code}) {nom}
          </Link>
        ))}
      </div>
      <div className='pt-16 pb-8'>
        <ButtonLink
          href={hrefWithSearchParams(`/${region.slug}/lieux`)(searchParams)}
          className='border-base-200'
          kind='btn-outline'
          color='btn-primary'
        >
          Afficher la liste des {totalLieux} lieux
        </ButtonLink>
      </div>
    </>
  );
};
