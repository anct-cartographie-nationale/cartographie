import type { Collectivite, FiltersSchema, LieuxRouteResponse } from '@/libraries/inclusion-numerique-api';
import { filterLieux, getAllLieux } from '@/libraries/lieux-cache';

export const fetchAllLieux =
  (collectivite?: Collectivite) =>
  async (filters: FiltersSchema): Promise<LieuxRouteResponse> => {
    const allLieux = await getAllLieux();
    return filterLieux(allLieux, filters, collectivite);
  };
