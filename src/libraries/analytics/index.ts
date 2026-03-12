import { sendEvent } from '@socialgouv/matomo-next';
import { clientEnv } from '@/env.client';

export type { MatomoConfig } from './matomo-config.key';
export { MATOMO_CONFIG } from './matomo-config.key';
export { MatomoTracker } from './matomo-tracker';
export type { MatomoActionType, MatomoCategoryType } from './tracking/events';
export { MatomoAction, MatomoCategory } from './tracking/events';

type TrackEventProps =
  | { category: string; action: string; name?: never; value?: never }
  | { category: string; action: string; name: string; value?: never }
  | { category: string; action: string; name: string; value: number };

export const trackEvent = (props: TrackEventProps): void => {
  if (!clientEnv.NEXT_PUBLIC_MATOMO_URL) return;
  sendEvent(props);
};
