import { inject } from '@/libraries/injection';
import { MATOMO_CONFIG } from './matomo-config.key';

export type { MatomoConfig } from './matomo-config.key';
export { MATOMO_CONFIG } from './matomo-config.key';
export { MatomoTracker } from './matomo-tracker';
export type { MatomoActionType, MatomoCategoryType } from './tracking/events';
export { MatomoAction, MatomoCategory } from './tracking/events';

declare global {
  interface Window {
    _paq?: Array<unknown[]>;
  }
}

type TrackEventProps =
  | { category: string; action: string; name?: never; value?: never }
  | { category: string; action: string; name: string; value?: never }
  | { category: string; action: string; name: string; value: string };

export const trackEvent = (props: TrackEventProps): void => {
  const config = inject(MATOMO_CONFIG);
  if (!config?.url || !config?.siteId) return;

  window._paq = window._paq ?? [];
  const args: unknown[] = ['trackEvent', props.category, props.action];
  if (props.name != null) args.push(props.name);
  if ('value' in props && props.value != null) args.push(props.value);
  window._paq.push(args);
};
