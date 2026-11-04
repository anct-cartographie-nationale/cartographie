'use client';

import type { ComponentProps, ReactNode } from 'react';
import { Link } from '@/libraries/ui/primitives/link';
import { cn } from '@/libraries/utils';
import { useLieuHighlight } from '@/shared/hooks/use-lieu-highlight';
import { LieuCard } from './lieu-card';

type LieuListLinkProps = {
  id: string;
  href: string;
  lieu: Omit<ComponentProps<typeof LieuCard>, 'size' | 'className'>;
  size: 'md' | 'lg';
};

export const LieuListLink = ({ id, href, lieu, size }: LieuListLinkProps): ReactNode => {
  const { isHighlighted, handlers } = useLieuHighlight(id);

  return (
    <Link className='no-underline' href={href} prefetch={false} {...handlers}>
      <LieuCard
        className={cn('hover:bg-base-300 h-full', isHighlighted && 'bg-base-300 ring-2 ring-primary')}
        {...lieu}
        size={size}
      />
    </Link>
  );
};
