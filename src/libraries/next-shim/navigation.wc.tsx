'use client';

import { useNavigate, useSearch } from '@tanstack/react-router';
import { useMemo } from 'react';

export const useSearchParams = (): URLSearchParams => {
  const search = useSearch({ strict: false });
  return useMemo(() => new URLSearchParams(search as Record<string, string>), [search]);
};

export const useRouter = () => {
  const navigate = useNavigate();

  return useMemo(
    () => ({
      push: (url: string) => navigate({ to: url }),
      refresh: () => globalThis.location.reload()
    }),
    [navigate]
  );
};
