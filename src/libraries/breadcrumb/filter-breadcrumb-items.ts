import type { TerritoireFilter } from '@/libraries/injection';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbLevel = 'france' | 'region' | 'departement' | 'other';

const EXCLUDED_LEVELS: Record<
  NonNullable<TerritoireFilter['type']>,
  { single: BreadcrumbLevel[]; multiple: BreadcrumbLevel[] }
> = {
  regions: {
    single: ['france'],
    multiple: []
  },
  departements: {
    single: ['france', 'region'],
    multiple: ['france']
  },
  communes: {
    single: ['france', 'region', 'departement'],
    multiple: ['france', 'region']
  }
};

const getBreadcrumbLevel = (item: BreadcrumbItem, index: number): BreadcrumbLevel => {
  if (item.label === 'France') return 'france';
  if (index === 1) return 'region';
  if (index === 2) return 'departement';
  return 'other';
};

const getExcludedLevels = (filter: TerritoireFilter): Set<BreadcrumbLevel> => {
  if (!filter.type) return new Set();
  const { single, multiple } = EXCLUDED_LEVELS[filter.type];
  return new Set((filter.codes?.length ?? 0) > 1 ? multiple : single);
};

export const filterBreadcrumbItems = (items: BreadcrumbItem[], filter: TerritoireFilter): BreadcrumbItem[] => {
  if (!filter.type || !filter.codes?.length) {
    return items;
  }

  const excludedLevels = getExcludedLevels(filter);

  return items.filter((item, index) => {
    const level = getBreadcrumbLevel(item, index);
    return !excludedLevels.has(level);
  });
};
