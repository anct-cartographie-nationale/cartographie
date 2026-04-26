import { revalidateTag } from 'next/cache';
import { serverEnv } from '@/env.server';
import { invalidateCache } from '@/libraries/lieux-cache';
import { routeBuilder, withStaticBearerAuth } from '@/libraries/nextjs/route';

export const POST = routeBuilder()
  .use(withStaticBearerAuth(serverEnv.CACHE_RESET_TOKEN))
  .handle(async () => {
    invalidateCache();
    revalidateTag('lieux', { expire: 0 });
    return Response.json({ status: 'cache reset initiated' });
  });
