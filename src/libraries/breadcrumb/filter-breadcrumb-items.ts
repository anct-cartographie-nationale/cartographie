import type { TerritoireFilter } from '@/libraries/injection';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbLevel = 'france' | 'region' | 'departement' | 'other';

const getBreadcrumbLevel = (item: BreadcrumbItem, index: number): BreadcrumbLevel => {
  if (item.label === 'France') return 'france';
  if (index === 1) return 'region';
  if (index === 2) return 'departement';
  return 'other';
};

/**
 * Détermine quels niveaux de breadcrumb masquer selon le filtre de territoire.
 * Règle : on affiche un niveau parent seulement s'il permet de naviguer entre plusieurs territoires.
 */
const getExcludedLevels = (filter: TerritoireFilter): Set<BreadcrumbLevel> => {
  const excluded = new Set<BreadcrumbLevel>();
  const hasMultiple = (filter.codes?.length ?? 0) > 1;

  switch (filter.type) {
    case 'regions':
      // France visible seulement si plusieurs régions
      if (!hasMultiple) excluded.add('france');
      break;

    case 'departements':
      // France toujours masqué
      excluded.add('france');
      // Région visible seulement si plusieurs départements
      if (!hasMultiple) excluded.add('region');
      break;

    case 'communes':
      // France et Région toujours masqués
      excluded.add('france');
      excluded.add('region');
      // Département visible seulement si plusieurs communes
      // Si une seule commune, on masque aussi le département (pas de breadcrumb)
      if (!hasMultiple) excluded.add('departement');
      break;
  }

  return excluded;
};

export const filterBreadcrumbItems = (items: BreadcrumbItem[], filter: TerritoireFilter): BreadcrumbItem[] => {
  // Sans filtre, retourner tous les items
  if (!filter.type || !filter.codes?.length) {
    return items;
  }

  const excludedLevels = getExcludedLevels(filter);

  return items.filter((item, index) => {
    const level = getBreadcrumbLevel(item, index);
    return !excludedLevels.has(level);
  });
};
