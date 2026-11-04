'use client';

import { useLocation, useNavigate, useSearch, useRouter as useTanStackRouter } from '@tanstack/react-router';
import { useMemo } from 'react';

type NavigateOptions = { scroll?: boolean };

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
      push: (url: string, options?: NavigateOptions) => navigate({ to: url, resetScroll: options?.scroll ?? true }),
      replace: (url: string, options?: NavigateOptions) =>
        navigate({ to: url, replace: true, resetScroll: options?.scroll ?? true }),
      back: () => window.history.back(),
      refresh: () => router.invalidate()
    }),
    [navigate, router]
  );
};
