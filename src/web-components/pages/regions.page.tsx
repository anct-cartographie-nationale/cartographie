import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { type FC, useMemo } from 'react';
import { RegionsPage } from '@/features/cartographie/regions.page';
import type { Region } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { fetchTotalLieux } from '../api';
import { useFilteredSearchParams } from '../hooks/use-filtered-search-params';

export const Page: FC = () => {
  const search = useSearch({ strict: false }) as Record<string, string>;
  const baseSearchParams = useMemo(() => new URLSearchParams(search), [search]);
  const searchParams = useFilteredSearchParams(baseSearchParams);

  const { data: totalLieux = 0 } = useQuery({
    queryKey: ['stats', 'total', searchParams.toString()],
    queryFn: () => fetchTotalLieux(searchParams)
  });

  return <RegionsPage totalLieux={totalLieux} regions={regions as Region[]} />;
};
