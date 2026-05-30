'use client';

import { initMatomoBrowser } from '@arckit/telemetry/event-tracker';
import { useLocation } from '@tanstack/react-router';
import { useEffect } from 'react';
import { inject } from '@/libraries/injection';
import { eventTracker } from './event-tracker';
import { TRACKER_CONFIG } from './tracker-config.key';

export const Tracker = (): null => {
  const config = inject(TRACKER_CONFIG);
  const url = useLocation({ select: (location) => location.pathname + location.searchStr });

  useEffect(() => {
    if (!config?.url || !config?.siteId) return;
    initMatomoBrowser({ url: config.url, siteId: config.siteId, disableCookies: true });
    eventTracker.page({ name: document.title, properties: { url } });
  }, [config, url]);

  return null;
};
