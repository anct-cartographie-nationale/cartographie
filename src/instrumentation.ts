import { register as registerErrorReporter } from '@/configuration/telemetry/error-reporter/server';

export { onRequestError } from '@/configuration/telemetry/error-reporter/server';

export async function register() {
  registerErrorReporter();
  if (process.env['NEXT_RUNTIME'] === 'nodejs') {
    const { getAllLieux } = await import('@/libraries/lieux-cache');
    try {
      await getAllLieux();
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
