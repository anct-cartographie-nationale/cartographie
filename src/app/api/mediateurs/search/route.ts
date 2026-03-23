import { z } from 'zod';
import { searchMediateursByName } from '@/features/lieux-inclusion-numerique/abilities/mediateurs-search/query/search-mediateurs-by-name';
import { routeBuilder, withFetch, withSearchParams } from '@/libraries/nextjs/route';

const searchSchema = z.object({
  q: z.string().min(1).max(100)
});

export const GET = routeBuilder()
  .use(withSearchParams(searchSchema))
  .use(withFetch('mediateurs', ({ searchParams }) => searchMediateursByName(searchParams.q)))
  .handle(async ({ mediateurs }) => Response.json(mediateurs));
