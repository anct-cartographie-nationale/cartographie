import { routeBuilder } from '@arckit/nextjs/route';
import { revalidateTag } from 'next/cache';
import { errorReporter } from '@/configuration/telemetry/error-reporter';
import { withLogger } from '@/configuration/telemetry/logger/server';
import { serverEnv } from '@/env.server';
import { invalidateCache } from '@/libraries/lieux-cache';
import { withStaticBearerAuth } from '@/libraries/nextjs/route/middlewares/with-static-bearer-auth';

export const POST = routeBuilder()
  .use(withStaticBearerAuth(serverEnv.CACHE_RESET_TOKEN))
  .handle(
    withLogger('api:cache:reset')(async () => {
      invalidateCache((error) =>
        errorReporter.captureException({
          error: error instanceof Error ? error : new Error(String(error)),
          attributes: { 'cache.operation': 'invalidate' }
        })
      );
      revalidateTag('lieux', { expire: 0 });
      return Response.json({ status: 'cache reset initiated' });
    })
  );
