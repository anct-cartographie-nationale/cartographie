import { routeBuilder } from '@arckit/nextjs/route';
import { revalidateTag } from 'next/cache';
import { errorReporter } from '@/configuration/telemetry/error-reporter';
import { logger } from '@/configuration/telemetry/logger/server';
import { serverEnv } from '@/env.server';
import { getCacheStatus, invalidateCache } from '@/libraries/lieux-cache';
import { withStaticBearerAuth } from '@/libraries/nextjs/route/middlewares/with-static-bearer-auth';

export const POST = routeBuilder()
  .use(withStaticBearerAuth(serverEnv.CACHE_RESET_TOKEN))
  .handle(async () => {
    const before = getCacheStatus();
    try {
      await invalidateCache();
    } catch (error) {
      errorReporter.captureException({
        error: error instanceof Error ? error : new Error(String(error)),
        attributes: { 'cache.operation': 'invalidate' }
      });
      logger.log({
        level: 'error',
        event: 'lieux-cache.reset',
        error: error instanceof Error ? error : new Error(String(error)),
        attributes: { 'cache.instance_id': before.instanceId, 'cache.pid': before.pid, 'cache.outcome': 'failed' }
      });
      return new Response('cache reset failed', { status: 503 });
    }
    const after = getCacheStatus();
    logger.log({
      level: 'info',
      event: 'lieux-cache.reset',
      attributes: {
        'cache.instance_id': after.instanceId,
        'cache.pid': after.pid,
        'cache.outcome': 'ok',
        'cache.size_before': before.size ?? 0,
        'cache.size_after': after.size ?? 0,
        'cache.build_count': after.buildCount,
        'cache.refreshed_at': after.lastRefreshedAt ?? ''
      }
    });
    revalidateTag('lieux', { expire: 0 });
    return Response.json({ status: 'cache reset', cache: after });
  });
