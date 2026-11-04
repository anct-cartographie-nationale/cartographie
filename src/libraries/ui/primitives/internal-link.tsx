import type { ButtonClass } from '@arckit/daisyui/primitives';
import type { HTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from '@/libraries/nextjs/shim';
import { cn } from '@/libraries/utils';

export const renderInternalLink = (props: { href: string; children: ReactNode; className?: string; title?: string }) => (
  <Link prefetch={false} {...props} />
);

export type InternalButtonLinkProps = ButtonClass & LinkProps & HTMLAttributes<HTMLAnchorElement>;

export const InternalButtonLink = ({
  className,
  color,
  kind,
  behavior,
  scale,
  modifier,
  ...props
}: InternalButtonLinkProps) => (
  <Link prefetch={false} className={cn('btn', color, kind, behavior, scale, modifier, className)} {...props} />
);
