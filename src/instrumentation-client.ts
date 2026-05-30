import { initMatomoBrowser, matomoBrowserEventTracker } from '@arckit/telemetry/event-tracker';
import { clientEnv } from '@/env.client';

declare global {
  interface Window {
    _paq?: Array<unknown[]>;
  }
}

const url = clientEnv.NEXT_PUBLIC_MATOMO_URL;
const siteId = clientEnv.NEXT_PUBLIC_MATOMO_SITE_ID;

const tracker = matomoBrowserEventTracker();
let previousUrl = '';

const toRelative = (href: string): string => {
  const parsed = new URL(href, location.origin);
  return parsed.pathname + parsed.search;
};

const trackPage = (pageUrl: string): void => {
  tracker.page({ name: document.title, properties: { url: pageUrl } });
  previousUrl = pageUrl;
};

if (url && siteId) {
  initMatomoBrowser({ url, siteId, disableCookies: true });
  trackPage(location.pathname + location.search);
}

export function onRouterTransition(href: string): void {
  const pageUrl = toRelative(href);
  if (pageUrl === previousUrl) return;
  if (previousUrl) window._paq?.push(['setReferrerUrl', previousUrl]);
  trackPage(pageUrl);
}
