import { getCachedDepartementsStats } from '@/features/collectivites-territoriales/stats';
import { filtersSchema } from '@/features/lieux-inclusion-numerique/validations';

export const GET = async (request: Request) => {
  const { searchParams: searchParamsMap } = new URL(request.url);
  const searchParams = Object.fromEntries(searchParamsMap.entries());
  const filters = filtersSchema.parse(searchParams);

  const departementsAvecTotaux = await getCachedDepartementsStats(filters);
  return Response.json(departementsAvecTotaux);
};
