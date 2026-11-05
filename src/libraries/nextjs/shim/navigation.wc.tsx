'use client';

import { useLocation, useNavigate, useSearch, useRouter as useTanStackRouter } from '@tanstack/react-router';
import { useMemo } from 'react';
import { splitHref } from '../split-href';

export const usePathname = (): string => {
  const location = useLocation();
  return location.pathname;
};

export const useSearchParams = (): URLSearchParams => {
  const search = useSearch({ strict: false });
  return useMemo(() => new URLSearchParams(search), [search]);
};

export const useRouter = () => {
  const navigate = useNavigate();
  const router = useTanStackRouter();

  return useMemo(
    () => ({
      push: (url: string, _options?: { scroll?: boolean }) => navigate(splitHref(url)),
      replace: (url: string, _options?: { scroll?: boolean }) => navigate({ ...splitHref(url), replace: true }),
      back: () => router.history.back(),
      canGoBack: () => router.history.canGoBack(),
      refresh: () => router.invalidate()
    }),
    [navigate, router]
  );
};
