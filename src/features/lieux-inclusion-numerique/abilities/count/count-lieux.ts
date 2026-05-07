import type { Collectivite, FiltersSchema } from '@/libraries/inclusion-numerique-api';
import { filterLieux, getAllLieux, getOpeningHoursCache } from '@/libraries/lieux-cache';

export const countLieux =
  (collectivite?: Collectivite) =>
  async (filters: FiltersSchema): Promise<number> => {
    const [allLieux, ohCache] = await Promise.all([getAllLieux(), getOpeningHoursCache()]);
    return filterLieux(allLieux, filters, collectivite, ohCache).length;
  };
