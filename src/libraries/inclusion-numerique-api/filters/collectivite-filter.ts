import { buildAndFilter, filterUnion } from '@/libraries/api/options';
import type { Departement, Region } from '@/libraries/collectivites';
import { codeInseeStartWithFilterTemplate } from '../filter-templates';
import { applyFilters } from './apply-filters';
import type { FiltersSchema } from './filters.schema';

export type Collectivite = Region | Departement;

const getCollectiviteCodes = (collectivite: Collectivite): string[] =>
  'departements' in collectivite ? collectivite.departements : [collectivite.code];

export const buildCollectiviteFilter = (filters: FiltersSchema, collectivite?: Collectivite): { and?: string } => {
  const baseFilter = applyFilters(filters);
  if (!collectivite) return baseFilter;
  return buildAndFilter(filterUnion(getCollectiviteCodes(collectivite))(codeInseeStartWithFilterTemplate), baseFilter);
};
