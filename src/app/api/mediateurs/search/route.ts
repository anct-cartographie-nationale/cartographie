import { pipe } from 'effect';
import { z } from 'zod';
import { searchMediateursByName } from '@/features/lieux-inclusion-numerique/abilities/mediateurs-search/query/search-mediateurs-by-name';
import { fromRoute, handle, use, withFetch, withSearchParams } from '@/libraries/nextjs/route';

const searchSchema = z.object({
  q: z.string().min(1).max(100)
});

export const GET = pipe(
  fromRoute,
  (r) => use(r)(withSearchParams(searchSchema)),
  (r) => use(r)(withFetch('mediateurs', ({ searchParams }) => searchMediateursByName(searchParams.q))),
  (r) => handle(r)(async ({ mediateurs }) => Response.json(mediateurs))
);
