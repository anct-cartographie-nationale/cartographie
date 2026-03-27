import { useMemo } from 'react';
import { inject } from '@/libraries/injection';
import type { BreadcrumbItem } from '@/libraries/ui/blocks/breadcrumbs';
import { TERRITOIRE_FILTER } from '@/shared/injection/keys/territoire-filter.key';
import { filterBreadcrumbItems } from './filter-breadcrumb-items';

export const useBreadcrumbItems = (items: BreadcrumbItem[]): BreadcrumbItem[] => {
  const territoireFilter = inject(TERRITOIRE_FILTER);

  return useMemo(() => filterBreadcrumbItems(items, territoireFilter), [items, territoireFilter]);
};
