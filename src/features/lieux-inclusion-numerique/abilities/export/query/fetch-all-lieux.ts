import type { Collectivite, FiltersSchema, LieuxRouteResponse } from '@/libraries/inclusion-numerique-api';
import { filterLieux, getAllLieux, getOpeningHoursCache, needsOpeningHoursCache } from '@/libraries/lieux-cache';

export const fetchAllLieux =
  (collectivite?: Collectivite) =>
  async (filters: FiltersSchema): Promise<LieuxRouteResponse> => {
    const [allLieux, ohCache] = await Promise.all([
      getAllLieux(),
      needsOpeningHoursCache(filters) ? getOpeningHoursCache() : undefined
    ]);
    return filterLieux(allLieux, filters, collectivite, ohCache);
  };
