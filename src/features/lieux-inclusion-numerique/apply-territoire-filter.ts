import { codeInseeStartWithFilterTemplate } from '@/external-api/inclusion-numerique';
import type { Region } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { filterUnion } from '@/libraries/api/options';

export type TerritoireFilterParams = {
  territoire_type?: 'regions' | 'departements' | 'communes' | undefined;
  territoires?: string[] | undefined;
};

const codeInseeEqualsFilterTemplate = (code: string): string => `adresse->>code_insee.eq.${code}`;

export const applyTerritoireFilter = (filters: TerritoireFilterParams): { or?: string } => {
  const { territoire_type, territoires } = filters;

  if (!territoire_type || !territoires || territoires.length === 0) {
    return {};
  }

  switch (territoire_type) {
    case 'regions': {
      const departementCodes = territoires.flatMap((regionCode) => {
        const region = (regions as Region[]).find((r) => r.code === regionCode);
        return region?.departements ?? [];
      });

      if (departementCodes.length === 0) return {};

      return filterUnion(departementCodes)(codeInseeStartWithFilterTemplate);
    }

    case 'departements': {
      return filterUnion(territoires)(codeInseeStartWithFilterTemplate);
    }

    case 'communes': {
      return filterUnion(territoires)(codeInseeEqualsFilterTemplate);
    }

    default:
      return {};
  }
};
