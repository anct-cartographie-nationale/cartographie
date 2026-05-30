import { key } from 'piqure';

export type TrackerConfig = {
  url?: string | undefined;
  siteId?: string | undefined;
};

export const TRACKER_CONFIG = key<TrackerConfig>('tracker-config');
