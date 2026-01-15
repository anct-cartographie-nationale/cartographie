import { skipToken, useQuery } from '@tanstack/react-query';
import { useParams, useSearch } from '@tanstack/react-router';
import type { FC } from 'react';
import { type Departement, departementMatchingSlug } from '@/features/collectivites-territoriales/departement';
import departements from '@/features/collectivites-territoriales/departements.json';
import { type Region, regionMatchingSlug } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { DepartementLieuxPage } from '@/features/lieux-inclusion-numerique/departement-lieux.page';
import { fetchDepartementLieux } from '../api';

const PAGE_SIZE = 10;

export const Page: FC = () => {
  const { region: regionSlug, departement: departementSlug } = useParams({ from: '/with-map/$region/$departement' });
  const search: { page: number } = useSearch({ from: '/with-map/$region/$departement' });
  const currentPage = Number(search.page) || 1;

  const region: Region | undefined = (regions as Region[]).find(regionMatchingSlug(regionSlug));
  const departement: Departement | undefined = departements.find(departementMatchingSlug(departementSlug));

  const { data } = useQuery({
    queryKey: ['lieux', 'departement', departement?.code, currentPage],
    queryFn: departement ? () => fetchDepartementLieux(departement.code, currentPage, PAGE_SIZE) : skipToken
  });

  if (!region || !departement) {
    return <div>Page non trouvée</div>;
  }

  return (
    <DepartementLieuxPage
      totalLieux={data?.total ?? 0}
      pageSize={PAGE_SIZE}
      curentPage={currentPage}
      lieux={data?.lieux ?? []}
      region={region}
      departement={departement}
    />
  );
};
