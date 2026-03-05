import { filterUnion } from '@/libraries/api/options';
import type { Region } from '@/libraries/collectivites';
import { regions } from '@/libraries/collectivites';
import { codeInseeStartWithFilterTemplate } from '../filter-templates';

export type TerritoireFilterParams = {
  territoire_type?: 'regions' | 'departements' | 'communes' | undefined;
  territoires?: string[] | undefined;
};

const codeInseeEqualsFilterTemplate = (code: string): string => `adresse->>code_insee.eq.${code}`;

const TERRITOIRE_STRATEGIES: Record<
  NonNullable<TerritoireFilterParams['territoire_type']>,
  (territoires: string[]) => { or?: string }
> = {
  regions: (territoires) => {
    const departementCodes = territoires.flatMap(
      (code) => (regions as Region[]).find((r) => r.code === code)?.departements ?? []
    );
    return departementCodes.length > 0 ? filterUnion(departementCodes)(codeInseeStartWithFilterTemplate) : {};
  },
  departements: (territoires) => filterUnion(territoires)(codeInseeStartWithFilterTemplate),
  communes: (territoires) => filterUnion(territoires)(codeInseeEqualsFilterTemplate)
};

export const applyTerritoireFilter = ({ territoire_type, territoires }: TerritoireFilterParams): { or?: string } =>
  territoire_type && territoires?.length ? TERRITOIRE_STRATEGIES[territoire_type](territoires) : {};
