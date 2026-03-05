import { useMemo } from 'react';
import { inject } from '@/libraries/injection';
import { TERRITOIRE_FILTER } from '@/shared/injection';
import { territoireFilterToParams } from './territoire-filter-to-params';

export const useFilteredSearchParams = (searchParams: URLSearchParams): URLSearchParams => {
  const territoireFilter = inject(TERRITOIRE_FILTER);

  return useMemo(() => territoireFilterToParams(searchParams, territoireFilter), [searchParams, territoireFilter]);
};
