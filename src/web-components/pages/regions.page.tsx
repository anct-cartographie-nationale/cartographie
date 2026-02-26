import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { type FC, useMemo } from 'react';
import { RegionsPage } from '@/features/cartographie/regions.page';
import { filterRegionsByTerritoire } from '@/features/collectivites-territoriales/filter-by-territoire';
import { inject, TERRITOIRE_FILTER } from '@/libraries/injection';
import { fetchTotalLieux } from '../api';
import { useFilteredSearchParams } from '../hooks/use-filtered-search-params';

export const Page: FC = () => {
  const search = useSearch({ strict: false }) as Record<string, string>;
  const baseSearchParams = useMemo(() => new URLSearchParams(search), [search]);
  const searchParams = useFilteredSearchParams(baseSearchParams);
  const territoireFilter = inject(TERRITOIRE_FILTER);

  const filteredRegions = filterRegionsByTerritoire({
    territoire_type: territoireFilter.type,
    territoires: territoireFilter.codes
  });

  const { data: totalLieux = 0 } = useQuery({
    queryKey: ['stats', 'total', searchParams.toString()],
    queryFn: () => fetchTotalLieux(searchParams)
  });

  return <RegionsPage totalLieux={totalLieux} regions={filteredRegions} />;
};
