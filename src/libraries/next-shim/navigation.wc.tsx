'use client';

import { useMemo } from 'react';
import { useLocation, useSearch } from 'wouter';

export const useSearchParams = (): URLSearchParams => {
  const search = useSearch();
  return useMemo(() => new URLSearchParams(search), [search]);
};

export const useRouter = () => {
  const [, setLocation] = useLocation();

  return useMemo(
    () => ({
      push: (url: string) => setLocation(url),
      refresh: () => globalThis.location.reload()
    }),
    [setLocation]
  );
};
