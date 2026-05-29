import { routeBuilder, withFetch, withSearchParams } from '@arckit/nextjs/route';
import { z } from 'zod';
import { searchLieuxByName } from '@/features/lieux-inclusion-numerique/abilities/map-view/query/search-lieux-by-name.server';

const searchSchema = z.object({
  q: z.string().min(1).max(100)
});

export const GET = routeBuilder()
  .use(withSearchParams((raw) => searchSchema.parse(raw)))
  .use(
    withFetch('lieux', ({ searchParams }) => searchLieuxByName(searchParams.q), {
      cache: { cacheKey: ({ searchParams }) => ['search', searchParams.q], revalidate: false, tags: ['lieux'] }
    })
  )
  .handle(async ({ lieux }) => Response.json(lieux));
