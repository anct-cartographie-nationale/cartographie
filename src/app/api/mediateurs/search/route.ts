import { routeBuilder, withFetch, withSearchParams } from '@arckit/nextjs/route';
import { z } from 'zod';
import { searchMediateursByName } from '@/features/lieux-inclusion-numerique/abilities/mediateurs-search/query/search-mediateurs-by-name';

const searchSchema = z.object({
  q: z.string().min(1).max(100)
});

const SIX_HOURS = 6 * 60 * 60;

export const GET = routeBuilder()
  .use(withSearchParams((raw) => searchSchema.parse(raw)))
  .use(
    withFetch('mediateurs', ({ searchParams }) => searchMediateursByName(searchParams.q), {
      cache: { cacheKey: ({ searchParams }) => ['mediateurs', searchParams.q], revalidate: SIX_HOURS }
    })
  )
  .handle(async ({ mediateurs }) => Response.json(mediateurs));
