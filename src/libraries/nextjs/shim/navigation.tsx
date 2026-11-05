'use client';

import { useRouter as useNextRouter } from 'next/navigation';
import { useMemo } from 'react';
import { hasNavigatedWithinApp } from '../has-navigated-within-app';

export { usePathname, useSearchParams } from 'next/navigation';

export const useRouter = () => {
  const router = useNextRouter();

  return useMemo(
    () => ({
      ...router,
      canGoBack: () => {
        const documentEntry = performance.getEntriesByType('navigation')[0];
        return hasNavigatedWithinApp(documentEntry?.name, window.location.href);
      },
      refresh: () => {
        router.replace(`${window.location.pathname}${window.location.search}`, { scroll: false });
        router.refresh();
      }
    }),
    [router]
  );
};
