'use client';

import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, useMemo } from 'react';

type UseQueryStateOptions = {
  defaultValue?: string;
};

type SetQueryStateValue = string | ((prev: string) => string) | null;

export const useQueryState = (
  key: string,
  options: UseQueryStateOptions = {}
): [string, (value: SetQueryStateValue) => Promise<URLSearchParams>] => {
  const search = useSearch({ strict: false }) as Record<string, string>;
  const navigate = useNavigate();

  const value = useMemo(() => search?.[key] ?? options.defaultValue ?? '', [search, key, options.defaultValue]);

  const setValue = useCallback(
    async (newValue: SetQueryStateValue): Promise<URLSearchParams> => {
      const resolvedValue: string | null = typeof newValue === 'function' ? newValue(value) : newValue;

      await navigate({
        search: (prev: Record<string, string>) => ({
          ...prev,
          [key]: resolvedValue || undefined
        }),
        replace: true
      } as Parameters<typeof navigate>[0]);

      const newParams = new URLSearchParams(search);
      if (resolvedValue) newParams.set(key, resolvedValue);
      else newParams.delete(key);

      return newParams;
    },
    [navigate, key, value, search]
  );

  return [value, setValue];
};
