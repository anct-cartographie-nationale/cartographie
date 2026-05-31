import { register as registerErrorReporter } from '@/configuration/telemetry/error-reporter/server';

export { onRequestError } from '@/configuration/telemetry/error-reporter/server';

export async function register() {
  registerErrorReporter();
  if (process.env['NEXT_RUNTIME'] === 'nodejs') {
    const { getAllLieux } = await import('@/libraries/lieux-cache');
    await getAllLieux();
  }
}
