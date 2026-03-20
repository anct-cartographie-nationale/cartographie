import { pipe } from 'effect';
import { z } from 'zod';
import { searchLieuxByName } from '@/features/lieux-inclusion-numerique/abilities/map-view/query/search-lieux-by-name.server';
import { fromRoute, handle, use, withFetch, withSearchParams } from '@/libraries/nextjs/route';

const searchSchema = z.object({
  q: z.string().min(1).max(100)
});

export const GET = pipe(
  fromRoute,
  (r) => use(r)(withSearchParams(searchSchema)),
  (r) => use(r)(withFetch('lieux', ({ searchParams }) => searchLieuxByName(searchParams.q))),
  (r) => handle(r)(async ({ lieux }) => Response.json(lieux))
);
