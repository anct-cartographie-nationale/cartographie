'use client';

import { useLocation } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { inject } from '@/libraries/injection';
import { MATOMO_CONFIG } from './matomo-config.key';

declare global {
  interface Window {
    _paq?: Array<unknown[]>;
  }
}

export const MatomoTracker = () => {
  const config = inject(MATOMO_CONFIG);
  const location = useLocation();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!config?.url || !config?.siteId) return;

    window._paq = window._paq ?? [];
    const _paq = window._paq;

    if (!isInitialized.current) {
      _paq.push(['disableCookies']);
      _paq.push(['setTrackerUrl', `${config.url}/matomo.php`]);
      _paq.push(['setSiteId', config.siteId]);
      _paq.push(['enableLinkTracking']);

      const script = document.createElement('script');
      script.async = true;
      script.src = `${config.url}/matomo.js`;
      document.head.appendChild(script);

      isInitialized.current = true;
    }

    _paq.push(['setCustomUrl', location.pathname + location.search]);
    _paq.push(['trackPageView']);
  }, [config, location.pathname, location.search]);

  return null;
};
