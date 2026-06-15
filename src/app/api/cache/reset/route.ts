import { routeBuilder } from '@arckit/nextjs/route';
import { revalidateTag } from 'next/cache';
import { errorReporter } from '@/configuration/telemetry/error-reporter';
import { serverEnv } from '@/env.server';
import { invalidateCache } from '@/libraries/lieux-cache';
import { withStaticBearerAuth } from '@/libraries/nextjs/route/middlewares/with-static-bearer-auth';

export const POST = routeBuilder()
  .use(withStaticBearerAuth(serverEnv.CACHE_RESET_TOKEN))
  .handle(async () => {
    try {
      // Recharger le cache mémoire AVANT d'invalider le cache de données Next : sinon une
      // requête concurrente réamorcerait le tag 'lieux' avec des données encore périmées.
      await invalidateCache();
    } catch (error) {
      errorReporter.captureException({
        error: error instanceof Error ? error : new Error(String(error)),
        attributes: { 'cache.operation': 'invalidate' }
      });
      return new Response('cache reset failed', { status: 503 });
    }
    revalidateTag('lieux', { expire: 0 });
    return Response.json({ status: 'cache reset' });
  });
