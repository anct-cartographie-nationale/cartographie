import { useMemo } from 'react';
import { territoireFilterToParams } from '@/features/lieux-inclusion-numerique/territoire-filter-to-params';
import { inject, TERRITOIRE_FILTER } from '@/libraries/injection';

export const useFilteredSearchParams = (searchParams: URLSearchParams): URLSearchParams => {
  const territoireFilter = inject(TERRITOIRE_FILTER);

  return useMemo(() => territoireFilterToParams(searchParams, territoireFilter), [searchParams, territoireFilter]);
};
