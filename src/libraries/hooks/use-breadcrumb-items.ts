import { useMemo } from 'react';
import { type BreadcrumbItem, filterBreadcrumbItems } from '@/libraries/breadcrumb/filter-breadcrumb-items';
import { inject, TERRITOIRE_FILTER } from '@/libraries/injection';

export const useBreadcrumbItems = (items: BreadcrumbItem[]): BreadcrumbItem[] => {
  const territoireFilter = inject(TERRITOIRE_FILTER);

  return useMemo(() => filterBreadcrumbItems(items, territoireFilter), [items, territoireFilter]);
};
