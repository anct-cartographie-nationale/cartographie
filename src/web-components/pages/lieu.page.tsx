import { skipToken, useQuery } from '@tanstack/react-query';
import { useParams, useSearch } from '@tanstack/react-router';
import type { FC } from 'react';
import { type Departement, departementMatchingSlug } from '@/features/collectivites-territoriales/departement';
import departements from '@/features/collectivites-territoriales/departements.json';
import { type Region, regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { FicheLieuPage } from '@/features/lieux-inclusion-numerique/fiche-lieu.page';
import { hrefWithSearchParams } from '@/libraries/next';
import { fetchLieu } from '../api';
import { useBreadcrumbItems } from '../hooks/use-filtered-search-params';

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

  if (!region || !departement) {
    return <div>Page non trouvée</div>;
  }

  if (!lieu) {
    return <div>Chargement...</div>;
  }

  return (
    <FicheLieuPage
      lieu={lieu}
      breadcrumbsItems={breadcrumbsItems}
      listHref={hrefWithSearchParams(`/${region.slug}/${departement.slug}`)(searchParams, ['page'])}
    />
  );
};
