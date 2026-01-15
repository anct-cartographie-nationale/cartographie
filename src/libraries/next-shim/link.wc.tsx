'use client';

import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Link as WouterLink } from 'wouter';

export type LinkProps = {
  href: string;
  children?: ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export const Link = WouterLink;
export default WouterLink;
