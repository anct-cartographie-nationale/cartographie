'use client';

import type { MouseEvent, ReactNode } from 'react';
import { useRouter } from '@/libraries/nextjs/shim';
import { ButtonLink, type ButtonLinkProps } from './button-link';

export const BackButtonLink = ({ onClick, ...props }: ButtonLinkProps): ReactNode => {
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

  return <ButtonLink {...props} onClick={handleClick} />;
};
