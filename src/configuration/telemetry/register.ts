import { initMatomoBrowser, matomoBrowserPageView } from '@arckit/telemetry/event-tracker';
import { clientEnv } from '@/env.client';

const trackPageView = matomoBrowserPageView();

export const register = (): void => {
  initMatomoBrowser({
    url: clientEnv.NEXT_PUBLIC_MATOMO_URL,
    siteId: clientEnv.NEXT_PUBLIC_MATOMO_SITE_ID,
    disableCookies: true
  });
  trackPageView();
};

export const onRouterTransition = (href: string): void => trackPageView(href);
