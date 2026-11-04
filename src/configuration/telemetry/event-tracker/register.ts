import { initMatomoBrowser, matomoBrowserPageView } from '@arckit/telemetry/event-tracker';
import { clientEnv } from '@/env.client';
import { withoutAutourParamsInUrl } from '@/libraries/inclusion-numerique-api/filters/autour';

const pageView = matomoBrowserPageView();

export const trackPageView = (url: string = window.location.href) => pageView(withoutAutourParamsInUrl(url));

export const register = (): void => {
  initMatomoBrowser({
    url: clientEnv.NEXT_PUBLIC_MATOMO_URL,
    siteId: clientEnv.NEXT_PUBLIC_MATOMO_SITE_ID,
    disableCookies: true
  });
  trackPageView();
};
