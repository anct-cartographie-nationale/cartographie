import {
  onRouterTransitionStart as captureRouterTransitionStart,
  register as registerErrorReporter
} from '@/configuration/telemetry/error-reporter/client';
import { register as registerEventTracker, trackPageView } from '@/configuration/telemetry/event-tracker/register';

registerErrorReporter();
registerEventTracker();

export const onRouterTransitionStart = (url: string, navigationType: 'push' | 'replace' | 'traverse'): void => {
  captureRouterTransitionStart(url, navigationType);
  trackPageView(url);
};
