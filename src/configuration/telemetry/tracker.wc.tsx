'use client';

import { initMatomoBrowser, matomoBrowserPageView } from '@arckit/telemetry/event-tracker';
import { useLocation } from '@tanstack/react-router';
import { useEffect } from 'react';
import { inject } from '@/libraries/injection';
import { TRACKER_CONFIG } from './tracker-config.key';

const trackPageView = matomoBrowserPageView();

export const Tracker = (): null => {
  const config = inject(TRACKER_CONFIG);
  const url = useLocation({ select: (location) => location.pathname + location.searchStr });

  useEffect(() => {
    initMatomoBrowser({ url: config?.url, siteId: config?.siteId, disableCookies: true });
    trackPageView(url);
  }, [config, url]);

  return null;
};
