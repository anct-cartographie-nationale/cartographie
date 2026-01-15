'use client';

import { Link as TanStackLink } from '@tanstack/react-router';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

export type LinkProps = {
  href: string;
  children?: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

export const Link = ({ href, children, ...props }: LinkProps) => (
  <TanStackLink to={href} {...props}>
    {children}
  </TanStackLink>
);

export default Link;
