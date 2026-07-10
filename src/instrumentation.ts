import { register as registerErrorReporter } from '@/configuration/telemetry/error-reporter/server';

export { onRequestError } from '@/configuration/telemetry/error-reporter/server';

export async function register() {
  registerErrorReporter();
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { getAllLieux, getCacheStatus } = await import('@/libraries/lieux-cache');
    try {
      await getAllLieux();
      const { logger } = await import('@/configuration/telemetry/logger/server');
      const status = getCacheStatus();
      logger.log({
        level: 'info',
        event: 'lieux-cache.warm',
        attributes: {
          'cache.instance_id': status.instanceId,
          'cache.pid': status.pid,
          'cache.size': status.size ?? 0,
          'cache.built_at': status.storeBuiltAt ?? '',
          'cache.build_count': status.buildCount
        }
      });
    } catch (error) {
      const { errorReporter } = await import('@/configuration/telemetry/error-reporter');
      errorReporter.captureException({
        error: error instanceof Error ? error : new Error(String(error)),
        level: 'fatal',
        attributes: { 'startup.phase': 'cache-warm' }
      });
      throw error;
    }
  }
}
