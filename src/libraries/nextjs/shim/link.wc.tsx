'use client';

import { Link as TanStackLink } from '@tanstack/react-router';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { splitHref } from '../split-href';

export type LinkProps = {
  href: string;
  scroll?: boolean;
  children?: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

export const Link = ({ href, scroll: _scroll, children, target, ...props }: LinkProps) => (
  <TanStackLink {...splitHref(href)} {...(target != null ? { target } : {})} {...props}>
    {children}
  </TanStackLink>
);

export default Link;
