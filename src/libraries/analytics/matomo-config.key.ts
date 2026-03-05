import { key } from 'piqure';

export type MatomoConfig = {
  url?: string | undefined;
  siteId?: string | undefined;
};

export const MATOMO_CONFIG = key<MatomoConfig>('matomo-config');
