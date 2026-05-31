import { register as registerErrorReporter } from '@/configuration/telemetry/error-reporter/client';
import { register as registerEventTracker } from '@/configuration/telemetry/event-tracker/register';

export { onRouterTransition } from '@/configuration/telemetry/event-tracker/register';

registerErrorReporter();
registerEventTracker();
