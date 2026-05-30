import { initMatomoBrowser } from '@arckit/telemetry/event-tracker';
import { clientEnv } from '@/env.client';
import { eventTracker } from './event-tracker';

declare global {
  interface Window {
    _paq?: Array<unknown[]>;
  }
}

let previousUrl = '';

const trackPage = (url: string): void => {
  if (url === previousUrl) return;
  if (previousUrl) window._paq?.push(['setReferrerUrl', previousUrl]);
  eventTracker.page({ name: document.title, properties: { url } });
  previousUrl = url;
};

export const register = (): void => {
  const { NEXT_PUBLIC_MATOMO_URL: url, NEXT_PUBLIC_MATOMO_SITE_ID: siteId } = clientEnv;
  if (!url || !siteId) return;
  initMatomoBrowser({ url, siteId, disableCookies: true });
  trackPage(location.pathname + location.search);
};

export const onRouterTransition = (href: string): void => {
  const { pathname, search } = new URL(href, location.origin);
  trackPage(pathname + search);
};
