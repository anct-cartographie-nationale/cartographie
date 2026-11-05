'use client';

import { useRouter as useNextRouter } from 'next/navigation';
import { useMemo } from 'react';

export { usePathname, useSearchParams } from 'next/navigation';

export const useRouter = () => {
  const router = useNextRouter();

  return useMemo(
    () => ({
      ...router,
      refresh: () => router.replace(`${window.location.pathname}${window.location.search}`, { scroll: false })
    }),
    [router]
  );
};
