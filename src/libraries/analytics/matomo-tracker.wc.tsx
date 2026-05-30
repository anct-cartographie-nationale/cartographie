'use client';

import { initMatomoBrowser, matomoBrowserEventTracker } from '@arckit/telemetry/event-tracker';
import { useLocation } from '@tanstack/react-router';
import { useEffect } from 'react';
import { inject } from '@/libraries/injection';
import { MATOMO_CONFIG } from './matomo-config.key';

const tracker = matomoBrowserEventTracker();

export const MatomoTracker = (): null => {
  const config = inject(MATOMO_CONFIG);
  const url = useLocation({ select: (location) => location.pathname + location.searchStr });

  useEffect(() => {
    if (!config?.url || !config?.siteId) return;
    initMatomoBrowser({ url: config.url, siteId: config.siteId, disableCookies: true });
    tracker.page({ name: document.title, properties: { url } });
  }, [config, url]);

  return null;
};
