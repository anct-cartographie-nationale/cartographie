'use client';

import { Link as TanStackLink } from '@tanstack/react-router';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

export type LinkProps = {
  href: string;
  scroll?: boolean;
  children?: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

export const Link = ({ href, scroll = true, children, target, ...props }: LinkProps) => (
  <TanStackLink to={href} resetScroll={scroll} {...(target != null ? { target } : {})} {...props}>
    {children}
  </TanStackLink>
);

export default Link;
