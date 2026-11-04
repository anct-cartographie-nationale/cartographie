'use client';

import { initMatomoBrowser, matomoBrowserPageView } from '@arckit/telemetry/event-tracker';
import { useLocation } from '@tanstack/react-router';
import { useEffect } from 'react';
import { inject } from '@/libraries/injection';
import { EVENT_TRACKER_CONFIG } from './event-tracker-config.key';

const trackPageView = matomoBrowserPageView();

export const EventTracker = (): null => {
  const config = inject(EVENT_TRACKER_CONFIG);
  const url = useLocation({ select: (location) => location.pathname + location.searchStr });

  useEffect(() => {
    initMatomoBrowser({ url: config?.url, siteId: config?.siteId, disableCookies: true });
    trackPageView(url);
  }, [config, url]);

  return null;
};
