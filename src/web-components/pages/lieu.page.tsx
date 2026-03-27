import { skipToken, useQuery } from '@tanstack/react-query';
import { useParams, useSearch } from '@tanstack/react-router';
import type { FC } from 'react';
import { FicheLieuPage } from '@/features/lieux-inclusion-numerique';
import {
  type Departement,
  departementMatchingSlug,
  departements,
  type Region,
  regionMatchingSlug,
  regions
} from '@/libraries/collectivites';
import { inject } from '@/libraries/injection';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { SITE_URL } from '@/shared/injection';
import { fetchLieu } from '../api';
import { useBreadcrumbItems } from '../breadcrumb/use-breadcrumb-items';

export const Page: FC = () => {
  const { region: regionSlug, departement: departementSlug, id } = useParams({ from: '/$region/$departement/lieux/$id' });
  const search: Record<string, string> = useSearch({ from: '/$region/$departement/lieux/$id' });

  const searchParams = new URLSearchParams(search);

  const region: Region | undefined = (regions as Region[]).find(regionMatchingSlug(regionSlug));
  const departement: Departement | undefined = departements.find(departementMatchingSlug(departementSlug));

  const { data: lieu } = useQuery({
    queryKey: ['lieu', id],
    queryFn: id ? () => fetchLieu(id) : skipToken
  });

  const breadcrumbsItems = useBreadcrumbItems([
    { label: 'France', href: hrefWithSearchParams('/')(searchParams, ['page']) },
    { label: region?.nom ?? '', href: hrefWithSearchParams(`/${region?.slug}`)(searchParams, ['page']) },
    {
      label: departement?.nom ?? '',
      href: hrefWithSearchParams(`/${region?.slug}/${departement?.slug}`)(searchParams, ['page'])
    },
    { label: lieu?.adresse.split(', ')[1] ?? lieu?.adresse ?? '' }
  ]);

  if (!region || !departement) return <div>Page non trouvée</div>;
  if (!lieu) return <div>Chargement...</div>;

  const siteUrl = inject(SITE_URL);
  const lieuPath = `/${region.slug}/${departement.slug}/lieux/${encodeURIComponent(id)}`;
  const lieuUrl = siteUrl ? `${siteUrl}${lieuPath}` : lieuPath;

  return (
    <FicheLieuPage
      lieu={lieu}
      breadcrumbsItems={breadcrumbsItems}
      listHref={hrefWithSearchParams(`/${region.slug}/${departement.slug}`)(searchParams, ['page'])}
      lieuUrl={lieuUrl}
    />
  );
};
