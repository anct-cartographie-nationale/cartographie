import type { TerritoireFilter } from '@/shared/injection';

export const territoireFilterToParams = (searchParams: URLSearchParams, filter: TerritoireFilter): URLSearchParams => {
  const params = new URLSearchParams(searchParams);

  if (filter.type && filter.codes && filter.codes.length > 0) {
    params.set('territoire_type', filter.type);
    params.set('territoires', filter.codes.join(','));
  }

  return params;
};
