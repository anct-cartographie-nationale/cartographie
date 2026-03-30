'use client';

import { trackAppRouter } from '@socialgouv/matomo-next';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { clientEnv } from '@/env.client';

const MatomoAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!clientEnv.NEXT_PUBLIC_MATOMO_URL || !clientEnv.NEXT_PUBLIC_MATOMO_SITE_ID) return;

    trackAppRouter({
      url: clientEnv.NEXT_PUBLIC_MATOMO_URL,
      siteId: clientEnv.NEXT_PUBLIC_MATOMO_SITE_ID,
      pathname,
      searchParams,
      disableCookies: true,
      useProxy: false
    });
  }, [pathname, searchParams]);

  return null;
};

export const MatomoTracker = () => (
  <Suspense fallback={null}>
    <MatomoAnalytics />
  </Suspense>
);
