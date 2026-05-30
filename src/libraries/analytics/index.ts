import { matomoBrowserEventTracker } from '@arckit/telemetry/event-tracker';

export type { MatomoConfig } from './matomo-config.key';
export { MATOMO_CONFIG } from './matomo-config.key';
export { MatomoTracker } from './matomo-tracker';
export type { MatomoActionType, MatomoCategoryType } from './tracking/events';
export { MatomoAction, MatomoCategory } from './tracking/events';

type TrackEventProps =
  | { category: string; action: string; name?: never; value?: never }
  | { category: string; action: string; name: string; value?: never }
  | { category: string; action: string; name: string; value: number };

const tracker = matomoBrowserEventTracker();

export const trackEvent = ({ category, action, name, value }: TrackEventProps): void => {
  tracker.track({
    event: `${category} ${action}`,
    properties: { ...(name != null ? { name } : {}), ...(value != null ? { value } : {}) }
  });
};
