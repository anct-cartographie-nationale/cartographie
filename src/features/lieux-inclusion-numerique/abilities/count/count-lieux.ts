import type { Collectivite, FiltersSchema } from '@/libraries/inclusion-numerique-api';
import { filterLieux, getAllLieux } from '@/libraries/lieux-cache';

export const countLieux =
  (collectivite?: Collectivite) =>
  async (filters: FiltersSchema): Promise<number> => {
    const allLieux = await getAllLieux();
    return filterLieux(allLieux, filters, collectivite).length;
  };
