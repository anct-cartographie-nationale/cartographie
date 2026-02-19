import { key } from 'piqure';

export type TerritoireType = 'regions' | 'departements' | 'communes';

export type TerritoireFilter = {
  type?: TerritoireType | undefined;
  codes?: string[] | undefined;
};

export const TERRITOIRE_FILTER = key<TerritoireFilter>('territoire-filter');
