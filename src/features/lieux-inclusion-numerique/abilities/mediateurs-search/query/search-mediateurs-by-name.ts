import { inclusionNumeriqueFetchApi, MEDIATEURS_ROUTE } from '@/libraries/inclusion-numerique-api';

export const searchMediateursByName = async (name: string) => {
  const [mediateurs] = await inclusionNumeriqueFetchApi(MEDIATEURS_ROUTE, {
    filter: { name }
  });
  return mediateurs;
};
