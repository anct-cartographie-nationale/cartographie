'use client';

import type { MouseEvent, ReactNode } from 'react';
import { useRouter } from '@/libraries/nextjs/shim';
import { InternalButtonLink, type InternalButtonLinkProps } from './internal-link';

export const BackButtonLink = ({ onClick, ...props }: InternalButtonLinkProps): ReactNode => {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const hasNavigatedInternally = navEntry != null && navEntry.name !== window.location.href;

    if (hasNavigatedInternally) {
      e.preventDefault();
      router.back();
    }

    onClick?.(e);
  };

  return <InternalButtonLink {...props} onClick={handleClick} />;
};
