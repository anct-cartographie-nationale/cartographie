'use client';

import type { MouseEvent, ReactNode } from 'react';
import { hasNavigatedWithinApp } from '@/libraries/nextjs';
import { useRouter } from '@/libraries/nextjs/shim';
import { InternalButtonLink, type InternalButtonLinkProps } from './internal-link';

export const BackButtonLink = ({ onClick, ...props }: InternalButtonLinkProps): ReactNode => {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;

    if (hasNavigatedWithinApp(navEntry?.name, window.location.href)) {
      e.preventDefault();
      router.back();
    }

    onClick?.(e);
  };

  return <InternalButtonLink {...props} onClick={handleClick} />;
};
