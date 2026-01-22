'use client';

import { useLocation, useNavigate, useSearch, useRouter as useTanStackRouter } from '@tanstack/react-router';
import { useMemo } from 'react';

export const usePathname = (): string => {
  const location = useLocation();
  return location.pathname;
};

export const useSearchParams = (): URLSearchParams => {
  const search = useSearch({ strict: false });
  return useMemo(() => new URLSearchParams(search as Record<string, string>), [search]);
};

export const useRouter = () => {
  const navigate = useNavigate();
  const router = useTanStackRouter();

  return useMemo(
    () => ({
      push: (url: string) => navigate({ to: url }),
      refresh: () => router.invalidate()
    }),
    [navigate, router]
  );
};
