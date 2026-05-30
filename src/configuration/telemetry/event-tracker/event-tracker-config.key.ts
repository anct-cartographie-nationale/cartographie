import { key } from 'piqure';

export type EventTrackerConfig = {
  url?: string | undefined;
  siteId?: string | undefined;
};

export const EVENT_TRACKER_CONFIG = key<EventTrackerConfig>('tracker-config');
