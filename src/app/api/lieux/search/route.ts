import { z } from 'zod';
import { searchLieuxByName } from '@/features/lieux-inclusion-numerique/abilities/map-view/query/search-lieux-by-name.server';
import { routeBuilder, withFetch, withSearchParams } from '@/libraries/nextjs/route';

const SIX_HOURS = 6 * 60 * 60;

const searchSchema = z.object({
  q: z.string().min(1).max(100)
});

export const GET = routeBuilder()
  .use(withSearchParams(searchSchema))
  .use(
    withFetch('lieux', ({ searchParams }) => searchLieuxByName(searchParams.q), {
      cache: { cacheKey: ({ searchParams }) => ['search', searchParams.q], revalidate: SIX_HOURS }
    })
  )
  .handle(async ({ lieux }) => Response.json(lieux));
