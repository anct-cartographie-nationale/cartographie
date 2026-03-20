import { inclusionNumeriqueFetchApi, LIEUX_ROUTE } from '@/libraries/inclusion-numerique-api';

export const searchLieuxByName = async (query: string) => {
  const [lieux] = await inclusionNumeriqueFetchApi(LIEUX_ROUTE, {
    select: ['id', 'nom', 'latitude', 'longitude', 'adresse'],
    filter: { nom: `ilike.%${query}%` },
    paginate: { limit: 10, offset: 0 }
  });

  return lieux;
};
