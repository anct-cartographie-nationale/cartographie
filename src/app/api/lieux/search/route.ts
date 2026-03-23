import { z } from 'zod';
import { searchLieuxByName } from '@/features/lieux-inclusion-numerique/abilities/map-view/query/search-lieux-by-name.server';
import { routeBuilder, withFetch, withSearchParams } from '@/libraries/nextjs/route';

const searchSchema = z.object({
  q: z.string().min(1).max(100)
});

export const GET = routeBuilder()
  .use(withSearchParams(searchSchema))
  .use(withFetch('lieux', ({ searchParams }) => searchLieuxByName(searchParams.q)))
  .handle(async ({ lieux }) => Response.json(lieux));
