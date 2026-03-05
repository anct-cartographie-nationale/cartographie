import { useMemo } from 'react';
import { inject, TERRITOIRE_FILTER } from '@/libraries/injection';
import { territoireFilterToParams } from './territoire-filter-to-params';

export const useFilteredSearchParams = (searchParams: URLSearchParams): URLSearchParams => {
  const territoireFilter = inject(TERRITOIRE_FILTER);

  return useMemo(() => territoireFilterToParams(searchParams, territoireFilter), [searchParams, territoireFilter]);
};
