import NextLink, { type LinkProps as NextLinkProps } from 'next/link';
import type { HTMLAttributeAnchorTarget, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/libraries/utils';
import type { Color } from './color';

export type LinkClass<Prefix extends `${string}link` = 'link'> = {
  color?: `${Prefix}-${Color}` | 'none';
  kind?: `${Prefix}-${'hover'}` | 'none';
};

export type LinkProps = NextLinkProps &
  LinkClass & {
    icon?: ReactNode;
    iconOnly?: boolean;
    target?: HTMLAttributeAnchorTarget;
  } & HTMLAttributes<HTMLAnchorElement>;

export const Link = ({ className, children, target, icon, iconOnly, color, kind, ...props }: LinkProps) => (
  <NextLink
    className={cn('link', color !== 'none' && color, kind !== 'none' && kind, className)}
    target={target}
    rel={target === '_blank' ? 'noopener noreferrer' : undefined}
    title={iconOnly && typeof children === 'string' ? children : undefined}
    {...props}
  >
    {icon && icon}
    {children && !iconOnly && children}
  </NextLink>
);
